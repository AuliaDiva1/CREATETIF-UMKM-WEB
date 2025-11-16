"use client"; // Wajib ada karena kita pakai interaksi (useState)
import { useState } from "react";
import NewsLatterBox from "./NewsLatterBox";

const Contact = () => {
  // 1. State untuk menyimpan data yang diketik
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // 2. Fungsi untuk menangani perubahan ketikan
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 3. Fungsi saat tombol KIRIM diklik
  const handleSubmit = (e: any) => {
    e.preventDefault(); // Mencegah halaman refresh

    // Nomor WhatsApp Admin (Ganti dengan nomormu)
    const phoneNumber = "6285607910959";

    // Format pesan yang akan dikirim ke WA
    const textMessage = `
Halo Admin Create.tif! 👋

Saya ingin konsultasi lewat website.
Berikut data saya:

👤 Nama: ${formData.name}
📧 Email: ${formData.email}
📝 Pesan: ${formData.message}

Mohon dibantu ya. Terima kasih!
    `;

    // Membuka WhatsApp
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(textMessage)}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <section id="contact" className="overflow-hidden py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          {/* Kolom Kiri: Form Kontak */}
          <div className="w-full px-4 lg:w-7/12 xl:w-8/12">
            <div
              className="mb-12 rounded-xl bg-white px-8 py-11 shadow-three dark:bg-gray-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
              data-wow-delay=".15s"
            >
              <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                Siap Mulai Proyek Anda?
              </h2>
              <p className="mb-12 text-base font-medium text-body-color">
                Tim kami siap membantu mewujudkan ide Anda. Isi form di bawah ini
                untuk mendapatkan konsultasi gratis.
              </p>
              
              {/* Tambahkan onSubmit di sini */}
              <form onSubmit={handleSubmit}>
                <div className="-mx-4 flex flex-wrap">
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="name"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Nama Anda
                      </label>
                      <input
                        name="name" // Wajib ada name
                        value={formData.name} // Wajib ada value
                        onChange={handleChange} // Wajib ada onChange
                        type="text"
                        placeholder="Masukan nama lengkap Anda"
                        className="border-stroke w-full rounded-md border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        required
                      />
                    </div>
                  </div>
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="email"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Email Anda
                      </label>
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        type="email"
                        placeholder="Masukan alamat email"
                        className="border-stroke w-full rounded-md border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        required
                      />
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <div className="mb-8">
                      <label
                        htmlFor="message"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Ceritakan Kebutuhan Anda
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Cth: Halo, saya butuh website untuk jualan kopi dan 5 foto produk."
                        className="border-stroke w-full resize-none rounded-md border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        required
                      ></textarea>
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <button 
                      type="submit"
                      className="rounded-md bg-primary px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark"
                    >
                      Kirim Pesan
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          
          {/* Kolom Kanan: Newsletter */}
          <div className="w-full px-4 lg:w-5/12 xl:w-4/12">
            <NewsLatterBox />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;