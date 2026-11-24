import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Mail,
  Package,
  Truck,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useCartStore } from "../stores/useCartStore";
import { formatPriceInRupees } from "../utils/formatCurrency";

const TIMELINE_STEPS = [
  { title: "Order Confirmed", time: "Just now", active: true, done: true },
  { title: "Processing", time: "Within 24 hrs", active: true, done: false },
  { title: "Shipped", time: "1–2 business days", active: false, done: false },
  { title: "Delivered", time: "3–5 business days", active: false, done: false },
];

const PurchaseSuccessPage = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);

  const { clearCart } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    let noticeTimer;
    let redirectTimer;

    const handleCheckoutSuccess = async (sessionId) => {
      try {
        const response = await axios.post(
          "/payments/checkout-success",
          { sessionId },
          { withCredentials: true },
        );

        clearCart();
        setOrderDetails(response.data);

        noticeTimer = setTimeout(() => setIsRedirecting(true), 8000);
        redirectTimer = setTimeout(() => navigate("/"), 12000);
      } catch (err) {
        console.error("Checkout success error:", err);
        setError(
          "Failed to process order confirmation. Please check your orders page.",
        );
      } finally {
        setIsProcessing(false);
      }
    };

    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id",
    );

    if (sessionId) {
      handleCheckoutSuccess(sessionId);
    } else {
      setError("No session ID found in the URL.");
      setIsProcessing(false);
    }

    // Clear timers if user navigates away early
    return () => {
      clearTimeout(noticeTimer);
      clearTimeout(redirectTimer);
    };
  }, [clearCart, navigate]);

  if (isProcessing) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="min-h-[85vh] bg-gradient-to-b from-gray-50/70 to-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <h1 className="text-lg font-serif font-bold text-gray-900">
            Confirming your order...
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Please hold on while we verify your payment.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[85vh] bg-gradient-to-b from-gray-50/70 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200/80 shadow-xs p-8 text-center animate-fadeSlideUp">
          <div className="w-14 h-14 bg-red-50 text-red-600 ring-1 ring-inset ring-red-600/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-7 h-7" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">
            Order Processing Error
          </h1>
          <p className="text-sm text-gray-500 mb-6">{error}</p>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-blue-600 text-white text-sm font-semibold transition-colors">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const formattedOrderId = orderDetails?.orderId
    ? `#ECOM-${String(orderDetails.orderId).slice(-8).toUpperCase()}`
    : "#ECOM-CONFIRMED";

  const formattedDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-gray-50/70 to-white flex items-center justify-center py-12 px-4 sm:px-6">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.12}
        numberOfPieces={250}
        recycle={false}
        style={{ zIndex: 50, pointerEvents: "none" }}
      />

      <article className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden animate-fadeSlideUp">
        {/* Header */}
        <header className="px-6 sm:px-8 pt-8 pb-6 text-center border-b border-gray-100">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-600/15 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 tracking-tight">
            Order Confirmed!
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1.5">
            Thank you for shopping with EasyBuy. We&apos;re preparing your
            order.
          </p>
        </header>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Order Details */}
          <section aria-labelledby="order-summary-heading">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-blue-600" aria-hidden="true" />
              <h2
                id="order-summary-heading"
                className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Order Details
              </h2>
            </div>

            <dl className="rounded-xl bg-gray-50/80 border border-gray-100 p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-xs text-gray-500">Order Number</dt>
                <dd className="font-mono font-semibold text-gray-900 mt-0.5">
                  {formattedOrderId}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-gray-500">Order Date</dt>
                <dd className="font-semibold text-gray-900 mt-0.5">
                  {formattedDate}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-gray-500">Total Paid</dt>
                <dd className="font-bold text-gray-900 text-base tabular-nums mt-0.5">
                  {formatPriceInRupees(orderDetails?.totalAmount || 0)}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-gray-500">Payment Status</dt>
                <dd className="mt-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                      aria-hidden="true"
                    />
                    Paid
                  </span>
                </dd>
              </div>
            </dl>
          </section>

          {/* Delivery Timeline */}
          <section
            aria-labelledby="timeline-heading"
            className="pt-5 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="w-4 h-4 text-amber-600" aria-hidden="true" />
              <h2
                id="timeline-heading"
                className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Delivery Timeline
              </h2>
            </div>

            <ol className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
              {TIMELINE_STEPS.map((step) => (
                <li
                  key={step.title}
                  className="flex sm:flex-col items-start gap-3 sm:gap-1.5">
                  <span
                    aria-hidden="true"
                    className={`w-2.5 h-2.5 rounded-full mt-1.5 sm:mt-0 shrink-0 ${
                      step.done
                        ? "bg-emerald-500 ring-4 ring-emerald-50"
                        : step.active
                          ? "bg-blue-500 ring-4 ring-blue-50"
                          : "bg-gray-300"
                    }`}
                  />
                  <div>
                    <p
                      className={`font-semibold leading-snug ${
                        step.active ? "text-gray-900" : "text-gray-500"
                      }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{step.time}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Next Steps */}
          <section className="rounded-xl bg-blue-50/70 border border-blue-100 p-4 flex items-start gap-3">
            <Mail
              className="w-4 h-4 text-blue-600 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              We&apos;ve sent an order confirmation to your email. You&apos;ll
              receive shipping updates and tracking details as your order
              progresses.
            </p>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/orders"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-blue-600 text-white text-sm font-semibold py-3 px-5 rounded-xl shadow-xs hover:shadow-md transition-all duration-200">
              <Package className="w-4 h-4" aria-hidden="true" />
              <span>View Order Details</span>
            </Link>

            <Link
              to="/"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 hover:border-gray-900 text-sm font-semibold py-3 px-5 rounded-xl transition-all duration-200">
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Auto Redirect Notice */}
          {isRedirecting && (
            <div
              role="status"
              aria-live="polite"
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-xs sm:text-sm text-amber-800">
              <Clock
                className="w-4 h-4 text-amber-600 animate-pulse shrink-0"
                aria-hidden="true"
              />
              <span>Redirecting you to the homepage shortly...</span>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default PurchaseSuccessPage;
