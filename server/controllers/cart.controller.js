import mongoose from "mongoose";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

export const getCartProducts = async (req, res, next) => {
  try {
    const cartItems = req.user.cartItems;

    const products = await Product.find({
      _id: { $in: cartItems.map((item) => item.product) },
    });

    const formattedCart = products.map((product) => {
      const item = cartItems.find(
        (item) => item.product.toString() === product._id.toString(),
      );
      return { ...product.toJSON(), quantity: item.quantity };
    });

    res.json(formattedCart);
  } catch (error) {
    return next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(productId)) {
      return next(new ApiError(400, "Invalid product ID"));
    }

    const productExists = await Product.exists({ _id: productId });

    if (!productExists) {
      return next(new ApiError(404, "Product not found"));
    }

    // Increment the quantity if product already exists
    const incrementResult = await User.updateOne(
      { _id: userId, "cartItems.product": productId },
      { $inc: { "cartItems.$.quantity": 1 } },
    );

    if (incrementResult.matchedCount === 0) {
      // Otherwise, add a new product
      const pushResult = await User.updateOne(
        { _id: userId, "cartItems.product": { $ne: productId } },
        { $push: { cartItems: { product: productId, quantity: 1 } } },
      );

      // Handle another request adding the same product concurrently
      if (pushResult.matchedCount === 0) {
        await User.updateOne(
          { _id: userId, "cartItems.product": productId },
          { $inc: { "cartItems.$.quantity": 1 } },
        );
      }
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

    const user = await User.findOneAndUpdate({_id: req.user._id, "cartItems.product": productId}, {$pull: {cartItems: {product: productId},},},{
      new: true,
    }).select("cartItems");

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
    const { quantity } = req.body;

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
      user = await User.findOneAndUpdate(
        {
          _id: req.user._id,
          "cartItems.product": productId,
        },
        {
          $set: {
            "cartItems.$[item].quantity": quantity,
          },
        },
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
