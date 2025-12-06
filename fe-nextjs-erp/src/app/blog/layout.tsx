// src/app/blog/layout.tsx (Server Component secara default)

import { Metadata } from 'next';
import React from 'react';

// Metadata didefinisikan dan diekspor di sini
export const metadata: Metadata = {
    title: "Blog & Wawasan | Create.tif",
    description: "Kumpulan artikel, tips, dan wawasan profesional seputar digitalisasi UMKM, fotografi produk, website, dan AR dari Create.tif.",
};

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
        </>
    );
}