import * as TransaksiBlogModel from "../models/transaksiBlogModel.js";
import { db } from "../core/config/knex.js";
import fs from "fs";
import path from "path";

// 🔽🔽 HELPER: Delete File Blog 🔽🔽
const deleteFile = (filePath) => {
  if (filePath) {
    // Contoh filePath: /api/uploads/blog/featured_image-167...jpg
    // Kita normalkan ke nama file saja
    let filename = "";
    if (filePath.includes("/api/uploads/blog/")) {
      filename = filePath.replace("/api/uploads/blog/", "");
    } else {
      // Jika path-nya absolut dari Multer (req.files.file.path)
      filename = path.basename(filePath);
    }
    
    // Path lokal di server
    const fullPath = path.join("./uploads/blog", filename);

    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
        console.log("File Blog berhasil dihapus:", fullPath);
      } catch (err) {
        console.error("Error menghapus file Blog:", err);
      }
    } else {
      console.warn("File Blog tidak ditemukan, tidak bisa dihapus:", fullPath);
    }
  }
};
// 🔼🔼 -------------------------------------------- 🔼🔼


// --- PUBLIC READ OPERATIONS ---

export const getAllPublishedBlog = async (req, res) => {
  try {
    const data = await TransaksiBlogModel.getAllPublishedBlog();
    res.status(200).json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server: " + err.message });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const data = await TransaksiBlogModel.getBlogBySlug(slug);

    if (!data) {
      return res.status(404).json({ status: "error", message: "Artikel tidak ditemukan atau belum dipublikasikan" });
    }
    // Increment view count secara asinkron (tanpa menunggu hasilnya)
    TransaksiBlogModel.incrementViewCount(data.BLOG_ID).catch(console.error); 
    res.status(200).json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server: " + err.message });
  }
};

// --- ADMIN READ OPERATIONS ---

export const getAllBlogAdmin = async (req, res) => {
  try {
    const data = await TransaksiBlogModel.getAllBlog();
    res.status(200).json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server: " + err.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    // Perbaikan: Konversi ID ke Number secara eksplisit
    const blogId = Number(req.params.id); 
    
    const data = await TransaksiBlogModel.getBlogById(blogId);
    
    if (!data) {
      return res.status(404).json({ status: "error", message: "Postingan blog tidak ditemukan" });
    }
    
    res.status(200).json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server: " + err.message });
  }
};


// --- CRUD OPERATIONS (ADMIN ONLY) ---

/** * 🔹 Tambah Postingan Blog Baru (DIPERBARUI untuk file) 
 */
export const createBlog = async (req, res) => {
  // File yang baru di-upload (jika ada)
  const newFiles = req.files || {};
  const featuredImage = newFiles.featured_image ? newFiles.featured_image[0] : null;

  try {
    // Destructure data wajib
    const { 
      TITLE, 
      SLUG, 
      CONTENT, 
      AUTHOR_NAME,
      STATUS,
      // ... sisanya ...
    } = req.body;

    // Validasi data wajib 
    if (!TITLE || !SLUG || !CONTENT || !AUTHOR_NAME) {
      // Jika validasi gagal, HAPUS file yang terlanjur di-upload oleh Multer
      if (featuredImage) deleteFile(featuredImage.path);
      return res.status(400).json({ status: "error", message: "Judul, Slug, Konten, dan Nama Penulis wajib diisi" });
    }
    
    const blogData = { ...req.body };

    // Set path gambar dari file yang di-upload
    if (featuredImage) {
        // Path yang disimpan ke DB harus path publik yang bisa diakses client
        blogData.FEATURED_IMAGE_URL = `/api/uploads/blog/${featuredImage.filename}`;
    } else {
        blogData.FEATURED_IMAGE_URL = null;
    }
    
    // Insert ke database
    const newBlog = await TransaksiBlogModel.createBlog(blogData);

    res.status(201).json({ status: "success", data: newBlog });
  } catch (err) {
    // Jika terjadi error database (misal SLUG duplikat), HAPUS file yang terlanjur di-upload
    if (featuredImage) deleteFile(featuredImage.path);
    
    if (err.code === '23505' || err.message.includes('duplicate key')) {
        return res.status(400).json({ status: "error", message: "Slug sudah digunakan. Silakan gunakan slug lain." });
    }
    console.error("Error createBlog:", err);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server: " + err.message });
  }
};

