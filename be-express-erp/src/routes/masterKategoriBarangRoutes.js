import express from "express";
import * as MasterKategoriBarangController from "../controllers/masterKategoriBarangController.js";

const router = express.Router();

// Ambil semua kategori barang
router.get("/", MasterKategoriBarangController.getAllKategoriBarang);

// Ambil kategori barang by ID
router.get("/:id", MasterKategoriBarangController.getKategoriBarangById);

// Tambah kategori barang
router.post("/", MasterKategoriBarangController.createKategoriBarang);

// Update kategori barang
router.put("/:id", MasterKategoriBarangController.updateKategoriBarang);

// Hapus kategori barang
router.delete("/:id", MasterKategoriBarangController.deleteKategoriBarang);

export default router;
