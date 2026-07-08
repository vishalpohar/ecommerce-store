import Product from "../models/product.model.js";

export const addToWishlist = async (req, res, next) => {
  try {
    const { id: productId } = req.params;
    const user = req.user;

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
    }

    await user.save();
    res.status(201).json(user.wishlist);
  } catch (error) {
    return next(error);
  }
};

export const getWishlistProducts = async (req, res, next) => {
  try {
    const wishlistProducts = await Product.find(
      {
        _id: { $in: req.user.wishlist },
      },
      { _id: 1, name: 1, image: 1, price: 1 },
    ).lean();
    res.status(200).json(wishlistProducts);
  } catch (error) {
    return next(error);
  }
};

export const removeWishlistProduct = async (req, res, next) => {
  try {
    const { id: productId } = req.params;
    const user = req.user;

    user.wishlist = user.wishlist.filter(
      (item) => item.toString() != productId,
    );

    await user.save();
    res.status(200).json(user.wishlist);
  } catch (error) {
    return next(error);
  }
};
