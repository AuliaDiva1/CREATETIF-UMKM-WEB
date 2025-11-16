// src/components/Services/PhotoVideoSection.tsx
import SectionTitle from "../Common/SectionTitle";
import Image from "next/image";

const PhotoVideoSection = () => {
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
          {/* Contoh Card untuk Foto Produk */}
          <div className="w-full">
            <div className="wow fadeInUp group relative overflow-hidden rounded-sm bg-white shadow-one duration-300 hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark" data-wow-delay=".1s">
              <div className="relative block aspect-[36/20] w-full">
                <Image src="/images/services/product-photography.jpg" alt="Foto Produk" fill className="object-cover" />
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

          {/* Contoh Card untuk Video Produk */}
          <div className="w-full">
            <div className="wow fadeInUp group relative overflow-hidden rounded-sm bg-white shadow-one duration-300 hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark" data-wow-delay=".15s">
              <div className="relative block aspect-[36/20] w-full">
                <Image src="/images/services/product-videography.jpg" alt="Video Produk" fill className="object-cover" />
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

          {/* Contoh Card untuk Testimonial/Behind The Scenes */}
          <div className="w-full">
            <div className="wow fadeInUp group relative overflow-hidden rounded-sm bg-white shadow-one duration-300 hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark" data-wow-delay=".2s">
              <div className="relative block aspect-[36/20] w-full">
                <Image src="/images/services/bts.jpg" alt="Konten Tambahan" fill className="object-cover" />
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

export default PhotoVideoSection;