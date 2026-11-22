import express from "express";
import {
  createProduct,
  deleteProduct,
  getSellerProducts,
  getFeaturedProducts,
  getMyOrders,
  getProductById,
  getProductsByCategory,
  getRecommendedProducts,
  getSearchedProducts,
  updateProduct,
  toggleFeaturedProduct,
} from "../controllers/product.controller.js";
import { sellerRoute, protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/seller", protectRoute, sellerRoute, getSellerProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category", getProductsByCategory);
router.get("/recommendations", getRecommendedProducts);
router.get("/orders", protectRoute, getMyOrders);
router.get("/search", getSearchedProducts);
router.post("/", protectRoute, sellerRoute, createProduct);
router.get("/product/:id", getProductById);
router.patch("/:id", protectRoute, sellerRoute, updateProduct);
router.patch("/:id/featured", protectRoute, sellerRoute, toggleFeaturedProduct);
router.delete("/:id", protectRoute, sellerRoute, deleteProduct);

export default router;
