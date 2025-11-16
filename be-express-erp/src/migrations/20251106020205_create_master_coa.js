/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // Kita beri nama tabelnya 'master_coa' (Chart of Accounts)
  return knex.schema.createTable("master_coa", (table) => {
    table.increments("id").primary();
    
    // 'KODE' dari gambar Anda (cth: 1.100.01)
    // Dibuat string karena ada tanda titik
    table.string("kode_rekening", 20).notNullable().unique();
    
    // 'KETERANGAN' dari gambar Anda (cth: Kas Besar)
    table.string("keterangan", 150).notNullable();

    // 'JENIS REKENING' dari gambar Anda
    table.enum("jenis_rekening", ["Induk", "Detail"]).notNullable().defaultTo("Detail");

    // 'KELOMPOK' berdasarkan tab di gambar Anda
    table.enum("kelompok_rekening", [
      "Aset",
      "Kewajiban",
      "Modal",
      "Pendapatan",
      "Biaya"
    ]).notNullable();

    // Kunci untuk membuat hierarki (Induk/Detail)
    // Merujuk ke 'id' di tabel ini sendiri
    table.integer("parent_id").unsigned().nullable();
    table
      .foreign("parent_id")
      .references("id")
      .inTable("master_coa")
      .onDelete("SET NULL") // Jika induk dihapus, jadikan null (top-level)
      .onUpdate("CASCADE");

    table.boolean("status").defaultTo(true);
    table.timestamps(true, true);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("master_coa");
}