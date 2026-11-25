import {
  Calendar,
  CreditCard,
  MapPin,
  Package,
  Phone,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import formatDate from "../../utils/formatDate";
import { formatPriceInRupees } from "../../utils/formatCurrency";

const STATUS_STYLES = {
  delivered: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  shipped: "bg-blue-50 text-blue-700 ring-blue-600/20",
  processing: "bg-amber-50 text-amber-700 ring-amber-600/20",
  cancelled: "bg-red-50 text-red-700 ring-red-600/20",
};

const PAYMENT_STYLES = {
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  failed: "bg-red-50 text-red-700 ring-red-600/20",
};

const capitalize = (value, fallback) => {
  if (!value) return fallback;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

const OrderDetailsCard = ({ order, onViewDetails, onTrackOrder }) => {
  const statusKey = order.status?.toLowerCase() || "processing";
  const paymentKey = order.paymentStatus?.toLowerCase() || "pending";
  const address = order.shippingAddress;

  return (
    <article className="bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md hover:border-gray-300/80 transition-all duration-300 overflow-hidden">
      {/* Order Header */}
      <header className="px-5 py-4 bg-gray-50/70 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Order ID
            </p>
            <p className="text-sm font-semibold text-gray-900 font-mono mt-0.5">
              #ECOM-{order._id?.slice(-8).toUpperCase()}
            </p>
          </div>

          <div className="hidden sm:block h-8 w-px bg-gray-200" />

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Placed On
            </p>
            <time
              dateTime={order.createdAt}
              className="flex items-center gap-1.5 text-sm text-gray-700 mt-0.5">
              <Calendar
                className="w-3.5 h-3.5 text-gray-400"
                aria-hidden="true"
              />
              {formatDate(order.createdAt)}
            </time>
          </div>

          <div className="hidden sm:block h-8 w-px bg-gray-200" />

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Total Amount
            </p>
            <p className="text-base font-bold text-gray-900 mt-0.5">
              {formatPriceInRupees(order.totalAmount)}
            </p>
          </div>
        </div>

        {/* Order Status Pill */}
        <span
          className={`self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${
            STATUS_STYLES[statusKey] ||
            "bg-gray-50 text-gray-700 ring-gray-600/20"
          }`}>
          <span
            className="w-1.5 h-1.5 rounded-full bg-current"
            aria-hidden="true"
          />
          {capitalize(order.status, "Processing")}
        </span>
      </header>

      {/* Order Body */}
      <div className="p-5 space-y-6">
        {/* Purchased Items */}
        <section aria-label="Ordered items">
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-4 h-4 text-gray-400" aria-hidden="true" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Items ({order.products?.length || 0})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {order.products?.map((product) => (
              <Link
                key={product.product}
                to={`/product-details/${product.product}`}
                className="group flex items-center gap-3.5 p-3 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-blue-200 hover:shadow-xs transition-all duration-200">
                <div className="w-16 h-16 shrink-0 bg-white rounded-lg overflow-hidden border border-gray-200/80">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h4>
                  <div className="flex items-center justify-between gap-2 mt-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <span>Qty: {product.quantity}</span>
                      {product.size && product.size !== "One Size" && (
                        <>
                          <span className="text-gray-300" aria-hidden="true">
                            •
                          </span>
                          <span>Size: {product.size}</span>
                        </>
                      )}
                    </div>
                    <span className="font-semibold text-gray-900 tabular-nums">
                      {formatPriceInRupees(product.itemTotal)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Shipping & Payment Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5 border-t border-gray-100">
          {/* Shipping Address */}
          {address && (
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gray-100 text-gray-600 shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" aria-hidden="true" />
              </div>
              <address className="not-italic text-sm text-gray-600 leading-relaxed">
                <p className="font-semibold text-gray-900 mb-0.5">
                  Shipping to {address.fullName}
                </p>
                <p>{address.addressLine}</p>
                <p>
                  {address.city}, {address.state} – {address.postalCode}
                </p>
                <p>{address.country}</p>
                {address.phone && (
                  <p className="inline-flex items-center gap-1.5 text-xs text-gray-500 mt-1.5">
                    <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                    +91 {address.phone}
                  </p>
                )}
              </address>
            </div>
          )}

          {/* Payment Details */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gray-100 text-gray-600 shrink-0 mt-0.5">
              <CreditCard className="w-4 h-4" aria-hidden="true" />
            </div>
            <div className="space-y-1.5 text-sm">
              <p className="font-semibold text-gray-900">Payment Summary</p>
              <div className="flex items-center gap-2 text-gray-600">
                <span>Method:</span>
                <span className="font-medium text-gray-900">
                  {capitalize(order.paymentMethod, "Card")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span>Status:</span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ring-inset ${
                    PAYMENT_STYLES[paymentKey] ||
                    "bg-gray-50 text-gray-700 ring-gray-600/20"
                  }`}>
                  {capitalize(order.paymentStatus, "Pending")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <footer className="px-5 py-3.5 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={() => onViewDetails?.(order)}
          className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-colors">
          View Details
        </button>
        <button
          type="button"
          onClick={() => onTrackOrder?.(order)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-xs">
          <Truck className="w-4 h-4" aria-hidden="true" />
          Track Order
        </button>
      </footer>
    </article>
  );
};

export default OrderDetailsCard;
