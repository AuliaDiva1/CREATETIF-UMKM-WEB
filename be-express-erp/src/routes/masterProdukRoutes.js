// File: routes/masterProdukRouter.js

import { Router } from "express";
// PASTIKAN Anda membuat file ini
import upload from "../middleware/upload-produk.js"; 
import * as ProdukController from "../controllers/masterProdukController.js";

const router = Router();

// Tentukan field upload untuk 3 gambar
// (Nama 'file_gambar_1' HARUS sama dengan key di Postman/form-data)
const uploadFields = [
  { name: 'file_gambar_1', maxCount: 1 },
  { name: 'file_gambar_2', maxCount: 1 },
  { name: 'file_gambar_3', maxCount: 1 }
];

// GET all produk
router.get("/", ProdukController.getAllProduk);

// GET produk by ID
router.get("/:id", ProdukController.getProdukById);

// POST new produk (dengan upload 3 file)
router.post("/", upload.fields(uploadFields), ProdukController.addProduk);

// PUT update produk (dengan upload 3 file)
router.put("/:id", upload.fields(uploadFields), ProdukController.updateProduk);

// DELETE produk
router.delete("/:id", ProdukController.deleteProduk);

export default router;