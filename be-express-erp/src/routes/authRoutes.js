// File: routes/authRoutes.js

import { Router } from "express";
import * as AuthController from "../controllers/authController.js"; 
import { verifyToken } from "../middleware/jwt.js"; // middleware JWT untuk proteksi route
// Asumsi: Jika perlu batasan role Admin untuk /register, Anda harus menambahkan middleware di sini.

const router = Router();

// ===========================================
// OTENTIKASI & REGISTRASI (Internal/Admin)
// ===========================================

// 📝 REGISTER PENGGUNA BARU (Internal/Admin Only)
router.post("/register", AuthController.register); 

// 🔑 LOGIN
router.post("/login", AuthController.login);

// 🚪 LOGOUT (Memerlukan verifikasi token)
router.post("/logout", verifyToken, AuthController.logout);

// 👤 GET PROFILE (Memerlukan verifikasi token)
router.get("/profile", verifyToken, AuthController.getProfile);

export default router;