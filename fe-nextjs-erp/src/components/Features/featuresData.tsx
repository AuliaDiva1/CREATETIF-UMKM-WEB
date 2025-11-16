import { Feature } from "@/types/feature";

const featuresData: Feature[] = [
  {
    id: 1,
    icon: (
      // Icon: Web / Laptop
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    ),
    title: "Web Development",
    paragraph:
      "Bikin UMKM kamu terlihat kredibel dan profesional. Website yang cepat, mudah diakses, dan siap bikin bisnismu 'Naik Kelas' ke ranah digital.",
  },
  {
    id: 2,
    icon: (
      // Icon: Smartphone / AR Magic
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
        <path d="M12 15l-3 3a2.21 2.21 0 0 0 0 3.12 2.21 2.21 0 0 0 3.12 0l3-3"></path>
        <path d="M9 9l3 3"></path>
        <path d="M15 12l-3-3"></path>
        <path d="M5 3l3.14 3.14"></path>
        <path d="M17 19l4.86-4.86"></path> 
      </svg>
    ),
    title: "AR Development",
    paragraph:
      "Cara promosi unik biar brand kamu viral! Kami buatkan Augmented Reality sesuai Brand Kamu yang bikin pelanggan betah main sama brand kamu.",
  },
  {
    id: 3,
    icon: (
      // Icon: Camera / Photo
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
        <circle cx="12" cy="13" r="4"></circle>
      </svg>
    ),
    title: "Foto Produk",
    paragraph:
      "Foto buram bikin pelanggan ragu? Kami bantu buatkan foto produk yang tajam, estetik, dan menggoda biar jualan makin laris manis.",
  },
];

export default featuresData;