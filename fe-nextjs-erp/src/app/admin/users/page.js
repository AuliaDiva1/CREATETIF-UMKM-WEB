'use client';

import React, { useEffect, useState, useCallback } from 'react';
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
    const icon = toast.type === 'success' ? "✓" : "✗"; // Menggunakan karakter unicode sederhana

    return (
        <div className={`${baseStyle} ${style}`}>
            <div className="flex items-start">
                <span className="mr-3 text-2xl mt-0.5">{icon}</span>
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
    const [dialogMode, setDialogMode] = useState(null); // 'add' | 'edit' | 'lengkapi' | null
    const [token, setToken] = useState('');
    const [confirmDeleteUser, setConfirmDeleteUser] = useState(null); 
    const [currentToast, setCurrentToast] = useState(null); 

    /**
     * Menampilkan notifikasi Toast
     * @param {string} type - 'success' atau 'error'
     * @param {string} message - Pesan yang akan ditampilkan
     */
    const showToast = useCallback((type, message) => {
        setCurrentToast({ type, message });
        setTimeout(() => setCurrentToast(null), 3000);
    }, []);

    // ----------------------------------------------------
    // Authentication & Data Fetching
    // ----------------------------------------------------

    useEffect(() => {
        // Logika sederhana untuk mendapatkan token dari localStorage
        const t = localStorage.getItem('token');
        if (!t) {
            console.warn("Token tidak ditemukan. Menggunakan token dummy.");
            setToken('dummy-token'); 
        } else {
            setToken(t);
        }
    }, []);

    /**
     * Mengambil data pengguna dari API
     */
    const fetchUsers = useCallback(async () => {
        const activeToken = token || localStorage.getItem('token') || 'dummy-token'; 
        if (!activeToken) return;

        setIsLoading(true);
        try {
            // Asumsi getUsers mengembalikan array data atau null/undefined
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
        // Panggil fetchUsers setelah token dipastikan ada
        if (token) {
            fetchUsers();
        }
    }, [fetchUsers, token]); 

    // ----------------------------------------------------
    // Modal Handlers
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
            
            // Perbarui data tabel setelah operasi berhasil
            fetchUsers(); 
            handleCloseModal();
        } catch (err) {
            console.error("Gagal menyimpan user:", err);
            showToast('error', 'Gagal menyimpan user.');
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
            // Update state secara lokal tanpa perlu fetch ulang seluruh data
            setUsers((prev) => prev.filter((u) => u.id !== user.id)); 
        } catch (err) {
            console.error("Gagal menghapus user:", err);
            showToast('error', 'Gagal menghapus user.');
        } finally {
            setConfirmDeleteUser(null);
        }
    };

    // ----------------------------------------------------
    // DataTable Configuration
    // ----------------------------------------------------

    const actionBodyTemplate = (rowData) => (
        <div className="flex gap-2 justify-center">
            {/* Tombol Edit */}
            <button
                className="p-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition duration-150 text-sm shadow-md"
                title="Edit User"
                onClick={() => {
                    setSelectedUser(rowData);
                    setDialogMode('edit');
                }}
            >
                <span className="font-bold">E</span> {/* Ikon Sederhana: E for Edit */}
            </button>
            {/* Tombol Lengkapi Data */}
            <button
                className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition duration-150 text-sm shadow-md"
                title="Lengkapi Data"
                onClick={() => {
                    setSelectedUser(rowData);
                    setDialogMode('lengkapi');
                }}
            >
                <span className="font-bold">L</span> {/* Ikon Sederhana: L for Lengkapi */}
            </button>
            {/* Tombol Hapus */}
            <button
                className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition duration-150 text-sm shadow-md"
                title="Hapus User"
                onClick={() => confirmDeletion(rowData)}
            >
                <span className="font-bold">X</span> {/* Ikon Sederhana: X for Delete */}
            </button>
        </div>
    );

    // Definisi kolom
    const userColumns = [
        { field: 'id', header: 'ID', style: { width: '60px' } },
        { field: 'name', header: 'Name', filter: true },
        { field: 'email', header: 'Email', filter: true },
        { field: 'role', header: 'Role' },
        {
            field: 'created_at',
            header: 'Created At',
            body: (row) => (row.created_at ? new Date(row.created_at).toLocaleString('id-ID') : '-'),
        },
        {
            field: 'updated_at',
            header: 'Updated At',
            body: (row) => (row.updated_at ? new Date(row.updated_at).toLocaleString('id-ID') : '-'),
        },
        {
            header: 'Actions',
            body: actionBodyTemplate,
            style: { width: '180px', textAlign: 'center' },
        },
    ];

    // ----------------------------------------------------
    // Render
    // ----------------------------------------------------

    return (
        <div className="p-6 bg-gray-50 dark:bg-[#1E293B] min-h-screen">
            <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 lg:p-8">
                
                <header className="mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Manajemen Pengguna</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Kelola daftar lengkap semua akun pengguna dalam sistem.</p>
                </header>

                <div className="flex justify-end mb-6">
                    <button
                        className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md flex items-center gap-2"
                        onClick={() => {
                            setDialogMode('add');
                            setSelectedUser(null);
                        }}
                    >
                        <span className="text-xl leading-none">+</span>
                        Tambah User Baru
                    </button>
                </div>

                {/* Area Data Table */}
                <div className="overflow-x-auto">
                    <CustomDataTable 
                        data={users} 
                        loading={isLoading} 
                        columns={userColumns} 
                        // Props tambahan yang mungkin tidak didukung CustomDataTable Native (dihapus/diabaikan jika tidak diimplementasikan)
                        // globalFilterFields={['name', 'email', 'role']}
                        // paginator={true}
                        // rows={10}
                        // rowsPerPageOptions={[5, 10, 25, 50]}
                    />
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