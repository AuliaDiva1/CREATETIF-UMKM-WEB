"use client";

import SectionTitle from "../Common/SectionTitle";
import FluidGlass from './FluidGlass';
import React, { Suspense, useState, useEffect } from 'react';

const ArIntegrationSection = () => {
  // State untuk memastikan komponen hanya dirender di sisi klien (browser)
  // Ini mencegah grafik 3D muncul lalu hilang karena konflik rendering server-klien
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section id="ar-integration" className="py-16 md:py-20 lg:py-28 bg-gray-100 dark:bg-dark overflow-hidden">
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-center">
          {/* Bagian Kiri - Ilustrasi 3D */}
          <div className="w-full px-4 lg:w-1/2">
            <div
              className="relative mx-auto mb-12 aspect-[25/24] max-w-[500px] text-center lg:m-0"
              style={{ opacity: 1, visibility: 'visible' }} // Memaksa elemen tetap terlihat
            >
              <div className="absolute inset-0 h-full w-full rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800 shadow-inner">
                {/* Render Conditional: Hanya tampilkan 3D jika sudah mounted di browser */}
                {isMounted ? (
                  <Suspense 
                    fallback={
                      <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                        Memuat Visual 3D...
                      </div>
                    }
                  >
                      <FluidGlass
                        cubeProps={{
                            scale: 0.5,
                            ior: 1.2,
                            thickness: 3,
                            chromaticAberration: 0.15,
                            anisotropy: 0.1
                        }}
                      />
                  </Suspense>
                ) : (
                  // Tampilan placeholder statis saat loading awal (mencegah kedipan)
                  <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-800">
                     <span className="text-gray-400">Loading...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bagian Kanan - Teks (Tidak berubah) */}
          <div className="w-full px-4 lg:w-1/2">
            <div className="wow fadeInUp max-w-[500px]" data-wow-delay=".2s">
              <SectionTitle
                title="Integrasi Augmented Reality (AR)"
                paragraph="Bawa produk dan brand Anda ke dimensi baru dengan pengalaman AR yang imersif. Dari branding hingga edukasi, kami hadirkan inovasi di ujung jari audiens Anda."
                mb="44px"
              />

              <div className="mb-9">
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  AR untuk Branding
                </h3>
                <p className="text-body-color text-base font-medium leading-relaxed sm:text-lg sm:leading-relaxed">
                  Ciptakan pengalaman interaktif yang tak terlupakan untuk mempromosikan produk, mengundang partisipasi, dan memperkuat loyalitas merek Anda.
                </p>
              </div>
              <div className="mb-9">
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  AR untuk Edukasi & Pelatihan
                </h3>
                <p className="text-body-color text-base font-medium leading-relaxed sm:text-lg sm:leading-relaxed">
                  Visualisasikan konsep kompleks, simulasikan skenario, dan sediakan panduan langkah demi langkah yang menarik melalui teknologi AR.
                </p>
              </div>
              <div className="mb-1">
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  Pengalaman Interaktif Lainnya
                </h3>
                <p className="text-body-color text-base font-medium leading-relaxed sm:text-lg sm:leading-relaxed">
                  Apapun ide Anda, kami siap membantu mewujudkannya dengan teknologi AR, mulai dari game interaktif hingga panduan lokasi virtual.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArIntegrationSection;