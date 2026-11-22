import { useState } from "react";
import { Loader, Image, X, Astroid } from "lucide-react";
import { toast } from "react-hot-toast";

import { useProductStore } from "../stores/useProductStore";
import { useAIStore } from "../stores/useAIStore";

const categories = [
  "pants",
  "shirts",
  "t-shirts",
  "shoes",
  "glasses",
  "jackets",
  "suits",
  "bags",
];

const AddProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });
  const [regenCount, setRegenCount] = useState(0);

  const { createProduct, loading } = useProductStore();
  const { getDescription, generating } = useAIStore();

  const generateDescription = async () => {
    const description = await getDescription(newProduct.name);

    if (!description) return;

    setNewProduct((prev) => ({ ...prev, description }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(newProduct);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
      });
      toast.success("Product created successfully!");
    } catch (error) {
      toast.error("Failed to create product");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setNewProduct({ ...newProduct, image: "" });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 transform transition-all duration-500">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Add New Product
        </h2>
        <p className="text-gray-600 mt-1">
          Create a new product for your store
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              className="w-full px-4 py-3 border text-gray-700 border-gray-300 outline-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-2">
              Price *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
              step="1"
              min="0"
              className="w-full px-4 py-3 text-gray-700 border border-gray-300 outline-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="0"
              required
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            className="w-full px-4 py-3 text-gray-700 border border-gray-300 outline-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            required>
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <div className="flex justify-between items-center">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <button
              type="button"
              onClick={() => {
                setRegenCount((prev) => prev + 1);
                generateDescription();
              }}
              disabled={!newProduct.name || generating}
              className="flex items-center gap-2 text-xs text-white bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 px-4 py-2 mb-2 rounded-full shadow-md hover:shadow-lg cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              {generating ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <p className="inline-flex gap-2">
                    <Astroid size={16} fill="white" />
                    {regenCount > 0 ? "Regenerate" : "Generate"}
                  </p>
                </>
              )}
            </button>
          </div>

          <textarea
            id="description"
            name="description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            rows="4"
            className="w-full px-4 py-3 text-gray-700 border border-gray-300 outline-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
            placeholder="Enter product description..."
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Image *
          </label>

          {newProduct.image ? (
            <div className="relative">
              <img
                src={newProduct.image}
                alt="Product preview"
                className="w-32 h-32 object-cover rounded-xl border border-gray-300"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors duration-200">
              <input
                type="file"
                id="image"
                className="sr-only"
                accept="image/*"
                onChange={handleImageChange}
              />
              <label
                htmlFor="image"
                className="cursor-pointer flex flex-col items-center gap-3">
                <Image className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Click to upload image
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </label>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !newProduct.image}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Adding Product...
            </>
          ) : (
            <p>Add Product</p>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
