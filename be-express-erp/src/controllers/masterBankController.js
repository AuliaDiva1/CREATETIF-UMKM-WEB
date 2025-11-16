// File: controllers/masterBankController.js

import * as BankModel from "../models/masterBankModel.js";

/** 🔹 Ambil semua bank */
export const getAllBank = async (req, res) => {
  try {
    const data = await BankModel.getAllBank();
    res.status(200).json({ status: "success", data });
  } catch (err) {
    console.error("Error getAllBank:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** 🔹 Ambil bank by ID */
export const getBankById = async (req, res) => {
  try {
    const data = await BankModel.getBankById(req.params.id);
    if (!data)
      return res
        .status(404)
        .json({ status: "error", message: "Bank tidak ditemukan" });
    res.status(200).json({ status: "success", data });
  } catch (err) {
    console.error("Error getBankById:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** 🔹 Tambah bank */
export const createBank = async (req, res) => {
  try {
    const { kode, rekening, penarikan_tunai, administrasi, keterangan } = req.body;

    // Validasi wajib diisi
    if (!kode || !rekening) {
      return res.status(400).json({
        status: "error",
        message: "Field kode dan rekening wajib diisi",
      });
    }

    // Cek duplikasi kode
    const existing = await BankModel.getBankByKode(kode);
    if (existing) {
      return res
        .status(400)
        .json({ status: "error", message: "Kode sudah digunakan" });
    }

    const bank = await BankModel.createBank({
      kode,
      rekening,
      penarikan_tunai: penarikan_tunai ?? false,
      administrasi: administrasi ?? 0,
      keterangan,
    });

    res.status(201).json({ status: "success", data: bank });
  } catch (err) {
    console.error("Error createBank:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** 🔹 Update bank */
export const updateBank = async (req, res) => {
  try {
    const { kode, rekening, penarikan_tunai, administrasi, keterangan } = req.body;
    const { id } = req.params;

    if (!kode || !rekening) {
      return res.status(400).json({
        status: "error",
        message: "Field kode dan rekening wajib diisi",
      });
    }

    // Cek duplikasi kode jika berubah
    const existing = await BankModel.getBankByKode(kode);
    if (existing && existing.id !== parseInt(id)) {
      return res
        .status(400)
        .json({ status: "error", message: "Kode sudah digunakan oleh bank lain" });
    }

    const updated = await BankModel.updateBank(id, {
      kode,
      rekening,
      penarikan_tunai: penarikan_tunai ?? false,
      administrasi: administrasi ?? 0,
      keterangan,
    });

    if (!updated)
      return res
        .status(404)
        .json({ status: "error", message: "Bank tidak ditemukan" });

    res.status(200).json({ status: "success", data: updated });
  } catch (err) {
    console.error("Error updateBank:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** 🔹 Hapus bank */
export const deleteBank = async (req, res) => {
  try {
    const deleted = await BankModel.deleteBank(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ status: "error", message: "Bank tidak ditemukan" });

    res.status(200).json({
      status: "success",
      message: "Bank berhasil dihapus",
    });
  } catch (err) {
    console.error("Error deleteBank:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};
