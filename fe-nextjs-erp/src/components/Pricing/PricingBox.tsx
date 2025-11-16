import Link from "next/link";

const PricingBox = ({
  packageName,
  price,
  duration,
  subtitle,
  children,
}: {
  packageName: string;
  price: string;
  duration: string;
  subtitle: string;
  children: React.ReactNode;
}) => {
  
  // 1. Nomor WhatsApp kamu (Format 628...)
  const phoneNumber = "6285607910959";

  // 2. Fungsi untuk membuat pesan otomatis berdasarkan nama paket
  const generateMessage = () => {
    let message = "";

    if (packageName === "Starter Foto") {
      message = "Halo Create.tif! Saya tertarik dengan paket *Starter Foto (149rb)*. Boleh tanya detail cara ordernya?";
    } else if (packageName === "Web Landing Page") {
      message = "Halo Create.tif! Saya mau konsultasi untuk pembuatan *Web Landing Page (499rb)*. Mohon infonya.";
    } else if (packageName === "Paket Viral") {
      message = "Halo Admin! Saya mau ambil promo *Paket Viral (999rb)* (Web + Foto). Tolong dibantu prosesnya ya.";
    } else {
      // Pesan default jaga-jaga
      message = `Halo Create.tif! Saya tertarik dengan paket *${packageName}*. Boleh minta info lebih lanjut?`;
    }

    // Mengubah teks menjadi format link WA
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="w-full">
      <div
        className="dark:bg-dark hover:shadow-two dark:hover:shadow-gray-dark relative z-10 overflow-hidden rounded-xl bg-white px-8 py-10 shadow-three duration-300 sm:p-12 lg:px-6 lg:py-10 xl:p-12"
        data-wow-delay=".1s"
      >
        <span className="text-dark mb-4 block text-lg font-semibold dark:text-white">
          {packageName}
        </span>
        <h2 className="text-dark mb-5 text-[42px] font-bold dark:text-white">
          {price}
          <span className="text-body-color text-base font-medium">
            / {duration}
          </span>
        </h2>
        <p className="text-body-color mb-8 border-b border-body-color border-opacity-10 pb-8 dark:border-white dark:border-opacity-10">
          {subtitle}
        </p>
        <div className="mb-7">
          {children}
        </div>
        
        {/* TOMBOL WA DI SINI */}
        <Link
          href={generateMessage()} // Link otomatis ke WA
          target="_blank" // Membuka di tab baru
          className="bg-primary hover:bg-primary/90 flex w-full items-center justify-center rounded-md p-3 text-base font-semibold text-white transition duration-300 ease-in-out"
        >
          Pesan Sekarang
        </Link>
        
        <div className="absolute bottom-0 right-0 z-[-1]">
          <svg
            width="179"
            height="158"
            viewBox="0 0 179 158"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.5"
              d="M75.0002 63.256C115.229 82.3657 136.011 137.496 141.374 162.673C150.063 203.47 207.217 200.464 179.402 136.343C151.587 72.2229 109.131 4.45282 19.3646 74.8858L75.0002 63.256Z"
              fill="url(#paint0_linear_70:153)"
            />
            <path
              opacity="0.3"
              d="M65.1309 55.1183C100.15 71.6256 116.418 120.093 119.834 142.773C125.369 179.536 175.602 179.64 154.413 123.295C133.225 66.9499 98.7593 6.48158 18.8302 66.597L65.1309 55.1183Z"
              fill="url(#paint1_linear_70:153)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_70:153"
                x1="69.6694"
                y1="22.9032"
                x2="213.702"
                y2="165.229"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0.62" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_70:153"
                x1="57.7433"
                y1="17.7597"
                x2="176.74"
                y2="145.415"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0.62" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default PricingBox;