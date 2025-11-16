/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("transaksi_supplier", (table) => {
    table.increments("id").primary(); // ID unik auto increment
    table.string("kode_supplier", 15).notNullable().unique(); // Kode unik supplier (misal: S-001)
    table.string("nama_supplier", 150).notNullable(); // Nama supplier (PT/CV)
    table.text("alamat").nullable(); // Alamat lengkap supplier
    table.string("telepon", 20).nullable(); // Nomor telepon
    table.string("email", 100).nullable(); // Email supplier
    table.string("pic", 100).nullable(); // Nama Person in Charge (PIC)

    // --- Foreign Key ke master_jenis_supplier ---
    // Menggunakan kolom 'kode' sebagai referensi, sesuai contoh Anda
    table.string("kode_jenis", 50).notNullable();
    table
      .foreign("kode_jenis")
      .references("kode") // Mereferensi ke kolom 'kode'
      .inTable("master_jenis_supplier") // Di tabel 'master_jenis_supplier'
      .onUpdate("CASCADE") // Jika 'kode' di master berubah, di sini ikut berubah
      .onDelete("RESTRICT"); // Tidak bisa hapus jenis jika masih dipakai supplier

    table.boolean("status").defaultTo(true); // true = aktif, false = tidak aktif
    table.timestamp("created_at").defaultTo(knex.fn.now()); // Tanggal dibuat
    table.timestamp("updated_at").defaultTo(knex.fn.now()); // Tanggal diperbarui

    // Menambahkan index untuk performa query
    table.index("kode_jenis");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("transaksi_supplier");
}