import { ChevronDown, ImagePlus, Loader2, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { useAIStore } from "../stores/useAIStore";
import { useProductStore } from "../stores/useProductStore";

const CATEGORIES = [
  "pants",
  "shirts",
  "t-shirts",
  "shoes",
  "glasses",
  "jackets",
  "suits",
  "bags",
];

const INITIAL_STATE = {
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
};

const AddProductForm = () => {
  const [newProduct, setNewProduct] = useState(INITIAL_STATE);
  const [regenCount, setRegenCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const { createProduct, loading } = useProductStore();
  const { getDescription, generating } = useAIStore();

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const generateDescription = async () => {
    if (!newProduct.name.trim()) return;
    const description = await getDescription(newProduct.name.trim());
    if (!description) return;

    setRegenCount((prev) => prev + 1);
    setNewProduct((prev) => ({ ...prev, description }));
  };

  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProduct((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e) => {
    processFile(e.target.files?.[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(newProduct);
      setNewProduct(INITIAL_STATE);
      setRegenCount(0);
      toast.success("Product created successfully!");
    } catch {
      toast.error("Failed to create product");
    }
  };

  const inputBase =
    "w-full px-4 py-2.5 text-sm sm:text-base text-gray-800 bg-gray-50/70 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Row 1: Name & Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1.5">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={newProduct.name}
            onChange={handleFieldChange}
            className={inputBase}
            placeholder="e.g., 100% Cotton Relaxed Fit Trousers"
            required
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 mb-1.5">
            Price (INR) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span
              aria-hidden="true"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium select-none">
              ₹
            </span>
            <input
              type="number"
              id="price"
              name="price"
              value={newProduct.price}
              onChange={handleFieldChange}
              step="1"
              min="0"
              className={`${inputBase} pl-9 tabular-nums`}
              placeholder="1299"
              required
            />
          </div>
        </div>
      </div>

      {/* Row 2: Category */}
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-1.5">
          Category <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            id="category"
            name="category"
            value={newProduct.category}
            onChange={handleFieldChange}
            className={`${inputBase} appearance-none pr-10 cursor-pointer`}
            required>
            <option value="">Select a category</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          />
        </div>
      </div>

      {/* Row 3: Description + AI Generator */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>

          <button
            type="button"
            onClick={generateDescription}
            disabled={!newProduct.name.trim() || generating}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:brightness-110 px-3.5 py-1.5 rounded-full shadow-xs hover:shadow-md transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed">
            {generating ? (
              <>
                <Loader2
                  className="w-3.5 h-3.5 animate-spin"
                  aria-hidden="true"
                />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>
                  {regenCount > 0 ? "Regenerate with AI" : "Generate with AI"}
                </span>
              </>
            )}
          </button>
        </div>

        <textarea
          id="description"
          name="description"
          value={newProduct.description}
          onChange={handleFieldChange}
          rows={4}
          className={`${inputBase} resize-none`}
          placeholder="Describe fabric, fit, and key features..."
          required
        />
      </div>

      {/* Row 4: Image Upload */}
      <div>
        <span className="block text-sm font-medium text-gray-700 mb-1.5">
          Product Image <span className="text-red-500">*</span>
        </span>

        {newProduct.image ? (
          <div className="relative inline-block">
            <img
              src={newProduct.image}
              alt="Product preview"
              className="w-36 h-36 object-cover rounded-2xl border border-gray-200 shadow-xs"
            />
            <button
              type="button"
              onClick={() => setNewProduct((prev) => ({ ...prev, image: "" }))}
              aria-label="Remove uploaded image"
              className="absolute -top-2 -right-2 p-1.5 bg-gray-900 text-white rounded-full shadow-md hover:bg-red-600 transition-colors">
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="image"
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center gap-2.5 border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors duration-200 ${
              isDragging
                ? "border-blue-500 bg-blue-50/50"
                : "border-gray-200 bg-gray-50/50 hover:border-gray-400 hover:bg-gray-50"
            }`}>
            <input
              type="file"
              id="image"
              className="sr-only"
              accept="image/*"
              onChange={handleImageChange}
            />
            <div className="p-3 rounded-xl bg-white border border-gray-200/80 shadow-2xs text-gray-500">
              <ImagePlus className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Click to upload{" "}
                <span className="text-gray-500 font-normal">
                  or drag and drop
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                PNG, JPG, WebP up to 5MB
              </p>
            </div>
          </label>
        )}
      </div>

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading || !newProduct.image}
          className="w-full sm:w-auto sm:min-w-48 inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-blue-600 text-white text-sm sm:text-base font-semibold py-3 px-6 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              <span>Adding Product...</span>
            </>
          ) : (
            <span>Add Product</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default AddProductForm;
