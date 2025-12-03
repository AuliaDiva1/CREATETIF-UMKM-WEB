"use client";
import { useState } from "react";

// --- 1. KOMPONEN PENDUKUNG (PricingBox & OfferList) ---

const SectionTitle = ({ title, paragraph, center, width }) => {
  return (
    <div
      className={`wow fadeInUp w-full ${center ? "mx-auto text-center" : ""}`}
      data-wow-delay=".1s"
      style={{ maxWidth: width }}
    >
      <h2 className="mb-4 text-3xl font-bold !leading-tight text-black dark:text-white sm:text-4xl md:text-[45px]">
        {title}
      </h2>
      <p className="text-base !leading-relaxed text-body-color md:text-lg">
        {paragraph}
      </p>
    </div>
  );
};

const OfferList = ({ text, status }) => {
  return (
    <div className="mb-3 flex items-center">
      <span
        className={`mr-3 flex h-[18px] w-full max-w-[18px] items-center justify-center rounded-full ${
          status === "active"
            ? "bg-primary text-primary"
            : "bg-[#D1D5DB] text-body-color"
        }`}
      >
        {status === "active" ? (
          <svg
            width="14"
            height="10"
            viewBox="0 0 14 10"
            fill="none"
            className="fill-current text-white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12.3333 1.66667L5 9L1.66667 5.66667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
             {/* Icon inactive */}
          </svg>
        )}
      </span>
      <p className={`text-base ${status === "active" ? "text-body-color" : "text-body-color/50 line-through"}`}>
        {text}
      </p>
    </div>
  );
};

const PricingBox = ({ packageName, price, duration, subtitle, children, isActive, onClick }) => {
  
  const phoneNumber = "6285704975053";

  const generateMessage = () => {
    let message = "";
    if (packageName === "Jasa Foto Produk") {
      message = `Halo Create.tif! Saya tertarik dengan paket *Jasa Foto Produk (${price})*. Boleh tanya detail cara ordernya?`;
    } else if (packageName === "Web Landing Page") {
      message = `Halo Create.tif! Saya mau konsultasi untuk pembuatan *Web Landing Page (${price})*. Mohon infonya.`;
    } else if (packageName === "Exclusive All-in-One") {
      message = `Halo Admin! Saya mau ambil promo *Exclusive All-in-One (${price})*. Tolong dibantu prosesnya ya.`;
    } else {
      message = `Halo Create.tif! Saya tertarik dengan paket *${packageName} (${price})*. Boleh minta info lebih lanjut?`;
    }
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="w-full relative">
      {/* Tambahkan onClick handler pada container div */}
      <div
        onClick={onClick}
        className={`wow fadeInUp relative z-10 rounded-md bg-white px-8 py-10 shadow-one dark:bg-[#1D2144] dark:shadow-gray-dark dark:hover:shadow-gray-dark mb-10 overflow-hidden cursor-pointer transition-all duration-300
        ${isActive ? "border-2 border-primary transform md:scale-105 z-20 shadow-2xl" : "border border-transparent hover:scale-105"}
        `}
        data-wow-delay=".1s"
      >
        {isActive && (
            <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wide">
                Terpilih
            </div>
        )}
        <div className="flex items-center justify-between">
          <h3 className="price mb-2 text-3xl font-bold text-black dark:text-white">
            <span className="text-sm font-medium text-body-color align-top">Rp</span> {price}
            <span className="text-base font-medium text-body-color">
              /{duration}
            </span>
          </h3>
        </div>
        <h4 className="mb-2 text-xl font-bold text-dark dark:text-white">
          {packageName}
        </h4>
        <div className="mb-7 text-sm text-body-color min-h-[40px] leading-relaxed">
          {subtitle}
        </div>
        
        <div className="mb-8 border-b border-body-color/10 pb-8 dark:border-white/10">
          <a
            href={generateMessage()}
            target="_blank"
            rel="noopener noreferrer"
            // Mencegah klik tombol memicu onClick container (opsional, tapi bagus untuk UX)
            onClick={(e) => e.stopPropagation()} 
            className={`flex w-full items-center justify-center rounded-md p-3 text-base font-semibold transition duration-300 ease-in-out hover:shadow-signUp
              ${isActive ? "bg-primary text-white hover:bg-opacity-90" : "bg-gray-100 text-dark hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"}
            `}
          >
            Pilih Paket
          </a>
        </div>
        
        <div>{children}</div>
      </div>
    </div>
  );
};

