'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { X, CheckCircle, AlertTriangle, Loader, Trash } from 'lucide-react'; 

// Menggunakan variabel yang benar: API_BASE_URL
// Pastikan variabel NEXT_PUBLIC_API_URL sudah terdefinisi di .env.local
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; 

// Daftar opsi STATUS untuk dropdown
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

// Asumsi token dibutuhkan. Ambil token dari localStorage di sini.
const getToken = () => {
    if (typeof window !== 'undefined') {
        // Pastikan nama key token di localStorage sudah benar
        return localStorage.getItem('token'); 
    }
    return null;
};

const ProjekFormModal = ({ isOpen, onClose, data, mode, onSuccess }) => {
    const [clients, setClients] = useState([]);
    const [loadingClients, setLoadingClients] = useState(true);
    const [clientError, setClientError] = useState(null);
    const [message, setMessage] = useState(null); // State untuk pesan feedback (sukses/gagal)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State untuk konfirmasi hapus
    
    // Cek mode & pastikan PROJEK_ID digunakan untuk penentuan mode edit
    const isEdit = mode === 'edit' || !!data?.PROJEK_ID;
    const token = getToken();

    // Efek untuk memuat daftar klien
    const fetchClients = useCallback(async () => {
        if (!token) {
            setClientError('Token otorisasi tidak ditemukan.');
            setLoadingClients(false);
            return;
        }

        setLoadingClients(true);
        setClientError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/master-klien`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Menggunakan res.data.data atau res.data, tergantung struktur API
            const clientData = response.data.data || response.data || [];

            // Pastikan klien memiliki KLIEN_ID dan NAMA
            setClients(clientData.filter(c => c.KLIEN_ID && c.NAMA));
        } catch (err) {
            console.error('Gagal memuat daftar klien:', err.response?.data || err.message);
            setClientError('Gagal memuat daftar klien. Mohon periksa koneksi API atau token.');
        } finally {
            setLoadingClients(false);
        }
    }, [token]);

    useEffect(() => {
        if (isOpen) {
            fetchClients();
            // Membersihkan pesan dan konfirmasi saat modal dibuka
            setMessage(null);
            setShowDeleteConfirm(false); 
        }
    }, [isOpen, fetchClients]);


    // Jika modal tidak terbuka, jangan render apapun
    if (!isOpen) return null;

    // Nilai awal form
    const initialValues = {
        klien_id: data?.KLIEN_ID?.toString() || '', 
        nama_projek: data?.NAMA_PROJEK || '',
        deskripsi: data?.DESKRIPSI || '',
        status: data?.STATUS || STATUS_OPTIONS[0].value, 
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
            .transform((value, originalValue) => (originalValue === '' ? undefined : value))
            .typeError('Progress harus berupa angka')
            .min(0, 'Progress minimal 0')
            .max(100, 'Progress maksimal 100')
            .required('Progress wajib diisi'),
        nilai_projek: Yup.number()
            .transform((value, originalValue) => (originalValue === '' ? undefined : value))
            .typeError('Nilai Proyek harus berupa angka')
            .min(0, 'Nilai Proyek tidak boleh negatif')
            .nullable(),
        tanggal_mulai: Yup.date().required('Tanggal Mulai wajib diisi'),
        tanggal_selesai: Yup.date()
            .nullable()
            .min(Yup.ref('tanggal_mulai'), 'Tanggal Selesai tidak boleh mendahului Tanggal Mulai')
    });

    const handleSubmit = async (values, actions) => {
        setMessage(null); 
        
        if (!token) {
            setMessage({ type: 'error', text: 'Gagal: Token otorisasi tidak ditemukan.' });
            actions.setSubmitting(false);
            return;
        }

        // Konstruksi payload dengan penamaan field yang benar
        const payload = {
            KLIEN_ID: parseInt(values.klien_id), 
            NAMA_PROJEK: values.nama_projek, 
            DESKRIPSI: values.deskripsi || null, 
            STATUS: values.status,
            PROGRESS: parseInt(values.progress), 
            NILAI_PROJEK: values.nilai_projek ? parseFloat(values.nilai_projek) : null, 
            TANGGAL_MULAI: values.tanggal_mulai, 
            TANGGAL_SELESAI: values.tanggal_selesai || null, 
        };

        console.log("Payload yang dikirim:", payload);
        console.log("Mode:", isEdit ? 'EDIT' : 'TAMBAH');

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            if (isEdit) {
                // LOGIKA EDIT (PUT - Mengganti PATCH)
                if (!data?.PROJEK_ID) {
                    setMessage({ type: 'error', text: 'Gagal: PROJEK_ID tidak ditemukan untuk mode edit.' });
                    actions.setSubmitting(false);
                    return;
                }
                const url = `${API_BASE_URL}/transaksi-projek/${data.PROJEK_ID}`;
                console.log("URL EDIT (PUT):", url);
                
                // 💡 PERUBAHAN DI SINI: Menggunakan axios.put
                await axios.put(url, payload, config); 
                setMessage({ type: 'success', text: 'Data proyek berhasil diperbarui!' });
            } else {
                // LOGIKA TAMBAH (POST)
                const url = `${API_BASE_URL}/transaksi-projek`;
                console.log("URL TAMBAH (POST):", url);
                await axios.post(url, payload, config);
                setMessage({ type: 'success', text: 'Proyek baru berhasil ditambahkan!' });
            }

            // Refresh data dan tutup modal
            setTimeout(() => {
                if (onSuccess) onSuccess();
                onClose();
            }, 1500);
            
        } catch (err) {
            const status = err.response?.status;
            const responseData = err.response?.data;
            
            console.error('API Error Status:', status);
            console.error('API Response Data:', responseData);
            
            let msg;
            
            if (responseData && responseData.message) {
                msg = responseData.message;
            } else if (status) {
                if (status === 401 || status === 403) {
                    msg = "Otorisasi Gagal (401/403). Token tidak valid.";
                } else if (status === 404) {
                    // 💡 Diperbarui untuk mencerminkan PUT/404
                    msg = "Endpoint API tidak ditemukan (404). Periksa URL atau metode (PUT/DELETE)."; 
                } else if (status === 400) {
                     msg = "Data yang dikirim tidak valid. Periksa format field.";
                } else {
                    msg = `Terjadi kesalahan saat menyimpan data (Status: ${status}).`;
                }
            } else {
                msg = err.message || "Terjadi kesalahan saat menyimpan data.";
            }
            
            setMessage({ type: 'error', text: `Gagal: ${msg}` });
        } finally {
            actions.setSubmitting(false);
        }
    };

    /**
     * FUNGSI Logika untuk menghapus proyek (DELETE)
     */
    const handleDelete = async () => {
        setMessage(null);
        setShowDeleteConfirm(false); // Tutup konfirmasi setelah klik Hapus
        
        if (!token) {
            setMessage({ type: 'error', text: 'Gagal: Token otorisasi tidak ditemukan.' });
            return;
        }

        if (!data?.PROJEK_ID) {
            setMessage({ type: 'error', text: 'Gagal: PROJEK_ID tidak ditemukan untuk operasi hapus.' });
            return;
        }

        const url = `${API_BASE_URL}/transaksi-projek/${data.PROJEK_ID}`;
        console.log("URL DELETE:", url);

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            await axios.delete(url, config);
            
            setMessage({ type: 'success', text: 'Proyek berhasil dihapus!' });

            // Refresh data dan tutup modal
            setTimeout(() => {
                if (onSuccess) onSuccess();
                onClose();
            }, 1500);

        } catch (err) {
            const status = err.response?.status;
            const responseData = err.response?.data;
            
            console.error('API Error Status (DELETE):', status);
            console.error('API Response Data (DELETE):', responseData);
            
            let msg;
            
            if (responseData && responseData.message) {
                msg = responseData.message;
            } else if (status) {
                if (status === 401 || status === 403) {
                    msg = "Otorisasi Gagal (401/403). Token tidak valid.";
                } else if (status === 404) {
                    msg = "Endpoint API tidak ditemukan (404) atau Proyek sudah terhapus.";
                } else {
                    msg = `Terjadi kesalahan saat menghapus data (Status: ${status}).`;
                }
            } else {
                msg = err.message || "Terjadi kesalahan koneksi saat menghapus data.";
            }
            
            setMessage({ type: 'error', text: `Gagal menghapus: ${msg}` });
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
                    // Menggunakan KLIEN_ID sebagai value
                    <option key={client.KLIEN_ID} value={client.KLIEN_ID.toString()}>
                        {client.NAMA}
                    </option>
                ))}
            </Field>
        );
    };

    // Judul Modal Dinamis
    const title = isEdit
        ? `Edit Proyek: ${initialValues.nama_projek || '...'}`
        : 'Tambah Proyek Baru';


    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="relative bg-white p-6 rounded-xl shadow-2xl transition-all duration-300 transform scale-100 mx-4 my-8" style={{ minWidth: '95vw', maxWidth: '800px' }}>
                
                {/* Header */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <h3 className="text-xl font-extrabold text-blue-800">
                        {title}
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
                        enableReinitialize={true} 
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
                                <div className="col-span-1 md:col-span-2 flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                    {/* Tombol Hapus (Kiri) - Hanya muncul saat mode Edit */}
                                    {isEdit && (
                                        <button
                                            type="button"
                                            onClick={() => setShowDeleteConfirm(true)}
                                            disabled={isSubmitting || loadingClients}
                                            className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition duration-150 shadow-sm flex items-center"
                                        >
                                            <Trash className="w-4 h-4 mr-2" />
                                            Hapus Proyek
                                        </button>
                                    )}

                                    {/* Tombol Simpan/Batal (Kanan) */}
                                    <div className={`flex gap-3 ${!isEdit ? 'w-full justify-end' : ''}`}>
                                        <button 
                                            type="button" 
                                            onClick={onClose} 
                                            disabled={isSubmitting || loadingClients}
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
                                                isEdit ? 'Simpan Perubahan' : 'Tambah Proyek'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>

                    {/* UI Konfirmasi Hapus - Ditampilkan di atas form */}
                    {showDeleteConfirm && (
                        <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col items-center justify-center p-6 rounded-xl transition-opacity duration-300">
                            <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
                            <h4 className="text-xl font-bold text-red-700 mb-2">Konfirmasi Penghapusan</h4>
                            <p className="text-gray-600 text-center mb-6">
                                Apakah Anda yakin ingin menghapus proyek **{initialValues.nama_projek}**? Tindakan ini tidak dapat dibatalkan.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDelete} // Panggil fungsi hapus
                                    className="px-6 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                                >
                                    Ya, Hapus Permanen
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjekFormModal;