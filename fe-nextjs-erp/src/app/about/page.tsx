import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami | Create.tif",
  description: "Halaman profil dan informasi tentang Create.tif",
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Tentang Kami"
        description="Kami adalah mitra kreatif yang berdedikasi untuk mengubah ide Anda menjadi realitas digital. Pelajari lebih lanjut tentang visi, misi, dan tim kami di sini."
      />
      <AboutSectionOne />
      <AboutSectionTwo />
    </>
  );
};

export default AboutPage;