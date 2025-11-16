import { db } from "../core/config/knex.js";

// === Definisi Nama Tabel ===
const table = "master_produk";
const tblKategori = "master_kategori_barang";
const tblGudang = "master_gudang";
const tblRak = "master_rak";
const tblSupplier = "transaksi_supplier";
const tblSatuan = "master_satuan_barang";
const tblBarcode = "master_barcode"; // 🔽🔽 TAMBAHAN BARU 🔽🔽

/**
 * 🔹 Helper internal untuk query dasar
 * Ini menyertakan JOIN ke semua tabel master terkait
 */
const queryProduk = () => {
  return db(`${table} as p`) // 'p' sebagai alias untuk master_produk
    .leftJoin(
      `${tblKategori} as kat`, // Alias
      `p.kode_kategori`,
      "=",
      `kat.kode_barang`
    )
    .leftJoin(`${tblGudang} as gud`, `p.kode_gudang`, "=", `gud.kode`) // Alias
    .leftJoin(`${tblRak} as rak`, `p.kode_rak`, "=", `rak.kode`) // Alias
    .leftJoin(
      `${tblSupplier} as sup`, // Alias
      `p.kode_supplier`,
      "=",
      `sup.kode_supplier`
    )
    .leftJoin(`${tblSatuan} as s1`, `p.kode_satuan_1`, "=", "s1.kode") // Alias
    .leftJoin(`${tblSatuan} as s2`, `p.kode_satuan_2`, "=", "s2.kode") // Alias
    .leftJoin(`${tblSatuan} as s3`, `p.kode_satuan_3`, "=", "s3.kode") // Alias

    // 🔽🔽 JOIN BARU UNTUK BARCODE 🔽🔽
    .leftJoin(`${tblBarcode} as bar`, `p.kode_barcode`, "=", `bar.kode_barcode`)
    .select(
      // 🔽🔽 DIUBAH: Ambil semua kolom 'p' secara otomatis 🔽🔽
      // Ini sudah termasuk 'p.kode_barcode' dan semua kolom lainnya
      "p.*",

      // --- Kolom dari JOIN ---
      "kat.kategori_barang as kategori_nama",
      "gud.keterangan as gudang_nama",
      "rak.keterangan as rak_nama",
      "sup.nama_supplier as supplier_nama",
      "s1.satuan_barang as satuan_1_nama",
      "s2.satuan_barang as satuan_2_nama",
      "s3.satuan_barang as satuan_3_nama",

      // 🔽🔽 TAMBAHAN BARU DARI JOIN BARCODE 🔽🔽
      "bar.nama as barcode_nama", // Nama barang dari master barcode
      "bar.barcode as barcode_number" // Nomor barcode aktual
    );
};

/**
 * 🔹 Ambil semua produk beserta data join-nya
 */
export const getAllProdukWithJoins = async () => {
  return queryProduk().orderBy(`p.kode_produk`, "asc");
};

/**
 * 🔹 Ambil produk berdasarkan ID beserta data join-nya
 */
export const getProdukByIdWithJoins = async (id_produk) => {
  return queryProduk().where("p.id_produk", id_produk).first();
};

/**
 * 🔹 Tambah produk baru
 * (Fungsi ini tidak perlu diubah, controller yang mengirim 'data')
 */
export const createProduk = async (data) => {
  const [produkId] = await db(table).insert({
    ...data,
    created_at: new Date(),
  });

  return getProdukByIdWithJoins(produkId);
};

/**
 * 🔹 Update produk
 * (Fungsi ini tidak perlu diubah, controller yang mengirim 'data')
 */
export const updateProduk = async (id_produk, data) => {
  const existingProduk = await db(table).where("id_produk", id_produk).first();

  if (!existingProduk) {
    throw new Error("Produk tidak ditemukan");
  }

  const updateData = {
    ...data,
    updated_at: new Date(),
  };

  await db(table).where("id_produk", id_produk).update(updateData);

  return getProdukByIdWithJoins(id_produk);
};

/**
 * 🔹 Hapus produk
 * (Fungsi ini tidak perlu diubah)
 */
export const deleteProduk = async (id_produk) => {
  const produk = await db(table).where("id_produk", id_produk).first();

  if (!produk) {
    throw new Error("Produk tidak ditemukan");
  }

  await db(table).where("id_produk", id_produk).del();

  return produk;
};