/**
 * Migration: Create Transaksi Blog
 * Tabel ini menyimpan semua data postingan blog (artikel).
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function (knex) {
  await knex.schema.createTable('transaksi_blog', (table) => {
    // 1. ID Utama Postingan (Primary Key)
    table.bigIncrements('BLOG_ID').primary();

    // 2. Data Konten Utama
    table.string('TITLE', 255).notNullable(); // Judul
    table.string('SLUG', 255).unique().notNullable(); // URL SEO-Friendly, harus unik
    table.text('CONTENT').notNullable(); // Isi artikel lengkap (HTML/Markdown)
    table.text('EXCERPT').nullable(); // Ringkasan singkat/paragraf pembuka

    // 3. Data Penulis & Media
    table.string('AUTHOR_NAME', 100).notNullable(); // Nama Penulis
    table.string('FEATURED_IMAGE_URL', 500).nullable(); // URL Gambar Utama
    table.string('AUTHOR_IMAGE_URL', 500).nullable(); // URL Foto Profil Penulis

    // 4. Meta & Statistik
    table.string('CATEGORY', 100).nullable(); // Kategori utama
    table.string('TAGS', 500).nullable(); // Tag dipisahkan koma

    // Tanggal Publikasi (Bisa NULL jika masih Draft)
    table.timestamp('PUBLISHED_DATE', { useTz: true }).nullable(); 
    
    // Jumlah Tampilan (Tanpa kolom COMMENT_COUNT)
    table.bigInteger('VIEW_COUNT').defaultTo(0).notNullable(); 
    
    // Status: 'Draft', 'Published', 'Archived'
    table.string('STATUS', 50).defaultTo('Draft').notNullable(); 

    // 5. Timestamps Sistem
    // Menggunakan timestamps(true, true) untuk created_at dan updated_at NOT NULL
    table.timestamps(true, true);

    // 6. Indeks Tambahan untuk Query Cepat
    table.index('SLUG');
    table.index('CATEGORY');
    table.index('STATUS');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async function (knex) {
  await knex.schema.dropTableIfExists('transaksi_blog');
};