import * as ProdukModel from "../models/masterProdukModel.js";
import { db } from "../core/config/knex.js";
import fs from "fs";
import path from "path";

// 🔽🔽 PERBAIKAN: Mengisi kode helper deleteFile 🔽🔽
const deleteFile = (filePath) => {
  if (filePath) {
    // filePath bisa jadi /uploads/produk/NAMFILE atau path.join(...)
    // Kita normalkan dulu
    let filename = "";
    if (filePath.includes("/uploads/produk/")) {
      filename = filePath.replace("/uploads/produk/", "");
    } else {
      // Jika path-nya absolut (dari req.files.file.path)
      filename = path.basename(filePath);
    }
    
    const fullPath = path.join("./uploads/produk", filename);

    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
        console.log("File berhasil dihapus:", fullPath);
      } catch (err) {
        console.error("Error menghapus file:", err);
      }
    } else {
      console.warn("File tidak ditemukan, tidak bisa dihapus:", fullPath);
    }
  }
};
// 🔼🔼 -------------------------------------------- 🔼🔼

/**
 * Helper untuk generate Kode Produk unik
 * Format: PRD-TATHBL-JAMDETIK (Contoh: PRD-251109-014223)
 */
const generateKodeProduk = async () => {
  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);
  const mm = (now.getMonth() + 1).toString().padStart(2, "0");
  const dd = now.getDate().toString().padStart(2, "0");
  const hh = now.getHours().toString().padStart(2, "0");
  const min = now.getMinutes().toString().padStart(2, "0");
  const ss = now.getSeconds().toString().padStart(2, "0");

  let newKode = `PRD-${yy}${mm}${dd}-${hh}${min}${ss}`;

  // Cek ke DB untuk memastikan 100% unik
  const existing = await db("master_produk")
    .where("kode_produk", newKode)
    .first();
  if (existing) {
    // Jika (sangat) kebetulan tabrakan, tambahkan milidetik
    newKode = `PRD-${yy}${mm}${dd}-${hh}${min}${ss}${now.getMilliseconds()}`;
  }
  return newKode;
};

// 🔹 GET semua produk (DILENGKAPI)
export const getAllProduk = async (req, res) => {
  try {
    const data = await ProdukModel.getAllProdukWithJoins();
    res.status(200).json({
      status: "00",
      message: "Data produk berhasil diambil",
      datetime: new Date().toISOString(),
      data,
    });
  } catch (err) {
    console.error("Error getAllProduk:", err);
    res.status(500).json({
      status: "99",
      message: "Terjadi kesalahan saat mengambil data produk",
      datetime: new Date().toISOString(),
      error: err.message,
    });
  }
};

