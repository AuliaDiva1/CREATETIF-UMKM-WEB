"use client";

import React, { useEffect, useState } from "react";
import {
    CircleDollarSign,
    ListChecks,
    BadgeAlert, 
    CreditCard, 
    ChevronRight,
    Wallet, 
} from "lucide-react";

// ASUMSI: Base URL API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// --- MOCK UTILS (Dibiarkan tetap sama) ---
const useRouter = () => ({
    push: (path) => {
        console.warn(`Redirect to: ${path}`);
    },
});

const SectionTitle = ({ title, paragraph, center, mb }) => (
    <div
        className={`w-full ${center ? "mx-auto text-center" : "text-left"} ${
            mb || "mb-10"
        }`}
    >
        <h2 className="mb-3 text-3xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
            {title}
        </h2>
        <p className="text-base text-gray-500">{paragraph}</p>
    </div>
);

const SkeletonCard = () => (
    <div className="rounded-xl border bg-white p-6 shadow-sm h-full animate-pulse">
        <div className="flex items-center space-x-5">
            <div className="h-12 w-12 rounded bg-gray-200"></div>
            <div>
                <div className="h-4 w-28 bg-gray-200 rounded mb-3"></div>
                <div className="h-6 w-36 bg-gray-300 rounded"></div>
            </div>
        </div>
    </div>
);

const SkeletonInvoiceRow = () => (
    <div className="rounded-xl border bg-white p-6 shadow-sm animate-pulse">
        <div className="flex justify-between items-center">
            <div className="h-6 w-1/3 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-1/5 bg-gray-300 rounded"></div>
        </div>
        <div className="h-4 w-1/4 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 w-40 bg-indigo-200 rounded ml-auto"></div>
    </div>
);
// -------------------------------------------------------------------

// --- KOMPONEN BANTU REUSABLE (Dibiarkan tetap sama) ---

