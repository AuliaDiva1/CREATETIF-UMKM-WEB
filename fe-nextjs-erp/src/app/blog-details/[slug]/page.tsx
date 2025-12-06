// src/app/blog-details/[slug]/page.tsx

import SharePost from "@/components/Blog/SharePost";
import TagButton from "@/components/Blog/TagButton";
import Image from "next/image";
import { Metadata } from "next";
import axios from "axios";
import { BlogDetailsProps } from "@/types/blog"; // Asumsi BlogProps dihilangkan
import { notFound } from "next/navigation";

// Base URL diambil dari environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';

// --- Tipe Data untuk Halaman ---
interface BlogDetailsPageProps {
    params: {
        slug: string; // Parameter yang ditangkap dari [slug]
    };
}

// --- FUNGSI FETCHING DATA SERVER-SIDE ---
async function getBlogDetails(slug: string): Promise<BlogDetailsProps | null> {
    if (!API_BASE_URL) {
        console.error("API_BASE_URL is not defined");
        return null;
    }
    
    try {
        // Gunakan slug yang sudah dipastikan lowercase
        const url = `${API_BASE_URL}/transaksi-blog/slug/${slug}`; 
        
        console.log(`[BlogDetails] Memanggil API untuk slug: ${slug}. URL: ${url}`);
        
        const res = await axios.get(url, {
            // Jika ada masalah caching, Anda bisa menambahkan ini, 
            // tetapi ini akan menghapus static caching Next.js:
            // next: { revalidate: 0 } 
        });
        
        console.log(`[BlogDetails] Status API: ${res.status}`);

        // Asumsikan struktur respons adalah { data: [ {BLOG_ID: 1, ...} ] }
        if (res.data.data && res.data.data.length > 0) {
            return res.data.data[0] as BlogDetailsProps;
        }
        return null;
    } catch (error) {
        const url = `${API_BASE_URL}/transaksi-blog/slug/${slug}`; 
        
        console.error(`[BlogDetails ERROR] Gagal memuat detail blog untuk URL: ${url}`);
        console.error("Detail Error:", axios.isAxiosError(error) ? `Request failed with status code ${error.response?.status}` : error);
        return null;
    }
}

// --- GENERASI METADATA DINAMIS (Penting untuk SEO) ---
export async function generateMetadata({ params }: BlogDetailsPageProps): Promise<Metadata> {
    const awaitedParams = await params;
    
    // Pastikan slug selalu lowercase
    const slugLower = awaitedParams.slug.toLowerCase(); 
    
    const blog = await getBlogDetails(slugLower);

    if (!blog) {
        return {
            title: "Artikel Tidak Ditemukan",
        };
    }

    return {
        title: `${blog.TITLE} | Blog Details`,
        description: blog.EXCERPT || blog.TITLE,
    };
}


// --- KOMPONEN UTAMA PAGE ---
const BlogDetailsPage = async ({ params }: BlogDetailsPageProps) => {
    
    const awaitedParams = await params;
    
    // Pastikan slug selalu lowercase
    const slugLower = awaitedParams.slug.toLowerCase(); 

    // Gunakan slug yang sudah di-lowercase
    const blog = await getBlogDetails(slugLower); 
    
    if (!blog) {
        // Next.js akan menampilkan halaman not-found.tsx jika dipanggil
        notFound(); 
    }
    
    const { 
        TITLE, 
        CONTENT, 
        AUTHOR_NAME, 
        PUBLISHED_DATE, 
        VIEWS, 
        FEATURED_IMAGE_URL,
        TAGS
    } = blog;

    // Logika gambar yang lebih kuat
    let featuredImageUrl = '/images/placeholder.jpg';
    if (FEATURED_IMAGE_URL) {
        if (FEATURED_IMAGE_URL.startsWith('http')) {
            featuredImageUrl = FEATURED_IMAGE_URL;
        } else if (API_BASE_URL) {
            try {
                // Menggunakan API_BASE_URL untuk gambar relatif (disarankan)
                const baseUrl = API_BASE_URL.replace(/\/api$/, ''); 
                featuredImageUrl = new URL(FEATURED_IMAGE_URL, baseUrl).toString();
            } catch (e) {
                 console.error("Gagal menggabungkan URL gambar:", e);
            }
        }
    }

    // Logika Tanggal
    const formattedDate = PUBLISHED_DATE 
        ? new Date(PUBLISHED_DATE).toLocaleDateString('id-ID', {
            year: 'numeric', month: 'long', day: 'numeric'
          }) 
        : 'Tanggal tidak diketahui';
    
    return (
        <section className="pt-[150px] pb-[120px]">
            <div className="container">
                <div className="-mx-4 flex flex-wrap justify-center">
                    <div className="w-full px-4 lg:w-8/12">
                        <div>
                            {/* --- JUDUL DINAMIS --- */}
                            <h2 className="mb-8 text-3xl leading-tight font-bold text-black sm:text-4xl sm:leading-tight dark:text-white">
                                {TITLE}
                            </h2>

                            <div className="border-body-color/10 mb-10 flex flex-wrap items-center justify-between border-b pb-4 dark:border-white/10">
                                <div className="flex flex-wrap items-center">
                                    {/* Penulis */}
                                    <div className="mr-10 mb-5 flex items-center">
                                        <div className="w-full">
                                            <span className="text-body-color mb-1 text-base font-medium">
                                                By <span>{AUTHOR_NAME || 'Admin'}</span>
                                            </span>
                                        </div>
                                    </div>
                                    {/* Tanggal */}
                                    <div className="mb-5 flex items-center">
                                        <p className="text-body-color mr-5 flex items-center text-base font-medium">
                                            {formattedDate}
                                        </p>
                                    </div>
                                    {/* Views */}
                                    <div className="mb-5 flex items-center">
                                        <p className="text-body-color flex items-center text-base font-medium">
                                            {VIEWS ? `${VIEWS}x Dilihat` : '0 Dilihat'}
                                        </p>
                                    </div>
                                </div>
                                {/* Tag Utama */}
                                <div className="mb-5">
                                    <span className="bg-primary inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white">
                                        {TAGS && TAGS.length > 0 ? TAGS[0].TAG_NAME : 'Tanpa Kategori'}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Gambar Utama */}
                            <div className="mb-10 w-full overflow-hidden rounded-sm">
                                <div className="relative aspect-97/60 w-full sm:aspect-97/44">
                                    <Image
                                        src={featuredImageUrl}
                                        alt={TITLE}
                                        fill
                                        className="object-cover object-center"
                                        sizes="(max-width: 768px) 100vw, 80vw"
                                    />
                                </div>
                            </div>

                            {/* KONTEN ARTIKEL */}
                            <div 
                                className="blog-content text-body-color text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed"
                                // Gunakan dangerouslySetInnerHTML untuk merender HTML dari API
                                dangerouslySetInnerHTML={{ __html: CONTENT || 'Konten belum tersedia.' }}
                            />
                            
                            <div className="items-center justify-between sm:flex mt-10">
                                <div className="mb-5">
                                    <h4 className="text-body-color mb-3 text-sm font-medium">
                                        Tags :
                                    </h4>
                                    <div className="flex items-center flex-wrap">
                                        {/* Tag Button Dinamis */}
                                        {TAGS?.map((tag) => (
                                            <TagButton key={tag.TAG_ID} text={tag.TAG_NAME} />
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-5">
                                    <h5 className="text-body-color mb-3 text-sm font-medium sm:text-right">
                                        Share this post :
                                    </h5>
                                    <div className="flex items-center sm:justify-end">
                                        <SharePost /> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlogDetailsPage;