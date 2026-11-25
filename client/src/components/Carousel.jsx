import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

const SLIDE_DURATION = 5000;
const SWIPE_THRESHOLD = 50;

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  // Pause when browser tab is hidden
  useEffect(() => {
    const handleVisibility = () => setIsPaused(document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Touch swipe handlers (Flipkart-style)
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    if (distance > SWIPE_THRESHOLD) {
      goToNext();
    } else if (distance < -SWIPE_THRESHOLD) {
      goToPrev();
    }
    setIsPaused(false);
  };

  // Keyboard support (Left / Right arrows)
  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "ArrowLeft") goToPrev();
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured Collections"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative h-[38vh] sm:h-[48vh] xl:h-[72vh] rounded-2xl lg:rounded-3xl overflow-hidden mx-3 md:mx-8 mt-4 shadow-sm bg-gray-900 select-none touch-pan-y focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
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
              draggable={false}
              className="w-full h-full object-cover"
              alt={slide.alt}
              width={1280}
              height={675}
            />

            {/* Editorial Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

            {/* Slide Content */}
            <div className="absolute inset-x-0 bottom-12 sm:bottom-16 px-6 sm:px-12 lg:px-16">
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

      {/* Progress Indicators */}
      <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex items-center bg-black/30 backdrop-blur-md rounded-full px-2.5 py-1">
        {SLIDES.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={slide.name}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}: ${slide.title}`}
              aria-current={isActive ? "true" : undefined}
              className="p-2 flex items-center justify-center">
              {isActive ? (
                <span className="relative block w-8 sm:w-10 h-1.5 rounded-full bg-white/30 overflow-hidden">
                  <span
                    key={currentIndex}
                    onAnimationEnd={goToNext}
                    style={{
                      animation: `carouselProgress ${SLIDE_DURATION}ms linear forwards`,
                      animationPlayState: isPaused ? "paused" : "running",
                    }}
                    className="absolute inset-0 bg-white rounded-full origin-left"
                  />
                </span>
              ) : (
                <span className="block w-1.5 h-1.5 rounded-full bg-white/50 hover:bg-white/80 transition-colors" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
