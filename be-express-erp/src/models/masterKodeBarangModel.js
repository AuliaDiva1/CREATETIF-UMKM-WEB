import { db } from "../core/config/knex.js";

const table = "master_kodebarang";

export const getAllKodeBarang = async () => {
  return db(table).select("*").orderBy("kode_barang", "asc");
};

export const getKodeBarangById = async (id) => {
  return db(table).where({ id_kode_barang: id }).first();
};

export const createKodeBarang = async (data) => {
  const [id] = await db(table).insert(data);
  return getKodeBarangById(id);
};

export const updateKodeBarang = async (id, data) => {
  const kodeBarang = await getKodeBarangById(id);
  if (!kodeBarang) return null;
  await db(table).where({ id_kode_barang: id }).update(data);
  return getKodeBarangById(id);
};

export const deleteKodeBarang = async (id) => {
  const kodeBarang = await getKodeBarangById(id);
  if (!kodeBarang) return null;
  await db(table).where({ id_kode_barang: id }).del();
  return kodeBarang;
};
