/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("master_barcode", (table) => {
    table.increments("id").primary(); // Primary key (ID unik)
    table.string("kode_barcode", 50).notNullable().unique(); // Kode unik barcode
    table.string("nama", 100).notNullable(); // Nama produk / entitas barcode
    table.string("barcode", 100).notNullable(); // Nomor / kode barcode
    table.boolean("status").defaultTo(true); // true = aktif, false = tidak aktif
    table.text("keterangan").nullable(); // Catatan tambahan
    table.timestamp("created_at").defaultTo(knex.fn.now()); // Waktu dibuat
    table.timestamp("updated_at").defaultTo(knex.fn.now()); // Waktu diperbarui
  });
}

export async function down(knex) {
  return knex.schema.dropTableIfExists("master_barcode");
}
