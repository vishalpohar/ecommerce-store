import { create } from "zustand";
import axios from "../api/axios";
import { toast } from "react-hot-toast";

export const useWishlistStore = create((set, get) => ({
  wishlist: [],
  loading: false,
  isWishlistLoading: false,
  addToWishlist: async (product) => {
    try {
      await axios.post(`/wishlist/add/${product._id}`);
      set((state) => ({
        wishlist: [...state.wishlist, product],
      }));
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    }
  },
  getWishlist: async () => {
    const { wishlist, isWishlistLoading } = get();

    if (isWishlistLoading || wishlist.length > 0) return;

    set({ isWishlistLoading: true });
    try {
      const response = await axios.get("/wishlist");
      set({ wishlist: response.data });
    } catch (error) {
      set({ wishlist: [] });
      toast.error(error.response.data.message || "An error occurred");
    } finally {
      set({ isWishlistLoading: false });
    }
  },
  removeFromWishlist: async (productId) => {
    try {
      await axios.delete(`/wishlist/${productId}`);
      set((state) => ({
        wishlist: state.wishlist.filter((item) => item._id !== productId),
      }));
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    }
  },
  isInWishlist: (productId) => {
    const { wishlist } = get();
    return wishlist.some((item) => item._id === productId);
  },
}));
