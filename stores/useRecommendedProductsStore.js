import { create } from "zustand";
import axios from "axios";
import { server } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

const useRecommendedProductsStore = create((set) => ({
  recommendedProducts: [],
  loading: false,
  error: null,

  // Fetch the useRecommendedProductsStore from the server
  getRecommendationProduct: async (userId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get(
        `${server}/algorithm/recommended/${userId}`,
        {
          withCredentials: true,
        }
      );

       if (data.success) {
        set({ recommendedProducts: data?.recommendedProducts, loading: false });
      }
    } catch (error) {
      set({ loading: false, error: "" });
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Sorry the error is on our side. Please try again later",
      });
    }
  },
}));

export default useRecommendedProductsStore;
