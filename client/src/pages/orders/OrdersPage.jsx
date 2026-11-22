import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { useProductStore } from "../../stores/useProductStore";

import SkeletonLoader from "../../components/SkeletonLoader";
import EmptyOrdersPage from "./EmptyOrdersPage";
import OrderDetailsCard from "./OrderDetailsCard";

const OrdersPage = () => {
  const [page, setPage] = useState(1);
  const { ordersByPage, totalPages, getMyOrders, isFetchingOrders } =
    useProductStore();

  const handleNext = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const handlePrevious = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const isPreviousDisabled = page === 1;
  const isNextDisabled = page === totalPages;

  useEffect(() => {
    getMyOrders(page);
  }, [page]);

  const currentOrders = ordersByPage[page] || [];
  if (!isFetchingOrders && currentOrders.length === 0) {
    return <EmptyOrdersPage />;
  }

  console.log(currentOrders);

  return (
    <div className="min-h-[90vh] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-700 mb-2">Your Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {isFetchingOrders ? (
          <div className="grid grid-cols-1 gap-4 p-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonLoader key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {currentOrders?.map((order) => {
              return <OrderDetailsCard key={order._id} order={order} />;
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={handlePrevious}
              aria-label="Previous"
              disabled={isPreviousDisabled}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                isPreviousDisabled
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-sm"
              }`}>
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-2">
              <span className="text-gray-600">Page</span>
              <span className="font-semibold text-gray-900">{page}</span>
              <span className="text-gray-600">of {totalPages}</span>
            </div>

            <button
              onClick={handleNext}
              aria-label="Next"
              disabled={isNextDisabled}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                isNextDisabled
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-sm"
              }`}>
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
