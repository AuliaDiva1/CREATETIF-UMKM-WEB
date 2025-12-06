import multer from "multer";
import path from "path";
import fs from "fs";

// Tentukan folder destinasi untuk Gambar Blog
const storageDir = "./uploads/blog"; // 👈 Perubahan di sini

// Cek dan buat folder jika belum ada
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

// 1. Konfigurasi Penyimpanan (DiskStorage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, storageDir); // Simpan file ke folder './uploads/blog'
  },
  filename: (req, file, cb) => {
    // Buat nama file unik (timestamp + nama asli)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Contoh: image-1678888888-123456789.jpg
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// 2. Filter File (Hanya Izinkan Gambar)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|webp/; // Jenis file gambar yang diizinkan
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true); // Lanjutkan upload
  } else {
    cb(new Error("Error: Hanya file gambar (jpeg, jpg, png, gif, webp) yang diizinkan untuk blog!"));
  }
};

// 3. Inisialisasi Multer
const uploadBlog = multer({ // Nama variabel diubah agar lebih spesifik
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Batas ukuran file 5MB
});

export default uploadBlog;