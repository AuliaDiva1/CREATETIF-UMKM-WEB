"use client";

import { useTheme } from "next-themes";

const NewsLatterBox = () => {
  const { theme } = useTheme();

  return (
    <div className="shadow-three dark:bg-gray-dark relative z-10 rounded-xl bg-white p-8 sm:p-11 lg:p-8 xl:p-11">
      <h3 className="mb-4 text-2xl font-bold leading-tight text-black dark:text-white">
        Punya Pertanyaan Cepat?
      </h3>
      <p className="text-body-color mb-11 border-b border-body-color/25 pb-11 text-base leading-relaxed dark:border-white/25">
        Gak suka isi form? Kami paham. Hubungi kami langsung via WhatsApp atau
        Instagram. Konsultasi gratis, santai aja!
      </p>

      {/* Menghapus Form Input, Ganti dengan Tombol Kontak Langsung */}
      <div className="flex flex-col gap-y-4">
        
        {/* Tombol WhatsApp */}
        <a
          href="https://wa.me/6285607910959?text=Halo%20Create.tif,%20saya%20mau%20tanya-tanya%20dulu%20dong."
          target="_blank"
          className="flex w-full cursor-pointer items-center justify-center rounded-md bg-[#25D366] px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-[#25D366]/90"
        >
          {/* Ikon WA sederhana */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mr-3">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.953-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.451-4.437-9.887-9.889-9.888-5.451 0-9.887 4.434-9.889 9.888.001 2.223.651 4.319 1.849 6.037l-.308 1.132 1.161-.303z" />
          </svg>
          Chat via WhatsApp
        </a>

        {/* Tombol Instagram */}
        <a
          href="https://www.instagram.com/createtif1/"
          target="_blank"
          className="flex w-full cursor-pointer items-center justify-center rounded-md bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:opacity-90"
        >
          {/* Ikon IG sederhana */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mr-3">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.148 3.227-1.667 4.771-4.919 4.919-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.07-1.646-.07-4.85s.012-3.584.07-4.85c.148-3.227 1.667-4.771 4.919-4.919 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.268.194-6.379 2.3-6.573 6.573-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.194 4.268 2.3 6.379 6.573 6.573 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c4.268-.194 6.379-2.3 6.573-6.573.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.194-4.268-2.3-6.379-6.573-6.573-1.28-.058-1.688-.072-4.947-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z" />
          </svg>
          DM on Instagram
        </a>
      </div>

      {/* --- SVG Hiasan (Biarkan saja) --- */}
      <div>
        <span className="absolute top-7 left-2">
          {/* ... svg ... */}
        </span>
        <span className="absolute bottom-24 left-1.5">
          {/* ... svg ... */}
        </span>
        <span className="absolute top-[140px] right-2">
          {/* ... svg ... */}
        </span>
        <span className="absolute top-0 right-0">
          {/* ... svg ... */}
        </span>
      </div>
      {/* ... (Salin semua kode SVG hiasan dari file aslimu ke sini) ... */}
    </div>
  );
};

export default NewsLatterBox;