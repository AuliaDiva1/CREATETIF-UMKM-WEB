import { getUserByEmail, addUser } from "../models/userModel.js"; 
import { addLoginHistory } from "../models/loginHistoryModel.js";
import { addKlien } from "../models/masterKlienModel.js"; 
import {
    checkEmailExists,
    countSuperAdmin,
    getUserProfileById, // Mengambil user dan klien_detail
    blacklistToken,
} from "../models/authModel.js"; 
import {
    registerSchema, 
    loginSchema,
} from "../scemas/authSchema.js"; 
import { comparePassword, hashPassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import { datetime, status } from "../utils/general.js";
import { db } from "../core/config/knex.js"; // Untuk transaksi

// ===========================================
// REGISTRASI (Admin Only)
// ===========================================

/**
 * 📝 REGISTER PENGGUNA BARU (Role: ADMIN, SUPER_ADMIN, KLIEN, USER, dll.)
 */
export const register = async (req, res) => {
    try {
        const validation = registerSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                status: status.BAD_REQUEST,
                message: "Validasi gagal",
                datetime: datetime(),
                errors: validation.error.errors.map((err) => ({
                    field: err.path[0],
                    message: err.message,
                })),
            });
        }

        const { name, email, password, role, no_telp, alamat } = validation.data;
        const roleIsClientLike = role === "KLIEN" || role === "USER";

        // 1. Cek batasan Super Admin
        if (role === "SUPER_ADMIN") {
            const total = await countSuperAdmin();
            if (total >= 3) {
                return res.status(400).json({
                    status: status.BAD_REQUEST,
                    message: "Maksimal 3 Super Admin sudah terdaftar.",
                    datetime: datetime(),
                });
            }
        }

        // 2. Cek duplikasi email
        if (await checkEmailExists(email)) {
            return res.status(400).json({
                status: status.BAD_REQUEST,
                message: "Email sudah terdaftar",
                datetime: datetime(),
            });
        }

        const hashedPassword = await hashPassword(password);
        
        // 3. Gunakan Transaksi untuk konsistensi User dan Klien/User
        let userResult;
        let detailResult = null;

        await db.transaction(async (trx) => {
            // 3a. Tambah user ke tabel 'users'
            userResult = await addUser({ name, email, password: hashedPassword, role }, trx); 
            
            // 3b. Jika role adalah KLIEN atau USER, tambahkan detail ke master_klien
            if (roleIsClientLike) {
                // Asumsi: addKlien menerima objek data dan trx, mengembalikan data klien yang diinsert
                detailResult = await addKlien({
                    EMAIL: email, // Kunci JOIN
                    NAMA: name,
                    NO_TELP: no_telp || null,
                    ALAMAT: alamat || null,
                }, trx); 
            }
        });

        return res.status(201).json({
            status: status.SUKSES,
            message: `${role} berhasil didaftarkan`,
            datetime: datetime(),
            user: { id: userResult.id, name: userResult.name, email: userResult.email, role: userResult.role },
            detail: roleIsClientLike ? detailResult : null, 
        });
    } catch (error) {
        console.error("Error register:", error);
        return res.status(500).json({
            status: status.GAGAL,
            message: `Terjadi kesalahan server: ${error.message}`,
            datetime: datetime(),
        });
    }
};

// ===========================================
// LOGIN & LOGOUT
// ===========================================

/**
 * 🔑 LOGIN
 */
export const login = async (req, res) => {
    try {
        const validation = loginSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                status: status.BAD_REQUEST,
                message: "Validasi gagal",
                datetime: datetime(),
                errors: validation.error.errors.map((err) => ({
                    field: err.path[0],
                    message: err.message,
                })),
            });
        }

        const { email, password } = validation.data;
        const existingUser = await getUserByEmail(email);

        if (!existingUser) {
            // Menggunakan 401 untuk menyamarkan apakah user tidak ada atau password salah
            return res.status(401).json({ status: status.BAD_REQUEST, message: "Email atau password salah", datetime: datetime() });
        }

        const isPasswordTrue = await comparePassword(password, existingUser.password);
        if (!isPasswordTrue) {
             return res.status(401).json({ status: status.BAD_REQUEST, message: "Email atau password salah", datetime: datetime() });
        }

        // Generate Token
        const token = await generateToken({ userId: existingUser.id, role: existingUser.role });

        // Simpan history login
        await addLoginHistory({
            userId: existingUser.id,
            action: "LOGIN",
            ip: req.ip,
            userAgent: req.headers["user-agent"] || "unknown",
        });

        return res.status(200).json({
            status: status.SUKSES,
            message: "Login berhasil",
            datetime: datetime(),
            token,
            user: { id: existingUser.id, name: existingUser.name, email: existingUser.email, role: existingUser.role },
        });
    } catch (error) {
        console.error("Error login:", error);
        return res.status(500).json({
            status: status.GAGAL,
            message: `Terjadi kesalahan server: ${error.message}`,
            datetime: datetime(),
        });
    }
};

// ---

/**
 * 🚪 LOGOUT
 */
export const logout = async (req, res) => {
    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        const userId = req.user?.userId;

        if (!token || !userId || !req.user.exp) {
            return res.status(401).json({
                status: status.TIDAK_ADA_TOKEN,
                message: "Token tidak valid atau tidak ditemukan",
                datetime: datetime(),
            });
        }

        // Blacklist token
        await blacklistToken(token, new Date(req.user.exp * 1000));

        // Simpan history logout
        await addLoginHistory({
            userId,
            action: "LOGOUT",
            ip: req.ip,
            userAgent: req.headers["user-agent"] || "unknown",
        });

        return res.status(200).json({
            status: status.SUKSES,
            message: "Logout berhasil, token sudah tidak berlaku",
            datetime: datetime(),
        });
    } catch (error) {
        console.error("Error logout:", error);
        return res.status(500).json({
            status: status.GAGAL,
            message: `Terjadi kesalahan server: ${error.message}`,
            datetime: datetime(),
        });
    }
};

// ===========================================
// PROFILE
// ===========================================

/**
 * 👤 GET PROFILE
 */
export const getProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                status: status.TIDAK_ADA_TOKEN,
                message: "Token tidak valid atau tidak ditemukan",
                datetime: datetime(),
            });
        }

        // Mengambil profil lengkap (termasuk klien_detail jika role = KLIEN/USER)
        const user = await getUserProfileById(userId);

        if (!user) {
            return res.status(404).json({
                status: status.DATA_TIDAK_DITEMUKAN,
                message: "User tidak ditemukan",
                datetime: datetime(),
            });
        }

        return res.status(200).json({
            status: status.SUKSES,
            message: "Berhasil mengambil profil user",
            datetime: datetime(),
            user,
        });
    } catch (error) {
        console.error("Error getProfile:", error);
        return res.status(500).json({
            status: status.GAGAL,
            message: `Terjadi kesalahan server: ${error.message}`,
            datetime: datetime(),
        });
    }
};