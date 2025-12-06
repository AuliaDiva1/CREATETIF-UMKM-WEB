/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) { 
  return knex.schema.createTable('transaksi_billing', (table) => {
    
    // --- Kunci Utama dan Metadata ---
    table.increments('BILLING_ID').primary(); 
    table.timestamps(true, true); 

    // --- Relasi ke Tabel Proyek Utama (Perbaikan Tipe Data) ---
    // HARUS MENGGUNAKAN bigInteger agar kompatibel dengan table.bigIncrements di transaksi_projek
    table.bigInteger('PROJEK_ID').unsigned().notNullable() 
      .references('PROJEK_ID').inTable('transaksi_projek').onDelete('CASCADE')
      .comment('Kunci asing dari tabel transaksi_projek');
    
    // --- Jenis Transaksi (PENTING) ---
    table.string('TIPE_TRANSAKSI', 50).notNullable()
      .comment('Jenis record: "INVOICE" atau "PAYMENT"'); 

    // --- Field Khusus untuk Tagihan ---
    table.string('NOMOR_INVOICE', 100).unique().nullable()
      .comment('Nomor tagihan/invoice (misal: INV-2025-001)');
    
    table.decimal('JUMLAH_TAGIHAN', 14, 2).nullable()
      .comment('Jumlah uang yang ditagihkan untuk termin ini');
      
    table.date('TANGGAL_JATUH_TEMPO').nullable()
      .comment('Tanggal terakhir pembayaran');
      
    table.string('STATUS_TAGIHAN', 50).nullable()
      .comment('Status tagihan: "Unpaid", "Paid", "Overdue"');

    // --- Field Khusus untuk Pembayaran ---
    table.decimal('JUMLAH_PEMBAYARAN', 14, 2).nullable()
      .comment('Jumlah uang yang masuk pada transaksi ini');
      
    table.string('METODE_PEMBAYARAN', 50).nullable()
      .comment('Metode pembayaran (misal: Bank Transfer, E-Wallet)');
      
    table.string('REF_TRANSAKSI', 100).unique().nullable()
      .comment('Nomor referensi dari bank atau penyedia pembayaran');

    // --- Keterangan Tambahan ---
    table.text('CATATAN').nullable()
      .comment('Catatan tambahan untuk transaksi atau tagihan ini');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) { 
  return knex.schema.dropTableIfExists('transaksi_billing');
};