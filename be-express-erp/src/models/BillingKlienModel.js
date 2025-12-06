import { db } from "../core/config/knex.js";

// === Definisi Nama Tabel ===
const tableBilling = "transaksi_billing";
const tableProjek = "transaksi_projek";

/**
 * 🔹 Helper internal untuk query dasar
 * Fungsi ini melakukan JOIN antara tabel transaksi_billing dan transaksi_projek.
 * Digunakan untuk mengambil detail billing beserta nama proyek terkait.
 */
const queryBilling = () => {
  return db(`${tableBilling} as tb`) // 'tb' sebagai alias untuk transaksi_billing
    .leftJoin(
      `${tableProjek} as tp`, // Alias untuk transaksi_projek
      `tb.PROJEK_ID`,
      "=",
      `tp.PROJEK_ID`
    )
    .select(
      // 🔽 Ambil semua kolom dari tabel billing
      "tb.*",

      // 🔽 Ambil data spesifik dari tabel Projek
      "tp.NAMA_PROJEK as nama_projek",
      "tp.KLIEN_ID as klien_id_projek",
      "tp.NILAI_PROJEK as nilai_projek_total"
    );
};

// --- READ FUNCTIONS (Fungsi Baca) ---

/**
 * 🔹 Ambil SEMUA data billing/transaksi (Biasanya untuk Admin)
 */
export const getAllBillingTransactions = async () => {
  return queryBilling().orderBy("tb.created_at", "desc");
};

/**
 * 🔹 Ambil data billing/transaksi berdasarkan ID Billing
 */
export const getBillingById = async (billingId) => {
  return queryBilling().where("tb.BILLING_ID", billingId).first();
};

/**
 * 🔹 Ambil SEMUA data billing berdasarkan ID PROJEK
 */
export const getBillingByProjekId = async (projekId) => {
  return queryBilling()
    .where("tb.PROJEK_ID", projekId)
    .orderBy("tb.created_at", "asc"); // Diurutkan berdasarkan waktu pembuatan (kronologis)
};

/**
 * 🔹 Ambil data billing KHUSUS untuk Halaman Billing Klien
 */
export const getBillingByKlienId = async (klienId) => {
    return db(`${tableBilling} as tb`)
        .join(
            `${tableProjek} as tp`,
            `tb.PROJEK_ID`,
            "=",
            `tp.PROJEK_ID`
        )
        .where("tp.KLIEN_ID", klienId) // Filter berdasarkan ID Klien
        .select(
            "tb.BILLING_ID",
            "tb.PROJEK_ID",
            "tb.TIPE_TRANSAKSI",
            "tb.NOMOR_INVOICE",
            "tb.JUMLAH_TAGIHAN",
            "tb.JUMLAH_PEMBAYARAN",
            "tb.TANGGAL_JATUH_TEMPO",
            "tb.STATUS_TAGIHAN",
            "tb.METODE_PEMBAYARAN",
            "tb.created_at as tanggal_transaksi",
            "tp.NAMA_PROJEK as nama_projek"
        )
        .orderBy("tb.created_at", "desc");
};

// --- DASHBOARD FUNCTION ---

/**
 * 🔹 Ambil semua data yang diperlukan untuk ringkasan dashboard Billing Klien.
 * @param {number} klienId - ID Klien yang datanya akan diambil.
 * @returns {Promise<object>} Objek berisi ringkasan data dashboard Billing.
 */
