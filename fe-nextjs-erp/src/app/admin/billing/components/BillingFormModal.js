'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { X, CheckCircle, AlertTriangle, Loader, Trash, DollarSign, CreditCard } from 'lucide-react'; 

// Menggunakan variabel yang benar: API_BASE_URL
// Pastikan variabel ini diatur di file .env.local Anda
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'; 

// --- OPSI-OPSI DROPDOWN ---

// Daftar opsi STATUS untuk dropdown
const STATUS_OPTIONS = [
    { value: 'Draft', label: 'Draft' },
    { value: 'Sent', label: 'Sent' },
    { value: 'Paid', label: 'Paid' },
    { value: 'Overdue', label: 'Overdue' },
    { value: 'Cancelled', label: 'Cancelled' },
];

// Daftar opsi Metode Pembayaran
const PAYMENT_METHOD_OPTIONS = [
    { value: '', label: '-- Pilih Metode --' },
    { value: 'Transfer Bank', label: 'Transfer Bank' },
    { value: 'Kartu Kredit', label: 'Kartu Kredit' },
    { value: 'Cash', label: 'Cash' },
    { value: 'Lainnya', label: 'Lainnya' },
];

// --- FUNGSI UTILITY ---

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
        // Ganti 'token' dengan nama key token yang benar di localStorage Anda
        return localStorage.getItem('token'); 
    }
    return null;
};

// --- KOMPONEN UTAMA ---

