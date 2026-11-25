import {
  ArrowRight,
  ChevronRight,
  Clock,
  Handbag,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";

import PeopleAlsoBought from "../components/PeopleAlsoBought";
import { useCartStore } from "../stores/useCartStore";
import { useProductStore } from "../stores/useProductStore";
import { useUserStore } from "../stores/useUserStore";
import { useWishlistStore } from "../stores/useWishlistStore";
import { formatPriceInRupees } from "../utils/formatCurrency";
import { hasMultipleSizes } from "../utils/sizeOptions";

const getOptimizedImage = (url, width = 900) => {
  if (!url || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width},c_limit/`);
};

const TRUST_BADGES = [
  {
    icon: Truck,
    title: "Free Shipping",
    subtitle: "Orders over ₹999",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    icon: ShieldCheck,
    title: "Quality Assured",
    subtitle: "Authentic products",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    subtitle: "Always here to help",
    color: "text-amber-600 bg-amber-50",
  },
];

const ProductDetailsSkeleton = () => (
  <div
    aria-hidden="true"
    className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 sm:p-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <div className="aspect-square w-full shimmer rounded-2xl" />
      <div className="space-y-5 py-2">
        <div className="h-4 w-24 shimmer rounded-md" />
        <div className="h-9 w-5/6 shimmer rounded-md" />
        <div className="h-5 w-40 shimmer rounded-md" />
        <div className="h-10 w-48 shimmer rounded-md" />
        <div className="space-y-2.5 pt-4">
          <div className="h-4 w-full shimmer rounded-md" />
          <div className="h-4 w-5/6 shimmer rounded-md" />
          <div className="h-4 w-2/3 shimmer rounded-md" />
        </div>
        <div className="flex gap-3 pt-4">
          <div className="h-13 flex-1 shimmer rounded-xl" />
          <div className="h-13 flex-1 shimmer rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

const ProductDetailsPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const { user } = useUserStore();
  const { fetchProductById, product, isFetchingProduct } = useProductStore();
  const { cart, addToCart, updateSize, isInCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlistStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeError, setSizeError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const inCart = isInCart(productId);
  const cartItem = cart.find((item) => item._id === productId);
  const inWishlist = isInWishlist(productId);

  const isLoading = isFetchingProduct || !product || product._id !== productId;
  const showSizeSelector = !isLoading && hasMultipleSizes(product.sizes);

  useEffect(() => {
    if (productId) {
      setQuantity(1);
      setSelectedSize("");
      setSizeError(false);
      setIsExpanded(false);
      fetchProductById(productId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [productId, fetchProductById]);

  // Sync default size once product loads
  useEffect(() => {
    if (!product || product._id !== productId) return;

    if (!hasMultipleSizes(product.sizes)) {
      setSelectedSize(product.sizes?.[0] || "One Size");
    } else if (cartItem?.size) {
      setSelectedSize(cartItem.size);
    } else {
      setSelectedSize("");
    }
    setSizeError(false);
  }, [product, productId, cartItem?.size]);

  const validateSize = () => {
    if (showSizeSelector && !selectedSize) {
      setSizeError(true);
      toast.error("Please select a size");
      return false;
    }
    return true;
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setSizeError(false);
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!validateSize()) return;

    addToCart({
      ...product,
      quantity,
      size: selectedSize || "One Size",
    });
  };

  const handleUpdateCartSize = async () => {
    if (!validateSize()) return;
    await updateSize(product._id, selectedSize);
    toast.success(`Updated size to ${selectedSize}`);
  };

  const handleWishlist = () => {
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

  const handleBuyNow = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!validateSize()) return;

    navigate("/checkout", {
      state: {
        source: "buy-now",
        productId: product._id,
        quantity,
        size: selectedSize || "One Size",
      },
    });
  };

  const hasChangedCartSize =
    inCart &&
    showSizeSelector &&
    selectedSize &&
    selectedSize !== cartItem?.size;

  const originalPrice = product ? Math.round(product.price * 1.2) : 0;
  const hash = product?._id ? parseInt(product._id.slice(-6), 16) || 0 : 0;
  const rating = (4 + (hash % 11) / 10).toFixed(1);
  const reviewCount = 50 + (hash % 151);

  const description = product?.description || "";
  const isLongDescription = description.length > 180;
  const visibleDescription =
    isExpanded || !isLongDescription
      ? description
      : `${description.slice(0, 180).trim()}...`;

  return (
    <div className="min-h-[90vh] bg-gradient-to-b from-gray-50/70 to-white py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        {!isLoading && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-gray-500">
              <li>
                <Link to="/" className="hover:text-gray-900 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </li>
              <li>
                <Link
                  to={`/category/${product.category}`}
                  className="hover:text-gray-900 transition-colors capitalize">
                  {product.category}
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </li>
              <li
                aria-current="page"
                className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-xs">
                {product.name}
              </li>
            </ol>
          </nav>
        )}

        {/* Main Product Card */}
        {isLoading ? (
          <ProductDetailsSkeleton />
        ) : (
          <article className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden p-5 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Left: Product Image */}
              <div className="relative aspect-square rounded-2xl bg-gray-100 border border-gray-100 overflow-hidden group">
                <img
                  src={getOptimizedImage(product.image, 900)}
                  alt={product.name}
                  loading="eager"
                  fetchPriority="high"
                  decoding="sync"
                  width={900}
                  height={900}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Wishlist Toggle */}
                <button
                  type="button"
                  onClick={handleWishlist}
                  aria-label={
                    inWishlist
                      ? `Remove ${product.name} from wishlist`
                      : `Add ${product.name} to wishlist`
                  }
                  aria-pressed={inWishlist}
                  className="absolute top-4 right-4 p-2.5 sm:p-3 rounded-full bg-white/90 backdrop-blur-xs shadow-sm hover:bg-white hover:scale-105 transition-all duration-200">
                  <Heart
                    aria-hidden="true"
                    className={`w-5 h-5 transition-colors duration-200 ${
                      inWishlist
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  />
                </button>
              </div>

              {/* Right: Product Info */}
              <div className="flex flex-col space-y-6">
                {/* Category, Title & Rating */}
                <div>
                  <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 mb-2">
                    {product.category}
                  </span>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-gray-900 tracking-tight leading-snug">
                    {product.name}
                  </h1>

                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <div className="inline-flex items-center gap-1.5 text-sm">
                      <Star
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                        aria-hidden="true"
                      />
                      <span className="font-semibold text-gray-900">
                        {rating}
                      </span>
                      <span className="text-gray-500">
                        ({reviewCount} reviews)
                      </span>
                    </div>

                    <span className="text-gray-300" aria-hidden="true">
                      •
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                        aria-hidden="true"
                      />
                      In Stock
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex flex-wrap items-baseline gap-3 pb-6 border-b border-gray-100">
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900 tabular-nums">
                    {formatPriceInRupees(product.price)}
                  </span>
                  <span className="text-base sm:text-lg text-gray-400 line-through tabular-nums">
                    {formatPriceInRupees(originalPrice)}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                    20% OFF
                  </span>
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    Description
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {visibleDescription}
                    {isLongDescription && (
                      <button
                        type="button"
                        onClick={() => setIsExpanded((prev) => !prev)}
                        className="text-blue-600 hover:text-blue-700 font-medium ml-1.5 transition-colors">
                        {isExpanded ? "Show less" : "Read more"}
                      </button>
                    )}
                  </p>
                </div>

                {/* Size Selector */}
                {showSizeSelector && (
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-sm font-medium text-gray-700">
                        Select Size
                        {selectedSize && (
                          <span className="ml-2 font-semibold text-gray-900">
                            {selectedSize}
                          </span>
                        )}
                      </span>
                      {sizeError && (
                        <span
                          role="alert"
                          className="text-xs font-medium text-red-600">
                          Please choose a size
                        </span>
                      )}
                    </div>

                    <div
                      role="radiogroup"
                      aria-label="Product size"
                      className="flex flex-wrap gap-2.5">
                      {product.sizes.map((size) => {
                        const isSelected = selectedSize === size;
                        return (
                          <button
                            key={size}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => handleSizeSelect(size)}
                            className={`min-w-12 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-150 ${
                              isSelected
                                ? "bg-gray-900 text-white border-gray-900 shadow-xs"
                                : sizeError
                                  ? "bg-white text-gray-800 border-red-300 hover:border-gray-900"
                                  : "bg-white text-gray-800 border-gray-200 hover:border-gray-900"
                            }`}>
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">
                    Quantity
                  </span>
                  <div className="inline-flex items-center rounded-xl border border-gray-200 bg-gray-50/70">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="p-2.5 text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors">
                      <Minus className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <span
                      aria-live="polite"
                      className="px-4 text-sm font-semibold text-gray-900 min-w-10 text-center tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                      disabled={quantity >= 10}
                      aria-label="Increase quantity"
                      className="p-2.5 text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors">
                      <Plus className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  {hasChangedCartSize ? (
                    <button
                      type="button"
                      onClick={handleUpdateCartSize}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-blue-600 text-white text-sm sm:text-base font-semibold py-3.5 px-6 rounded-xl shadow-xs hover:shadow-md transition-all duration-200">
                      <Handbag className="w-4 h-4" aria-hidden="true" />
                      <span>Update Size in Bag</span>
                    </button>
                  ) : inCart ? (
                    <button
                      type="button"
                      onClick={() => navigate("/cart")}
                      className="group flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold py-3.5 px-6 rounded-xl shadow-xs hover:shadow-md transition-all duration-200">
                      <span>View in Bag</span>
                      <ArrowRight
                        className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-blue-600 text-white text-sm sm:text-base font-semibold py-3.5 px-6 rounded-xl shadow-xs hover:shadow-md transition-all duration-200">
                      <Handbag className="w-4 h-4" aria-hidden="true" />
                      <span>Add to Bag</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 hover:border-gray-900 text-sm sm:text-base font-semibold py-3.5 px-6 rounded-xl transition-all duration-200">
                    <span>Buy Now</span>
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-100">
                  {TRUST_BADGES.map(
                    ({ icon: Icon, title, subtitle, color }) => (
                      <div
                        key={title}
                        className="flex flex-col items-center text-center gap-1.5">
                        <div className={`p-2 rounded-xl ${color}`}>
                          <Icon className="w-4 h-4" aria-hidden="true" />
                        </div>
                        <p className="text-xs font-semibold text-gray-900 leading-tight">
                          {title}
                        </p>
                        <p className="text-[11px] text-gray-500 hidden sm:block">
                          {subtitle}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </article>
        )}

        {/* Recommendations */}
        {!isLoading && (
          <section className="mt-16 pt-10 border-t border-gray-100">
            <PeopleAlsoBought />
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
