import express from 'express';
import { getBillingDashboardKlien } from '../controllers/BillingKlienController.js';

const router = express.Router();

/**
 * @route GET /api/billing/klien/username/:username
 * @desc Mengambil data ringkasan billing dan daftar tagihan outstanding untuk Klien tertentu BERDASARKAN USERNAME.
 * @access Private (Perlu Autentikasi Klien)
 */
router.get('/klien/username/:username', getBillingDashboardKlien); 

export default router;