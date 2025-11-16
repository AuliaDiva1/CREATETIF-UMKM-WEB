import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact"; // Menggunakan komponen Kontak yang sama dengan Homepage

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hubungi Kami | Create.tif",
  description: "Hubungi tim Create.tif untuk konsultasi gratis kebutuhan website, AR, atau foto produk Anda.",
  // other metadata
};

const ContactPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Hubungi Kami"
        description="Punya ide brilian? Atau masih bingung mau mulai dari mana? Tim kami siap membantu. Konsultasi gratis, tanpa kewajiban."
      />

      <Contact />
    </>
  );
};

export default ContactPage;