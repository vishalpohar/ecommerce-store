import { ArrowLeft, ArrowRight, Package } from "lucide-react";
import { useEffect, useState } from "react";

import { useProductStore } from "../../stores/useProductStore";
import EmptyOrdersPage from "./EmptyOrdersPage";
import OrderDetailsCard from "./OrderDetailsCard";

const OrderSkeleton = () => (
  <div
    aria-hidden="true"
    className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden">
    <div className="px-5 py-4 bg-gray-50/70 border-b border-gray-100 flex justify-between items-center">
      <div className="flex gap-6">
        <div className="h-9 w-28 shimmer rounded-md" />
        <div className="h-9 w-28 shimmer rounded-md" />
        <div className="h-9 w-24 shimmer rounded-md" />
      </div>
      <div className="h-6 w-24 shimmer rounded-full" />
    </div>
    <div className="p-5 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="h-22 shimmer rounded-xl" />
        <div className="h-22 shimmer rounded-xl hidden md:block" />
      </div>
      <div className="h-16 w-2/3 shimmer rounded-xl" />
    </div>
  </div>
);

const OrdersPage = () => {
  const [page, setPage] = useState(1);
  const { ordersByPage, totalPages, getMyOrders, isFetchingOrders } =
    useProductStore();

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isPreviousDisabled = page === 1;
  const isNextDisabled = page >= totalPages;

  useEffect(() => {
    getMyOrders(page);
  }, [page, getMyOrders]);

  const currentOrders = ordersByPage[page] || [];

  if (!isFetchingOrders && currentOrders.length === 0) {
    return <EmptyOrdersPage />;
  }

  return (
    <div className="min-h-[90vh] bg-gradient-to-b from-gray-50/70 to-white py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b border-gray-200/80">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              <Package className="w-3.5 h-3.5" aria-hidden="true" />
              Order History
            </span>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-1.5 tracking-tight">
              Your Orders
            </h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              Track shipments, review items, and manage your purchases.
            </p>
          </div>

          {totalPages > 1 && (
            <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-xs sm:text-sm font-medium text-gray-700 shadow-2xs">
              Page {page} of {totalPages}
            </span>
          )}
        </header>

        {/* Orders List */}
        <section aria-label="Orders list">
          {isFetchingOrders ? (
            <div className="space-y-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <OrderSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {currentOrders.map((order) => (
                <OrderDetailsCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            aria-label="Orders pagination"
            className="flex justify-center items-center gap-3 mt-12">
            <button
              type="button"
              onClick={() => handlePageChange(page - 1)}
              disabled={isPreviousDisabled}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isPreviousDisabled
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-gray-400 hover:text-gray-900 shadow-2xs"
              }`}>
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Previous
            </button>

            <span className="px-3 text-sm text-gray-500 tabular-nums">
              <strong className="font-semibold text-gray-900">{page}</strong> /{" "}
              {totalPages}
            </span>

            <button
              type="button"
              onClick={() => handlePageChange(page + 1)}
              disabled={isNextDisabled}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isNextDisabled
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-gray-400 hover:text-gray-900 shadow-2xs"
              }`}>
              Next
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </nav>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
