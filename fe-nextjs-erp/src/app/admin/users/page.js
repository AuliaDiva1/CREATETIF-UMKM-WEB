'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
// Impor ikon dari lucide-react
import { Users, CheckCircle, AlertTriangle, Edit, Trash2, Plus, Loader2, ClipboardEdit, Search } from 'lucide-react'; 
// Asumsi path impor ini benar sesuai struktur proyek Anda
import UserFormModal from './components/UserFormModal'; 
import { getUsers, createUser, updateUser, deleteUser } from './utils/api'; 
// Pastikan path ini benar
import CustomDataTable from '../../../components/DataTable'; 


// =========================================================
// Helper Component 1: Toast Notifier
// =========================================================

const Toast = ({ toast }) => {
    if (!toast) return null;

    const baseStyle = "fixed bottom-5 right-5 p-4 rounded-xl shadow-2xl text-white transition-opacity duration-300 z-[1000] max-w-sm";
    const style = toast.type === 'success' ? "bg-green-600" : "bg-red-600";
    const IconComponent = toast.type === 'success' ? CheckCircle : AlertTriangle;

    return (
        <div className={`${baseStyle} ${style}`}>
            <div className="flex items-start">
                <IconComponent className="h-6 w-6 mr-3 mt-0.5" />
                <span className="font-medium">{toast.message}</span>
            </div>
        </div>
    );
};

// =========================================================
// Helper Component 2: Custom Modal
// =========================================================

