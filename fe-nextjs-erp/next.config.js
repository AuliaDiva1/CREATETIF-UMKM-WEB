/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Pola yang sudah ada (Sanity)
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
      // ✅ Pola BARU untuk localhost:8100
      {
        protocol: "http", // Gunakan http karena localhost biasanya tidak menggunakan SSL/TLS
        hostname: "localhost",
        port: "8100", // Port yang Anda gunakan untuk API
        pathname: '/api/uploads/blog/**' // Tambahkan path yang sesuai
      },
      // Penting: Jika Anda menggunakan http://localhost:8100 tanpa path /api/uploads/blog, 
      // Anda mungkin bisa menyederhanakan pathname menjadi '/**' atau lebih spesifik.
    ],
  },
};

module.exports = nextConfig;