// file: src/controllers/masterBahanBakuController.js

import * as BahanBakuModel from "../models/masterBahanBakuModel.js";
import { db } from "../core/config/knex.js";
import fs from "fs";
import path from "path";

// 💡 Konstanta untuk folder upload
const UPLOAD_DIR = path.join(process.cwd(), "uploads", "bahanbaku");
const DB_PATH_PREFIX = "/api/uploads/bahanbaku/";

// -------------------------------------------------------------
//                     HELPER FUNCTIONS
// -------------------------------------------------------------
// ... (deleteFile dan generateKodeBahanBaku tidak berubah)
const deleteFile = (filePath) => {
    if (!filePath) return;

    let filename = "";
    if (filePath.startsWith(DB_PATH_PREFIX)) {
        filename = path.basename(filePath);
    } else {
        filename = path.basename(filePath);
    }

    const fullPath = path.join(UPLOAD_DIR, filename);

    if (fs.existsSync(fullPath)) {
        try {
            fs.unlinkSync(fullPath);
            console.log("File berhasil dihapus:", fullPath);
        } catch (err) {
            console.error("Error menghapus file:", err);
        }
    } else {
        console.warn("File tidak ditemukan, tidak bisa dihapus:", fullPath);
    }
};

const generateKodeBahanBaku = async () => {
    const now = new Date();
    // YYMMDD-HHMMSS
    const datePart = now.toISOString().slice(2, 4) + now.toISOString().slice(5, 7) + now.toISOString().slice(8, 10);
    const timePart = now.toISOString().slice(11, 13) + now.toISOString().slice(14, 16) + now.toISOString().slice(17, 19);

    let newKode = `BBK-${datePart}-${timePart}`;

    const existing = await db("master_bahan_baku").where("kode", newKode).first();
    
    if (existing) {
        const ms = now.getMilliseconds().toString().padStart(3, "0");
        newKode = `BBK-${datePart}-${timePart}-${ms}`;
    }
    return newKode;
};

// -------------------------------------------------------------
//                     CONTROLLER FUNCTIONS
// -------------------------------------------------------------

// ... (getAllBahanBaku dan getBahanBakuById tidak berubah)

export const getAllBahanBaku = async (req, res) => {
    try {
        const data = await BahanBakuModel.getAllBahanBakuWithJoins();
        res.status(200).json({
            status: "00",
            message: "Data bahan baku berhasil diambil",
            datetime: new Date().toISOString(),
            data,
        });
    } catch (err) {
        console.error("Error getAllBahanBaku:", err);
        res.status(500).json({
            status: "99",
            message: "Terjadi kesalahan saat mengambil data bahan baku",
            datetime: new Date().toISOString(),
            error: err.message,
        });
    }
};

export const getBahanBakuById = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await BahanBakuModel.getBahanBakuByIdWithJoins(id);

        if (data) {
            res.status(200).json({
                status: "00",
                message: "Data bahan baku berhasil diambil",
                datetime: new Date().toISOString(),
                data,
            });
        } else {
            res.status(404).json({
                status: "04",
                message: "Bahan baku tidak ditemukan",
                datetime: new Date().toISOString(),
            });
        }
    } catch (err) {
        console.error("Error getBahanBakuById:", err);
        res.status(500).json({
            status: "99",
            message: "Terjadi kesalahan saat mengambil data bahan baku",
            datetime: new Date().toISOString(),
            error: err.message,
        });
    }
};

export const addBahanBaku = async (req, res) => {
    const uploadedFile = req.file; 

    try {
        const { nama_produk } = req.body;

        if (!nama_produk) {
            if (uploadedFile) deleteFile(uploadedFile.path); 
            return res.status(400).json({
                status: "01",
                message: "Validasi gagal: Nama Produk wajib diisi",
                datetime: new Date().toISOString(),
            });
        }

        const newKodeBahanBaku = await generateKodeBahanBaku();

        // Siapkan data bahan baku dari body
        const bahanBakuData = {
            ...req.body,
            kode: newKodeBahanBaku,
        };

        // 🛑 KOREKSI FINAL: Hapus kolom-kolom yang TIDAK ADA di skema master_bahan_baku Anda
        delete bahanBakuData.konversi;
        delete bahanBakuData.min_stock;
        delete bahanBakuData.max_stock;
        delete bahanBakuData.punya_kadaluarsa; // 👈 BARIS INI DITAMBAHKAN

        // Handle single file upload
        if (uploadedFile) {
            bahanBakuData.path_gambar = `${DB_PATH_PREFIX}${uploadedFile.filename}`;
        }

        const newBahanBaku = await BahanBakuModel.createBahanBaku(bahanBakuData);

        res.status(201).json({
            status: "00",
            message: "Bahan baku berhasil ditambahkan",
            datetime: new Date().toISOString(),
            data: newBahanBaku,
        });
    } catch (err) {
        if (uploadedFile) deleteFile(uploadedFile.path);
        
        console.error("Error addBahanBaku:", err);
        res.status(500).json({
            status: "99",
            message: "Terjadi kesalahan saat menambahkan bahan baku",
            datetime: new Date().toISOString(),
            error: err.message,
        });
    }
};

