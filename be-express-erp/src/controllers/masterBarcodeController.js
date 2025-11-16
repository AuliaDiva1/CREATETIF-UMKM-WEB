// File: controllers/masterBarcodeController.js

import * as BarcodeModel from "../models/masterBarcodeModel.js";

/** 🔹 Ambil semua barcode */
export const getAllBarcode = async (req, res) => {
  try {
    const data = await BarcodeModel.getAllBarcode();
    res.status(200).json({ status: "success", data });
  } catch (err) {
    console.error("Error getAllBarcode:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** 🔹 Ambil barcode by ID */
export const getBarcodeById = async (req, res) => {
  try {
    const data = await BarcodeModel.getBarcodeById(req.params.id);
    if (!data)
      return res
        .status(404)
        .json({ status: "error", message: "Barcode tidak ditemukan" });
    res.status(200).json({ status: "success", data });
  } catch (err) {
    console.error("Error getBarcodeById:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** 🔹 Tambah barcode */
export const createBarcode = async (req, res) => {
  try {
    const { kode_barcode, nama, barcode, status, keterangan } = req.body;

    // Validasi wajib diisi
    if (!kode_barcode || !nama || !barcode) {
      return res.status(400).json({
        status: "error",
        message: "Field kode_barcode, nama, dan barcode wajib diisi",
      });
    }

    // Cek duplikasi kode
    const existing = await BarcodeModel.getBarcodeByKode(kode_barcode);
    if (existing) {
      return res
        .status(400)
        .json({ status: "error", message: "Kode barcode sudah digunakan" });
    }

    const newData = await BarcodeModel.createBarcode({
      kode_barcode,
      nama,
      barcode,
      status: status ?? true,
      keterangan,
    });

    res.status(201).json({ status: "success", data: newData });
  } catch (err) {
    console.error("Error createBarcode:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** 🔹 Update barcode */
export const updateBarcode = async (req, res) => {
  try {
    const { kode_barcode, nama, barcode, status, keterangan } = req.body;
    const { id } = req.params;

    if (!kode_barcode || !nama || !barcode) {
      return res.status(400).json({
        status: "error",
        message: "Field kode_barcode, nama, dan barcode wajib diisi",
      });
    }

    // Cek duplikasi kode jika berubah
    const existing = await BarcodeModel.getBarcodeByKode(kode_barcode);
    if (existing && existing.id !== parseInt(id)) {
      return res.status(400).json({
        status: "error",
        message: "Kode barcode sudah digunakan oleh data lain",
      });
    }

    const updated = await BarcodeModel.updateBarcode(id, {
      kode_barcode,
      nama,
      barcode,
      status: status ?? true,
      keterangan,
    });

    if (!updated)
      return res
        .status(404)
        .json({ status: "error", message: "Barcode tidak ditemukan" });

    res.status(200).json({ status: "success", data: updated });
  } catch (err) {
    console.error("Error updateBarcode:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** 🔹 Hapus barcode */
export const deleteBarcode = async (req, res) => {
  try {
    const deleted = await BarcodeModel.deleteBarcode(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ status: "error", message: "Barcode tidak ditemukan" });

    res.status(200).json({
      status: "success",
      message: "Barcode berhasil dihapus",
    });
  } catch (err) {
    console.error("Error deleteBarcode:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};
