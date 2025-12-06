import { db } from "../core/config/knex.js";

/**
 * ===========================================
 * HELPER CHECK DUPLIKASI & HITUNG
 * ===========================================
 */

/**
 * 🔹 CHECK EMAIL EXISTS
 */
export const checkEmailExists = async (email) => {
    return await db("users").where({ email }).first();
};

/**
 * 🔹 COUNT SUPER ADMIN
 */
export const countSuperAdmin = async () => {
    const result = await db("users").where({ role: "SUPER_ADMIN" }).count("id as total");
    return parseInt(result[0].total, 10); 
};

/**
 * ===========================================
 * PROFILE (Klien & Umum)
 * ===========================================
 */

/**
 * 🔹 GET USER PROFILE WITH DETAILS
 * Mengambil data user dari tabel 'users' dan melakukan JOIN ke tabel detail (master_klien).
 */
export const getUserProfileById = async (userId) => {
    const user = await db("users")
        .where("id", userId)
        .select("id", "name", "email", "role", "status", "created_at")
        .first();

    if (!user) return null;

    // Cek apakah user adalah KLIEN atau USER (yang detailnya disimpan di master_klien)
    if (user.role === "KLIEN" || user.role === "USER") {
        const klienData = await db("master_klien")
            .where("EMAIL", user.email) // Mencari detail klien berdasarkan EMAIL
            .select(
                "KLIEN_ID", // ID Klien yang akan digunakan di frontend
                "NAMA",
                "NO_TELP",
                "ALAMAT"
            )
            .first();

        // Menggabungkan data user dan klien
        return { 
            ...user, 
            klien_detail: klienData || null 
        };
    }
    
    // Untuk role lain, kembalikan data user saja
    return user;
};


/**
 * ===========================================
 * LOGOUT & BLACKLIST
 * ===========================================
 */

/**
 * 🔹 BLACKLIST TOKEN
 */
export const blacklistToken = async (token, expiredAt) => {
    return await db("blacklist_tokens").insert({
        token,
        expired_at: expiredAt,
    });
};