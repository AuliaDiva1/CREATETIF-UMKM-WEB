// File: models/masterCoaModel.js

import { db } from "../core/config/knex.js";

const table = "master_coa";

/**
 * Helper internal untuk query dasar
 * (Tidak perlu JOIN karena data sudah di tabel ini)
 */
const queryCoa = () => {
  return db(table).select("*");
};

// 🔹 Ambil semua data COA (diurutkan berdasarkan kode)
export const getAllCoa = async () => {
  // Diurutkan berdasarkan 'kode_rekening' agar hierarki terlihat rapi
  return queryCoa().orderBy("kode_rekening", "asc");
};

// 🔹 Ambil satu data COA berdasarkan ID
export const getCoaById = async (id) => {
  return queryCoa().where({ id }).first();
};

// 🔹 Helper: cari berdasarkan kode rekening (untuk validasi unik)
export const getCoaByKode = async (kode_rekening) => {
  return db(table).where({ kode_rekening }).first();
};

// 🔹 Tambah data COA baru
export const createCoa = async (data) => {
  // Validasi kode unik
  const dupKode = await getCoaByKode(data.kode_rekening);
  if (dupKode) {
    const err = new Error("KODE_DUPLICATE");
    err.code = "KODE_DUPLICATE";
    err.message = "Kode rekening sudah digunakan";
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

  return getCoaById(insertedId);
};

// 🔹 Update data COA
export const updateCoa = async (id, data) => {
  const existing = await getCoaById(id);
  if (!existing) return null;

  // Cek duplikasi kode jika diubah
  if (data.kode_rekening && data.kode_rekening !== existing.kode_rekening) {
    const dupKode = await getCoaByKode(data.kode_rekening);
    if (dupKode && dupKode.id !== id) {
      const err = new Error("KODE_DUPLICATE");
      err.code = "KODE_DUPLICATE";
      err.message = "Kode rekening sudah digunakan";
      throw err;
    }
  }

  await db(table).where({ id }).update({
    ...data,
    updated_at: db.fn.now(),
  });

  return getCoaById(id);
};

// 🔹 Hapus data COA
export const deleteCoa = async (id) => {
  const existing = await getCoaById(id);
  if (!existing) return null;

  await db(table).where({ id }).del();
  return existing;
};