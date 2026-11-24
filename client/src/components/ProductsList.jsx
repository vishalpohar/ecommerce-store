import { Edit, Eye, Package, Star, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import { formatPriceInRupees } from "../utils/formatCurrency";
import EditProductModal from "./EditProductModal";
import { ThreeDotsLoader } from "./LoadingSpinner";

const getOptimizedThumb = (url) => {
  if (!url || !url.includes("/upload/")) return url;
  return url.replace("/upload/", "/upload/f_auto,q_auto,w_120,c_limit/");
};

const ProductsList = () => {
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const {
    fetchSellerProducts,
    deleteProduct,
    toggleFeaturedProduct,
    products,
    totalPages,
    isFetchingSellerProducts,
  } = useProductStore();

  const loadMoreRef = useRef(null);

  useEffect(() => {
    fetchSellerProducts(1);
  }, [fetchSellerProducts]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isFetchingSellerProducts &&
          page < totalPages
        ) {
          const nextPage = page + 1;
          fetchSellerProducts(nextPage);
          setPage(nextPage);
        }
      },
      { rootMargin: "100px" },
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [page, totalPages, isFetchingSellerProducts, fetchSellerProducts]);

  const hasProducts = products && products.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-5 sm:px-6 py-4 border-b border-gray-100 bg-gray-50/70 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            {products?.length || 0}{" "}
            {products?.length === 1 ? "product" : "products"} loaded
          </p>
        </div>
      </div>

      {/* Table */}
      {hasProducts && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/60 border-b border-gray-100">
              <tr>
                <th
                  scope="col"
                  className="px-5 sm:px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th
                  scope="col"
                  className="px-5 sm:px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th
                  scope="col"
                  className="px-5 sm:px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th
                  scope="col"
                  className="px-5 sm:px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th
                  scope="col"
                  className="px-5 sm:px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50/70 transition-colors duration-150">
                  <td className="px-5 sm:px-6 py-4">
                    <div className="flex items-center gap-3.5 max-w-xs sm:max-w-sm">
                      <div className="shrink-0 h-12 w-12 bg-gray-100 rounded-xl overflow-hidden border border-gray-200/80">
                        <img
                          className="h-12 w-12 object-cover"
                          src={getOptimizedThumb(product.image)}
                          alt={product.name}
                          loading="lazy"
                          decoding="async"
                          width={48}
                          height={48}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 sm:px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900 tabular-nums">
                      {formatPriceInRupees(product.price)}
                    </span>
                  </td>

                  <td className="px-5 sm:px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20 capitalize">
                      {product.category}
                    </span>
                  </td>

                  <td className="px-5 sm:px-6 py-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => toggleFeaturedProduct(product._id)}
                      aria-label={
                        product.isFeatured
                          ? `Remove ${product.name} from featured`
                          : `Mark ${product.name} as featured`
                      }
                      aria-pressed={product.isFeatured}
                      className={`p-2 rounded-xl transition-colors duration-200 ${
                        product.isFeatured
                          ? "bg-amber-50 text-amber-500 hover:bg-amber-100"
                          : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                      }`}>
                      <Star
                        aria-hidden="true"
                        className={`h-4 w-4 ${
                          product.isFeatured ? "fill-current" : ""
                        }`}
                      />
                    </button>
                  </td>

                  <td className="px-5 sm:px-6 py-4 whitespace-nowrap text-right">
                    <div className="inline-flex items-center gap-1">
                      <Link
                        to={`/product-details/${product._id}`}
                        aria-label={`View ${product.name}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-200">
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setSelectedProduct(product)}
                        aria-label={`Edit ${product.name}`}
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors duration-200">
                        <Edit className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProduct(product._id)}
                        aria-label={`Delete ${product.name}`}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200">
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Infinite scroll trigger */}
          <div ref={loadMoreRef} className="h-6" />
        </div>
      )}

      {isFetchingSellerProducts && (
        <div className="flex justify-center py-6">
          <ThreeDotsLoader height="10" color="#4b5563" />
        </div>
      )}

      {/* Empty State */}
      {!isFetchingSellerProducts && !hasProducts && (
        <div className="min-h-[36vh] flex flex-col justify-center items-center text-center py-12 px-4">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <Package className="h-7 w-7 text-gray-400" aria-hidden="true" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            No products in inventory
          </h3>
          <p className="text-sm text-gray-500 max-w-sm">
            Get started by adding your first product from the Add Product tab.
          </p>
        </div>
      )}

      {selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductsList;
