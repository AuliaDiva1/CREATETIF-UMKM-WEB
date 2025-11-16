/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("master_rak", (table) => {
    table.increments("id_rak").primary(); // Column for Rak ID
    table.string("kode", 50).notNullable().unique(); // Column for Kode
    table.text("keterangan").nullable(); // Column for Keterangan (description)
    table.timestamp("created_at").defaultTo(knex.fn.now()); // Column for created_at
    table.timestamp("updated_at").defaultTo(knex.fn.now()); // Column for updated_at
  });
}

export async function down(knex) {
  return knex.schema.dropTableIfExists("master_rak");
}
