import express from "express";
import * as MasterSatuanBarangController from "../controllers/masterSatuanBarangController.js";

const router = express.Router();

router.get("/", MasterSatuanBarangController.getAllSatuanBarang);

router.get("/:id", MasterSatuanBarangController.getSatuanBarangById);

router.post("/", MasterSatuanBarangController.createSatuanBarang);

router.put("/:id", MasterSatuanBarangController.updateSatuanBarang);

router.delete("/:id", MasterSatuanBarangController.deleteSatuanBarang);

export default router;
