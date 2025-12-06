// src/controllers/dashboardController.js

// Mengganti nama fungsi impor agar konsisten dengan model yang telah kita buat
import { getAdminDashboardData } from '../models/dashboardModel.js'; 

/**
 * Controller untuk mengambil data ringkasan Admin Dashboard.
 * Diasumsikan ini diakses setelah middleware otentikasi.
 */
export const getDashboardData = async (req, res) => {
    try {
        // Pengecekan otorisasi sederhana (opsional, tergantung implementasi middleware Anda)
        // if (req.user.role !== 'Admin') {
        //     return res.status(403).json({ status: "01", message: "Akses ditolak. Hanya untuk Admin." });
        // }

        // Panggil fungsi model untuk mendapatkan data yang sudah diolah
        const dashboardSummary = await getAdminDashboardData(); 

        // Mengirim respons sukses
        res.status(200).json({ 
            status: "00", 
            message: "Data dashboard berhasil diambil.", 
            data: dashboardSummary 
        });

    } catch (error) {
        // Logging error yang lebih spesifik
        console.error("Dashboard Controller Error:", error.message);
        
        // Mengirim respons error 500 (Internal Server Error)
        // Menggunakan pesan yang lebih user-friendly
        res.status(500).json({ 
            status: "01", 
            message: 'Gagal mengambil data dashboard. Silakan coba lagi.' 
        });
    }
};

/*
Contoh Penggunaan di file router Express (misalnya: src/routes/adminRoutes.js):

import { Router } from 'express';
import { getDashboardData } from '../controllers/dashboardController.js';
// import { verifyToken, isAdmin } from '../middleware/authMiddleware.js'; // Asumsi middleware

const router = Router();

// Endpoint yang dipanggil oleh frontend DashboardAdmin.jsx
router.get('/dashboard', verifyToken, isAdmin, getDashboardData); 

export default router;
*/