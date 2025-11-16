/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    screens: {
      xs: "450px",
      sm: "575px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      "2xl": "1400px",
    },
    extend: {
      // Ini adalah konfigurasi warna, dll. dari template aslinya
      colors: {
        current: "currentColor",
        transparent: "transparent",
        white: "#FFFFFF",
        black: "#090E34",
        dark: "#1D2144",
        primary: "#4A6CF7",
        yellow: "#FBB040",
        "body-color": "#959CB1",
        "dark-2": "#1A223C", // Saya tambahkan warna background dari kode AR
      },
      
      // --- INI KODE ANIMASI BARUNYA ---
      animation: {
        "slide-vertical": "slide-vertical 10s ease-in-out infinite",
      },
      keyframes: {
        "slide-vertical": {
          "0%, 45%": { transform: "translateY(0%)" }, // Diam di gambar 1 (4.5 detik)
          "55%, 95%": { transform: "translateY(-50%)" }, // Geser & diam di gambar 2 (4 detik)
          "100%": { transform: "translateY(0%)" }, // Kembali ke gambar 1
        },
      },
      // --- BATAS KODE ANIMASI ---
    },
  },
  plugins: [],
};