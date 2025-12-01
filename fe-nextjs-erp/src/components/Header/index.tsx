import { usePathname } from "next/navigation";
import DashboardHeader from "./DashboardHeader";
import MainHeader from "./MainHeader";
import Sidebar from "./Sidebar";
import DashboardHeaderAdmin from "./DashboardHeaderAdmin";

const Header = () => {
  const pathname = usePathname();

  // 1. Halaman yang TIDAK PAKAI HEADER SAMA SEKALI
  if (pathname === "/signin" || pathname === "/signup" || pathname.startsWith("/templates")) {
    return null;
  }

  // 2. Jika URL adalah /dashboard (non-admin)
  // Pastikan ini dicek DULU, dan pastikan ia TIDAK dimulai dengan /admin/
  if (pathname.startsWith("/dashboard") && !pathname.startsWith("/admin/")) {
    return <DashboardHeader />;
  }

  // 3. Jika URL adalah /admin/* (mencakup /admin/dashboard, /admin/project, /admin/users, dll.)
  // Inilah yang harus diubah dari '/admin/dashboard' menjadi '/admin/'
  if (pathname.startsWith("/admin/")) {
    return (
      <>
        <DashboardHeaderAdmin />
        <Sidebar />
      </>
    );
  }

  // 4. Jika tidak, berarti ini halaman publik (Homepage, About, dll)
  return <MainHeader />;
};

export default Header;