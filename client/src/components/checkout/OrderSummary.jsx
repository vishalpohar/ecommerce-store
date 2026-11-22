import { Tag, Truck, ShieldCheck } from "lucide-react";
import { formatPriceInRupees } from "../../utils/formatCurrency";

const OrderSummary = ({
  totalQuantity = 0,
  subtotal = 0,
  shippingCost = 0,
  discount = 0,
  total = 0,
  onPlaceOrder,
  placingOrder = false,
  disabled = false,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6 lg:sticky lg:top-24">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Order Summary
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            Subtotal ({totalQuantity} items)
          </span>

          <span className="font-medium text-gray-900">
            {formatPriceInRupees(subtotal)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>

          <span className="font-medium text-green-600">
            {shippingCost === 0 ? "FREE" : formatPriceInRupees(shippingCost)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <Tag className="w-4 h-4" />
              Discount
            </span>

            <span className="font-medium text-green-600">
              -{formatPriceInRupees(discount)}
            </span>
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900">Total Amount</span>

            <span className="text-2xl font-bold text-gray-900">
              {formatPriceInRupees(total)}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onPlaceOrder}
        disabled={disabled || placingOrder || totalQuantity === 0}
        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
        {placingOrder ? "Processing..." : "Place Order & Pay"}
      </button>

      <div className="flex items-center justify-center gap-2 mt-5 text-xs text-gray-500">
        <Truck className="w-4 h-4 text-green-600" />
        Free shipping on orders over ₹1000
      </div>

      <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-500">
        <ShieldCheck className="w-4 h-4 text-blue-600" />
        Secure checkout powered by Stripe
      </div>
    </div>
  );
};

export default OrderSummary;
