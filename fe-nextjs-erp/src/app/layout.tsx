"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
// 1. Ubah import dari Inter ke Poppins
import { Poppins } from "next/font/google"; 
import "../styles/index.css";

// 2. Konfigurasi Poppins
// Kita ambil ketebalan yang umum dipakai: 300 (light), 400 (normal), 500 (medium), 600-800 (bold)
const poppins = Poppins({ 
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap", // Agar teks tetap muncul walau font belum selesai download
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      {/* 3. Ganti inter.className menjadi poppins.className */}
      <body className={`bg-[#FCFCFC] dark:bg-black ${poppins.className}`}>
        <Providers>
          <Header />
          {children}
          <Footer />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}

import { Providers } from "./providers";