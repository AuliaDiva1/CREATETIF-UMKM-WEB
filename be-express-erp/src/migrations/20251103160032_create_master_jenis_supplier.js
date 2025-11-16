/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("master_jenis_supplier", (table) => {
    table.increments("id").primary(); // ID unik auto increment
    table.string("kode", 50).notNullable().unique(); // Kode jenis supplier unik
    table.string("keterangan", 150).notNullable(); // Nama / deskripsi jenis supplier
    table.boolean("status").defaultTo(true); // true = aktif, false = tidak aktif
    table.timestamp("created_at").defaultTo(knex.fn.now()); // Tanggal dibuat
    table.timestamp("updated_at").defaultTo(knex.fn.now()); // Tanggal diperbarui
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("master_jenis_supplier");
}
