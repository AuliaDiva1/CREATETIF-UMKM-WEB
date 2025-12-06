// File: src/routes/DashboardKlienRoutes.js

import express from 'express';
import { 
    getDashboardKlien,            
    getOutstandingKlienBilling,    
    getKlienBillingSummary         
} from '../controllers/DashboardKlienController.js'; 

const router = express.Router();

// Semua rute akan diakses di bawah prefix /api/dashboard-klien/...

// 1. Dashboard Utama (Ringkasan Proyek)
// Endpoint: /api/dashboard-klien/klien/username/:username
router.get('/klien/username/:username', getDashboardKlien); 

// 2. Summary Cards (Outstanding, Pembayaran, Saldo)
// Endpoint: /api/dashboard-klien/klien/username/:username/billing-summary
router.get('/klien/username/:username/billing-summary', getKlienBillingSummary); 

// 3. Daftar Outstanding Invoices
// Endpoint: /api/dashboard-klien/klien/username/:username/outstanding
router.get('/klien/username/:username/outstanding', getOutstandingKlienBilling); 

export default router;