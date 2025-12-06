// transaksiBlogRoutes.js (Versi Koreksi)

import express from "express";
import * as controller from "../controllers/transaksiBlogController.js";
import uploadBlog from "../middleware/upload-blog.js"; 

const router = express.Router();

// 🔹 Field untuk upload Gambar Utama Blog (FEATURED_IMAGE_URL)
const featuredImageField = [
    { name: 'featured_image', maxCount: 1 } 
];

// =======================================================
// 1. ENDPOINT PUBLIK (Public Access)
// =======================================================

// ➡️ GET umum/root harus di atas GET dinamis
// 🔹 GET /api/blog
router.get("/", controller.getAllPublishedBlog);

// 🚨 PERBAIKAN KRITIS 🚨
// Jika Next.js memanggil /transaksi-blog/slug/:slug, maka endpoint harus dibuat di sini.
// Namun, jika Anda menggunakan prefix rute /api/blog, maka rute ini harus ditambahkan:
// Asumsi: Next.js memanggil /api/blog/slug/:slug (berdasarkan kode lama Anda)
// JIKA Next.js Anda memanggil: /transaksi-blog/slug/nama-slug, maka Anda harus menambahkan rute baru:
router.get("/slug/:slug", controller.getBlogBySlug);

// ➡️ Rute dinamis /:slug harus diletakkan paling akhir untuk mencegah tabrakan dengan /slug/:slug atau /
// 🔹 GET /api/blog/:slug (Ini bisa dihilangkan jika /slug/:slug sudah ada, tapi kita biarkan jika masih diperlukan)
// router.get("/:slug", controller.getBlogBySlug); 


// =======================================================
// 2. ENDPOINT ADMIN (CRUD)
// =======================================================

// ➡️ GET statis harus berada di posisi teratas
// 🔹 GET /api/admin/blog/all
router.get("/all", controller.getAllBlogAdmin); 

// ➡️ GET dinamis ditempatkan setelah semua GET statis
// 🔹 GET /api/admin/blog/:id
// Pastikan rute ini tidak berada di atas rute statis lain.
router.get("/:id", controller.getBlogById); 

// --- POST, PUT, DELETE (Tidak perlu urutan khusus) ---

// 🔹 POST /api/admin/blog
router.post(
    "/", 
    uploadBlog.fields(featuredImageField), 
    controller.createBlog
);

// 🔹 PUT /api/admin/blog/:id
router.put(
    "/:id", 
    uploadBlog.fields(featuredImageField), 
    controller.updateBlog
);

// 🔹 DELETE /api/admin/blog/:id
router.delete("/:id", controller.deleteBlog);


export default router;