import cors from "cors";
import express from "express";
import logger from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import { setResponseHeader } from "./middleware/set-headers.js";

// 🔹 Import semua route
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import masterHariRoutes from "./routes/masterHariRoutes.js";
import masterKodeBarangRoutes from "./routes/masterKodeBarangRoutes.js";
import masterKategoriBarangRoutes from "./routes/masterKategoriBarangRoutes.js";
import masterSatuanBarangRoutes from "./routes/masterSatuanBarangRoutes.js";
import masterGudangRoutes from "./routes/masterGudangRoutes.js";
import masterRakRoutes from "./routes/masterRakRoutes.js";
import masterBankRoutes from "./routes/masterBankRoutes.js";
import masterBarcodeRoutes from "./routes/masterBarcodeRoutes.js";
import masterJenisSupplierRoutes from "./routes/masterJenisSupplierRoutes.js";
import masterSupplierRoutes from "./routes/masterSupplierRoutes.js";
import masterStokSupplierRoutes from "./routes/masterStokSupplierRoutes.js";
import masterCOARoutes from "./routes/masterCOARoutes.js";
import masterProdukRoutes from "./routes/masterProdukRoutes.js";
import masterBahanBakuRoutes from "./routes/masterBahanBakuRoutes.js";
import masterKlienRoutes from "./routes/masterKlienRoutes.js";
import transaksiProjekRoutes from "./routes/transaksiProjekRoutes.js";
import transaksiBillingRoutes from "./routes/transaksiBillingRoutes.js";
import transaksiBlogRoutes from "./routes/transaksiBlogRoutes.js";
import dashboardKlienRoutes from './routes/DashboardKlienRoutes.js';
// 🌟 PENAMBAHAN: Import BillingKlienRoutes
import billingKlienRoutes from './routes/BillingKlienRoutes.js'; 

const app = express();

// Konfigurasi untuk ES Modules (__dirname & __filename)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = ["http://localhost:3000"];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "X-Timestamp",
            "X-Signature",
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        optionSuccessStatus: 200,
    })
);

// 🔹 Logger & parser
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Serving Gambar Produk
app.use(
    "/api/uploads/produk",
    express.static(path.join(__dirname, "../uploads/produk")) 
);

// Serving Gambar Bahan Baku
app.use(
    "/api/uploads/bahanbaku",
    express.static(path.join(__dirname, "../uploads/bahanbaku")) 
);
// Serving Gambar Blog (Sesuai dengan field FEATURED_IMAGE_URL dan AUTHOR_IMAGE_URL)
app.use(
    "/api/uploads/blog",
    express.static(path.join(__dirname, "../uploads/blog")) 
);

// 🔹 Default route (cek server)
app.get("/", [setResponseHeader], (req, res) => {
    return res
        .status(200)
        .json(`Welcome to the server! ${new Date().toLocaleString()}`);
});

// 🔹 Daftar semua route API
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/dashboard-klien", dashboardKlienRoutes);
// 🌟 PENAMBAHAN: Route Billing Klien
app.use("/api/billing-klien", billingKlienRoutes); 

app.use("/api/user", userRoutes);
app.use("/api/master-hari", masterHariRoutes);
app.use("/api/master-kodebarang", masterKodeBarangRoutes);
app.use("/api/master-kategoribarang", masterKategoriBarangRoutes);
app.use("/api/master-satuanbarang", masterSatuanBarangRoutes);
app.use("/api/master-gudang", masterGudangRoutes);
app.use("/api/master-rak", masterRakRoutes);
app.use("/api/master-bank", masterBankRoutes);
app.use("/api/master-barcode", masterBarcodeRoutes);
app.use("/api/master-jenis-supplier", masterJenisSupplierRoutes);
app.use("/api/master-supplier", masterSupplierRoutes);
app.use("/api/master-stok-supplier", masterStokSupplierRoutes);
app.use("/api/master-coa", masterCOARoutes);
app.use("/api/master-produk", masterProdukRoutes);
app.use("/api/master-bahanbaku", masterBahanBakuRoutes);
app.use("/api/master-klien", masterKlienRoutes);
app.use("/api/transaksi-projek", transaksiProjekRoutes);
app.use("/api/transaksi-billing", transaksiBillingRoutes);
app.use("/api/transaksi-blog", transaksiBlogRoutes)

export default app;