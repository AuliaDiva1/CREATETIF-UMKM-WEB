'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { X, CheckCircle, AlertTriangle, Loader, Trash } from 'lucide-react'; 

// Menggunakan variabel yang benar: API_BASE_URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; 

// Daftar opsi STATUS untuk dropdown
const STATUS_OPTIONS = [
    { value: 'Draft', label: 'Draft' },
    { value: 'Pending Review', label: 'Pending Review' },
    { value: 'Published', label: 'Published' },
    { value: 'Archived', label: 'Archived' },
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
        return localStorage.getItem('token'); 
    }
    return null;
};


const BlogFormModal = ({ isOpen, onClose, data, mode, onSuccess }) => {
    const [message, setMessage] = useState(null); 
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); 
    const [featuredImagePreview, setFeaturedImagePreview] = useState(data?.FEATURED_IMAGE_URL || null);
    
    // Cek mode & pastikan BLOG_ID digunakan untuk penentuan mode edit
    const isEdit = mode === 'edit' || !!data?.BLOG_ID;
    const token = getToken();
    
    // Nilai Awal Form
    const initialValues = {
        title: data?.TITLE || '',
        slug: data?.SLUG || '',
        content: data?.CONTENT || '',
        excerpt: data?.EXCERPT || '',
        author_name: data?.AUTHOR_NAME || '',
        category: data?.CATEGORY || '',
        tags: data?.TAGS || '',
        status: data?.STATUS || STATUS_OPTIONS[0].value, 
        published_date: formatDateForInput(data?.PUBLISHED_DATE) || '',
        featured_image_file: null, // Untuk menampung File Object
        featured_image_url: data?.FEATURED_IMAGE_URL || '', // URL gambar lama/saat ini
    };

    // Schema Validasi dengan Yup
    const validationSchema = Yup.object({
        title: Yup.string().required('Judul wajib diisi').max(255, 'Judul maksimal 255 karakter'),
        slug: Yup.string().required('Slug wajib diisi').matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug harus dalam format kebab-case').max(255, 'Slug maksimal 255 karakter'),
        content: Yup.string().required('Isi konten wajib diisi'),
        excerpt: Yup.string().nullable().max(500, 'Ringkasan maksimal 500 karakter'),
        author_name: Yup.string().required('Nama Penulis wajib diisi').max(100, 'Nama Penulis maksimal 100 karakter'),
        category: Yup.string().nullable().max(50, 'Kategori maksimal 50 karakter'),
        tags: Yup.string().nullable().max(255, 'Tags maksimal 255 karakter (pisahkan dengan koma)'),
        status: Yup.string().oneOf(STATUS_OPTIONS.map(o => o.value), 'Status tidak valid').required('Status wajib diisi'),
        published_date: Yup.date().nullable(),
        featured_image_file: Yup.mixed()
            .nullable()
            .test(
                'fileSize',
                'Ukuran file terlalu besar (Maks 2MB)',
                (value) => !value || (value && value.size <= 2000000) // Maks 2MB
            )
            .test(
                'fileType',
                'Hanya format gambar yang didukung',
                (value) => !value || (value && ['image/jpg', 'image/jpeg', 'image/png'].includes(value.type))
            ),
    });

    useEffect(() => {
        if (isOpen) {
            setMessage(null);
            setShowDeleteConfirm(false); 
            // Pastikan preview diupdate saat modal dibuka
            setFeaturedImagePreview(data?.FEATURED_IMAGE_URL || null);
        }
    }, [isOpen, data]);

    // Jika modal tidak terbuka, jangan render apapun
    if (!isOpen) return null;

    // FUNGSI UTAMA: CREATE & UPDATE
    const handleSubmit = async (values, actions) => {
        setMessage(null); 
        
        if (!token) {
            setMessage({ type: 'error', text: 'Gagal: Token otorisasi tidak ditemukan.' });
            actions.setSubmitting(false);
            return;
        }

        // Siapkan FormData untuk menangani file upload
        const formData = new FormData();

        // Tambahkan field teks ke FormData (Pastikan nama field sesuai dengan API/DB: camelCase ke UPPER_CASE)
        formData.append('TITLE', values.title);
        formData.append('SLUG', values.slug);
        formData.append('CONTENT', values.content);
        // Pastikan excerpt, category, tags dikirim string kosong jika null/undefined
        formData.append('EXCERPT', values.excerpt || '');
        formData.append('AUTHOR_NAME', values.author_name);
        formData.append('CATEGORY', values.category || '');
        formData.append('TAGS', values.tags || '');
        formData.append('STATUS', values.status);
        // Ubah null/undefined published_date menjadi string kosong
        formData.append('PUBLISHED_DATE', values.published_date || ''); 
        
        // --- LOGIKA GAMBAR ---
        if (values.featured_image_file) {
            // Jika ada file baru, kirim file
            formData.append('featured_image', values.featured_image_file); 
        } else if (isEdit && !featuredImagePreview) {
            // Jika mode edit dan preview di-null-kan (berarti gambar lama dihapus oleh user)
            // Sinyal ke backend untuk menghapus (misalnya dengan mengirim string 'DELETE_IMAGE')
             formData.append('FEATURED_IMAGE_ACTION', 'DELETE');
        } else if (isEdit && values.featured_image_url) {
            // Mode edit, tidak ada file baru, URL lama tetap ada, kirim kembali URL lama
            formData.append('FEATURED_IMAGE_URL', values.featured_image_url);
        }
        // Jika mode Tambah dan tidak ada file, featured_image_file dan featured_image_url akan kosong/null secara default, yang aman.

        // 🔥 PERUBAHAN ENDPOINT: Mengganti /admin/blog menjadi /transaksi-blog
        const BASE_ENDPOINT = `${API_BASE_URL}/transaksi-blog`;

        console.log("Mode:", isEdit ? 'EDIT' : 'TAMBAH', "API URL:", `${BASE_ENDPOINT}${isEdit ? '/' + data.BLOG_ID : ''}`);

        try {
            const config = {
                headers: { 
                    Authorization: `Bearer ${token}`,
                }
            };

            if (isEdit) {
                if (!data?.BLOG_ID) {
                    setMessage({ type: 'error', text: 'Gagal: BLOG_ID tidak ditemukan untuk mode edit.' });
                    actions.setSubmitting(false);
                    return;
                }
                const url = `${BASE_ENDPOINT}/${data.BLOG_ID}`;
                // Menggunakan PUT untuk update data dengan ID
                await axios.put(url, formData, config); 
                setMessage({ type: 'success', text: 'Artikel Blog berhasil diperbarui!' });
            } else {
                const url = `${BASE_ENDPOINT}`;
                // Menggunakan POST untuk membuat data baru
                await axios.post(url, formData, config);
                setMessage({ type: 'success', text: 'Artikel Blog baru berhasil ditambahkan!' });
            }

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
                    // Endpoint sudah diperbaiki, 404 kemungkinan karena ID tidak ditemukan
                    msg = "Endpoint API tidak ditemukan (404) atau ID Artikel tidak valid."; 
                } else if (status === 400) {
                    msg = "Data yang dikirim tidak valid. Periksa format field atau slug sudah digunakan.";
                } else {
                    msg = `Terjadi kesalahan saat menyimpan data (Status: ${status}).`;
                }
            } else {
                msg = err.message || "Terjadi kesalahan koneksi saat menyimpan data.";
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
        setShowDeleteConfirm(false); 
        
        if (!token) {
            setMessage({ type: 'error', text: 'Gagal: Token otorisasi tidak ditemukan.' });
            return;
        }

        if (!data?.BLOG_ID) {
            setMessage({ type: 'error', text: 'Gagal: BLOG_ID tidak ditemukan untuk operasi hapus.' });
            return;
        }

        // 🔥 ENDPOINT DELETE SUDAH BENAR: /transaksi-blog/:id
        const url = `${API_BASE_URL}/transaksi-blog/${data.BLOG_ID}`;
        console.log("URL DELETE:", url);

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            await axios.delete(url, config);
            
            setMessage({ type: 'success', text: 'Artikel Blog berhasil dihapus!' });

            setTimeout(() => {
                if (onSuccess) onSuccess();
                onClose();
            }, 1500);

        } catch (err) {
            const status = err.response?.status;
            const responseData = err.response?.data;
            
            let msg;
            
            if (responseData && responseData.message) {
                msg = responseData.message;
            } else if (status) {
                if (status === 401 || status === 403) {
                    msg = "Otorisasi Gagal (401/403). Token tidak valid.";
                } else if (status === 404) {
                    msg = "Endpoint API tidak ditemukan (404) atau Artikel sudah terhapus.";
                } else {
                    msg = `Terjadi kesalahan saat menghapus data (Status: ${status}).`;
                }
            } else {
                msg = err.message || "Terjadi kesalahan koneksi saat menghapus data.";
            }
            
            setMessage({ type: 'error', text: `Gagal menghapus: ${msg}` });
        }
    };
    
    // Judul Modal Dinamis
    const title = isEdit
        ? `Edit Artikel: ${initialValues.title || '...'}`
        : 'Tambah Artikel Baru';


    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="relative bg-white p-6 rounded-xl shadow-2xl transition-all duration-300 transform scale-100 mx-4 my-8" style={{ minWidth: '95vw', maxWidth: '1000px' }}>
                
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
                        {({ isSubmitting, setFieldValue, values }) => (
                            <Form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Kolom Kiri - Konten Utama */}
                                <div className="col-span-1 lg:col-span-2">
                                    {/* TITLE */}
                                    <div className="mb-4">
                                        <label htmlFor="title" className="block text-sm font-semibold text-gray-700">Judul Artikel <span className="text-red-500">*</span></label>
                                        <Field
                                            id="title"
                                            name="title"
                                            type="text"
                                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg transition duration-150"
                                            placeholder="Judul utama artikel"
                                        />
                                        <ErrorMessage name="title" component="small" className="text-red-500 text-xs mt-1 block" />
                                    </div>
                                    
                                    {/* SLUG */}
                                    <div className="mb-4">
                                        <label htmlFor="slug" className="block text-sm font-semibold text-gray-700">Slug URL <span className="text-red-500">*</span></label>
                                        <Field
                                            id="slug"
                                            name="slug"
                                            type="text"
                                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                            placeholder="contoh-judul-artikel-anda (kebab-case)"
                                        />
                                        <ErrorMessage name="slug" component="small" className="text-red-500 text-xs mt-1 block" />
                                    </div>

                                    {/* CONTENT */}
                                    <div className="mb-4">
                                        <label htmlFor="content" className="block text-sm font-semibold text-gray-700">Isi Konten <span className="text-red-500">*</span></label>
                                        <Field
                                            as="textarea"
                                            id="content"
                                            name="content"
                                            rows="12"
                                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 font-mono text-sm"
                                            placeholder="Tulis konten artikel Anda di sini..."
                                        />
                                        <ErrorMessage name="content" component="small" className="text-red-500 text-xs mt-1 block" />
                                    </div>
                                    
                                    {/* EXCERPT */}
                                    <div className="mb-4">
                                        <label htmlFor="excerpt" className="block text-sm font-semibold text-gray-700">Ringkasan (Excertp/SEO Description)</label>
                                        <Field
                                            as="textarea"
                                            id="excerpt"
                                            name="excerpt"
                                            rows="3"
                                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-sm"
                                            placeholder="Ringkasan singkat untuk tampilan awal atau SEO..."
                                        />
                                        <ErrorMessage name="excerpt" component="small" className="text-red-500 text-xs mt-1 block" />
                                    </div>
                                </div>

                                {/* Kolom Kanan - Metadata & Gambar */}
                                <div className="col-span-1">
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

                                    {/* PUBLISHED_DATE */}
                                    <div className="mb-4">
                                        <label htmlFor="published_date" className="block text-sm font-semibold text-gray-700">Tanggal Publikasi</label>
                                        <Field
                                            id="published_date"
                                            name="published_date"
                                            type="date"
                                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                        />
                                        <ErrorMessage name="published_date" component="small" className="text-red-500 text-xs mt-1 block" />
                                    </div>
                                    
                                    {/* AUTHOR_NAME */}
                                    <div className="mb-4">
                                        <label htmlFor="author_name" className="block text-sm font-semibold text-gray-700">Nama Penulis <span className="text-red-500">*</span></label>
                                        <Field
                                            id="author_name"
                                            name="author_name"
                                            type="text"
                                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                            placeholder="Nama penulis"
                                        />
                                        <ErrorMessage name="author_name" component="small" className="text-red-500 text-xs mt-1 block" />
                                    </div>
                                    
                                    {/* CATEGORY & TAGS */}
                                    <div className="mb-4 grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="category" className="block text-sm font-semibold text-gray-700">Kategori</label>
                                            <Field
                                                id="category"
                                                name="category"
                                                type="text"
                                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                                placeholder="Contoh: Teknologi"
                                            />
                                            <ErrorMessage name="category" component="small" className="text-red-500 text-xs mt-1 block" />
                                        </div>
                                        <div>
                                            <label htmlFor="tags" className="block text-sm font-semibold text-gray-700">Tags (Koma)</label>
                                            <Field
                                                id="tags"
                                                name="tags"
                                                type="text"
                                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                                placeholder="Contoh: react, nextjs, webdev"
                                            />
                                            <ErrorMessage name="tags" component="small" className="text-red-500 text-xs mt-1 block" />
                                        </div>
                                    </div>

                                    {/* FEATURED_IMAGE */}
                                    <div className="mb-4">
                                        <label htmlFor="featured_image_file" className="block text-sm font-semibold text-gray-700">Gambar Utama (Featured Image)</label>
                                        {/* Tampilkan preview gambar lama/baru */}
                                        {(featuredImagePreview) && (
                                            <div className="my-2 p-2 border border-dashed rounded-lg">
                                                <img 
                                                    src={featuredImagePreview} 
                                                    alt="Preview Gambar Utama" 
                                                    className="w-full h-auto max-h-40 object-cover rounded-lg"
                                                />
                                                <small className="block text-center text-gray-500 mt-1">Gambar saat ini</small>
                                            </div>
                                        )}

                                        <input
                                            id="featured_image_file"
                                            name="featured_image_file"
                                            type="file"
                                            onChange={(event) => {
                                                const file = event.currentTarget.files[0];
                                                setFieldValue("featured_image_file", file);
                                                // Tampilkan preview gambar baru
                                                if (file) {
                                                    setFeaturedImagePreview(URL.createObjectURL(file));
                                                    // Penting: Kosongkan featured_image_url di values jika ada file baru
                                                    setFieldValue("featured_image_url", ''); 
                                                } else {
                                                    // Jika file dihapus, kembali ke URL lama (jika ada)
                                                    setFeaturedImagePreview(data?.FEATURED_IMAGE_URL || null); 
                                                }
                                            }}
                                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                        <ErrorMessage name="featured_image_file" component="small" className="text-red-500 text-xs mt-1 block" />
                                        
                                        {/* Tombol Hapus Gambar Lama (hanya di mode Edit) */}
                                        {isEdit && values.featured_image_url && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFieldValue('featured_image_file', null);
                                                    setFieldValue('featured_image_url', ''); // Hapus URL untuk sinyal ke backend
                                                    setFeaturedImagePreview(null);
                                                }}
                                                className="mt-2 text-xs text-red-500 hover:text-red-700 flex items-center"
                                            >
                                                <X className="w-3 h-3 mr-1" /> Hapus Gambar Utama Saat Ini
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Footer Buttons (Full Width) */}
                                <div className="col-span-1 lg:col-span-3 flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                    {/* Tombol Hapus (Kiri) - Hanya muncul saat mode Edit */}
                                    {isEdit && (
                                        <button
                                            type="button"
                                            onClick={() => setShowDeleteConfirm(true)}
                                            disabled={isSubmitting}
                                            className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition duration-150 shadow-sm flex items-center"
                                        >
                                            <Trash className="w-4 h-4 mr-2" />
                                            Hapus Artikel
                                        </button>
                                    )}

                                    {/* Tombol Simpan/Batal (Kanan) */}
                                    <div className={`flex gap-3 ${!isEdit ? 'w-full justify-end' : ''}`}>
                                        <button 
                                            type="button" 
                                            onClick={onClose} 
                                            disabled={isSubmitting}
                                            className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150 shadow-sm"
                                        >
                                            Batal
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting} 
                                            className={`px-6 py-2 text-sm font-semibold text-white rounded-lg transition duration-150 shadow-md flex items-center justify-center ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader className="animate-spin w-4 h-4 mr-2" /> Menyimpan...
                                                </>
                                            ) : (
                                                isEdit ? 'Simpan Perubahan' : 'Tambah Artikel'
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
                                Apakah Anda yakin ingin menghapus artikel **{initialValues.title}**? Tindakan ini tidak dapat dibatalkan dan akan menghapus gambar terkait.
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
                                    onClick={handleDelete} 
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

export default BlogFormModal;