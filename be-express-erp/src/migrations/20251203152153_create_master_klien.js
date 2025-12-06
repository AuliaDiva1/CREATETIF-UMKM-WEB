/**
 * Migration: Create Master Klien
 * Tabel ini menyimpan data profil lengkap klien (Create.tif services)
 * Relasi ke tabel 'users' menggunakan EMAIL.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function (knex) {
  await knex.schema.createTable('master_klien', (table) => {
    // 1. ID Utama (Primary Key)
    table.bigIncrements('KLIEN_ID').primary();

    // 2. Relasi ke tabel users (Foreign Key via Email)
    // Pastikan email di tabel 'users' sudah unique/primary index
    table
      .string('EMAIL', 120)
      .notNullable()
      .unique()
      .references('email')
      .inTable('users')
      .onDelete('CASCADE') // Jika user dihapus, data klien ikut terhapus
      .onUpdate('CASCADE'); // Jika email di user berubah, di sini ikut berubah

    // 3. Data Identitas Klien
    table.string('NAMA', 120).notNullable();
    table.string('NO_TELP', 20).notNullable();
    table.text('ALAMAT').nullable(); // Alamat bisa teks panjang (text)

    // 4. Data Sistem (Timestamps)
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async function (knex) {
  await knex.schema.dropTableIfExists('master_klien');
};