// File: routes/authRoutes.js

import { Router } from "express";
import * as AuthController from "../controllers/authController.js"; // pastikan path benar
import { verifyToken } from "../middleware/jwt.js"; // middleware JWT untuk proteksi route

const router = Router();

// REGISTER PENGGUNA BARU
router.post("/register", AuthController.register);

// LOGIN
router.post("/login", AuthController.login);

// LOGOUT
router.post("/logout", verifyToken, AuthController.logout);

export default router;