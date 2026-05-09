import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import FeaturedProducts from "../components/FeaturedProducts";
import { useProductStore } from "../stores/useProductStore";
import AutoCarousel from "../components/AutoCarousel";
import SkeletonLoader from "../components/SkeletonLoader";

const HomePage = () => {
  const {
    fetchFeaturedProducts,
    featuredProducts,
    isFetchingFeaturedProducts,
  } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-[90vh] bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Carousel */}
      <div className="relative">
        <AutoCarousel />
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* Categories Section */}
        <section className="mb-16 lg:mb-24">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-gray-900 mb-4 animate-fadeSlideUp">
              Explore Our Collection
            </h1>
            <p className="text-sm md:text-xl text-gray-600 max-w-2xl mx-auto animate-fadeSlideUp">
              Discover curated fashion pieces that blend style with
              sustainability
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            <CategoryItem />
          </div>
        </section>

        {/* Featured Products */}
        <section>
          {featuredProducts.length > 0 ? (
            <FeaturedProducts featuredProducts={featuredProducts} />
          ) : (
            <div className="w-full flex gap-2 h-80 overflow-x-auto">
              {Array.from({ length: 6 }).map((_, index) => (
                <div className="w-[180px] flex-shrink-0" key={index}>
                  <SkeletonLoader />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
