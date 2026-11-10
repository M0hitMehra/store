import { create } from "zustand";
import axios from "axios";
import { server } from "@/lib/utils";

const useRecommendedProductsStore = create((set) => ({
  recommendedProducts: [],
  loading: false,
  error: null,

  // Fetch recommended products from the server
  getRecommendationProduct: async (userId) => {
    if (!userId) return;
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get(
        `${server}/algorithm/recommended/${userId}`,
        {
          withCredentials: true,
        }
      );

      if (data?.success) {
        set({
          recommendedProducts: data.recommendedProducts || [],
          loading: false,
        });
      }
    } catch (error) {
      set({ loading: false, error: error?.message });
      // Suppress noisy toast for recommendations
    }
  },
}));

export default useRecommendedProductsStore;
