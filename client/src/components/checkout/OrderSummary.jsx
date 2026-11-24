import {
  ArrowRight,
  Clock,
  Loader2,
  ShieldCheck,
  Tag,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatPriceInRupees } from "../../utils/formatCurrency";

const TRUST_BADGES = [
  { icon: Truck, label: "Free Shipping", color: "text-emerald-600 bg-emerald-50" },
  { icon: ShieldCheck, label: "Secure Pay", color: "text-blue-600 bg-blue-50" },
  { icon: Clock, label: "24/7 Support", color: "text-amber-600 bg-amber-50" },
];

const OrderSummary = ({
  subtotal = 0,
  total = 0,
  discount = 0,
  shippingCost = 0,
  totalQuantity,
  buttonLabel = "Proceed to Checkout",
  loadingLabel = "Processing...",
  onAction,
  loading = false,
  disabled = false,
  showContinueShopping = false,
  footerNote = "",
}) => {
  const isDisabled = disabled || loading || totalQuantity === 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50/70 border-b border-gray-100">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
          Order Summary
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Pricing Breakdown */}
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <dt className="text-gray-500">
              Subtotal
              {typeof totalQuantity === "number" && (
                <span className="ml-1 text-gray-400">
                  ({totalQuantity} {totalQuantity === 1 ? "item" : "items"})
                </span>
              )}
            </dt>
            <dd className="font-medium text-gray-900 tabular-nums">
              {formatPriceInRupees(subtotal)}
            </dd>
          </div>

          <div className="flex justify-between items-center">
            <dt className="text-gray-500">Shipping</dt>
            <dd className="font-medium text-emerald-600 tabular-nums">
              {shippingCost === 0 ? "Free" : formatPriceInRupees(shippingCost)}
            </dd>
          </div>

          {discount > 0 && (
            <div className="flex justify-between items-center">
              <dt className="inline-flex items-center gap-1.5 text-emerald-600">
                <Tag className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Discount</span>
              </dt>
              <dd className="font-medium text-emerald-600 tabular-nums">
                -{formatPriceInRupees(discount)}
              </dd>
            </div>
          )}

          <div className="pt-4 mt-2 border-t border-gray-100 flex justify-between items-baseline">
            <dt className="text-base font-semibold text-gray-900">Total</dt>
            <dd className="text-2xl font-bold text-gray-900 tabular-nums">
              {formatPriceInRupees(total)}
            </dd>
          </div>
        </dl>

        {/* Primary CTA */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={onAction}
            disabled={isDisabled}
            className="group w-full inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-xl shadow-xs hover:shadow-md transition-all duration-200"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>{loadingLabel}</span>
              </>
            ) : (
              <>
                <span>{buttonLabel}</span>
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </>
            )}
          </button>

          {showContinueShopping && (
            <div className="text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          )}

          {footerNote && (
            <p className="flex items-center justify-center gap-1.5 text-xs text-gray-500 pt-1">
              <ShieldCheck
                className="w-4 h-4 text-blue-600 shrink-0"
                aria-hidden="true"
              />
              <span>{footerNote}</span>
            </p>
          )}
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-2 pt-5 border-t border-gray-100">
          {TRUST_BADGES.map(({ icon: Icon, label, color }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center gap-1.5"
            >
              <div className={`p-2 rounded-xl ${color}`}>
                <Icon className="w-4 h-4" aria-hidden="true" />
              </div>
              <span className="text-[11px] font-medium text-gray-500 leading-tight">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;