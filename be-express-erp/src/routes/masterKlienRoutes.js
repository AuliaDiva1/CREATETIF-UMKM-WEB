import { Router } from "express";
import * as KlienController from "../controllers/masterKlienController.js";

const router = Router();

// GET all klien
router.get("/", KlienController.getAllKlien);

// GET klien by ID
router.get("/:id", KlienController.getKlienById);

// POST new klien (Register user + create profil)
// Tidak perlu upload middleware karena tabel klien tidak ada foto
router.post("/", KlienController.addKlien);

// PUT update klien
router.put("/:id", KlienController.updateKlien);

// DELETE klien
router.delete("/:id", KlienController.deleteKlien);

export default router;