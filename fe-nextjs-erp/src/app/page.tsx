import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Blog from "@/components/Blog";
import Brands from "@/components/Brands";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Video from "@/components/Video";
import { Metadata } from "next";

// --- PERBAIKAN DI SINI ---
export const metadata: Metadata = {
  title: "Create.tif | Partner Digital Kreatif UMKM",
  description: "Jasa Website Profesional, Augmented Reality, dan Foto Produk untuk UMKM Naik Kelas.",
  // other metadata
};

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      <Features />
      
      {/* --- PERBAIKAN DI SINI (Disembunyikan sementara) --- */}
      {/* <Brands /> */}
      
      <AboutSectionOne />
      <AboutSectionTwo />
      <Testimonials />
      <Pricing />
      <Blog />
      <Contact />
    </>
  );
}