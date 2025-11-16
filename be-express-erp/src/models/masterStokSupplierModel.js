// File: models/masterStokSupplierModel.js

import { db } from "../core/config/knex.js";

const table = "master_stok_supplier";
const tableSupplier = "transaksi_supplier";
const tableBarcode = "master_barcode";

/**
 * Helper internal untuk query dasar
 * Ini menyertakan JOIN ke tabel supplier dan tabel barcode (barang)
 */
const queryStokSupplier = () => {
  return db(table)
    .join(tableSupplier, `${table}.kode_supplier`, "=", `${tableSupplier}.kode_supplier`)
    .join(tableBarcode, `${table}.kode_barcode`, "=", `${tableBarcode}.kode_barcode`)
    .select(
      `${table}.*`, // Ambil semua kolom dari 'master_stok_supplier'
      `${tableSupplier}.nama_supplier`, // Ambil nama supplier
      `${tableBarcode}.nama as nama_barang`, // Ambil nama barang
      `${tableBarcode}.barcode` // Ambil nomor barcode
    );
};

// 🔹 Ambil semua data stok supplier (sudah di-JOIN)
export const getAllStokSupplier = async () => {
  // Urutkan berdasarkan nama supplier, lalu nama barang
  return queryStokSupplier().orderBy([
    { column: `${tableSupplier}.nama_supplier`, order: "asc" },
    { column: `${tableBarcode}.nama`, order: "asc" },
  ]);
};

// 🔹 Ambil satu data stok supplier berdasarkan ID (sudah di-JOIN)
export const getStokSupplierById = async (id) => {
  return queryStokSupplier().where(`${table}.id`, id).first();
};

// 🔹 Helper: cari berdasarkan 'kode_supplier' dan 'kode_barcode' (untuk validasi unik)
// (Fungsi ini tidak perlu JOIN karena hanya untuk cek internal)
export const getStokByKeys = async (kode_supplier, kode_barcode) => {
  return db(table).where({ kode_supplier, kode_barcode }).first();
};

// 🔹 Tambah data stok supplier baru
export const createStokSupplier = async (data) => {
  // Validasi composite key unik
  const dup = await getStokByKeys(data.kode_supplier, data.kode_barcode);
  if (dup) {
    const err = new Error("STOK_DUPLICATE");
    err.message = "Kombinasi Supplier dan Barcode ini sudah terdaftar.";
    err.code = "STOK_DUPLICATE";
    throw err;
  }

  // TODO: Validasi 'kode_supplier' dan 'kode_barcode' ada di tabel masternya

  let insertedId;

  try {
    // PostgreSQL: gunakan returning
    const rows = await db(table).insert(data).returning("id");
    insertedId = Array.isArray(rows) ? rows[0]?.id ?? rows[0] : rows;
  } catch {
    // MySQL / SQLite: tanpa returning
    const rows = await db(table).insert(data);
    insertedId = Array.isArray(rows) ? rows[0] : rows;
  }

  // Kembalikan data lengkap yang baru dibuat (sudah di-JOIN)
  return getStokSupplierById(insertedId);
};

// 🔹 Update data stok supplier
export const updateStokSupplier = async (id, data) => {
  // Ambil data (tanpa JOIN) untuk cek
  const existing = await db(table).where({ id }).first();
  if (!existing) return null;

  // Cek duplikasi jika Kunci JOIN diubah
  const newKodeSupplier = data.kode_supplier || existing.kode_supplier;
  const newKodeBarcode = data.kode_barcode || existing.kode_barcode;

  if (
    newKodeSupplier !== existing.kode_supplier ||
    newKodeBarcode !== existing.kode_barcode
  ) {
    const dup = await getStokByKeys(newKodeSupplier, newKodeBarcode);
    if (dup && dup.id !== id) {
      const err = new Error("STOK_DUPLICATE");
      err.message = "Kombinasi Supplier dan Barcode ini sudah terdaftar.";
      err.code = "STOK_DUPLICATE";
      throw err;
    }
  }

  await db(table).where({ id }).update({
    ...data,
    updated_at: db.fn.now(),
  });

  // Kembalikan data lengkap yang sudah di-update (sudah di-JOIN)
  return getStokSupplierById(id);
};

// 🔹 Hapus data stok supplier
export const deleteStokSupplier = async (id) => {
  // Ambil data yang akan dihapus (sudah di-JOIN) untuk dikembalikan
  const existing = await getStokSupplierById(id);
  if (!existing) return null;

  await db(table).where({ id }).del();
  return existing; // Mengembalikan data yang baru saja dihapus
};