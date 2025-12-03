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

const PricingBox = ({ packageName, price, duration, subtitle, children, recommended = false }) => {
  
  const phoneNumber = "6285607910959";

  // Fungsi Pesan Otomatis (Disesuaikan dengan Nama Paket & Harga Terbaru)
  const generateMessage = () => {
    let message = "";

    if (packageName === "Jasa Foto Produk") {
      message = "Halo Create.tif! Saya tertarik dengan paket *Jasa Foto Produk (199rb)*. Boleh tanya detail cara ordernya?";
    } else if (packageName === "Web Landing Page") {
      message = "Halo Create.tif! Saya mau konsultasi untuk pembuatan *Web Landing Page (499rb)*. Mohon infonya.";
    } else if (packageName === "Exclusive All-in-One") {
      message = "Halo Admin! Saya mau ambil promo *Exclusive All-in-One (999rb)* (Web + AR + Foto). Tolong dibantu prosesnya ya.";
    } else {
      message = `Halo Create.tif! Saya tertarik dengan paket *${packageName}*. Boleh minta info lebih lanjut?`;
    }

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="w-full relative">
      <div
        className={`wow fadeInUp relative z-10 rounded-md bg-white px-8 py-10 shadow-one dark:bg-[#1D2144] dark:shadow-gray-dark dark:hover:shadow-gray-dark mb-10 overflow-hidden
        ${recommended ? "border-2 border-primary transform md:scale-105 z-20 shadow-2xl" : "border border-transparent"}
        `}
        data-wow-delay=".1s"
      >
        {recommended && (
            <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wide">
                Best Seller
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
        
        {/* Konten List Fitur */}
        <div className="mb-8 border-b border-body-color/10 pb-8 dark:border-white/10">
          <a
            href={generateMessage()}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex w-full items-center justify-center rounded-md p-3 text-base font-semibold transition duration-300 ease-in-out hover:shadow-signUp
              ${recommended ? "bg-primary text-white hover:bg-opacity-90" : "bg-gray-100 text-dark hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"}
            `}
          >
            Pesan Sekarang
          </a>
        </div>
        
        <div>{children}</div>
      </div>
    </div>
  );
};