export const updateBahanBaku = async (req, res) => {
    const uploadedFile = req.file;

    try {
        const id = req.params.id;
        const existingBahanBaku = await BahanBakuModel.getBahanBakuByIdWithJoins(id);

        if (!existingBahanBaku) {
            if (uploadedFile) deleteFile(uploadedFile.path);
            return res.status(404).json({
                status: "04",
                message: "Bahan baku tidak ditemukan",
                datetime: new Date().toISOString(),
            });
        }

        const bahanBakuData = { ...req.body };

        // Mencegah 'kode' di-update
        delete bahanBakuData.kode;
        
        // 🛑 KOREKSI FINAL: Hapus kolom-kolom yang TIDAK ADA di skema master_bahan_baku Anda
        delete bahanBakuData.konversi;
        delete bahanBakuData.min_stock;
        delete bahanBakuData.max_stock;
        delete bahanBakuData.punya_kadaluarsa; // 👈 BARIS INI DITAMBAHKAN

        // 🔽 Handle update single file & hapus file lama 🔽
        if (uploadedFile) {
            // 1. Set path baru 
            bahanBakuData.path_gambar = `${DB_PATH_PREFIX}${uploadedFile.filename}`;

            // 2. Hapus file lama (jika ada)
            if (existingBahanBaku.path_gambar) {
                deleteFile(existingBahanBaku.path_gambar);
            }
        } else if (bahanBakuData.path_gambar === 'null') {
             // Case: User menghapus gambar lama tanpa upload baru (dari Form React)
            if (existingBahanBaku.path_gambar) {
                deleteFile(existingBahanBaku.path_gambar);
            }
            bahanBakuData.path_gambar = null; // Set di DB menjadi NULL
        } else {
             // Jika tidak ada upload baru, dan bukan "null" (berarti gambar lama dipertahankan)
            delete bahanBakuData.path_gambar; // Hapus dari body agar tidak menimpa dengan string path lama
        }
        // 🔼 -------------------------------------------- 🔼

        const updatedBahanBaku = await BahanBakuModel.updateBahanBaku(id, bahanBakuData);

        res.status(200).json({
            status: "00",
            message: "Bahan baku berhasil diperbarui",
            datetime: new Date().toISOString(),
            data: updatedBahanBaku,
        });
    } catch (err) {
        if (uploadedFile) deleteFile(uploadedFile.path);
        
        console.error("Error updateBahanBaku:", err);
        res.status(500).json({
            status: "99",
            message: "Terjadi kesalahan saat memperbarui bahan baku",
            datetime: new Date().toISOString(),
            error: err.message,
        });
    }
};

// ... (deleteBahanBaku tidak berubah)

export const deleteBahanBaku = async (req, res) => {
    try {
        const id = req.params.id;
        const bahanBaku = await BahanBakuModel.getBahanBakuByIdWithJoins(id);

        if (!bahanBaku) {
            return res.status(404).json({
                status: "04",
                message: "Bahan baku tidak ditemukan",
                datetime: new Date().toISOString(),
            });
        }

        await BahanBakuModel.deleteBahanBaku(id);

        if (bahanBaku.path_gambar) {
            deleteFile(bahanBaku.path_gambar);
        }

        res.status(200).json({
            status: "00",
            message: "Bahan baku berhasil dihapus",
            datetime: new Date().toISOString(),
            data: bahanBaku, 
        });
    } catch (err) {
        console.error("Error deleteBahanBaku:", err);
        res.status(500).json({
            status: "99",
            message: "Terjadi kesalahan saat menghapus bahan baku",
            datetime: new Date().toISOString(),
            error: err.message,
        });
    }
};