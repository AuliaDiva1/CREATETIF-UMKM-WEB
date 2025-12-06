// src/app/(main)/admin/dashboard/DashboardAdmin.jsx (Perbaikan Versi Final - Compact Layout)

'use client';

import React, { useState, useEffect, useRef } from 'react';

// --- HELPER FUNCTIONS ---

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Fungsi Helper untuk format mata uang (IDR)
const formatCurrency = (amount) => {
    const numericAmount = parseFloat(amount) || 0; 
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(numericAmount);
};

// Fungsi untuk mendapatkan warna berdasarkan status
const getStatusColor = (status) => {
    switch (status) {
        case 'Completed':
            return { bg: 'bg-green-100', text: 'text-green-800', bar: 'bg-green-500', base: 'bg-green-50' };
        case 'In Progress':
            return { bg: 'bg-blue-100', text: 'text-blue-800', bar: 'bg-blue-500', base: 'bg-blue-50' };
        case 'Pending Review':
            return { bg: 'bg-yellow-100', text: 'text-yellow-800', bar: 'bg-yellow-500', base: 'bg-yellow-50' };
        default:
            return { bg: 'bg-gray-100', text: 'text-gray-800', bar: 'bg-gray-500', base: 'bg-gray-50' };
    }
};

const defaultSummary = {
    totalUsers: 0,
    totalClients: 0,
    totalProjek: 0,
    totalNilaiProjek: 0,
    statusProjek: { 'In Progress': 0, 'Completed': 0, 'Pending Review': 0 },
    keuangan: { totalInvoice: 0, totalPayment: 0, piutang: 0 }
};

// --- KOMPONEN SEDERHANA (Simulasi UI) ---

// ToastNotifierSimul tidak diubah
const ToastNotifierSimul = React.forwardRef((props, ref) => {
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('');

    React.useImperativeHandle(ref, () => ({
        showToast(status, msg) {
            const sev = status === '00' ? 'success' : 'error';
            setSeverity(sev);
            setMessage(msg);
            setTimeout(() => {
                setMessage('');
            }, 3000);
        }
    }));

    if (!message) return null;

    const baseStyle = 'fixed top-4 right-4 z-50 p-4 rounded-lg shadow-xl text-white font-semibold transition-opacity duration-300';
    const colorStyle = severity === 'success' ? 'bg-green-500' : 'bg-red-500';

    return (
        <div className={`${baseStyle} ${colorStyle}`}>
            {message}
        </div>
    );
});
ToastNotifierSimul.displayName = 'ToastNotifierSimul';

// CardSimul: MENGURANGI UKURAN TEKS DAN PADDING
const CardSimul = ({ title, value, icon, iconBgColor, infoText }) => (
    // Mengurangi p-4 menjadi p-3 dan shadow-md
    <div className="bg-white p-3 rounded-xl shadow-md hover:shadow-lg transition duration-200">
        <div className="flex justify-between items-center">
            <div>
                {/* Mengurangi text-sm menjadi text-xs */}
                <span className="block text-xs text-gray-500 font-medium mb-1">{title}</span>
                {/* Mengurangi text-2xl menjadi text-xl */}
                <div className="text-xl font-bold text-gray-900">{value}</div>
            </div>
            {/* Mengurangi ukuran ikon */}
            <div className={`flex items-center justify-center ${iconBgColor} rounded-full`} style={{ width: '2.5rem', height: '2.5rem' }}>
                <i className={`pi ${icon} text-lg text-white`} />
            </div>
        </div>
        {/* Mengurangi font-size small menjadi text-xs */}
        <p className="text-xs text-gray-500 block mt-2">{infoText}</p>
    </div>
);

// SkeletonCardSimul menyesuaikan dengan CardSimul
const SkeletonCardSimul = () => (
    <div className="bg-white p-3 rounded-xl shadow-md">
        <div className="animate-pulse">
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-2 bg-gray-200 rounded w-1/3"></div>
        </div>
    </div>
);


