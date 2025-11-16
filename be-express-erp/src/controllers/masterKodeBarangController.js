import * as KodeBarangModel from "../models/masterKodeBarangModel.js";

/** Ambil semua kode barang */
export const getAllKodeBarang = async (req, res) => {
  try {
    const data = await KodeBarangModel.getAllKodeBarang();
    res.status(200).json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** Ambil kode barang by ID */
export const getKodeBarangById = async (req, res) => {
  try {
    const data = await KodeBarangModel.getKodeBarangById(req.params.id);
    if (!data) return res.status(404).json({ status: "error", message: "Kode barang tidak ditemukan" });
    res.status(200).json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** Tambah kode barang */
export const createKodeBarang = async (req, res) => {
  try {
    const { kode_barang } = req.body;
    if (!kode_barang) {
      return res.status(400).json({ status: "error", message: "Kode barang wajib diisi" });
    }
    const kodeBarang = await KodeBarangModel.createKodeBarang({ kode_barang });
    res.status(201).json({ status: "success", data: kodeBarang });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** Update kode barang */
export const updateKodeBarang = async (req, res) => {
  try {
    const { kode_barang } = req.body;
    const { id } = req.params;

    if (!kode_barang) {
      return res.status(400).json({ status: "error", message: "Kode barang wajib diisi" });
    }

    const kodeBarang = await KodeBarangModel.updateKodeBarang(id, { kode_barang });
    if (!kodeBarang) return res.status(404).json({ status: "error", message: "Kode barang tidak ditemukan" });

    res.status(200).json({ status: "success", data: kodeBarang });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** Hapus kode barang */
export const deleteKodeBarang = async (req, res) => {
  try {
    const deleted = await KodeBarangModel.deleteKodeBarang(req.params.id);
    if (!deleted) return res.status(404).json({ status: "error", message: "Kode barang tidak ditemukan" });
    res.status(200).json({ status: "success", message: "Kode barang berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
