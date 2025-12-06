import * as TransaksiBillingModel from "../models/transaksiBillingModel.js";

// --- FUNGSI READ (Membaca Data Billing) ---

/** * Ambil semua data billing/transaksi (Admin View) 
 * Mengambil semua record INVOICE dan PAYMENT dari semua proyek
 */
export const getAllBilling = async (req, res) => {
  try {
    const data = await TransaksiBillingModel.getAllBillingTransactions();
    res.status(200).json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server: " + err.message });
  }
};

/** * Ambil billing/transaksi by ID (Detail View) 
 * Mengambil satu record billing/payment berdasarkan BILLING_ID
 */
export const getBillingById = async (req, res) => {
  try {
    const data = await TransaksiBillingModel.getBillingById(req.params.id);
    
    if (!data) {
      return res.status(404).json({ status: "error", message: "Record Billing tidak ditemukan" });
    }
    
    res.status(200).json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server: " + err.message });
  }
};

/** * Ambil semua riwayat billing/transaksi milik PROJEK tertentu
 * Endpoint contoh: /api/billing/projek/:projekId
 */
export const getBillingByProjek = async (req, res) => {
  try {
    const { projekId } = req.params;
    
    const data = await TransaksiBillingModel.getBillingByProjekId(projekId);
    
    res.status(200).json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server: " + err.message });
  }
};

/** * 🔹 KHUSUS DASHBOARD CLIENT 🔹
 * Ambil semua riwayat billing/transaksi milik KLIEN tertentu
 * Endpoint contoh: /api/billing/klien/:klienId
 * Ini adalah endpoint yang akan digunakan oleh komponen React Anda.
 */
export const getBillingByKlien = async (req, res) => {
  try {
    const { klienId } = req.params;
    
    const data = await TransaksiBillingModel.getBillingByKlienId(klienId);
    
    res.status(200).json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server: " + err.message });
  }
};

// --- FUNGSI WRITE (Membuat/Memperbarui Data Billing) ---

/** * Tambah Transaksi Billing/Invoice Baru 
 * Digunakan untuk Menerbitkan INVOICE atau Mencatat PAYMENT masuk.
 */
export const createBilling = async (req, res) => {
  try {
    const data = req.body;

    // Validasi data wajib: PROJEK_ID dan TIPE_TRANSAKSI
    if (!data.PROJEK_ID || !data.TIPE_TRANSAKSI) {
      return res.status(400).json({ status: "error", message: "PROJEK_ID dan TIPE_TRANSAKSI wajib diisi." });
    }

    const newBilling = await TransaksiBillingModel.createBillingTransaction(data);

    res.status(201).json({ status: "success", data: newBilling });
  } catch (err) {
    // Menangkap error dari model (misal: TIPE_TRANSAKSI invalid)
    if (err.message.includes("TIPE_TRANSAKSI")) {
        return res.status(400).json({ status: "error", message: err.message });
    }
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server: " + err.message });
  }
};

/** * Update Transaksi Billing/Invoice (Misal, mengubah status dari Unpaid ke Paid) 
 */
export const updateBilling = async (req, res) => {
  try {
    const { id } = req.params; // ID Billing (BILLING_ID)
    const updateData = req.body; 

    // Validasi sederhana
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ status: "error", message: "Tidak ada data yang dikirim untuk update" });
    }

    const updatedBilling = await TransaksiBillingModel.updateBillingTransaction(id, updateData);

    res.status(200).json({ status: "success", data: updatedBilling });
  } catch (err) {
    // Handle jika ID tidak ditemukan
    if (err.message === "Record Billing tidak ditemukan") {
        return res.status(404).json({ status: "error", message: err.message });
    }
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server: " + err.message });
  }
};

/** * Hapus Transaksi Billing/Invoice 
 */
export const deleteBilling = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await TransaksiBillingModel.deleteBillingTransaction(id);
    
    res.status(200).json({ status: "success", message: "Record Billing berhasil dihapus" });
  } catch (err) {
    if (err.message === "Record Billing tidak ditemukan") {
      return res.status(404).json({ status: "error", message: err.message });
    }
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server: " + err.message });
  }
};