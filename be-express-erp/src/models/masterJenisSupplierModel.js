// File: models/masterJenisSupplierModel.js

import { db } from "../core/config/knex.js";

const table = "master_jenis_supplier";

// 🔹 Ambil semua data jenis supplier
export const getAllJenisSupplier = async () => {
  return db(table).select("*").orderBy("kode", "asc");
};

// 🔹 Ambil satu data jenis supplier berdasarkan ID
export const getJenisSupplierById = async (id) => {
  return db(table).where({ id }).first();
};

// 🔹 Helper: cari berdasarkan kode (untuk validasi unik)
export const getJenisSupplierByKode = async (kode) => {
  return db(table).where({ kode }).first();
};

// 🔹 Tambah data jenis supplier baru
export const createJenisSupplier = async (data) => {
  // Validasi kode unik
  const dupKode = await getJenisSupplierByKode(data.kode);
  if (dupKode) {
    const err = new Error("KODE_DUPLICATE");
    err.code = "KODE_DUPLICATE";
    throw err;
  }

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

  return getJenisSupplierById(insertedId);
};

// 🔹 Update data jenis supplier
export const updateJenisSupplier = async (id, data) => {
  const existing = await getJenisSupplierById(id);
  if (!existing) return null;

  // Cek duplikasi kode jika diubah
  if (data.kode && data.kode !== existing.kode) {
    const dupKode = await getJenisSupplierByKode(data.kode);
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

  return getJenisSupplierById(id);
};

// 🔹 Hapus data jenis supplier
export const deleteJenisSupplier = async (id) => {
  const existing = await getJenisSupplierById(id);
  if (!existing) return null;

  await db(table).where({ id }).del();
  return existing;
};
