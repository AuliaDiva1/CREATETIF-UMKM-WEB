import express from "express";
import * as MasterRakController from "../controllers/masterRakController.js";

const router = express.Router();

router.get("/", MasterRakController.getAllRak);

router.get("/:id", MasterRakController.getRakById);

router.post("/", MasterRakController.createRak);

router.put("/:id", MasterRakController.updateRak);

router.delete("/:id", MasterRakController.deleteRak);

export default router;
