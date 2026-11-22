import { create } from "zustand";
import axios from "../api/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: false,
  isRefreshing: false,

  signup: async ({ name, email, password, role }) => {
    set({ loading: true });

    try {
      const res = await axios.post("/auth/signup", {
        name,
        email,
        password,
        role,
      });
      toast.success(res.data.message || "Account Created Successfully.");
      return res;
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },
  login: async (email, password) => {
    set({ loading: true });

    try {
      const res = await axios.post("/auth/login", { email, password });
      set({ user: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },
  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during logout",
      );
    }
  },
  checkAuth: async () => {
    const { checkingAuth } = get();
    if (checkingAuth) return;

    set({ checkingAuth: true });

    try {
      const response = await axios.get("/auth/profile");
      set({ user: response.data });
    } catch (error) {
      set({ user: null });
    } finally {
      set({ checkingAuth: false });
    }
  },

  refreshToken: async () => {
    //Prevent multiple simultaneous refresh attempts
    if (get().isRefreshing) return;

    set({ isRefreshing: true });

    try {
      const response = await axios.post("/auth/refresh-token");
      return response.data;
    } catch (error) {
      set({ user: null });
      throw error;
    } finally {
      set({ isRefreshing: false });
    }
  },
}));
