import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import { getDatesInRange } from "./getDatesInRange.js";

export const getAnalyticsData = async (sellerId) => {
  const sellerObjectId = new mongoose.Types.ObjectId(sellerId);
  const totalProducts = await Product.countDocuments({
    seller: sellerObjectId,
  });

  const salesData = await Order.aggregate([
    { $unwind: "$products" },

    {
      $match: { "products.seller": sellerObjectId },
    },

    {
      $group: {
        _id: null, // it groups all documents together
        totalSales: { $sum: "$products.quantity" },
        totalRevenue: {
          $sum: "$products.itemTotal",
        },
      },
    },
  ]);

  const { totalSales, totalRevenue } = salesData[0] || {
    totalSales: 0,
    totalRevenue: 0,
  };

  return {
    products: totalProducts,
    totalSales,
    totalRevenue,
  };
};

export const getDailySalesData = async (sellerId, startDate, endDate) => {
  try {
    const sellerObjectId = new mongoose.Types.ObjectId(sellerId);
    const dailySalesData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },

      { $unwind: "$products" },

      { $match: { "products.seller": sellerObjectId } },

      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: "$products.quantity" },
          revenue: { $sum: "$products.itemTotal" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dateArray = getDatesInRange(startDate, endDate);

    return dateArray.map((date) => {
      const foundData = dailySalesData.find((item) => item._id === date);

      return {
        date,
        sales: foundData?.sales || 0,
        revenue: foundData?.revenue || 0,
      };
    });
  } catch (error) {
    throw error;
  }
};
