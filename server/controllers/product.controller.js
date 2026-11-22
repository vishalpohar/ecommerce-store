import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/redis.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import logger from "../utils/logger.js";
import ApiError from "../utils/ApiError.js";

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
  let cloudinaryResponse = null;
  try {
    const { name, description, price, image, category } = req.body;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "ecommerce/product_images",
        quality: "auto",
        fetch_format: "auto",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url ?? "",
      imagePublicId: cloudinaryResponse?.public_id ?? null,
      category,
      seller: req.user._id,
    });

    res.status(201).json({ product });
  } catch (error) {
    // Clean up the uploaded image if saving the product fails.
    if (cloudinaryResponse?.public_id) {
      try {
        await cloudinary.uploader.destroy(cloudinaryResponse.public_id);
      } catch (cleanupError) {
        logger.error(`Cloudinary cleanup failed: ${cleanupError.message}`);
      }
    }

    return next(error);
  }
};


export const updateProduct = async (req, res, next) => {
  let uploadedImage = null;

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid product ID"));
    }

    const { name, description, price, category, image } = req.body;

    // Find product belonging to the authenticated seller.
    const product = await Product.findOne({
      _id: id,
      seller: req.user._id,
    });

    if (!product) {
      return next(new ApiError(404, "Product not found"));
    }

    // Validate that at least one field was provided.
    const hasChanges = [
      "name",
      "description",
      "price",
      "category",
      "image",
    ].some((field) => Object.prototype.hasOwnProperty.call(req.body, field));

    if (!hasChanges) {
      return next(new ApiError(400, "No product details provided"));
    }

    // Update only the permitted fields.
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;

    if (price !== undefined) {
      const parsedPrice = Number(price);

      if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
        return next(new ApiError(400, "Invalid product price"));
      }

      product.price = parsedPrice;
    }

    const oldImagePublicId = product.imagePublicId;

    // Upload replacement image if provided.
    if (image !== undefined && image !== null && image !== "") {
      uploadedImage = await cloudinary.uploader.upload(image, {
        folder: "ecommerce/product_images",
        quality: "auto",
        fetch_format: "auto",
      });

      product.image = uploadedImage.secure_url;
      product.imagePublicId = uploadedImage.public_id;
    }

    // Explicitly passing null removes the existing image.
    if (image === null) {
      product.image = "";
      product.imagePublicId = null;
    }

    await product.save();

    // Delete old image only after successfully saving the update.
    const imageWasReplaced = uploadedImage || image === null;

    if (imageWasReplaced && oldImagePublicId) {
      try {
        await cloudinary.uploader.destroy(oldImagePublicId);
      } catch (error) {
        logger.error(`Failed to delete old product image: ${error.message}`);
      }
    }

    // Refresh featured product cache.
    try {
      const featuredProducts = await Product.find({
        isFeatured: true,
      }).lean();

      await redis.set("featured_products", JSON.stringify(featuredProducts));
    } catch (error) {
      logger.error(
        `Failed to update featured products cache: ${error.message}`,
      );
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    // Remove newly uploaded image if the database update fails.
    if (uploadedImage?.public_id) {
      try {
        await cloudinary.uploader.destroy(uploadedImage.public_id);
      } catch (cleanupError) {
        logger.error(`Cloudinary cleanup failed: ${cleanupError.message}`);
      }
    }

    return next(error);
  }
};


export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.user._id,
    });

    if (!product) {
      return next(new ApiError(404, "Prouct not found"));
    }

    await Product.findByIdAndDelete(product._id);

    if (product.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(product.imagePublicId);
      } catch (error) {
        logger.error(`Error deleting image from cloudinary: ${error.message}`);
      }
    }

    try {
      const featuredProducts = await Product.find({ isFeatured: true }).lean();

      await redis.set("featured_products", JSON.stringify(featuredProducts));
    } catch (error) {
      logger.error(`Error updating featured products cache: ${error.message}`);
    }

    res.status(200).json({ message: "Product deleted successfully" });
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
    const userId = req.user._id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const [orders, totalOrders] = await Promise.all([
      await Order.find({ user: userId })
        .select("_id products totalAmount shippingAddress paymentMethod paymentStatus createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments({ user: userId }),
    ]);

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
      { _id: id, seller: req.user._id },
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
