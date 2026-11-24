import { Heart } from "lucide-react";
import { useEffect } from "react";

import { useCartStore } from "../../stores/useCartStore";
import { useWishlistStore } from "../../stores/useWishlistStore";

import PeopleAlsoBought from "../../components/PeopleAlsoBought";
import ProductCard from "../../components/ProductCard";
import SkeletonLoader from "../../components/SkeletonLoader";
import EmptyWishlistPage from "./EmptyWishlistPage";

const WishlistPage = () => {
  const { getWishlist, wishlist, isWishlistLoading } = useWishlistStore();
  const { isInCart } = useCartStore();

  useEffect(() => {
    getWishlist();
  }, [getWishlist]);

  if (!isWishlistLoading && wishlist.length === 0) {
    return <EmptyWishlistPage />;
  }

  return (
    <div className="min-h-[90vh] bg-gradient-to-b from-gray-50/70 to-white py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b border-gray-200/80">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              <Heart className="w-3.5 h-3.5" aria-hidden="true" />
              Saved Collection
            </span>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-1.5 tracking-tight">
              Your Wishlist
            </h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              Keep track of pieces you&apos;re planning to buy.
            </p>
          </div>

          {!isWishlistLoading && (
            <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-xs sm:text-sm font-medium text-gray-700 shadow-2xs">
              {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
            </span>
          )}
        </header>

        {/* Products Grid / Skeletons */}
        <section aria-label="Saved wishlist items">
          {isWishlistLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonLoader key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
              {wishlist.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  inCart={isInCart(product._id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* People Also Bought */}
        {!isWishlistLoading && wishlist.length > 0 && (
          <section className="mt-16 pt-10 border-t border-gray-100">
            <PeopleAlsoBought />
          </section>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
