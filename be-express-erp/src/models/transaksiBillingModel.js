import { db } from "../core/config/knex.js";

// === Definisi Nama Tabel ===
const table = "transaksi_billing"; // Nama tabel yang sudah disepakati
const tblProjek = "transaksi_projek";

/**
 * 🔹 Helper internal untuk query dasar
 * Fungsi ini melakukan JOIN antara tabel transaksi_billing dan transaksi_projek.
 * Setiap kali kita mengambil data billing, kita juga akan dapat nama proyeknya.
 */
const queryBilling = () => {
  return db(`${table} as tb`) // 'tb' sebagai alias untuk transaksi_billing
    .leftJoin(
      `${tblProjek} as tp`, // Alias untuk transaksi_projek
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

// --- FUNGSI READ (Membaca Data Billing) ---

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
 * Digunakan untuk melihat riwayat lengkap Tagihan dan Pembayaran untuk satu proyek.
 */
export const getBillingByProjekId = async (projekId) => {
  return queryBilling()
    .where("tb.PROJEK_ID", projekId)
    .orderBy("tb.created_at", "asc"); // Diurutkan berdasarkan waktu pembuatan (kronologis)
};

/**
 * 🔹 Ambil data billing KHUSUS untuk Dashboard Klien
 * Fungsi ini akan digunakan untuk mengisi halaman Billing & Invoices di sisi klien.
 */
export const getBillingByKlienId = async (klienId) => {
    // Menggunakan JOIN untuk menghubungkan transaksi_billing -> transaksi_projek -> klien
    return db(`${table} as tb`)
        .join(
            `${tblProjek} as tp`,
            `tb.PROJEK_ID`,
            `=`,
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
            "tp.NAMA_PROJEK as nama_projek" // Tambahkan nama proyek untuk konteks
        )
        .orderBy("tb.created_at", "desc");
};

// --- FUNGSI WRITE (Membuat/Memperbarui Data Billing) ---

/**
 * 🔹 Tambah Transaksi Billing/Invoice Baru
 * Digunakan untuk membuat record INVOICE (Tagihan Baru) atau PAYMENT (Pembayaran Masuk).
 */
export const createBillingTransaction = async (data) => {
  // 1. Validasi TIPE_TRANSAKSI
  if (!['INVOICE', 'PAYMENT'].includes(data.TIPE_TRANSAKSI)) {
    throw new Error("TIPE_TRANSAKSI harus 'INVOICE' atau 'PAYMENT'");
  }

  // 2. Masukkan data baru
  const [billingId] = await db(table).insert({
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
  const existingBilling = await db(table).where("BILLING_ID", billingId).first();

  if (!existingBilling) {
    throw new Error("Record Billing tidak ditemukan");
  }

  // 2. Siapkan data update
  const updateData = {
    ...data,
    updated_at: new Date(),
  };

  // 3. Lakukan update
  await db(table).where("BILLING_ID", billingId).update(updateData);

  // 4. Kembalikan data terbaru
  return getBillingById(billingId);
};

/**
 * 🔹 Hapus Transaksi Billing (Hati-hati!)
 */
export const deleteBillingTransaction = async (billingId) => {
  const billing = await db(table).where("BILLING_ID", billingId).first();

  if (!billing) {
    throw new Error("Record Billing tidak ditemukan");
  }

  await db(table).where("BILLING_ID", billingId).del();

  return billing;
};