import { Blog } from "@/types/blog";

const blogData: Blog[] = [
  {
    id: 1,
    title: "Cara Foto Produk Keren Cuma Pakai HP",
    paragraph:
      "Gak perlu kamera mahal! Simak trik pencahayaan dan angle sederhana agar foto produkmu terlihat profesional dan menggugah selera.",
    image: "/images/blog/blog-01.jpg",
    author: {
      name: "Admin Create.tif",
      image: "/images/blog/author-01.png",
      designation: "Fotografer",
    },
    tags: ["Fotografi"],
    publishDate: "2024",
  },
  {
    id: 2,
    title: "Kenapa UMKM Wajib Punya Website Sendiri?",
    paragraph:
      "Jualan di Marketplace itu bagus, tapi punya Website sendiri bikin brand kamu lebih dipercaya. Ini 5 alasannya.",
    image: "/images/blog/blog-02.jpg",
    author: {
      name: "Admin Create.tif",
      image: "/images/blog/author-02.png",
      designation: "Web Developer",
    },
    tags: ["Website"],
    publishDate: "2024",
  },
  {
    id: 3,
    title: "Viral Lewat Filter Instagram & TikTok",
    paragraph:
      "Manfaatkan teknologi AR (Augmented Reality) agar produkmu dicoba ribuan orang secara virtual. Strategi marketing kekinian!",
    image: "/images/blog/blog-03.jpg",
    author: {
      name: "Admin Create.tif",
      image: "/images/blog/author-03.png",
      designation: "AR Creator",
    },
    tags: ["Marketing"],
    publishDate: "2024",
  },
];

export default blogData;