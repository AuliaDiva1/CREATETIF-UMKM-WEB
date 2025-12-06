// src/data/templatesData.ts
export type Template = {
  id: number;
  title: string;
  category: "E-commerce" | "Portofolio" | "Bisnis" | "Landing Page";
  imageSrc: string; // Gambar thumbnail di galeri
  livePreviewSlug: string; // URL untuk halaman preview (cth: /templates/toko-kopi)
  demoUrl: string; // URL website demo ASLI (yang akan di-load di iframe)
};


export const allTemplates = [
  {
    id: 1,
    title: "Template Fashion (Koleksi Musim)",
    category: "Fashion",
    imageSrc: "/images/template/image.png", 
    // Link GitHub: https://github.com/yogaardian/crea.tif
    githubLink: "https://github.com/yogaardian/crea.tif",
  },
  {
    id: 2,
    title: "Template Restoran Modern (Rasa Nusantara)",
    category: "Makanan",
    imageSrc: "/images/template/image1.png", 
    // Link GitHub: https://github.com/SyaefulEffendi/rasa-nusantara.git
    githubLink: "https://github.com/SyaefulEffendi/rasa-nusantara.git",
  },
];