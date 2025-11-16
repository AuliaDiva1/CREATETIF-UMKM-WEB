import { db } from "../core/config/knex.js";

const table = "master_kategori_barang";

// Get all categories
export const getAllKategoriBarang = async () => {
  return db(table)
    .select("*")
    .orderBy("kategori_barang", "asc");
};

// Get category by ID
export const getKategoriBarangById = async (id) => {
  return db(table).where({ id_kategori: id }).first();
};

// Get category by kode_barang (since kode_barang is the FK)
export const getKategoriBarangByKodeBarang = async (kode_barang) => {
  return db(table).where({ kode_barang }).first();
};

// Create a new category
export const createKategoriBarang = async (data) => {
  const { kode_barang, kategori_barang, status, keterangan } = data;

  // Ensure required fields are provided
  if (!kode_barang || !kategori_barang) {
    throw new Error("Kode Barang and Kategori Barang are required");
  }

  const [id] = await db(table).insert({
    kode_barang,  // Foreign key from master_kodebarang
    kategori_barang,
    status: status || "Aktif",  // Default status is "Aktif"
    keterangan: keterangan || null  // If no keterangan provided, set to null
  });

  return getKategoriBarangById(id);  // Return the created category
};

// Update an existing category
export const updateKategoriBarang = async (id, data) => {
  const kategoriBarang = await getKategoriBarangById(id);
  if (!kategoriBarang) return null;

  const { kode_barang, kategori_barang, status, keterangan } = data;

  // Update fields only if they're provided
  await db(table).where({ id_kategori: id }).update({
    kode_barang: kode_barang || kategoriBarang.kode_barang,  // Use existing kode_barang if not provided
    kategori_barang: kategori_barang || kategoriBarang.kategori_barang,
    status: status || kategoriBarang.status,  // Keep the existing status if not provided
    keterangan: keterangan || kategoriBarang.keterangan  // Update keterangan if provided
  });

  return getKategoriBarangById(id);  // Return the updated category
};

// Delete a category
export const deleteKategoriBarang = async (id) => {
  const kategoriBarang = await getKategoriBarangById(id);
  if (!kategoriBarang) return null;

  await db(table).where({ id_kategori: id }).del();  // Delete the category by id_kategori
  return kategoriBarang;  // Return the deleted category
};
