/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // Membuat tabel 'master_bahan_baku'
  return knex.schema.createTable("master_bahan_baku", (table) => {
    table.bigIncrements("id").primary();
    
    // 1. KODE PRODUK (Wajib Unik)
    table.string("kode", 50).notNullable().unique(); 
    
    // 2. BARCODE (FK ke master_barcode)
    table.string("kode_barcode", 50).nullable().unique(); 
    
    // 3. NAMA PRODUK
    table.string("nama_produk").notNullable();
    
    // 4. JENIS (Radio Button)
    table.enum("jenis", ["Barang", "Jasa"]).defaultTo("Barang");
    
    // 5. KATEGORI, RAK, GUDANG, SATUAN (Foreign Keys)
    table.string("kode_kategori", 50).nullable(); 
    table.string("kode_rak", 50).nullable();
    table.string("kode_gudang", 50).nullable();
    // Kolom ini nullable karena menggunakan onDelete("SET NULL")
    table.string("kode_satuan", 50).nullable(); 
    
    // 6. TANGGAL KADALUARSA & BERAT
    table.date("tanggal_kadaluarsa").nullable();
    table.decimal("berat", 10, 2).nullable().defaultTo(0);
    
    // 7. STOK AWAL
    table.decimal("stok_awal", 15, 2).defaultTo(0);
    
    // 8. HARGA BELI & JUAL
    table.decimal("harga_beli", 19, 4).defaultTo(0);
    table.decimal("harga_jual", 19, 4).defaultTo(0);
    
    // 9. GAMBAR
    table.string("path_gambar").nullable();

    // Timestamps
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    // --- Definisi Foreign Key Constraints ---
    
    // FK: BARCODE (Diasumsikan master_barcode memiliki kolom kode_barcode)
    table.foreign("kode_barcode").references("kode_barcode").inTable("master_barcode")
             .onDelete("SET NULL").onUpdate("CASCADE");
             
    // FK: KATEGORI/GOLONGAN (master_kategori_barang.kode_barang)
    table.foreign("kode_kategori").references("kode_barang").inTable("master_kategori_barang")
             .onDelete("SET NULL").onUpdate("CASCADE");
             
    // FK: RAK (master_rak.kode)
    table.foreign("kode_rak").references("kode").inTable("master_rak")
             .onDelete("SET NULL").onUpdate("CASCADE");
             
    // FK: GUDANG (master_gudang.kode)
    table.foreign("kode_gudang").references("kode").inTable("master_gudang")
             .onDelete("SET NULL").onUpdate("CASCADE");
             
    // FK: SATUAN (master_satuan_barang.id_satuan)
    // PERBAIKAN FINAL: Menunjuk ke 'id_satuan' di tabel master satuan
    table.foreign("kode_satuan").references("kode").inTable("master_satuan_barang") 
             .onDelete("SET NULL").onUpdate("CASCADE");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("master_bahan_baku");
}