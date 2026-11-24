import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useCartStore } from "../stores/useCartStore";
import ProductCard from "./ProductCard";

const FeaturedProducts = ({ featuredProducts = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const { isInCart } = useCartStore();

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

  const maxIndex = Math.max(0, featuredProducts.length - itemsPerPage);
  const totalPages = Math.ceil(featuredProducts.length / itemsPerPage);
  const activePage = Math.ceil(currentIndex / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + itemsPerPage, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - itemsPerPage, 0));
  };

  const isStartDisabled = currentIndex === 0;
  const isEndDisabled = currentIndex >= maxIndex;

  const visibleProducts = featuredProducts.slice(
    currentIndex,
    currentIndex + itemsPerPage,
  );

  return (
    <section aria-labelledby="featured-heading" className="py-10 lg:py-16">
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

        {/* Desktop Carousel Controls */}
        {featuredProducts.length > itemsPerPage && (
          <div className="flex items-center gap-2 self-end">
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

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
        {visibleProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            inCart={isInCart(product._id)}
          />
        ))}
      </div>

      {/* Pagination Indicators (24px+ accessible touch targets) */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`View featured products page ${index + 1}`}
              aria-current={index === activePage ? "true" : undefined}
              onClick={() => setCurrentIndex(index * itemsPerPage)}
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