/** * 🔹 Update Postingan Blog (DIPERBARUI untuk file)
 */
export const updateBlog = async (req, res) => {
  // File yang baru di-upload (jika ada)
  const newFiles = req.files || {};
  const featuredImage = newFiles.featured_image ? newFiles.featured_image[0] : null;
  
  // Perbaikan: Konversi ID ke Number secara eksplisit
  const blogId = Number(req.params.id);

  try {
    // 1. Ambil data lama
    const existingBlog = await TransaksiBlogModel.getBlogById(blogId);

    if (!existingBlog) {
      // Jika blog tidak ada, HAPUS file yang terlanjur di-upload
      if (featuredImage) deleteFile(featuredImage.path);
      return res.status(404).json({ status: "error", message: "Postingan Blog tidak ditemukan" });
    }

    const updateData = { ...req.body };
    
    // Mencegah VIEW_COUNT dan BLOG_ID di-overwrite
    delete updateData.VIEW_COUNT;
    delete updateData.BLOG_ID;

    // Handle update file & hapus file lama 
    if (featuredImage) {
      // 1. Ada file baru di-upload, set path baru
      updateData.FEATURED_IMAGE_URL = `/api/uploads/blog/${featuredImage.filename}`;

      // 2. Hapus file lama (jika ada)
      if (existingBlog.FEATURED_IMAGE_URL) {
        deleteFile(existingBlog.FEATURED_IMAGE_URL);
      }
    } else if (updateData.FEATURED_IMAGE_URL === 'null') {
      // Logika untuk menghapus gambar tanpa upload baru (set ke NULL)
      if (existingBlog.FEATURED_IMAGE_URL) {
        deleteFile(existingBlog.FEATURED_IMAGE_URL);
      }
      updateData.FEATURED_IMAGE_URL = null; // Set di DB jadi NULL
    }

    // Panggil model update
    const updatedBlog = await TransaksiBlogModel.updateBlog(blogId, updateData);

    res.status(200).json({ status: "success", data: updatedBlog });
  } catch (err) {
    // Jika error, HAPUS file yang terlanjur di-upload
    if (featuredImage) deleteFile(featuredImage.path);
    
    if (err.message === "Postingan Blog tidak ditemukan") {
        return res.status(404).json({ status: "error", message: err.message });
    }
    if (err.code === '23505' || err.message.includes('duplicate key')) {
        return res.status(400).json({ status: "error", message: "Slug sudah digunakan. Silakan gunakan slug lain." });
    }
    console.error("Error updateBlog:", err);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server: " + err.message });
  }
};

/** * 🔹 Hapus Postingan Blog (DIPERBARUI untuk file)
 */
export const deleteBlog = async (req, res) => {
  try {
    // Perbaikan: Konversi ID ke Number secara eksplisit
    const blogId = Number(req.params.id);

    // Ambil data blog DULU untuk mendapatkan path file
    const existingBlog = await TransaksiBlogModel.getBlogById(blogId);

    if (!existingBlog) {
      return res.status(404).json({ status: "error", message: "Postingan Blog tidak ditemukan" });
    }

    // Hapus file gambar terkait 
    deleteFile(existingBlog.FEATURED_IMAGE_URL);

    // Hapus data dari database. Model akan mengembalikan objek blog yang dihapus.
    await TransaksiBlogModel.deleteBlog(blogId);

    res.status(200).json({ status: "success", message: "Postingan blog berhasil dihapus" });
  } catch (err) {
    console.error("Error deleteBlog:", err);
    if (err.message === "Postingan Blog tidak ditemukan") {
      return res.status(404).json({ status: "error", message: err.message });
    }
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server: " + err.message });
  }
};