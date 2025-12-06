import { db } from "../core/config/knex.js";

// === Definisi Nama Tabel ===
const table = "transaksi_projek";
const tblKlien = "master_klien";

/**
 * 🔹 Helper internal untuk query dasar
 * Fungsi ini melakukan JOIN antara tabel transaksi_projek dan master_klien.
 * Setiap kali kita mengambil data projek, kita juga akan dapat data nama kliennya.
 */
const queryProjek = () => {
  return db(`${table} as tp`) // 'tp' sebagai alias untuk transaksi_projek
    .leftJoin(
      `${tblKlien} as mk`, // Alias untuk master_klien
      `tp.KLIEN_ID`,
      `=`,
      `mk.KLIEN_ID`
    )
    .select(
      // 🔽 Ambil semua kolom dari tabel proyek
      "tp.*",

      // 🔽 Ambil data spesifik dari tabel Klien (berguna untuk Admin/Display)
      "mk.NAMA as klien_nama",
      "mk.EMAIL as klien_email",
      "mk.NO_TELP as klien_no_telp"
    );
};


/**
 * 🔹 Ambil SEMUA data projek (Biasanya untuk Admin)
 */
export const getAllProjekWithJoins = async () => {
  return queryProjek().orderBy("tp.created_at", "desc");
};

/**
 * 🔹 Ambil data projek berdasarkan ID PROJEK (Untuk halaman Detail Projek)
 */
export const getProjekByIdWithJoins = async (projekId) => {
  return queryProjek().where("tp.PROJEK_ID", projekId).first();
};

/**
 * 🔹 Ambil data projek berdasarkan KLIEN_ID (KHUSUS DASHBOARD CLIENT)
 * Fungsi ini yang akan dipakai untuk mengisi halaman React Dashboard kamu.
 */
export const getProjekByKlienId = async (klienId) => {
  return queryProjek()
    .where("tp.KLIEN_ID", klienId)
    .orderBy("tp.created_at", "desc");
};



/**
 * 🔹 Tambah Projek Baru
 */
export const createProjek = async (data) => {
  // Masukkan data baru ke database
  const [projekId] = await db(table).insert({
    ...data,
    created_at: new Date(),
    updated_at: new Date(), // Pastikan updated_at juga terisi awal
  });

  // Kembalikan data lengkap yang baru dibuat (termasuk join klien)
  return getProjekByIdWithJoins(projekId);
};

/**
 * 🔹 Update Projek (Menggunakan PUT)
 * Menerima data parsial atau penuh. Menggunakan PUT di HTTP, tetapi 
 * implementasi Knex-nya tetap melakukan pembaruan berdasarkan data yang masuk.
 */
export const updateProjek = async (projekId, data) => {
  // 1. Cek apakah projek ada
  const existingProjek = await db(table).where("PROJEK_ID", projekId).first();

  if (!existingProjek) {
    throw new Error("Projek tidak ditemukan");
  }

  // 2. Siapkan data update (tambah timestamp updated_at)
  const updateData = {
    ...data,
    updated_at: new Date(),
  };

  // 3. Lakukan update
  await db(table).where("PROJEK_ID", projekId).update(updateData);

  // 4. Kembalikan data terbaru
  return getProjekByIdWithJoins(projekId);
};

/**
 * 🔹 Hapus Projek
 */
export const deleteProjek = async (projekId) => {
  const projek = await db(table).where("PROJEK_ID", projekId).first();

  if (!projek) {
    throw new Error("Projek tidak ditemukan");
  }

  await db(table).where("PROJEK_ID", projekId).del();

  return projek;
};