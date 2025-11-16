// File: controllers/authController.js

import { 
  getUserByEmail, 
  addUser // Asumsi 'addUser' meng-handle insert ke 'master_sdm'
} from "../models/userModel.js";
import { addLoginHistory } from "../models/loginHistoryModel.js";
// 🔹 Pastikan 'registerSchema' di-impor dari file schema Anda
import { loginSchema, registerSchema } from "../scemas/authSchema.js"; 
import { comparePassword, hashPassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import { datetime, status } from "../utils/general.js";
import { db } from "../core/config/knex.js";

/**
 * 🔹 REGISTER PENGGUNA BARU
 */
export const register = async (req, res) => {
  try {
    // 1. Validasi input menggunakan Zod
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

    const { email, name, password, role } = validation.data;

    // 2. Cek duplikasi email
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Email sudah terdaftar",
        datetime: datetime(),
      });
    }

    // 3. Hash password
    const hashedPassword = await hashPassword(password);

    // 4. Insert ke tabel 'users'
    await db("users").insert({
      name,
      email,
      password: hashedPassword,
      role: role || "GUDANG", // Default role
      status: "Aktif",
      created_at: new Date(),
      updated_at: new Date(),
    });
    
    // 5. Insert ke tabel 'master_sdm'
    await addUser({
      email: email,
      nama_sdm: name,
      jabatan: role || "GUDANG",
    });

    return res.status(201).json({
      status: status.SUKSES,
      message: "Registrasi pengguna baru berhasil",
      datetime: datetime(),
    });

  } catch (error) {
    return res.status(500).json({
      status: status.GAGAL,
      message: `Terjadi kesalahan server: ${error.message}`,
      datetime: datetime(),
    });
  }
};

/**
 * LOGIN
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
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "User tidak ditemukan",
        datetime: datetime(),
      });
    }

    const isPasswordTrue = await comparePassword(password, existingUser.password);
    if (!isPasswordTrue) {
      return res.status(400).json({
        status: status.BAD_REQUEST,
        message: "Email atau password salah",
        datetime: datetime(),
      });
    }

    const token = await generateToken({
      userId: existingUser.id,
      role: existingUser.role,
    });

    // ✅ simpan history login
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
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: status.GAGAL,
      message: `Terjadi kesalahan server: ${error.message}`,
      datetime: datetime(),
    });
  }
};

/**
 * LOGOUT
 */
export const logout = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    const userId = req.user?.userId;

    if (!token || !userId) {
      return res.status(401).json({
        status: status.TIDAK_ADA_TOKEN,
        message: "Token tidak valid atau tidak ditemukan",
        datetime: datetime(),
      });
    }

    // ✅ blacklist token
    await db("blacklist_tokens").insert({
      token,
      expired_at: new Date(req.user.exp * 1000),
    });

    // ✅ simpan history logout
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
    return res.status(500).json({
      status: status.GAGAL,
      message: `Terjadi kesalahan server: ${error.message}`,
      datetime: datetime(),
    });
  }
};