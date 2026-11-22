import {
  XCircle,
  ShoppingBag,
  HelpCircle,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

const PurchaseCancelPage = () => {
  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-8">
      {/* Simple fade-in using CSS only */}
      <div className="w-[80%] max-w-[800px] bg-white rounded-xl shadow-2xl overflow-hidden relative z-20 border border-gray-300 animate-fadeIn py-8">
        {/* Header Section */}
        <div className="px-8 pb-6 text-center text-gray-800">
          <div className="backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-2">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>

          <h1 className="text-3xl font-bold mb-3">Payment Cancelled</h1>
          <p className="text-gray-500 text-lg opacity-90">
            No charges have been made to your account
          </p>
        </div>

        {/* Content Section */}
        <div className="py-2">
          {/* Information Card */}
          <div className="px-10 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="w-6 h-6 text-orange-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                What Happened?
              </h2>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <p>
                Your checkout process was interrupted or cancelled. This could
                be because:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>You decided not to complete the purchase</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>There was a technical issue during payment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>You wanted to review your order details</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Support Card */}
          <div className="bg-blue-50 px-10 py-4 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Need Help?</h3>
            </div>

            <p className="text-sm text-gray-700 mb-4">
              If you encountered any issues or have questions about your order,
              our support team is here to help.
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Email Support</span>
                <span className="font-medium text-blue-600">
                  support@ecommerce-store.com
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone Support</span>
                <span className="font-medium text-blue-600">
                  +91 1234567890
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center items-center flex-wrap gap-4">
            <Link
              to="/"
              className="border border-blue-500 text-blue-500 font-semibold py-3 px-4 rounded-lg transition-all duration-200 hover:text-white hover:bg-blue-700 flex items-center justify-center gap-3">
              <ShoppingBag className="hidden md:block w-5 h-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Fade In Animation (Tailwind custom) */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default PurchaseCancelPage;
