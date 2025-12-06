import express from 'express';
import { getDashboardKlien } from '../controllers/DashboardKlienController.js';

const router = express.Router();

/**
 * @route GET /api/dashboard/klien/username/:username
 * @desc Mengambil data ringkasan dan daftar proyek aktif untuk Klien tertentu BERDASARKAN USERNAME.
 * @access Private (Perlu Autentikasi Klien)
 */
// PERUBAHAN: Mengubah :id menjadi :username
router.get('/klien/username/:username', getDashboardKlien); 

export default router;