// src/components/Dashboard/PrintableInvoice.tsx
import React from "react";
import Image from "next/image";

// --- 1. MEMBUAT TIPE DATA RINCIAN ---
type LineItem = {
  id: number;
  description: string;
  price: number; // Pakai angka (number) agar bisa dihitung
};

// --- 2. UPDATE TIPE DATA INVOICE ---
type Invoice = {
  id: string;
  date: string;
  status: "Paid" | "Pending";
  items: LineItem[]; // Sekarang berisi array rincian item
};

type Props = {
  invoice: Invoice | null;
};

// --- FUNGSI BANTU UNTUK FORMAT RUPIAH ---
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};
// -----------------------------------------

const PrintableInvoice = React.forwardRef<HTMLDivElement, Props>(
  ({ invoice }, ref) => {
    if (!invoice) {
      return null;
    }

    // --- 3. HITUNG SUBTOTAL OTOMATIS ---
    const subtotal = invoice.items.reduce((acc, item) => acc + item.price, 0);

    return (
      <div ref={ref} className="bg-white p-12 text-black">
        {/* Konten A4 */}

        {/* Header Invoice */}
        <div className="flex items-center justify-between border-b-2 border-gray-200 pb-4">
          <div>
            <h1 className="text-3xl font-bold">BUKTI PEMBAYARAN</h1>
            <p className="text-gray-600">Invoice: {invoice.id}</p>
          </div>
          <div className="text-right">
            <Image
              src="/images/logo/logo.png"
              alt="Create.tif Logo"
              width={140}
              height={30}
            />
          </div>
        </div>

        {/* Detail & Status */}
        <div className="mt-8 flex justify-between">
          <div>
            <h3 className="text-lg font-semibold">Telah Dibayar Kepada:</h3>
            <p className="font-medium">Create.tif</p>
            <p>Madiun, Indonesia</p>
            <p>createtif@gmail.com</p>
            <p>0856-0791-0959</p>
          </div>
          <div className="text-right">
            <h3 className="text-lg font-semibold">Status:</h3>
            <p className="text-3xl font-bold text-green-500">
              {/* Status dinamis */}
              {invoice.status === "Paid" ? "LUNAS" : "PENDING"}
            </p>
            <p className="text-gray-600">Tanggal Bayar: {invoice.date}</p>
          </div>
        </div>

        {/* --- 4. TABEL ITEM (RINCIAN) --- */}
        <div className="mt-10">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-sm font-semibold">Deskripsi</th>
                <th className="p-3 text-sm font-semibold text-right">Harga</th>
              </tr>
            </thead>
            <tbody>
              {/* Loop/Map semua item di sini */}
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-3">{item.description}</td>
                  <td className="p-3 text-right">
                    {formatCurrency(item.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- 5. TOTAL (OTOMATIS) --- */}
        <div className="mt-8 flex justify-end">
          <div className="w-full max-w-xs text-right">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Biaya Penanganan (0%)</span>
              <span>Rp 0</span>
            </div>
            <div className="mt-2 border-t-2 border-black pt-2">
              <div className="flex justify-between">
                <span className="text-xl font-bold">Total Dibayar</span>
                <span className="text-xl font-bold">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 border-t pt-4 text-center text-gray-500">
          <p>Terima kasih atas kepercayaan Anda.</p>
        </div>
      </div>
    );
  },
);

PrintableInvoice.displayName = "PrintableInvoice";
export default PrintableInvoice;