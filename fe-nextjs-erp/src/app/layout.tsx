"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Poppins } from "next/font/google";
import "../styles/index.css";
// IMPORT FRAMER MOTION
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation"; // Digunakan untuk mendeteksi perubahan rute
import { Providers } from "./providers";

// 2. Konfigurasi Poppins
const poppins = Poppins({ 
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap", 
});

// --- KOMPONEN BARU: WRAPPER UNTUK ANIMASI GESER ---
const PageTransitionWrapper = ({ children }) => {
    // Dapatkan path saat ini
    const pathname = usePathname();

    // Aturan animasi geser (Slide)
    const transitionVariants = {
        initial: {
            x: "100%", // Mulai dari luar kanan
            opacity: 0,
        },
        animate: {
            x: "0%", // Geser masuk ke posisi normal
            opacity: 1,
            transition: {
                type: "tween", // Transisi yang halus
                ease: "easeInOut",
                duration: 0.5, // Durasi animasi
            },
        },
        exit: {
            x: "-100%", // Geser keluar ke kiri
            opacity: 0,
            transition: {
                type: "tween",
                ease: "easeInOut",
                duration: 0.5,
            },
        },
    };

    return (
        // AnimatePresence sangat penting untuk membuat komponen 'exit' (halaman yang akan ditutup)
        // tetap berada di DOM saat animasi keluar sedang dimainkan.
        <AnimatePresence mode="wait">
            {/* key={pathname} memastikan animasi dijalankan setiap kali path berubah */}
            <motion.div
                key={pathname} 
                initial="initial"
                animate="animate"
                exit="exit"
                variants={transitionVariants}
                // Anda mungkin perlu menyesuaikan style agar animasi tidak mengganggu layout utama
                style={{ width: '100%' }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};
// ----------------------------------------------------


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Pastikan <html suppressHydrationWarning lang="en"> tetap ada
    <html suppressHydrationWarning lang="en">
      <head />

      {/* 3. Terapkan kelas Poppins */}
      <body className={`bg-[#FCFCFC] dark:bg-black ${poppins.className}`}>
        {/* Providers harus membungkus komponen yang menggunakan hooks (seperti usePathname) */}
        <Providers>
          <Header />
          {/* BUNGKUS CHILDREN DENGAN WRAPPER ANIMASI */}
          <PageTransitionWrapper>
            {children}
          </PageTransitionWrapper>
          <Footer />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}

// Catatan: Pastikan file './providers.js' atau './providers.jsx' mengimpor 'use client'