// 🔹 GET produk by ID (DILENGKAPI)
export const getProdukById = async (req, res) => {
  try {
    const produkId = req.params.id;
    const data = await ProdukModel.getProdukByIdWithJoins(produkId);

    if (data) {
      res.status(200).json({
        status: "00",
        message: "Data produk berhasil diambil",
        datetime: new Date().toISOString(),
        data,
      });
    } else {
      res.status(404).json({
        status: "04",
        message: "Produk tidak ditemukan",
        datetime: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.error("Error getProdukById:", err);
    res.status(500).json({
      status: "99",
      message: "Terjadi kesalahan saat mengambil data produk",
      datetime: new Date().toISOString(),
      error: err.message,
    });
  }
};

// 🔹 POST produk baru (Kode Asli Anda Sudah Benar)
export const addProduk = async (req, res) => {
  try {
    // Hapus 'kode_produk' dari validasi
    const { nama_produk } = req.body;

    // Validasi field wajib
    if (!nama_produk) {
      // <-- Hanya validasi nama
      return res.status(400).json({
        status: "01",
        message: "Validasi gagal: Nama Produk wajib diisi",
        datetime: new Date().toISOString(),
      });
    }

    // Generate kode
    const newKodeProduk = await generateKodeProduk();

    // Siapkan data produk dari body
    const produkData = {
      ...req.body,
      kode_produk: newKodeProduk, // <-- TIMPA 'kode_produk' dengan kode baru
    };

    // Handle file uploads (tetap sama)
    if (req.files) {
      if (req.files.file_gambar_1) {
        produkData.file_gambar_1 = `/uploads/produk/${req.files.file_gambar_1[0].filename}`;
      }
      if (req.files.file_gambar_2) {
        produkData.file_gambar_2 = `/uploads/produk/${req.files.file_gambar_2[0].filename}`;
      }
      if (req.files.file_gambar_3) {
        produkData.file_gambar_3 = `/uploads/produk/${req.files.file_gambar_3[0].filename}`;
      }
    }

    // Panggil model untuk create produk (tetap sama)
    const newProduk = await ProdukModel.createProduk(produkData);

    res.status(201).json({
      status: "00",
      message: "Produk berhasil ditambahkan",
      datetime: new Date().toISOString(),
      data: newProduk,
    });
  } catch (err) {
    console.error("Error addProduk:", err);
    res.status(500).json({
      status: "99",
      message: "Terjadi kesalahan saat menambahkan produk",
      datetime: new Date().toISOString(),
      error: err.message,
    });
  }
};

// 🔹 PUT update produk (DIPERBAIKI)
export const updateProduk = async (req, res) => {
  try {
    const produkId = req.params.id;
    const existingProduk = await ProdukModel.getProdukByIdWithJoins(produkId);

    // File yang baru di-upload (jika ada)
    const newFiles = req.files || {};

    if (!existingProduk) {
      // 🔽 Hapus file yang terlanjur di-upload jika produk tidak ada
      if (newFiles.file_gambar_1) deleteFile(newFiles.file_gambar_1[0].path);
      if (newFiles.file_gambar_2) deleteFile(newFiles.file_gambar_2[0].path);
      if (newFiles.file_gambar_3) deleteFile(newFiles.file_gambar_3[0].path);
      // 🔼 -----------------------------------------------------------

      return res.status(404).json({
        status: "04",
        message: "Produk tidak ditemukan",
        datetime: new Date().toISOString(),
      });
    }

    const produkData = { ...req.body };

    // 🔽🔽 PERBAIKAN 1: Mencegah 'kode_produk' di-update 🔽🔽
    // Selalu hapus 'kode_produk' dari data update, karena ini adalah KODE UNIK
    delete produkData.kode_produk;
    // 🔼🔼 --------------------------------------------------- 🔼🔼

    // 🔽🔽 PERBAIKAN 2: Handle update file & hapus file lama 🔽🔽
    const fileFields = ["file_gambar_1", "file_gambar_2", "file_gambar_3"];

    for (const field of fileFields) {
      if (newFiles[field]) {
        // 1. Ada file baru di-upload, set path baru
        produkData[field] = `/uploads/produk/${newFiles[field][0].filename}`;

        // 2. Hapus file lama (jika ada)
        if (existingProduk[field]) {
          deleteFile(existingProduk[field]);
        }
      }
    }
    // 🔼🔼 -------------------------------------------------------- 🔼🔼

    // Panggil model
    const updatedProduk = await ProdukModel.updateProduk(produkId, produkData);

    res.status(200).json({
      status: "00",
      message: "Produk berhasil diperbarui",
      datetime: new Date().toISOString(),
      data: updatedProduk,
    });
  } catch (err) {
    console.error("Error updateProduk:", err);
    res.status(500).json({
      status: "99",
      message: "Terjadi kesalahan saat memperbarui produk",
      datetime: new Date().toISOString(),
      error: err.message,
    });
  }
};

// 🔹 DELETE produk (DIPERBAIKI)
export const deleteProduk = async (req, res) => {
  try {
    const produkId = req.params.id;

    // Ambil data produk DULU untuk mendapatkan path file
    const produk = await ProdukModel.getProdukByIdWithJoins(produkId);

    if (!produk) {
      return res.status(404).json({
        status: "04",
        message: "Produk tidak ditemukan",
        datetime: new Date().toISOString(),
      });
    }

    // 🔽🔽 PERBAIKAN: Hapus file gambar terkait 🔽🔽
    deleteFile(produk.file_gambar_1);
    deleteFile(produk.file_gambar_2);
    deleteFile(produk.file_gambar_3);
    // 🔼🔼 --------------------------------------- 🔼🔼

    // Hapus data dari database
    await ProdukModel.deleteProduk(produkId);

    res.status(200).json({
      status: "00",
      message: "Produk berhasil dihapus",
      datetime: new Date().toISOString(),
      data: produk, // Mengembalikan data produk yang dihapus
    });
  } catch (err) {
    console.error("Error deleteProduk:", err);
    res.status(500).json({
      status: "99",
      message: "Terjadi kesalahan saat menghapus produk",
      datetime: new Date().toISOString(),
      error: err.message,
    });
  }
};