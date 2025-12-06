// File: src/controllers/DashboardKlienController.js

import { 
    getKlienDashboardData,
    getKlienOutstandingBillingData,
    getKlienFinancialSummary
} from '../models/DashboardKlienModel.js'; 

// Helper function untuk format Rupiah
const formatRupiah = (amount) => {
    return (amount || 0).toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    });
};

// --- CONTROLLER PROJECT DASHBOARD ---

export const getDashboardKlien = async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ status: 'error', message: 'Username klien wajib diisi.' });
    }
    
    try {
        const data = await getKlienDashboardData(username);
        
        if (!data || !data.namaKlien) {
             return res.status(404).json({ status: 'error', message: `Klien dengan username '${username}' tidak ditemukan.` });
        }

        const responseData = {
            summary: {
                nama: data.namaKlien,
                email: data.emailKlien,
                totalProjek: data.ringkasan.totalProjek,
                totalNilaiProjek: formatRupiah(data.ringkasan.totalNilaiProjek),
                proyekSelesai: data.ringkasan.proyekSelesai,
                proyekInProgress: data.ringkasan.proyekInProgress,
            },
            activeProjects: data.proyekBerjalan.map(p => ({
                id: p.id,
                nama: p.namaProjek,
                nilai: formatRupiah(p.nilaiProjek),
                progress: `${p.progress}%`,
                targetSelesai: p.tanggalTargetSelesai
            })),
        };

        res.status(200).json({ status: 'success', data: responseData });

    } catch (error) {
        const status = error.message.includes('Klien tidak ditemukan') ? 404 : 500;
        console.error("Dashboard Data Error:", error);
        res.status(status).json({ status: 'error', message: error.message });
    }
};


// --- CONTROLLER BILLING SUMMARY CARDS ---

export const getKlienBillingSummary = async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ status: 'error', message: 'Username Klien tidak valid.' });
    }
    
    try {
        // Panggil kedua model secara paralel
        const [outstanding, financial] = await Promise.all([
            getKlienOutstandingBillingData(username),
            getKlienFinancialSummary(username)
        ]);
        
        const summary = {
            totalOutstanding: formatRupiah(outstanding.totalOutstanding),
            totalPembayaran: formatRupiah(financial.totalPembayaran),
            saldoKlien: formatRupiah(financial.saldoKlien),
            jumlahTagihanOutstanding: outstanding.jumlahTagihanOutstanding,
        };

        res.status(200).json({ status: 'success', data: summary });

    } catch (error) {
        const status = error.message.includes('Klien tidak ditemukan') ? 404 : 500;
        console.error("Billing Summary Controller Error:", error);
        res.status(status).json({ status: 'error', message: error.message });
    }
};

// --- CONTROLLER DAFTAR OUTSTANDING INVOICES ---

export const getOutstandingKlienBilling = async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ status: 'error', message: 'Username klien wajib diisi.' });
    }
    
    try {
        const { totalOutstanding, jumlahTagihanOutstanding, outstandingInvoices } = await getKlienOutstandingBillingData(username);
        
        const formattedInvoices = outstandingInvoices.map(inv => ({
            id: inv.id,
            nomorInvoice: inv.nomorInvoice,
            namaProjek: inv.namaProjek,
            tanggalJatuhTempo: inv.tanggalJatuhTempo,
            jumlahTagihan: formatRupiah(inv.jumlahTagihan),
        }));
        
        res.status(200).json({ 
            status: 'success', 
            data: {
                totalOutstanding: formatRupiah(totalOutstanding),
                jumlahTagihanOutstanding: jumlahTagihanOutstanding,
                outstandingInvoices: formattedInvoices
            }
        });
    } catch (error) {
         const status = error.message.includes('Klien tidak ditemukan') ? 404 : 500;
        console.error("Outstanding Billing Data Error:", error);
        res.status(status).json({ status: 'error', message: error.message });
    }
};