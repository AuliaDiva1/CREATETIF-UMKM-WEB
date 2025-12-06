// File: src/models/DashboardKlienModel.js

import { db } from '../core/config/knex.js'; // Pastikan path Knex.js Anda benar

const PROJEK_TABLE = 'transaksi_projek';
const KLIEN_TABLE = 'master_klien';
const BILLING_TABLE = 'transaksi_billing';

// --- FUNGSI INTERNAL (Mencari ID dari Username) ---

export const getKlienIdByUsername = async (username) => {
    try {
        const result = await db(KLIEN_TABLE)
            .select('KLIEN_ID')
            .where('NAMA', username) // Asumsi kolom username adalah NAMA
            .first();

        return result ? result.KLIEN_ID : null;
    } catch (error) {
        console.error('Error in getKlienIdByUsername:', error);
        throw new Error('Gagal mencari ID klien berdasarkan username.');
    }
};

// --- FUNGSI RINGKASAN UTAMA (Semua Menerima: username) ---

/**
 * Mengambil semua data RINGKASAN PROYEK.
 */
export const getKlienDashboardData = async (username) => {
    try {
        const klienId = await getKlienIdByUsername(username);
        if (!klienId) throw new Error('Klien tidak ditemukan.'); 

        // 1. Ambil Ringkasan Data Proyek Klien
        const ringkasanResult = await db(PROJEK_TABLE)
            .select(
                db.raw('COUNT(PROJEK_ID) as totalProjek'),
                db.raw('SUM(NILAI_PROJEK) as totalNilaiProjek'),
                db.raw("SUM(CASE WHEN STATUS = 'Completed' THEN 1 ELSE 0 END) as proyekSelesai"),
                db.raw("SUM(CASE WHEN STATUS = 'In Progress' THEN 1 ELSE 0 END) as proyekInProgress")
            )
            .where('KLIEN_ID', klienId)
            .first();
        
        // 2. Ambil Daftar Proyek yang Sedang Berjalan (In Progress)
        const proyekBerjalan = await db(PROJEK_TABLE)
            .select('PROJEK_ID as id', 'NAMA_PROJEK as namaProjek', 'NILAI_PROJEK as nilaiProjek', 'PROGRESS as progress', 'TANGGAL_SELESAI as tanggalTargetSelesai')
            .where('KLIEN_ID', klienId)
            .andWhere('STATUS', 'In Progress')
            .orderBy('TANGGAL_SELESAI', 'asc');
        
        // 3. Ambil Detail Klien
        const detailKlien = await db(KLIEN_TABLE)
            .select('NAMA as namaKlien', 'EMAIL as emailKlien')
            .where('KLIEN_ID', klienId)
            .first();

        return {
            namaKlien: detailKlien.namaKlien,
            emailKlien: detailKlien.emailKlien,
            ringkasan: ringkasanResult,
            proyekBerjalan: proyekBerjalan,
        };

    } catch (error) {
        console.error('Error in getKlienDashboardData:', error);
        throw new Error('Gagal mengambil data dasbor klien dari database.');
    }
};


/**
 * Mengambil total tagihan yang belum lunas (Outstanding) dan daftarnya.
 * PERBAIKAN PENTING: Melakukan JOIN dengan transaksi_projek untuk memfilter berdasarkan KLIEN_ID.
 */
