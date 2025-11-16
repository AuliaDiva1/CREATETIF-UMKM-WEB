"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";
import SectionTitle from "@/components/Common/SectionTitle";
import { useReactToPrint } from "react-to-print";
import PrintableInvoice from "@/components/Dashboard/PrintableInvoice";
import Image from "next/image";

// --- 1. UPDATE TIPE DATA DI SINI JUGA ---
type LineItem = {
  id: number;
  description: string;
  price: number;
};
type Invoice = {
  id: string;
  date: string;
  status: "Paid" | "Pending";
  items: LineItem[];
};
// --------------------------------------

// --- FUNGSI BANTU RUPIAH ---
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};
// --------------------------

// --- 2. UPDATE DUMMY DATA SESUAI STRUKTUR BARU ---
const pendingInvoices: Invoice[] = [
  {
    id: "INV-123",
    date: "2025-10-28",
    status: "Pending",
    items: [
      { id: 1, description: "Biaya Pembuatan Website (Sisa 50%)", price: 1500000 },
    ],
  },
];
const paymentHistory: Invoice[] = [
  {
    id: "INV-101",
    date: "2025-09-15",
    status: "Paid",
    items: [
      { id: 1, description: "Biaya Pembuatan Website (DP 50%)", price: 1500000 },
      { id: 2, description: "Hosting & Domain (1 Tahun)", price: 500000 },
    ],
  },
  {
    id: "INV-100",
    date: "2025-09-01",
    status: "Paid",
    items: [
      { id: 1, description: "Jasa Foto Produk Sesi 1", price: 500000 },
    ],
  },
];
// ------------------------------------------------

const BillingPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [invoiceToPrint, setInvoiceToPrint] = useState<Invoice | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef, // Ini sudah benar
    onAfterPrint: () => setInvoiceToPrint(null),
  });

  // Cek Token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
    } else {
      setLoading(false);
    }
  }, [router]);

  // useEffect untuk memicu cetak
  useEffect(() => {
    if (invoiceToPrint) {
      const timer = setTimeout(() => {
        handlePrint();
      }, 1);
      return () => clearTimeout(timer);
    }
  }, [invoiceToPrint, handlePrint]);

  const triggerPrint = (invoice: Invoice) => {
    setInvoiceToPrint(invoice);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center pt-[120px]">
        Loading Billing...
      </div>
    );
  }

  return (
    <>
      <Breadcrumb
        pageName="Billing & Invoices"
        description="Kelola tagihan dan riwayat pembayaran Anda di satu tempat."
      />

      <section className="pb-16 pt-16 md:pb-20 md:pt-10 lg:pb-28 lg:pt-12">
        <div className="container">
          {/* --- BANNER BERWARNA --- */}
          <div className="wow fadeInUp mb-12 rounded-md bg-primary p-8 shadow-three sm:p-10 md:mb-20 md:p-12">
            <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="max-w-lg">
                <h2 className="text-3xl font-bold text-white md:text-4xl">
                  Metode Pembayaran Mudah
                </h2>
                <p className="mt-3 text-base text-white/80">
                  Kami mendukung pembayaran melalui transfer bank dan e-wallet
                  untuk mempermudah proses transaksi Anda.
                </p>
              </div>
              <button className="flex-shrink-0 rounded-md bg-white px-8 py-3 text-base font-bold text-primary shadow-md transition-all duration-300 hover:bg-white/90">
                Hubungi Admin
              </button>
            </div>
          </div>
          {/* --- BATAS BANNER --- */}

          {/* --- PENDING INVOICES --- */}
          <SectionTitle
            title="Pending Invoices"
            paragraph="Tagihan yang menunggu pembayaran Anda."
            center={false}
            mb="40px"
          />
          <div className="mb-12 flex flex-col gap-4">
            {pendingInvoices.map((invoice) => {
              // 3. HITUNG TOTAL UNTUK KARTU PENDING
              const total = invoice.items.reduce((acc, item) => acc + item.price, 0);
              return (
                <div
                  key={invoice.id}
                  className="rounded-md border-l-4 border-yellow-500 bg-white p-6 shadow-three transition-all duration-300 hover:shadow-lg dark:border-yellow-500 dark:bg-[#2C303B] dark:shadow-two"
                >
                  <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
                    <div>
                      <h3 className="text-xl font-bold text-black dark:text-white">
                        {invoice.id}
                      </h3>
                      <p className="text-body-color">
                        Jatuh Tempo: {invoice.date}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-2xl font-bold text-yellow-500">
                        {formatCurrency(total)} {/* Tampilkan total */}
                      </p>
                      <button className="mt-2 rounded-md bg-yellow-500 px-6 py-3 text-base font-medium text-white shadow-md transition-all duration-300 hover:bg-yellow-500/90 hover:shadow-lg">
                        Bayar Sekarang
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {pendingInvoices.length === 0 && (
              <p className="text-body-color">
                Tidak ada tagihan tertunda saat ini. Kerja bagus!
              </p>
            )}
          </div>

          {/* --- PAYMENT HISTORY --- */}
          <SectionTitle
            title="Payment History"
            paragraph="Riwayat transaksi yang telah selesai."
            center={false}
            mb="40px"
          />
          <div className="flex flex-col gap-4">
            {paymentHistory.map((invoice) => {
              // 4. HITUNG TOTAL UNTUK KARTU HISTORY
              const total = invoice.items.reduce((acc, item) => acc + item.price, 0);
              return (
                <div
                  key={invoice.id}
                  className="rounded-md border border-stroke bg-white p-6 shadow-three transition-all duration-300 hover:shadow-lg dark:border-transparent dark:bg-[#2C303B] dark:shadow-two dark:hover:border-primary/30"
                >
                  <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
                    <div className="opacity-80">
                      <h3 className="text-xl font-bold text-black dark:text-white">
                        {invoice.id}
                      </h3>
                      <p className="text-body-color">
                        Tanggal Lunas: {invoice.date}
                      </p>
                    </div>
                    <div className="flex flex-col items-start gap-3 sm:items-end">
                      <p className="text-2xl font-bold text-green-500 opacity-80">
                        {formatCurrency(total)} {/* Tampilkan total */}
                      </p>
                      <button
                        onClick={() => triggerPrint(invoice)}
                        className="rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary transition-all duration-300 hover:bg-primary hover:text-white"
                      >
                        Cetak Bukti
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- DIV TERSEMBUNYI UNTUK PRINTING --- */}
      <div className="hidden">
        <div ref={printRef}>
          <PrintableInvoice invoice={invoiceToPrint} />
        </div>
      </div>
    </>
  );
};

export default BillingPage;