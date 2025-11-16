// src/routes/masterBahanBakuRouter.js

import express from "express";
const router = express.Router();
import upload from "../middleware/upload-produk.js"; // Ganti dengan nama middleware Multer Anda
import {
    getAllBahanBaku,
    getBahanBakuById,
    addBahanBaku,
    updateBahanBaku,
    deleteBahanBaku,
} from "../controllers/masterBahanBakuController.js"; // <-- Pastikan path ini benar!

// ...

// 🔹 ROUTE UNTUK UPDATE BAHAN BAKU (Perbaiki baris ini)
router.put("/:id", upload.single('path_gambar'), updateBahanBaku); // <-- Gunakan nama fungsi yang diexport

// Tambahkan/Perbaiki route lainnya:
router.get("/", getAllBahanBaku);
router.get("/:id", getBahanBakuById);
router.post("/", upload.single('path_gambar'), addBahanBaku);
// router.put("/:id", upload.single('path_gambar'), updateBahanBaku); // Sudah di atas
router.delete("/:id", deleteBahanBaku);

export default router;