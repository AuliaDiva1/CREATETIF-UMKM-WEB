// File: models/masterSupplierModel.js

import { db } from "../core/config/knex.js";

const table = "transaksi_supplier";
const tableJenis = "master_jenis_supplier";

/**
 * Helper internal untuk query dasar
 * Ini menyertakan JOIN ke tabel jenis supplier
 */
const querySupplier = () => {
  return db(table)
    .join(tableJenis, `${table}.kode_jenis`, "=", `${tableJenis}.kode`)
    .select(
      `${table}.*`, // Ambil semua kolom dari tabel 'transaksi_supplier'
      `${tableJenis}.keterangan as jenis_supplier_keterangan` // Ambil keterangan jenisnya
    );
};

// 🔹 Ambil semua data supplier (sudah di-JOIN)
export const getAllSupplier = async () => {
  return querySupplier().orderBy(`${table}.kode_supplier`, "asc");
};

// 🔹 Ambil satu data supplier berdasarkan ID (sudah di-JOIN)
export const getSupplierById = async (id) => {
  return querySupplier().where(`${table}.id`, id).first();
};

// 🔹 Helper: cari berdasarkan kode supplier (untuk validasi unik)
// (Fungsi ini tidak perlu JOIN karena hanya untuk cek internal)
export const getSupplierByKode = async (kode_supplier) => {
  return db(table).where({ kode_supplier }).first();
};

// 🔹 Tambah data supplier baru
export const createSupplier = async (data) => {
  // Validasi kode unik
  const dupKode = await getSupplierByKode(data.kode_supplier);
  if (dupKode) {
    const err = new Error("KODE_DUPLICATE");
    err.code = "KODE_DUPLICATE";
    throw err;
  }

  // TODO: Tambahkan validasi untuk memastikan 'kode_jenis' ada di tabel 'master_jenis_supplier'
  // (Meskipun DB akan menolaknya, lebih baik validasi di sini)

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
  return getSupplierById(insertedId);
};

// 🔹 Update data supplier
export const updateSupplier = async (id, data) => {
  // Ambil data supplier (tanpa JOIN) untuk cek
  const existing = await db(table).where({ id }).first();
  if (!existing) return null;

  // Cek duplikasi kode jika kode_supplier diubah
  if (data.kode_supplier && data.kode_supplier !== existing.kode_supplier) {
    const dupKode = await getSupplierByKode(data.kode_supplier);
    if (dupKode && dupKode.id !== id) {
      const err = new Error("KODE_DUPLICATE");
      err.code = "KODE_DUPLICATE";
      throw err;
    }
  }

  await db(table).where({ id }).update({
    ...data,
    updated_at: db.fn.now(),
  });

  // Kembalikan data lengkap yang sudah di-update (sudah di-JOIN)
  return getSupplierById(id);
};

// 🔹 Hapus data supplier
export const deleteSupplier = async (id) => {
  // Ambil data yang akan dihapus (sudah di-JOIN) untuk dikembalikan
  const existing = await getSupplierById(id);
  if (!existing) return null;

  await db(table).where({ id }).del();
  return existing; // Mengembalikan data yang baru saja dihapus
};