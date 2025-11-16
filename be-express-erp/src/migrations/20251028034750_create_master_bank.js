/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("master_bank", (table) => {
    table.increments("id").primary(); // Primary key (ID unik untuk bank)
    table.string("kode", 50).notNullable().unique(); // Kode unik bank
    table.string("rekening", 100).notNullable(); // Nomor rekening atau nama bank
    table.boolean("penarikan_tunai").defaultTo(false); // Apakah bisa penarikan tunai (Ya/Tidak)
    table.decimal("administrasi", 14, 2).defaultTo(0); // Biaya administrasi
    table.text("keterangan").nullable(); // Catatan tambahan
    table.timestamp("created_at").defaultTo(knex.fn.now()); // Waktu dibuat
    table.timestamp("updated_at").defaultTo(knex.fn.now()); // Waktu diperbarui
  });
}

export async function down(knex) {
  return knex.schema.dropTableIfExists("master_bank");
}
