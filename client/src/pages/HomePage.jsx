import { RefreshCw, ShieldCheck, Truck } from "lucide-react";
import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import FeaturedProducts from "../components/FeaturedProducts";
import { useProductStore } from "../stores/useProductStore";
import Carousel from "../components/Carousel";
import SkeletonLoader from "../components/SkeletonLoader";

const HIGHLIGHTS = [
  {
    icon: Truck,
    title: "Fast Delivery",
    desc: "Free shipping on orders above ₹999",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    desc: "Hassle-free 7-day exchanges",
  },
  {
    icon: ShieldCheck,
    title: "Secure Checkout",
    desc: "Encrypted & trusted payments",
  },
];

const HomePage = () => {
  const {
    fetchFeaturedProducts,
    featuredProducts,
    isFetchingFeaturedProducts,
  } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div className="min-h-[90vh] bg-gradient-to-b from-gray-50/80 via-white to-white">
      {/* Hero Carousel */}
      <section aria-label="Featured promotions">
        <Carousel />
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* Trust Strip */}
        <div className="flex flex-wrap lg:grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14 lg:mb-20">
          {HIGHLIGHTS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex-1 flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs">
              <div className="p-2.5 rounded-xl bg-gray-100 text-gray-800 shrink-0">
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{title}</p>
                <p className="hidden lg:block text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Categories Section */}
        <section
          className="mb-16 lg:mb-24"
          aria-labelledby="categories-heading">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Curated Essentials
            </span>
            <h1
              id="categories-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mt-2 mb-3 tracking-tight">
              Explore Our Collection
            </h1>
            <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto">
              Discover curated fashion pieces that blend timeless style with
              everyday comfort.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            <CategoryItem />
          </div>
        </section>

        {/* Featured Products */}
        <section aria-label="Featured products">
          {!isFetchingFeaturedProducts && featuredProducts.length > 0 ? (
            <FeaturedProducts featuredProducts={featuredProducts} />
          ) : (
            <div className="flex gap-4 h-80 overflow-x-auto pb-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div className="w-[180px] md:w-[220px] shrink-0" key={index}>
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
