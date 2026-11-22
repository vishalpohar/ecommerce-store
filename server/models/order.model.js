import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },

        image: {
          type: String,
        },
        imagePublicId: {
          type: String,
          default: null,
        },
        seller: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        itemTotal: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    // Immutable shipping address snapshot
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["card"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    stripeSessionId: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true },
);

orderSchema.index({ createdAt: 1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ "products.product": 1 });
orderSchema.index({ user: 1, "products.product": 1 });
orderSchema.index({ "products.seller": 1 });
orderSchema.index({ "products.seller": 1, createdAt: 1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;
