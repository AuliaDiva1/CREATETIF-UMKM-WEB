import * as GudangModel from "../models/masterGudangModel.js";

/** Ambil semua gudang */
export const getAllGudang = async (req, res) => {
  try {
    const data = await GudangModel.getAllGudang();
    res.status(200).json({ status: "success", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** Ambil gudang by ID */
export const getGudangById = async (req, res) => {
  try {
    const data = await GudangModel.getGudangById(req.params.id);
    if (!data)
      return res
        .status(404)
        .json({ status: "error", message: "Gudang tidak ditemukan" });
    res.status(200).json({ status: "success", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** Tambah gudang */
export const createGudang = async (req, res) => {
  try {
    const { kode, keterangan } = req.body;

    if (!kode) {
      return res
        .status(400)
        .json({ status: "error", message: "Field kode wajib diisi" });
    }

    const existing = await GudangModel.getGudangByKode(kode);
    if (existing) {
      return res
        .status(400)
        .json({ status: "error", message: "Kode sudah digunakan" });
    }

    const gudang = await GudangModel.createGudang({
      kode,
      keterangan,
    });

    res.status(201).json({ status: "success", data: gudang });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** Update gudang */
export const updateGudang = async (req, res) => {
  try {
    const { kode, keterangan } = req.body;
    const { id } = req.params;

    if (!kode) {
      return res
        .status(400)
        .json({ status: "error", message: "Field kode wajib diisi" });
    }

    const existing = await GudangModel.getGudangByKode(kode);
    if (existing && existing.id_gudang !== parseInt(id)) {
      return res
        .status(400)
        .json({ status: "error", message: "Kode sudah digunakan oleh gudang lain" });
    }

    const updated = await GudangModel.updateGudang(id, {
      kode,
      keterangan,
    });

    if (!updated)
      return res
        .status(404)
        .json({ status: "error", message: "Gudang tidak ditemukan" });

    res.status(200).json({ status: "success", data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** Hapus gudang */
export const deleteGudang = async (req, res) => {
  try {
    const deleted = await GudangModel.deleteGudang(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ status: "error", message: "Gudang tidak ditemukan" });

    res.status(200).json({
      status: "success",
      message: "Gudang berhasil dihapus",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};
