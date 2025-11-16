// File: models/masterBankModel.js

import { db } from "../core/config/knex.js";

const table = "master_bank";

// 🔹 Ambil semua data bank
export const getAllBank = async () => {
  return db(table).select("*").orderBy("kode", "asc");
};

// 🔹 Ambil satu data bank berdasarkan ID
export const getBankById = async (id) => {
  return db(table).where({ id }).first();
};

// 🔹 Helper: cari berdasarkan kode (untuk validasi unik)
export const getBankByKode = async (kode) => {
  return db(table).where({ kode }).first();
};

// 🔹 Tambah data bank baru
export const createBank = async (data) => {
  // Validasi kode unik
  const dupKode = await getBankByKode(data.kode);
  if (dupKode) {
    const err = new Error("KODE_DUPLICATE");
    err.code = "KODE_DUPLICATE";
    throw err;
  }

  let insertedId;

  try {
    // Postgres: gunakan returning
    const rows = await db(table).insert(data).returning("id");
    insertedId = Array.isArray(rows) ? rows[0]?.id ?? rows[0] : rows;
  } catch {
    // MySQL / SQLite: tanpa returning
    const rows = await db(table).insert(data);
    insertedId = Array.isArray(rows) ? rows[0] : rows;
  }

  return getBankById(insertedId);
};

// 🔹 Update data bank
export const updateBank = async (id, data) => {
  const existing = await getBankById(id);
  if (!existing) return null;

  // Cek duplikasi kode jika diubah
  if (data.kode && data.kode !== existing.kode) {
    const dupKode = await getBankByKode(data.kode);
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

  return getBankById(id);
};

// 🔹 Hapus data bank
export const deleteBank = async (id) => {
  const existing = await getBankById(id);
  if (!existing) return null;

  await db(table).where({ id }).del();
  return existing;
};
