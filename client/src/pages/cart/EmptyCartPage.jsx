import { ArrowRight, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const EmptyCartPage = () => (
  <div className="min-h-[90vh] flex items-center justify-center px-4 transition-all duration-500">
    <div className="text-center max-w-md">
      <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-10">
        <ShoppingCart className="h-16 w-16 text-blue-400" />
      </div>

      <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
        Your cart is empty
      </h3>
      <p className="text-gray-600 mb-8 leading-relaxed">
        Looks like you haven't added anything to your cart yet.
      </p>

      <Link
        to="/"
        className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
        Start Shopping
        <ArrowRight className="ml-2 w-5 h-5" />
      </Link>
    </div>
  </div>
);

export default EmptyCartPage;
