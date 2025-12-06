import { db } from "../core/config/knex.js";

// === Definisi Nama Tabel ===
const table = "transaksi_blog";

/**
 * 🔹 Helper internal untuk query dasar Blog
 */
const queryBlog = () => {
    return db(table);
};

// --- READ OPERATIONS ---

/**
 * 🔹 Ambil SEMUA data blog (Untuk Admin/Halaman Index Blog)
 * @returns {Promise<Array>} Semua postingan blog, diurutkan berdasarkan ID terbaru.
 */
export const getAllBlog = async () => {
    // Ambil SEMUA kolom untuk admin
    return queryBlog().select("*").orderBy("BLOG_ID", "desc");
};

/**
 * 🔹 Ambil data blog berdasarkan ID BLOG (Untuk halaman Edit Admin)
 * @param {number} blogId - ID blog.
 * @returns {Promise<Object|null>} Objek blog atau null.
 */
export const getBlogById = async (blogId) => {
    return queryBlog().select("*").where("BLOG_ID", blogId).first();
};

/**
 * 🔹 Ambil data blog berdasarkan SLUG (KHUSUS Halaman Detail Publik)
 * @param {string} blogSlug - Slug blog.
 * @returns {Promise<Object|null>} Objek blog yang 'Published' atau null.
 */
export const getBlogBySlug = async (blogSlug) => {
    // Hanya ambil yang sudah dipublikasikan ('Published')
    return queryBlog()
        .select("*")
        .where("SLUG", blogSlug)
        .where("STATUS", "Published") 
        .first();
};

/**
 * 🔹 Ambil daftar blog yang sudah dipublikasikan (Untuk Halaman Index Publik)
 * **PENTING: Hanya ambil kolom yang dibutuhkan untuk efisiensi.**
 * @returns {Promise<Array>} Array objek blog yang dipublikasikan.
 */
export const getAllPublishedBlog = async () => {
    return queryBlog()
        .select(
            'BLOG_ID',
            'TITLE',
            'SLUG',
            'FEATURED_IMAGE_URL',
            'EXCERPT', 
            'AUTHOR_NAME',
            'CREATED_AT',
            'VIEW_COUNT',
            'PUBLISHED_DATE' // Memastikan kolom ini ada untuk sorting
        )
        .where("STATUS", "Published")
        .orderBy("PUBLISHED_DATE", "desc");
};

// --- CREATE & UPDATE OPERATIONS ---

/**
 * 🔹 Tambah Postingan Blog Baru
 * @param {Object} data - Data blog yang akan di-insert.
 * @returns {Promise<Object>} Data blog yang baru dibuat, termasuk ID.
 */
export const createBlog = async (data) => {
    if (!data.SLUG) {
        throw new Error("Kolom SLUG wajib diisi untuk artikel blog.");
    }
    
    delete data.BLOG_ID;
    delete data.VIEW_COUNT; // Akan di-set 0 di bawah
    
    const publishedDate = 
        data.STATUS === 'Published' && !data.PUBLISHED_DATE
          ? new Date() 
          : data.PUBLISHED_DATE || null;

    const [blogId] = await db(table).insert({
        ...data,
        VIEW_COUNT: 0, // Pastikan view count di-set 0 saat create
        PUBLISHED_DATE: publishedDate,
        created_at: new Date(),
        updated_at: new Date(),
    }, 'BLOG_ID');

    // Kembalikan data lengkap yang baru dibuat
    return getBlogById(blogId);
};

/**
 * 🔹 Update Postingan Blog
 * @param {number} blogId - ID blog.
 * @param {Object} data - Data update.
 * @returns {Promise<Object>} Data blog yang telah di-update.
 */
export const updateBlog = async (blogId, data) => {
    const existingBlog = await getBlogById(blogId);

    if (!existingBlog) {
        throw new Error("Postingan Blog tidak ditemukan");
    }

    delete data.BLOG_ID;
    delete data.VIEW_COUNT; 

    const updateData = {
        ...data,
        updated_at: new Date(),
    };
    
    // Logika update PUBLISHED_DATE: 
    if (data.STATUS === 'Published' && !existingBlog.PUBLISHED_DATE) {
        // Jika status diubah ke Published DAN belum punya tanggal publish
        updateData.PUBLISHED_DATE = new Date();
    } else if (data.STATUS === 'Draft') {
        // Jika status diubah kembali ke Draft, tanggal publish harus dihapus
        updateData.PUBLISHED_DATE = null;
    }

    await db(table).where("BLOG_ID", blogId).update(updateData);

    return getBlogById(blogId);
};

/**
 * 🔹 Update VIEW_COUNT (khusus untuk meningkatkan jumlah tampilan)
 * @param {number} blogId - ID blog.
 * @returns {Promise<Object>} Data blog terbaru setelah count di-increment.
 */
export const incrementViewCount = async (blogId) => {
    await db(table)
        .where('BLOG_ID', blogId)
        .increment('VIEW_COUNT', 1);

    // Kembalikan data terbaru setelah update
    return getBlogById(blogId);
};


/**
 * 🔹 Hapus Postingan Blog
 * @param {number} blogId - ID blog.
 * @returns {Promise<Object>} Objek blog yang dihapus (penting untuk delete file di Controller).
 */
export const deleteBlog = async (blogId) => {
    const blog = await getBlogById(blogId); // Gunakan helper

    if (!blog) {
        throw new Error("Postingan Blog tidak ditemukan");
    }

    // Lakukan penghapusan
    await db(table).where("BLOG_ID", blogId).del();

    // Kembalikan objek blog yang dihapus (untuk controller menghapus file)
    return blog;
};