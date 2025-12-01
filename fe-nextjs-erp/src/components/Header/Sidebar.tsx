// src/components/Header/Sidebar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
// Import ikon SVG dasar untuk tampilan formal
const DashboardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l-2-2m0 0l-7-7-7 7m14 0v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
);
const ProjectIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 00-2 2m-2 0h10"></path></svg>
);
const PartnerIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
);
const TeamIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-6 0L9 9a2 2 0 00-2 2v4a2 2 0 002 2h6a2 2 0 002-2v-4a2 2 0 00-2-2l-1-3m-5 0V3"></path></svg>
);


// Menu Khusus Admin
const adminMenuData = [
  { id: 1, title: "Dashboard", path: "/admin/dashboard", Icon: DashboardIcon }, 
  { id: 2, title: "Manajemen Proyek", path: "/admin/projects", Icon: ProjectIcon }, 
  { id: 3, title: "Partner & Klien", path: "/admin/partners", Icon: PartnerIcon }, 
  { id: 4, title: "Tim Internal", path: "/admin/team", Icon: TeamIcon }, 
  { id: 5, title: "Users", path: "/admin/users", Icon: TeamIcon }, 
  { id: 6, title: "Blog", path: "/admin/blog", Icon: TeamIcon }, 
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