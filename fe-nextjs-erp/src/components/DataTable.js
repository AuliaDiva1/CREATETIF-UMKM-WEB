import React, { useState, useMemo } from 'react';

// =================================================================
// 📚 FUNGSI HELPER
// =================================================================

/**
 * Mendapatkan nilai dari objek menggunakan path bertingkat (nested path).
 * Contoh: getNestedValue({ user: { name: 'Alice' } }, 'user.name') -> 'Alice'
 * @param {object} obj - Objek data.
 * @param {string} path - Path field dalam format dot-notation.
 * @returns {any} Nilai dari field atau string kosong jika tidak ditemukan.
 */
const getNestedValue = (obj, path) => {
    if (!path || !obj) return '';
    return path.split('.').reduce((acc, part) => {
        // Jika acc (akumulator) null/undefined/bukan objek, hentikan reduksi
        if (acc === null || acc === undefined || typeof acc !== 'object') {
            return undefined;
        }
        return acc[part];
    }, obj);
};

// =================================================================
// 🖥️ KOMPONEN UTAMA: CustomDataTable
// =================================================================

/**
 * Komponen Native Data Table (menggunakan React dan Tailwind CSS)
 * Fitur: Paginasi, Loading State, Data Nested.
 * @param {Array} data - Array data yang akan ditampilkan.
 * @param {boolean} loading - Status loading.
 * @param {Array} columns - Konfigurasi kolom.
 */
const CustomDataTable = ({ data = [], loading = false, columns = [] }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10; // Jumlah baris per halaman tetap
    
    // Hitung total halaman
    const totalPages = Math.ceil(data.length / rowsPerPage);

    // --- Logika Paginasi Data Menggunakan useMemo ---
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return data.slice(startIndex, endIndex);
    }, [data, currentPage, rowsPerPage]);

    // Fungsi untuk mengubah halaman
    const changePage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    
    // --- Render Loading State ---
    if (loading) {
        return (
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-3 text-gray-600">Memuat data...</p>
            </div>
        );
    }

    // --- Render No Data State ---
    if (!data || data.length === 0) {
        return (
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-600 font-semibold">Tidak ada data yang ditemukan. 🧐</p>
            </div>
        );
    }
    
    // --- Fungsi Helper untuk membuat array tombol halaman (untuk tampilan yang lebih baik) ---
    const getPageNumbers = () => {
        const maxPagesToShow = 5;
        let startPage, endPage;

        if (totalPages <= maxPagesToShow) {
            // Semua halaman ditampilkan
            startPage = 1;
            endPage = totalPages;
        } else {
            // Logika untuk menampilkan halaman di sekitar halaman aktif
            const middle = Math.floor(maxPagesToShow / 2);
            if (currentPage <= middle) {
                startPage = 1;
                endPage = maxPagesToShow;
            } else if (currentPage + middle >= totalPages) {
                startPage = totalPages - maxPagesToShow + 1;
                endPage = totalPages;
            } else {
                startPage = currentPage - middle;
                endPage = currentPage + middle;
            }
        }

        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };


    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                
                {/* <thead> (Header Tabel) */}
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                // Menggabungkan style bawaan dengan style yang diberikan dari prop
                                style={{ ...col.style }} 
                            >
                                {col.header}
                                {/* Placeholder untuk Filter/Sort Icon */}
                                {/* Catatan: Logika sort/filter perlu ditambahkan secara terpisah */}
                                {col.sortable && <span className="ml-1 text-gray-400">↕️</span>} 
                                {col.filter && <span className="ml-1 text-gray-400">🔍</span>}
                            </th>
                        ))}
                    </tr>
                </thead>

                {/* <tbody> (Isi Data) */}
                <tbody className="divide-y divide-gray-200">
                    {paginatedData.map((row, rowIndex) => (
                        <tr key={row.id || rowIndex} className="hover:bg-blue-50 transition duration-150">
                            {columns.map((col, colIndex) => (
                                <td
                                    key={colIndex}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-800"
                                    style={{ ...col.style }}
                                >
                                    {/* Jika ada custom body function, gunakan itu */}
                                    {col.body 
                                        ? col.body(row)
                                        : getNestedValue(row, col.field)
                                    }
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {/* --- Footer Pagination (Ditingkatkan) --- */}
            {totalPages > 1 && (
                <div className="p-4 border-t flex flex-col sm:flex-row justify-between items-center bg-white">
                    <span className="text-sm text-gray-700 mb-2 sm:mb-0">
                        Menampilkan {(currentPage - 1) * rowsPerPage + 1} sampai {Math.min(currentPage * rowsPerPage, data.length)} dari total {data.length} data. (Halaman {currentPage} dari {totalPages})
                    </span>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        {/* Tombol Sebelumnya */}
                        <button
                            onClick={() => changePage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition ${currentPage === 1 && 'opacity-60 cursor-not-allowed'}`}
                        >
                            &larr; Sebelumnya
                        </button>
                        
                        {/* Tombol Nomor Halaman */}
                        {getPageNumbers().map(page => (
                            <button
                                key={page}
                                onClick={() => changePage(page)}
                                aria-current={currentPage === page ? 'page' : undefined}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition duration-150 ease-in-out
                                    ${currentPage === page
                                        ? 'z-10 bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`
                                }
                            >
                                {page}
                            </button>
                        ))}

                        {/* Tombol Berikutnya */}
                        <button
                            onClick={() => changePage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition ${currentPage === totalPages && 'opacity-60 cursor-not-allowed'}`}
                        >
                            Berikutnya &rarr;
                        </button>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default CustomDataTable;