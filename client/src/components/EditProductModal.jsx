import { useEffect, useState } from "react";
import { X, ImagePlus, Trash2, LoaderCircle } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const EditProductModal = ({ product, onClose }) => {
  const updateProduct = useProductStore((state) => state.updateProduct);

  const isUpdatingProduct = useProductStore((state) => state.isUpdatingProduct);

  const [formData, setFormData] = useState({
    name: product.name || "",
    description: product.description || "",
    price: product.price ?? "",
    category: product.category || "",
  });

  const [image, setImage] = useState(undefined);
  const [preview, setPreview] = useState(product.image || "");
  const [removeImage, setRemoveImage] = useState(false);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && !isUpdatingProduct) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose, isUpdatingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
      setPreview(reader.result);
      setRemoveImage(false);
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage(undefined);
    setPreview("");
    setRemoveImage(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: Number(formData.price),
    };

    if (image !== undefined) {
      payload.image = image;
    } else if (removeImage) {
      payload.image = null;
    }

    const updatedProduct = await updateProduct(product._id, payload);

    if (updatedProduct) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isUpdatingProduct) {
          onClose();
        }
      }}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl animate-fadeSlideRight">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Product
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Update your product information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isUpdatingProduct}
            aria-label="Close edit product modal"
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Product Name */}
          <div>
            <label
              htmlFor="edit-name"
              className="mb-2 block text-sm font-medium text-gray-700">
              Product Name
            </label>

            <input
              id="edit-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="edit-description"
              className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              id="edit-description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="edit-price"
                className="mb-2 block text-sm font-medium text-gray-700">
                Price (₹)
              </label>

              <input
                id="edit-price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="edit-category"
                className="mb-2 block text-sm font-medium text-gray-700">
                Category
              </label>

              <input
                id="edit-category"
                name="category"
                type="text"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Product Image */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Product Image
            </label>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              {preview ? (
                <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl border border-gray-200">
                  <img
                    src={preview}
                    alt="Product preview"
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    aria-label="Remove product image"
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white shadow hover:bg-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50">
                  <ImagePlus className="text-gray-400" size={32} />
                </div>
              )}

              <div className="flex-1">
                <label
                  htmlFor="edit-image"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                  <ImagePlus size={17} />
                  Choose Image
                </label>

                <input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Select an image to replace the current one.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isUpdatingProduct}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50">
              Cancel
            </button>

            <button
              type="submit"
              disabled={isUpdatingProduct}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
              {isUpdatingProduct ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
