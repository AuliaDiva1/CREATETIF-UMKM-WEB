import { db } from '../core/config/knex.js'; // Sesuaikan path ke konfigurasi Knex Anda

/**
 * MENCARI ID Klien berdasarkan USER_NAME (Nama Lengkap)
 * @param {string} username - USER_NAME (NAMA) Klien yang datanya akan diambil.
 * @returns {Promise<number|null>} ID Klien jika ditemukan, atau null.
 */
export const getKlienIdByUsername = async (username) => {
    try {
        const result = await db('master_klien')
            .select('KLIEN_ID')
            // ASUMSI: Kolom USER_NAME di database adalah 'NAMA' di tabel master_klien
            .where('NAMA', username) 
            .first();

        return result ? result.KLIEN_ID : null;
    } catch (error) {
        console.error('Error in getKlienIdByUsername:', error);
        throw new Error('Gagal mencari ID klien berdasarkan username.');
    }
};

/**
 * Mengambil semua data yang diperlukan untuk dashboard Klien tertentu.
 * @param {number} klienId - ID Klien yang datanya akan diambil.
 * @returns {Promise<object>} Objek berisi ringkasan data dashboard.
 */
export const getKlienDashboardData = async (klienId) => {
    try {
        // ... (KODE MODEL ASLI TETAP SAMA) ...
        // 1. Ambil Ringkasan Data Proyek Klien
        const ringkasanResult = await db('transaksi_projek')
            .select(
                db.raw('COUNT(PROJEK_ID) as totalProjek'),
                db.raw('SUM(NILAI_PROJEK) as totalNilaiProjek'),
                db.raw("SUM(CASE WHEN STATUS = 'Completed' THEN 1 ELSE 0 END) as proyekSelesai"),
                db.raw("SUM(CASE WHEN STATUS = 'In Progress' THEN 1 ELSE 0 END) as proyekInProgress")
            )
            .where('KLIEN_ID', klienId)
            .first();

        // 2. Ambil Daftar Proyek yang Sedang Berjalan (In Progress)
        const proyekBerjalan = await db('transaksi_projek')
            .select(
                'PROJEK_ID as id',
                'NAMA_PROJEK as namaProjek',
                'PROGRESS as progress', 
                'NILAI_PROJEK as nilaiProjek',
                db.raw("DATE_FORMAT(TANGGAL_SELESAI, '%d %b %Y') as tanggalTargetSelesai")
            )
            .where('KLIEN_ID', klienId)
            .andWhere('STATUS', 'In Progress')
            .orderBy('TANGGAL_SELESAI', 'asc');

        // 3. Ambil Detail Klien (Opsional, tapi berguna untuk header dashboard)
        const detailKlien = await db('master_klien')
            .select('NAMA as namaKlien', 'EMAIL')
            .where('KLIEN_ID', klienId)
            .first();

        // Mengembalikan semua data yang dibutuhkan controller
        return {
            namaKlien: detailKlien ? detailKlien.namaKlien : null,
            emailKlien: detailKlien ? detailKlien.EMAIL : null,
            ringkasan: {
                totalProjek: parseInt(ringkasanResult.totalProjek || 0, 10),
                // Pastikan format nilai proyek tetap berupa angka di model
                totalNilaiProjek: parseFloat(ringkasanResult.totalNilaiProjek || 0), 
                proyekSelesai: parseInt(ringkasanResult.proyekSelesai || 0, 10),
                proyekInProgress: parseInt(ringkasanResult.proyekInProgress || 0, 10),
            },
            proyekBerjalan: proyekBerjalan,
        };

    } catch (error) {
        console.error('Error in DashboardKlienModel:', error);
        throw new Error('Gagal mengambil data dasbor klien dari database.');
    }
};