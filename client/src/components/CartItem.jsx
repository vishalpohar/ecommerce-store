import { ChevronDown, Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { formatPriceInRupees } from "../utils/formatCurrency";
import { hasMultipleSizes } from "../utils/sizeOptions";

const getOptimizedImage = (url, width = 300) => {
  if (!url || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width},c_limit/`);
};

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity, updateSize } = useCartStore();

  const showSizeSelector = hasMultipleSizes(item.sizes);
  const currentSize = item.size || "One Size";

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(item._id);
    } else {
      updateQuantity(item._id, newQuantity);
    }
  };

  return (
    <article className="p-4 sm:p-6 hover:bg-gray-50/50 transition-colors duration-200">
      <div className="flex gap-4 sm:gap-5">
        {/* Product Image */}
        <Link
          to={`/product-details/${item._id}`}
          className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-100 border border-gray-200/70 group">
          <img
            src={getOptimizedImage(item.image, 300)}
            alt={item.name}
            loading="lazy"
            decoding="async"
            width={112}
            height={112}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Product Details & Controls */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          {/* Top Row: Title, Category & Price */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div className="min-w-0">
              {item.category && (
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  {item.category}
                </p>
              )}
              <Link
                to={`/product-details/${item._id}`}
                className="block mt-0.5 text-sm sm:text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                {item.name}
              </Link>
              <p className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 mt-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                  aria-hidden="true"
                />
                In stock
              </p>
            </div>

            {/* Price & Line Total */}
            <div className="sm:text-right shrink-0">
              <p className="text-base sm:text-lg font-bold text-gray-900 tabular-nums">
                {formatPriceInRupees(item.price * item.quantity)}
              </p>
              {item.quantity > 1 && (
                <p className="text-xs text-gray-500 tabular-nums">
                  {formatPriceInRupees(item.price)} each
                </p>
              )}
            </div>
          </div>

          {/* Bottom Row: Quantity Stepper, Size Selector & Remove */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Quantity Stepper */}
              <div className="inline-flex items-center rounded-xl border border-gray-200 bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  aria-label={
                    item.quantity === 1
                      ? `Remove ${item.name} from bag`
                      : `Decrease quantity of ${item.name}`
                  }
                  className="p-2 text-gray-500 hover:text-red-600 transition-colors">
                  {item.quantity === 1 ? (
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Minus className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>

                <span
                  aria-live="polite"
                  className="px-3 text-sm font-semibold text-gray-900 min-w-8 text-center tabular-nums">
                  {item.quantity}
                </span>

                <button
                  type="button"
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  aria-label={`Increase quantity of ${item.name}`}
                  className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                  <Plus className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              {/* Size Selector (Multi-size products) */}
              {showSizeSelector ? (
                <div className="relative inline-flex items-center">
                  <label htmlFor={`size-${item._id}`} className="sr-only">
                    Size for {item.name}
                  </label>
                  <select
                    id={`size-${item._id}`}
                    value={currentSize}
                    onChange={(e) => updateSize(item._id, e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm font-semibold text-gray-800 shadow-2xs cursor-pointer hover:border-gray-400 focus:outline-none focus:border-blue-500 transition-colors">
                    {item.sizes.map((size) => (
                      <option key={size} value={size}>
                        Size: {size}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 pointer-events-none"
                  />
                </div>
              ) : (
                currentSize !== "One Size" && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-gray-100 text-xs font-semibold text-gray-700">
                    Size: {currentSize}
                  </span>
                )
              )}
            </div>

            <button
              type="button"
              onClick={() => removeFromCart(item._id)}
              aria-label={`Remove ${item.name} from bag`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors">
              <Trash2 className="w-4 h-4" aria-hidden="true" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CartItem;
