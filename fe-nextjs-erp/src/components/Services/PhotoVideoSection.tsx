"use client";

import SectionTitle from "../Common/SectionTitle";
import Image from "next/image";

const PhotoShowcase = () => {
  return (
    <section id="photo-video" className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title="Foto & Video Produk Profesional"
          paragraph="Tangkap esensi produk Anda dengan visual berkualitas tinggi. Kami menyediakan layanan fotografi dan videografi yang menonjolkan keunikan setiap item."
          center
          mb="80px"
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Fotografi Produk */}
          <div className="w-full">
            <div className="wow fadeInUp group relative overflow-hidden rounded-sm bg-white shadow-one duration-300 hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark" data-wow-delay=".1s">
              <div className="relative block aspect-[36/20] w-full">
                <Image 
                  src="https://cdn.antaranews.com/cache/1200x800/2024/02/28/CC307A45-563A-4CC0-88D2-FA8E51F7FED2.jpeg" 
                  alt="Fotografi Produk Estetik" 
                  fill 
                  className="object-cover"
                  unoptimized // Agar bisa load gambar eksternal tanpa config next.config.js
                />
              </div>
              <div className="p-6 sm:p-8 md:px-6 md:py-8 lg:p-8 xl:px-5 xl:py-8">
                <h3>
                  <a href="#" className="text-dark hover:text-primary mb-4 block text-xl font-bold sm:text-2xl">
                    Fotografi Produk Estetik
                  </a>
                </h3>
                <p className="text-body-color leading-relaxed text-base">
                  Visual menarik untuk website, katalog, dan media sosial Anda. Fokus pada detail dan pencahayaan yang sempurna.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Videografi Produk */}
          <div className="w-full">
            <div className="wow fadeInUp group relative overflow-hidden rounded-sm bg-white shadow-one duration-300 hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark" data-wow-delay=".15s">
              <div className="relative block aspect-[36/20] w-full">
                <Image 
                  src="https://banyuwangikab.go.id/public/media/berita/original/hyjglcmpgp_whatsapp-image-2025-08-28-at-200637.jpeg" 
                  alt="Videografi Produk Dinamis" 
                  fill 
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="p-6 sm:p-8 md:px-6 md:py-8 lg:p-8 xl:px-5 xl:py-8">
                <h3>
                  <a href="#" className="text-dark hover:text-primary mb-4 block text-xl font-bold sm:text-2xl">
                    Videografi Produk Dinamis
                  </a>
                </h3>
                <p className="text-body-color leading-relaxed text-base">
                  Video promosi yang menarik, menampilkan fitur dan manfaat produk secara efektif untuk kampanye digital.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Konten Visual Pelengkap */}
          <div className="w-full">
            <div className="wow fadeInUp group relative overflow-hidden rounded-sm bg-white shadow-one duration-300 hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark" data-wow-delay=".2s">
              <div className="relative block aspect-[36/20] w-full">
                <Image 
                  src="https://dotnextdigital.com/wp-content/uploads/2022/08/Konten-adalah.webp" 
                  alt="Konten Visual Pelengkap" 
                  fill 
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="p-6 sm:p-8 md:px-6 md:py-8 lg:p-8 xl:px-5 xl:py-8">
                <h3>
                  <a href="#" className="text-dark hover:text-primary mb-4 block text-xl font-bold sm:text-2xl">
                    Konten Visual Pelengkap
                  </a>
                </h3>
                <p className="text-body-color leading-relaxed text-base">
                  Termasuk video testimonial, behind-the-scenes, atau konten visual lain untuk memperkaya cerita brand Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhotoShowcase;