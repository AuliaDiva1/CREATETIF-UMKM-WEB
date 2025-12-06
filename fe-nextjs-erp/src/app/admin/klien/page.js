'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import KlienFormModal from './components/KlienFormModal'; 
import CustomDataTable from '../../../components/DataTable'; 
// Menambahkan impor ikon dari lucide-react
import { Users, CheckCircle, AlertTriangle, Loader2, Search, Plus } from 'lucide-react'; 

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// --- Komponen Pembantu (Toast dan CustomModal) ---

const Toast = ({ toast }) => {
    if (!toast) return null;

    const baseStyle = "fixed bottom-5 right-5 p-4 rounded-xl shadow-2xl text-white transition-opacity duration-300 z-[1000] max-w-sm";
    const style = toast.type === 'success' ? "bg-green-600" : "bg-red-600";
    
    // Mengganti ikon SVG lama dengan ikon lucide-react
    const iconSVG = toast.type === 'success' 
        ? (<CheckCircle className="h-6 w-6" />) 
        : (<AlertTriangle className="h-6 w-6" />);

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

export default function KlienPage() {
    const [klienList, setKlienList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedKlien, setSelectedKlien] = useState(null);
    const [dialogMode, setDialogMode] = useState(null); 
    const [token, setToken] = useState('');
    const [confirmDeleteKlien, setConfirmDeleteKlien] = useState(null); 
    const [currentToast, setCurrentToast] = useState(null); 
    const [searchTerm, setSearchTerm] = useState(''); 

    const showToast = useCallback((type, message) => {
        setCurrentToast({ type, message });
        setTimeout(() => setCurrentToast(null), 3000);
    }, []);

    useEffect(() => {
        const t = localStorage.getItem('token');
        if (t) setToken(t);
    }, []);

    const fetchKlien = useCallback(async () => {
        if (!token) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/master-klien`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setKlienList(res.data.data || []);
        } catch (err) {
            console.error("Gagal memuat data klien:", err);
            showToast('error', 'Gagal memuat data klien.');
        } finally {
            setIsLoading(false);
        }
    }, [token, showToast]);

    useEffect(() => {
        if(token) {
            fetchKlien();
        }
    }, [token, fetchKlien]); 

    const handleCloseModal = useCallback(() => {
        setDialogMode(null);
        setSelectedKlien(null);
    }, []);

    const handleSubmit = async (payload) => {
        if (!dialogMode) return;

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            let successMessage = '';
            let newKlienId = selectedKlien?.KLIEN_ID || 'baru';

            if (dialogMode === 'add') {
                const res = await axios.post(`${API_BASE_URL}/master-klien`, payload, config);
                newKlienId = res.data.data?.KLIEN_ID || 'baru';
                successMessage = `Klien ID ${newKlienId} berhasil ditambahkan.`;
            } else if (dialogMode === 'edit' && selectedKlien) {
                const { password, ...updateData } = payload;
                await axios.put(`${API_BASE_URL}/master-klien/${selectedKlien.KLIEN_ID}`, updateData, config);
                successMessage = `Data klien ID ${selectedKlien.KLIEN_ID} berhasil diperbarui.`;
            }
            
            fetchKlien(); 
            handleCloseModal();
            showToast('success', successMessage);
        } catch (err) {
            console.error("Gagal menyimpan klien:", err);
            const msg = err.response?.data?.message || 'Gagal menyimpan data.';
            showToast('error', msg);
        }
    };

    const confirmDeletion = useCallback((klien) => {
        setConfirmDeleteKlien(klien);
    }, []);

    const handleDelete = async () => {
        const klien = confirmDeleteKlien;
        if (!klien) return;

        try {
            await axios.delete(`${API_BASE_URL}/master-klien/${klien.KLIEN_ID}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showToast('success', `Klien "${klien.NAMA}" berhasil dihapus.`);
            setKlienList((prev) => prev.filter((k) => k.KLIEN_ID !== klien.KLIEN_ID)); 
        } catch (err) {
            console.error("Gagal menghapus klien:", err);
            showToast('error', 'Gagal menghapus klien.');
        } finally {
            setConfirmDeleteKlien(null);
        }
    };

    const filteredKlien = useMemo(() => {
        if (!searchTerm) return klienList;
        const lowerCaseSearch = searchTerm.toLowerCase();
        return klienList.filter(item =>
            item.NAMA?.toLowerCase().includes(lowerCaseSearch) ||
            item.EMAIL?.toLowerCase().includes(lowerCaseSearch) ||
            item.NO_TELP?.toLowerCase().includes(lowerCaseSearch) ||
            item.ALAMAT?.toLowerCase().includes(lowerCaseSearch)
        );
    }, [klienList, searchTerm]);

    const actionBodyTemplate = (rowData) => (
        <div className="flex gap-2 justify-center">
            <button
                className="p-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition duration-150 text-sm shadow-md"
                title="Edit Klien"
                onClick={() => {
                    setSelectedKlien(rowData);
                    setDialogMode('edit');
                }}
            >
                <span className="font-bold">E</span>
            </button>
            <button
                className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition duration-150 text-sm shadow-md"
                title="Hapus Klien"
                onClick={() => confirmDeletion(rowData)}
            >
                <span className="font-bold">X</span>
            </button>
        </div>
    );

    const columns = [
        { field: 'KLIEN_ID', header: 'ID', style: { width: '60px' } },
        { field: 'NAMA', header: 'Nama Klien/Perusahaan', filter: true, style: { minWidth: '200px' } },
        { field: 'EMAIL', header: 'Email (User)', filter: true, style: { minWidth: '180px' } },
        { field: 'NO_TELP', header: 'No. Telepon', style: { width: '150px' } },
        { 
            field: 'ALAMAT', 
            header: 'Alamat', 
            body: (row) => <span className="truncate block max-w-xs" title={row.ALAMAT}>{row.ALAMAT}</span>,
            style: { minWidth: '250px' }
        },
        {
            header: 'Aksi',
            body: actionBodyTemplate,
            style: { width: '100px', textAlign: 'center' },
        },
    ];

    return (
        <div className="p-6 bg-gray-50 dark:bg-[#1E293B] min-h-screen">
            <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 lg:p-8">
                
                {/* Header dengan Ikon */}
                <header className="mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center">
                        <Users className="w-8 h-8 mr-3 text-blue-600" /> Master Data Klien
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Kelola data pelanggan dan akun login mereka.</p>
                </header>

                {/* Kontrol dan Tombol Tambah dengan Styling yang Diperbarui */}
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <div className="relative w-full sm:w-1/2 lg:w-1/3">
                        <input
                            type="text"
                            placeholder="Cari klien (Nama, Email, Alamat)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition duration-150"
                        />
                        {/* Ikon Pencarian */}
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>

                    <button
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150 shadow-md flex items-center gap-2"
                        onClick={() => {
                            setDialogMode('add');
                            setSelectedKlien(null);
                        }}
                    >
                        <Plus className="w-5 h-5" />
                        Tambah Klien
                    </button>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-40 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <Loader2 className="animate-spin w-8 h-8 text-blue-600 mr-3" />
                            <p className="text-lg text-gray-600 dark:text-gray-300">Memuat data klien...</p>
                        </div>
                    ) : (
                        <CustomDataTable 
                            data={filteredKlien} 
                            loading={isLoading} 
                            columns={columns} 
                            uniqueIdField="KLIEN_ID"
                        />
                    )}
                </div>

                {/* Modal Form Klien */}
                <KlienFormModal
                    isOpen={dialogMode !== null}
                    onClose={handleCloseModal}
                    klien={selectedKlien}
                    mode={dialogMode}
                    onSubmit={handleSubmit} 
                />

                {/* Modal Konfirmasi Hapus */}
                <CustomModal
                    isOpen={confirmDeleteKlien !== null}
                    onClose={() => setConfirmDeleteKlien(null)}
                    title="Konfirmasi Hapus Klien"
                    size="sm"
                    footer={
                        <>
                            <button 
                                onClick={() => setConfirmDeleteKlien(null)}
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
                        Apakah Anda yakin ingin menghapus klien 
                        <span className="font-bold text-red-600"> {confirmDeleteKlien?.NAMA}</span>? 
                        <br/>
                        <span className="text-xs text-red-500 mt-2 block">
                            *Data user login terkait juga akan dihapus.
                        </span>
                    </p>
                </CustomModal>

                <Toast toast={currentToast} />
            </div>
        </div>
    );
}