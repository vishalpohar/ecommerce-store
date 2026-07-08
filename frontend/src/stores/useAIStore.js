import { create } from "zustand";
import axios from "../api/axios";
import { toast } from "react-hot-toast";

export const useAIStore = create((set, get) => ({
  generating: false,

  getDescription: async (productName) => {
    try {
      set({ generating: true });

      const response = await axios.post("/ai/generate-description", {
        productName,
      });

      return response.data.description;
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error || "Error while generating description");
    } finally {
      set({ generating: false });
    }
  },
}));
