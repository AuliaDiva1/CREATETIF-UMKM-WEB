'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import CustomDataTable from '../../../components/DataTable'; 
import BlogFormModal from './components/BlogFormModal'; 
import { BookOpen, User, Calendar } from 'lucide-react'; 

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// --- Komponen Pembantu (Toast dan CustomModal) ---
const Toast = ({ toast }) => {
    if (!toast) return null;

    const baseStyle = "fixed bottom-5 right-5 p-4 rounded-xl shadow-2xl text-white transition-opacity duration-300 z-[1000] max-w-sm";
    const style = toast.type === 'success' ? "bg-green-600" : "bg-red-600";
    
    const iconSVG = toast.type === 'success' 
        ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        ) 
        : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        );

    return (
        <div className={`${baseStyle} ${style}`}>
            <div className="flex items-start">
                <span className="mr-3 text-white">{iconSVG}</span>
                <span className="font-medium">{toast.message}</span>
            </div>
        </div>
    );
};

const CustomModal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
    if (!isOpen) return null;

    const widthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-xl',
        lg: 'max-w-3xl',
        xl: 'max-w-5xl',
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full ${widthClasses[size]} transform transition-all duration-300 ease-out scale-100`}>
                <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-3xl leading-none transition-colors"
                    >
                        &times;
                    </button>
                </div>
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    {children}
                </div>
                {footer && (
                    <div className="p-5 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-700 rounded-b-xl">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};
// --- Akhir Komponen Pembantu ---

// Fungsi untuk styling badge status
const getStatusBadge = (status) => {
    let classes = "px-3 py-1 text-xs font-semibold rounded-full";
    const statusText = status === 'Published' ? 'Published' : 'Draft';
    
    if (status === 'Published') {
        classes += " bg-green-100 text-green-800";
    } else {
        classes += " bg-yellow-100 text-yellow-800";
    }
    return <span className={classes}>{statusText}</span>;
};

// Fungsi untuk memformat tanggal
const formatDate = (dateString) => {
    if (!dateString || dateString === 'NULL') return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (e) {
        return 'Invalid Date';
    }
};


export default function BlogPage() {
    const [blogList, setBlogList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [dialogMode, setDialogMode] = useState(null); 
    const [token, setToken] = useState(''); 
    const [confirmDeleteBlog, setConfirmDeleteBlog] = useState(null); 
    const [currentToast, setCurrentToast] = useState(null); 
    const [searchTerm, setSearchTerm] = useState(''); 
    
    // --- Toast Handler ---
    const showToast = useCallback((type, message) => {
        setCurrentToast({ type, message });
        setTimeout(() => setCurrentToast(null), 3000);
    }, []);
    
    // --- Ambil Token Saat Inisialisasi ---
    useEffect(() => {
        const t = localStorage.getItem('token');
        if (t) setToken(t);
    }, []);
    
    // 🔥 PERBAIKAN UTAMA: Menggunakan endpoint Admin /all
    const fetchBlog = useCallback(async () => {
        if (!token) return; 
        setIsLoading(true);
        try {
            // Menggunakan endpoint Admin /transaksi-blog/all 
            // agar data DRAFT dan PUBLISHED terambil SEMUA.
            const res = await axios.get(`${API_BASE_URL}/transaksi-blog/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setBlogList(res.data.data || res.data || []);
            // Menampilkan notifikasi sukses pengambilan data jika berhasil
            // showToast('success', 'Data blog berhasil dimuat.'); 
        } catch (err) {
            console.error("Gagal memuat data blog:", err);
            // Menangani error 401/403 (Token Invalid)
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                 showToast('error', 'Sesi berakhir atau token tidak valid. Silakan login kembali.');
                 // Di sini Anda mungkin ingin menambahkan logic redirect ke halaman login
            } else {
                 showToast('error', 'Gagal memuat data blog. Pastikan server berjalan dan path "/transaksi-blog/all" benar.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [token, showToast]);

    // --- Panggil fetch saat token tersedia ---
    useEffect(() => {
        if (token) {
            fetchBlog();
        }
    }, [token, fetchBlog]); 

    // --- Modal Handlers ---
    const handleCloseModal = useCallback(() => {
        setDialogMode(null);
        setSelectedBlog(null);
    }, []);

    const handleFormSuccess = useCallback(() => {
        // Refresh data blog setelah sukses
        fetchBlog();
        handleCloseModal(); // Tutup modal setelah sukses
    }, [fetchBlog, handleCloseModal]);

    // --- Delete Handler ---
    const confirmDeletion = useCallback((blog) => {
        setConfirmDeleteBlog(blog);
    }, []);

    const handleDelete = async () => {
        const blog = confirmDeleteBlog;
        if (!blog) return;

        try {
            await axios.delete(`${API_BASE_URL}/transaksi-blog/${blog.BLOG_ID}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            showToast('success', `Postingan blog "${blog.TITLE}" berhasil dihapus.`);
            setBlogList((prev) => prev.filter((p) => p.BLOG_ID !== blog.BLOG_ID)); 
        } catch (err) {
            console.error("Gagal menghapus blog:", err);
            showToast('error', 'Gagal menghapus blog. Pastikan ID dan izin benar.');
        } finally {
            setConfirmDeleteBlog(null);
        }
    };

    // --- Filter Data Blog ---
    const filteredBlog = useMemo(() => {
        if (!searchTerm) return blogList;
        const lowerCaseSearch = searchTerm.toLowerCase();
        
        return blogList.filter(item => {
            const isTitleMatch = item.TITLE?.toLowerCase().includes(lowerCaseSearch);
            const isCategoryMatch = item.CATEGORY?.toLowerCase().includes(lowerCaseSearch);
            const isAuthorNameMatch = item.AUTHOR_NAME?.toLowerCase().includes(lowerCaseSearch);
            const isSlugMatch = item.SLUG?.toLowerCase().includes(lowerCaseSearch);
            
            return isTitleMatch || isCategoryMatch || isAuthorNameMatch || isSlugMatch;
        });
    }, [blogList, searchTerm]);

    // --- Template Kolom Aksi ---
    const actionBodyTemplate = (rowData) => (
        <div className="flex gap-2 justify-center">
            <button
                className="p-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition duration-150 text-sm shadow-md"
                title="Edit Blog"
                onClick={() => {
                    setSelectedBlog(rowData);
                    setDialogMode('edit');
                }}
            >
                <span className="font-bold">E</span>
            </button>
            <button
                className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition duration-150 text-sm shadow-md"
                title="Hapus Blog"
                onClick={() => confirmDeletion(rowData)}
            >
                <span className="font-bold">X</span>
            </button>
        </div>
    );

    // --- DEFINISI KOLOM UNTUK DATATABLE ---
    const columns = [
        { field: 'BLOG_ID', header: 'ID', style: { width: '60px' } },
        { field: 'TITLE', header: 'Judul Postingan', filter: true, style: { minWidth: '250px' } },
        { field: 'AUTHOR_NAME', header: 'Penulis', style: { width: '150px' } }, 
        { field: 'CATEGORY', header: 'Kategori', style: { width: '120px' } },
        { field: 'VIEW_COUNT', header: 'Views', style: { width: '80px', textAlign: 'center' } },
        { 
            field: 'PUBLISHED_DATE', 
            header: 'Tanggal Publish', 
            body: (row) => formatDate(row.PUBLISHED_DATE || row.created_at),
            style: { width: '130px' }
        },
        { 
            field: 'STATUS', 
            header: 'Status', 
            body: (row) => getStatusBadge(row.STATUS),
            style: { width: '100px', textAlign: 'center' }
        },
        { 
            header: 'Aksi',
            body: actionBodyTemplate,
            style: { width: '120px', textAlign: 'center' },
        },
    ];

    return (
        <div className="p-6 bg-gray-50 dark:bg-[#1E293B] min-h-screen">
            <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 lg:p-8">
                
                {/* Header */}
                <header className="mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">✍️ Manajemen Postingan Blog</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Kelola konten blog, penulis, dan status publikasi berdasarkan data tabel.</p>
                </header>

                {/* Kontrol dan Tombol Tambah */}
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <div className="relative w-full sm:w-1/2 lg:w-1/3">
                        <input
                            type="text"
                            placeholder="Cari Judul, Penulis, atau Kategori..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition duration-150"
                        />
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>

                    <button
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150 shadow-md flex items-center gap-2"
                        onClick={() => {
                            setDialogMode('add');
                            setSelectedBlog(null);
                        }}
                    >
                        <span className="text-xl leading-none">+</span>
                        Tambah Postingan Baru
                    </button>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <CustomDataTable 
                        data={filteredBlog} 
                        loading={isLoading} 
                        columns={columns} 
                    />
                </div>

                {/* Modal Form Blog */}
                <BlogFormModal
                    isOpen={dialogMode !== null}
                    onClose={handleCloseModal}
                    data={selectedBlog}
                    mode={dialogMode}
                    onSuccess={handleFormSuccess} 
                />

                {/* Modal Konfirmasi Hapus */}
                <CustomModal
                    isOpen={confirmDeleteBlog !== null}
                    onClose={() => setConfirmDeleteBlog(null)}
                    title="Konfirmasi Hapus Postingan"
                    size="sm"
                    footer={
                        <>
                            <button 
                                onClick={() => setConfirmDeleteBlog(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleDelete}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-150 shadow-md"
                            >
                                Hapus Permanen
                            </button>
                        </>
                    }
                >
                    <p className="text-gray-700 dark:text-gray-300">
                        Apakah Anda yakin ingin menghapus postingan 
                        <span className="font-bold text-red-600"> {confirmDeleteBlog?.TITLE}</span>? 
                        Tindakan ini akan menghapus postingan secara permanen.
                    </p>
                </CustomModal>

                <Toast toast={currentToast} />
            </div>
        </div>
    );
}