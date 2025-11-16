// src/components/Header/DashboardHeader.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggler from "./ThemeToggler";

// Menu Khusus Dashboard
const dashboardMenuData = [
  { id: 1, title: "Projects", path: "/dashboard" },
  { id: 2, title: "Billing", path: "/dashboard/billing" },
  { id: 3, title: "My Profile", path: "/dashboard/profile" },
  { id: 4, title: "Support", path: "/dashboard/support" },
];

const DashboardHeader = () => {
  const router = useRouter();
  const usePathName = usePathname();

  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userName, setUserName] = useState("Client");
  const [loading, setLoading] = useState(true); // Tambahkan state loading

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("USER_NAME");

    if (!token) {
      router.push("/signin");
    } else {
      if (storedName) {
        setUserName(storedName);
      }
      setLoading(false); // Set loading selesai
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("ROLE");
    localStorage.removeItem("USER_NAME");
    router.push("/signin");
  };

  // Jangan render apapun jika sedang loading/cek auth
  if (loading) {
    return (
       <header className="header fixed left-0 top-0 z-40 flex w-full items-center bg-white shadow-sticky dark:bg-dark" />
    );
  }

  return (
    <>
      <header
        className={`header fixed left-0 top-0 z-40 flex w-full items-center bg-white/80 shadow-sticky backdrop-blur-sm transition dark:bg-dark/80 dark:shadow-sticky-dark`}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-60 max-w-full px-4 xl:mr-12">
              <Link
                href="/dashboard"
                className={`header-logo block w-full py-5 lg:py-2`}
              >
                <Image
                  src="/images/logo/logo.png"
                  alt="logo"
                  width={140}
                  height={30}
                  className="w-full dark:hidden"
                />
                <Image
                  src="/images/logo/logo-2.png"
                  alt="logo"
                  width={140}
                  height={30}
                  className="hidden w-full dark:block"
                />
              </Link>
            </div>
            <div className="flex w-full items-center justify-between px-4">
              <div>
                <button
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="absolute right-4 top-1/2 block translate-y-[-50%] rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden"
                >
                  {/* ... (kode icon burger) ... */}
                </button>
                <nav
                  id="navbarCollapse"
                  className={`navbar absolute right-0 z-30 w-[250px] rounded border-[.5px] border-body-color/50 bg-white px-6 py-4 duration-300 dark:border-body-color/20 dark:bg-dark lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
                    navbarOpen
                      ? "visibility top-full opacity-100"
                      : "invisible top-[120%] opacity-0"
                  }`}
                >
                  <ul className="block lg:flex lg:space-x-12">
                    {dashboardMenuData.map((menuItem, index) => (
                      <li key={index} className="group relative">
                        <Link
                          href={menuItem.path}
                          className={`flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${
                            usePathName === menuItem.path
                              ? "text-primary dark:text-white"
                              : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                          }`}
                        >
                          {menuItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              {/* --- PROFILE DROPDOWN --- */}
              <div className="flex items-center justify-end pr-16 lg:pr-0">
                <div className="mr-4">
                  <ThemeToggler />
                </div>

                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-base font-bold text-white shadow-md"
                  >
                    {userName.charAt(0).toUpperCase()}
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-dark">
                      <div className="border-b border-gray-200 px-4 py-2 dark:border-gray-700">
                        <p className="truncate text-sm font-medium text-black dark:text-white">
                          {userName}
                        </p>
                        <p className="text-xs text-body-color">Client Account</p>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-dark-2"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default DashboardHeader;