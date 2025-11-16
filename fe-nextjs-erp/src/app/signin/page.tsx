"use client";

import Link from "next/link";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// Pastikan path ini sesuai dengan struktur foldermu
import { roleRoutes } from "@/utils/roleRoutes";
import ToastNotifier from "@/components/ToastNotifier";

type ToastNotifierHandle = {
  showToast: (status: string, message?: string) => void;
};

const SigninPage = () => {
  const router = useRouter();
  const toastRef = useRef<ToastNotifierHandle>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // --- LOGIKA LOGIN GOOGLE ---
  const handleGoogleLogin = () => {
    // Biasanya backend punya endpoint khusus untuk redirect ke Google
    // Contoh: http://localhost:8000/api/auth/google
    if (!process.env.NEXT_PUBLIC_API_URL) {
      toastRef.current?.showToast("99", "API URL belum disetting.");
      return;
    }
    
    // Redirect browser ke endpoint backend untuk Google Auth
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  // --- LOGIKA LOGIN EMAIL/PASSWORD ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!process.env.NEXT_PUBLIC_API_URL) {
      toastRef.current?.showToast("99", "Konfigurasi Error: API URL tidak ditemukan.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      const data = res.data;
      console.log("Data dari Server:", data);

      if (!data || !data.token || !data.user || !data.user.role) {
        toastRef.current?.showToast("01", data.message || "Login gagal, respon server tidak valid.");
        setLoading(false);
        return;
      }

      // --- CEK ROLE (YANG SUDAH DIPERBAIKI) ---
      const roleDariBackend = data.user.role.toLowerCase(); // "USER" -> "user"
      const roleDiizinkan = ['user', 'users', 'client'];

      if (!roleDiizinkan.includes(roleDariBackend)) {
        toastRef.current?.showToast("01", `Akses Ditolak. Role Anda: ${data.user.role}`);
        setLoading(false);
        return; 
      }

      // Simpan Session
      localStorage.setItem("token", data.token);
      localStorage.setItem("ROLE", data.user.role);
      localStorage.setItem("USER_NAME", data.user.name || "");

      toastRef.current?.showToast("00", "Login berhasil! Mengalihkan...");

      // Redirect sesuai role
      // @ts-ignore
      const redirect = roleRoutes['users'] || '/dashboard';
      
      setTimeout(() => {
        router.push(redirect);
      }, 1000);

    } catch (err: any) {
      console.error("Login Error:", err);
      toastRef.current?.showToast(
        "99",
        err.response?.data?.message || "Email atau password salah."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastNotifier ref={toastRef} />

      <section className="relative z-10 overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[180px] lg:pb-28">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="shadow-three dark:bg-dark mx-auto max-w-[500px] rounded-md bg-white px-6 py-10 sm:p-[60px]">
                <h3 className="mb-3 text-center text-2xl font-bold text-black sm:text-3xl dark:text-white">
                  Selamat Datang Kembali
                </h3>
                <p className="text-body-color mb-11 text-center text-base font-medium">
                  Login ke Client Area Create.tif
                </p>

                {/* --- TOMBOL GOOGLE --- */}
                <button
                  onClick={handleGoogleLogin}
                  className="border-stroke dark:text-body-color-dark dark:shadow-two mb-6 flex w-full items-center justify-center rounded-md border bg-[#f8f8f8] px-6 py-3 text-base outline-none transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-transparent dark:bg-[#2C303B] dark:hover:border-primary dark:hover:bg-primary/5 dark:hover:text-primary dark:focus:shadow-none"
                >
                  <span className="mr-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_95:967)">
                        <path
                          d="M20.0001 10.2216C20.0122 9.53416 19.9397 8.84776 19.7844 8.17725H10.2042V11.8883H15.8277C15.7211 12.539 15.4814 13.1618 15.1229 13.7194C14.7644 14.2769 14.2946 14.7577 13.7416 15.1327L13.722 15.257L16.7512 17.5567L16.961 17.5772C18.8883 15.7781 19.9997 13.122 19.9997 10.2216Z"
                          fill="#4285F4"
                        />
                        <path
                          d="M10.2042 20.0001C12.9592 20.0001 15.2721 19.1111 16.9616 17.5778L13.7416 15.1332C12.88 15.7223 11.7235 16.1334 10.2042 16.1334C7.51326 16.1334 5.22552 14.3269 4.4124 11.9388L4.29071 11.9489L1.13956 14.3528L1.09863 14.4662C2.78392 17.7701 6.23569 20.0001 10.2042 20.0001Z"
                          fill="#34A853"
                        />
                        <path
                          d="M4.41205 11.9389C3.9908 10.6927 3.9908 9.30733 4.41205 8.06113L4.40615 7.92909L1.23298 5.51524L1.09828 5.5338C0.196997 7.26532 0.196997 9.30721 1.09828 11.0387L4.41205 11.9389Z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M10.2042 3.86663C11.6663 3.84438 13.0804 4.37803 14.1498 5.35558L17.0296 2.59996C15.1826 0.885491 12.7412 -0.0296855 10.2042 -3.6784e-05C6.23568 -3.6784e-05 2.78392 2.22997 1.09863 5.53384L4.4124 7.93769C5.22552 5.54965 7.51326 3.86663 10.2042 3.86663Z"
                          fill="#EB4335"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_95:967">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                  Sign in with Google
                </button>
                {/* --- END TOMBOL GOOGLE --- */}

                <div className="mb-8 flex items-center justify-center">
                  <span className="bg-body-color/50 hidden h-[1px] w-full max-w-[70px] sm:block"></span>
                  <p className="text-body-color w-full px-5 text-center text-base font-medium">
                    Atau pakai Email
                  </p>
                  <span className="bg-body-color/50 hidden h-[1px] w-full max-w-[70px] sm:block"></span>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-8">
                    <label
                      htmlFor="email"
                      className="text-dark mb-3 block text-sm font-medium dark:text-white"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Masukkan email Anda"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-md border bg-[#f8f8f8] px-6 py-3 text-base outline-none transition-all duration-300 dark:border-transparent dark:bg-[#2C303B] dark:focus:shadow-none"
                      required
                    />
                  </div>
                  <div className="mb-8">
                    <label
                      htmlFor="password"
                      className="text-dark mb-3 block text-sm font-medium dark:text-white"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Masukkan password Anda"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-md border bg-[#f8f8f8] px-6 py-3 text-base outline-none transition-all duration-300 dark:border-transparent dark:bg-[#2C303B] dark:focus:shadow-none"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="shadow-submit dark:shadow-submit-dark bg-primary hover:bg-primary/90 flex w-full items-center justify-center rounded-md px-9 py-4 text-base font-medium text-white duration-300 disabled:opacity-70"
                    >
                      {loading ? "Memproses..." : "Masuk"}
                    </button>
                  </div>
                </form>

                <p className="text-body-color text-center text-base font-medium">
                  Belum punya akun?{" "}
                  <Link href="/contact" className="text-primary hover:underline">
                    Hubungi Admin
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background SVG */}
        <div className="absolute top-0 left-0 z-[-1]">
          <svg
            width="1440"
            height="969"
            viewBox="0 0 1440 969"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_95:1005"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1440"
              height="969"
            >
              <rect width="1440" height="969" fill="#090E34" />
            </mask>
            <g mask="url(#mask0_95:1005)">
              <path
                opacity="0.1"
                d="M1086.96 297.978L632.959 554.978L935.625 535.926L1086.96 297.978Z"
                fill="url(#paint0_linear_95:1005)"
              />
              <path
                opacity="0.1"
                d="M1324.5 755.5L1450 687V886.5L1324.5 967.5L-10 288L1324.5 755.5Z"
                fill="url(#paint1_linear_95:1005)"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_95:1005"
                x1="1178.4"
                y1="151.853"
                x2="780.959"
                y2="453.581"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_95:1005"
                x1="160.5"
                y1="220"
                x2="1099.45"
                y2="1192.04"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>
    </>
  );
};

export default SigninPage;