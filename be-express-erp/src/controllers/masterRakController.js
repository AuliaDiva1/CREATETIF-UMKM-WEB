import * as RakModel from "../models/masterRakModel.js";

/** Ambil semua rak */
export const getAllRak = async (req, res) => {
  try {
    const data = await RakModel.getAllRak();
    res.status(200).json({ status: "success", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** Ambil rak by ID */
export const getRakById = async (req, res) => {
  try {
    const data = await RakModel.getRakById(req.params.id);
    if (!data)
      return res
        .status(404)
        .json({ status: "error", message: "Rak tidak ditemukan" });
    res.status(200).json({ status: "success", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** Tambah rak */
export const createRak = async (req, res) => {
  try {
    const { kode, keterangan } = req.body;

    if (!kode) {
      return res
        .status(400)
        .json({ status: "error", message: "Field kode wajib diisi" });
    }

    const existing = await RakModel.getRakByKode(kode);
    if (existing) {
      return res
        .status(400)
        .json({ status: "error", message: "Kode sudah digunakan" });
    }

    const rak = await RakModel.createRak({
      kode,
      keterangan,
    });

    res.status(201).json({ status: "success", data: rak });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** Update rak */
export const updateRak = async (req, res) => {
  try {
    const { kode, keterangan } = req.body;
    const { id } = req.params;

    if (!kode) {
      return res
        .status(400)
        .json({ status: "error", message: "Field kode wajib diisi" });
    }

    const existing = await RakModel.getRakByKode(kode);
    if (existing && existing.id_rak !== parseInt(id)) {
      return res
        .status(400)
        .json({ status: "error", message: "Kode sudah digunakan oleh rak lain" });
    }

    const updated = await RakModel.updateRak(id, {
      kode,
      keterangan,
    });

    if (!updated)
      return res
        .status(404)
        .json({ status: "error", message: "Rak tidak ditemukan" });

    res.status(200).json({ status: "success", data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** Hapus rak */
export const deleteRak = async (req, res) => {
  try {
    const deleted = await RakModel.deleteRak(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ status: "error", message: "Rak tidak ditemukan" });

    res.status(200).json({
      status: "success",
      message: "Rak berhasil dihapus",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};
