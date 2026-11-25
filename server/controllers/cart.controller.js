import mongoose from "mongoose";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

export const getCartProducts = async (req, res, next) => {
  try {
    const cartItems = req.user.cartItems;

    if (!cartItems.length) return res.json([]);

    const products = await Product.find({
      _id: { $in: cartItems.map((item) => item.product) },
    });

    const formattedCart = products.map((product) => {
      const item = cartItems.find(
        (i) => i.product.toString() === product._id.toString(),
      );

      const validSize =
        item.size && product.sizes?.includes(item.size)
          ? item.size
          : product.sizes?.[0] || "One Size";

      return {
        ...product.toJSON(),
        quantity: item.quantity,
        size: item.size || "One Size",
      };
    });

    res.json(formattedCart);
  } catch (error) {
    return next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, size = "One Size", quantity = 1 } = req.body;
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(productId)) {
      return next(new ApiError(400, "Invalid product ID"));
    }

    const productExists = await Product.exists({ _id: productId });

    if (!productExists) {
      return next(new ApiError(404, "Product not found"));
    }

    // If product is already in cart, update its size and increment quantity
    const updateResult = await User.updateOne(
      { _id: userId, "cartItems.product": productId },
      {
        $inc: { "cartItems.$.quantity": quantity },
        $set: { "cartItems.$.size": size },
      },
    );

    if (updateResult.matchedCount === 0) {
      await User.updateOne(
        { _id: userId, "cartItems.product": { $ne: productId } },
        { $push: { cartItems: { product: productId, size, quantity } } },
      );
    }

    const user = await User.findById(userId).select("cartItems");

    res.json(user.cartItems);
  } catch (error) {
    return next(error);
  }
};

export const removeProductFromCart = async (req, res, next) => {
  try {
    const { id: productId } = req.params;

    if (!productId) {
      return next(new ApiError(400, "Product ID is required"));
    }

    const user = await User.findOneAndUpdate(
      { _id: req.user._id, "cartItems.product": productId },
      { $pull: { cartItems: { product: productId } } },
      { new: true },
    ).select("cartItems");

    if (!user) {
      return next(new ApiError(404, "Product not found in cart"));
    }

    return res.status(200).json(user.cartItems);
  } catch (error) {
    return next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { cartItems: [] } },
      { new: true },
    );
    res
      .status(200)
      .json({ success: true, message: "Cart cleared successfully" });
  } catch (error) {
    return next(error);
  }
};

export const updateQuantity = async (req, res, next) => {
  try {
    const { id: productId } = req.params;
    const { quantity, size } = req.body;

    if (!Number.isInteger(quantity) || quantity < 0) {
      return next(new ApiError(400, "Invalid quantity"));
    }

    let user;

    if (quantity === 0) {
      user = await User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: {
            cartItems: { product: productId },
          },
        },
        { new: true },
      ).select("cartItems");
    } else {
      const updateFields = { "cartItems.$[item].quantity": quantity };
      if (size) {
        updateFields["cartItems.$[item].size"] = size;
      }

      user = await User.findOneAndUpdate(
        { _id: req.user._id, "cartItems.product": productId },
        { $set: updateFields },
        { new: true, arrayFilters: [{ "item.product": productId }] },
      ).select("cartItems");
    }

    if (!user) {
      return next(new ApiError(404, "Product not found in cart"));
    }

    res.json(user.cartItems);
  } catch (error) {
    return next(error);
  }
};
