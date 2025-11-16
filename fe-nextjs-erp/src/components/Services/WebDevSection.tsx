"use client";

import SectionTitle from "../Common/SectionTitle";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { allTemplates } from "@/data/templatesData"; // <-- Import data dari file baru

// NOMOR WHATSAPP KAMU
const WA_NUMBER = "6285607910959";

const WebDevSection = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Logika filter pencarian
  const filteredTemplates = useMemo(() => {
    if (!searchQuery) return allTemplates;
    const query = searchQuery.toLowerCase();
    return allTemplates.filter(
      (template) =>
        template.title.toLowerCase().includes(query) ||
        template.category.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  return (
    <section id="web-development" className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title="Galeri Template Website"
          paragraph="Pilih desain yang paling sesuai dengan style bisnismu. Semua template modern, responsif, dan bisa kami sesuaikan 100% untukmu."
          center
          mb="40px"
        />

        {/* --- SEARCH BAR --- */}
        <div className="mb-12 flex justify-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari template... (cth: e-commerce, portofolio)"
            className="border-stroke dark:text-body-color-dark dark:shadow-two w-full max-w-lg rounded-md border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
          />
        </div>

        {/* --- GALERI TEMPLATE (GRID) --- */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => {
            // Siapkan pesan WA
            const waMessage = `Halo Create.tif, saya tertarik untuk membuat website dengan template: *${template.title}* (Kategori: ${template.category}).`;
            const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
              waMessage,
            )}`;

            return (
              <div key={template.id} className="w-full">
                <div
                  className="wow fadeInUp group relative overflow-hidden rounded-md bg-white shadow-one duration-300 hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark"
                  data-wow-delay=".1s"
                >
                  {/* Badge Kategori */}
                  <span className="absolute top-4 right-4 z-10 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                    {template.category}
                  </span>

                  {/* Gambar Template */}
                  <div className="relative block aspect-[4/3] w-full">
                    <Image
                      src={template.imageSrc}
                      alt={template.title}
                      fill
                      className="object-cover duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Judul & Tombol Aksi */}
                  <div className="p-6 sm:p-8">
                    <h3 className="mb-5 block text-xl font-bold text-black sm:text-2xl dark:text-white">
                      {template.title}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {/* TOMBOL 1: LIVE PREVIEW (BUKA TAB BARU) */}
                      <Link
                        href={`/templates/${template.livePreviewSlug}`}
                        target="_blank"
                        className="inline-block rounded-md border border-primary px-5 py-2.5 text-base font-medium text-primary duration-300 hover:bg-primary/10"
                      >
                        Live Preview
                      </Link>
                      {/* TOMBOL 2: PILIH (KE WHATSAPP) */}
                      <Link
                        href={waLink}
                        target="_blank"
                        className="inline-block rounded-md bg-primary px-5 py-2.5 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90"
                      >
                        Pilih Template Ini
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pesan Jika Tidak Ditemukan */}
        {filteredTemplates.length === 0 && (
          <div className="wow fadeInUp pt-12 text-center" data-wow-delay=".1s">
            <h3 className="text-2xl font-bold text-black dark:text-white">
              Oops! Template tidak ditemukan
            </h3>
            <p className="text-body-color mt-4 text-lg">
              Coba gunakan kata kunci lain, misal "<b>E-commerce</b>" atau "<b>Portofolio</b>".
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default WebDevSection;