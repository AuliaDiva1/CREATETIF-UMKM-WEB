import express from "express";
import * as MasterBarcodeController from "../controllers/masterBarcodeController.js";

const router = express.Router();

// 🔹 Ambil semua data barcode
router.get("/", MasterBarcodeController.getAllBarcode);

// 🔹 Ambil data barcode berdasarkan ID
router.get("/:id", MasterBarcodeController.getBarcodeById);

// 🔹 Tambah data barcode baru
router.post("/", MasterBarcodeController.createBarcode);

// 🔹 Update data barcode berdasarkan ID
router.put("/:id", MasterBarcodeController.updateBarcode);

// 🔹 Hapus data barcode berdasarkan ID
router.delete("/:id", MasterBarcodeController.deleteBarcode);

export default router;
