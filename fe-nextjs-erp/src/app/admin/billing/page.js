'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
// Menggunakan komponen yang baru dibuat
import CustomDataTable from '../../../components/DataTable'
import BillingFormModal from './components/BillingFormModal'; 
import { AlertTriangle, CheckCircle, Loader2, DollarSign } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// --- Komponen Pembantu (Toast dan CustomModal) ---

const Toast = ({ toast }) => {
    if (!toast) return null;

    const baseStyle = "fixed bottom-5 right-5 p-4 rounded-xl shadow-2xl text-white transition-opacity duration-300 z-[1000] max-w-sm";
    const style = toast.type === 'success' ? "bg-green-600" : "bg-red-600";
    
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

// CustomModal dihilangkan karena BillingFormModal sudah memiliki logikanya sendiri
// Jika CustomModal ingin dipakai untuk konfirmasi hapus, perlu dipertahankan.
// Asumsi: CustomModal digunakan hanya untuk konfirmasi hapus.

const CustomModal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
    if (!isOpen) return null;

    const widthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-xl',
        lg: 'max-w-3xl',
        xl: 'max-w-5xl',
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
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

// Fungsi untuk styling badge status pembayaran
const getStatusBadge = (status) => {
    let classes = "px-3 py-1 text-xs font-semibold rounded-full";
    // Menggunakan STATUS_TAGIHAN (Draft, Sent, Paid, Overdue, Cancelled)
    switch (status) {
        case 'Paid':
            classes += " bg-green-100 text-green-800";
            break;
        case 'Overdue':
            classes += " bg-red-100 text-red-800";
            break;
        case 'Sent':
            classes += " bg-yellow-100 text-yellow-800";
            break;
        case 'Draft':
            classes += " bg-blue-100 text-blue-800";
            break;
        case 'Cancelled':
            classes += " bg-gray-100 text-gray-800";
            break;
        default:
            classes += " bg-purple-100 text-purple-800";
    }
    return <span className={classes}>{status || 'N/A'}</span>;
};

// Fungsi untuk memformat nilai mata uang
const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(Math.round(amount));
};

// Fungsi untuk memformat tanggal
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        // Mengambil hanya bagian tanggal (YYYY-MM-DD) jika ada timestamp, lalu format.
        const datePart = dateString.split(' ')[0]; 
        return new Date(datePart).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (e) {
        return 'Format Salah';
    }
}


