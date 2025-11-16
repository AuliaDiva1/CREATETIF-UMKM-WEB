/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("master_kategori_barang", (table) => {
    table.increments("id_kategori").primary();  // ID for the category (Primary Key)
    table.string("kode_barang", 50).notNullable();  // Foreign Key to master_kodebarang (kode_barang)

    // Foreign key constraint to kode_barang in master_kodebarang
    table.foreign("kode_barang").references("kode_barang").inTable("master_kodebarang").onDelete("CASCADE"); 

    table.string("kategori_barang", 50).notNullable();  // Category name (e.g., Elektronik, Kayu, etc.)
    
    // Adding the status field with values "Aktif" and "Tidak Aktif"
    table.enu("status", ["Aktif", "Tidak Aktif"]).defaultTo("Aktif");  // Default is "Aktif"

    // Adding the keterangan (description) field
    table.string("keterangan", 255).nullable();  // Description for the category

    table.timestamp("created_at").defaultTo(knex.fn.now());  // Timestamp for creation
    table.timestamp("updated_at").defaultTo(knex.fn.now());  // Timestamp for updates
  });
}

export async function down(knex) {
  return knex.schema.dropTableIfExists("master_kategori_barang");
}
