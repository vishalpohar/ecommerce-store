import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCartStore } from "../stores/useCartStore";
import ProductCard from "./ProductCard";

const SWIPE_THRESHOLD = 50;

const FeaturedProducts = ({ featuredProducts = [] }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const { isInCart } = useCartStore();

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(2);
      else if (window.innerWidth < 1280) setItemsPerPage(3);
      else setItemsPerPage(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Group products into pages for smooth sliding
  const pages = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < featuredProducts.length; i += itemsPerPage) {
      chunks.push(featuredProducts.slice(i, i + itemsPerPage));
    }
    return chunks;
  }, [featuredProducts, itemsPerPage]);

  const totalPages = pages.length;
  const activePage = Math.min(currentPage, Math.max(0, totalPages - 1));

  const isStartDisabled = activePage === 0;
  const isEndDisabled = activePage >= totalPages - 1;

  const prevSlide = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const nextSlide = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  // Touch swipe handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    if (distance > SWIPE_THRESHOLD && !isEndDisabled) {
      nextSlide();
    } else if (distance < -SWIPE_THRESHOLD && !isStartDisabled) {
      prevSlide();
    }
  };

  // Keyboard support
  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight" && !isEndDisabled) nextSlide();
    if (e.key === "ArrowLeft" && !isStartDisabled) prevSlide();
  };

  if (featuredProducts.length === 0) return null;

  return (
    <section
      aria-labelledby="featured-heading"
      aria-roledescription="carousel"
      className="py-10 lg:py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 lg:mb-10">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
            Curated Selection
          </span>
          <h2
            id="featured-heading"
            className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-1.5 tracking-tight">
            Editor&apos;s Picks
          </h2>
          <p className="text-sm md:text-base text-gray-500 mt-1.5 max-w-xl">
            Carefully selected items that define this season&apos;s aesthetic.
          </p>
        </div>

        {/* Laptop / Desktop Controls */}
        {totalPages > 1 && (
          <div className="hidden sm:flex items-center gap-2 self-end">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous featured products"
              disabled={isStartDisabled}
              className={`p-2.5 rounded-full border transition-all duration-200 ${
                isStartDisabled
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-900 hover:text-gray-900 shadow-2xs"
              }`}>
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next featured products"
              disabled={isEndDisabled}
              className={`p-2.5 rounded-full border transition-all duration-200 ${
                isEndDisabled
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-900 hover:text-gray-900 shadow-2xs"
              }`}>
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {/* Swipeable Sliding Track */}
      <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="overflow-hidden touch-pan-y select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activePage * 100}%)` }}>
          {pages.map((pageItems, pageIndex) => (
            <div
              key={pageIndex}
              className="w-full shrink-0 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
              {pageItems.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  inCart={isInCart(product._id)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Indicators */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8">
          {pages.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`View featured products page ${index + 1}`}
              aria-current={index === activePage ? "true" : undefined}
              onClick={() => setCurrentPage(index)}
              className="p-2 flex items-center justify-center">
              <span
                className={`block rounded-full transition-all duration-300 ${
                  index === activePage
                    ? "bg-gray-900 w-7 h-2"
                    : "bg-gray-300 w-2 h-2 hover:bg-gray-400"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedProducts;
