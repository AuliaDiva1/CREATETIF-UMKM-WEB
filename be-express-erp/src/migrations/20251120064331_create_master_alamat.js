/**
 * Migration: Master Alamat
 * Fungsinya: Menyimpan banyak alamat untuk satu user (Bisa set alamat utama)
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function (knex) {
  await knex.schema.createTable('master_alamat', (table) => {
    // ID Alamat (Primary Key)
    table.bigIncrements('ALAMAT_ID').primary();

    // --- RELASI KE USERS ---
    // Menggunakan EMAIL biar konsisten dengan tabel master_pengguna/siswa kamu
    table
      .string('EMAIL', 120)
      .notNullable()
      .references('email')
      .inTable('users')
      .onDelete('CASCADE') // Kalau user dihapus, semua alamatnya hilang
      .onUpdate('CASCADE');

    // --- DETAIL ALAMAT ---
    table.string('LABEL_ALAMAT', 50).defaultTo('Rumah'); // Contoh: "Rumah", "Kantor", "Gudang"
    table.string('NAMA_PENERIMA', 100).notNullable();
    table.string('NO_HP_PENERIMA', 20).notNullable();
    
    table.text('ALAMAT_LENGKAP').notNullable(); // Jalan, No Rumah, RT/RW
    table.string('KELURAHAN', 100);
    table.string('KECAMATAN', 100);
    table.string('KOTA_KABUPATEN', 100);
    table.string('PROVINSI', 100);
    table.string('KODE_POS', 10);
    
    // --- PENGATURAN ---
    table.boolean('IS_UTAMA').defaultTo(false); // Menandai alamat default pengiriman
    table.string('CATATAN', 255).nullable(); // Patokan ("Rumah cat hijau")

    // --- TIMESTAMPS ---
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async function (knex) {
  await knex.schema.dropTableIfExists('master_alamat');
};