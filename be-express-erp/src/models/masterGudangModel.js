import { db } from "../core/config/knex.js";

const table = "master_gudang";

export const getAllGudang = async () => {
  return db(table).select("*").orderBy("kode", "asc");
};

export const getGudangById = async (id) => {
  return db(table).where({ id_gudang: id }).first();
};

// helper: cari by kode (untuk validasi unik)
export const getGudangByKode = async (kode) => {
  return db(table).where({ kode }).first();
};

// helper: optional—cari by nama gudang (kalau kamu set unik di DB)
export const getGudangByNama = async (nama_gudang) => {
  return db(table).where({ nama_gudang }).first();
};

export const createGudang = async (data) => {
  const dupKode = await getGudangByKode(data.kode);
  if (dupKode) {
    const err = new Error("KODE_DUPLICATE");
    err.code = "KODE_DUPLICATE";
    throw err;
  }

  let insertedId;

  // Postgres mendukung returning; MySQL/SQLite tidak. Kita buat kompatibel:
  try {
    const rows = await db(table).insert(data).returning("id_gudang"); // PG
    insertedId = Array.isArray(rows) ? rows[0]?.id_gudang ?? rows[0] : rows;
  } catch {
    const rows = await db(table).insert(data); // MySQL/SQLite
    insertedId = Array.isArray(rows) ? rows[0] : rows;
  }

  return getGudangById(insertedId);
};

export const updateGudang = async (id, data) => {
  const existing = await getGudangById(id);
  if (!existing) return null;

  if (data.kode && data.kode !== existing.kode) {
    const dupKode = await getGudangByKode(data.kode);
    if (dupKode && dupKode.id_gudang !== id) {
      const err = new Error("KODE_DUPLICATE");
      err.code = "KODE_DUPLICATE";
      throw err;
    }
  }

  await db(table).where({ id_gudang: id }).update({
    ...data,
    updated_at: db.fn.now(),
  });

  return getGudangById(id);
};

export const deleteGudang = async (id) => {
  const existing = await getGudangById(id);
  if (!existing) return null;

  await db(table).where({ id_gudang: id }).del();
  return existing;
};
