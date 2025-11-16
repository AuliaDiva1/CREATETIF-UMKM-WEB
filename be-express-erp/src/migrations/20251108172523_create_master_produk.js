/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // Membuat satu tabel 'master_produk'
  return knex.schema.createTable("master_produk", (table) => {
    table.bigIncrements("id_produk").primary();

    // --- Dari Tab "Detail Item" ---
    table.string("kode_produk").notNullable().unique();
    table.string("nama_produk").notNullable();

    // 🔽🔽 PERBAIKAN 1: Mengganti 'barcode' string menjadi 'kode_barcode' FK 🔽🔽
    table.string("kode_barcode", 50).nullable(); // <-- INI YANG BARU
    // 🔼🔼 ------------------------------------------------------------- 🔼🔼

    table.enum("jenis", ["Barang", "Jasa"]).defaultTo("Barang");

    table.string("kode_kategori", 50).nullable();
    table.string("kode_gudang", 50).nullable();
    table.string("kode_rak", 50).nullable();
    table.string("kode_supplier", 15).nullable();

    table.date("tanggal_kadaluarsa").nullable();
    table.boolean("punya_kadaluarsa").defaultTo(false);
    table.decimal("berat", 10, 2).nullable().defaultTo(0);

    // --- Dari Tab "Harga" (Harga Umum) ---
    table.decimal("diskon", 5, 2).defaultTo(0);
    table.boolean("kena_pajak").defaultTo(false);

    // --- Dari Tab "Satuan" & "Harga" (Level 1) ---
    table.string("kode_satuan_1", 50).nullable();
    table.decimal("konversi_1", 10, 2).defaultTo(1);
    table.decimal("stok_awal_1", 15, 2).defaultTo(0);
    table.decimal("min_stock_1", 15, 2).defaultTo(0);
    table.decimal("max_stock_1", 15, 2).defaultTo(0);
    table.decimal("harga_beli_1", 19, 4).defaultTo(0);
    table.decimal("harga_jual_1", 19, 4).defaultTo(0);

    // --- Dari Tab "Satuan" & "Harga" (Level 2) ---
    table.string("kode_satuan_2", 50).nullable();
    table.decimal("konversi_2", 10, 2).nullable();
    table.decimal("stok_awal_2", 15, 2).nullable();
    table.decimal("min_stock_2", 15, 2).nullable();
    table.decimal("max_stock_2", 15, 2).nullable();
    table.decimal("harga_beli_2", 19, 4).nullable();
    table.decimal("harga_jual_2", 19, 4).nullable();

    // --- Dari Tab "Satuan" & "Harga" (Level 3) ---
    table.string("kode_satuan_3", 50).nullable();
    table.decimal("konversi_3", 10, 2).nullable();
    table.decimal("stok_awal_3", 15, 2).nullable();
    table.decimal("min_stock_3", 15, 2).nullable();
    table.decimal("max_stock_3", 15, 2).nullable();
    table.decimal("harga_beli_3", 19, 4).nullable();
    table.decimal("harga_jual_3", 19, 4).nullable();

    // --- Dari Tab "Gambar" (PATH FILE) ---
    table.string("file_gambar_1").nullable();
    table.string("file_gambar_2").nullable();
    table.string("file_gambar_3").nullable();

    // --- Timestamps ---
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    // --- Definisi Foreign Key Constraints ---
    table
      .foreign("kode_kategori")
      .references("kode_barang")
      .inTable("master_kategori_barang");
    table.foreign("kode_gudang").references("kode").inTable("master_gudang");
    table.foreign("kode_rak").references("kode").inTable("master_rak");
    table
      .foreign("kode_supplier")
      .references("kode_supplier")
      .inTable("transaksi_supplier");
    table
      .foreign("kode_satuan_1")
      .references("kode")
      .inTable("master_satuan_barang");
    table
      .foreign("kode_satuan_2")
      .references("kode")
      .inTable("master_satuan_barang");
    table
      .foreign("kode_satuan_3")
      .references("kode")
      .inTable("master_satuan_barang");

    // 🔽🔽 PERBAIKAN 2: Menambahkan constraint untuk 'kode_barcode' 🔽🔽
    table
      .foreign("kode_barcode")
      .references("kode_barcode")
      .inTable("master_barcode");
    // 🔼🔼 -------------------------------------------------------- 🔼🔼
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("master_produk");
}