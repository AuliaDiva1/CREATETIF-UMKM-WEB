'use client';

import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { X, CheckCircle, AlertTriangle, Loader } from 'lucide-react'; 

// Menggunakan Environment Variable sesuai permintaan
const API_URL = typeof process.env.NEXT_PUBLIC_API_URL !== 'undefined' ? process.env.NEXT_PUBLIC_API_URL : 'http://localhost:8000/api';

// Daftar opsi STATUS untuk dropdown (sesuai kebutuhan proyek)
const STATUS_OPTIONS = [
  { value: 'Pending Review', label: 'Pending Review' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' },
];

/**
 * Konversi tanggal dari format API (misalnya 2023-12-01 10:00:00) ke format input date (YYYY-MM-DD).
 * @param {string | null | undefined} dateString
 * @returns {string}
 */
const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
        // Hanya ambil bagian YYYY-MM-DD
        return dateString.split(' ')[0];
    } catch (e) {
        return '';
    }
};

const ProjekForm = ({ isOpen, onClose, data, onSuccess }) => {
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [clientError, setClientError] = useState(null);
  const [message, setMessage] = useState(null); // State untuk pesan feedback (sukses/gagal)

  // Efek untuk memuat daftar klien dari API '/master-klien'
  useEffect(() => {
    if (!isOpen) return;

    const fetchClients = async () => {
      setLoadingClients(true);
      setClientError(null);
      try {
        // Mengambil data klien dari endpoint '/master-klien'
        const response = await axios.get(`${API_URL}/master-klien`); 
        setClients(response.data);
      } catch (err) {
        console.error('Gagal memuat daftar klien:', err);
        setClientError('Gagal memuat daftar klien. Pastikan API berjalan dan endpoint /api/master-klien tersedia.');
      } finally {
        setLoadingClients(false);
      }
    };

    fetchClients();
  }, [isOpen]);

  if (!isOpen) return null;

  // Cek apakah mode Edit atau Tambah Baru
  const isEditMode = !!data?.PROJEK_ID;

  // Nilai awal form (menggunakan nama field sesuai tabel transaksi_projek)
  const initialValues = {
    // KLIEN_ID harus diubah ke string untuk Field select Formik
    klien_id: data?.KLIEN_ID?.toString() || '', 
    nama_projek: data?.NAMA_PROJEK || '',
    deskripsi: data?.DESKRIPSI || '',
    status: data?.STATUS || 'Pending Review',
    progress: data?.PROGRESS?.toString() || '0', 
    nilai_projek: data?.NILAI_PROJEK?.toString() || '',
    tanggal_mulai: formatDateForInput(data?.TANGGAL_MULAI) || '',
    tanggal_selesai: formatDateForInput(data?.TANGGAL_SELESAI) || '',
  };

  // Schema Validasi dengan Yup
  const validationSchema = Yup.object({
    klien_id: Yup.string().required('Klien wajib dipilih'),
    nama_projek: Yup.string().required('Nama Proyek wajib diisi').max(200, 'Nama Proyek maksimal 200 karakter'),
    deskripsi: Yup.string().nullable(),
    status: Yup.string().oneOf(STATUS_OPTIONS.map(o => o.value), 'Status tidak valid').required('Status wajib diisi'),
    progress: Yup.number()
        .typeError('Progress harus berupa angka')
        .min(0, 'Progress minimal 0')
        .max(100, 'Progress maksimal 100')
        .required('Progress wajib diisi'),
    nilai_projek: Yup.number()
        .typeError('Nilai Proyek harus berupa angka')
        .min(0, 'Nilai Proyek tidak boleh negatif')
        .nullable(),
    tanggal_mulai: Yup.date().required('Tanggal Mulai wajib diisi'),
    tanggal_selesai: Yup.date()
        .nullable()
        .min(Yup.ref('tanggal_mulai'), 'Tanggal Selesai tidak boleh mendahului Tanggal Mulai')
        .test(
            'is-future-date',
            'Tanggal Selesai harus setelah Tanggal Mulai (jika diisi)',
            function(value) {
                const { tanggal_mulai } = this.parent;
                if (tanggal_mulai && value) {
                    return new Date(value) >= new Date(tanggal_mulai);
                }
                return true;
            }
        ),
  });

  const handleSubmit = async (values, actions) => {
    setMessage(null); // Bersihkan pesan sebelumnya
    
    // Konversi nilai ke tipe data yang sesuai untuk API
    const payload = {
        ...values,
        klien_id: parseInt(values.klien_id), // KLIEN_ID harus number
        progress: parseInt(values.progress), // PROGRESS harus number
        // NILAI_PROJEK dikirim sebagai null jika kosong, atau float jika ada isinya
        nilai_projek: values.nilai_projek ? parseFloat(values.nilai_projek) : null,
    };

    try {
      if (isEditMode) {
        // --- LOGIKA EDIT ---
        // Endpoint: PUT ${API_URL}/transaksi-projek/{PROJEK_ID}
        await axios.put(`${API_URL}/transaksi-projek/${data.PROJEK_ID}`, payload);
        setMessage({ type: 'success', text: 'Data proyek berhasil diperbarui!' });
      } else {
        // --- LOGIKA TAMBAH ---
        // Endpoint: POST ${API_URL}/transaksi-projek
        await axios.post(`${API_URL}/transaksi-projek`, payload);
        setMessage({ type: 'success', text: 'Proyek baru berhasil ditambahkan!' });
      }

      // Refresh data di parent component dan tutup modal setelah 1.5 detik
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
      
    } catch (err) {
      console.error('API Error:', err);
      // Detail error dari respons backend (jika ada)
      const msg = err.response?.data?.message || err.message || "Terjadi kesalahan saat menyimpan data.";
      setMessage({ type: 'error', text: `Gagal: ${msg}` });
    } finally {
      actions.setSubmitting(false);
    }
  };

  // Komponen pembantu untuk menampilkan status loading/error klien
  const ClientSelectField = () => {
    if (loadingClients) {
        return (
            <div className="flex items-center justify-center h-12 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-500">
                <Loader className="animate-spin w-4 h-4 mr-2" /> Memuat daftar Klien...
            </div>
        );
    }

    if (clientError) {
        return (
            <div className="flex items-center p-3 text-red-700 bg-red-100 rounded-lg text-sm border border-red-400">
                <AlertTriangle className="w-5 h-5 mr-2" /> {clientError}
            </div>
        );
    }

    return (
        <Field
            as="select"
            id="klien_id"
            name="klien_id"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition duration-150"
        >
            <option value="">-- Pilih Klien --</option>
            {clients.map(client => (
                // Asumsi data klien memiliki KLIEN_ID (number) dan NAMA (string)
                <option key={client.KLIEN_ID} value={client.KLIEN_ID.toString()}>
                    {client.NAMA}
                </option>
            ))}
        </Field>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="relative bg-white p-6 rounded-xl shadow-2xl transition-all duration-300 transform scale-100 mx-4 my-8" style={{ minWidth: '95vw', maxWidth: '800px' }}>
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <h3 className="text-xl font-extrabold text-blue-800">
            {isEditMode ? `Edit Proyek: ${data?.NAMA_PROJEK}` : 'Tambah Proyek Baru'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-600 font-bold text-2xl transition">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Feedback Message */}
        {message && (
            <div className={`flex items-center p-3 mt-4 rounded-lg shadow-md ${message.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}>
                {message.type === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : <AlertTriangle className="w-5 h-5 mr-2" />}
                <p className="font-medium text-sm">{message.text}</p>
            </div>
        )}

        {/* Body Form */}
        <div className="py-6">
          <Formik 
            initialValues={initialValues} 
            validationSchema={validationSchema} 
            onSubmit={handleSubmit}
            enableReinitialize={!loadingClients} // Re-initialize setelah klien dimuat
          >
            {({ isSubmitting }) => (
              <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Kolom Kiri */}
                <div className="col-span-1">
                    {/* KLIEN_ID (Dropdown) */}
                    <div className="mb-4">
                        <label htmlFor="klien_id" className="block text-sm font-semibold text-gray-700">Klien Proyek <span className="text-red-500">*</span></label>
                        <ClientSelectField />
                        <ErrorMessage name="klien_id" component="small" className="text-red-500 text-xs mt-1 block" />
                    </div>

                    {/* NAMA_PROJEK */}
                    <div className="mb-4">
                        <label htmlFor="nama_projek" className="block text-sm font-semibold text-gray-700">Nama Proyek <span className="text-red-500">*</span></label>
                        <Field
                            id="nama_projek"
                            name="nama_projek"
                            type="text"
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                            placeholder="Contoh: Website Company Profile"
                        />
                        <ErrorMessage name="nama_projek" component="small" className="text-red-500 text-xs mt-1 block" />
                    </div>

                    {/* DESKRIPSI */}
                    <div className="mb-4">
                        <label htmlFor="deskripsi" className="block text-sm font-semibold text-gray-700">Deskripsi Proyek</label>
                        <Field
                            as="textarea"
                            id="deskripsi"
                            name="deskripsi"
                            rows="4"
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                            placeholder="Detail singkat tentang proyek..."
                        />
                        <ErrorMessage name="deskripsi" component="small" className="text-red-500 text-xs mt-1 block" />
                    </div>
                </div>

                {/* Kolom Kanan */}
                <div className="col-span-1">
                    {/* NILAI_PROJEK */}
                    <div className="mb-4">
                        <label htmlFor="nilai_projek" className="block text-sm font-semibold text-gray-700">Nilai Proyek (Rp)</label>
                        <div className="flex items-center mt-1">
                            <span className="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg text-sm">
                                Rp
                            </span>
                            <Field
                                id="nilai_projek"
                                name="nilai_projek"
                                type="number"
                                step="0.01"
                                className="flex-1 p-3 border border-gray-300 rounded-r-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                placeholder="Contoh: 7500000"
                            />
                        </div>
                        <ErrorMessage name="nilai_projek" component="small" className="text-red-500 text-xs mt-1 block" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* TANGGAL_MULAI */}
                        <div className="mb-4">
                            <label htmlFor="tanggal_mulai" className="block text-sm font-semibold text-gray-700">Tanggal Mulai <span className="text-red-500">*</span></label>
                            <Field
                                id="tanggal_mulai"
                                name="tanggal_mulai"
                                type="date"
                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                            />
                            <ErrorMessage name="tanggal_mulai" component="small" className="text-red-500 text-xs mt-1 block" />
                        </div>

                        {/* TANGGAL_SELESAI */}
                        <div className="mb-4">
                            <label htmlFor="tanggal_selesai" className="block text-sm font-semibold text-gray-700">Tanggal Target Selesai</label>
                            <Field
                                id="tanggal_selesai"
                                name="tanggal_selesai"
                                type="date"
                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                            />
                            <ErrorMessage name="tanggal_selesai" component="small" className="text-red-500 text-xs mt-1 block" />
                        </div>
                    </div>

                    {/* STATUS & PROGRESS */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* STATUS */}
                        <div className="mb-4">
                            <label htmlFor="status" className="block text-sm font-semibold text-gray-700">Status <span className="text-red-500">*</span></label>
                            <Field
                                as="select"
                                id="status"
                                name="status"
                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition duration-150"
                            >
                                {STATUS_OPTIONS.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name="status" component="small" className="text-red-500 text-xs mt-1 block" />
                        </div>

                        {/* PROGRESS */}
                        <div className="mb-4">
                            <label htmlFor="progress" className="block text-sm font-semibold text-gray-700">Progress (%) <span className="text-red-500">*</span></label>
                            <div className="flex items-center mt-1">
                                <Field
                                    id="progress"
                                    name="progress"
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500 text-center transition duration-150"
                                    placeholder="0 - 100"
                                />
                                <span className="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-l-0 border-gray-300 rounded-r-lg text-sm">
                                    %
                                </span>
                            </div>
                            <ErrorMessage name="progress" component="small" className="text-red-500 text-xs mt-1 block" />
                        </div>
                    </div>
                </div>

                {/* Footer Buttons (Full Width) */}
                <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                  <button 
                    type="button" 
                    onClick={onClose} 
                    className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150 shadow-sm"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting || loadingClients} 
                    className={`px-6 py-2 text-sm font-semibold text-white rounded-lg transition duration-150 shadow-md flex items-center justify-center ${isSubmitting || loadingClients ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    {isSubmitting ? (
                        <>
                            <Loader className="animate-spin w-4 h-4 mr-2" /> Menyimpan...
                        </>
                    ) : (
                        isEditMode ? 'Simpan Perubahan' : 'Tambah Proyek'
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ProjekForm;