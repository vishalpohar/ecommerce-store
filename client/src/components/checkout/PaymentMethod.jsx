import { CreditCard, CheckCircle2, ShieldCheck } from "lucide-react";

const PaymentMethod = ({ paymentMethod, setPaymentMethod }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard className="w-5 h-5 text-blue-600" />

        <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
      </div>

      <div className="space-y-3">
        <label
          className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
            paymentMethod === "card"
              ? "border-blue-500 bg-blue-50/50"
              : "border-gray-200 hover:border-gray-300"
          }`}>
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={paymentMethod === "card"}
            onChange={() => setPaymentMethod("card")}
            className="accent-blue-600"
          />

          <CreditCard className="w-6 h-6 text-gray-600" />

          <div className="flex-1">
            <p className="font-medium text-gray-900">Credit / Debit Card</p>

            <p className="text-sm text-gray-500">
              Secure payment through Stripe
            </p>
          </div>

          {paymentMethod === "card" && (
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
          )}
        </label>
      </div>

      <div className="flex items-start gap-2 mt-5 text-sm text-gray-500">
        <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />

        <p>
          Your payment information is securely processed by Stripe. We do not
          store your card details.
        </p>
      </div>

      <p className="text-sm text-gray-400 mt-4">
        Cash on Delivery is currently unavailable.
      </p>
    </div>
  );
};

export default PaymentMethod;