export default function BillingPage() {
    const [billingList, setBillingList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedBilling, setSelectedBilling] = useState(null);
    const [dialogMode, setDialogMode] = useState(null); // 'add' atau 'edit'
    const [token, setToken] = useState(''); 
    const [confirmDeleteBilling, setConfirmDeleteBilling] = useState(null); 
    const [currentToast, setCurrentToast] = useState(null); 
    const [searchTerm, setSearchTerm] = useState(''); 
    
    // State untuk menyimpan map PROJEK_ID ke NAMA_PROJEK
    const [projekMap, setProjekMap] = useState({});
    // State untuk menyimpan list project lengkap (untuk dropdown di modal)
    const [projekDataList, setProjekDataList] = useState([]);


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
    
    // --- FUNCTION: Fetch Data Proyek Master (Lookup Table) ---
    const fetchProjek = useCallback(async () => {
        if (!token) return;
        try {
            const res = await axios.get(`${API_BASE_URL}/transaksi-projek`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const listProjek = res.data.data || res.data || [];
            
            setProjekDataList(listProjek);

            const map = listProjek.reduce((acc, projek) => {
                acc[projek.PROJEK_ID] = projek.NAMA_PROJEK;
                return acc;
            }, {});
            setProjekMap(map);
        } catch (err) {
            console.error("Gagal memuat data proyek master:", err);
        }
    }, [token]);

    // --- Fetch Data Billing ---
    const fetchBilling = useCallback(async () => {
        if (!token) return; 
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/transaksi-billing`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Asumsi data yang diterima memiliki field seperti di tabel skema
            setBillingList(res.data.data || res.data || []); 
        } catch (err) {
            console.error("Gagal memuat data billing:", err);
            showToast('error', 'Gagal memuat data billing.');
        } finally {
            setIsLoading(false);
        }
    }, [token, showToast]);

    // --- Panggil kedua fetch saat token tersedia ---
    useEffect(() => {
        if (token) {
            fetchProjek();
            fetchBilling();
        }
    }, [token, fetchBilling, fetchProjek]); 

    // --- Modal Handlers ---
    const handleCloseModal = useCallback(() => {
        setDialogMode(null);
        setSelectedBilling(null);
    }, []);

    // 🔥 PERBAIKAN LOGIKA: Mengambil ID yang benar untuk Toast
    const handleFormSuccess = useCallback((data) => {
        const mode = dialogMode; // Ambil mode dari state saat sukses dipanggil

        // Tentukan ID yang akan ditampilkan. Ambil dari respons data jika ada, 
        // atau dari data yang sedang diedit jika mode 'edit', atau default 'baru'
        const tagihanId = data?.BILLING_ID || selectedBilling?.BILLING_ID || 'baru';

        // Refresh data billing setelah sukses
        fetchBilling();

        showToast(
            'success', 
            `Tagihan ID ${tagihanId} berhasil di${mode === 'add' ? 'tambahkan' : 'update'}.`
        );
    }, [fetchBilling, showToast, dialogMode, selectedBilling]);

    // --- Delete Handler ---
    const confirmDeletion = useCallback((billing) => {
        setConfirmDeleteBilling(billing);
    }, []);

    const handleDelete = async () => {
        const billing = confirmDeleteBilling;
        if (!billing || !token) return;

        try {
            await axios.delete(`${API_BASE_URL}/transaksi-billing/${billing.BILLING_ID}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showToast('success', `Tagihan ID ${billing.BILLING_ID} berhasil dihapus.`);
            setBillingList((prev) => prev.filter((b) => b.BILLING_ID !== billing.BILLING_ID)); 
        } catch (err) {
            console.error("Gagal menghapus billing:", err);
            showToast('error', 'Gagal menghapus tagihan.');
        } finally {
            setConfirmDeleteBilling(null);
        }
    };

    // --- Filter Data Billing menggunakan projekMap ---
    const filteredBilling = useMemo(() => {
        if (!searchTerm) return billingList;
        const lowerCaseSearch = searchTerm.toLowerCase();
        
        return billingList.filter(item => {
            // Cek ID Tagihan
            const isIdMatch = item.BILLING_ID?.toString().toLowerCase().includes(lowerCaseSearch);
            // Cek Nomor Invoice
            const isNomorInvoiceMatch = item.NOMOR_INVOICE?.toLowerCase().includes(lowerCaseSearch);
            // Cek Status Tagihan
            const isStatusMatch = item.STATUS_TAGIHAN?.toLowerCase().includes(lowerCaseSearch);
            // Cek Nama Proyek menggunakan PROJEK_ID
            const projectName = projekMap[item.PROJEK_ID]; 
            const isProjectNameMatch = projectName?.toLowerCase().includes(lowerCaseSearch);
            // Cek Catatan (Keterangan)
            const isCatatanMatch = item.CATATAN?.toLowerCase().includes(lowerCaseSearch);

            return isIdMatch || isNomorInvoiceMatch || isStatusMatch || isProjectNameMatch || isCatatanMatch;
        });
    }, [billingList, searchTerm, projekMap]); 

    // --- Template Kolom Aksi untuk DataTable ---
    const actionBodyTemplate = (rowData) => (
        <div className="flex gap-2 justify-center">
            <button
                className="p-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition duration-150 text-sm shadow-md"
                title="Edit Tagihan"
                onClick={() => {
                    setSelectedBilling(rowData);
                    setDialogMode('edit');
                }}
            >
                <span className="font-bold">E</span>
            </button>
            <button
                className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition duration-150 text-sm shadow-md"
                title="Hapus Tagihan"
                onClick={() => confirmDeletion(rowData)}
            >
                <span className="font-bold">X</span>
            </button>
        </div>
    );

    // --- Definisi Kolom untuk CustomDataTable (Billing) ---
    const columns = [
        { field: 'BILLING_ID', header: 'ID', style: { width: '60px' } },
        { 
            field: 'NOMOR_INVOICE', 
            header: 'Nomor Tagihan', 
            style: { minWidth: '150px' }
        },
        // Menggunakan PROJEK_ID untuk lookup nama proyek
        { 
            field: 'PROJEK_ID', 
            header: 'Proyek', 
            body: (row) => projekMap[row.PROJEK_ID] || 'Proyek Tidak Ditemukan', 
            style: { minWidth: '200px' }
        }, 
        // Menggunakan TANGGAL_TAGIHAN dan memformatnya
        { 
            field: 'TANGGAL_TAGIHAN', 
            header: 'Tgl. Tagihan', 
            body: (row) => formatDate(row.TANGGAL_TAGIHAN),
            style: { width: '120px' }
        },
        // Menggunakan TANGGAL_JATUH_TEMPO dan memformatnya
        { 
            field: 'TANGGAL_JATUH_TEMPO', 
            header: 'Jatuh Tempo', 
            body: (row) => formatDate(row.TANGGAL_JATUH_TEMPO),
            style: { width: '120px' }
        },
        // Menggunakan JUMLAH_TAGIHAN dan memformatnya ke IDR
        { 
            field: 'JUMLAH_TAGIHAN', 
            header: 'Nilai Tagihan', 
            body: (row) => formatCurrency(row.JUMLAH_TAGIHAN),
            style: { textAlign: 'right', minWidth: '150px' }
        },
        // Menggunakan STATUS_TAGIHAN dan badge
        { 
            field: 'STATUS_TAGIHAN', 
            header: 'Status', 
            body: (row) => getStatusBadge(row.STATUS_TAGIHAN),
            style: { width: '140px', textAlign: 'center' }
        },
        // Menggunakan CATATAN (Keterangan)
        { 
            field: 'CATATAN', 
            header: 'Keterangan', 
            body: (row) => row.CATATAN ? row.CATATAN.substring(0, 50) + (row.CATATAN.length > 50 ? '...' : '') : '-', 
            style: { maxWidth: '250px', overflow: 'hidden' }
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
                
                {/* Header */}
                <header className="mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center">
                        <DollarSign className="w-8 h-8 mr-2 text-blue-600" /> Transaksi Data Billing (Tagihan)
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Kelola semua tagihan yang diterbitkan, tanggal jatuh tempo, dan status pembayaran.</p>
                </header>

                {/* Kontrol dan Tombol Tambah */}
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <div className="relative w-full sm:w-1/2 lg:w-1/3">
                        <input
                            type="text"
                            placeholder="Cari tagihan (Nomor, Proyek, Status)..."
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
                            setSelectedBilling(null);
                        }}
                    >
                        <span className="text-xl leading-none font-light">+</span>
                        Tambah Tagihan
                    </button>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-40 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <Loader2 className="animate-spin w-8 h-8 text-blue-600 mr-3" />
                            <p className="text-lg text-gray-600 dark:text-gray-300">Memuat data billing...</p>
                        </div>
                    ) : (
                        <CustomDataTable 
                            data={filteredBilling} 
                            loading={isLoading} 
                            columns={columns} 
                            uniqueIdField="BILLING_ID"
                        />
                    )}
                </div>

                {/* Modal Form Billing */}
                {/* Note: BillingFormModal sudah dipanggil dengan 'isOpen={dialogMode !== null}', tidak perlu prop 'projekData' lagi 
                    karena modal sudah fetch sendiri, tapi kita biarkan dulu jika ada perbedaan implementasi. */}
                <BillingFormModal
                    isOpen={dialogMode !== null}
                    onClose={handleCloseModal}
                    data={selectedBilling}
                    mode={dialogMode}
                    onSuccess={handleFormSuccess} // Trigger fetch data setelah sukses
                    // projekData={projekDataList} // Prop ini kemungkinan tidak diperlukan jika modal fetch sendiri
                />

                {/* Modal Konfirmasi Hapus */}
                <CustomModal
                    isOpen={confirmDeleteBilling !== null}
                    onClose={() => setConfirmDeleteBilling(null)}
                    title="Konfirmasi Hapus Tagihan"
                    size="sm"
                    footer={
                        <>
                            <button 
                                onClick={() => setConfirmDeleteBilling(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleDelete}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-150 shadow-md"
                            >
                                Hapus Tagihan
                            </button>
                        </>
                    }
                >
                    <p className="text-gray-700 dark:text-gray-300">
                        Apakah Anda yakin ingin menghapus tagihan <span className="font-bold text-red-600">{confirmDeleteBilling?.NOMOR_INVOICE}</span> 
                        {confirmDeleteBilling?.PROJEK_ID && 
                            ` untuk proyek `}
                        <span className="font-bold"> {projekMap[confirmDeleteBilling?.PROJEK_ID] || ''}</span>?
                        Tindakan ini tidak dapat dibatalkan.
                    </p>
                </CustomModal>

                <Toast toast={currentToast} />
            </div>
        </div>
    );
}