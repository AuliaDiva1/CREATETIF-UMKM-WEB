import { db } from "../core/config/knex.js";

const table = "master_rak";

export const getAllRak = async () => {
  return db(table).select("*").orderBy("kode", "asc");
};

export const getRakById = async (id) => {
  return db(table).where({ id_rak: id }).first();
};

// helper: cari by kode (untuk validasi unik)
export const getRakByKode = async (kode) => {
  return db(table).where({ kode }).first();
};

// helper: optional—cari by nama rak (kalau kamu set unik di DB)
export const getRakByNama = async (nama_rak) => {
  return db(table).where({ nama_rak }).first();
};

export const createRak = async (data) => {
  const dupKode = await getRakByKode(data.kode);
  if (dupKode) {
    const err = new Error("KODE_DUPLICATE");
    err.code = "KODE_DUPLICATE";
    throw err;
  }

  let insertedId;

  // Postgres mendukung returning; MySQL/SQLite tidak. Kita buat kompatibel:
  try {
    const rows = await db(table).insert(data).returning("id_rak"); // PG
    insertedId = Array.isArray(rows) ? rows[0]?.id_rak ?? rows[0] : rows;
  } catch {
    const rows = await db(table).insert(data); // MySQL/SQLite
    insertedId = Array.isArray(rows) ? rows[0] : rows;
  }

  return getRakById(insertedId);
};

export const updateRak = async (id, data) => {
  const existing = await getRakById(id);
  if (!existing) return null;

  if (data.kode && data.kode !== existing.kode) {
    const dupKode = await getRakByKode(data.kode);
    if (dupKode && dupKode.id_rak !== id) {
      const err = new Error("KODE_DUPLICATE");
      err.code = "KODE_DUPLICATE";
      throw err;
    }
  }

  await db(table).where({ id_rak: id }).update({
    ...data,
    updated_at: db.fn.now(),
  });

  return getRakById(id);
};

export const deleteRak = async (id) => {
  const existing = await getRakById(id);
  if (!existing) return null;

  await db(table).where({ id_rak: id }).del();
  return existing;
};
