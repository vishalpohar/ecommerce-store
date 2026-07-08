import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getCartProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ _id: { $in: req.user.cartItems } });

    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItem) => cartItem.id === product.id,
      );
      return { ...product.toJSON(), quantity: item.quantity };
    });

    res.json(cartItems);
  } catch (error) {
    return next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push(productId);
    }

    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    return next(error);
  }
};

export const removeProductFromCart = async (req, res, next) => {
  try {
    const { id: productId } = req.params;
    const user = req.user;
    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter(
        (item) => item._id.toString() !== productId,
      );
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    return next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const user = req.user;
    await User.findOneAndUpdate(
      user._id,
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
    const user = req.user;
    const existingItem = user.cartItems.find((item) => item.id === productId);

    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        await user.save();
        return res.json(user.cartItems);
      }
      existingItem.quantity = quantity;
      await user.save();
      res.json(user.cartItems);
    } else {
      return next(new ApiError(404, "Product not found"));
    }
  } catch (error) {
    return next(error);
  }
};
