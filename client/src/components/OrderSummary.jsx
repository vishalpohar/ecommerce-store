import { useCartStore } from "../stores/useCartStore";
import { ArrowRight, Shield, Truck, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPriceInRupees } from "../utils/formatCurrency";

const OrderSummary = ({ handleCheckout }) => {
  const { total, subtotal } = useCartStore();

  const savings = subtotal - total;
  const formattedSubtotal = formatPriceInRupees(subtotal);
  const formattedTotal = formatPriceInRupees(total);
  const formattedSavings = formatPriceInRupees(savings);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-500">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Order Summary
      </h2>

      {/* Pricing Breakdown */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900 font-medium">{formattedSubtotal}</span>
        </div>

        {savings > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-green-600">Savings</span>
            <span className="text-green-600 font-medium">
              -{formattedSavings}
            </span>
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-gray-900">
              {formattedTotal}
            </span>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <Truck className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <p className="text-xs text-gray-600">Free Shipping</p>
        </div>
        <div className="text-center">
          <Shield className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <p className="text-xs text-gray-600">Secure Checkout</p>
        </div>
        <div className="text-center">
          <Clock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
          <p className="text-xs text-gray-600">24/7 Support</p>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 ease-in-out mb-4"
        aria-label="Proceed to Checkout"
        onClick={handleCheckout}>
        Proceed to Checkout
      </button>

      {/* Continue Shopping */}
      <div className="text-center">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
          Continue Shopping
          <ArrowRight className="ml-1 w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default OrderSummary;
