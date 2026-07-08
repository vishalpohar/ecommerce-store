import { ChevronLeft, ChevronRight, Handbag, Plus, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import { Link, useNavigate } from "react-router-dom";
import { formatPriceInRupees } from "../utils/formatCurrency";

const FeaturedProducts = ({ featuredProducts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  const { addToCart, isInCart } = useCartStore();
  const { user } = useUserStore();
  const navigate = useNavigate();

  const handleAddToCart = async (product) => {
    if (!user) {
      navigate("/login");
      return;
    }
    addToCart(product);
  };

  useEffect(() => {
    const handleResize = () => {
      // if (window.innerWidth < 640) setItemsPerPage(1);
      // else
      if (window.innerWidth < 640) setItemsPerPage(2);
      else if (window.innerWidth < 1280) setItemsPerPage(3);
      else setItemsPerPage(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + itemsPerPage, featuredProducts.length - itemsPerPage),
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - itemsPerPage, 0));
  };

  const isStartDisabled = currentIndex === 0;
  const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

  const visibleProducts = featuredProducts.slice(
    currentIndex,
    currentIndex + itemsPerPage,
  );

  return (
    <section className="py-10 lg:py-10 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Editor's Picks
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Carefully selected items that define this season's aesthetic
          </p>
        </div>

        {/* Products */}
        <div className="relative">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-2 h-[340px]">
            {visibleProducts.map((product) => {
              const inCart = isInCart(product._id);

              const originalPrice = Math.round(
                product.price + product.price * 0.2,
              );

              const hash = parseInt(product._id.slice(-6), 16);

              const rating = (4 + (hash % 11) / 10).toFixed(1);
              const reviewCount = 50 + (hash % 151);

              return (
                <div
                  key={product._id}
                  className="group bg-white shadow-sm md:hover:shadow-2xl border border-gray-100 overflow-hidden md:hover:-translate-y-4 transition-all duration-500">
                  <Link to={`/product-details/${product._id}`}>
                    <div className="relative overflow-hidden bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-6">
                    <Link to={`/product-details/${product._id}`}>
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        {product.category.toUpperCase()}
                      </p>
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 transition-colors md:text-lg leading-tight">
                        {product.name}
                      </h3>
                      <p className="inline-flex items-center text-sm text-gray-600 mb-2 line-clamp-2 gap-1">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        {rating} ({reviewCount})
                      </p>
                    </Link>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <p className="md:text-2xl font-bold text-gray-900">
                          {formatPriceInRupees(product?.price)}
                        </p>
                        <p className="text-sm xl:text-lg text-gray-500 line-through">
                          {formatPriceInRupees(originalPrice)}
                        </p>
                      </div>

                      {/* Cart Button */}
                      <button
                        onClick={() =>
                          inCart ? navigate("/cart") : handleAddToCart(product)
                        }
                        aria-label="Bag"
                        className={`hidden relative overflow-hidden text-sm font-semibold p-1 
                      transition-all duration-300 md:flex items-center justify-center shadow-sm group 
                      ${
                        inCart
                          ? "text-blue-600"
                          : "border border-gray-900 text-gray-900 rounded"
                      }`}>
                        {inCart ? (
                          <Handbag className="w-6 h-6" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          {featuredProducts.length > itemsPerPage && (
            <>
              <button
                onClick={prevSlide}
                aria-label="Previous Slide"
                disabled={isStartDisabled}
                className={`absolute -left-4 top-1/2 transform -translate-y-1/2 px-1 md:px-2 py-2 md:py-3 rounded-xl shadow-lg ${
                  isStartDisabled
                    ? "bg-gray-200 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:shadow-xl"
                }`}>
                <ChevronLeft size={25} />
              </button>

              <button
                onClick={nextSlide}
                aria-label="Next Slide"
                disabled={isEndDisabled}
                className={`absolute -right-4 top-1/2 transform -translate-y-1/2 px-1 md:px-2 py-2 md:py-3 rounded-xl shadow-lg ${
                  isEndDisabled
                    ? "bg-gray-200 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:shadow-xl"
                }`}>
                <ChevronRight size={25} />
              </button>
            </>
          )}
        </div>

        {/* Pagination */}
        {featuredProducts.length > itemsPerPage && (
          <div className="flex justify-center items-center space-x-3 mt-10">
            {Array.from({
              length: Math.ceil(featuredProducts.length / itemsPerPage),
            }).map((_, index) => (
              <button
                key={index}
                aria-label={`Open Product ${index}`}
                onClick={() => setCurrentIndex(index * itemsPerPage)}
                className={`rounded-full transition-all ${
                  index === Math.ceil(currentIndex / itemsPerPage)
                    ? "bg-blue-600 w-8 h-2"
                    : "bg-gray-300 w-2 h-2"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
