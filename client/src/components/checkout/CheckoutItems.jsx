import { Package } from "lucide-react";
import { formatPriceInRupees } from "../../utils/formatCurrency";

const CheckoutItems = ({ products = [] }) => {
  const totalQuantity = products.reduce(
    (sum, product) => sum + product.quantity,
    0,
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
        </div>

        <span className="text-sm text-gray-500">{totalQuantity} items</span>
      </div>

      <div className="divide-y divide-gray-100">
        {products.map((product) => (
          <div
            key={product._id}
            className="flex gap-4 py-5 first:pt-0 last:pb-0">
            <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 line-clamp-2">
                {product.name}
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Quantity: {product.quantity}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Unit Price: {formatPriceInRupees(product.price)}
              </p>

              <p className="font-semibold text-gray-900 mt-2">
                {formatPriceInRupees(product.price * product.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutItems;
