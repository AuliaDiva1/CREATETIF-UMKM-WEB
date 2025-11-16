/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("master_satuan_barang", (table) => {
    table.increments("id_satuan").primary();              
    table.string("kode", 50).notNullable().unique();      
    table.string("satuan_barang", 50).notNullable().unique(); 
    table.string("keterangan", 255).nullable();           


    table.enu("status", ["Aktif", "Tidak Aktif"]).defaultTo("Aktif");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  return knex.schema.dropTableIfExists("master_satuan_barang");
}
