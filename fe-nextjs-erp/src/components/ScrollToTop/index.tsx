import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Fungsi scroll ke atas
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      // Gunakan window.scrollY (lebih modern)
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-[999]">
      <button
        onClick={scrollToTop}
        aria-label="scroll to top"
        // Logika animasi ada di sini:
        className={`
          flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all duration-300 ease-in-out
          hover:bg-dark hover:scale-110 hover:shadow-xl
          ${
            isVisible
              ? "translate-y-0 opacity-100" // Jika visible: posisi normal, terlihat
              : "translate-y-10 opacity-0 pointer-events-none" // Jika hidden: geser ke bawah, transparan, tidak bisa diklik
          }
        `}
      >
        {/* Menggunakan SVG Icon Panah Atas yang lebih rapi */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 16.6667V3.33334"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3.33334 10L10 3.33334L16.6667 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}