import { useEffect, useState } from "react";
import { useCartStore } from "../stores/useCartStore";
import { Tag } from "lucide-react";

const GiftCouponCard = () => {
  const [userInputCode, setUserInputCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { coupon, isCouponApplied, applyCoupon, getMyCoupon, removeCoupon } =
    useCartStore();

  useEffect(() => {
    getMyCoupon();
  }, []);

  useEffect(() => {
    if (coupon) setUserInputCode(coupon.code);
  }, [coupon]);

  const handleApplyCoupon = async () => {
    if (!userInputCode.trim()) return;

    setIsLoading(true);
    try {
      await applyCoupon(userInputCode);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    setIsLoading(true);
    try {
      await removeCoupon();
      setUserInputCode("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transform transition-all duration-500 hover:shadow-lg">
      <div className="space-y-4">
        {/* Input Field */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            {!isCouponApplied && (
              <input
                type="text"
                className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                placeholder="e.g. SUMMER25"
                value={userInputCode}
                onChange={(e) => setUserInputCode(e.target.value.toUpperCase())}
                disabled={isCouponApplied}
              />
            )}
          </div>

          {/* Action Buttons */}
          {isCouponApplied && coupon ? (
            <div className="w-full flex justify-center items-center gap-3">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    {coupon.code} - {coupon.discountPercentage}% off applied
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="flex items-center justify-center text-md py-1 px-2 text-red-600 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Remove"
                onClick={handleRemoveCoupon}
                disabled={isLoading}>
                {isLoading ? "Removing..." : "Remove"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm font-semibold rounded-md py-2 px-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Apply Coupon"
              onClick={handleApplyCoupon}
              disabled={!userInputCode.trim() || isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Applying...
                </div>
              ) : (
                "Apply Coupon"
              )}
            </button>
          )}
        </div>

        {/* Available Coupon Info */}
        {coupon && !isCouponApplied && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              You have a coupon available: <strong>{coupon.code}</strong> -{" "}
              {coupon.discountPercentage}% off
            </p>
          </div>
        )}
      </div>

      {/* Help Text */}
      <p className="text-xs text-gray-500 mt-4 text-center">
        Enter your coupon code above to apply discount to your order
      </p>
    </div>
  );
};

export default GiftCouponCard;
