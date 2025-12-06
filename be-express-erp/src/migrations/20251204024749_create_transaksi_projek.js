/**
 * Migration: Create Transaksi Projek
 * Tabel ini menyimpan data proyek yang akan ditampilkan di Dashboard Client.
 * Relasi ke tabel 'master_klien' menggunakan KLIEN_ID.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function (knex) {
  await knex.schema.createTable('transaksi_projek', (table) => {
    // 1. ID Utama Projek (Primary Key)
    table.bigIncrements('PROJEK_ID').primary();

    // 2. Relasi ke Master Klien (Foreign Key)
    // Ini menghubungkan proyek dengan siapa pemiliknya (Klien)
    table.bigInteger('KLIEN_ID').unsigned().notNullable();
    table
      .foreign('KLIEN_ID')
      .references('KLIEN_ID')
      .inTable('master_klien')
      .onDelete('CASCADE') // Hapus proyek jika data klien induk dihapus
      .onUpdate('CASCADE');

    // 3. Data Proyek (Sesuai Dashboard Frontend)
    table.string('NAMA_PROJEK', 200).notNullable(); // Untuk field 'title'
    table.text('DESKRIPSI').nullable(); // Tambahan untuk detail
    
    // Status: 'In Progress', 'Completed', 'Pending Review'
    table.string('STATUS', 50).defaultTo('Pending Review'); 
    
    // Progress: 0 - 100
    table.integer('PROGRESS').defaultTo(0); 

    // 4. Data Transaksi/Keuangan (Opsional tapi penting untuk tabel 'transaksi')
    table.decimal('NILAI_PROJEK', 15, 2).nullable(); // Contoh: 5000000.00
    table.date('TANGGAL_MULAI').nullable();
    table.date('TANGGAL_SELESAI').nullable();

    // 5. Timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async function (knex) {
  await knex.schema.dropTableIfExists('transaksi_projek');
};