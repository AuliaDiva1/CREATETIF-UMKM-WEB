import express from "express";
import * as MasterKodeBarangController from "../controllers/masterKodeBarangController.js";

const router = express.Router();

// Ambil semua kode barang
router.get("/", MasterKodeBarangController.getAllKodeBarang);

// Ambil kode barang by ID
router.get("/:id", MasterKodeBarangController.getKodeBarangById);

// Tambah kode barang
router.post("/", MasterKodeBarangController.createKodeBarang);

// Update kode barang
router.put("/:id", MasterKodeBarangController.updateKodeBarang);

// Hapus kode barang
router.delete("/:id", MasterKodeBarangController.deleteKodeBarang);

export default router;
