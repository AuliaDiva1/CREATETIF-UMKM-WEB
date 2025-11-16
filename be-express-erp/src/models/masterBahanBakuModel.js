// file: src/models/masterBahanBakuModel.js

import { db } from "../core/config/knex.js"; 

// 🛠️ Definisi Nama Tabel
const table = "master_bahan_baku";
const tblBarcode = "master_barcode";
const tblKategori = "master_kategori_barang"; 
const tblGudang = "master_gudang";
const tblRak = "master_rak";
const tblSatuan = "master_satuan_barang"; 

/**
 * 🔹 Helper internal untuk query dasar (dengan JOIN)
 */
const queryBahanBaku = () => {
    return db(`${table} as bb`)
      .leftJoin(`${tblBarcode} as bar`, `bb.kode_barcode`, "=", `bar.kode_barcode`)
      .leftJoin(`${tblKategori} as kat`, `bb.kode_kategori`, "=", `kat.kode_barang`) 
      .leftJoin(`${tblGudang} as gud`, `bb.kode_gudang`, "=", `gud.kode`)
      .leftJoin(`${tblRak} as rak`, `bb.kode_rak`, "=", `rak.kode`)
      .leftJoin(`${tblSatuan} as sat`, `bb.kode_satuan`, "=", `sat.kode`)
      .select(
        "bb.*",
        "bar.barcode as barcode_number",
        "kat.kategori_barang as kategori_nama", 
        "gud.keterangan as gudang_nama",
        "rak.keterangan as rak_nama",
        // 🛑 KOREKSI UTAMA UNTUK MENGATASI ERROR 'sat.nama':
        // Ganti "sat.nama" menjadi "sat.satuan_barang"
        "sat.satuan_barang as satuan_nama" // 👈 Perubahan di sini!
      );
};

// -------------------------------------------------------------
//                     CRUD FUNCTIONS
// -------------------------------------------------------------

export const getAllBahanBakuWithJoins = async () => {
    return queryBahanBaku().orderBy(`bb.kode`, "asc");
};

export const getBahanBakuByIdWithJoins = async (id) => {
    return queryBahanBaku().where("bb.id", id).first();
};

export const createBahanBaku = async (data) => {
    const [bahanBakuId] = await db(table).insert({
        ...data,
        created_at: new Date(),
    });

    return getBahanBakuByIdWithJoins(bahanBakuId);
};

export const updateBahanBaku = async (id, data) => {
    const existingBahanBaku = await db(table).where("id", id).first();

    if (!existingBahanBaku) {
        throw new Error("Bahan Baku tidak ditemukan");
    }

    const updateData = {
        ...data,
        updated_at: new Date(),
    };

    await db(table).where("id", id).update(updateData);

    return getBahanBakuByIdWithJoins(id);
};

export const deleteBahanBaku = async (id) => {
    const bahanBaku = await db(table).where("id", id).first();

    if (!bahanBaku) {
        throw new Error("Bahan Baku tidak ditemukan");
    }

    await db(table).where("id", id).del();

    return bahanBaku;
};