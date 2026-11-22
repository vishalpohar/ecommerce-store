import { create } from "zustand";
import axios from "../api/axios";
import toast from "react-hot-toast";

export const useAddressStore = create((set, get) => ({
  shippingAddress: null,

  addingAddress: false,
  fetchingAddress: false,
  deletingAddress: false,

  addAddress: async (addressData) => {
    set({ addingAddress: true });

    try {
      const response = await axios.post("/address", addressData);
      set({ shippingAddress: response.data.address });
      toast.success(response.data.message || "Address created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      set({ addingAddress: false });
    }
  },
  fetchAddress: async () => {
    set({ fetchingAddress: true });
    try {
      const response = await axios.get("/address");
      set({ shippingAddress: response.data.address });
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      set({ fetchingAddress: false });
    }
  },
  deleteAddress: async () => {
    set({ deletingAddress: true });

    try {
      const response = await axios.delete("/address");
      set({ shippingAddress: null });
      toast.success(response.data?.message || "Address removed successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      set({ deletingAddress: false });
    }
  },
}));
