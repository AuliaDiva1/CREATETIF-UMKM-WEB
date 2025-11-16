// src/app/services/page.tsx
import { Metadata } from "next";
import Breadcrumb from "@/components/Common/Breadcrumb";
import WebDevSection from "@/components/Services/WebDevSection";
import ArIntegrationSection from "@/components/Services/ArIntegrationSection";
import PhotoVideoSection from "@/components/Services/PhotoVideoSection";

export const metadata: Metadata = {
  title: "Layanan Kami | Create.tif",
  description: "Jelajahi berbagai layanan kreatif dan teknologi dari Create.tif, mulai dari pengembangan web, integrasi AR, hingga produksi foto dan video.",
};

const ServicesPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Layanan Kami"
        description="Kami menawarkan solusi digital inovatif yang dirancang untuk memperkuat kehadiran online dan meningkatkan interaksi audiens Anda."
      />

      <WebDevSection />
      <ArIntegrationSection />
      <PhotoVideoSection />
    </>
  );
};

export default ServicesPage;