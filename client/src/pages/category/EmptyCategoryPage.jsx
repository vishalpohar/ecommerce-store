const EmptyCategoryPage = () => (
  <div className="h-[80vh] flex flex-col justify-center items-center text-center">
    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
      <img src="/productNotFound.jpg" alt="Product not found" width="350px" height="350px" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      No products found
    </h3>
    <p className="max-w-[350px] text-gray-600">
      We couldn't find any products in this category. Try checking other
      categories.
    </p>
  </div>
);

export default EmptyCategoryPage;
