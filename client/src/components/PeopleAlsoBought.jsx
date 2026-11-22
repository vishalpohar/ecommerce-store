import { useEffect } from "react";
import ProductCard from "./ProductCard";
import LoadingSpinner from "./LoadingSpinner";
import { useCartStore } from "../stores/useCartStore";
import { TrendingUp } from "lucide-react";
import { useWishlistStore } from "../stores/useWishlistStore";
import { useProductStore } from "../stores/useProductStore";

const PeopleAlsoBought = () => {
  const {
    fetchRecommendations,
    recommendedProducts,
    isFetchingRecommendations,
  } = useProductStore();
  const { isInCart } = useCartStore();
  const { isInWishlist } = useWishlistStore();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  if (isFetchingRecommendations) return <LoadingSpinner />;

  if (recommendedProducts.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <TrendingUp className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">
            Frequently Bought Together
          </h3>
          <p className="text-gray-600 mt-1">
            Products customers often purchase together
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {recommendedProducts.map((product) => (
            <div
              key={product._id}
              className="min-w-[180px] md:min-w-[280px] max-w-[180px] md:max-w-[280px]">
              <ProductCard
                product={product}
                inCart={isInCart(product._id)}
                inWishlist={isInWishlist(product._id)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PeopleAlsoBought;