// BarChartSimul: Mengurangi Padding dan Font
const BarChartSimul = ({ data, total }) => {
    return (
        <div className="space-y-2"> {/* Mengurangi space-y-3 menjadi space-y-2 */}
            {data.map((item, index) => {
                const percent = total > 0 ? (item.total / total) * 100 : 0;
                const { bg, text, bar } = getStatusColor(item.status);

                return (
                    // Mengurangi p-3 menjadi p-2
                    <div key={index} className={`p-2 rounded-lg ${bg} border border-gray-200`}>
                        <div className="flex justify-between items-center mb-1">
                            {/* Mengurangi text-sm */}
                            <span className={`text-xs font-semibold ${text}`}> 
                                {item.status}
                            </span>
                            {/* Mengurangi text-sm */}
                            <span className="text-xs font-bold text-gray-800">
                                {item.total} Proyek
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2"> {/* Mengurangi h-2.5 menjadi h-2 */}
                            <div 
                                className={`h-2 rounded-full transition-all duration-700 ${bar}`} 
                                style={{ width: `${percent}%` }}
                            ></div>
                        </div>
                        <small className="text-xs text-gray-500 mt-1 block">
                            Mencakup **{percent.toFixed(1)}%** dari total proyek.
                        </small>
                    </div>
                );
            })}
        </div>
    );
};


// --- LOGIKA DASHBOARD UTAMA ---

