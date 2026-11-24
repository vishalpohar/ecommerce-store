import { Handbag } from "lucide-react";
import { useNavigate } from "react-router-dom";

import CartItem from "../../components/CartItem";
import OrderSummary from "../../components/OrderSummary";
import PeopleAlsoBought from "../../components/PeopleAlsoBought";
import { useCartStore } from "../../stores/useCartStore";
import EmptyCartPage from "./EmptyCartPage";

const CartItemSkeleton = () => (
  <div aria-hidden="true" className="p-5 flex gap-4">
    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl shimmer shrink-0" />
    <div className="flex-1 space-y-2.5 py-1">
      <div className="h-4 w-2/3 shimmer rounded-md" />
      <div className="h-3.5 w-1/3 shimmer rounded-md" />
      <div className="h-5 w-24 shimmer rounded-md mt-2" />
    </div>
  </div>
);

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, isFetchingCart } = useCartStore();

  const handleCheckout = () => {
    navigate("/checkout", { state: { source: "cart" } });
  };

  if (!isFetchingCart && cart.length === 0) {
    return <EmptyCartPage />;
  }

  return (
    <div className="min-h-[90vh] bg-gradient-to-b from-gray-50/70 to-white py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b border-gray-200/80">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              <Handbag className="w-3.5 h-3.5" aria-hidden="true" />
              Ready to Checkout
            </span>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-1.5 tracking-tight">
              Shopping Bag
            </h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              Review your selected pieces before heading to checkout.
            </p>
          </div>

          {!isFetchingCart && (
            <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-xs sm:text-sm font-medium text-gray-700 shadow-2xs">
              {cart.length} {cart.length === 1 ? "item" : "items"} in your bag
            </span>
          )}
        </header>

        {/* Main Bag Layout */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          {/* Bag Items */}
          <section
            aria-label="Bag items"
            className="flex-1 min-w-0 bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
            <div className="px-5 sm:px-6 py-4 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Bag Items
              </h2>
              {!isFetchingCart && (
                <span className="text-xs font-medium text-gray-500">
                  {cart.length} {cart.length === 1 ? "product" : "products"}
                </span>
              )}
            </div>

            {isFetchingCart ? (
              <div className="divide-y divide-gray-100">
                {Array.from({ length: 3 }).map((_, i) => (
                  <CartItemSkeleton key={i} />
                ))}
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <li key={item._id} className="animate-fadeSlideUp">
                    <CartItem item={item} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Sticky Order Summary Sidebar */}
          <aside
            aria-label="Order summary"
            className="lg:sticky lg:top-28 w-full lg:w-96 shrink-0 space-y-6">
            <OrderSummary handleCheckout={handleCheckout} />
          </aside>
        </div>

        {/* Recommendations */}
        {!isFetchingCart && cart.length > 0 && (
          <section className="mt-16 pt-10 border-t border-gray-100">
            <PeopleAlsoBought />
          </section>
        )}
      </div>
    </div>
  );
};

export default CartPage;
