import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import ProductCard from "../../components/ProductCard";
import SkeletonLoader from "../../components/SkeletonLoader";
import { ThreeDotsLoader } from "../../components/LoadingSpinner";

import { useProductStore } from "../../stores/useProductStore";
import { useCartStore } from "../../stores/useCartStore";
import EmptyCategoryPage from "./EmptyCategoryPage";

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
    fetchProductsByCategory(category, sortBy, 1, false);
  }, [category, sortBy]);

  const loadMore = () => {
    fetchProductsByCategory(category, sortBy, page + 1, true);
    setPage((p) => p + 1);
  };

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && !isFetchingCategory && page < totalPages) {
          loadMore();
        }
      },
      {
        rootMargin: "100px", // preload before reaching bottom
      },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [page, totalPages, isFetchingCategory]);

  const categoryName = category?.charAt(0).toUpperCase() + category?.slice(1);

  return (
    <div className="py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}

        <div className="mb-4">
          {/* Controls */}
          {categoryProducts.length > 0 && (
            <div className="flex flex-row justify-between items-center gap-1">
              <div>
                <span className="text-gray-700 text-sm md:text-xl font-semibold font-serif">
                  {categoryName} Collection
                </span>
              </div>
              <div className="relative flex flex-row appearance-none text-gray-700 text-sm md:text-base bg-white border border-gray-300 outline-none rounded-lg px-4 py-2 transition-all duration-200">
                <p>Sort: </p>
                <select
                  className="bg-transparent outline-none"
                  value={sortBy}
                  name="sort"
                  onChange={(e) => setSortBy(e.target.value)}>
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price Low to High</option>
                  <option value="price-high">Price High to Low</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {isInitialLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonLoader key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryProducts?.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                inCart={isInCart(product._id)}
              />
            ))}
          </div>
        )}
        {/* 👇 Infinite scroll trigger */}
        <div ref={loadMoreRef} className="h-10" />

        {isFetchingCategory && <ThreeDotsLoader height="10" color="#4b5563" />}
      </div>

      {!isFetchingCategory && categoryProducts.length === 0 && (
        <EmptyCategoryPage />
      )}
    </div>
  );
};

export default CategoryPage;
