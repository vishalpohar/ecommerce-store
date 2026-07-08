import { ArrowRight, Eye, Handbag, Heart, Plus, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { formatPriceInRupees } from "../utils/formatCurrency";
import { useWishlistStore } from "../stores/useWishlistStore";

const ProductCard = ({ product, inCart = false, inWishlist = false }) => {
  const { user } = useUserStore();
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlistStore();
  const navigate = useNavigate();

  inWishlist = isInWishlist(product._id);

  const handleAddToCart = (product) => {
    if (!user) {
      navigate("/login");
      return;
    }
    addToCart(product);
  };

  const handleWishlist = (product) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (inWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const actualPrice = Math.round(product.price + product.price * 0.2);

  const hash = parseInt(product._id.slice(-6), 16);

  const rating = (4 + (hash % 11) / 10).toFixed(1);
  const reviewCount = 50 + (hash % 151);

  return (
    <div className="relative group bg-white shadow-sm border border-gray-100 md:hover:shadow-2xl md:hover:-translate-y-4 transition-all duration-500">
      <div className="animate-fadeSlideUp">
        {/* Product Image */}
        <Link
          className="relative block bg-gray-50"
          to={`/product-details/${product._id}`}
          aria-label="Open Product">
          <img
            className="w-full h-48 object-cover"
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

          <div className="absolute top-2 right-2">
            <button
              className="bg-white p-2 rounded-full"
              aria-label="Wishlist"
              onClick={(e) => {
                e.preventDefault();
                handleWishlist(product);
              }}>
              <Heart
                className={`w-5 h-5 transition-all duration-300
              ${inWishlist ? "fill-red-500 text-red-500" : "text-gray-600"}`}
              />
            </button>
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-2 lg:p-6">
          <Link
            to={`/product-details/${product._id}`}
            aria-label="Open Product">
            <h3 className="text-sm lg:text-base font-semibold text-gray-900 line-clamp-2 transition-colors duration-300 leading-tight">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span className="text-sm font-medium text-gray-600">
                {rating} ({reviewCount})
              </span>
            </div>
          </Link>

          <div className="flex items-center justify-between pb-2 mt-2">
            <div className="flex items-center gap-2">
              <p className="text-base lg:text-xl font-bold text-gray-900">
                {formatPriceInRupees(product.price)}
              </p>
              <p className="text-xs lg:text-base text-gray-500 line-through">
                {formatPriceInRupees(actualPrice)}
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={() =>
                inCart ? navigate("/cart") : handleAddToCart(product)
              }
              aria-label="Bag"
              className={`relative overflow-hidden font-semibold transition-all duration-300 flex items-center justify-center shadow-sm group ${
                inCart
                  ? "text-blue-600"
                  : "border border-gray-900 text-gray-900 rounded"
              }`}>
              {inCart ? (
                <div className="flex justify-center items-center p-2">
                  <Handbag className="w-5 h-5 md:w-7 md:h-7" />
                </div>
              ) : (
                <div className="flex justify-center items-center p-1">
                  <Plus className="w-3 h-3 md:w-5 md:h-5" />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
