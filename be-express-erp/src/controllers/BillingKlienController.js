import { getKlienIdByUsername } from '../models/DashboardKlienModel.js'; // Untuk mengambil ID Klien
import { getKlienBillingDashboardData } from '../models/BillingKlienModel.js'; // Untuk mengambil data Billing

/**
 * Mengambil dan memproses data Billing untuk ditampilkan di Halaman Billing Klien berdasarkan USERNAME.
 * @param {object} req - Objek permintaan (Request).
 * @param {object} res - Objek respons (Response).
 */
export const getBillingDashboardKlien = async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ message: 'Username Klien tidak valid atau tidak tersedia.' });
    }

    let klienId;
    try {
        // LANGKAH 1: Cari klienId berdasarkan username
        klienId = await getKlienIdByUsername(username);

        if (!klienId) {
            return res.status(404).json({ message: 'Klien dengan username tersebut tidak ditemukan.' });
        }
    } catch (error) {
        console.error("Username Lookup Error:", error);
        return res.status(500).json({ message: 'Gagal memproses username untuk billing.' });
    }

    try {
        // LANGKAH 2: Panggil model untuk mengambil ringkasan dan daftar tagihan
        const { 
            ringkasanBilling: rawSummary, 
            tagihanOutstanding: rawOutstandingInvoices 
        } = await getKlienBillingDashboardData(klienId);

        // Helper untuk format mata uang IDR
        const formatCurrency = (value) => {
            return (value || 0).toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            });
        };

        // --- LANGKAH 3: Formatting Data Ringkasan (Summary) ---
        const summary = {
            totalTagihan: formatCurrency(rawSummary.totalTagihan),
            totalPembayaran: formatCurrency(rawSummary.totalPembayaran),
            saldoKlien: formatCurrency(rawSummary.saldoKlien), // Kelebihan atau kekurangan bayar
            totalOutstanding: formatCurrency(rawSummary.totalOutstanding),
            jumlahTagihanOutstanding: rawSummary.jumlahTagihanOutstanding,
        };

        // --- LANGKAH 4: Formatting Daftar Tagihan Outstanding ---
        const outstandingInvoices = rawOutstandingInvoices.map(invoice => ({
            id: invoice.id,
            namaProjek: invoice.namaProjek,
            nomorInvoice: invoice.nomorInvoice,
            jumlahTagihan: formatCurrency(invoice.jumlahTagihan),
            tanggalJatuhTempo: invoice.tanggalJatuhTempo // Sudah diformat di model
        }));

        // LANGKAH 5: Kirim respons final
        res.status(200).json({
            status: 'success',
            message: `Data billing dashboard untuk klien ${username} berhasil diambil.`,
            data: {
                summary,
                outstandingInvoices
            }
        });

    } catch (error) {
        console.error("Billing Klien Controller Error:", error);
        res.status(500).json({ 
            message: 'Gagal mengambil data dasbor billing klien.', 
            error: error.message 
        });
    }
};