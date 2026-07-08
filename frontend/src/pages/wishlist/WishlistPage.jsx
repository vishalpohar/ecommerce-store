import { useEffect } from "react";

import { useWishlistStore } from "../../stores/useWishlistStore";
import { useCartStore } from "../../stores/useCartStore";

import ProductCard from "../../components/ProductCard";
import PeopleAlsoBought from "../../components/PeopleAlsoBought";
import SkeletonLoader from "../../components/SkeletonLoader";
import EmptyWishlistPage from "./EmptyWishlistPage";

const WishlistPage = () => {
  const { getWishlist, wishlist, isInWishlist, isWishlistLoading } =
    useWishlistStore();
  const { isInCart } = useCartStore();

  useEffect(() => {
    getWishlist();
  }, []);

  if (!isWishlistLoading && wishlist.length === 0) return <EmptyWishlistPage />;

  return (
    <div className="min-h[90vh] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isWishlistLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonLoader key={i} />
            ))}
          </div>
        ) : (
          <div>
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-700 mb-2">
                    Your Wishlist
                  </h1>
                  <p className="text-gray-600">
                    Keep track of products you're planning to buy
                  </p>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6">
              {wishlist?.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  inCart={isInCart(product._id)}
                  inWishlist={isInWishlist(product._id)}
                />
              ))}
            </div>

            {/* People Also Bought */}
            <div className="mt-12">
              <PeopleAlsoBought />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
