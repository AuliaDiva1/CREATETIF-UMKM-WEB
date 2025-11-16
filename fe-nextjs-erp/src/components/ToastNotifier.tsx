"use client";

import React, { useState, useImperativeHandle, forwardRef } from "react";

// Tipe data untuk handle ref agar bisa dipanggil dari parent
export type ToastNotifierHandle = {
  showToast: (status: string, message?: string) => void;
};

const ToastNotifier = forwardRef<ToastNotifierHandle, {}>((props, ref) => {
  const [toast, setToast] = useState({
    show: false,
    status: "", // '00' untuk sukses, lainnya error
    message: "",
  });

  // Membuka akses fungsi showToast ke parent component
  useImperativeHandle(ref, () => ({
    showToast: (status, message = "") => {
      setToast({ show: true, status, message });

      // Otomatis hilang setelah 3 detik
      setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3000);
    },
  }));

  if (!toast.show) return null;

  // Logika warna: '00' = Hijau (Sukses), Lainnya = Merah (Error)
  const isSuccess = toast.status === "00";
  const bgColor = isSuccess ? "bg-green-500" : "bg-red-500";
  const icon = isSuccess ? (
    <svg
      className="h-6 w-6 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 13l4 4L19 7"
      />
    </svg>
  ) : (
    <svg
      className="h-6 w-6 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );

  return (
    <div className="fixed top-5 right-5 z-[99999] animate-bounce-in">
      <div
        className={`${bgColor} flex items-center rounded-lg px-4 py-3 shadow-lg transition-all duration-300`}
      >
        <div className="mr-3">{icon}</div>
        <div>
          <h4 className="font-bold text-white">
            {isSuccess ? "Berhasil!" : "Gagal!"}
          </h4>
          <p className="text-sm text-white opacity-90">{toast.message}</p>
        </div>
        <button
          onClick={() => setToast({ ...toast, show: false })}
          className="ml-4 text-white hover:text-gray-200 focus:outline-none"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
});

ToastNotifier.displayName = "ToastNotifier";

export default ToastNotifier;