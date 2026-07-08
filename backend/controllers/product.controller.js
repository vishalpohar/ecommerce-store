import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/redis.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import logger from "../utils/logger.js";

export const getSellerProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const total = await Product.countDocuments({ seller: req.user._id });

    const products = await Product.find({ seller: req.user._id })
      .sort({
        createdAt: -1,
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({ products, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return next(new ApiError(404, "Product not found"));
    }

    res.json({ product });
  } catch (error) {
    return next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, image, category } = req.body;

    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
        quality: "auto",
        fetch_format: "auto",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      category,
      seller: req.user._id,
    });

    res.status(201).json({ product });
  } catch (error) {
    return next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ApiError(404, "Prouct not found"));
    }

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
      } catch (error) {
        logger.error(`Error deleting image from cloudinary: ${error.message}`);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Product deleted successfully" });

    let featuredProducts = await Product.find({ isFeatured: true }).lean();

    if (!featuredProducts) {
      return next(new ApiError(404, "No featured products found"));
    }

    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    return next(error);
  }
};

export const getRecommendedProducts = async (req, res, next) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          image: 1,
          price: 1,
        },
      },
    ]);

    res.json(products);
  } catch (error) {
    return next(error);
  }
};

export const getSearchedProducts = async (req, res, next) => {
  try {
    const { query = "", sort, page = 1, limit = 10 } = req.query;

    const sortOption =
      sort === "price-low"
        ? { price: 1 }
        : sort === "price-high"
          ? { price: -1 }
          : { createdAt: -1 };

    const filter = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    };

    const total = await Product.countDocuments(filter);

    const searchResult = await Product.find(filter, {
      _id: 1,
      name: 1,
      image: 1,
      price: 1,
    })
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res
      .status(200)
      .json({ searchResult, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const user = req.user;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    let orders = await Order.aggregate([
      { $match: { user: user._id } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },

      { $unwind: "$products" },

      {
        $lookup: {
          from: "products",
          let: { productId: "$products.product" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$productId"] },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                image: 1,
                price: 1,
              },
            },
          ],
          as: "product",
        },
      },

      { $unwind: "$product" },

      {
        $project: {
          _id: 1,
          createdAt: 1,
          totalAmount: 1,
          quantity: "$products.quantity",
          price: "$products.price",
          product: 1,
        },
      },

      {
        $group: {
          _id: "$_id",
          createdAt: { $first: "$createdAt" },
          totalAmount: { $first: "$totalAmount" },
          products: {
            $push: {
              quantity: "$quantity",
              price: "$price",
              product: "$product",
            },
          },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    const totalOrders = await Order.countDocuments({ user: user._id });

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
      orders,
    });
  } catch (error) {
    return next(error);
  }
};

export const getProductsByCategory = async (req, res, next) => {
  const { category = "", sort, page = 1, limit = 10 } = req.query;

  let sortOption = {};

  if (sort === "newest") sortOption = { createdAt: -1 };
  if (sort === "price-low") sortOption = { price: 1 };
  if (sort === "price-high") sortOption = { price: -1 };

  try {
    const products = await Product.find(
      { category },
      { _id: 1, name: 1, image: 1, price: 1 },
    )
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const total = await Product.countDocuments({ category });

    res.json({ products, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return next(error);
  }
};

export const getFeaturedProducts = async (req, res, next) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }

    // if not in redis, fetch from mongodb
    featuredProducts = await Product.find(
      { isFeatured: true },
      { _id: 1, name: 1, image: 1, price: 1, isFeatured: 1, category: 1 },
    ).lean();

    if (!featuredProducts) {
      return next(new ApiError(404, "No featured products found"));
    }

    // store in redis for future quick access
    // .lean() is gonna return a plain javascript object instead of a mongodb document
    // which is good for performance
    await redis.set("featured_products", JSON.stringify(featuredProducts));

    res.json(featuredProducts);
  } catch (error) {
    return next(error);
  }
};

export const toggleFeaturedProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid product ID"));
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      [{ $set: { isFeatured: { $not: "$isFeatured" } } }],
      {
        new: true,
        projection: { _id: 1, name: 1, image: 1, price: 1, isFeatured: 1 },
      },
    );

    if (!updatedProduct) {
      return next(new ApiError(404, "Product not found"));
    }

    await updateFeaturedProductsCache();

    res.json(updatedProduct);
  } catch (error) {
    return next(error);
  }
};

async function updateFeaturedProductsCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    throw error;
  }
}