// --- 2. MAIN COMPONENT (Pricing) ---

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false); // False = Project, True = Tahunan
  // State untuk melacak paket mana yang sedang aktif/diklik
  const [activePackage, setActivePackage] = useState("Exclusive All-in-One"); 

  const prices = {
    starterFoto: {
        project: "199rb", 
        tahunan: "0", 
    },
    webBasic: {
        project: "499rb",
        tahunan: "299rb", 
    },
    allInOne: {
        project: "999rb", 
        tahunan: "599rb", 
    },
  };

  return (
    <section id="pricing" className="relative z-10 py-16 md:py-20 lg:py-28 bg-white dark:bg-gray-dark">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Pilih Paket Sesuai Kebutuhan"
          paragraph="Fleksibel! Bisa pesan foto produk saja, website saja, atau ambil paket komplit All-in-One."
          center
          width="665px"
        />

        {/* Toggle Switch */}
        <div className="w-full">
          <div className="mb-8 flex justify-center md:mb-12 lg:mb-16">
            <span
              onClick={() => setIsAnnual(false)}
              className={`${
                !isAnnual
                  ? "pointer-events-none text-primary"
                  : "text-dark dark:text-white"
              } mr-4 cursor-pointer text-base font-semibold transition-colors`}
            >
              Sekali Bayar (Project)
            </span>
            <div
              onClick={() => setIsAnnual(!isAnnual)}
              className="flex cursor-pointer items-center"
            >
              <div className="relative">
                <div className="h-5 w-14 rounded-full bg-[#1D2144] shadow-inner"></div>
                <div
                  className={`${
                    isAnnual ? "translate-x-full" : "" // PERBAIKAN: Logika arah gerak diperbaiki
                  } shadow-switch-1 absolute left-0 top-[-4px] flex h-7 w-7 items-center justify-center rounded-full bg-primary transition transform duration-300`}
                >
                  <span className="active h-4 w-4 rounded-full bg-white shadow-md"></span>
                </div>
              </div>
            </div>
            <span
              onClick={() => setIsAnnual(true)}
              className={`${
                isAnnual
                  ? "pointer-events-none text-primary"
                  : "text-dark dark:text-white"
              } ml-4 cursor-pointer text-base font-semibold transition-colors`}
            >
              Perpanjang (Tahunan)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          
          {/* PAKET 1 */}
          <PricingBox
            packageName="Jasa Foto Produk"
            price={isAnnual ? prices.starterFoto.tahunan : prices.starterFoto.project}
            duration={isAnnual ? "thn" : "project"}
            subtitle="Solusi visual untuk katalog & sosial media tanpa website."
            isActive={activePackage === "Jasa Foto Produk"}
            onClick={() => setActivePackage("Jasa Foto Produk")}
          >
            <OfferList text="5 Foto Produk Editing Professional" status="active" />
            <OfferList text="1 Pilihan Background Polos" status="active" />
            <OfferList text="File High Resolution (Siap Posting)" status="active" />
            <OfferList text="Pengiriman File via Drive" status="active" />
            <OfferList text="Web Landing Page" status="inactive" />
            <OfferList text="Fitur AR / Domain" status="inactive" />
          </PricingBox>

          {/* PAKET 2 */}
          <PricingBox
            packageName="Web Landing Page"
            price={isAnnual ? prices.webBasic.tahunan : prices.webBasic.project}
            duration={isAnnual ? "thn" : "thn"} 
            subtitle={
              isAnnual ? "Biaya perpanjangan tahunan." : (
                <span>
                    <span className="line-through text-red-500 opacity-70 mr-2 text-xs md:text-sm">Rp 799rb</span>
                    Promo website setahun.
                </span>
              )
            }
            isActive={activePackage === "Web Landing Page"}
            onClick={() => setActivePackage("Web Landing Page")}
          >
            <OfferList text="1 Halaman Website (Landing Page)" status="active" />
            <OfferList text="Gratis Domain .com / .id" status="active" />
            <OfferList text="Email Bisnis (2 Akun)" status="active" />
            <OfferList text="Desain Premium & Garansi" status="active" />
            <OfferList text="Support & Maintenance" status="active" />
            <OfferList text="Jasa Foto Produk" status="inactive" />
          </PricingBox>

          {/* PAKET 3 */}
          <PricingBox
            packageName="Exclusive All-in-One"
            price={isAnnual ? prices.allInOne.tahunan : prices.allInOne.project}
            duration={isAnnual ? "thn" : "project"}
            subtitle="Paket paling hemat! Sudah dapat Website + Foto Produk."
            isActive={activePackage === "Exclusive All-in-One"}
            onClick={() => setActivePackage("Exclusive All-in-One")}
          >
            <OfferList text="Semua Fitur Web Landing Page" status="active" />
            <OfferList text="Bonus: 5 Foto Produk Premium" status="active" />
            <OfferList text="Fitur Website Augmented Reality (AR)" status="active" />
            <OfferList text="Gratis Domain .com/.id (Setahun)" status="active" />
            <OfferList text="Tombol Chat WhatsApp" status="active" />
            <OfferList text="Prioritas Pengerjaan" status="active" />
          </PricingBox>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 z-[-1]">
        <svg width="239" height="601" viewBox="0 0 239 601" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect opacity="0.3" x="-184.451" y="600.973" width="196" height="541.607" rx="2" transform="rotate(-128.7 -184.451 600.973)" fill="url(#paint0_linear_93:235)"/>
          <rect opacity="0.3" x="-188.201" y="385.272" width="59.7544" height="541.607" rx="2" transform="rotate(-128.7 -188.201 385.272)" fill="url(#paint1_linear_93:235)"/>
          <defs>
            <linearGradient id="paint0_linear_93:235" x1="-90.1184" y1="420.414" x2="-90.1184" y2="1131.65" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="paint1_linear_93:235" x1="-159.441" y1="204.714" x2="-159.441" y2="915.952" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default Pricing;