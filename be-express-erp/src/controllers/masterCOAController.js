// File: controllers/masterCoaController.js

import * as CoaModel from "../models/masterCOAModel.js";

/** 🔹 Ambil semua COA */
export const getAllCoa = async (req, res) => {
  try {
    const data = await CoaModel.getAllCoa();
    res.status(200).json({ status: "success", data });
  } catch (err) {
    console.error("Error getAllCoa:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** 🔹 Ambil COA by ID */
export const getCoaById = async (req, res) => {
  try {
    const data = await CoaModel.getCoaById(req.params.id);
    if (!data)
      return res
        .status(404)
        .json({ status: "error", message: "Rekening tidak ditemukan" });
    res.status(200).json({ status: "success", data });
  } catch (err) {
    console.error("Error getCoaById:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** 🔹 Tambah COA */
export const createCoa = async (req, res) => {
  try {
    const {
      kode_rekening,
      keterangan,
      jenis_rekening,
      kelompok_rekening,
      parent_id, // parent_id bisa null
      status,
    } = req.body;

    // --- Validasi wajib diisi ---
    if (!kode_rekening) {
      return res.status(400).json({
        status: "error",
        message: "Field 'kode_rekening' wajib diisi",
      });
    }
    if (!keterangan) {
      return res.status(400).json({
        status: "error",
        message: "Field 'keterangan' wajib diisi",
      });
    }
    if (!jenis_rekening) {
      return res.status(400).json({
        status: "error",
        message: "Field 'jenis_rekening' (Induk/Detail) wajib diisi",
      });
    }
     if (!kelompok_rekening) {
      return res.status(400).json({
        status: "error",
        message: "Field 'kelompok_rekening' (Aset, Biaya, dll) wajib diisi",
      });
    }

    // Cek duplikasi (juga ditangani model, tapi baik dicek di controller)
    const existing = await CoaModel.getCoaByKode(kode_rekening);
    if (existing) {
      return res
        .status(400)
        .json({ status: "error", message: "Kode rekening sudah digunakan" });
    }

    const newData = await CoaModel.createCoa({
      kode_rekening,
      keterangan,
      jenis_rekening,
      kelompok_rekening,
      parent_id: parent_id || null, // Pastikan null jika kosong
      status,
    });

    res.status(201).json({ status: "success", data: newData });
  } catch (err) {
    console.error("Error createCoa:", err);
    if (err.code === "KODE_DUPLICATE") {
      return res
        .status(400)
        .json({ status: "error", message: err.message });
    }
    // Error jika parent_id tidak valid
    if (err.code?.includes("SQLITE_CONSTRAINT") || err.code === "ER_NO_REFERENCED_ROW_2") {
       return res.status(400).json({ status: "error", message: "Rekening Induk (parent_id) tidak ditemukan/tidak valid" });
    }
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** 🔹 Update COA */
export const updateCoa = async (req, res) => {
  try {
    const {
      kode_rekening,
      keterangan,
      jenis_rekening,
      kelompok_rekening,
      parent_id,
      status,
    } = req.body;
    const { id } = req.params;

    // --- Validasi wajib diisi ---
    if (!kode_rekening) {
      return res.status(400).json({
        status: "error",
        message: "Field 'kode_rekening' wajib diisi",
      });
    }
    // (Tambahkan validasi lain jika perlu)

    // Cek duplikasi kode jika berubah
    const existing = await CoaModel.getCoaByKode(kode_rekening);
    if (existing && existing.id !== parseInt(id)) {
      return res.status(400).json({
        status: "error",
        message: "Kode rekening sudah digunakan oleh data lain",
      });
    }

    const updated = await CoaModel.updateCoa(id, {
      kode_rekening,
      keterangan,
      jenis_rekening,
      kelompok_rekening,
      parent_id: parent_id || null,
      status,
    });

    if (!updated)
      return res
        .status(404)
        .json({ status: "error", message: "Rekening tidak ditemukan" });

    res.status(200).json({ status: "success", data: updated });
  } catch (err) {
    console.error("Error updateCoa:", err);
    // Error jika parent_id tidak valid
    if (err.code?.includes("SQLITE_CONSTRAINT") || err.code === "ER_NO_REFERENCED_ROW_2") {
       return res.status(400).json({ status: "error", message: "Rekening Induk (parent_id) tidak ditemukan/tidak valid" });
    }
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** 🔹 Hapus COA */
export const deleteCoa = async (req, res) => {
  try {
    const deleted = await CoaModel.deleteCoa(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ status: "error", message: "Rekening tidak ditemukan" });

    res.status(200).json({
      status: "success",
      message: "Rekening berhasil dihapus",
    });
  } catch (err) {
    console.error("Error deleteCoa:", err);
    // Error jika rekening ini masih dipakai sebagai 'parent_id'
    if (err.code?.includes("SQLITE_CONSTRAINT") || err.code === "ER_ROW_IS_REFERENCED_2") {
       return res.status(400).json({ status: "error", message: "Rekening tidak bisa dihapus karena digunakan sebagai Induk rekening lain" });
    }
    res.status(500).json({ status: "error", message: err.message });
  }
};