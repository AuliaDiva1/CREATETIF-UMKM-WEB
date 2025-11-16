"use client"; // <-- Perlu 'use client' untuk tombol WA & Close

import { Template } from "@/data/templatesData";
import Image from "next/image";
import Link from "next/link";

type Props = {
  template: Template;
};

// NOMOR WHATSAPP KAMU
const WA_NUMBER = "6285607910959";

const TemplatePreviewHeader = ({ template }: Props) => {
  
  // Siapkan link WA
  const waMessage = `Halo Create.tif, saya sedang me-review template *${template.title}* dan tertarik untuk memesan.`;
  const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    waMessage,
  )}`;

  // Fungsi untuk menutup tab preview
  const handleClose = () => {
    // Cara paling aman adalah link kembali ke galeri
    // window.close() kadang diblokir browser
    window.location.href = "/services";
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between bg-white px-4 shadow-md dark:bg-dark">
      <div className="flex items-center gap-4">
        {/* Logo Create.tif */}
        <Link href="/">
          <Image
            src="/images/logo/logo-2.svg" // Ganti ke logo-mu
            alt="Create.tif Logo"
            width={100}
            height={25}
            className="dark:hidden"
          />
          <Image
            src="/images/logo/logo.svg" // Ganti ke logo-mu
            alt="Create.tif Logo"
            width={100}
            height={25}
            className="hidden dark:block"
          />
        </Link>
        <span className="hidden text-sm text-body-color md:block">
          Preview: <b>{template.title}</b>
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Tombol Pesan via WA */}
        <Link
          href={waLink}
          target="_blank"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-submit duration-300 hover:bg-primary/90"
        >
          Pilih Template Ini
        </Link>

        {/* Tombol Close */}
        <button
          onClick={handleClose}
          title="Tutup Preview"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-stroke text-dark duration-300 hover:bg-gray-light dark:border-transparent dark:text-white dark:hover:bg-dark/50"
        >
          {/* Ikon 'X' (Close) */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L13 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13 1L1 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default TemplatePreviewHeader;