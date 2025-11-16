/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("master_stok_supplier", (table) => {
    table.increments("id").primary();

    // --- KUNCI JOIN 1: Ke Tabel Supplier ---
    // (Merujuk ke 'kode_supplier' di 'transaksi_supplier')
    table.string("kode_supplier", 15).notNullable();
    table
      .foreign("kode_supplier")
      .references("kode_supplier")
      .inTable("transaksi_supplier")
      .onUpdate("CASCADE")
      .onDelete("CASCADE"); // Jika supplier dihapus, stoknya ikut hilang

    // --- KUNCI JOIN 2: Ke Tabel Barcode (Barang) ---
    // (Merujuk ke 'kode_barcode' di 'master_barcode')
    table.string("kode_barcode", 50).notNullable();
    table
      .foreign("kode_barcode")
      .references("kode_barcode")
      .inTable("master_barcode")
      .onUpdate("CASCADE")
      .onDelete("CASCADE"); // Jika barang dihapus, stoknya ikut hilang

    // --- Data untuk Menu Stok Supplier ---
    table.decimal("reorder_point", 10, 2).defaultTo(0); // Kolom REORDER
    table.decimal("sisa_stok", 10, 2).defaultTo(0); // Kolom SISA STOK
    
    // table.decimal("harga_beli_terakhir", 14, 2).nullable(); // <-- SUDAH DIHAPUS

    table.timestamps(true, true);

    // Index untuk mempercepat pencarian
    table.index("kode_supplier");
    table.index("kode_barcode");

    // Pastikan 1 supplier tidak bisa punya 2 baris untuk barang yang sama
    table.unique(["kode_supplier", "kode_barcode"]);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("master_stok_supplier");
}