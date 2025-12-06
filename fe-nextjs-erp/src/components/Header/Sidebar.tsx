// src/components/Header/Sidebar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
// Import ikon modern dari lucide-react
import { 
    LayoutDashboard, 
    FolderKanban, 
    Users, 
    FileText, // Ikon untuk Blog
    DollarSign, // Ikon untuk Pembayaran/Billing
    UserCog, // Ikon untuk Users
    LogOut, // Ikon untuk Logout
    Building2 // Ikon untuk Partner/Klien
} from "lucide-react";


// Menu Khusus Admin menggunakan ikon dari lucide-react
const adminMenuData = [
    { id: 1, title: "Dashboard", path: "/admin/dashboard", Icon: LayoutDashboard }, 
    { id: 2, title: "Manajemen Pembayaran", path: "/admin/billing", Icon: DollarSign }, 
    { id: 3, title: "Manajemen Proyek", path: "/admin/projek", Icon: FolderKanban },
    { id: 4, title: "Partner & Klien", path: "/admin/klien", Icon: Building2 }, 
    { id: 5, title: "Users", path: "/admin/users", Icon: UserCog }, 
    { id: 6, title: "Blog", path: "/admin/blog", Icon: FileText }, 
];

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    const storedName = localStorage.getItem("USER_NAME");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("ROLE");
    localStorage.removeItem("USER_NAME");
    router.push("/signin");
  };

  // --- Komponen Logo dengan ukuran yang LEBIH KECIL (80x20) ---
  const Logo = () => (
    <Link
      href="/admin/dashboard" 
      // Padding vertikal dikurangi lagi (py-4 menjadi py-3)
      className={`header-logo block w-full py-3`} 
    >
      <Image
        src="/images/logo/logo.png"
        alt="logo"
        // 👇 Ukuran diubah dari 100x25 menjadi 80x20
        width={80} 
        height={20}
        className="w-full dark:hidden mx-auto" 
      />
      <Image
        src="/images/logo/logo-2.png"
        alt="logo"
        // 👇 Ukuran diubah dari 100x25 menjadi 80x20
        width={50} 
        height={5}
        className="hidden w-full dark:block mx-auto" 
      />
    </Link>
  );
  // -----------------------------------------------------------

  return (
    <aside
      // Lebar Sidebar tetap w-56 (224px)
      className="fixed left-0 top-0 z-50 flex h-screen w-56 flex-col overflow-y-auto border-r border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-[#1E293B] transition-transform"
    >
      {/* Logo Area: Padding p-4 diubah menjadi p-3 agar lebih ringkas */}
      <div className="flex items-center justify-center p-3 border-b border-gray-200 dark:border-gray-700">
        <Logo />
      </div>

      {/* Navigasi Menu */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {adminMenuData.map((item) => {
            const isActive = pathname.startsWith(item.path);
            const IconComponent = item.Icon;

            return (
              <li key={item.id}>
                <Link
                  href={item.path}
                  className={`flex items-center rounded-lg p-3 text-sm font-medium transition duration-150 ease-in-out ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  <IconComponent 
                      className={`h-5 w-5 mr-3 stroke-2 ${isActive ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`}
                  />
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer / Profile & Logout */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center mb-4">
          {/* Avatar Formal */}
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center rounded-lg bg-red-600 p-3 text-sm font-medium text-white shadow-sm hover:bg-red-700 transition"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;