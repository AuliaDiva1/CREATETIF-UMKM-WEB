import React from 'react';

// Data Menu Sidebar (Harusnya di-import dari file data/config terpisah)
const sidebarNav = [
    { name: "Dashboard", href: "/admin/dashboard", iconSvg: (
        // Ikon Dashboard
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    ), current: true },
    { name: "Manajemen Proyek", href: "/admin/projects", iconSvg: (
        // Ikon Proyek
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg>
    ), current: false },
    { name: "Partner & Klien", href: "/admin/partners", iconSvg: (
        // Ikon Partner
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    ), current: false },
    { name: "Tim Internal", href: "/admin/team", iconSvg: (
        // Ikon Tim
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h10"/><path d="M7 11h10"/><path d="M7 15h7"/></svg>
    ), current: false },
];

/**
 * Komponen Sidebar Administrasi Create.tif
 * Menampilkan menu navigasi dan menangani tampilan mobile.
 * * @param {boolean} isMenuOpen - Status apakah menu terbuka (khusus mobile)
 * @param {function} toggleMenu - Fungsi untuk menutup/membuka menu
 */
const AdminSidebar = ({ isMenuOpen, toggleMenu }) => {
    // Fungsi simulasi logout
    const handleLogout = () => {
        // Karena tidak boleh menggunakan alert/confirm, kita gunakan console log untuk simulasi.
        if (window.confirm("Apakah Anda yakin ingin logout?")) {
            console.log("Logout...");
            // Di aplikasi nyata, Anda akan melakukan redirect atau memanggil fungsi auth.
        }
    };

    return (
        <>
            {/* Overlay untuk Mobile */}
            <div 
                className={`fixed inset-0 z-20 bg-gray-900 bg-opacity-50 transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={toggleMenu}
            ></div>

            {/* Sidebar Utama */}
            <div 
                className={`fixed top-0 left-0 z-30 flex h-full w-64 flex-col bg-white p-4 shadow-xl dark:bg-gray-800 transition-transform duration-300 
                ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:h-auto md:shadow-none md:flex-shrink-0`}
            >
                {/* Logo & Judul */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
                    <h2 className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                        Create.tif Admin
                    </h2>
                    {/* Tombol Tutup Mobile */}
                    <button 
                        className="p-2 md:hidden rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={toggleMenu}
                    >
                        {/* Ikon Tutup (X) */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                    </button>
                </div>

                {/* Navigasi Utama */}
                <nav className="mt-6 flex-1 space-y-2">
                    {sidebarNav.map((item) => (
                        <a
                            key={item.name}
                            href={item.href} // Menggunakan href simulasi
                            className={`flex items-center rounded-lg px-4 py-2 text-base font-medium transition-colors 
                                ${item.current 
                                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' 
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-700'
                                }`}
                            // Tutup menu setelah klik (berguna di mobile)
                            onClick={toggleMenu} 
                        >
                            <span className="mr-3">{item.iconSvg}</span>
                            {item.name}
                        </a>
                    ))}
                </nav>

                {/* Bagian Bawah Sidebar (Logout) */}
                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                    <a
                        href="/auth/signin" // Simulasi link logout
                        onClick={handleLogout}
                        className="flex items-center rounded-lg px-4 py-2 text-base font-medium text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-gray-700"
                    >
                         <span className="mr-3">
                            {/* Ikon Logout */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                        </span>
                        Logout
                    </a>
                </div>
            </div>
        </>
    );
};

export default AdminSidebar;