import * as MasterKategoriBarangModel from "../models/masterKategoriBarangModel.js";

/** Ambil semua kategori barang */
export const getAllKategoriBarang = async (req, res) => {
  try {
    const data = await MasterKategoriBarangModel.getAllKategoriBarang();
    res.status(200).json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server: " + err.message });
  }
};

/** Ambil kategori barang by ID */
export const getKategoriBarangById = async (req, res) => {
  try {
    const data = await MasterKategoriBarangModel.getKategoriBarangById(req.params.id);
    if (!data) {
      return res.status(404).json({ status: "error", message: "Kategori barang tidak ditemukan" });
    }
    res.status(200).json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server: " + err.message });
  }
};

/** Tambah kategori barang */
export const createKategoriBarang = async (req, res) => {
  try {
    const { kode_barang, kategori_barang, status, keterangan } = req.body;

    // Validasi data yang diperlukan
    if (!kode_barang || !kategori_barang) {
      return res.status(400).json({ status: "error", message: "Kode Barang dan Kategori Barang wajib diisi" });
    }

    // Menambahkan kategori barang baru
    const kategoriBarang = await MasterKategoriBarangModel.createKategoriBarang({
      kode_barang,
      kategori_barang,
      status: status || "Aktif", // Jika status tidak diberikan, default ke "Aktif"
      keterangan: keterangan || null  // Jika keterangan tidak diberikan, set ke null
    });

    res.status(201).json({ status: "success", data: kategoriBarang });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server: " + err.message });
  }
};

/** Update kategori barang */
export const updateKategoriBarang = async (req, res) => {
  try {
    const { kode_barang, kategori_barang, status, keterangan } = req.body;
    const { id } = req.params;

    // Validasi data yang diperlukan
    if (!kode_barang || !kategori_barang) {
      return res.status(400).json({ status: "error", message: "Kode Barang dan Kategori Barang wajib diisi" });
    }

    // Update kategori barang berdasarkan id
    const kategoriBarang = await MasterKategoriBarangModel.updateKategoriBarang(id, {
      kode_barang,
      kategori_barang,
      status,
      keterangan
    });

    if (!kategoriBarang) {
      return res.status(404).json({ status: "error", message: "Kategori barang tidak ditemukan" });
    }

    res.status(200).json({ status: "success", data: kategoriBarang });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server: " + err.message });
  }
};

/** Hapus kategori barang */
export const deleteKategoriBarang = async (req, res) => {
  try {
    const deleted = await MasterKategoriBarangModel.deleteKategoriBarang(req.params.id);
    if (!deleted) {
      return res.status(404).json({ status: "error", message: "Kategori barang tidak ditemukan" });
    }

    res.status(200).json({ status: "success", message: "Kategori barang berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server: " + err.message });
  }
};
