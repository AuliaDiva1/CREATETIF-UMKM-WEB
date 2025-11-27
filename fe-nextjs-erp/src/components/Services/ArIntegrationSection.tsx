// src/components/Services/ArIntegrationSection.tsx
"use client"; // Jangan lupa directive ini jika Anda belum menambahkannya

import SectionTitle from "../Common/SectionTitle";
import FluidGlass from './FluidGlass';
import React, { Suspense } from 'react'; // Tambahkan Suspense lagi jika Anda menghapusnya

const ArIntegrationSection = () => {
  return (
    <section id="ar-integration" className="py-16 md:py-20 lg:py-28 bg-gray-100 dark:bg-dark overflow-hidden">
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-center">
          {/* Bagian Kiri - Ilustrasi 3D */}
          <div className="w-full px-4 lg:w-1/2">
            <div
              className="wow fadeInUp relative mx-auto mb-12 aspect-[25/24] max-w-[500px] text-center lg:m-0"
              data-wow-delay=".15s"
            >
              <div className="absolute inset-0 h-full w-full rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800">
                <Suspense fallback={<div>Loading 3D model...</div>}> {/* Pertahankan Suspense untuk stabilitas */}
                   <FluidGlass
                      mode="cube"
                      lensProps={{
                        scale: 0.25,
                        ior: 1.15,
                        thickness: 5,
                        chromaticAberration: 0.1,
                        anisotropy: 0.01
                      }}
                      cubeProps={{
                          // NAIKKAN SKALA OBJEK KACA
                          scale: 0.5, // Ditingkatkan dari 0.3 menjadi 0.5 (atau coba nilai lain seperti 0.7)
                          ior: 1.2,
                          thickness: 3,
                          chromaticAberration: 0.15,
                          anisotropy: 0.1
                      }}
                      // barProps={}
                    />
                </Suspense>
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