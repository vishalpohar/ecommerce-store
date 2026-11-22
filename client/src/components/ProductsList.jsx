import { useEffect, useRef, useState } from "react";
import { Trash, Star, Edit, Eye, Package } from "lucide-react";
import EditProductModal from "./EditProductModal";
import { useProductStore } from "../stores/useProductStore";
import { formatPriceInRupees } from "../utils/formatCurrency";
import { Link } from "react-router-dom";
import { ThreeDotsLoader } from "./LoadingSpinner";

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
    fetchSellerProducts();
  }, []);

  const loadMore = () => {
    fetchSellerProducts(page + 1);
    setPage((p) => p + 1);
  };

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && !isFetchingSellerProducts && page < totalPages) {
          loadMore();
        }
      },
      {
        rootMargin: "100px", // preload before reaching bottom
      },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [page, totalPages, isFetchingSellerProducts]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-900">
          Products Management
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {products?.length || 0} products in inventory
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Featured
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {products?.map((product) => (
              <tr
                key={product._id}
                className="hover:bg-gray-50 transition-colors duration-150 animate-fadeSlideRight">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        className="h-12 w-12 object-cover"
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">
                        {product.name?.substring(0, 50)}
                        {product.name?.length > 50 && "..."}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-1">
                        {product.description?.substring(0, 50)}
                        {product.description?.length > 50 && "..."}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatPriceInRupees(product.price)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleFeaturedProduct(product._id)}
                    aria-label={`Featured: ${product.isFeatured}`}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      product.isFeatured
                        ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    }`}>
                    <Star
                      className={`h-4 w-4 ${
                        product.isFeatured ? "fill-current" : ""
                      }`}
                    />
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/product-details/${product._id}`}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => setSelectedProduct(product)}
                      aria-label={`Edit ${product.name}`}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      aria-label="Trash"
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* 👇 Infinite scroll trigger */}
        <div ref={loadMoreRef} className="h-10" />

        {isFetchingSellerProducts && (
          <ThreeDotsLoader height="10" color="#4b5563" />
        )}
      </div>

      {/* Empty State */}
      {(!products || products.length === 0) && (
        <div className="min-h-[40vh] flex flex-col justify-center items-center text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600 max-w-sm mx-auto">
            Get started by creating your first product in the inventory.
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
