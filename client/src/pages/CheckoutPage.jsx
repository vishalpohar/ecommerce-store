import { ArrowLeft, Lock, ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation } from "react-router-dom";
import axios from "../api/axios";
import { stripePromise } from "../lib/stripe";

import CheckoutItems from "../components/checkout/CheckoutItems";
import PaymentMethod from "../components/checkout/PaymentMethod";
import ShippingAddress from "../components/checkout/ShippingAddress";
import { ThreeDotsLoader } from "../components/LoadingSpinner";
import OrderSummary from "../components/checkout/OrderSummary";

import { useAddressStore } from "../stores/useAddressStore";
import { useCartStore } from "../stores/useCartStore";
import { useProductStore } from "../stores/useProductStore";

const CheckoutPage = () => {
  const location = useLocation();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [placingOrder, setPlacingOrder] = useState(false);

  const isBuyNow = location.state?.source === "buy-now";
  const productId = location.state?.productId;
  const quantity = location.state?.quantity || 1;

  const {
    cart,
    isFetchingCart,
    coupon,
    total: cartTotal,
    isCouponApplied,
  } = useCartStore();

  const { shippingAddress, fetchAddress, fetchingAddress } = useAddressStore();
  const { product, fetchProductById, isFetchingProduct } = useProductStore();

  useEffect(() => {
    fetchAddress();
  }, [fetchAddress]);

  useEffect(() => {
    if (isBuyNow && productId) {
      fetchProductById(productId);
    }
  }, [isBuyNow, productId, fetchProductById]);

  const checkoutProducts = useMemo(() => {
    if (isBuyNow) {
      if (!product || product._id !== productId) return [];
      return [{ ...product, quantity }];
    }
    return cart;
  }, [isBuyNow, product, productId, quantity, cart]);

  const orderTotals = useMemo(() => {
    const subtotal = checkoutProducts.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0,
    );

    const totalQuantity = checkoutProducts.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0,
    );

    const discount =
      !isBuyNow && isCouponApplied && Number(cartTotal) > 0
        ? Math.max(0, subtotal - Number(cartTotal))
        : 0;

    const shippingCost = 0;
    const total = subtotal - discount + shippingCost;

    return { subtotal, shippingCost, discount, total, totalQuantity };
  }, [checkoutProducts, isBuyNow, isCouponApplied, cartTotal]);

  const checkoutLoading = isBuyNow
    ? isFetchingProduct || !product || product._id !== productId
    : isFetchingCart;

  const handlePlaceOrder = async () => {
    if (!shippingAddress) {
      toast.error("Please add your shipping address");
      return;
    }

    if (checkoutProducts.length === 0) {
      toast.error("Your checkout has no products");
      return;
    }

    if (paymentMethod !== "card") {
      toast.error("Please select a valid payment method");
      return;
    }

    if (placingOrder) return;
    setPlacingOrder(true);

    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Unable to initialize Stripe");

      const response = await axios.post("/payments/create-checkout-session", {
        products: checkoutProducts,
        couponCode: isCouponApplied ? (coupon?.code ?? null) : null,
        addressId: shippingAddress._id,
      });

      const sessionId = response.data.id;
      if (!sessionId) throw new Error("Stripe session ID was not returned");

      const result = await stripe.redirectToCheckout({ sessionId });
      if (result.error) throw new Error(result.error.message);
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to process checkout",
      );
      setPlacingOrder(false);
    }
  };

  if (checkoutLoading || fetchingAddress) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <ThreeDotsLoader height="80" />
      </div>
    );
  }

  if (checkoutProducts.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
          <ShoppingBag className="w-7 h-7 text-gray-400" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-serif font-bold text-gray-900">
          No products available for checkout
        </h1>
        <p className="text-sm text-gray-500 mt-1.5 max-w-sm">
          Please return to your shopping bag or browse the store to add items.
        </p>
        <Link
          to="/cart"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-blue-600 text-white text-sm font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Return to Bag
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] bg-gradient-to-b from-gray-50/70 to-white py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b border-gray-200/80">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              <Lock className="w-3.5 h-3.5" aria-hidden="true" />
              Secure Checkout
            </span>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-1.5 tracking-tight">
              Checkout
            </h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              Review your items, confirm shipping details, and complete payment.
            </p>
          </div>

          {!isBuyNow && (
            <Link
              to="/cart"
              className="self-start sm:self-auto inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back to Bag
            </Link>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <CheckoutItems products={checkoutProducts} />
            <ShippingAddress
              address={shippingAddress}
              loading={fetchingAddress}
            />
            <PaymentMethod
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
          </div>

          {/* Right Sticky Column */}
          <aside
            aria-label="Order summary"
            className="lg:col-span-1 lg:sticky lg:top-28">
            <OrderSummary
              {...orderTotals}
              buttonLabel="Place Order & Pay"
              loadingLabel="Redirecting to Stripe..."
              onAction={handlePlaceOrder}
              loading={placingOrder}
              disabled={!shippingAddress || !checkoutProducts.length}
              footerNote="Secure checkout powered by Stripe"
            />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
