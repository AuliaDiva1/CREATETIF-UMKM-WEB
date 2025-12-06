// src/components/Blog/SingleBlog.tsx

import { BlogProps } from "@/types/blog";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// Base URL diambil dari env, bersihkan slash di akhir untuk penggabungan yang aman.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:8100';

const SingleBlog = ({ blog }: { blog: BlogProps }) => {
    
    const {
        TITLE: title = "Judul Artikel",
        FEATURED_IMAGE_URL = "",
        EXCERPT: paragraph = "Deskripsi singkat belum tersedia.",
        PUBLISHED_DATE: publishDate = "",
        SLUG: slug = "",
        TAGS
    } = blog || {};

    // 1. URL Dinamis Next.js
    const blogUrl = slug ? `/blog-details/${slug}` : "/blog"; 
    
    // 2. Logika URL Gambar Lengkap (Memperhitungkan path relatif atau absolut)
    let fullImageUrl = '/images/placeholder.jpg';
    if (FEATURED_IMAGE_URL) {
        if (FEATURED_IMAGE_URL.startsWith('http')) {
            // Jika sudah URL absolut dari API
            fullImageUrl = FEATURED_IMAGE_URL;
        } else {
            try {
                // Jika path relatif, gabungkan dengan API_BASE_URL
                fullImageUrl = new URL(FEATURED_IMAGE_URL, API_BASE_URL).toString();
            } catch (e) {
                fullImageUrl = '/images/placeholder.jpg';
            }
        }
    }
    
    const displayTag = TAGS && TAGS.length > 0 ? TAGS[0].TAG_NAME : 'Umum';

    if (!title || !slug) {
        return null;
    }

    return (
        <div className="group shadow-one hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark relative overflow-hidden rounded-xs bg-white duration-300">
            {/* Tautan Gambar */}
            <Link
                href={blogUrl} 
                className="relative block aspect-37/22 w-full"
            >
                <span className="bg-primary absolute top-6 right-6 z-20 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white capitalize">
                    {displayTag} 
                </span>
                
                <Image 
                    src={fullImageUrl} 
                    alt={title} 
                    fill 
                    className="object-cover" 
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
            </Link>
            <div className="p-6 sm:p-8 md:px-6 md:py-8 lg:p-8 xl:px-5 xl:py-8 2xl:p-8">
                {/* Tautan Judul */}
                <h3>
                    <Link
                        href={blogUrl} 
                        className="hover:text-primary dark:hover:text-primary mb-4 block text-xl font-bold text-black sm:text-2xl dark:text-white"
                    >
                        {title}
                    </Link>
                </h3>
                <p className="border-body-color/10 text-body-color mb-6 border-b pb-6 text-base font-medium dark:border-white/10">
                    {paragraph}
                </p>
                <div className="flex items-center">
                    <div className="inline-block">
                        <h4 className="text-dark mb-1 text-sm font-medium dark:text-white">
                            Tanggal Publikasi
                        </h4>
                        <p className="text-body-color text-xs">{publishDate ? new Date(publishDate).toLocaleDateString('id-ID') : 'N/A'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleBlog;