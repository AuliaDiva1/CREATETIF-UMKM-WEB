'use client';

import React, { useEffect, useState, useCallback, useRef, forwardRef, useImperativeHandle } from "react";
import axios from "axios";

// Pastikan Base URL benar.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// =========================================================
// 1. INLINE COMPONENT: ToastNotifier
// =========================================================
type ToastNotifierHandle = {
    showToast: (status: string, message?: string) => void;
};

const ToastNotifier = forwardRef<ToastNotifierHandle, {}>((_, ref) => {
    const [toast, setToast] = useState({ visible: false, message: "", status: "" });

    const showToast = useCallback((status: string, message?: string) => {
        let msg = message || "Pesan tidak diketahui.";
        
        switch (status) {
            case "00": msg = message || "Berhasil!"; break;
            case "01": msg = message || "Gagal."; break;
            case "99": msg = message || "Error sistem."; break;
        }

        setToast({ visible: true, message: msg, status });

        const timer = setTimeout(() => {
            setToast((t) => ({ ...t, visible: false }));
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    useImperativeHandle(ref, () => ({ showToast }));

    if (!toast.visible) return null;

    let bgColor = "bg-blue-600";
    if (toast.status === "00") bgColor = "bg-green-600";
    if (toast.status === "01") bgColor = "bg-yellow-600";
    if (toast.status === "99") bgColor = "bg-red-600";

    return (
        <div className={`fixed top-4 right-4 z-[9999] p-4 rounded-lg shadow-xl text-white ${bgColor} transition-all duration-300 animate-slide-in-right flex items-center`}>
            <span className="mr-3 text-xl font-bold">
                {toast.status === "00" ? "✓" : "!"}
            </span>
            {toast.message}
        </div>
    );
});
ToastNotifier.displayName = "ToastNotifier";

// =========================================================
// 2. INLINE COMPONENT: Breadcrumb
// =========================================================
const Breadcrumb = ({ pageName, description }: { pageName: string, description: string }) => {
    return (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-[26px] font-bold leading-[1.2] text-dark dark:text-white">
                {pageName}
            </h2>
            <p className="text-base text-body-color dark:text-body-color-dark">
                {description}
            </p>
        </div>
    );
};

// =========================================================
// 3. MAIN COMPONENT: ProfilePage
// =========================================================
const ProfilePage = () => {
    const toastRef = useRef<ToastNotifierHandle>(null);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [token, setToken] = useState("");

    // KLIEN_ID didapat dari fetch profile, diperlukan untuk endpoint update (PUT /master-klien/:id)
    const [klienId, setKlienId] = useState<number | null>(null);

    // State Data Profil
    const [profileData, setProfileData] = useState({
        nama: "",
        email: "", // Read-only dari users table
        no_telp: "",
        alamat: "",
        isClient: false, // Flag untuk menunjukkan apakah user memiliki data di master_klien
    });

    // Fungsi untuk mengambil data profil dari server.
    const fetchProfile = async (authToken: string) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/auth/profile`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            
            const user = res.data.user;
            const klienDetail = user.klien_detail; 
            
            if (user && klienDetail) {
                setProfileData({
                    nama: klienDetail.NAMA || user.name || "",
                    email: user.email || "",
                    no_telp: klienDetail.NO_TELP || "",
                    alamat: klienDetail.ALAMAT || "",
                    isClient: true,
                });
                
                setKlienId(klienDetail.KLIEN_ID); 
            } else if (user) {
                setProfileData(prev => ({ 
                    ...prev, 
                    email: user.email, 
                    nama: user.name,
                    isClient: false,
                }));
                setKlienId(null); 
                setTimeout(() => {
                    toastRef.current?.showToast("01", "Anda login sebagai Admin atau Role lain. Tidak ada data Klien untuk diperbarui.");
                }, 500);
            } else {
                 setProfileData({ nama: "", email: "", no_telp: "", alamat: "", isClient: false });
                setKlienId(null);
            }
        } catch (err: any) {
            console.error("Gagal mengambil profil:", err);
            const msg = err.response?.status === 401 
                ? "Token tidak valid. Silakan login ulang." 
                : err.response?.data?.message || "Gagal mengambil data profil dari server.";
            toastRef.current?.showToast("99", msg);
        } finally {
            setLoading(false);
        }
    };
    
    // --- Init & Fetch Data ---
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            window.location.href = "/signin";
            return;
        }
        setToken(storedToken);
        
        fetchProfile(storedToken);
    }, []); 

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({ ...prev, [name]: value }));
    };

    // --- Handle Update Profile ---
    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!klienId || !profileData.isClient) {
            toastRef.current?.showToast("01", "Anda tidak diizinkan memperbarui data klien.");
            return;
        }

        if (!profileData.nama.trim()) {
            toastRef.current?.showToast("01", "Nama Lengkap wajib diisi.");
            return;
        }
        if (!profileData.no_telp.trim()) {
            toastRef.current?.showToast("01", "No. Telepon wajib diisi.");
            return;
        }

        setSubmitting(true);

        try {
            // Payload
            const payload = {
                NAMA: profileData.nama,
                NO_TELP: profileData.no_telp,
                ALAMAT: profileData.alamat,
            };

            // Menggunakan klienId untuk endpoint PUT
            await axios.put(`${API_BASE_URL}/master-klien/${klienId}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            await fetchProfile(token);

            localStorage.setItem("USER_NAME", profileData.nama);
            
            toastRef.current?.showToast("00", "Data profil berhasil diperbarui!");
        } catch (err: any) {
            console.error("Profile update error:", err);
            
            const status = err.response?.status;
            let msg = "Gagal memperbarui profil. Silakan cek konsol untuk detail error.";
            
            if (status === 403) msg = "Akses ditolak. Anda tidak diizinkan mengubah data ini.";
            if (status === 404) msg = "Endpoint atau Klien ID tidak ditemukan di server.";

            toastRef.current?.showToast("99", msg);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center pt-[120px] bg-gray-50 dark:bg-dark">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                    <p className="text-body-color dark:text-white">Memuat Profil...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Gaya untuk animasi Toast */}
            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-slide-in-right {
                    animation: slideInRight 0.3s ease-out forwards;
                }
            `}</style>

            <ToastNotifier ref={toastRef} />

            <section className="pb-16 md:pb-20 lg:pb-28 pt-[120px] bg-gray-50 dark:bg-dark min-h-screen">
                <div className="container mx-auto px-4">
                    <Breadcrumb
                        pageName="Profil Saya"
                        description="Kelola informasi dan data diri Anda."
                    />

                    <div className="mx-auto max-w-3xl">
                        {/* --- KARTU PROFIL --- */}
                        <div className="rounded-xl border border-stroke bg-white p-8 shadow-three dark:border-transparent dark:bg-[#2C303B] dark:shadow-two">
                            
                            <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                                <h3 className="text-xl font-bold text-black dark:text-white">
                                    Informasi Data Diri Klien
                                </h3>
                            </div>

                            {/* Peringatan jika bukan Klien/User */}
                            {!profileData.isClient && (
                                <div className="mb-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded text-sm">
                                    <p className="font-bold">⚠️ Perhatian</p>
                                    <p>Akun Anda terdeteksi sebagai non-Klien/User. Data di bawah tidak dapat diperbarui.</p>
                                </div>
                            )}

                            <form onSubmit={handleProfileUpdate}>
                                
                                {/* Nama Lengkap */}
                                <div className="mb-6">
                                    <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                                        Nama Lengkap / Perusahaan <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="nama"
                                        value={profileData.nama}
                                        onChange={handleInputChange}
                                        placeholder="Masukkan nama lengkap"
                                        disabled={!profileData.isClient}
                                        className="w-full rounded-lg border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-transparent dark:bg-dark-2 dark:text-body-color-dark transition-all disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:opacity-70"
                                    />
                                </div>

                                {/* Email (Read-Only) */}
                                <div className="mb-6">
                                    <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={profileData.email}
                                        disabled
                                        className="w-full rounded-lg border border-stroke bg-gray-200 px-6 py-3 text-base text-body-color outline-none cursor-not-allowed dark:bg-dark-2/50 dark:border-transparent opacity-70"
                                    />
                                    <p className="mt-2 text-xs text-red-500">
                                        * Email tidak dapat diubah secara langsung.
                                    </p>
                                </div>

                                {/* No Telepon */}
                                <div className="mb-6">
                                    <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                                        No. Telepon / WhatsApp <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="no_telp"
                                        value={profileData.no_telp}
                                        onChange={handleInputChange}
                                        placeholder="08123xxxx"
                                        disabled={!profileData.isClient}
                                        className="w-full rounded-lg border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-transparent dark:bg-dark-2 dark:text-body-color-dark transition-all disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:opacity-70"
                                    />
                                </div>

                                {/* Alamat */}
                                <div className="mb-8">
                                    <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                                        Alamat Lengkap
                                    </label>
                                    <textarea
                                        name="alamat"
                                        value={profileData.alamat}
                                        onChange={handleInputChange}
                                        placeholder="Masukkan alamat lengkap..."
                                        disabled={!profileData.isClient}
                                        className="w-full rounded-lg border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-transparent dark:bg-dark-2 dark:text-body-color-dark transition-all resize-none h-32 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:opacity-70"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting || !klienId || !profileData.isClient}
                                    className={`w-full rounded-lg bg-primary px-9 py-4 text-base font-medium text-white shadow-submit hover:bg-primary/90 dark:shadow-submit-dark transition-all duration-300 ${
                                        submitting || !klienId || !profileData.isClient ? "opacity-70 cursor-not-allowed" : ""
                                    }`}
                                >
                                    {submitting ? "Menyimpan..." : "Simpan Data Profil"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ProfilePage;