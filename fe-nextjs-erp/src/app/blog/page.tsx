// src/app/blog/page.tsx (FINAL: Memperbaiki ReferenceError)

'use client'; 

import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import SingleBlog from "@/components/Blog/SingleBlog";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { BlogProps } from "@/types/blog";

// Mengambil URL dari environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// --- Komponen Blog Halaman Indeks ---
const Blog = () => {
    // ✅ FIX: DEFINISIKAN STATE DI SINI
    const [blogList, setBlogList] = useState<BlogProps[]>([]); 
    const [isLoading, setIsLoading] = useState(true); // <-- isLoading Didefinisikan
    const [error, setError] = useState<string | null>(null); // <-- error Didefinisikan
    
    // --- Fetch Data Blog Publik ---
    const fetchPublishedBlog = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Kita asumsikan API_BASE_URL sudah dikoreksi menjadi http://localhost:8100
            const res = await axios.get(`${API_BASE_URL}/transaksi-blog`); 
            setBlogList(res.data.data || []);
        } catch (err) {
            console.error("Gagal memuat data blog publik:", err);
            setError("Gagal memuat artikel terbaru. Silakan coba refresh.");
        } finally {
            setIsLoading(false);
        }
    }, [API_BASE_URL]); // Tambahkan API_BASE_URL ke dependency array jika ada risiko berubah

    useEffect(() => {
        fetchPublishedBlog();
    }, [fetchPublishedBlog]); 

    // --- Render Loading, Error, atau Data Kosong ---
    // ✅ Sekarang isLoading, error, dan blogList sudah didefinisikan
    if (isLoading) {
        // Anda bisa menampilkan indikator loading di sini
        return <p className="text-center py-20">Memuat artikel...</p>;
    }
    
    if (error) {
        return <p className="text-center py-20 text-red-500">Error: {error}</p>;
    }

    if (blogList.length === 0) {
        return <p className="text-center py-20">Belum ada artikel yang dipublikasikan.</p>;
    }
    // --- End Render Loading/Error ---

    // --- Render Utama (Data Tersedia) ---
    return (
        <>
            <Breadcrumb
                pageName="Blog"
                description="Temukan wawasan, tips, dan panduan terbaru seputar dunia digital untuk membantu bisnis Anda bertumbuh dan berkembang secara profesional."
            />

            <section className="pt-[120px] pb-[120px]">
                <div className="container">
                    <div className="-mx-4 flex flex-wrap justify-center">
                        {blogList.map((blog) => (
                            <div
                                key={blog.BLOG_ID} 
                                className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3"
                            >
                                {/* TIDAK ADA LINK PEMBUNGKUS DI SINI */}
                                <SingleBlog blog={blog} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Blog;