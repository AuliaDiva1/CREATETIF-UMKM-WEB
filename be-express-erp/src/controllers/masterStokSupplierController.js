// File: controllers/masterStokSupplierController.js

import * as StokSupplierModel from "../models/masterStokSupplierModel.js";
// (Opsional: impor model lain untuk validasi FK)
// import * as SupplierModel from "../models/masterSupplierModel.js";
// import * as BarcodeModel from "../models/masterBarcodeModel.js";

/** 🔹 Ambil semua stok supplier */
export const getAllStokSupplier = async (req, res) => {
  try {
    const data = await StokSupplierModel.getAllStokSupplier();
    res.status(200).json({ status: "success", data });
  } catch (err) {
    console.error("Error getAllStokSupplier:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** 🔹 Ambil stok supplier by ID */
export const getStokSupplierById = async (req, res) => {
  try {
    const data = await StokSupplierModel.getStokSupplierById(req.params.id);
    if (!data)
      return res
        .status(404)
        .json({ status: "error", message: "Data stok supplier tidak ditemukan" });
    res.status(200).json({ status: "success", data });
  } catch (err) {
    console.error("Error getStokSupplierById:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** 🔹 Tambah stok supplier */
export const createStokSupplier = async (req, res) => {
  try {
    const {
      kode_supplier,
      kode_barcode,
      reorder_point,
      sisa_stok,
    } = req.body;

    // --- Validasi wajib diisi ---
    if (!kode_supplier) {
      return res.status(400).json({
        status: "error",
        message: "Field 'kode_supplier' wajib diisi",
      });
    }
    if (!kode_barcode) {
      return res.status(400).json({
        status: "error",
        message: "Field 'kode_barcode' (barang) wajib diisi",
      });
    }

    // Cek duplikasi composite key (Supplier + Barcode)
    const existing = await StokSupplierModel.getStokByKeys(kode_supplier, kode_barcode);
    if (existing) {
      return res
        .status(400)
        .json({ status: "error", message: "Kombinasi supplier dan barang ini sudah terdaftar" });
    }

    // (Opsional) Cek apakah 'kode_supplier' dan 'kode_barcode' valid
    // const supplierExists = await SupplierModel.getSupplierByKode(kode_supplier);
    // const barcodeExists = await BarcodeModel.getBarcodeByKode(kode_barcode);
    // if (!supplierExists || !barcodeExists) {
    //   return res.status(400).json({ status: "error", message: "Kode supplier atau kode barcode tidak valid" });
    // }

    const newData = await StokSupplierModel.createStokSupplier({
      kode_supplier,
      kode_barcode,
      reorder_point,
      sisa_stok,
    });

    res.status(201).json({ status: "success", data: newData });
  } catch (err) {
    console.error("Error createStokSupplier:", err);
    // Tangani error STOK_DUPLICATE dari model (jika ada)
    if (err.code === "STOK_DUPLICATE") {
      return res
        .status(400)
        .json({ status: "error", message: err.message || "Kombinasi supplier dan barang ini sudah terdaftar" });
    }
    // Tangani error foreign key (jika kode_supplier atau kode_barcode tidak ada)
    if (err.code?.includes("SQLITE_CONSTRAINT") || err.code === "ER_NO_REFERENCED_ROW_2") {
       return res.status(400).json({ status: "error", message: "Kode supplier atau kode barcode tidak ditemukan/tidak valid" });
    }
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** 🔹 Update stok supplier */
export const updateStokSupplier = async (req, res) => {
  try {
    const {
      kode_supplier,
      kode_barcode,
      reorder_point,
      sisa_stok,
    } = req.body;
    const { id } = req.params;

    // --- Validasi wajib diisi ---
    if (!kode_supplier) {
      return res.status(400).json({
        status: "error",
        message: "Field 'kode_supplier' wajib diisi",
      });
    }
    if (!kode_barcode) {
      return res.status(400).json({
        status: "error",
        message: "Field 'kode_barcode' (barang) wajib diisi",
      });
    }

    // Cek duplikasi composite key jika berubah
    const existing = await StokSupplierModel.getStokByKeys(kode_supplier, kode_barcode);
    if (existing && existing.id !== parseInt(id)) {
      return res.status(400).json({
        status: "error",
        message: "Kombinasi supplier dan barang ini sudah digunakan oleh data lain",
      });
    }

    const updated = await StokSupplierModel.updateStokSupplier(id, {
      kode_supplier,
      kode_barcode,
      reorder_point,
      sisa_stok,
    });

    if (!updated)
      return res
        .status(404)
        .json({ status: "error", message: "Data stok supplier tidak ditemukan" });

    res.status(200).json({ status: "success", data: updated });
  } catch (err) {
    console.error("Error updateStokSupplier:", err);
     // Tangani error foreign key (jika kode_supplier atau kode_barcode tidak ada)
    if (err.code?.includes("SQLITE_CONSTRAINT") || err.code === "ER_NO_REFERENCED_ROW_2") {
       return res.status(400).json({ status: "error", message: "Kode supplier atau kode barcode tidak ditemukan/tidak valid" });
    }
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** 🔹 Hapus stok supplier */
export const deleteStokSupplier = async (req, res) => {
  try {
    const deleted = await StokSupplierModel.deleteStokSupplier(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ status: "error", message: "Data stok supplier tidak ditemukan" });

    res.status(200).json({
      status: "success",
      message: "Data stok supplier berhasil dihapus",
    });
  } catch (err) {
    console.error("Error deleteStokSupplier:", err);
     // (Jarang terjadi, tapi jaga-jaga jika tabel ini direferensi oleh tabel lain)
    if (err.code?.includes("SQLITE_CONSTRAINT") || err.code === "ER_ROW_IS_REFERENCED_2") {
       return res.status(400).json({ status: "error", message: "Data ini tidak bisa dihapus karena masih digunakan di data lain" });
    }
    res.status(500).json({ status: "error", message: err.message });
  }
};