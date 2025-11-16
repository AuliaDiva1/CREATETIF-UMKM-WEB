// File: routes/masterCoaRouter.js

import express from "express";
import * as MasterCoaController from "../controllers/masterCOAController.js";

const router = express.Router();

// 🔹 Ambil semua data COA
router.get("/", MasterCoaController.getAllCoa);

// 🔹 Ambil data COA berdasarkan ID
router.get("/:id", MasterCoaController.getCoaById);

// 🔹 Tambah data COA baru
router.post("/", MasterCoaController.createCoa);

// 🔹 Update data COA berdasarkan ID
router.put("/:id", MasterCoaController.updateCoa);

// 🔹 Hapus data COA berdasarkan ID
router.delete("/:id", MasterCoaController.deleteCoa);

export default router;