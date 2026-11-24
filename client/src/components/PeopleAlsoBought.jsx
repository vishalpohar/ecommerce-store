import { TrendingUp } from "lucide-react";
import { useEffect } from "react";
import { useCartStore } from "../stores/useCartStore";
import { useProductStore } from "../stores/useProductStore";
import ProductCard from "./ProductCard";
import SkeletonLoader from "./SkeletonLoader";

const PeopleAlsoBought = () => {
  const {
    fetchRecommendations,
    recommendedProducts,
    isFetchingRecommendations,
  } = useProductStore();
  const { isInCart } = useCartStore();

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  if (!isFetchingRecommendations && recommendedProducts.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="recommendations-heading">
      {/* Header */}
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
          <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
          Recommended for You
        </span>
        <h2
          id="recommendations-heading"
          className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mt-1 tracking-tight">
          Frequently Bought Together
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Pieces customers often pair with items in their bag.
        </p>
      </div>

      {/* Horizontal Snap Rail on Mobile / Clean Grid on Desktop */}
      <div className="flex lg:grid lg:grid-cols-4 gap-3 sm:gap-5 overflow-x-auto lg:overflow-visible pb-2 snap-x snap-mandatory">
        {isFetchingRecommendations
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="w-[200px] sm:w-[240px] lg:w-auto shrink-0 snap-start">
                <SkeletonLoader />
              </div>
            ))
          : recommendedProducts.map((product) => (
              <div
                key={product._id}
                className="w-[200px] sm:w-[240px] lg:w-auto shrink-0 snap-start">
                <ProductCard product={product} inCart={isInCart(product._id)} />
              </div>
            ))}
      </div>
    </section>
  );
};

export default PeopleAlsoBought;
