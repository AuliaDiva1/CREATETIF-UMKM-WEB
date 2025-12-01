// src/components/Header/DashboardHeaderAdmin.tsx (REFACTORED & FORMAL)
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggler from "./ThemeToggler"; // Pastikan ThemeToggler ada

// Ikon untuk Profile (SVG standar)
const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
);
// Ikon untuk Logout (SVG standar)
const LogoutIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
);

// --- Component Definition ---

// Tambahkan prop opsional (sesuai diskusi sebelumnya) untuk layout dinamis
interface DashboardHeaderAdminProps {
    sidebarOpen?: boolean;
    onToggle?: () => void;
}

const DashboardHeaderAdmin: React.FC<DashboardHeaderAdminProps> = ({ sidebarOpen = true, onToggle }) => {
  const router = useRouter();
  const usePathName = usePathname();

  // State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userName, setUserName] = useState("System User"); 
  const [role, setRole] = useState("Client");
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("USER_NAME");
    const storedRole = localStorage.getItem("ROLE");

    if (!token) {
      router.push("/signin");
    } else {
      if (storedName) {
        setUserName(storedName);
      }
      if (storedRole) {
        setRole(storedRole);
      }
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("ROLE");
    localStorage.removeItem("USER_NAME");
    router.push("/signin");
  };

  if (loading) {
    // Header minimal saat loading, untuk menghindari FOUC atau layout shift
    return (
      <header className="fixed left-0 top-0 z-40 flex w-full items-center bg-white shadow-md dark:bg-gray-800 h-16" />
    );
  }

  // Menentukan padding dinamis berdasarkan status sidebar
  const dynamicPaddingClass = sidebarOpen ? 'lg:pl-56' : 'lg:pl-20'; // w-56 (224px) atau w-20 (80px)

  return (
    <header
      // Class header yang lebih bersih dan menggunakan padding dinamis
      className={`fixed top-0 z-40 flex h-16 w-full items-center bg-white/90 shadow-md backdrop-blur-sm transition-all duration-300 dark:bg-gray-800/90 ${dynamicPaddingClass}`}
    >
        <div className="flex w-full items-center justify-between px-4 sm:px-6"> 
          
          {/* Bagian Kiri (Akan menjadi tombol toggle jika diperlukan) */}
          <div className="flex items-center">
            {/* Jika Anda ingin meletakkan tombol toggle di Header (untuk estetika formal) 
              daripada di Sidebar, Anda bisa mengaktifkan kode ini:
            */}
            {/* {onToggle && (
                <button 
                    onClick={onToggle}
                    className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition lg:hidden"
                    aria-label="Toggle Sidebar"
                >
                    <MenuToggleIcon className="h-6 w-6 stroke-2" />
                </button>
            )} */}

            {/* Placeholder Logo / Judul Formal */}
            <Link
                href={role === 'ADMIN' || role === 'SUPER_ADMIN' ? "/admin/dashboard" : "/dashboard"}
                className={`header-logo text-lg font-semibold text-gray-800 dark:text-gray-200 ml-4 lg:ml-0`}
            >
                {/* Menggunakan nama aplikasi / system formal sebagai pengganti logo jika logo belum dimuat */}
                <span className="text-xl font-bold text-indigo-700 dark:text-indigo-400">
                    System Panel
                </span>
            </Link>
          </div>
          
          {/* Konten Kanan (Theme Toggler & Profile) */}
          <div className="flex items-center space-x-4"> 
            <ThemeToggler />

            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white shadow-lg ring-2 ring-indigo-300 dark:ring-indigo-700 transition-all hover:ring-4"
                aria-label="User Profile Menu"
              >
                {userName.charAt(0).toUpperCase()}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-lg bg-white py-1 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700 z-50">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-600">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {userName}
                    </p>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400">
                      {role}
                    </p>
                  </div>

                  <Link
                    href="/dashboard/profile" // Contoh link ke halaman Profile
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    <UserIcon className="h-4 w-4 mr-2" />
                    Profile Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-600/50 border-t border-gray-100 dark:border-gray-600 mt-1"
                  >
                    <LogoutIcon className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
    </header>
  );
};

export default DashboardHeaderAdmin;