const CustomModal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
    if (!isOpen) return null;

    const widthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-xl',
        lg: 'max-w-3xl',
        xl: 'max-w-5xl',
    };

    return (
        // Overlay
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            {/* Modal Content */}
            <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full ${widthClasses[size]} transform transition-all duration-300 ease-out scale-100`}>
                <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-3xl leading-none transition-colors"
                        aria-label="Tutup Modal"
                    >
                        &times;
                    </button>
                </div>
                {/* Body Content */}
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    {children}
                </div>
                {/* Footer */}
                {footer && (
                    <div className="p-5 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-700 rounded-b-xl">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};


// =========================================================
// Main Component: UsersPage
// =========================================================

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [dialogMode, setDialogMode] = useState(null); 
    const [token, setToken] = useState('');
    const [confirmDeleteUser, setConfirmDeleteUser] = useState(null); 
    const [currentToast, setCurrentToast] = useState(null); 
    // State baru untuk search
    const [searchTerm, setSearchTerm] = useState(''); 

    const showToast = useCallback((type, message) => {
        setCurrentToast({ type, message });
        setTimeout(() => setCurrentToast(null), 3000);
    }, []);

    // ----------------------------------------------------
    // Authentication & Data Fetching
    // ----------------------------------------------------

    useEffect(() => {
        const t = localStorage.getItem('token');
        if (!t) {
            setToken('dummy-token'); 
        } else {
            setToken(t);
        }
    }, []);

    const fetchUsers = useCallback(async () => {
        const activeToken = token || localStorage.getItem('token') || 'dummy-token'; 
        if (!activeToken) return;

        setIsLoading(true);
        try {
            const res = await getUsers(activeToken); 
            setUsers(res || []); 
        } catch (err) {
            console.error("Gagal memuat data user:", err);
            showToast('error', 'Gagal memuat data user.');
        } finally {
            setIsLoading(false);
        }
    }, [token, showToast]);

    useEffect(() => {
        if (token) {
            fetchUsers();
        }
    }, [fetchUsers, token]); 

    // ----------------------------------------------------
    // Modal & CRUD Handlers
    // ----------------------------------------------------

    const handleCloseModal = useCallback(() => {
        setDialogMode(null);
        setSelectedUser(null);
    }, []);

    const handleSubmit = async (data) => {
        if (!dialogMode) return;

        try {
            if (dialogMode === 'add') {
                await createUser(token, data);
                showToast('success', 'User berhasil dibuat.');
            } else if ((dialogMode === 'edit' || dialogMode === 'lengkapi') && selectedUser) {
                await updateUser(token, selectedUser.id, data);
                showToast('success', 'User berhasil diupdate.');
            }
            
            fetchUsers(); 
            handleCloseModal();
        } catch (err) {
            console.error("Gagal menyimpan user:", err);
            const msg = err.response?.data?.message || 'Gagal menyimpan user.';
            showToast('error', msg);
        }
    };

    const confirmDeletion = useCallback((user) => {
        setConfirmDeleteUser(user);
    }, []);

    const handleDelete = async () => {
        const user = confirmDeleteUser;
        if (!user) return;

        try {
            await deleteUser(token, user.id);
            showToast('success', `User "${user.name}" berhasil dihapus.`);
            setUsers((prev) => prev.filter((u) => u.id !== user.id)); 
        } catch (err) {
            console.error("Gagal menghapus user:", err);
            showToast('error', 'Gagal menghapus user.');
        } finally {
            setConfirmDeleteUser(null);
        }
    };

    // ----------------------------------------------------
    // Filtering Logic (Ditambahkan)
    // ----------------------------------------------------
    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users;
        const lowerCaseSearch = searchTerm.toLowerCase();
        return users.filter(item =>
            item.name?.toLowerCase().includes(lowerCaseSearch) ||
            item.email?.toLowerCase().includes(lowerCaseSearch) ||
            item.role?.toLowerCase().includes(lowerCaseSearch) ||
            item.id?.toString().includes(lowerCaseSearch)
        );
    }, [users, searchTerm]);
    // ----------------------------------------------------

    // ----------------------------------------------------
    // DataTable Configuration
    // ----------------------------------------------------

    const actionBodyTemplate = (rowData) => (
        <div className="flex gap-2 justify-center">
            {/* Tombol Edit */}
            <button
                className="p-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition duration-150 shadow-md"
                title="Edit User"
                onClick={() => {
                    setSelectedUser(rowData);
                    setDialogMode('edit');
                }}
            >
                <Edit className="w-5 h-5" />
            </button>
            {/* Tombol Lengkapi Data */}
            <button
                className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition duration-150 shadow-md"
                title="Lengkapi Data"
                onClick={() => {
                    setSelectedUser(rowData);
                    setDialogMode('lengkapi');
                }}
            >
                <ClipboardEdit className="w-5 h-5" />
            </button>
            {/* Tombol Hapus */}
            <button
                className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition duration-150 shadow-md"
                title="Hapus User"
                onClick={() => confirmDeletion(rowData)}
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </div>
    );

    const userColumns = [
        { field: 'id', header: 'ID', style: { width: '60px' } },
        { field: 'name', header: 'Name', filter: true, style: { minWidth: '150px' } },
        { field: 'email', header: 'Email', filter: true, style: { minWidth: '200px' } },
        { field: 'role', header: 'Role', style: { width: '120px' } },
        {
            field: 'created_at',
            header: 'Created At',
            body: (row) => (row.created_at ? new Date(row.created_at).toLocaleString('id-ID') : '-'),
            style: { minWidth: '150px' }
        },
        {
            field: 'updated_at',
            header: 'Updated At',
            body: (row) => (row.updated_at ? new Date(row.updated_at).toLocaleString('id-ID') : '-'),
            style: { minWidth: '150px' }
        },
        {
            header: 'Actions',
            body: actionBodyTemplate,
            style: { width: '150px', textAlign: 'center' }, 
        },
    ];

    // ----------------------------------------------------
    // Render
    // ----------------------------------------------------

    return (
        <div className="p-6 bg-gray-50 dark:bg-[#1E293B] min-h-screen">
            <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 lg:p-8">
                
                <header className="mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center">
                         <Users className="w-8 h-8 mr-3 text-indigo-600" /> Manajemen Pengguna
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Kelola daftar lengkap semua akun pengguna dalam sistem.</p>
                </header>

                {/* Kontrol dan Tombol Tambah dengan Input Pencarian */}
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <div className="relative w-full sm:w-1/2 lg:w-1/3">
                        <input
                            type="text"
                            placeholder="Cari pengguna (Nama, Email, Role)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition duration-150"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>

                    <button
                        className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md flex items-center gap-2"
                        onClick={() => {
                            setDialogMode('add');
                            setSelectedUser(null);
                        }}
                    >
                        <Plus className="w-5 h-5" />
                        Tambah User Baru
                    </button>
                </div>

                {/* Area Data Table */}
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-40 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <Loader2 className="animate-spin w-8 h-8 text-indigo-600 mr-3" />
                            <p className="text-lg text-gray-600 dark:text-gray-300">Memuat data pengguna...</p>
                        </div>
                    ) : (
                        <CustomDataTable 
                            // Menggunakan data yang sudah difilter
                            data={filteredUsers} 
                            loading={isLoading} 
                            columns={userColumns} 
                        />
                    )}
                </div>

                {/* Modal Tambah/Edit/Lengkapi (UserFormModal) */}
                <UserFormModal
                    isOpen={dialogMode !== null}
                    onClose={handleCloseModal}
                    user={selectedUser}
                    onSubmit={handleSubmit}
                    mode={dialogMode}
                />

                {/* Modal Konfirmasi Hapus */}
                <CustomModal
                    isOpen={confirmDeleteUser !== null}
                    onClose={() => setConfirmDeleteUser(null)}
                    title="Konfirmasi Hapus Pengguna"
                    size="sm"
                    footer={
                        <>
                            <button 
                                onClick={() => setConfirmDeleteUser(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500"
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
                        Apakah Anda yakin ingin menghapus pengguna 
                        <span className="font-bold text-red-600"> {confirmDeleteUser?.name}</span>? 
                        Tindakan ini tidak dapat dibatalkan.
                    </p>
                </CustomModal>

                {/* Toast Notifier Terintegrasi */}
                <Toast toast={currentToast} />
            </div>
        </div>
    );
}