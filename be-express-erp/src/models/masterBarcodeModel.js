// File: models/masterBarcodeModel.js

import { db } from "../core/config/knex.js";

const table = "master_barcode";

// 🔹 Ambil semua data barcode
export const getAllBarcode = async () => {
  return db(table).select("*").orderBy("kode_barcode", "asc");
};

// 🔹 Ambil satu data barcode berdasarkan ID
export const getBarcodeById = async (id) => {
  return db(table).where({ id }).first();
};

// 🔹 Helper: cari berdasarkan kode_barcode (untuk validasi unik)
export const getBarcodeByKode = async (kode_barcode) => {
  return db(table).where({ kode_barcode }).first();
};

// 🔹 Tambah data barcode baru
export const createBarcode = async (data) => {
  // Validasi kode unik
  const dupKode = await getBarcodeByKode(data.kode_barcode);
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

  return getBarcodeById(insertedId);
};

// 🔹 Update data barcode
export const updateBarcode = async (id, data) => {
  const existing = await getBarcodeById(id);
  if (!existing) return null;

  // Cek duplikasi kode_barcode jika diubah
  if (data.kode_barcode && data.kode_barcode !== existing.kode_barcode) {
    const dupKode = await getBarcodeByKode(data.kode_barcode);
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

  return getBarcodeById(id);
};

// 🔹 Hapus data barcode
export const deleteBarcode = async (id) => {
  const existing = await getBarcodeById(id);
  if (!existing) return null;

  await db(table).where({ id }).del();
  return existing;
};
