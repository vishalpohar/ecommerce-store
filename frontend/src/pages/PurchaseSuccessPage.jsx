import {
  ArrowRight,
  CheckCircle,
  Package,
  Truck,
  Mail,
  Clock,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import axios from "../api/axios";
import Confetti from "react-confetti";
import { formatPriceInRupees } from "../utils/formatCurrency";

const PurchaseSuccessPage = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const { clearCart } = useCartStore();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleCheckoutSuccess = async (sessionId) => {
      try {
        const response = await axios.post(
          "/payments/checkout-success",
          { sessionId },
          { withCredentials: true },
        );

        clearCart();
        setOrderDetails(response.data);

        setTimeout(() => setIsRedirecting(true), 8000);
        setTimeout(() => navigate("/"), 12000);
      } catch (error) {
        console.error("Checkout success error:", error);
        setError("Failed to process order confirmation");
      } finally {
        setIsProcessing(false);
      }
    };

    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id",
    );

    if (sessionId) handleCheckoutSuccess(sessionId);
    else {
      setError("No session ID found in the URL");
      setIsProcessing(false);
    }
  }, [clearCart, navigate]);

  if (isProcessing) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900">
            Processing your order...
          </h3>
          <p className="text-gray-600 mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Processing Error
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>

          <Link
            to="/"
            className="inline-flex items-center gap-1 px-6 py-3 text-gray-700 hover:underline rounded-lg transition-colors font-medium">
            <ArrowLeft size={20} />
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-8">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.1}
        numberOfPieces={300}
        recycle={false}
        style={{ zIndex: 50 }}
      />

      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
        {/* HEADER */}
        <div className="text-center px-8 py-4">
          <div className="w-20 h-20 bg-green-50 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>

          <h1 className="text-green-500 text-3xl lg:text-4xl font-bold mb-3">
            Order Confirmed!
          </h1>
          <p className="text-green-500 text-lg opacity-90">
            Thank you for your purchase. We're preparing your order.
          </p>
        </div>

        {/* CONTENT */}
        <div className="py-4">
          {/* ORDER DETAILS */}
          <div className="p-6 mb-8 md:px-16">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Order Details
              </h2>
            </div>

            <div className="flex flex-col gap-4 text-sm">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number</span>
                  <span className="font-semibold text-gray-900">
                    #ECOM-
                    {orderDetails?.orderId ||
                      Math.random().toString(36).substring(2, 9).toUpperCase()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date</span>
                  <span className="font-semibold text-gray-900">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-semibold text-gray-900">
                    {formatPriceInRupees(orderDetails?.totalAmount)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span className="font-semibold text-green-600">Paid</span>
                </div>
              </div>
            </div>
          </div>

          {/* DELIVERY TIMELINE */}
          <div className="p-6 mb-6 md:px-16 border-t-2 border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="w-6 h-6 text-orange-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Delivery Timeline
              </h2>
            </div>

            <div className="flex justify-between items-center text-sm">
              <TimelineItem
                dotColor="bg-green-500"
                title="Order Confirmed"
                time="Just now"
              />
              <TimelineItem
                dotColor="bg-blue-500"
                title="Processing"
                time="Within 24 hours"
              />
              <TimelineItem
                dotColor="bg-gray-300"
                title="Shipped"
                time="1–2 business days"
              />
              <TimelineItem
                dotColor="bg-gray-300"
                title="Delivered"
                time="3–5 business days"
              />
            </div>
          </div>

          {/* NEXT STEPS */}
          <div className="bg-blue-50 p-6 mb-8 md:px-16">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">What's Next?</h3>
            </div>

            <p className="text-sm text-gray-700">
              We've sent an order confirmation to your email. You'll receive
              shipping updates and tracking info as your order progresses.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-center items-center gap-6">
            <Link
              to="/orders"
              className="text-yellow-500 border-2 border-yellow-500 hover:bg-yellow-500 hover:text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3">
              <Package className="hidden md:block w-5 h-5" />
              View Order Details
            </Link>

            <Link
              to="/"
              className="text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-3">
              <ArrowRight className="hidden md:block w-5 h-5" />
              Continue Shopping
            </Link>
          </div>

          {/* AUTO REDIRECT NOTICE */}
          {isRedirecting && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
              <div className="flex items-center justify-center gap-3">
                <Clock className="w-5 h-5 text-yellow-600 animate-pulse" />
                <p className="text-sm text-yellow-800">
                  Redirecting you to homepage in a few seconds...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TimelineItem = ({ dotColor, title, time }) => (
  <div className="flex items-center gap-4">
    <div className={`w-3 h-3 ${dotColor} rounded-full`} />
    <div>
      <p className="font-medium text-gray-900">{title}</p>
      <p className="text-sm text-gray-600">{time}</p>
    </div>
  </div>
);

export default PurchaseSuccessPage;
