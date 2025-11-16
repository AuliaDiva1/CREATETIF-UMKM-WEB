import express from "express";
import * as MasterGudangController from "../controllers/masterGudangController.js";

const router = express.Router();

router.get("/", MasterGudangController.getAllGudang);

router.get("/:id", MasterGudangController.getGudangById);

router.post("/", MasterGudangController.createGudang);

router.put("/:id", MasterGudangController.updateGudang);

router.delete("/:id", MasterGudangController.deleteGudang);

export default router;
