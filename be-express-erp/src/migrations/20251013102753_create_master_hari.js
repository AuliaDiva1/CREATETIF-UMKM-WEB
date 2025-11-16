/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("master_hari", (table) => {
    table.increments("HARI_ID").primary();
    table.string("NAMA_HARI", 20).notNullable().unique(); // Senin, Selasa, dll
    table.integer("URUTAN").notNullable(); // 1 = Senin, 2 = Selasa, dst
    table.enu("STATUS", ["Aktif", "Tidak Aktif"]).defaultTo("Aktif");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  return knex.schema.dropTableIfExists("master_hari");
}
