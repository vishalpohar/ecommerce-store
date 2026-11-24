import { Handbag, Heart, Plus, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useWishlistStore } from "../stores/useWishlistStore";
import { formatPriceInRupees } from "../utils/formatCurrency";

const getOptimizedImage = (url, width = 450) => {
  if (!url || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width},c_limit/`);
};

const ProductCard = ({ product, inCart = false }) => {
  const { user } = useUserStore();
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlistStore();
  const navigate = useNavigate();

  const wishlisted = isInWishlist(product._id);

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    addToCart(product);
  };

  const handleWishlist = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (wishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const actualPrice = Math.round(product.price * 1.2);
  const hash = parseInt(product._id.slice(-6), 16) || 0;
  const rating = (4 + (hash % 11) / 10).toFixed(1);
  const reviewCount = 50 + (hash % 151);

  return (
    <article className="group relative flex flex-col h-full bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        <Link
          to={`/product-details/${product._id}`}
          className="block w-full h-full">
          <img
            src={getOptimizedImage(product.image, 450)}
            alt={product.name}
            loading="lazy"
            decoding="async"
            width={450}
            height={338}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        </Link>

        {/* Wishlist Button (Sibling to Link, not nested inside it) */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={
            wishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={wishlisted}
          className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-white/90 backdrop-blur-xs shadow-xs hover:bg-white hover:scale-105 transition-all duration-200">
          <Heart
            aria-hidden="true"
            className={`w-4 h-4 transition-colors duration-200 ${
              wishlisted
                ? "fill-red-500 text-red-500"
                : "text-gray-600 hover:text-gray-900"
            }`}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4">
        <Link to={`/product-details/${product._id}`} className="block flex-1">
          {product.category && (
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
              {product.category}
            </p>
          )}
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
            {product.name}
          </h3>
          <div className="inline-flex items-center gap-1 mt-1.5 text-xs text-gray-500">
            <Star
              className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
              aria-hidden="true"
            />
            <span className="font-medium text-gray-700">{rating}</span>
            <span>({reviewCount})</span>
          </div>
        </Link>

        {/* Price & Bag Action */}
        <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-gray-100">
          <div className="flex flex-wrap items-baseline gap-1.5 min-w-0">
            <p className="text-base sm:text-lg font-bold text-gray-900">
              {formatPriceInRupees(product.price)}
            </p>
            <p className="text-xs text-gray-400 line-through">
              {formatPriceInRupees(actualPrice)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => (inCart ? navigate("/cart") : handleAddToCart())}
            aria-label={
              inCart
                ? `View ${product.name} in bag`
                : `Add ${product.name} to bag`
            }
            className={`shrink-0 p-2 rounded-xl transition-all duration-200 flex items-center justify-center ${
              inCart
                ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                : "bg-gray-900 text-white hover:bg-blue-600"
            }`}>
            {inCart ? (
              <Handbag className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            ) : (
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
