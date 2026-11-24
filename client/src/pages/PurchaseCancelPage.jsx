import {
  HelpCircle,
  Mail,
  Phone,
  RefreshCw,
  ShoppingBag,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const CANCEL_REASONS = [
  "You decided not to complete the purchase",
  "There was a temporary issue during payment",
  "You wanted to review your bag or shipping details",
];

const PurchaseCancelPage = () => {
  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-gray-50/70 to-white flex items-center justify-center py-12 px-4 sm:px-6">
      <article className="w-full max-w-xl bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden animate-fadeSlideUp">
        {/* Header */}
        <header className="px-6 sm:px-8 pt-8 pb-6 text-center border-b border-gray-100">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 ring-1 ring-inset ring-red-600/15 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-7 h-7" aria-hidden="true" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 tracking-tight">
            Payment Cancelled
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1.5">
            No charges have been made to your account.
          </p>
        </header>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* What Happened */}
          <section aria-labelledby="cancel-reasons-heading">
            <h2
              id="cancel-reasons-heading"
              className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
              What Happened?
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              Your checkout session was interrupted or cancelled. This usually
              happens when:
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              {CANCEL_REASONS.map((reason) => (
                <li key={reason} className="flex items-start gap-2.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"
                    aria-hidden="true"
                  />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Support Box */}
          <section
            aria-labelledby="support-heading"
            className="rounded-xl bg-gray-50/80 border border-gray-100 p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle
                className="w-4 h-4 text-blue-600 shrink-0"
                aria-hidden="true"
              />
              <h2
                id="support-heading"
                className="text-sm font-semibold text-gray-900">
                Need Help?
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-gray-500 mb-4">
              If you ran into an issue or have questions about your order, reach
              out to our support team.
            </p>

            <div className="space-y-2.5 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-gray-500">
                  <Mail className="w-4 h-4 text-gray-400" aria-hidden="true" />
                  Email Support
                </span>
                <a
                  href="mailto:support@easybuy.com"
                  className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  support@easybuy.com
                </a>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-gray-500">
                  <Phone className="w-4 h-4 text-gray-400" aria-hidden="true" />
                  Phone Support
                </span>
                <a
                  href="tel:+911234567890"
                  className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  +91 12345 67890
                </a>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/cart"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-blue-600 text-white text-sm font-semibold py-3 px-5 rounded-xl shadow-xs hover:shadow-md transition-all duration-200">
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              <span>Return to Bag</span>
            </Link>

            <Link
              to="/"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 hover:border-gray-900 text-sm font-semibold py-3 px-5 rounded-xl transition-all duration-200">
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default PurchaseCancelPage;
