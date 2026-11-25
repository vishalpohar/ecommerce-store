import { create } from "zustand";
import axios from "../api/axios";
import { toast } from "react-hot-toast";
import { formatPriceInRupees } from "../utils/formatCurrency";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponApplied: false,
  isFetchingCart: false,
  isFetchingCoupon: false,

  getMyCoupon: async () => {
    const { isFetchingCoupon } = get();
    if (isFetchingCoupon) return;

    set({ isFetchingCoupon: true });
    try {
      const response = await axios.get("/coupons");
      set({ coupon: response.data });
    } catch (error) {
      console.error("Error fetching coupon", error);
    } finally {
      set({ isFetchingCoupon: false });
    }
  },

  applyCoupon: async (code) => {
    try {
      const response = await axios.post("/coupons/validate", { code });
      set({ coupon: response.data, isCouponApplied: true });
      get().calculateTotals();
      toast.success("Coupon applied successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    }
  },

  removeCoupon: () => {
    set({ coupon: null, isCouponApplied: false });
    get().calculateTotals();
    toast.success("Coupon removed");
  },

  getCartItems: async () => {
    const { isFetchingCart } = get();
    if (isFetchingCart) return;

    set({ isFetchingCart: true });
    try {
      const res = await axios.get("/cart");
      set({ cart: res.data });
      get().calculateTotals();
    } catch (error) {
      set({ cart: [] });
    } finally {
      set({ isFetchingCart: false });
    }
  },

  isInCart: (productId) => {
    const { cart } = get();
    return cart.some((item) => item._id === productId);
  },

  clearCart: async () => {
    try {
      await axios.delete(`/cart`);
      set({ cart: [], coupon: null, total: 0, subtotal: 0 });
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  addToCart: async (product) => {
    const size = product.size || product.sizes?.[0] || "One Size";
    const quantity = product.quantity || 1;

    try {
      await axios.post("/cart", { productId: product._id, size, quantity });
      toast.success("Product added to cart");

      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id,
        );
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + quantity, size }
                : item,
            )
          : [...prevState.cart, { ...product, size, quantity }];
        return { cart: newCart };
      });
      get().calculateTotals();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  removeFromCart: async (productId) => {
    try {
      await axios.delete(`/cart/${productId}`);
      set((prevCart) => ({
        cart: prevCart.cart.filter((item) => item._id !== productId),
      }));
      get().calculateTotals();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  updateQuantity: async (productId, quantity, size) => {
    try {
      if (quantity === 0) {
        get().removeFromCart(productId);
        return;
      }

      const payload = size ? { quantity, size } : { quantity };
      await axios.put(`/cart/${productId}`, payload);

      set((prevState) => ({
        cart: prevState.cart.map((item) =>
          item._id === productId
            ? { ...item, quantity, ...(size ? { size } : {}) }
            : item,
        ),
      }));
      get().calculateTotals();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update cart");
    }
  },

  updateSize: async (productId, size) => {
    const item = get().cart.find((i) => i._id === productId);
    if (!item || item.size === size) return;

    await get().updateQuantity(productId, item.quantity, size);
  },

  calculateTotals: () => {
    const { cart, coupon } = get();
    let subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    let total = subtotal;

    if (coupon) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
      set({ isCouponApplied: true });
    }

    subtotal = formatPriceInRupees(subtotal);
    total = formatPriceInRupees(total);

    set({ subtotal, total });
  },
}));
