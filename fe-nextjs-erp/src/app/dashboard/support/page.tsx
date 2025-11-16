"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact"; // <-- KITA PAKAI ULANG KOMPONEN KONTAK

const SupportPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Cek Token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center pt-[120px]">
        Loading Support...
      </div>
    );
  }

  return (
    <>
      <Breadcrumb
        pageName="Client Support"
        description="Butuh bantuan? Tim kami siap membantu Anda. Silakan isi form di bawah atau hubungi kami langsung."
      />
      
      {/* Kita panggil ulang komponen <Contact /> yang sudah kita buat
        untuk Halaman Kontak utama. Ini cara efisien!
      */}
      <Contact />
    </>
  );
};

export default SupportPage;