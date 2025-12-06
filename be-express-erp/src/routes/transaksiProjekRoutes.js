// Contoh Route
import express from "express";
import * as controller from "../controllers/transaksiProjekController.js";

const router = express.Router();

router.get("/", controller.getAllProjek);           // Get All
router.get("/:id", controller.getProjekById);       // Get Detail
router.get("/klien/:klienId", controller.getProjekByKlien); // 👈 PENTING: Untuk Dashboard
router.post("/", controller.createProjek);          // Create
// PERUBAHAN DI SINI: Menggunakan PUT untuk pembaruan keseluruhan
router.put("/:id", controller.updateProjek);      // Update (PUT)
router.delete("/:id", controller.deleteProjek);     // Delete

export default router;