const SummaryCard = ({ icon: Icon, title, value, className, subtitle }) => (
    <div className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md">
        <div className="flex items-center space-x-5">
            <div
                className={`flex h-12 w-12 items-center justify-center rounded ${className}`}
            >
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 uppercase">
                    {title}
                </p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {value}
                </p>
                {subtitle && (
                    <p className={`text-xs mt-1 ${subtitle.includes('Kekurangan') ? 'text-red-500' : 'text-gray-500'}`}>
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    </div>
);

// --- KOMPONEN UTAMA ---

const BillingDashboardPage = () => {
    const router = useRouter();

    const [userName, setUserName] = useState("Client");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState(null);
    const [outstandingInvoices, setOutstandingInvoices] = useState([]);

    /**
     * Mengambil data billing dari API
     */
    const fetchBillingData = async (username, token) => {
        const apiUrl = `${API_BASE_URL}/billing-klien/klien/username/${username}`;

        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 401) {
            // Jika token kadaluarsa atau tidak valid
            router.push("/signin");
            return null;
        }

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.message || "Gagal mengambil data billing");
        }

        const result = await response.json();
        return result.data;
    };

    useEffect(() => {
        if (typeof window === "undefined") return;

        const token = localStorage.getItem("token");
        // ASUMSI: Username Klien disimpan di USER_NAME setelah login
        const storedName = localStorage.getItem("USER_NAME"); 

        if (!token || !storedName) {
            router.push("/signin");
            return;
        }

        setUserName(storedName);

        const loadData = async () => {
            try {
                const data = await fetchBillingData(storedName, token);
                if (data) {
                    setSummary(data.summary);
                    setOutstandingInvoices(data.outstandingInvoices || []);
                    setError(null);
                }
            } catch (err) {
                setError((err as Error).message || "Billing data could not be loaded.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [router]);

    // Data Summary default
    const dashSummary = summary || {
        totalOutstanding: "Rp0",
        totalPembayaran: "Rp0",
        saldoKlien: "Rp0",
        jumlahTagihanOutstanding: 0,
    };

    // Helper untuk menentukan status saldo
    const getSaldoSubtitle = (saldoKlien) => {
        // --- LOGIKA PERBAIKAN SALDO ---
        // 1. Cek langsung apakah string mengandung tanda negatif atau terutang.
        if (saldoKlien.includes("-") || saldoKlien.includes("(")) {
            return `Kekurangan Bayar / Terutang`;
        }
        
        // 2. Jika tidak ada tanda negatif, coba cek apakah nilainya > 0
        // Hapus semua karakter non-digit kecuali koma dan titik, lalu konversi
        const cleanedSaldo = parseFloat(saldoKlien.replace(/[Rp\s]/g, "").replace(/\./g, "").replace(/,/g, "."));
        
        if (isNaN(cleanedSaldo)) return "Data saldo tidak valid";

        if (cleanedSaldo > 0) {
            return "Kelebihan Bayar / Saldo Positif";
        } else {
            return "Saldo Seimbang (Rp0)";
        }
    };
    // -----------------------------


    const cards = [
        {
            icon: BadgeAlert,
            title: "Total Outstanding",
            value: dashSummary.totalOutstanding,
            className: "bg-red-500",
            subtitle: `${dashSummary.jumlahTagihanOutstanding} tagihan tertunda`,
        },
        {
            icon: CreditCard,
            title: "Total Pembayaran",
            value: dashSummary.totalPembayaran,
            className: "bg-green-600",
            subtitle: `Total pembayaran yang sudah masuk`,
        },
        {
            icon: Wallet,
            title: "Saldo Klien",
            value: dashSummary.saldoKlien,
            // Cek jika saldo mengandung tanda minus untuk menentukan warna
            className: dashSummary.saldoKlien.includes("-") || dashSummary.saldoKlien.includes("(") ? "bg-red-700" : "bg-blue-600",
            subtitle: getSaldoSubtitle(dashSummary.saldoKlien),
        },
    ];

    return (
        <section className="pt-24 pb-16 px-6">
            
            {/* Header / Welcome */}
            <div className="mb-10">
                <div className="rounded-xl bg-indigo-600 p-8 text-white shadow-sm">
                    <h1 className="text-3xl font-semibold">Billing Dashboard, {userName}</h1>
                    <p className="mt-2 text-base text-indigo-100">
                        Monitor tagihan, pembayaran, dan status saldo Anda.
                    </p>
                </div>
            </div>

            {/* Account Summary Cards */}
            <SectionTitle
                title="Financial Summary"
                paragraph={`Overview tagihan dan pembayaran hingga ${new Date().toLocaleDateString("id-ID")}`}
                center={false} mb={"mb-8"}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-12">
                {loading
                    ? [1, 2, 3].map((i) => <SkeletonCard key={i} />)
                    : cards.map((card, index) => (
                          <SummaryCard key={index} {...card} />
                      ))}
            </div>
            
            {/* Active Projects (Outstanding Invoices) */}
            <SectionTitle
                title="Outstanding Invoices"
                paragraph="Daftar tagihan yang sudah jatuh tempo atau akan segera jatuh tempo."
                center={false} mb={"mb-8"}
            />

            <div className="flex flex-col gap-4">
                {loading ? (
                    [1, 2].map((i) => <SkeletonInvoiceRow key={i} />)
                ) : error ? (
                    <div className="p-6 rounded border bg-red-50 text-base text-red-600">
                        {error}
                    </div>
                ) : outstandingInvoices.length > 0 ? (
                    outstandingInvoices.map((invoice) => {
                        return (
                            <div
                                key={invoice.id}
                                className="rounded-xl border border-l-4 border-l-yellow-500 bg-white p-6 shadow-sm transition hover:shadow-md"
                            >
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                            {invoice.nomorInvoice}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Projek: <span className="font-medium text-gray-700">{invoice.namaProjek}</span>
                                        </p>
                                        {/* Tampilan jatuh tempo lebih tegas jika ada outstanding */}
                                        <p className="text-sm text-red-500 font-medium mt-1">
                                            Jatuh Tempo: {invoice.tanggalJatuhTempo}
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-start sm:items-end">
                                        <p className="text-2xl font-bold text-red-600 mb-3">
                                            {invoice.jumlahTagihan}
                                        </p>

                                        <a
                                            href={`/billing/invoice/${invoice.id}`}
                                            className="inline-flex items-center justify-center rounded bg-indigo-600 px-4 py-2 text-base font-medium text-white hover:bg-indigo-700"
                                        >
                                            View & Pay
                                            <ChevronRight className="w-5 h-5 ml-1" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="p-8 rounded-lg border bg-green-50 text-base text-green-600">
                        Hore! Tidak ada tagihan yang tertunda saat ini.
                    </div>
                )}
            </div>
            
        </section>
    );
};

export default BillingDashboardPage;