const DashboardAdmin = () => {
    const toastRef = useRef(null);
    const [userName] = useState('Admin Hebat'); 

    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState(defaultSummary);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const getToken = () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    };

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const token = getToken();

            if (!token) {
                toastRef.current?.showToast('01', 'Sesi login tidak ditemukan. Silakan login kembali.');
                return;
            }

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const res = await fetch(`${API_BASE_URL}/dashboard`, { headers });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Gagal mengambil data dashboard');
            }

            const data = await res.json();

            if (data.status !== "00" || !data.data) {
                throw new Error(data.message || 'Gagal mengambil data ringkasan');
            }

            setSummary(data.data); 

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toastRef.current?.showToast('01', `Gagal memuat data: ${error.message}`);
            setSummary(defaultSummary);
        } finally {
            setLoading(false);
        }
    };

    const statusData = Object.entries(summary.statusProjek).map(([status, total]) => ({
        status: status,
        total: total,
    }));
    
    const totalAllProjek = summary.totalProjek;

    if (loading) {
        // Mengurangi padding P-4 menjadi P-3 dan menggunakan layout md:grid-cols-3
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 p-3">
                <SkeletonCardSimul />
                <SkeletonCardSimul />
                <SkeletonCardSimul />
                <SkeletonCardSimul />
                <div className="lg:col-span-2">
                    <SkeletonCardSimul />
                </div>
                <div className="lg:col-span-2">
                    <SkeletonCardSimul />
                </div>
            </div>
        );
    }

    return (
        // Mengurangi p-4 menjadi p-3 pada container utama
        <div className="p-3 max-w-full"> 
            <ToastNotifierSimul ref={toastRef} /> 

            {/* Header / Welcome dengan nama user */}
            <div className="mb-4"> {/* Mengurangi mb-6 menjadi mb-4 */}
                {/* Mengurangi p-6 menjadi p-4 dan text-4xl menjadi text-3xl */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-xl text-white shadow-lg max-w-full">
                    <h1 className="text-3xl font-extrabold mb-1 truncate">Selamat Datang, {userName}! 👋</h1>
                    {/* Mengurangi text-lg menjadi text-base */}
                    <p className="opacity-90 text-base">Ringkasan aktivitas dan kinerja proyek perusahaan Anda.</p>
                </div>
            </div>
            
            <hr className="mb-4" /> {/* Mengurangi mb-6 menjadi mb-4 */}

            {/* Kartu Ringkasan Utama */}
            <h2 className="text-xl font-semibold mb-3 text-gray-800">📊 Ringkasan Umum</h2> {/* Mengurangi text-2xl menjadi text-xl dan mb-4 menjadi mb-3 */}
            {/* Layout Grid 4 kolom dimulai lebih awal di breakpoint 'md' */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6"> {/* Mengurangi gap-4 menjadi gap-3 dan mb-8 menjadi mb-6 */}
                <CardSimul
                    title="Total Pengguna"
                    value={summary.totalUsers}
                    icon="pi-users"
                    iconBgColor="bg-blue-500"
                    infoText="Jumlah akun terdaftar"
                />

                <CardSimul
                    title="Total Klien"
                    value={summary.totalClients}
                    icon="pi-briefcase"
                    iconBgColor="bg-green-500"
                    infoText="Mitra klien aktif"
                />

                <CardSimul
                    title="Total Proyek"
                    value={summary.totalProjek}
                    icon="pi-chart-line"
                    iconBgColor="bg-orange-500"
                    infoText="Proyek yang pernah dikerjakan"
                />
                
                <CardSimul
                    title="Nilai Total Proyek"
                    value={formatCurrency(summary.totalNilaiProjek)}
                    icon="pi-dollar"
                    iconBgColor="bg-purple-500"
                    infoText="Estimasi nilai semua proyek"
                />
            </div>
            
            <hr className="mb-4" /> {/* Mengurangi mb-6 menjadi mb-4 */}

            {/* Bagian Proyek dan Keuangan */}
            <h2 className="text-xl font-semibold mb-3 text-gray-800">📝 Proyek & 💰 Keuangan</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4"> {/* Mengurangi gap-6 menjadi gap-4 */}

                {/* Ringkasan Status Proyek (Grafik) */}
                <div className="bg-white p-4 rounded-xl shadow-lg"> {/* Mengurangi p-6 menjadi p-4 */}
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Visualisasi Proyek Berdasarkan Status</h3> {/* Mengurangi text-xl menjadi text-lg dan mb-6 menjadi mb-4 */}
                    
                    {totalAllProjek === 0 ? (
                        <div className="text-center py-8 text-gray-500"> {/* Mengurangi py-10 menjadi py-8 */}
                            <i className="pi pi-box" style={{ fontSize: '1.5rem' }}></i>
                            <p className="mt-1 text-sm">Tidak ada data proyek yang tersedia.</p>
                        </div>
                    ) : (
                        <BarChartSimul data={statusData} total={totalAllProjek} />
                    )}
                    
                </div>

                {/* Ringkasan Keuangan */}
                <div className="bg-white p-4 rounded-xl shadow-lg"> {/* Mengurangi p-6 menjadi p-4 */}
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">Ringkasan Keuangan (Billing)</h3> {/* Mengurangi text-xl menjadi text-lg dan mb-4 menjadi mb-3 */}
                    
                    <div className="grid grid-cols-1 gap-3"> {/* Mengurangi gap-4 menjadi gap-3 */}
                        {/* Mengurangi p-4 menjadi p-3 dan text-2xl menjadi text-xl */}
                        <div className="p-3 bg-indigo-50 border-l-4 border-indigo-500 rounded-lg">
                            <span className="text-xs font-medium text-indigo-700">Total Tagihan (Invoice)</span>
                            <p className="text-xl font-bold text-indigo-900 mt-1">
                                {formatCurrency(summary.keuangan.totalInvoice)}
                            </p>
                        </div>
                        <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded-lg">
                            <span className="text-xs font-medium text-emerald-700">Total Pembayaran (Payment)</span>
                            <p className="text-xl font-bold text-emerald-900 mt-1">
                                {formatCurrency(summary.keuangan.totalPayment)}
                            </p>
                        </div>
                        
                        <div className={`p-3 border-l-4 rounded-lg transition duration-300 ${
                            summary.keuangan.piutang > 0 
                                ? 'bg-red-100 border-red-600'
                                : 'bg-gray-100 border-gray-400'
                        }`}>
                            <span className="text-xs font-medium text-gray-700">Piutang (Outstanding)</span>
                            <p className={`text-xl font-bold ${summary.keuangan.piutang > 0 ? 'text-red-900' : 'text-gray-900'} mt-1`}>
                                {formatCurrency(summary.keuangan.piutang)}
                            </p>
                            <small className="text-xs text-gray-600">Tagihan - Pembayaran</small>
                        </div>
                    </div>
                </div>
                
            </div>

            {/* Tombol Refresh */}
            <div className="mt-6 text-center"> {/* Mengurangi mt-8 menjadi mt-6 */}
                <button
                    onClick={fetchDashboardData}
                    className="flex items-center mx-auto px-3 py-1.5 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition"
                    disabled={loading}
                >
                    <i className={`pi pi-refresh mr-2 ${loading ? 'pi-spin' : ''}`} />
                    {loading ? 'Memuat Ulang Data...' : 'Refresh Data'}
                </button>
            </div>
            
        </div>
    );
};

export default DashboardAdmin;