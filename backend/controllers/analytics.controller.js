import {
  getAnalyticsData,
  getDailySalesData,
} from "../utils/analytics.utils.js";

export const getStats = async (req, res, next) => {
  try {
    const sellerId = req.user._id;
    const analyticsData = await getAnalyticsData(sellerId);
    const duration = parseInt(req.query.range.replace("d", ""));
    const timeRange = duration * 24 * 60 * 60 * 1000;

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - timeRange);

    const dailySalesData = await getDailySalesData(
      sellerId,
      startDate,
      endDate,
    );

    res.json({
      analyticsData,
      dailySalesData,
    });
  } catch (error) {
    return next(error);
  }
};
