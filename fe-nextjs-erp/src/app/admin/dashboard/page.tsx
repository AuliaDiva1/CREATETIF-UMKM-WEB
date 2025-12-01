// src/pages/admin/dashboard/index.tsx atau src/components/AdminDashboardPage.tsx
"use client";
import React, { useEffect, useState, useCallback } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// --- IKON FORMAL (Sudah Disediakan) ---
const SettingIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.298.17 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
);
const MoneyIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 2v8m0 0l3-3m-3 3l-3-3m0-8h6m-6 0a2 2 0 110-4 2 2 0 010 4z"></path></svg>
);
const CheckIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);
const AddUserIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-3 0v-3a4 4 0 014-4h2a4 4 0 014 4v3m0 0h-1a7 7 0 00-7 7v2h12v-2a7 7 0 00-7-7z"></path></svg>
);
// ---

// --- DUMMY DATA STATISTIK ---
const adminStats = [
  {
    id: 1,
    title: "Proyek Aktif",
    value: 14,
    color: "bg-indigo-500/10 text-indigo-600",
    Icon: SettingIcon,
  },
  {
    id: 2,
    title: "Pembayaran Tertunda",
    value: 5,
    color: "bg-red-500/10 text-red-600",
    Icon: MoneyIcon,
  },
  {
    id: 3,
    title: "Proyek Selesai Bulan Ini",
    value: 6,
    color: "bg-green-500/10 text-green-600",
    Icon: CheckIcon,
  },
];

// --- DUMMY DATA GRAFIK PIE CHART ---
const projectStatusData = [
  { name: 'Dalam Pengerjaan', value: 35, color: '#4F46E5' }, // Indigo
  { name: 'Menunggu Review Klien', value: 10, color: '#F59E0B' }, // Amber
  { name: 'Pembayaran Tertunda', value: 5, color: '#EF4444' }, // Red
  { name: 'Proyek Selesai', value: 50, color: '#10B981' }, // Emerald
];
// ------------------------------------

// --- PLACEHOLDER KOMPONEN ---
// Komponen pengganti untuk judul bagian
const SectionTitle = ({ title, paragraph, center, mb }) => (
  <div className={`wow fadeInUp w-full ${center ? "mx-auto text-center" : ""}`} data-wow-delay=".1s" style={{ marginBottom: mb }}>
    {/* Mengurangi ukuran font untuk Section Title */}
    <h2 className="mb-2 text-2xl font-bold !leading-tight text-black dark:text-white sm:text-3xl">
      {title}
    </h2>
    <p className="text-base !leading-relaxed text-gray-600 dark:text-gray-400 md:text-lg">
      {paragraph}
    </p>
  </div>
);

// Komponen pengganti Link Next.js (menggunakan tag <a> standar)
const Link = ({ href, children, className, onClick = () => {} }) => (
  <a href={href} className={className} onClick={onClick}>
    {children}
  </a>
);

// FUNGSI PENGGANTI useRouter().push untuk redirect yang stabil
const useRedirect = () => {
  const push = useCallback((path) => {
    window.location.href = path;
  }, []);
  return { push };
};

// Komponen Tooltip Kustom Recharts
// FIX: Menggunakan objek props lengkap dan destructuring di dalam body
const CustomTooltip = (props) => {
  const { active, payload } = props;
  
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const percentage = ((data.value / 100) * 100).toFixed(1); // Assuming total is 100 for percentage demo
    return (
      <div className="rounded-lg bg-white p-3 shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-600">
        <p className="text-sm font-semibold text-black dark:text-white">{data.name}</p>
        <p className="text-xs text-gray-700 dark:text-gray-300">{`Jumlah: ${data.value} Proyek`}</p>
        <p className="text-xs text-gray-700 dark:text-gray-300">{`Persentase: ${percentage}%`}</p>
      </div>
    );
  }

  return null;
};
// --------------------------------------------------

