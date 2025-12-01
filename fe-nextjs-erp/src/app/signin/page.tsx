'use client';
import React, { useRef, useState, useCallback, useImperativeHandle, forwardRef } from "react";

// --- KOMPONEN SIMULASI UNTUK MENGATASI ERROR ALIAS PATH ---

// 1. SIMULASI ToastNotifier
type ToastNotifierHandle = {
  showToast: (status: string, message?: string) => void;
};

const ToastNotifier = forwardRef<ToastNotifierHandle, {}>(
  (_, ref) => {
    const [toast, setToast] = useState<{ visible: boolean; message: string; status: string }>({
      visible: false,
      message: "",
      status: "",
    });

    const showToast = useCallback((status: string, message?: string) => {
      let msg = message || "Pesan tidak diketahui.";
      
      switch (status) {
        case "00": // Sukses
          msg = message || "Operasi berhasil.";
          break;
        case "01": // Gagal (Akses/Validasi)
          msg = message || "Gagal melakukan operasi.";
          break;
        case "99": // Error Konfigurasi/Umum
          msg = message || "Terjadi kesalahan koneksi atau sistem.";
          break;
      }

      setToast({ visible: true, message: msg, status });

      // Sembunyikan toast setelah 3 detik
      const timer = setTimeout(() => {
        setToast((t) => ({ ...t, visible: false }));
      }, 3000);

      return () => clearTimeout(timer);
    }, []);

    useImperativeHandle(ref, () => ({
      showToast,
    }));

    if (!toast.visible) return null;

    let bgColor = "bg-blue-500";
    if (toast.status === "00") bgColor = "bg-green-500";
    if (toast.status === "01") bgColor = "bg-yellow-500";
    if (toast.status === "99") bgColor = "bg-red-500";

    return (
      <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-xl text-white ${bgColor} transition-opacity duration-300 animate-slide-in-right`}>
        {toast.message}
      </div>
    );
  }
);
ToastNotifier.displayName = 'ToastNotifier';


// 2. DAFTAR RUTE EKSPLISIT BERDASARKAN ROLE
// PENTING: Semua role dari database (setelah di-lowercase) harus didefinisikan di sini.
// Role yang tidak terdaftar akan diblokir.
const roleRoutes: { [key: string]: string } = {
  // Roles umum/default
  'user': "/dashboard",
  'users': "/dashboard",
  'client': "/dashboard",
  
  // Roles Khusus Administrasi
  'admin': "/admin/dashboard",
  'admins': "/admin/dashboard",
  'super_admin': "/admin/dashboard", // Dari gambar database: SUPER_ADMIN
  
  // Roles Fungsional Tambahan (berdasarkan data yang Anda berikan)
  'manager_produksi': "/dashboard",
  'pengawas_kualitas': "/dashboard",
  'gudang': "/dashboard", // Peran "Gudang" yang Anda sebutkan
  'keuangan': "/dashboard",
  'penjualan': "/dashboard",
  'pembelian': "/dashboard",
};


// --- KOMPONEN UTAMA ---

const SigninPage = () => {
  // Fungsi untuk navigasi nyata
  const navigateTo = (path: string) => {
    console.log(`REDIRECT NYATA KE: ${path}`);
    window.location.href = path; 
  };
  
  const toastRef = useRef<ToastNotifierHandle>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // GANTI DENGAN URL API LARAGON ANDA
  const API_URL = "http://localhost:8100"; 
  const LOGIN_ENDPOINT = `${API_URL}/api/auth/login`;

  const handleGoogleLogin = () => {
    toastRef.current?.showToast("99", "Simulasi: Mengarahkan ke Google Login (Tidak Aktif).");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const MAX_RETRIES = 3;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
      try {
        const res = await fetch(LOGIN_ENDPOINT, {
          method: 'POST',
          headers: { 
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        
        let data: any;

        if (!res.ok) {
          try {
              data = await res.json();
          } catch (jsonError) {
            throw new Error(`Login gagal. Status HTTP: ${res.status}. Error server tak terduga.`);
          }
          throw new Error(data.message || `Gagal login. Status: ${res.status}.`);
        }

        data = await res.json();
        
        if (!data || !data.token || !data.user || !data.user.role) {
          toastRef.current?.showToast("01", data.message || "Login gagal, respon server tidak valid.");
          setLoading(false);
          return;
        }

        // Pastikan role disamakan (lowercase)
        // Dan konversi role dari backend (misal "MANAGER_PRODUKSI") menjadi format yang sama
        const roleDariBackend = data.user.role.toLowerCase().replace(/\s/g, '_'); // Ganti spasi dengan underscore (jika ada)

        // --- LOGIKA OTORISASI BARU DAN KETAT ---
        const redirect = roleRoutes[roleDariBackend];
        
        if (!redirect) {
          // JIKA PERAN TIDAK DITEMUKAN DI roleRoutes, BLOKIR AKSES
          toastRef.current?.showToast(
            "01", 
            `Peran "${data.user.role}" tidak memiliki izin akses ke aplikasi ini. Silakan hubungi admin.`
          );
          setLoading(false);
          return; 
        }

        // Menyimpan data di localStorage 
        localStorage.setItem("token", data.token);
        localStorage.setItem("ROLE", data.user.role);
        localStorage.setItem("USER_NAME", data.user.name || "");

        toastRef.current?.showToast("00", "Login berhasil! Mengalihkan...");
        
        // Timeout sebelum redirect
        setTimeout(() => {
          navigateTo(redirect);
        }, 1000);
        
        setLoading(false);
        return; // Keluar dari loop jika sukses

      } catch (err: any) {
        attempt++;
        if (attempt >= MAX_RETRIES) {
          console.error(`Login Error (Setelah ${MAX_RETRIES} kali coba):`, err);
          let errorMessage = err.message || "Terjadi kesalahan koneksi. Pastikan Laragon berjalan dan endpoint API benar.";
          toastRef.current?.showToast("99", errorMessage);
          setLoading(false);
        } else {
          const delay = Math.pow(2, attempt) * 100;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    setLoading(false);
  };

  return (
    <>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .shadow-three { box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .text-body-color { color: #637381; }
        .border-stroke { border-color: #DDE6ED; }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out forwards;
        }
      `}</style>
      
      <ToastNotifier ref={toastRef} />

      <section className="relative z-10 overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[180px] lg:pb-28 min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="container mx-auto px-4">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4">
              <div className="shadow-three mx-auto max-w-[500px] rounded-xl bg-white px-6 py-10 sm:p-[60px] border border-gray-200 transform transition-all hover:scale-[1.01] duration-300">
                
                <h3 className="mb-3 text-center text-3xl font-extrabold text-gray-900">
                  Selamat Datang Kembali
                </h3>
                <p className="text-body-color mb-8 text-center text-base font-medium">
                  Login ke Client Area Create.tif
                </p>

                {/* --- TOMBOL GOOGLE --- */}
                <button
                  onClick={handleGoogleLogin}
                  className="border-stroke mb-6 flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium outline-none transition-all duration-300 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="mr-3">
                    {/* SVG Google disederhanakan */}
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.78 10.22c0.01 0.73-0.06 1.45-0.22 2.15H10.2v3.7h5.62c-0.1 0.65-0.34 1.27-0.7 1.83-0.36 0.56-0.83 1.05-1.39 1.43l-0.02 0.12 3.03 2.3 0.21 0.02c1.93-1.8 3.04-4.46 3.04-7.37z" fill="#4285F4"/>
                      <path d="M10.2 20c2.75 0 5.06-0.89 6.75-2.42l-3.22-2.44c-0.86 0.59-2.02 1-3.53 1-2.69 0-4.98-1.81-5.79-4.2l-0.12 0.01-3.15 2.4-0.04 0.11c1.69 3.3 5.14 5.53 9.11 5.53z" fill="#34A853"/>
                      <path d="M4.41 11.94c-0.42-1.25-0.42-2.64 0-3.89l0.01-0.13-3.17-2.42-0.13 0.02c-0.9 1.73-0.9 3.77 0 5.5l3.39 0.94z" fill="#FBBC05"/>
                      <path d="M10.2 3.87c1.46-0.02 2.87 0.51 3.94 1.49l2.88-2.75C15.18 0.89 12.74 0 10.2 0c-3.97 0-7.42 2.23-9.11 5.53l3.39 2.4c0.81-2.4 3.1-4.13 5.79-4.13z" fill="#EB4335"/>
                    </svg>
                  </span>
                  Sign in with Google
                </button>

                <div className="mb-8 flex items-center justify-center">
                  <span className="bg-gray-300 hidden h-[1px] w-full max-w-[70px] sm:block"></span>
                  <p className="text-body-color w-full px-5 text-center text-base font-medium">
                    Atau pakai Email
                  </p>
                  <span className="bg-gray-300 hidden h-[1px] w-full max-w-[70px] sm:block"></span>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="email" className="text-dark mb-2 block text-sm font-semibold text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Masukkan email Anda"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-stroke text-body-color focus:border-indigo-600 w-full rounded-lg border border-gray-300 bg-gray-50 px-6 py-3 text-base outline-none transition-all duration-300 focus:shadow-md"
                      required
                      aria-label="Email"
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="password" className="text-dark mb-2 block text-sm font-semibold text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Masukkan password Anda"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-stroke text-body-color focus:border-indigo-600 w-full rounded-lg border border-gray-300 bg-gray-50 px-6 py-3 text-base outline-none transition-all duration-300 focus:shadow-md"
                      required
                      aria-label="Password"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="shadow-lg bg-indigo-600 hover:bg-indigo-700 flex w-full items-center justify-center rounded-lg px-9 py-4 text-base font-medium text-white duration-300 transition-colors disabled:opacity-70 disabled:cursor-not-allowed focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      {loading ? (
                        <>
                          {/* Ikon Spinner */}
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Memproses...
                        </>
                      ) : (
                        "Masuk"
                      )}
                    </button>
                  </div>
                </form>

                <p className="text-body-color text-center text-sm font-medium">
                  Belum punya akun?{" "}
                  <a href="/contact" className="text-indigo-600 hover:text-indigo-700 hover:underline transition-colors font-semibold">
                    Hubungi Admin
                  </a>
                </p>

                {/* --- TOMBOL KEMBALI --- */}
                <div className="mt-6 border-t border-gray-200 pt-6 text-center">
                  <a 
                      href="/" 
                      className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
                  >
                      <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                      >
                          <path d="M19 12H5"/>
                          <path d="M12 19l-7-7 7-7"/>
                      </svg>
                      Kembali ke Beranda
                  </a>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SigninPage;