export const getKlienOutstandingBillingData = async (username) => {
    try {
        const klienId = await getKlienIdByUsername(username);
        if (!klienId) throw new Error('Klien tidak ditemukan.');
        
        // 1. Ambil Total Outstanding
        const outstandingResult = await db(BILLING_TABLE)
            .join(PROJEK_TABLE, `${BILLING_TABLE}.PROJEK_ID`, '=', `${PROJEK_TABLE}.PROJEK_ID`) // JOIN
            .select(
                db.raw('SUM(JUMLAH_TAGIHAN) as totalOutstanding'),
                db.raw('COUNT(BILLING_ID) as jumlahTagihanOutstanding')
            )
            .where(`${PROJEK_TABLE}.KLIEN_ID`, klienId) // Filter di tabel PROJEK
            .andWhere(`${BILLING_TABLE}.TIPE_TRANSAKSI`, 'INVOICE')
            .andWhere(`${BILLING_TABLE}.STATUS_TAGIHAN`, '!=', 'Paid') 
            .first();

        const totalOutstanding = parseFloat(outstandingResult.totalOutstanding || 0);

        // 2. Ambil Daftar Invoice Outstanding
        const outstandingInvoices = await db(BILLING_TABLE)
            .join(PROJEK_TABLE, `${BILLING_TABLE}.PROJEK_ID`, '=', `${PROJEK_TABLE}.PROJEK_ID`)
            .select(
                'BILLING_ID as id',
                'NOMOR_INVOICE as nomorInvoice',
                'JUMLAH_TAGIHAN as jumlahTagihan',
                db.raw("DATE_FORMAT(TANGGAL_JATUH_TEMPO, '%d %b %Y') as tanggalJatuhTempo"),
                `${PROJEK_TABLE}.NAMA_PROJEK as namaProjek`
            )
            .where(`${PROJEK_TABLE}.KLIEN_ID`, klienId)
            .andWhere(`${BILLING_TABLE}.TIPE_TRANSAKSI`, 'INVOICE')
            .andWhere(`${BILLING_TABLE}.STATUS_TAGIHAN`, '!=', 'Paid')
            .orderBy('TANGGAL_JATUH_TEMPO', 'asc');

        return {
            totalOutstanding: totalOutstanding,
            jumlahTagihanOutstanding: parseInt(outstandingResult.jumlahTagihanOutstanding || 0, 10),
            outstandingInvoices: outstandingInvoices,
        };
    } catch (error) {
        console.error('Error in getKlienOutstandingBillingData:', error);
        throw new Error('Gagal mengambil data tagihan tertunda.');
    }
};

/**
 * Mengambil total pembayaran dan menghitung saldo klien.
 * PERBAIKAN PENTING: Melakukan JOIN dengan transaksi_projek untuk memfilter berdasarkan KLIEN_ID.
 */
export const getKlienFinancialSummary = async (username) => {
    try {
        const klienId = await getKlienIdByUsername(username);
        if (!klienId) throw new Error('Klien tidak ditemukan.');
        
        // 1. Hitung Total Nilai Tagihan (INVOICE) yang Diterbitkan
        const totalTagihanResult = await db(BILLING_TABLE)
            .join(PROJEK_TABLE, `${BILLING_TABLE}.PROJEK_ID`, '=', `${PROJEK_TABLE}.PROJEK_ID`) 
            .sum(`${BILLING_TABLE}.JUMLAH_TAGIHAN as total`)
            .where(`${PROJEK_TABLE}.KLIEN_ID`, klienId) 
            .andWhere(`${BILLING_TABLE}.TIPE_TRANSAKSI`, 'INVOICE')
            .first();

        // 2. Hitung Total Pembayaran Masuk
        const totalPaymentResult = await db(BILLING_TABLE)
             .join(PROJEK_TABLE, `${BILLING_TABLE}.PROJEK_ID`, '=', `${PROJEK_TABLE}.PROJEK_ID`) 
            .sum(`${BILLING_TABLE}.JUMLAH_PEMBAYARAN as total`) 
            .where(`${PROJEK_TABLE}.KLIEN_ID`, klienId) 
            .andWhere(`${BILLING_TABLE}.JUMLAH_PEMBAYARAN`, '>', 0) 
            .first();

        const totalTagihanDiterbitkan = parseFloat(totalTagihanResult.total || 0);
        const totalPembayaranMasuk = parseFloat(totalPaymentResult.total || 0);
        const saldoKlien = totalPembayaranMasuk - totalTagihanDiterbitkan;

        return {
            totalPembayaran: totalPembayaranMasuk,
            saldoKlien: saldoKlien,
        };
    } catch (error) {
        console.error('Error in getKlienFinancialSummary:', error);
        throw new Error('Gagal mengambil ringkasan finansial.');
    }
};