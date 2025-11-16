import express from "express";
import * as MasterBankController from "../controllers/masterBankController.js";

const router = express.Router();


router.get("/", MasterBankController.getAllBank);

// 🔹 Ambil data bank berdasarkan ID
router.get("/:id", MasterBankController.getBankById);

// 🔹 Tambah data bank baru
router.post("/", MasterBankController.createBank);

// 🔹 Update data bank berdasarkan ID
router.put("/:id", MasterBankController.updateBank);

// 🔹 Hapus data bank berdasarkan ID
router.delete("/:id", MasterBankController.deleteBank);

export default router;
