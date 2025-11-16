// File: controllers/masterJenisSupplierController.js

import * as JenisSupplierModel from "../models/masterJenisSupplierModel.js";

/** 🔹 Ambil semua jenis supplier */
export const getAllJenisSupplier = async (req, res) => {
  try {
    const data = await JenisSupplierModel.getAllJenisSupplier();
    res.status(200).json({ status: "success", data });
  } catch (err) {
    console.error("Error getAllJenisSupplier:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** 🔹 Ambil jenis supplier by ID */
export const getJenisSupplierById = async (req, res) => {
  try {
    const data = await JenisSupplierModel.getJenisSupplierById(req.params.id);
    if (!data)
      return res
        .status(404)
        .json({ status: "error", message: "Jenis supplier tidak ditemukan" });
    res.status(200).json({ status: "success", data });
  } catch (err) {
    console.error("Error getJenisSupplierById:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** 🔹 Tambah jenis supplier */
export const createJenisSupplier = async (req, res) => {
  try {
    const { kode, keterangan } = req.body;

    // Validasi wajib diisi
    if (!kode) {
      return res.status(400).json({
        status: "error",
        message: "Field kode wajib diisi",
      });
    }

    // Cek duplikasi kode
    const existing = await JenisSupplierModel.getJenisSupplierByKode(kode);
    if (existing) {
      return res
        .status(400)
        .json({ status: "error", message: "Kode sudah digunakan" });
    }

    const newData = await JenisSupplierModel.createJenisSupplier({
      kode,
      keterangan,
    });

    res.status(201).json({ status: "success", data: newData });
  } catch (err) {
    console.error("Error createJenisSupplier:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** 🔹 Update jenis supplier */
export const updateJenisSupplier = async (req, res) => {
  try {
    const { kode, keterangan } = req.body;
    const { id } = req.params;

    if (!kode) {
      return res.status(400).json({
        status: "error",
        message: "Field kode wajib diisi",
      });
    }

    // Cek duplikasi kode jika berubah
    const existing = await JenisSupplierModel.getJenisSupplierByKode(kode);
    if (existing && existing.id !== parseInt(id)) {
      return res.status(400).json({
        status: "error",
        message: "Kode sudah digunakan oleh data lain",
      });
    }

    const updated = await JenisSupplierModel.updateJenisSupplier(id, {
      kode,
      keterangan,
    });

    if (!updated)
      return res
        .status(404)
        .json({ status: "error", message: "Jenis supplier tidak ditemukan" });

    res.status(200).json({ status: "success", data: updated });
  } catch (err) {
    console.error("Error updateJenisSupplier:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** 🔹 Hapus jenis supplier */
export const deleteJenisSupplier = async (req, res) => {
  try {
    const deleted = await JenisSupplierModel.deleteJenisSupplier(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ status: "error", message: "Jenis supplier tidak ditemukan" });

    res.status(200).json({
      status: "success",
      message: "Jenis supplier berhasil dihapus",
    });
  } catch (err) {
    console.error("Error deleteJenisSupplier:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};
