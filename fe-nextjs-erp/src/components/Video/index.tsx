"use client";

import Image from "next/image";
import SectionTitle from "../Common/SectionTitle";

export default function PhotoShowcase() {
  return (
    // Mengubah padding top (py/pt) agar lebih turun ke bawah
    <section className="relative z-10 py-24 md:py-32 lg:py-40">
      <div className="container">
        <SectionTitle
          title="Tim Create.tif"
          paragraph="Kenalan dengan wajah-wajah kreatif di balik layar Create.tif. Kami adalah tim yang siap mewujudkan UMKM Naik Kelas jadi kenyataan."
          center
          mb="80px"
        />

        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto max-w-[800px] overflow-hidden rounded-xl shadow-2xl relative group">
              
              {/* Container Aspect Ratio */}
              <div className="relative aspect-video w-full">
                {/* Single Image */}
                <Image
                  src="/images/video/image.png" // Menggunakan satu gambar statis
                  alt="Tim Create.tif"
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                
                {/* Overlay Gradient Tipis (Opsional) */}
                <div className="absolute inset-0 bg-black/10"></div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Background shape */}
      <div className="absolute right-0 bottom-0 left-0 z-[-1] h-full w-full bg-[url(/images/video/shape.svg)] bg-cover bg-center bg-no-repeat opacity-50"></div>
    </section>
  );
}