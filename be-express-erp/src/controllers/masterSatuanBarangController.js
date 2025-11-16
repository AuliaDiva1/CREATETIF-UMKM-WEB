import * as SatuanBarangModel from "../models/masterSatuanBarangModel.js";

/** Ambil semua satuan barang */
export const getAllSatuanBarang = async (req, res) => {
  try {
    const data = await SatuanBarangModel.getAllSatuanBarang();
    res.status(200).json({ status: "success", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** Ambil satuan barang by ID */
export const getSatuanBarangById = async (req, res) => {
  try {
    const data = await SatuanBarangModel.getSatuanBarangById(req.params.id);
    if (!data)
      return res
        .status(404)
        .json({ status: "error", message: "Satuan barang tidak ditemukan" });
    res.status(200).json({ status: "success", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** Tambah satuan barang */
export const createSatuanBarang = async (req, res) => {
  try {
    const { kode, satuan_barang, keterangan, status } = req.body;

    if (!kode || !satuan_barang) {
      return res
        .status(400)
        .json({ status: "error", message: "Field kode dan satuan barang wajib diisi" });
    }

    const existing = await SatuanBarangModel.getSatuanBarangByKode(kode);
    if (existing) {
      return res
        .status(400)
        .json({ status: "error", message: "Kode sudah digunakan" });
    }

    const satuan = await SatuanBarangModel.createSatuanBarang({
      kode,
      satuan_barang,
      keterangan,
      status,
    });

    res.status(201).json({ status: "success", data: satuan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** Update satuan barang */
export const updateSatuanBarang = async (req, res) => {
  try {
    const { kode, satuan_barang, keterangan, status } = req.body;
    const { id } = req.params;

    if (!kode || !satuan_barang) {
      return res
        .status(400)
        .json({ status: "error", message: "Field kode dan satuan barang wajib diisi" });
    }

    const existing = await SatuanBarangModel.getSatuanBarangByKode(kode);
    if (existing && existing.id_satuan !== parseInt(id)) {
      return res
        .status(400)
        .json({ status: "error", message: "Kode sudah digunakan oleh satuan lain" });
    }

    const updated = await SatuanBarangModel.updateSatuanBarang(id, {
      kode,
      satuan_barang,
      keterangan,
      status,
    });

    if (!updated)
      return res
        .status(404)
        .json({ status: "error", message: "Satuan barang tidak ditemukan" });

    res.status(200).json({ status: "success", data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** Hapus satuan barang */
export const deleteSatuanBarang = async (req, res) => {
  try {
    const deleted = await SatuanBarangModel.deleteSatuanBarang(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ status: "error", message: "Satuan barang tidak ditemukan" });

    res.status(200).json({
      status: "success",
      message: "Satuan barang berhasil dihapus",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};
