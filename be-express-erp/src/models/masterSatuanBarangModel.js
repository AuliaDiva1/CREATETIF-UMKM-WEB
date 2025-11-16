import { db } from "../core/config/knex.js";

const table = "master_satuan_barang";

export const getAllSatuanBarang = async () => {
  return db(table).select("*").orderBy("satuan_barang", "asc");
};

export const getSatuanBarangById = async (id) => {
  return db(table).where({ id_satuan: id }).first();
};

// helper: cari by kode (untuk validasi unik)
export const getSatuanBarangByKode = async (kode) => {
  return db(table).where({ kode }).first();
};

// helper: optional—cari by nama satuan (kalau kamu set unik di DB)
export const getSatuanBarangByNama = async (satuan_barang) => {
  return db(table).where({ satuan_barang }).first();
};

export const createSatuanBarang = async (data) => {
  const dupKode = await getSatuanBarangByKode(data.kode);
  if (dupKode) {
    const err = new Error("KODE_DUPLICATE");
    err.code = "KODE_DUPLICATE";
    throw err;
  }

  let insertedId;

  // Postgres mendukung returning; MySQL/SQLite tidak. Kita buat kompatibel:
  try {
    const rows = await db(table).insert(data).returning("id_satuan"); // PG
    insertedId = Array.isArray(rows) ? rows[0]?.id_satuan ?? rows[0] : rows;
  } catch {
    const rows = await db(table).insert(data); // MySQL/SQLite
    insertedId = Array.isArray(rows) ? rows[0] : rows;
  }

  return getSatuanBarangById(insertedId);
};

export const updateSatuanBarang = async (id, data) => {
  const existing = await getSatuanBarangById(id);
  if (!existing) return null;

  if (data.kode && data.kode !== existing.kode) {
    const dupKode = await getSatuanBarangByKode(data.kode);
    if (dupKode && dupKode.id_satuan !== id) {
      const err = new Error("KODE_DUPLICATE");
      err.code = "KODE_DUPLICATE";
      throw err;
    }
  }

  await db(table).where({ id_satuan: id }).update({
    ...data,
    updated_at: db.fn.now(),
  });

  return getSatuanBarangById(id);
};

export const deleteSatuanBarang = async (id) => {
  const existing = await getSatuanBarangById(id);
  if (!existing) return null;

  await db(table).where({ id_satuan: id }).del();
  return existing;
};
