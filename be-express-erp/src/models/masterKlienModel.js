import { db } from "../core/config/knex.js";

/**
 * 🔹 Ambil semua klien beserta data user-nya
 */
export const getAllKlienWithUser = async () => {
  return db("master_klien as k")
    .leftJoin("users as u", "k.EMAIL", "u.email")
    .select(
      "k.KLIEN_ID",
      "k.EMAIL",
      "k.NAMA",
      "k.NO_TELP",
      "k.ALAMAT",
      "k.created_at",
      "k.updated_at",
      "u.name as user_name",
      "u.role as user_role"
    );
};

/**
 * 🔹 Ambil klien berdasarkan ID
 */
export const getKlienByIdWithUser = async (id) => {
  return db("master_klien as k")
    .leftJoin("users as u", "k.EMAIL", "u.email")
    .select(
      "k.KLIEN_ID",
      "k.EMAIL",
      "k.NAMA",
      "k.NO_TELP",
      "k.ALAMAT",
      "k.created_at",
      "k.updated_at",
      "u.name as user_name",
      "u.role as user_role"
    )
    .where("k.KLIEN_ID", id)
    .first();
};

/**
 * 🔹 Helper: Insert Klien (untuk penggunaan internal/transaksi)
 */
export const addKlien = async (data, trx = null) => {
  const query = trx ? trx("master_klien") : db("master_klien");

  const [id] = await query.insert({
    EMAIL: data.EMAIL,
    NAMA: data.NAMA,
    NO_TELP: data.NO_TELP,
    ALAMAT: data.ALAMAT,
  });

  return getKlienByIdWithUser(id);
};

/**
 * 🔹 Tambah klien baru (Main function)
 */
export const createKlien = async (data) => {
  const {
    email,
    nama,
    no_telp,
    alamat,
  } = data;

  // Insert klien
  const [klienId] = await db("master_klien").insert({
    EMAIL: email,
    NAMA: nama,
    NO_TELP: no_telp,
    ALAMAT: alamat || null,
    created_at: new Date(),
  });

  return getKlienByIdWithUser(klienId);
};

/**
 * 🔹 Update klien
 */
export const updateKlien = async (id, data) => {
  // Ambil data klien lama
  const existingKlien = await db("master_klien").where("KLIEN_ID", id).first();

  if (!existingKlien) {
    throw new Error("Klien tidak ditemukan");
  }

  const {
    email,
    nama,
    no_telp,
    alamat,
  } = data;

  // Siapkan data untuk update
  const updateData = {
    EMAIL: email || existingKlien.EMAIL,
    NAMA: nama || existingKlien.NAMA,
    NO_TELP: no_telp !== undefined ? no_telp : existingKlien.NO_TELP,
    ALAMAT: alamat !== undefined ? alamat : existingKlien.ALAMAT,
    updated_at: new Date(),
  };

  // Update klien
  await db("master_klien").where("KLIEN_ID", id).update(updateData);

  // Update user jika email berubah (Sinkronisasi ke tabel users)
  if (email && email !== existingKlien.EMAIL) {
    await db("users")
      .where("email", existingKlien.EMAIL)
      .update({
        email: email,
        name: nama || existingKlien.NAMA, // Update nama juga jika tersedia
        updated_at: new Date(),
      });
  } else if (nama && existingKlien.EMAIL) {
    // Update nama saja di tabel users jika email tidak berubah
    await db("users")
      .where("email", existingKlien.EMAIL)
      .update({
        name: nama,
        updated_at: new Date(),
      });
  }

  return getKlienByIdWithUser(id);
};

/**
 * 🔹 Hapus klien dan user terkait
 */
export const deleteKlien = async (id) => {
  const klien = await db("master_klien").where("KLIEN_ID", id).first();

  if (!klien) {
    throw new Error("Klien tidak ditemukan");
  }

  // Hapus klien
  await db("master_klien").where("KLIEN_ID", id).del();

  // Hapus user terkait di tabel users
  if (klien.EMAIL) {
    await db("users").where("email", klien.EMAIL).del();
  }

  return klien;
};