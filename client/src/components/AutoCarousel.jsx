import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SLIDES = [
  {
    name: "menShirts",
    alt: "Men Shirts Banner",
    eyebrow: "New Arrivals",
    title: "Tailored Shirts",
    subtitle: "Breathable fabrics designed for effortless everyday polish.",
    href: "/category/shirts",
  },
  {
    name: "menPants",
    alt: "Men Pants Banner",
    eyebrow: "Essential Fits",
    title: "Modern Trousers",
    subtitle: "Relaxed silhouettes and sharp cuts built for all-day comfort.",
    href: "/category/pants",
  },
  {
    name: "shoes",
    alt: "Shoes Banner",
    eyebrow: "Step Forward",
    title: "Signature Footwear",
    subtitle: "Minimalist craft paired with durable, everyday versatility.",
    href: "/category/shoes",
  },
];

export default function AutoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  useEffect(() => {
    const handleVisibility = () => {
      setIsPaused(document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div
      className="group relative h-[38vh] sm:h-[48vh] xl:h-[72vh] rounded-2xl lg:rounded-3xl overflow-hidden mx-3 md:mx-8 mt-4 shadow-sm bg-gray-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}>
      {/* Slides Track */}
      <div
        className="flex h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {SLIDES.map((slide, index) => (
          <div key={slide.name} className="relative w-full h-full shrink-0">
            <img
              src={`/banners/${slide.name}-1280.avif`}
              srcSet={`/banners/${slide.name}-640.avif 640w, /banners/${slide.name}-1280.avif 1280w`}
              sizes="(max-width: 768px) 100vw, 1280px"
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              decoding={index === 0 ? "sync" : "async"}
              className="w-full h-full object-cover"
              alt={slide.alt}
              width={1280}
              height={675}
            />

            {/* Editorial Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

            {/* Slide Content */}
            <div className="absolute inset-x-0 bottom-10 sm:bottom-14 px-6 sm:px-12 lg:px-16">
              <div
                className={`max-w-xl transition-all duration-700 ${
                  index === currentIndex
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}>
                <span className="inline-block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-white/80 mb-2">
                  {slide.eyebrow}
                </span>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight">
                  {slide.title}
                </h2>
                <p className="hidden sm:block text-sm lg:text-base text-white/85 mt-2.5 max-w-md">
                  {slide.subtitle}
                </p>
                <Link
                  to={slide.href}
                  className="inline-flex items-center gap-2 mt-4 sm:mt-6 px-5 py-2.5 rounded-full bg-white text-gray-900 text-xs sm:text-sm font-semibold hover:bg-gray-100 transition-transform duration-200 hover:scale-105">
                  Shop Now
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prev / Next Controls */}
      <button
        type="button"
        onClick={handlePrevious}
        aria-label="Previous Slide"
        className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/90 text-white hover:text-gray-900 rounded-full p-2 sm:p-2.5 backdrop-blur-md transition-all duration-300 lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100">
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={handleNext}
        aria-label="Next Slide"
        className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/90 text-white hover:text-gray-900 rounded-full p-2 sm:p-2.5 backdrop-blur-md transition-all duration-300 lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100">
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
      </button>

      {/* Indicators (Inside Banner, 24px+ touch targets) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center bg-black/25 backdrop-blur-md rounded-full px-2 py-0.5">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.name}
            type="button"
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex ? "true" : undefined}
            className="p-2 flex items-center justify-center">
            <span
              className={`block rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white w-6 h-1.5"
                  : "bg-white/50 w-1.5 h-1.5 hover:bg-white/80"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
