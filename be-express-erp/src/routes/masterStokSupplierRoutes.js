// File: routes/masterStokSupplierRouter.js

import express from "express";
import * as MasterStokSupplierController from "../controllers/masterStokSupplierController.js";

const router = express.Router();

// 🔹 Ambil semua data stok supplier
router.get("/", MasterStokSupplierController.getAllStokSupplier);

// 🔹 Ambil data stok supplier berdasarkan ID
router.get("/:id", MasterStokSupplierController.getStokSupplierById);

// 🔹 Tambah data stok supplier baru
router.post("/", MasterStokSupplierController.createStokSupplier);

// 🔹 Update data stok supplier berdasarkan ID
router.put("/:id", MasterStokSupplierController.updateStokSupplier);

// 🔹 Hapus data stok supplier berdasarkan ID
router.delete("/:id", MasterStokSupplierController.deleteStokSupplier);

export default router;