const BillingFormModal = ({ isOpen, onClose, data, mode, onSuccess }) => {
    const [projekList, setProjekList] = useState([]); 
    const [loadingProjek, setLoadingProjek] = useState(true);
    const [projekError, setProjekError] = useState(null);
    const [message, setMessage] = useState(null); 
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); 
    
    // Tentukan apakah dalam mode Edit. Mode edit harus memiliki data.BILLING_ID
    const isEdit = mode === 'edit' || (!!data && !!data.BILLING_ID); 
    const token = getToken();

    // Efek untuk memuat daftar PROYEK (Projek ID dibutuhkan untuk Billing)
    const fetchProjekList = useCallback(async () => {
        if (!token) {
            setProjekError('Token otorisasi tidak ditemukan.');
            setLoadingProjek(false);
            return;
        }

        setLoadingProjek(true);
        setProjekError(null);
        try {
            // ASUMSI: Endpoint untuk mengambil daftar proyek
            const response = await axios.get(`${API_BASE_URL}/transaksi-projek`, { 
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const projekData = response.data.data || response.data || [];
            // Filter proyek yang valid (memiliki ID dan Nama)
            setProjekList(projekData.filter(p => p.PROJEK_ID && p.NAMA_PROJEK));
        } catch (err) {
            console.error('Gagal memuat daftar Proyek:', err.response?.data || err.message);
            setProjekError('Gagal memuat daftar Proyek. Mohon periksa koneksi API atau token.');
        } finally {
            setLoadingProjek(false);
        }
    }, [token]);

    useEffect(() => {
        if (isOpen) {
            fetchProjekList();
            setMessage(null);
            setShowDeleteConfirm(false); 
        }
    }, [isOpen, fetchProjekList]);

    if (!isOpen) return null;

    // Nilai awal form. Perhatikan pemetaan nama field form ke kolom DB!
    const initialValues = {
        // Field Utama (Mapping ke DB: tb.PROJEK_ID)
        projek_id: data?.PROJEK_ID?.toString() || '',
        nomor_billing: data?.NOMOR_INVOICE || '', // Mapping ke DB: tb.NOMOR_INVOICE
        nilai_billing: data?.JUMLAH_TAGIHAN?.toString() || '', // Mapping ke DB: tb.JUMLAH_TAGIHAN
        deskripsi: data?.CATATAN || '', // Mapping ke DB: tb.CATATAN (Catatan Invoice)
        status: data?.STATUS_TAGIHAN || STATUS_OPTIONS[0].value, // Mapping ke DB: tb.STATUS_TAGIHAN
        
        // Field Tanggal
        // TANGGAL_BILLING adalah field form, dibuat secara default ke created_at/tanggal hari ini jika tidak ada
        tanggal_billing: formatDateForInput(data?.created_at) || formatDateForInput(new Date().toISOString()), 
        tanggal_jatuh_tempo: formatDateForInput(data?.TANGGAL_JATUH_TEMPO) || '', // Mapping ke DB: tb.TANGGAL_JATUH_TEMPO

        // Field Pembayaran (Opsional/Hanya diisi jika mencatat pembayaran di form yang sama/mode edit)
        jumlah_pembayaran: data?.JUMLAH_PEMBAYARAN?.toString() || '', // Mapping ke DB: tb.JUMLAH_PEMBAYARAN
        metode_pembayaran: data?.METODE_PEMBAYARAN || '', // Mapping ke DB: tb.METODE_PEMBAYARAN
    };

    // Schema Validasi dengan Yup
    const validationSchema = Yup.object({
        projek_id: Yup.string().required('Proyek wajib dipilih'),
        nomor_billing: Yup.string().required('Nomor Billing wajib diisi').max(100, 'Nomor Billing maksimal 100 karakter'),
        deskripsi: Yup.string().nullable(),
        nilai_billing: Yup.number()
            .transform((value, originalValue) => (originalValue === '' ? undefined : value))
            .typeError('Nilai Billing harus berupa angka')
            .min(1, 'Nilai Billing harus lebih dari 0') // Tagihan harus > 0
            .required('Nilai Billing wajib diisi'),
        tanggal_billing: Yup.date().required('Tanggal Billing wajib diisi'), // Diambil dari created_at
        tanggal_jatuh_tempo: Yup.date()
            .nullable()
            .min(Yup.ref('tanggal_billing'), 'Jatuh Tempo tidak boleh mendahului Tanggal Billing'),
        status: Yup.string().oneOf(STATUS_OPTIONS.map(o => o.value), 'Status tidak valid').required('Status wajib diisi'),
        
        // Validasi Pembayaran (Opsional)
        jumlah_pembayaran: Yup.number()
             .transform((value, originalValue) => (originalValue === '' ? undefined : value))
             .nullable()
             .min(0, 'Jumlah Pembayaran tidak boleh negatif')
             .max(Yup.ref('nilai_billing'), 'Pembayaran tidak boleh melebihi Tagihan'),
        metode_pembayaran: Yup.string()
             .nullable()
             .when('jumlah_pembayaran', {
                 is: (val) => val > 0, // Jika ada jumlah pembayaran, Metode harus diisi
                 then: (schema) => schema.required('Metode Pembayaran wajib diisi jika ada Jumlah Pembayaran.'),
             }),
    });

    const handleSubmit = async (values, actions) => {
        setMessage(null); 
        
        if (!token) {
            setMessage({ type: 'error', text: 'Gagal: Token otorisasi tidak ditemukan.' });
            actions.setSubmitting(false);
            return;
        }

        // 💡 Payload AKHIR disesuaikan dengan skema tabel DB
        const finalPayload = {
            PROJEK_ID: parseInt(values.projek_id),
            // Wajib diisi: INVOICE karena ini formulir tagihan/invoice
            TIPE_TRANSAKSI: 'INVOICE', 
            
            // Kolom Billing/Invoice
            NOMOR_INVOICE: values.nomor_billing, 
            JUMLAH_TAGIHAN: parseFloat(values.nilai_billing),
            TANGGAL_JATUH_TEMPO: values.tanggal_jatuh_tempo || null,
            STATUS_TAGIHAN: values.status,
            CATATAN: values.deskripsi || null, // CATATAN digunakan untuk deskripsi invoice
            
            // Kolom Pembayaran (Opsional, hanya dikirim jika ada nilai)
            JUMLAH_PEMBAYARAN: values.jumlah_pembayaran ? parseFloat(values.jumlah_pembayaran) : 0,
            METODE_PEMBAYARAN: values.metode_pembayaran || null,

            
            // Note: created_at dan updated_at ditangani oleh fungsi di server
        };

        console.log("Final Payload Billing yang dikirim:", finalPayload);

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const endpoint = `${API_BASE_URL}/transaksi-billing`; 
            let response;

            if (isEdit) {
                if (!data?.BILLING_ID) { 
                    setMessage({ type: 'error', text: 'Gagal: BILLING_ID tidak ditemukan untuk mode edit.' });
                    actions.setSubmitting(false);
                    return;
                }
                const url = `${endpoint}/${data.BILLING_ID}`;
                
                response = await axios.put(url, finalPayload, config); 
                setMessage({ type: 'success', text: 'Data Billing berhasil diperbarui!' });
            } else {
                const url = endpoint;
                
                response = await axios.post(url, finalPayload, config);
                setMessage({ type: 'success', text: 'Billing baru berhasil ditambahkan!' });
            }

            setTimeout(() => {
                // response.data.data berisi objek billing yang baru dibuat/diperbarui
                if (onSuccess) onSuccess(response.data.data); 
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
                    msg = "Endpoint API tidak ditemukan (404)."; 
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
     * FUNGSI Logika untuk menghapus Billing (DELETE)
     */
    const handleDelete = async () => {
        setMessage(null);
        setShowDeleteConfirm(false); 
        
        if (!token || !data?.BILLING_ID) {
            setMessage({ type: 'error', text: 'Gagal: ID Billing atau Token otorisasi tidak ditemukan.' });
            return;
        }

        const url = `${API_BASE_URL}/transaksi-billing/${data.BILLING_ID}`; 

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            await axios.delete(url, config);
            
            setMessage({ type: 'success', text: 'Billing berhasil dihapus!' });

            setTimeout(() => {
                if (onSuccess) onSuccess(); // Tidak perlu mengirim data saat hapus
                onClose();
            }, 1500);

        } catch (err) {
            // ... (Kode penanganan error DELETE sama dengan sebelumnya)
            const status = err.response?.status;
            const responseData = err.response?.data;
            let msg;
            
            if (responseData && responseData.message) {
                msg = responseData.message;
            } else if (status) {
                if (status === 401 || status === 403) {
                    msg = "Otorisasi Gagal (401/403). Token tidak valid.";
                } else if (status === 404) {
                    msg = "Endpoint API tidak ditemukan (404) atau Billing sudah terhapus.";
                } else {
                    msg = `Terjadi kesalahan saat menghapus data (Status: ${status}).`;
                }
            } else {
                msg = err.message || "Terjadi kesalahan koneksi saat menghapus data.";
            }
            
            setMessage({ type: 'error', text: `Gagal menghapus: ${msg}` });
        }
    };

    // Komponen pembantu untuk menampilkan status loading/error Proyek
    const ProjekSelectField = () => {
        if (loadingProjek) {
            return (
                <div className="flex items-center justify-center h-12 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-500">
                    <Loader className="animate-spin w-4 h-4 mr-2" /> Memuat daftar Proyek...
                </div>
            );
        }

        if (projekError) {
            return (
                <div className="flex items-center p-3 text-red-700 bg-red-100 rounded-lg text-sm border border-red-400">
                    <AlertTriangle className="w-5 h-5 mr-2" /> {projekError}
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
                {projekList.map(projek => (
                    <option key={projek.PROJEK_ID} value={projek.PROJEK_ID.toString()}>
                        {projek.NAMA_PROJEK}
                    </option>
                ))}
            </Field>
        );
    };

    // Judul Modal Dinamis
    const title = isEdit
        ? `Edit Billing: ${initialValues.nomor_billing || '...'}`
        : 'Tambah Billing Baru';

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="relative bg-white p-6 rounded-xl shadow-2xl transition-all duration-300 transform scale-100 mx-4 my-8" style={{ minWidth: '95vw', maxWidth: '800px' }}>
                
                {/* Header */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <h3 className="text-xl font-extrabold text-blue-800 flex items-center">
                        <DollarSign className="w-6 h-6 mr-2" /> {title}
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
                        {({ isSubmitting, values, setFieldValue }) => (
                            <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Kolom Kiri: Detail Billing/Invoice */}
                                <div className="col-span-1 md:border-r md:pr-6">
                                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                        <DollarSign className="w-5 h-5 mr-2 text-blue-600" /> Detail Invoice
                                    </h4>
                                    
                                    {/* PROJEK_ID (Dropdown) */}
                                    <div className="mb-4">
                                        <label htmlFor="projek_id" className="block text-sm font-semibold text-gray-700">Proyek Terkait <span className="text-red-500">*</span></label>
                                        <ProjekSelectField />
                                        <ErrorMessage name="projek_id" component="small" className="text-red-500 text-xs mt-1 block" />
                                    </div>

                                    {/* NOMOR_BILLING */}
                                    <div className="mb-4">
                                        <label htmlFor="nomor_billing" className="block text-sm font-semibold text-gray-700">Nomor Invoice <span className="text-red-500">*</span></label>
                                        <Field
                                            id="nomor_billing"
                                            name="nomor_billing"
                                            type="text"
                                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                            placeholder="Contoh: INV-202501-001"
                                        />
                                        <ErrorMessage name="nomor_billing" component="small" className="text-red-500 text-xs mt-1 block" />
                                    </div>

                                    {/* NILAI_BILLING */}
                                    <div className="mb-4">
                                        <label htmlFor="nilai_billing" className="block text-sm font-semibold text-gray-700">Nilai Tagihan (Rp) <span className="text-red-500">*</span></label>
                                        <div className="flex items-center mt-1">
                                            <span className="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg text-sm">
                                                Rp
                                            </span>
                                            <Field
                                                id="nilai_billing"
                                                name="nilai_billing"
                                                type="number"
                                                step="0.01"
                                                className="flex-1 p-3 border border-gray-300 rounded-r-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                                placeholder="Contoh: 7500000"
                                            />
                                        </div>
                                        <ErrorMessage name="nilai_billing" component="small" className="text-red-500 text-xs mt-1 block" />
                                    </div>
                                    
                                    {/* DESKRIPSI (Menjadi CATATAN di payload) */}
                                    <div className="mb-4">
                                        <label htmlFor="deskripsi" className="block text-sm font-semibold text-gray-700">Deskripsi/Catatan Invoice</label>
                                        <Field
                                            as="textarea"
                                            id="deskripsi"
                                            name="deskripsi"
                                            rows="4"
                                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                            placeholder="Detail singkat tentang billing atau item-item yang di-billing..."
                                        />
                                        <ErrorMessage name="deskripsi" component="small" className="text-red-500 text-xs mt-1 block" />
                                    </div>
                                </div>

                                {/* Kolom Kanan: Status & Pembayaran */}
                                <div className="col-span-1">
                                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                        <CreditCard className="w-5 h-5 mr-2 text-blue-600" /> Status & Pembayaran
                                    </h4>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* TANGGAL_BILLING */}
                                        <div className="mb-4">
                                            <label htmlFor="tanggal_billing" className="block text-sm font-semibold text-gray-700">Tanggal Invoice <span className="text-red-500">*</span></label>
                                            <Field
                                                id="tanggal_billing"
                                                name="tanggal_billing"
                                                type="date"
                                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                            />
                                            <ErrorMessage name="tanggal_billing" component="small" className="text-red-500 text-xs mt-1 block" />
                                        </div>

                                        {/* TANGGAL_JATUH_TEMPO */}
                                        <div className="mb-4">
                                            <label htmlFor="tanggal_jatuh_tempo" className="block text-sm font-semibold text-gray-700">Tanggal Jatuh Tempo</label>
                                            <Field
                                                id="tanggal_jatuh_tempo"
                                                name="tanggal_jatuh_tempo"
                                                type="date"
                                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                            />
                                            <ErrorMessage name="tanggal_jatuh_tempo" component="small" className="text-red-500 text-xs mt-1 block" />
                                        </div>
                                    </div>

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
                                    
                                    <h5 className="text-md font-bold text-gray-700 mt-6 mb-3 border-t pt-4">Input Pembayaran (Opsional)</h5>

                                    {/* JUMLAH_PEMBAYARAN */}
                                    <div className="mb-4">
                                        <label htmlFor="jumlah_pembayaran" className="block text-sm font-semibold text-gray-700">Jumlah Pembayaran Diterima (Rp)</label>
                                        <div className="flex items-center mt-1">
                                            <span className="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg text-sm">
                                                Rp
                                            </span>
                                            <Field
                                                id="jumlah_pembayaran"
                                                name="jumlah_pembayaran"
                                                type="number"
                                                step="0.01"
                                                className="flex-1 p-3 border border-gray-300 rounded-r-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                                placeholder="Biarkan kosong jika belum ada pembayaran"
                                            />
                                        </div>
                                        <ErrorMessage name="jumlah_pembayaran" component="small" className="text-red-500 text-xs mt-1 block" />
                                        {/* Peringatan jika status adalah 'Paid' tetapi jumlah pembayaran 0 */}
                                        {values.status === 'Paid' && !values.jumlah_pembayaran && (
                                            <small className="text-orange-500 text-xs mt-1 block">💡 Status 'Paid' dipilih, tetapi Jumlah Pembayaran 0. Harap isi jumlahnya.</small>
                                        )}
                                    </div>

                                    {/* METODE_PEMBAYARAN */}
                                    <div className="mb-4">
                                        <label htmlFor="metode_pembayaran" className="block text-sm font-semibold text-gray-700">Metode Pembayaran</label>
                                        <Field
                                            as="select"
                                            id="metode_pembayaran"
                                            name="metode_pembayaran"
                                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition duration-150"
                                            // Disabled jika Jumlah Pembayaran 0
                                            disabled={!values.jumlah_pembayaran && values.jumlah_pembayaran !== 0}
                                        >
                                            {PAYMENT_METHOD_OPTIONS.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="metode_pembayaran" component="small" className="text-red-500 text-xs mt-1 block" />
                                    </div>
                                    
                                    {/* ✅ TAMBAHKAN: CATATAN_PEMBAYARAN */}
                                    <div className="mb-4 col-span-2"> 
                                        <label htmlFor="catatan_pembayaran" className="block text-sm font-semibold text-gray-700">Catatan Pembayaran (Misal: Ref. Bank)</label>
                                        <Field
                                            as="textarea"
                                            id="catatan_pembayaran"
                                            name="catatan_pembayaran"
                                            rows="2"
                                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                            placeholder="Nomor referensi bank, detail transfer, atau catatan khusus pembayaran."
                                            // Disabled jika tidak ada jumlah pembayaran
                                            disabled={!values.jumlah_pembayaran && values.jumlah_pembayaran !== 0}
                                        />
                                        <ErrorMessage name="catatan_pembayaran" component="small" className="text-red-500 text-xs mt-1 block" />
                                    </div>
                                    
                                </div>

                                {/* Footer Buttons (Full Width) */}
                                <div className="col-span-1 md:col-span-2 flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                    {/* Tombol Hapus (Kiri) - Hanya muncul saat mode Edit */}
                                    {isEdit && (
                                        <button
                                            type="button"
                                            onClick={() => setShowDeleteConfirm(true)}
                                            disabled={isSubmitting || loadingProjek}
                                            className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition duration-150 shadow-sm flex items-center"
                                        >
                                            <Trash className="w-4 h-4 mr-2" />
                                            Hapus Billing
                                        </button>
                                    )}

                                    {/* Tombol Simpan/Batal (Kanan) */}
                                    <div className={`flex gap-3 ${!isEdit ? 'w-full justify-end' : ''}`}>
                                        <button 
                                            type="button" 
                                            onClick={onClose} 
                                            disabled={isSubmitting || loadingProjek}
                                            className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150 shadow-sm"
                                        >
                                            Batal
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting || loadingProjek} 
                                            className={`px-6 py-2 text-sm font-semibold text-white rounded-lg transition duration-150 shadow-md flex items-center justify-center ${isSubmitting || loadingProjek ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader className="animate-spin w-4 h-4 mr-2" /> Menyimpan...
                                                </>
                                            ) : (
                                                isEdit ? 'Simpan Perubahan' : 'Tambah Billing'
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
                                Apakah Anda yakin ingin menghapus Billing **{data?.NOMOR_INVOICE || 'ini'}**? Tindakan ini tidak dapat dibatalkan.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-6 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-150 flex items-center"
                                >
                                    <Trash className="w-4 h-4 mr-2" /> Ya, Hapus Permanen
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BillingFormModal;