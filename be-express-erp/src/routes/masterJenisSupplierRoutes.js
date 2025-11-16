import express from "express";
import * as MasterJenisSupplierController from "../controllers/masterJenisSupplierController.js";

const router = express.Router();

// 🔹 Ambil semua data jenis supplier
router.get("/", MasterJenisSupplierController.getAllJenisSupplier);

// 🔹 Ambil data jenis supplier berdasarkan ID
router.get("/:id", MasterJenisSupplierController.getJenisSupplierById);

// 🔹 Tambah data jenis supplier baru
router.post("/", MasterJenisSupplierController.createJenisSupplier);

// 🔹 Update data jenis supplier berdasarkan ID
router.put("/:id", MasterJenisSupplierController.updateJenisSupplier);

// 🔹 Hapus data jenis supplier berdasarkan ID
router.delete("/:id", MasterJenisSupplierController.deleteJenisSupplier);

export default router;
