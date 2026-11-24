import { Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { ThreeDotsLoader } from "../../components/LoadingSpinner";
import ProductCard from "../../components/ProductCard";
import SkeletonLoader from "../../components/SkeletonLoader";
import SortDropdown from "../../components/ui/SortDropdown";

import { useCartStore } from "../../stores/useCartStore";
import { useProductStore } from "../../stores/useProductStore";
import EmptyCategoryPage from "./EmptyCategoryPage";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

const CategoryPage = () => {
  const {
    fetchProductsByCategory,
    categoryProducts,
    totalPages,
    isFetchingCategory,
  } = useProductStore();
  const { isInCart } = useCartStore();

  const { category } = useParams();

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");

  const loadMoreRef = useRef(null);

  const isInitialLoading = isFetchingCategory && categoryProducts.length === 0;

  useEffect(() => {
    setPage(1);
    fetchProductsByCategory(category, sortBy, 1, false);
  }, [category, sortBy, fetchProductsByCategory]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isFetchingCategory &&
          page < totalPages
        ) {
          const nextPage = page + 1;
          fetchProductsByCategory(category, sortBy, nextPage, true);
          setPage(nextPage);
        }
      },
      { rootMargin: "120px" },
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [
    page,
    totalPages,
    isFetchingCategory,
    category,
    sortBy,
    fetchProductsByCategory,
  ]);

  if (!isFetchingCategory && categoryProducts.length === 0) {
    return <EmptyCategoryPage />;
  }

  const categoryName = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "Featured";

  return (
    <div className="min-h-[90vh] bg-gradient-to-b from-gray-50/70 to-white py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b border-gray-200/80">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              Collection
            </span>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-1.5 tracking-tight">
              {categoryName} Collection
            </h1>
          </div>

          <SortDropdown
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={setSortBy}
          />
        </header>

        {/* Products Grid */}
        <section aria-label={`${categoryName} products`}>
          {isInitialLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonLoader key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
              {categoryProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  inCart={isInCart(product._id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Infinite scroll trigger */}
        <div ref={loadMoreRef} className="h-10" />

        {isFetchingCategory && !isInitialLoading && (
          <div className="flex justify-center py-4">
            <ThreeDotsLoader height="10" color="#4b5563" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
