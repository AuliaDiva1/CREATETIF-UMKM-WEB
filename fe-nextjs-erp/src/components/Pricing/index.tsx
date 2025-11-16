"use client";
import { useState } from "react";
import SectionTitle from "../Common/SectionTitle";
import OfferList from "./OfferList";
import PricingBox from "./PricingBox";

const Pricing = () => {
  const [isMonthly, setIsMonthly] = useState(true);

  return (
    <section id="pricing" className="relative z-10 py-16 md:py-20 lg:py-28">
      <div className="container">
          <SectionTitle
          title="Pilih Paket Sesuai Budget"
          paragraph="Gak perlu pusing soal biaya. Kami punya solusi digital lengkap dengan harga yang sangat bersahabat untuk dompet UMKM."
          center
          width="665px"
        />

        <div className="w-full">
          <div className="mb-8 flex justify-center md:mb-12 lg:mb-16">
            <span
              onClick={() => setIsMonthly(true)}
              className={`${
                isMonthly
                  ? "pointer-events-none text-primary"
                  : "text-dark dark:text-white"
              } mr-4 cursor-pointer text-base font-semibold`}
            >
              Sekali Bayar
            </span>
            <div
              onClick={() => setIsMonthly(!isMonthly)}
              className="flex cursor-pointer items-center"
            >
              <div className="relative">
                <div className="h-5 w-14 rounded-full bg-[#1D2144] shadow-inner"></div>
                <div
                  className={`${
                    isMonthly ? "" : "translate-x-full"
                  } shadow-switch-1 absolute left-0 top-[-4px] flex h-7 w-7 items-center justify-center rounded-full bg-primary transition`}
                >
                  <span className="active h-4 w-4 rounded-full bg-white"></span>
                </div>
              </div>
            </div>
            <span
              onClick={() => setIsMonthly(false)}
              className={`${
                isMonthly
                  ? "text-dark dark:text-white"
                  : "pointer-events-none text-primary"
              } ml-4 cursor-pointer text-base font-semibold`}
            >
              Maintenance (Bulanan)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {/* PAKET 1: FOTO PRODUK HEMAT */}
          <PricingBox
            packageName="Starter Foto"
            price={isMonthly ? "149rb" : "25rb"}
            duration={isMonthly ? "paket" : "bln"}
            subtitle="Cukup untuk stok konten Instagram seminggu."
          >
            <OfferList text="5 Foto Produk Editing" status="active" />
            <OfferList text="1 Background Polos" status="active" />
            <OfferList text="File High Resolution" status="active" />
            <OfferList text="Siap Posting Medsos" status="active" />
            <OfferList text="Video Reels" status="inactive" />
            <OfferList text="Model Talent" status="inactive" />
          </PricingBox>

          {/* PAKET 2: LANDING PAGE */}
          <PricingBox
            packageName="Web Landing Page"
            price={isMonthly ? "499rb" : "50rb"}
            duration={isMonthly ? "project" : "bln"}
            subtitle="Halaman web sederhana untuk kartu nama digital Anda."
          >
            <OfferList text="One Page Website" status="active" />
            <OfferList text="Desain Template Premium" status="active" />
            <OfferList text="Gratis Domain .my.id" status="active" />
            <OfferList text="Tombol Chat WhatsApp" status="active" />
            <OfferList text="Mobile Friendly" status="active" />
            <OfferList text="Custom Desain Rumit" status="inactive" />
          </PricingBox>

          {/* PAKET 3: BUNDLING VIRAL */}
          <PricingBox
            packageName="Paket Viral"
            price={isMonthly ? "999rb" : "99rb"}
            duration={isMonthly ? "project" : "bln"}
            subtitle="Solusi All-in-One: Punya Web sekaligus konten foto produk."
          >
            <OfferList text="Semua Fitur Landing Page" status="active" />
            <OfferList text="10 Foto Produk Premium" status="active" />
            <OfferList text="Bonus Filter IG Sederhana" status="active" />
            <OfferList text="Prioritas Pengerjaan" status="active" />
            <OfferList text="Revisi 2x" status="active" />
            <OfferList text="Konsultasi Gratis Selamanya" status="active" />
          </PricingBox>
        </div>
      </div>

      {/* Hiasan Background tetap sama */}
      <div className="absolute bottom-0 left-0 z-[-1]">
        <svg
          width="239"
          height="601"
          viewBox="0 0 239 601"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            opacity="0.3"
            x="-184.451"
            y="600.973"
            width="196"
            height="541.607"
            rx="2"
            transform="rotate(-128.7 -184.451 600.973)"
            fill="url(#paint0_linear_93:235)"
          />
          <rect
            opacity="0.3"
            x="-188.201"
            y="385.272"
            width="59.7544"
            height="541.607"
            rx="2"
            transform="rotate(-128.7 -188.201 385.272)"
            fill="url(#paint1_linear_93:235)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_93:235"
              x1="-90.1184"
              y1="420.414"
              x2="-90.1184"
              y2="1131.65"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_93:235"
              x1="-159.441"
              y1="204.714"
              x2="-159.441"
              y2="915.952"
              gradientUnits="userSpaceOnUse"
            >
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