// src/data/templatesData.ts
export type Template = {
  id: number;
  title: string;
  category: "E-commerce" | "Portofolio" | "Bisnis" | "Landing Page";
  imageSrc: string; // Gambar thumbnail di galeri
  livePreviewSlug: string; // URL untuk halaman preview (cth: /templates/toko-kopi)
  demoUrl: string; // URL website demo ASLI (yang akan di-load di iframe)
};

// --- INI ADALAH DATABASE TEMPLATE KAMU ---
export const allTemplates: Template[] = [
  {
    id: 1,
    title: "Toko Kopi Senja",
    category: "E-commerce",
    imageSrc: "/images/templates/toko-kopi.jpg",
    livePreviewSlug: "toko-kopi",
    demoUrl: "https://startup.uideck.com/", // <-- GANTI DENGAN LINK DEMO ASLI
  },
  {
    id: 2,
    title: "Portofolio Fotografer",
    category: "Portofolio",
    imageSrc: "/images/templates/fotografer.jpg",
    livePreviewSlug: "portofolio-fotografer",
    demoUrl: "https://nextjs.org/", // <-- GANTI DENGAN LINK DEMO ASLI
  },
  {
    id: 3,
    title: "Landing Page Aplikasi",
    category: "Landing Page",
    imageSrc: "/images/templates/app-landing.jpg",
    livePreviewSlug: "landing-page-app",
    demoUrl: "https://tailwindcss.com/", // <-- GANTI DENGAN LINK DEMO ASLI
  },
  {
    id: 4,
    title: "Restoran Padang Modern",
    category: "Bisnis",
    imageSrc: "/images/templates/restoran.jpg",
    livePreviewSlug: "restoran-padang",
    demoUrl: "https://startup.uideck.com/", // <-- GANTI DENGAN LINK DEMO ASLI
  },
  {
    id: 5,
    title: "Toko Baju Minimalis",
    category: "E-commerce",
    imageSrc: "/images/templates/toko-baju.jpg",
    livePreviewSlug: "toko-baju-minimalis",
    demoUrl: "https://nextjs.org/", // <-- GANTI DENGAN LINK DEMO ASLI
  },
  {
    id: 6,
    title: "Web Agensi Kreatif",
    category: "Bisnis",
    imageSrc: "/images/templates/agensi.jpg",
    livePreviewSlug: "agensi-kreatif",
    demoUrl: "https://tailwindcss.com/", // <-- GANTI DENGAN LINK DEMO ASLI
  },
];