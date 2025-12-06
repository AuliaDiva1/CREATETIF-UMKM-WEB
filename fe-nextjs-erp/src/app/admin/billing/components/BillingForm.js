'use client';

import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { X, CheckCircle, AlertTriangle, Loader, DollarSign, FileText } from 'lucide-react'; 

// Menggunakan Environment Variable untuk API URL
const API_URL = typeof process.env.NEXT_PUBLIC_API_URL !== 'undefined' ? process.env.NEXT_PUBLIC_API_URL : 'http://localhost:8000/api';

// Opsi Tipe Transaksi (sesuai controller: INVOICE atau PAYMENT)
const TIPE_TRANSAKSI_OPTIONS = [
    { value: 'INVOICE', label: 'INVOICE (Tagihan)' },
    { value: 'PAYMENT', label: 'PAYMENT (Pembayaran Masuk)' },
];

// Opsi Status Khusus untuk INVOICE
const STATUS_INVOICE_OPTIONS = [
    { value: 'Unpaid', label: 'Belum Dibayar (Unpaid)' },
    { value: 'Paid', label: 'Sudah Dibayar (Paid)' },
    { value: 'Overdue', label: 'Jatuh Tempo (Overdue)' },
    { value: 'Cancelled', label: 'Dibatalkan (Cancelled)' },
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

const BillingForm = ({ isOpen, onClose, data, onSuccess }) => {
    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [projectError, setProjectError] = useState(null);
    const [message, setMessage] = useState(null); // State untuk pesan feedback (sukses/gagal)

    // Efek untuk memuat daftar proyek dari API '/transaksi-projek'
    useEffect(() => {
        if (!isOpen) return;

        const fetchProjects = async () => {
            setLoadingProjects(true);
            setProjectError(null);
            try {
                // Mengambil data proyek dari endpoint '/transaksi-projek'
                // Diasumsikan response.data adalah array of projects, masing-masing dengan PROJEK_ID dan NAMA_PROJEK
                const response = await axios.get(`${API_URL}/transaksi-projek`); 
                setProjects(response.data.data || response.data); // Menyesuaikan jika API membungkus data
            } catch (err) {
                console.error('Gagal memuat daftar proyek:', err);
                setProjectError('Gagal memuat daftar proyek. Pastikan API berjalan dan endpoint /api/transaksi-projek tersedia.');
            } finally {
                setLoadingProjects(false);
            }
        };

        fetchProjects();
    }, [isOpen]);

    if (!isOpen) return null;

    // Cek apakah mode Edit atau Tambah Baru
    const isEditMode = !!data?.BILLING_ID;

    // Nilai awal form (menggunakan nama field sesuai tabel transaksi_billing)
    const initialValues = {
        // PROJEK_ID harus diubah ke string untuk Field select Formik
        projek_id: data?.PROJEK_ID?.toString() || '', 
        tipe_transaksi: data?.TIPE_TRANSAKSI || 'INVOICE',
        tanggal_transaksi: formatDateForInput(data?.TANGGAL_TRANSAKSI) || formatDateForInput(new Date().toISOString()),
        jumlah: data?.JUMLAH?.toString() || '',
        keterangan: data?.KETERANGAN || '',
        // Status hanya berlaku dan ditampilkan untuk INVOICE. Default ke Unpaid
        status: data?.STATUS || 'Unpaid', 
        tanggal_jatuh_tempo: formatDateForInput(data?.TANGGAL_JATUH_TEMPO) || '',
    };

    // Schema Validasi dengan Yup
    const validationSchema = Yup.object({
        projek_id: Yup.string().required('Proyek wajib dipilih'),
        tipe_transaksi: Yup.string().oneOf(TIPE_TRANSAKSI_OPTIONS.map(o => o.value), 'Tipe Transaksi tidak valid').required('Tipe Transaksi wajib diisi'),
        tanggal_transaksi: Yup.date().required('Tanggal Transaksi wajib diisi'),
        jumlah: Yup.number()
            .typeError('Jumlah harus berupa angka')
            .min(1, 'Jumlah minimal harus 1')
            .required('Jumlah wajib diisi'),
        keterangan: Yup.string().nullable().max(500, 'Keterangan maksimal 500 karakter'),
        status: Yup.string().when('tipe_transaksi', {
            is: 'INVOICE',
            then: (schema) => schema.oneOf(STATUS_INVOICE_OPTIONS.map(o => o.value), 'Status Invoice tidak valid').required('Status Invoice wajib diisi'),
            otherwise: (schema) => schema.notRequired(), // Tidak perlu status jika PAYMENT
        }),
        tanggal_jatuh_tempo: Yup.date().when('tipe_transaksi', {
            is: 'INVOICE',
            then: (schema) => schema
                .nullable()
                .min(Yup.ref('tanggal_transaksi'), 'Jatuh Tempo tidak boleh sebelum Tanggal Transaksi')
                .required('Tanggal Jatuh Tempo wajib diisi untuk Invoice'),
            otherwise: (schema) => schema.nullable(), // Tidak perlu jatuh tempo jika PAYMENT
        }),
    });

    const handleSubmit = async (values, actions) => {
        setMessage(null); // Bersihkan pesan sebelumnya
        
        // Konversi nilai ke tipe data yang sesuai untuk API
        const payload = {
            PROJEK_ID: parseInt(values.projek_id), 
            TIPE_TRANSAKSI: values.tipe_transaksi,
            TANGGAL_TRANSAKSI: values.tanggal_transaksi,
            JUMLAH: parseFloat(values.jumlah), 
            KETERANGAN: values.keterangan || null,
            // STATUS hanya dikirim jika TIPE_TRANSAKSI adalah INVOICE, jika PAYMENT, biasanya di-ignore oleh backend.
            STATUS: values.tipe_transaksi === 'INVOICE' ? values.status : null,
            // TANGGAL_JATUH_TEMPO hanya dikirim jika TIPE_TRANSAKSI adalah INVOICE
            TANGGAL_JATUH_TEMPO: values.tipe_transaksi === 'INVOICE' ? values.tanggal_jatuh_tempo : null,
        };

        try {
            if (isEditMode) {
                // --- LOGIKA EDIT ---
                // Endpoint: PUT ${API_URL}/billing/{BILLING_ID}
                await axios.put(`${API_URL}/billing/${data.BILLING_ID}`, payload);
                setMessage({ type: 'success', text: `Transaksi ${data.TIPE_TRANSAKSI} berhasil diperbarui!` });
            } else {
                // --- LOGIKA TAMBAH ---
                // Endpoint: POST ${API_URL}/billing
                await axios.post(`${API_URL}/billing`, payload);
                setMessage({ type: 'success', text: `Transaksi ${values.tipe_transaksi} baru berhasil ditambahkan!` });
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

    // Komponen pembantu untuk menampilkan status loading/error proyek
    const ProjectSelectField = () => {
        if (loadingProjects) {
            return (
                <div className="flex items-center justify-center h-12 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-500">
                    <Loader className="animate-spin w-4 h-4 mr-2" /> Memuat daftar Proyek...
                </div>
            );
        }

        if (projectError) {
            return (
                <div className="flex items-center p-3 text-red-700 bg-red-100 rounded-lg text-sm border border-red-400">
                    <AlertTriangle className="w-5 h-5 mr-2" /> {projectError}
                </div>
            );
        }

        return (
            <Field
                as="select"
                id="projek_id"
                name="projek_id"
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition duration-150"
            >
                <option value="">-- Pilih Proyek --</option>
                {projects.map(project => (
                    // Asumsi data proyek memiliki PROJEK_ID (number) dan NAMA_PROJEK (string)
                    <option key={project.PROJEK_ID} value={project.PROJEK_ID.toString()}>
                        {project.NAMA_PROJEK}
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
                    <h3 className="text-xl font-extrabold text-indigo-800 flex items-center">
                        <DollarSign className="w-6 h-6 mr-2" /> {isEditMode ? `Edit Transaksi: ${data?.BILLING_ID}` : 'Tambah Transaksi Billing Baru'}
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
                        enableReinitialize={!loadingProjects} // Re-initialize setelah proyek dimuat
                    >
                        {({ isSubmitting, values }) => (
                            <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Kolom Kiri */}
                                <div className="col-span-1">
                                    {/* PROJEK_ID (Dropdown) */}
                                    <div className="mb-4">
                                        <label htmlFor="projek_id" className="block text-sm font-semibold text-gray-700">Proyek Terkait <span className="text-red-500">*</span></label>
                                        <ProjectSelectField />
                                        <ErrorMessage name="projek_id" component="small" className="text-red-500 text-xs mt-1 block" />
                                    </div>

                                    {/* TIPE_TRANSAKSI */}
                                    <div className="mb-4">
                                        <label htmlFor="tipe_transaksi" className="block text-sm font-semibold text-gray-700">Tipe Transaksi <span className="text-red-500">*</span></label>
                                        <Field
                                            as="select"
                                            id="tipe_transaksi"
                                            name="tipe_transaksi"
                                            // Disabled jika mode edit untuk mencegah perubahan tipe
                                            disabled={isEditMode} 
                                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white transition duration-150 disabled:bg-gray-100 disabled:text-gray-500"
                                        >
                                            {TIPE_TRANSAKSI_OPTIONS.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="tipe_transaksi" component="small" className="text-red-500 text-xs mt-1 block" />
                                    </div>

                                    {/* TANGGAL_TRANSAKSI */}
                                    <div className="mb-4">
                                        <label htmlFor="tanggal_transaksi" className="block text-sm font-semibold text-gray-700">Tanggal Transaksi <span className="text-red-500">*</span></label>
                                        <Field
                                            id="tanggal_transaksi"
                                            name="tanggal_transaksi"
                                            type="date"
                                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                        />
                                        <ErrorMessage name="tanggal_transaksi" component="small" className="text-red-500 text-xs mt-1 block" />
                                    </div>
                                </div>

                                {/* Kolom Kanan */}
                                <div className="col-span-1">
                                    {/* JUMLAH */}
                                    <div className="mb-4">
                                        <label htmlFor="jumlah" className="block text-sm font-semibold text-gray-700">Jumlah (Rp) <span className="text-red-500">*</span></label>
                                        <div className="flex items-center mt-1">
                                            <span className="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg text-sm">
                                                Rp
                                            </span>
                                            <Field
                                                id="jumlah"
                                                name="jumlah"
                                                type="number"
                                                step="0.01"
                                                className="flex-1 p-3 border border-gray-300 rounded-r-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                                placeholder="Contoh: 5000000"
                                            />
                                        </div>
                                        <ErrorMessage name="jumlah" component="small" className="text-red-500 text-xs mt-1 block" />
                                    </div>
                                    
                                    {/* STATUS (Hanya Tampil Jika INVOICE) */}
                                    {values.tipe_transaksi === 'INVOICE' && (
                                        <div className="mb-4">
                                            <label htmlFor="status" className="block text-sm font-semibold text-gray-700">Status Invoice <span className="text-red-500">*</span></label>
                                            <Field
                                                as="select"
                                                id="status"
                                                name="status"
                                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white transition duration-150"
                                            >
                                                {STATUS_INVOICE_OPTIONS.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </Field>
                                            <ErrorMessage name="status" component="small" className="text-red-500 text-xs mt-1 block" />
                                        </div>
                                    )}

                                    {/* TANGGAL_JATUH_TEMPO (Hanya Tampil Jika INVOICE) */}
                                    {values.tipe_transaksi === 'INVOICE' && (
                                        <div className="mb-4">
                                            <label htmlFor="tanggal_jatuh_tempo" className="block text-sm font-semibold text-gray-700">Tanggal Jatuh Tempo <span className="text-red-500">*</span></label>
                                            <Field
                                                id="tanggal_jatuh_tempo"
                                                name="tanggal_jatuh_tempo"
                                                type="date"
                                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                            />
                                            <ErrorMessage name="tanggal_jatuh_tempo" component="small" className="text-red-500 text-xs mt-1 block" />
                                        </div>
                                    )}
                                </div>
                                
                                {/* KETERANGAN (Full Width) */}
                                <div className="col-span-1 md:col-span-2">
                                    <label htmlFor="keterangan" className="block text-sm font-semibold text-gray-700">Keterangan / Deskripsi Transaksi</label>
                                    <Field
                                        as="textarea"
                                        id="keterangan"
                                        name="keterangan"
                                        rows="3"
                                        className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                        placeholder="Detail atau catatan tambahan untuk transaksi ini..."
                                    />
                                    <ErrorMessage name="keterangan" component="small" className="text-red-500 text-xs mt-1 block" />
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
                                        disabled={isSubmitting || loadingProjects} 
                                        className={`px-6 py-2 text-sm font-semibold text-white rounded-lg transition duration-150 shadow-md flex items-center justify-center ${isSubmitting || loadingProjects ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader className="animate-spin w-4 h-4 mr-2" /> Menyimpan...
                                            </>
                                        ) : (
                                            isEditMode ? 'Simpan Perubahan' : 'Tambah Transaksi'
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

export default BillingForm;