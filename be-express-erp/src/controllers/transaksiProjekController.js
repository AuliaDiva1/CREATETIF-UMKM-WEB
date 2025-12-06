import * as TransaksiProjekModel from "../models/transaksiProjekModel.js";

/** * Ambil semua data projek (Admin View) 
 * Mengambil semua proyek dari semua klien
 */
export const getAllProjek = async (req, res) => {
  try {
    const data = await TransaksiProjekModel.getAllProjekWithJoins();
    res.status(200).json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server: " + err.message });
  }
};

/** * Ambil projek by ID (Detail View) 
 */
export const getProjekById = async (req, res) => {
  try {
    const data = await TransaksiProjekModel.getProjekByIdWithJoins(req.params.id);
    
    if (!data) {
      return res.status(404).json({ status: "error", message: "Projek tidak ditemukan" });
    }
    
    res.status(200).json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server: " + err.message });
  }
};

/** * 🔹 KHUSUS DASHBOARD CLIENT 🔹
 * Ambil semua projek milik KLIEN tertentu
 * Endpoint contoh: /api/projek/klien/:klienId
 */
export const getProjekByKlien = async (req, res) => {
  try {
    const { klienId } = req.params;
    
    const data = await TransaksiProjekModel.getProjekByKlienId(klienId);
    
    // Tidak perlu return 404 jika kosong, return array kosong saja (klien baru mungkin belum punya projek)
    res.status(200).json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server: " + err.message });
  }
};

/** * Tambah Projek Baru 
 */
export const createProjek = async (req, res) => {
  try {
    // Destructure data dari body sesuai kolom database
    const { 
      KLIEN_ID, 
      NAMA_PROJEK, 
      DESKRIPSI, 
      STATUS, 
      PROGRESS, 
      NILAI_PROJEK, 
      TANGGAL_MULAI, 
      TANGGAL_SELESAI 
    } = req.body;

    // Validasi data wajib (Sesuai database notNullable)
    if (!KLIEN_ID || !NAMA_PROJEK) {
      return res.status(400).json({ status: "error", message: "Klien ID dan Nama Projek wajib diisi" });
    }

    // Insert ke database
    const newProjek = await TransaksiProjekModel.createProjek({
      KLIEN_ID,
      NAMA_PROJEK,
      DESKRIPSI: DESKRIPSI || null,
      STATUS: STATUS || "Pending Review", // Default status jika kosong
      PROGRESS: PROGRESS || 0,           // Default progress 0
      NILAI_PROJEK: NILAI_PROJEK || null,
      TANGGAL_MULAI: TANGGAL_MULAI || null,
      TANGGAL_SELESAI: TANGGAL_SELESAI || null
    });

    res.status(201).json({ status: "success", data: newProjek });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server: " + err.message });
  }
};

/** * Update Projek (Menggunakan PUT untuk mengganti sumber daya sepenuhnya) 
 */
export const updateProjek = async (req, res) => {
  try {
    const { id } = req.params; // ID Projek
    const updateData = req.body; // Data yang mau diubah (misal progress jadi 100)

    // Validasi sederhana: pastikan ada data yang dikirim
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ status: "error", message: "Tidak ada data yang dikirim untuk update" });
    }

    // Panggil model update
    const updatedProjek = await TransaksiProjekModel.updateProjek(id, updateData);

    res.status(200).json({ status: "success", data: updatedProjek });
  } catch (err) {
    // Handle jika ID tidak ditemukan (biasanya error dari Model throw Error)
    if (err.message === "Projek tidak ditemukan") {
        return res.status(404).json({ status: "error", message: err.message });
    }
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server: " + err.message });
  }
};

/** * Hapus Projek 
 */
export const deleteProjek = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await TransaksiProjekModel.deleteProjek(id);
    
    // Jika model throw error atau return null (tergantung implementasi model)
    if (!deleted) {
      return res.status(404).json({ status: "error", message: "Projek tidak ditemukan" });
    }

    res.status(200).json({ status: "success", message: "Projek berhasil dihapus" });
  } catch (err) {
    if (err.message === "Projek tidak ditemukan") {
        return res.status(404).json({ status: "error", message: err.message });
    }
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server: " + err.message });
  }
};