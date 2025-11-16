// src/components/Header/index.tsx
"use client"; // Ini HARUS "use client"

import { usePathname } from "next/navigation";
import DashboardHeader from "./DashboardHeader"; // Import header dashboard
import MainHeader from "./MainHeader"; // Import header publik

const Header = () => {
  const pathname = usePathname();

  // 1. Halaman yang TIDAK PAKAI HEADER SAMA SEKALI
  // (Contoh: Halaman login, atau halaman live preview template)
  if (pathname === "/signin" || pathname === "/signup" || pathname.startsWith("/templates")) {
    return null; 
  }

  // 2. Jika URL adalah /dashboard (atau /dashboard/billing, dll)
  if (pathname.startsWith("/dashboard")) {
    return <DashboardHeader />;
  }

  // 3. Jika tidak, berarti ini halaman publik (Homepage, About, dll)
  return <MainHeader />;
};

export default Header;