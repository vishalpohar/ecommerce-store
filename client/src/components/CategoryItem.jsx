import { Link } from "react-router-dom";

const categories = [
  { href: "/pants", name: "Pants", imageName: "jeans", alt: "Jeans Category" },
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
    alt: "Tshirts Category",
  },
  { href: "/shoes", name: "Shoes", imageName: "shoes", alt: "Jeans Category" },
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
      {categories.map((category) => (
        <Link
          key={category.href}
          to={`/category${category.href}`}
          className="group block relative overflow-hidden h-64 md:h-80 lg:h-96 w-full bg-gray-100">
          {/* Background Image */}
          <img
            src={`/products/${category.imageName}-400.webp`}
            srcSet={`/products/${category.imageName}-300.webp 300w, /products/${category.imageName}-300.webp 400w`}
            alt={category.alt}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
            width={300}
            height={450}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Text */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
            <h3 className="text-white text-2xl md:text-3xl font-bold tracking-tight">
              {category.name}
            </h3>
            <p className="text-gray-200 text-sm md:text-base mt-1">
              Explore Collection
            </p>
          </div>
        </Link>
      ))}
    </>
  );
};

export default CategoryItem;
