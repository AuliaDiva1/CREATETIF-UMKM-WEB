
import * as SupplierModel from "../models/masterSupplierModel.js";
// (Kita asumsikan Anda punya model untuk cek 'kode_jenis' jika perlu)
// import * as JenisSupplierModel from "../models/masterJenisSupplierModel.js";

/** 🔹 Ambil semua supplier */
export const getAllSupplier = async (req, res) => {
  try {
    const data = await SupplierModel.getAllSupplier();
    res.status(200).json({ status: "success", data });
  } catch (err) {
    console.error("Error getAllSupplier:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** 🔹 Ambil supplier by ID */
export const getSupplierById = async (req, res) => {
  try {
    const data = await SupplierModel.getSupplierById(req.params.id);
    if (!data)
      return res
        .status(404)
        .json({ status: "error", message: "Supplier tidak ditemukan" });
    res.status(200).json({ status: "success", data });
  } catch (err) {
    console.error("Error getSupplierById:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** 🔹 Tambah supplier */
export const createSupplier = async (req, res) => {
  try {
    const {
      kode_supplier,
      nama_supplier,
      alamat,
      telepon,
      email,
      pic,
      kode_jenis,
      status, // status opsional, migration sudah handle default
    } = req.body;

    // --- Validasi wajib diisi ---
    if (!kode_supplier) {
      return res.status(400).json({
        status: "error",
        message: "Field 'kode_supplier' wajib diisi",
      });
    }
    if (!nama_supplier) {
      return res.status(400).json({
        status: "error",
        message: "Field 'nama_supplier' wajib diisi",
      });
    }
    if (!kode_jenis) {
      return res.status(400).json({
        status: "error",
        message: "Field 'kode_jenis' (jenis supplier) wajib diisi",
      });
    }

    // Cek duplikasi kode_supplier (dari model)
    // Model Anda sudah menangani ini, tapi lebih baik cegah di controller
    const existing = await SupplierModel.getSupplierByKode(kode_supplier);
    if (existing) {
      return res
        .status(400)
        .json({ status: "error", message: "Kode supplier sudah digunakan" });
    }

    // (Opsional) Cek apakah 'kode_jenis' valid
    // const jenisExists = await JenisSupplierModel.getJenisSupplierByKode(kode_jenis);
    // if (!jenisExists) {
    //   return res.status(400).json({ status: "error", message: "Kode jenis supplier tidak valid" });
    // }

    const newData = await SupplierModel.createSupplier({
      kode_supplier,
      nama_supplier,
      alamat,
      telepon,
      email,
      pic,
      kode_jenis,
      status, // Jika 'status' undefined, model/DB akan pakai default
    });

    res.status(201).json({ status: "success", data: newData });
  } catch (err) {
    console.error("Error createSupplier:", err);
    // Tangani error KODE_DUPLICATE dari model (jika ada)
    if (err.code === "KODE_DUPLICATE") {
      return res
        .status(400)
        .json({ status: "error", message: "Kode supplier sudah digunakan" });
    }
    // Tangani error foreign key (jika kode_jenis tidak ada)
    if (err.code?.includes("SQLITE_CONSTRAINT") || err.code === "ER_NO_REFERENCED_ROW_2") {
       return res.status(400).json({ status: "error", message: "Kode jenis supplier tidak ditemukan/tidak valid" });
    }
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** 🔹 Update supplier */
export const updateSupplier = async (req, res) => {
  try {
    const {
      kode_supplier,
      nama_supplier,
      alamat,
      telepon,
      email,
      pic,
      kode_jenis,
      status,
    } = req.body;
    const { id } = req.params;

    // --- Validasi wajib diisi ---
    if (!kode_supplier) {
      return res.status(400).json({
        status: "error",
        message: "Field 'kode_supplier' wajib diisi",
      });
    }
     if (!nama_supplier) {
      return res.status(400).json({
        status: "error",
        message: "Field 'nama_supplier' wajib diisi",
      });
    }
    if (!kode_jenis) {
      return res.status(400).json({
        status: "error",
        message: "Field 'kode_jenis' (jenis supplier) wajib diisi",
      });
    }

    // Cek duplikasi kode jika berubah
    const existing = await SupplierModel.getSupplierByKode(kode_supplier);
    if (existing && existing.id !== parseInt(id)) {
      return res.status(400).json({
        status: "error",
        message: "Kode supplier sudah digunakan oleh data lain",
      });
    }

    const updated = await SupplierModel.updateSupplier(id, {
      kode_supplier,
      nama_supplier,
      alamat,
      telepon,
      email,
      pic,
      kode_jenis,
      status,
    });

    if (!updated)
      return res
        .status(404)
        .json({ status: "error", message: "Supplier tidak ditemukan" });

    res.status(200).json({ status: "success", data: updated });
  } catch (err) {
    console.error("Error updateSupplier:", err);
     // Tangani error foreign key (jika kode_jenis tidak ada)
    if (err.code?.includes("SQLITE_CONSTRAINT") || err.code === "ER_NO_REFERENCED_ROW_2") {
       return res.status(400).json({ status: "error", message: "Kode jenis supplier tidak ditemukan/tidak valid" });
    }
    res.status(500).json({ status: "error", message: err.message });
  }
};

/** 🔹 Hapus supplier */
export const deleteSupplier = async (req, res) => {
  try {
    const deleted = await SupplierModel.deleteSupplier(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ status: "error", message: "Supplier tidak ditemukan" });

    res.status(200).json({
      status: "success",
      message: "Supplier berhasil dihapus",
    });
  } catch (err) {
    console.error("Error deleteSupplier:", err);
     // Tangani error foreign key (jika supplier masih dipakai di tabel lain)
    if (err.code?.includes("SQLITE_CONSTRAINT") || err.code === "ER_ROW_IS_REFERENCED_2") {
       return res.status(400).json({ status: "error", message: "Supplier tidak bisa dihapus karena masih digunakan di data lain" });
    }
    res.status(500).json({ status: "error", message: err.message });
  }
};