// File: routes/masterSupplierRouter.js

import express from "express";
import * as MasterSupplierController from "../controllers/masterSupplierController.js";

const router = express.Router();

// 🔹 Ambil semua data supplier
router.get("/", MasterSupplierController.getAllSupplier);

// 🔹 Ambil data supplier berdasarkan ID
router.get("/:id", MasterSupplierController.getSupplierById);

// 🔹 Tambah data supplier baru
router.post("/", MasterSupplierController.createSupplier);

// 🔹 Update data supplier berdasarkan ID
router.put("/:id", MasterSupplierController.updateSupplier);

// 🔹 Hapus data supplier berdasarkan ID
router.delete("/:id", MasterSupplierController.deleteSupplier);

export default router;