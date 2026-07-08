import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    image: {
      type: String,
      required: [true, "image is required"],
    },
    category: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

productSchema.index({ category: 1, createdAt: -1 });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ category: 1, price: -1 });
productSchema.index({ seller: 1, createdAt: -1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ name: "text", category: "text" });

const Product = mongoose.model("Product", productSchema);

export default Product;
