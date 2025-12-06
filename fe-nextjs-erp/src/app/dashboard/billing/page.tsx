// File: src/app/dashboard/billing/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import {
    CircleDollarSign,
    BadgeAlert, 
    CreditCard, 
    ChevronRight,
    Wallet, 
} from "lucide-react";

// ASUMSI: Base URL API
// Menggunakan port 8100 sesuai kode Anda
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8100/api";
const SUMMARY_ENDPOINT = "/dashboard-klien/klien/username"; 
const OUTSTANDING_ENDPOINT = "/dashboard-klien/klien/username"; 

// --- MOCK UTILS & KOMPONEN BANTU ---
// Asumsi: useRouter ini adalah mock atau berasal dari 'next/navigation'
const useRouter = () => ({
    push: (path) => {
        console.warn(`Redirecting to: ${path}`);
    },
});

const SectionTitle = ({ title, paragraph, mb }) => (
    <div
        className={`w-full text-left ${
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
        <div className="h-6 w-2/3 bg-gray-200 rounded mb-4"></div>
        <div className="h-3 w-full bg-gray-200 rounded mb-3"></div>
        <div className="h-10 w-40 bg-indigo-300 rounded ml-auto"></div>
    </div>
);

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

// --- LOGIC UTAMA BILLING DASHBOARD ---

const BillingDashboardPage = () => {
    const router = useRouter();

    const [userName, setUserName] = useState("Client");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState(null);
    const [outstandingInvoices, setOutstandingInvoices] = useState([]);

    /**
     * Helper untuk memeriksa dan mem-parsing respons API
     */
    const checkAndParseResponse = async (res, defaultErrorMsg) => {
        const contentType = res.headers.get("content-type");
        if (res.status === 401) {
            // Jika token kadaluarsa, arahkan ke signin
            router.push("/signin");
            throw new Error("Sesi berakhir. Silakan login kembali.");
        }
        if (!res.ok) {
            if (contentType && contentType.includes("application/json")) {
                const errorBody = await res.json();
                throw new Error(errorBody.message || defaultErrorMsg);
            } else {
                throw new Error(`Gagal (Status ${res.status}).`);
            }
        }
        return res.json();
    };


    /**
     * Mengambil data billing dari API menggunakan username.
     */
    const fetchBillingData = async (username, token) => {
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };

        // Menggunakan USERNAME di URL
        const summaryUrl = `${API_BASE_URL}${SUMMARY_ENDPOINT}/${username}/billing-summary`;
        const outstandingUrl = `${API_BASE_URL}${OUTSTANDING_ENDPOINT}/${username}/outstanding`;

        // Panggil kedua endpoint secara paralel
        const [summaryResponse, outstandingResponse] = await Promise.all([
             fetch(summaryUrl, { method: "GET", headers }),
             fetch(outstandingUrl, { method: "GET", headers }),
        ]);
        
        const summaryResult = await checkAndParseResponse(summaryResponse, "Gagal mengambil data ringkasan billing");
        const outstandingResult = await checkAndParseResponse(outstandingResponse, "Gagal mengambil daftar tagihan tertunda");
        
        return { 
            summary: summaryResult.data, 
            outstandingInvoices: outstandingResult.data.outstandingInvoices || [] 
        };
    };

    useEffect(() => {
        if (typeof window === "undefined") return;

        const token = localStorage.getItem("token");
        const storedName = localStorage.getItem("USER_NAME"); // Mengambil username

        if (!token || !storedName) {
            router.push("/signin");
            return;
        }
        
        // Panggilan setState ini memicu render, jika 'router' di dependency array
        // berubah, maka useEffect akan dijalankan lagi, menyebabkan loop.
        setUserName(storedName); 

        const loadData = async () => {
            setLoading(true);
            try {
                const data = await fetchBillingData(storedName, token); // Menggunakan username
                if (data) {
                    setSummary(data.summary);
                    setOutstandingInvoices(data.outstandingInvoices);
                    setError(null);
                }
            } catch (err) {
                console.error("Fetch Error:", err);
                setError(err.message || "Billing data could not be loaded.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []); // <--- PERBAIKAN: Menggunakan array kosong [] untuk memastikan hanya berjalan sekali

    // Data Summary default
    const dashSummary = summary || {
        totalOutstanding: "Rp0",
        totalPembayaran: "Rp0",
        saldoKlien: "Rp0",
        jumlahTagihanOutstanding: outstandingInvoices.length,
    };

    // Helper untuk menentukan status saldo dan subtitle
    const getSaldoSubtitle = (saldoKlien) => {
        if (saldoKlien.includes("-")) {
            return `Kekurangan Bayar / Terutang`;
        }
        
        const cleanedSaldo = parseFloat(saldoKlien.replace(/[Rp\s.,]/g, "").replace('-', ''));
        
        if (isNaN(cleanedSaldo) || cleanedSaldo === 0) {
            return "Saldo Seimbang (Rp0)";
        }
        
        return "Kelebihan Bayar / Saldo Positif";
    };

    const cards = [
        {
            icon: BadgeAlert,
            title: "Total Outstanding",
            value: dashSummary.totalOutstanding,
            className: "bg-red-600",
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
            className: dashSummary.saldoKlien.includes("-") ? "bg-amber-600" : "bg-indigo-600",
            subtitle: getSaldoSubtitle(dashSummary.saldoKlien),
        },
    ];

    return (
        <section className="pt-24 pb-16 px-6 bg-gray-50 min-h-screen">
            
            {/* Header / Welcome */}
            <div className="mb-10">
                <div className="rounded-xl bg-indigo-700 p-8 text-white shadow-lg">
                    <h1 className="text-3xl font-semibold">Billing Dashboard, {userName}</h1>
                    <p className="mt-2 text-base text-indigo-100">
                        Monitor tagihan, pembayaran, dan status saldo Anda.
                    </p>
                </div>
            </div>

            <hr className="my-10" />
            
            {/* Financial Summary Cards */}
            <SectionTitle
                title="Financial Summary"
                paragraph={`Overview tagihan dan saldo per ${new Date().toLocaleDateString("id-ID")}`} mb={undefined}            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-12">
                {loading
                    ? [1, 2, 3].map((i) => <SkeletonCard key={i} />)
                    : cards.map((card, index) => (
                          <SummaryCard key={index} {...card} />
                      ))}
            </div>
            
            <hr className="my-10" />
            
            {/* Outstanding Invoices List */}
            <SectionTitle
                title="Outstanding Invoices"
                paragraph="Daftar tagihan yang sudah jatuh tempo atau akan segera jatuh tempo." mb={undefined}            />

            <div className="flex flex-col gap-6">
                {loading ? (
                    [1, 2].map((i) => <SkeletonInvoiceRow key={i} />)
                ) : error ? (
                    <div className="p-6 rounded-lg border bg-red-50 text-base text-red-600">
                        {error}
                    </div>
                ) : outstandingInvoices.length > 0 ? (
                    outstandingInvoices.map((invoice) => {
                        // Logic untuk menentukan apakah tagihan jatuh tempo atau kadaluarsa
                        const dueDate = new Date(invoice.tanggalJatuhTempo);
                        const today = new Date();
                        // Reset waktu untuk perbandingan tanggal saja
                        dueDate.setHours(0, 0, 0, 0);
                        today.setHours(0, 0, 0, 0);
                        
                        const isOverdue = dueDate < today;
                        const borderClass = isOverdue ? "border-l-red-500" : "border-l-yellow-500";
                        
                        return (
                            <div
                                key={invoice.id}
                                className={`rounded-xl border border-l-4 ${borderClass} bg-white p-6 shadow-sm transition hover:shadow-md`}
                            >
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                            {invoice.nomorInvoice}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Proyek: <span className="font-medium text-gray-700">{invoice.namaProjek}</span>
                                        </p>
                                        <p className={`text-sm font-medium mt-1 ${isOverdue ? 'text-red-600' : 'text-amber-600'}`}>
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
                                            Lihat & Bayar
                                            <ChevronRight className="w-5 h-5 ml-1" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="p-8 rounded-lg border bg-green-50 text-base text-green-600">
                        🎉 Tidak ada tagihan yang tertunda saat ini.
                    </div>
                )}
            </div>
            
        </section>
    );
};

export default BillingDashboardPage;