const AdminDashboardPage = () => {
  // Gunakan useState untuk mengelola state dan menghindari penggunaan langsung localStorage
  const [isClient, setIsClient] = useState(false);
  const { push: routerPush } = useRedirect();
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Cek Token & Ambil Nama User
  useEffect(() => {
    // Memastikan kode berjalan di sisi klien (browser)
    setIsClient(true); 

    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("USER_NAME");

    if (!token) {
      // Untuk demo, kita izinkan masuk tanpa token jika tidak ada redirect
      // Dalam aplikasi nyata: routerPush("/signin");
      console.warn("Token not found, redirecting to signin (simulated)");
      // Hapus baris di bawah ini dan uncomment routerPush jika menggunakan Auth
      setUserName(storedName || "Administrator"); 
      setLoading(false);
    } else {
      setUserName(storedName || "Administrator");
      setLoading(false);
    }
  }, [routerPush]);


  if (loading || !isClient) {
    return (
      <div className="flex h-screen items-center justify-center pt-16 bg-gray-50 dark:bg-[#1E293B]">
        <p className="text-xl font-medium text-gray-700 dark:text-gray-300">Memuat Panel Administrasi...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 dark:bg-[#1E293B] font-inter"> 
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Konten Utama */}
        <section className="relative z-10 overflow-hidden py-8 md:py-12 lg:py-16">
          
          {/* Welcome Banner & Tombol Aksi Cepat */}
          <div className="flex flex-wrap -mx-4 mb-12">
            <div className="w-full px-4">
              <div className="rounded-xl bg-indigo-50 dark:bg-gray-800 py-10 px-8 border border-indigo-200 dark:border-indigo-900 sm:p-[40px] lg:p-10 xl:p-12 shadow-2xl 
                /* Tambahkan efek transisi pada Banner */
                transition-all duration-300 hover:shadow-indigo-500/30 dark:hover:shadow-indigo-900/40 hover:scale-[1.005]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    {/* Mengurangi ukuran font untuk Heading H1 di Banner */}
                    <h1 className="mb-2 text-2xl font-extrabold leading-tight text-black dark:text-white sm:text-3xl">
                      {/* PERUBAHAN DI SINI: Menambahkan Ucapan Selamat Datang */}
                      Selamat Datang di Panel Administrasi, {userName}!
                    </h1>
                    <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400 mb-6 md:mb-0">
                      Tinjauan operasional dan metrik utama manajemen proyek.
                    </p>
                  </div>
                  
                  {/* Tombol Aksi Cepat (ADMIN ACTIONS) */}
                  <Link
                    href="/admin/partners/new" // Link ke halaman tambah klien (placeholder)
                    className="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-xl transition duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
                  >
                      <AddUserIcon className="h-5 w-5 mr-2" />
                      Registrasi Klien Baru
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* --- STATISTIK KARTU ADMIN --- */}
          <SectionTitle
            title="Metrik Operasional Utama"
            paragraph="Ringkasan status kunci yang memerlukan perhatian segera."
            center={false}
            mb="30px"
          />
          <div className="grid grid-cols-1 gap-6 mb-16 sm:grid-cols-2 lg:grid-cols-3">
            {adminStats.map((stat) => (
              <div
                key={stat.id}
                // Efek hover sudah ada di sini
                className={`rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-700 transition-all hover:shadow-xl hover:scale-[1.01] duration-300`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm font-semibold uppercase text-gray-500 dark:text-gray-300">
                      {stat.title}
                    </p>
                    {/* Mengurangi ukuran font untuk Nilai Statistik */}
                    <p className="text-4xl font-extrabold text-black dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-4 rounded-full ${stat.color} stroke-2`}>
                    <stat.Icon className="h-8 w-8" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* --- BATAS STATISTIK --- */}
          
          
          {/* --- AREA GRAFIK STATUS PROYEK --- */}
          <SectionTitle
            title="Distribusi Status Proyek"
            paragraph="Visualisasi persentase total proyek berdasarkan tahapan progres mereka."
            center={false}
            mb="20px"
          />

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-700
             /* Tambahkan efek transisi pada Grafik */
             transition-all duration-300 hover:shadow-xl hover:scale-[1.005]">
            <h3 className="mb-6 text-xl font-bold text-black dark:text-white">Progres Proyek Keseluruhan (Total 100 Proyek)</h3>
              
              {/* Kontainer Responsif untuk Recharts */}
              <div className="w-full" style={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      layout="horizontal" 
                      wrapperStyle={{ color: 'var(--text-color, #374151)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            {/* --- BATAS AREA GRAFIK --- */}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboardPage;