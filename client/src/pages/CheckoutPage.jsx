
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { stripePromise } from "../lib/stripe";
import axios from "../api/axios";
import toast from "react-hot-toast";

import CheckoutItems from "../components/checkout/CheckoutItems";
import ShippingAddress from "../components/checkout/ShippingAddress";
import PaymentMethod from "../components/checkout/PaymentMethod";
import OrderSummary from "../components/checkout/OrderSummary";

import { useCartStore } from "../stores/useCartStore";
import { useAddressStore } from "../stores/useAddressStore";
import { useProductStore } from "../stores/useProductStore";

import { ThreeDotsLoader } from "../components/LoadingSpinner";

const CheckoutPage = () => {
  const location = useLocation();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [placingOrder, setPlacingOrder] = useState(false);

  // Determine checkout source
  const isBuyNow = location.state?.source === "buy-now";

  const productId = location.state?.productId;
  const quantity = location.state?.quantity || 1;

  // Cart store
  const {
    cart,
    isFetchingCart,
    coupon,
    subtotal: cartSubtotal,
    total: cartTotal,
    isCouponApplied,
  } = useCartStore();

  // Address store
  const {
    shippingAddress,
    fetchAddress,
    fetchingAddress,
  } = useAddressStore();

  // Product store
  const {
    product,
    fetchProductById,
    isFetchingProduct,
  } = useProductStore();

  // Fetch saved shipping address
  useEffect(() => {
    fetchAddress();
  }, [fetchAddress]);

  // Fetch product only for Buy Now
  useEffect(() => {
    if (isBuyNow && productId) {
      fetchProductById(productId);
    }
  }, [isBuyNow, productId, fetchProductById]);

  // Prepare checkout products
  const checkoutProducts = useMemo(() => {
    if (isBuyNow) {
      // Prevent showing an old product from the product store
      if (!product || product._id !== productId) {
        return [];
      }

      return [
        {
          ...product,
          quantity,
        },
      ];
    }

    return cart;
  }, [isBuyNow, product, productId, quantity, cart]);

  // Calculate order totals for display
  const orderTotals = useMemo(() => {
    const subtotal = checkoutProducts.reduce((sum, item) => {
      return sum + Number(item.price || 0) * Number(item.quantity || 0);
    }, 0);

    const totalQuantity = checkoutProducts.reduce((sum, item) => {
      return sum + Number(item.quantity || 0);
    }, 0);

    const discount =
      !isBuyNow && isCouponApplied && Number(cartTotal) > 0
        ? Math.max(0, subtotal - Number(cartTotal))
        : 0;

    const shippingCost = 0;
    const total = subtotal - discount + shippingCost;

    return {
      subtotal,
      shippingCost,
      discount,
      total,
      totalQuantity,
    };
  }, [checkoutProducts, isBuyNow, isCouponApplied, cartTotal]);

  const checkoutLoading = isBuyNow
    ? isFetchingProduct || !product || product._id !== productId
    : isFetchingCart;

  // Create Stripe checkout session
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

      if (!stripe) {
        throw new Error("Unable to initialize Stripe");
      }

      const response = await axios.post(
        "/payments/create-checkout-session",
        {
          products: checkoutProducts,
          couponCode: isCouponApplied ? coupon?.code ?? null : null,
          addressId: shippingAddress._id,
        }
      );

      const sessionId = response.data.id;

      if (!sessionId) {
        throw new Error("Stripe session ID was not returned");
      }

      const result = await stripe.redirectToCheckout({
        sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error("Checkout error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to process checkout"
      );

      setPlacingOrder(false);
    }
  };

  if (checkoutLoading || fetchingAddress) {
    return <ThreeDotsLoader height="80" />;
  }

  if (checkoutProducts.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-xl font-semibold text-gray-900">
          No products available for checkout
        </h2>

        <p className="text-gray-500 mt-2">
          Please return to your shopping bag and try again.
        </p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
            Checkout
          </h1>

          <p className="text-gray-500 mt-2">
            Review your order and complete your purchase.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Section */}
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

          {/* Right Section */}
          <div className="lg:col-span-1">
            <OrderSummary
              {...orderTotals}
              onPlaceOrder={handlePlaceOrder}
              placingOrder={placingOrder}
              disabled={!shippingAddress || !checkoutProducts.length}
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
