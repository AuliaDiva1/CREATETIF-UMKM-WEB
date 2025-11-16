"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SectionTitle from "@/components/Common/SectionTitle"; // Kita butuh ini

// --- DUMMY DATA PROYEK (Nanti ganti dengan data dari API) ---
const userProjects = [
  {
    id: 1,
    title: "Website E-commerce Kopi Senja",
    status: "In Progress",
    progress: 75,
  },
  {
    id: 2,
    title: "Filter AR Instagram 'Lebaran Seru'",
    status: "Completed",
    progress: 100,
  },
  {
    id: 3,
    title: "Foto Produk Baju Lebaran (Sesi 1)",
    status: "Pending Review",
    progress: 90,
  },
];
// --------------------------------------------------

const DashboardPage = () => {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Cek Token & Ambil Nama User
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("USER_NAME");

    if (!token) {
      router.push("/signin");
    } else {
      setUserName(storedName || "Client");
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center pt-[120px]">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <>
      {/* Konten Utama */}
      <section className="relative z-10 overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[180px] lg:pb-28">
        <div className="container">
          {/* Welcome Banner */}
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mb-12 rounded-md bg-primary/[3%] py-10 px-8 dark:bg-primary/10 sm:p-[60px] lg:p-12 xl:p-[60px]">
                <h2 className="mb-4 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight">
                  Welcome back, {userName}! 👋
                </h2>
                <p className="text-base leading-relaxed text-body-color dark:text-body-color-dark">
                  Ini adalah halaman Dashboard Client Anda. Di sini Anda dapat
                  melihat progres proyek, status pembayaran, dan file yang
                  dikirim oleh admin.
                </p>
              </div>
            </div>
          </div>

          {/* --- DAFTAR PROYEK (MENGGANTIKAN 3 KOTAK STATS) --- */}
          <SectionTitle
            title="My Projects"
            paragraph="Monitor progres dari semua proyek aktif dan yang telah selesai di sini."
            center={false}
            mb="40px"
          />
          
          <div className="flex flex-col gap-6">
            {userProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-md border border-stroke bg-white p-6 shadow-three dark:border-transparent dark:bg-[#2C303B] dark:shadow-two"
              >
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-bold text-black dark:text-white">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium
                          ${
                            project.status === "In Progress"
                              ? "bg-yellow-500/10 text-yellow-500" // Disesuaikan agar lebih terlihat
                              : project.status === "Completed"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-primary/10 text-primary"
                          }
                        `}
                      >
                        {project.status}
                      </span>
                      <p className="text-body-color">{project.progress}% Complete</p>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/projects/${project.id}`} // Nanti bisa buat halaman detail
                    className="inline-block rounded-md bg-primary px-5 py-2.5 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {/* --- BATAS DAFTAR PROYEK --- */}
        </div>

        {/* Background SVG */}
        <div className="absolute top-0 left-0 z-[-1]">
          <svg
            width="1440"
            height="969"
            viewBox="0 0 1440 969"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* ... (Kode SVG) ... */}
          </svg>
        </div>
      </section>
    </>
  );
};

export default DashboardPage;