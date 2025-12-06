'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import CustomDataTable from '../../../components/DataTable';
import ProjekFormModal from './components/ProjekFormModal'; // Menggunakan modal yang Anda buat
import { AlertTriangle, CheckCircle } from 'lucide-react';

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
    switch (status) {
        case 'Completed':
            classes += " bg-green-100 text-green-800";
            break;
        case 'In Progress':
            classes += " bg-blue-100 text-blue-800";
            break;
        case 'Pending Review':
            classes += " bg-yellow-100 text-yellow-800";
            break;
        case 'Cancelled':
            classes += " bg-red-100 text-red-800";
            break;
        default:
            classes += " bg-gray-100 text-gray-800";
    }
    return <span className={classes}>{status}</span>;
};

// Fungsi untuk memformat nilai mata uang
const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) return 'N/A';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};


export default function ProjekPage() {
    const [projekList, setProjekList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProjek, setSelectedProjek] = useState(null);
    const [dialogMode, setDialogMode] = useState(null); // 'add' atau 'edit'
    const [token, setToken] = useState(''); 
    const [confirmDeleteProjek, setConfirmDeleteProjek] = useState(null); 
    const [currentToast, setCurrentToast] = useState(null); 
    const [searchTerm, setSearchTerm] = useState(''); 
    
    // 🔥 NEW STATE: Untuk menyimpan map KLIEN_ID ke NAMA Klien
    const [klienMap, setKlienMap] = useState({});

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
    
    // --- 🔥 NEW FUNCTION: Fetch Data Klien Master ---
    const fetchKlien = useCallback(async () => {
        if (!token) return;
        try {
            // Asumsi endpoint untuk mengambil semua klien master
            const res = await axios.get(`${API_BASE_URL}/master-klien`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const listKlien = res.data.data || res.data || [];
            
            // Buat map (KLIEN_ID -> NAMA) untuk lookup cepat O(1)
            const map = listKlien.reduce((acc, klien) => {
                acc[klien.KLIEN_ID] = klien.NAMA;
                return acc;
            }, {});
            setKlienMap(map);
        } catch (err) {
            console.error("Gagal memuat data klien master:", err);
            // Tidak perlu toast error besar di sini, karena ini hanya data lookup
        }
    }, [token]);

    // --- Fetch Data Proyek ---
    const fetchProjek = useCallback(async () => {
        if (!token) return; 
        setIsLoading(true);
        try {
            // Asumsi endpoint untuk mengambil semua proyek adalah /transaksi-projek
            const res = await axios.get(`${API_BASE_URL}/transaksi-projek`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Mengasumsikan response API memberikan KLIEN_ID, dan NAMA (jika join di backend)
            // Jika backend TIDAK join, NAMA akan diisi saat rendering menggunakan klienMap
            setProjekList(res.data.data || res.data || []);
        } catch (err) {
            console.error("Gagal memuat data proyek:", err);
            showToast('error', 'Gagal memuat data proyek.');
        } finally {
            setIsLoading(false);
        }
    }, [token, showToast]);

    // --- Panggil kedua fetch saat token tersedia ---
    useEffect(() => {
        if (token) {
            fetchKlien();
            fetchProjek();
        }
    }, [token, fetchProjek, fetchKlien]); 

    // --- Modal Handlers ---
    const handleCloseModal = useCallback(() => {
        setDialogMode(null);
        setSelectedProjek(null);
    }, []);

    const handleFormSuccess = useCallback(() => {
        // Refresh data proyek setelah sukses
        fetchProjek();
    }, [fetchProjek]);

    // --- Delete Handler ---
    const confirmDeletion = useCallback((projek) => {
        setConfirmDeleteProjek(projek);
    }, []);

    const handleDelete = async () => {
        const projek = confirmDeleteProjek;
        if (!projek) return;

        try {
            await axios.delete(`${API_BASE_URL}/transaksi-projek/${projek.PROJEK_ID}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showToast('success', `Proyek "${projek.NAMA_PROJEK}" berhasil dihapus.`);
            setProjekList((prev) => prev.filter((p) => p.PROJEK_ID !== projek.PROJEK_ID)); 
        } catch (err) {
            console.error("Gagal menghapus proyek:", err);
            showToast('error', 'Gagal menghapus proyek.');
        } finally {
            setConfirmDeleteProjek(null);
        }
    };

    // --- 🔥 MODIFIED: Filter Data Proyek menggunakan klienMap ---
    const filteredProjek = useMemo(() => {
        if (!searchTerm) return projekList;
        const lowerCaseSearch = searchTerm.toLowerCase();
        
        return projekList.filter(item => {
            // Cek nama proyek
            const isProjectNameMatch = item.NAMA_PROJEK?.toLowerCase().includes(lowerCaseSearch);
            // Cek status
            const isStatusMatch = item.STATUS?.toLowerCase().includes(lowerCaseSearch);
            
            // Cek nama klien menggunakan KLIEN_ID
            const klienName = klienMap[item.KLIEN_ID]; 
            const isKlienNameMatch = klienName?.toLowerCase().includes(lowerCaseSearch);
            
            // Cek ID klien (jika user mencari ID)
            const isKlienIdMatch = item.KLIEN_ID?.toString().toLowerCase().includes(lowerCaseSearch);

            return isProjectNameMatch || isKlienNameMatch || isStatusMatch || isKlienIdMatch;
        });
    }, [projekList, searchTerm, klienMap]); // Dependency klienMap penting!

    // --- Template Kolom Aksi untuk DataTable ---
    const actionBodyTemplate = (rowData) => (
        <div className="flex gap-2 justify-center">
            <button
                className="p-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition duration-150 text-sm shadow-md"
                title="Edit Proyek"
                onClick={() => {
                    setSelectedProjek(rowData);
                    setDialogMode('edit');
                }}
            >
                <span className="font-bold">E</span>
            </button>
            <button
                className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition duration-150 text-sm shadow-md"
                title="Hapus Proyek"
                onClick={() => confirmDeletion(rowData)}
            >
                <span className="font-bold">X</span>
            </button>
        </div>
    );

    // --- 🔥 MODIFIED: Definisi Kolom untuk CustomDataTable ---
    const columns = [
        { field: 'PROJEK_ID', header: 'ID', style: { width: '60px' } },
        { field: 'NAMA_PROJEK', header: 'Nama Proyek', filter: true },
        // 🔥 Perubahan di sini: Mengambil nama dari klienMap berdasarkan KLIEN_ID
        { 
            field: 'KLIEN_ID', // Field dasar yang digunakan tetap KLIEN_ID
            header: 'Klien', 
            // Menggunakan klienMap untuk mencari NAMA
            body: (row) => klienMap[row.KLIEN_ID] || row.NAMA || 'N/A', 
            filter: true 
        }, 
        { 
            field: 'TANGGAL_MULAI', 
            header: 'Mulai', 
            body: (row) => row.TANGGAL_MULAI ? new Date(row.TANGGAL_MULAI).toLocaleDateString('id-ID') : 'N/A'
        },
        { 
            field: 'TANGGAL_SELESAI', 
            header: 'Target Selesai', 
            body: (row) => row.TANGGAL_SELESAI ? new Date(row.TANGGAL_SELESAI).toLocaleDateString('id-ID') : 'N/A'
        },
        { 
            field: 'NILAI_PROJEK', 
            header: 'Nilai Proyek', 
            body: (row) => formatCurrency(row.NILAI_PROJEK),
            style: { textAlign: 'right' }
        },
        { 
            field: 'STATUS', 
            header: 'Status', 
            body: (row) => getStatusBadge(row.STATUS),
            style: { textAlign: 'center' }
        },
        { 
            field: 'PROGRESS', 
            header: 'Progress', 
            body: (row) => `${row.PROGRESS}%`,
            style: { width: '80px', textAlign: 'center' } 
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
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">🗓️ Transaksi Data Proyek</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Kelola semua daftar proyek, status, dan progres.</p>
                </header>

                {/* Kontrol dan Tombol Tambah */}
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <div className="relative w-full sm:w-1/2 lg:w-1/3">
                        <input
                            type="text"
                            placeholder="Cari proyek (Nama, Klien, Status)..."
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
                            setSelectedProjek(null);
                        }}
                    >
                        <span className="text-xl leading-none">+</span>
                        Tambah Proyek
                    </button>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <CustomDataTable 
                        data={filteredProjek} 
                        loading={isLoading} 
                        columns={columns} 
                    />
                </div>

                {/* Modal Form Proyek */}
                <ProjekFormModal
                    isOpen={dialogMode !== null}
                    onClose={handleCloseModal}
                    data={selectedProjek}
                    mode={dialogMode}
                    onSuccess={handleFormSuccess} // Trigger fetch data setelah sukses
                    // 🔥 NEW PROP: Kirim klienMap ke modal agar dropdown klien bisa diisi
                    klienData={Object.entries(klienMap).map(([id, name]) => ({
                        KLIEN_ID: id,
                        NAMA: name,
                    }))}
                />

                {/* Modal Konfirmasi Hapus */}
                <CustomModal
                    isOpen={confirmDeleteProjek !== null}
                    onClose={() => setConfirmDeleteProjek(null)}
                    title="Konfirmasi Hapus Proyek"
                    size="sm"
                    footer={
                        <>
                            <button 
                                onClick={() => setConfirmDeleteProjek(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleDelete}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-150 shadow-md"
                            >
                                Hapus Proyek
                            </button>
                        </>
                    }
                >
                    <p className="text-gray-700 dark:text-gray-300">
                        Apakah Anda yakin ingin menghapus proyek 
                        <span className="font-bold text-red-600"> {confirmDeleteProjek?.NAMA_PROJEK}</span>? 
                        Tindakan ini tidak dapat dibatalkan.
                    </p>
                </CustomModal>

                <Toast toast={currentToast} />
            </div>
        </div>
    );
}