/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("master_gudang", (table) => {
    table.increments("id_gudang").primary();
    table.string("kode", 50).notNullable().unique(); // Column for Kode
    table.text("keterangan").nullable(); // Column for Keterangan (description)
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  return knex.schema.dropTableIfExists("master_gudang");
}
