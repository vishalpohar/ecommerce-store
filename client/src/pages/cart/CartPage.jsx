import { useCartStore } from "../../stores/useCartStore";

import CartItem from "../../components/CartItem";
import PeopleAlsoBought from "../../components/PeopleAlsoBought";
import OrderSummary from "../../components/OrderSummary";
import EmptyCartPage from "./EmptyCartPage";
import { useNavigate } from "react-router-dom";

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
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Animation */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-700 mb-2">
            Shopping Bag
          </h1>
          <p className="text-gray-600">
            {cart.length} {cart.length === 1 ? "item" : "items"} in your bag
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">
                  Bag Items
                </h2>
              </div>

              {/* Stagger animation only for items */}
              <ul className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <div key={item._id} className="animate-fadeSlideUp">
                    <CartItem item={item} />
                  </div>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar - No animation needed */}
          <div className="lg:w-96 space-y-6">
            <OrderSummary handleCheckout={handleCheckout} />
          </div>
        </div>

        {/* People Also Bought – No animation (keeps layout clean) */}
        {cart.length > 0 && (
          <div className="mt-12">
            <PeopleAlsoBought />
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