export const getKlienBillingDashboardData = async (klienId) => {
    try {
        // 1. Ambil Ringkasan Data Billing Klien (Menggunakan JOIN)
        const ringkasanResult = await db(`${tableBilling} as tb`)
            .join(
                `${tableProjek} as tp`,
                'tb.PROJEK_ID',
                '=',
                'tp.PROJEK_ID'
            )
            .where('tp.KLIEN_ID', klienId)
            .select(
                db.raw("SUM(CASE WHEN tb.TIPE_TRANSAKSI = 'INVOICE' THEN tb.JUMLAH_TAGIHAN ELSE 0 END) as totalTagihan"),
                db.raw("SUM(CASE WHEN tb.TIPE_TRANSAKSI = 'PAYMENT' THEN tb.JUMLAH_PEMBAYARAN ELSE 0 END) as totalPembayaran"),
                db.raw("SUM(CASE WHEN tb.STATUS_TAGIHAN = 'Outstanding' AND tb.TIPE_TRANSAKSI = 'INVOICE' THEN tb.JUMLAH_TAGIHAN ELSE 0 END) as totalOutstanding")
            )
            .first();

        // 2. Ambil Daftar Tagihan yang Belum Dibayar (Outstanding Invoices)
        const tagihanOutstanding = await db(`${tableBilling} as tb`)
            .join(
                `${tableProjek} as tp`,
                'tb.PROJEK_ID',
                '=',
                'tp.PROJEK_ID'
            )
            .where('tp.KLIEN_ID', klienId)
            .andWhere('tb.STATUS_TAGIHAN', 'Outstanding')
            .andWhere('tb.TIPE_TRANSAKSI', 'INVOICE')
            .select(
                'tb.BILLING_ID as id',
                'tp.NAMA_PROJEK as namaProjek',
                'tb.NOMOR_INVOICE as nomorInvoice',
                'tb.JUMLAH_TAGIHAN as jumlahTagihan',
                db.raw("DATE_FORMAT(tb.TANGGAL_JATUH_TEMPO, '%d %b %Y') as tanggalJatuhTempo")
            )
            .orderBy('tb.TANGGAL_JATUH_TEMPO', 'asc');

        // 3. Mengembalikan hasil
        const totalTagihan = parseFloat(ringkasanResult.totalTagihan || 0);
        const totalPembayaran = parseFloat(ringkasanResult.totalPembayaran || 0);
        const totalOutstanding = parseFloat(ringkasanResult.totalOutstanding || 0);
        const saldoKlien = totalPembayaran - totalTagihan; 

        return {
            ringkasanBilling: {
                totalTagihan: totalTagihan,
                totalPembayaran: totalPembayaran,
                saldoKlien: saldoKlien,
                totalOutstanding: totalOutstanding,
                jumlahTagihanOutstanding: tagihanOutstanding.length,
            },
            tagihanOutstanding: tagihanOutstanding,
        };

    } catch (error) {
        console.error('Error in getKlienBillingDashboardData:', error);
        throw new Error('Gagal mengambil data dasbor billing klien dari database.');
    }
};

// --- WRITE FUNCTIONS (Fungsi Tulis) ---

/**
 * 🔹 Tambah Transaksi Billing/Invoice Baru
 */
export const createBillingTransaction = async (data) => {
  // 1. Validasi TIPE_TRANSAKSI
  if (!['INVOICE', 'PAYMENT'].includes(data.TIPE_TRANSAKSI)) {
    throw new Error("TIPE_TRANSAKSI harus 'INVOICE' atau 'PAYMENT'");
  }

  // 2. Masukkan data baru
  const [billingId] = await db(tableBilling).insert({
    ...data,
    created_at: new Date(),
    updated_at: new Date(),
  });

  // 3. Kembalikan data lengkap yang baru dibuat
  return getBillingById(billingId);
};


/**
 * 🔹 Update Transaksi Billing/Invoice
 */
export const updateBillingTransaction = async (billingId, data) => {
  // 1. Cek apakah record billing ada
  const existingBilling = await db(tableBilling).where("BILLING_ID", billingId).first();

  if (!existingBilling) {
    throw new Error("Record Billing tidak ditemukan");
  }

  // 2. Siapkan data update
  const updateData = {
    ...data,
    updated_at: new Date(),
  };

  // 3. Lakukan update
  await db(tableBilling).where("BILLING_ID", billingId).update(updateData);

  // 4. Kembalikan data terbaru
  return getBillingById(billingId);
};

/**
 * 🔹 Hapus Transaksi Billing (Hati-hati!)
 */
export const deleteBillingTransaction = async (billingId) => {
  const billing = await db(tableBilling).where("BILLING_ID", billingId).first();

  if (!billing) {
    throw new Error("Record Billing tidak ditemukan");
  }

  await db(tableBilling).where("BILLING_ID", billingId).del();

  return billing;
};