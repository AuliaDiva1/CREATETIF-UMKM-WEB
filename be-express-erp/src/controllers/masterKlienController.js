// 1. Pastikan path ini sesuai dengan lokasi file repository/model Anda
import * as MasterKlienModel from "../models/masterKlienModel.js"; 

// 2. IMPORT YANG HILANG (Penyebab Error)
import { db } from "../core/config/knex.js"; 
import bcrypt from "bcrypt"; 

// 🔹 GET semua klien
export const getAllKlien = async (req, res) => {
  try {
    // Gunakan nama variabel yang konsisten: MasterKlienModel
    const klien = await MasterKlienModel.getAllKlienWithUser();
    res.status(200).json({
      status: "00",
      message: "Data klien berhasil diambil",
      datetime: new Date().toISOString(),
      total: klien.length,
      data: klien,
    });
  } catch (err) {
    console.error("Error getAllKlien:", err);
    res.status(500).json({
      status: "99",
      message: "Terjadi kesalahan saat mengambil data klien",
      datetime: new Date().toISOString(),
      error: err.message,
    });
  }
};

// 🔹 GET klien by ID
export const getKlienById = async (req, res) => {
  try {
    const klien = await MasterKlienModel.getKlienByIdWithUser(req.params.id);
    
    if (!klien) {
      return res.status(404).json({
        status: "04",
        message: "Klien tidak ditemukan",
        datetime: new Date().toISOString(),
      });
    }
    
    res.status(200).json({
      status: "00",
      message: "Data klien berhasil diambil",
      datetime: new Date().toISOString(),
      data: klien,
    });
  } catch (err) {
    console.error("Error getKlienById:", err);
    res.status(500).json({
      status: "99",
      message: "Terjadi kesalahan saat mengambil data klien",
      datetime: new Date().toISOString(),
      error: err.message,
    });
  }
};

// 🔹 POST klien baru (Register User + Create Profil Klien)
export const addKlien = async (req, res) => {
  try {
    const { nama, email, password, no_telp, alamat } = req.body;

    // Validasi field wajib
    if (!nama || !email || !password || !no_telp) {
      return res.status(400).json({
        status: "01",
        message: "Validasi gagal: Nama, Email, Password, dan No. Telepon wajib diisi",
        datetime: new Date().toISOString(),
      });
    }

    // Cek apakah email sudah terdaftar di tabel users
    // (Sekarang db sudah didefinisikan lewat import)
    const existingUser = await db("users").where("email", email).first();
    if (existingUser) {
      return res.status(400).json({
        status: "01",
        message: "Email sudah terdaftar",
        datetime: new Date().toISOString(),
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user login ke tabel users
    // Role diset sebagai 'USER' sesuai permintaan (bukan 'KLIEN')
    await db("users").insert({
      name: nama,
      email,
      password: hashedPassword,
      role: "USER", 
      created_at: new Date(),
    });

    // Siapkan data klien untuk repository
    const klienData = {
      nama,
      email,
      no_telp,
      alamat,
    };

    // Panggil repository untuk create klien
    const newKlien = await MasterKlienModel.createKlien(klienData);

    res.status(201).json({
      status: "00",
      message: "Klien berhasil ditambahkan",
      datetime: new Date().toISOString(),
      data: newKlien,
    });
  } catch (err) {
    console.error("Error addKlien:", err);
    res.status(500).json({
      status: "99",
      message: "Terjadi kesalahan saat menambahkan klien",
      datetime: new Date().toISOString(),
      error: err.message,
    });
  }
};

// 🔹 PUT update klien
export const updateKlien = async (req, res) => {
  try {
    const klienId = req.params.id;

    // Cek apakah klien ada
    const existingKlien = await MasterKlienModel.getKlienByIdWithUser(klienId);
    if (!existingKlien) {
      return res.status(404).json({
        status: "04",
        message: "Klien tidak ditemukan",
        datetime: new Date().toISOString(),
      });
    }

    // Ambil data dari body
    const { nama, email, no_telp, alamat } = req.body;

    const updateData = {
      nama,
      email,
      no_telp,
      alamat,
    };

    // Panggil repository untuk update
    const updatedKlien = await MasterKlienModel.updateKlien(klienId, updateData);

    res.status(200).json({
      status: "00",
      message: "Klien berhasil diperbarui",
      datetime: new Date().toISOString(),
      data: updatedKlien,
    });
  } catch (err) {
    console.error("Error updateKlien:", err);
    res.status(500).json({
      status: "99",
      message: "Terjadi kesalahan saat memperbarui data klien",
      datetime: new Date().toISOString(),
      error: err.message,
    });
  }
};

// 🔹 DELETE klien
export const deleteKlien = async (req, res) => {
  try {
    const klienId = req.params.id;

    // Cek keberadaan data sebelum dihapus
    const klien = await MasterKlienModel.getKlienByIdWithUser(klienId);
    
    if (!klien) {
      return res.status(404).json({
        status: "04",
        message: "Klien tidak ditemukan",
        datetime: new Date().toISOString(),
      });
    }

    // Hapus klien
    await MasterKlienModel.deleteKlien(klienId);

    res.status(200).json({
      status: "00",
      message: "Klien berhasil dihapus beserta data user login",
      datetime: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error deleteKlien:", err);
    res.status(500).json({
      status: "99",
      message: "Terjadi kesalahan saat menghapus klien",
      datetime: new Date().toISOString(),
      error: err.message,
    });
  }
};