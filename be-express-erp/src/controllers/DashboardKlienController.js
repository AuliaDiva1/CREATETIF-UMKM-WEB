import { getKlienDashboardData, getKlienIdByUsername } from '../models/DashboardKlienModel.js'; 

/**
 * Mengambil dan memproses data untuk ditampilkan di Dashboard Klien berdasarkan USERNAME.
 * @param {object} req - Objek permintaan (Request).
 * @param {object} res - Objek respons (Response).
 */
export const getDashboardKlien = async (req, res) => {
    // PERUBAHAN: Sekarang mengambil 'username' dari parameter URL
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ message: 'Username Klien tidak valid atau tidak tersedia.' });
    }

    let klienId;
    try {
        // LANGKAH BARU: Cari klienId berdasarkan username
        klienId = await getKlienIdByUsername(username);

        if (!klienId) {
            // Jika username ada di frontend tapi tidak ditemukan di database
            return res.status(404).json({ message: 'Klien dengan username tersebut tidak ditemukan.' });
        }
    } catch (error) {
        console.error("Username Lookup Error:", error);
        return res.status(500).json({ message: 'Gagal memproses username.' });
    }

    try {
        // 1. Panggil model untuk mengambil semua data (menggunakan klienId yang sudah ditemukan)
        const { 
            namaKlien, 
            emailKlien, 
            ringkasan: rawSummary, 
            proyekBerjalan: rawProjects 
        } = await getKlienDashboardData(klienId);

        // 2. Buat objek Summary (Ringkasan) untuk ditampilkan di kartu (cards)
        const summary = {
            nama: namaKlien,
            email: emailKlien,
            totalProjek: rawSummary.totalProjek,
            totalNilaiProjek: rawSummary.totalNilaiProjek.toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }), 
            proyekSelesai: rawSummary.proyekSelesai,
            proyekInProgress: rawSummary.proyekInProgress,
        };

        // 3. Format Daftar Proyek yang Sedang Berjalan
        const activeProjects = rawProjects.map(projek => ({
            id: projek.id,
            nama: projek.namaProjek,
            progress: `${projek.progress}%`, 
            nilai: projek.nilaiProjek.toLocaleString('id-ID', { 
                style: 'currency', 
                currency: 'IDR', 
                minimumFractionDigits: 0 
            }), 
            targetSelesai: projek.tanggalTargetSelesai 
        }));

        // 4. Kirim respons final
        res.status(200).json({
            status: 'success',
            message: `Data dashboard untuk klien ${username} berhasil diambil.`,
            data: {
                summary,
                activeProjects
            }
        });

    } catch (error) {
        console.error("Dashboard Klien Controller Error:", error);
        res.status(500).json({ message: 'Gagal mengambil data dasbor klien.', error: error.message });
    }
};