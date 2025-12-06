// src/types/blog.ts

export interface BlogProps {
    BLOG_ID: number;
    TITLE: string;
    EXCERPT: string; // Ringkasan artikel
    CONTENT: string; // Konten lengkap (hanya ada di detail)
    SLUG: string; // Kunci untuk URL dinamis
    FEATURED_IMAGE_URL: string;
    PUBLISHED_DATE: string;
    VIEWS: number;
    AUTHOR_NAME: string;
    // Asumsikan TAGS adalah array dari objek
    TAGS: { TAG_ID: number; TAG_NAME: string }[];
}

// Tambahkan tipe untuk Detail Blog (jika perlu membedakan)
export interface BlogDetailsProps extends BlogProps {
    // Semua properti BlogProps + properti tambahan yang hanya ada di detail (misalnya CONTENT yang lebih panjang)
}