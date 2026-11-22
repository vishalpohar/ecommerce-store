import { Link } from "react-router-dom";
import { ShoppingCart, Package } from "lucide-react";

const EmptyOrdersPage = () => (
  <div className="min-h-[90vh] flex items-center justify-center px-4 transition-all duration-500">
    <div className="text-center max-w-md">
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
          <Package className="h-16 w-16 text-blue-400" />
        </div>
      </div>

      <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
        No Orders Yet
      </h3>
      <p className="text-gray-600 mb-8 leading-relaxed">
        You haven't placed any orders yet. Discover our amazing products and
        make your first purchase!
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/"
          className="inline-flex items-center justify-center px-8 py-3 text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
          Start Shopping
          <ShoppingCart className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </div>
  </div>
);

export default EmptyOrdersPage;
