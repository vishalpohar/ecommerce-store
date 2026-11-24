import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { href: "/pants", name: "Pants", imageName: "jeans", alt: "Pants Category" },
  {
    href: "/shirts",
    name: "Shirts",
    imageName: "shirts",
    alt: "Shirts Category",
  },
  {
    href: "/t-shirts",
    name: "T-shirts",
    imageName: "tshirts",
    alt: "T-shirts Category",
  },
  { href: "/shoes", name: "Shoes", imageName: "shoes", alt: "Shoes Category" },
  {
    href: "/glasses",
    name: "Glasses",
    imageName: "glasses",
    alt: "Glasses Category",
  },
  {
    href: "/jackets",
    name: "Jackets",
    imageName: "jackets",
    alt: "Jackets Category",
  },
  { href: "/bags", name: "Bags", imageName: "bags", alt: "Bags Category" },
];

const CategoryItem = () => {
  return (
    <>
      {categories.map((category, index) => (
        <Link
          key={category.href}
          to={`/category${category.href}`}
          className={`group relative block overflow-hidden rounded-2xl h-64 sm:h-72 lg:h-96 w-full bg-gray-100 shadow-xs hover:shadow-lg transition-shadow duration-300 ${
            index === 0 ? "col-span-2 lg:col-span-2" : ""
          }`}>
          {/* Background Image */}
          <img
            src={`/products/${category.imageName}.avif`}
            alt={category.alt}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
            decoding="async"
            width={512}
            height={768}
          />

          {/* Multi-stop Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Top-right Interactive Badge */}
          <div
            aria-hidden="true"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 backdrop-blur-md border border-gray-400 flex items-center justify-center text-gray-700 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>

          {/* Text */}
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 z-10">
            <h2 className="text-white text-xl sm:text-2xl lg:text-3xl font-serif font-bold tracking-tight">
              {category.name}
            </h2>
            <p className="inline-flex items-center gap-1 text-gray-200 text-xs sm:text-sm mt-1 group-hover:text-white transition-colors">
              Explore Collection
            </p>
          </div>
        </Link>
      ))}
    </>
  );
};

export default CategoryItem;
