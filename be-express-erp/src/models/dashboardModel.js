// src/models/dashboardModel.js (Model yang diimpor oleh controller)

// Asumsi path Knex instance (db)
import { db } from '../core/config/knex.js'; 

/**
 * Fungsi untuk mengambil semua data yang dibutuhkan untuk dashboard admin dari database.
 */
export const getAdminDashboardData = async () => {
    try {
        // 1. Total Pengguna (Users)
        const totalUsersResult = await db('users').count('id as count').first();
        
        // 2. Total Klien (Clients)
        const totalClientsResult = await db('master_klien').count('KLIEN_ID as count').first();

        // 3. Total Proyek (Projects)
        const totalProjekResult = await db('transaksi_projek').count('PROJEK_ID as count').first();

        // 4. Ringkasan Status Proyek (Projects by Status)
        const statusProjek = await db('transaksi_projek')
            .select('STATUS')
            .count('PROJEK_ID as total')
            .groupBy('STATUS');

        const statusSummary = statusProjek.reduce((acc, item) => {
            // Memastikan STATUS default ada meskipun tidak ada data di DB
            const statusKey = item.STATUS || 'Undefined';
            acc[statusKey] = parseInt(item.total, 10);
            return acc;
        }, {
            'In Progress': 0,
            'Completed': 0,
            'Pending Review': 0,
        });

        // 5. Ringkasan Keuangan (Financial Summary)
        const totalNilaiProjekResult = await db('transaksi_projek')
            .sum('NILAI_PROJEK as totalNilai')
            .first();

        const totalInvoiceResult = await db('transaksi_billing')
            .where('TIPE_TRANSAKSI', 'INVOICE')
            .sum('JUMLAH_TAGIHAN as totalInvoice')
            .first();

        const totalPaymentResult = await db('transaksi_billing')
            .where('TIPE_TRANSAKSI', 'PAYMENT')
            .sum('JUMLAH_PEMBAYARAN as totalPayment')
            .first();

        const totalInvoice = parseFloat(totalInvoiceResult.totalInvoice || 0);
        const totalPayment = parseFloat(totalPaymentResult.totalPayment || 0);

        // Mengembalikan semua data yang dibutuhkan controller
        return {
            totalUsers: parseInt(totalUsersResult.count, 10) || 0,
            totalClients: parseInt(totalClientsResult.count, 10) || 0,
            totalProjek: parseInt(totalProjekResult.count, 10) || 0,
            statusProjek: statusSummary,
            totalNilaiProjek: parseFloat(totalNilaiProjekResult.totalNilai || 0),
            keuangan: {
                totalInvoice: totalInvoice,
                totalPayment: totalPayment,
                piutang: totalInvoice - totalPayment
            }
        };

    } catch (error) {
        // Penting: Throw error agar ditangkap oleh blok catch di controller
        console.error('Error in getAdminDashboardData model:', error);
        throw new Error('Database query failed: Gagal mengambil data dasbor admin.');
    }
};