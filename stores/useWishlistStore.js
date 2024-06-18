import { create } from "zustand";
import axios from "axios";
import { server } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

const useWishlistStore = create((set) => ({
  wishlist: [],
  loading: false,
  error: null,

  fetchWishlist: async () => {
    set({ loading: true });
    try {
      const { data } = await axios.get(`${server}/auth/wishlist`, {
        withCredentials: true,
      });
      set({ wishlist: data.wishlist, loading: false });
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      set({ loading: false, error: error.message });
    }
  },

  addProductToWishlist: async (productId) => {
    set({ loading: true });
    try {
      const { data } = await axios.post(
        `${server}/auth/wishlist/${productId}`,
        {},
        { withCredentials: true }
      );
      if (data?.success) {
        set((state) => ({
          wishlist: [...state.wishlist, data.product],
          loading: false,
        }));
        toast({
          variant: "success",
          title: "Added to wishlist successfully",
        });
      }
    } catch (error) {
      console.error("Failed to add product to wishlist:", error);
      set({ loading: false, error: error.message });
      toast({
        variant: "destructive",
        title: error?.response?.data?.message,
      });
    }
  },

  removeProductFromWishlist: async (productId) => {
    set({ loading: true });
    try {
      const { data } = await axios.delete(
        `${server}/auth/wishlist/remove/${productId}`,
        { withCredentials: true }
      );
      if (data?.success) {
        set((state) => ({
          wishlist: state.wishlist.filter(
            (product) => product._id !== productId
          ),
          loading: false,
        }));
        toast({
          variant: "success",
          title: "Removed from wishlist successfully",
        });
      }
    } catch (error) {
      console.error("Failed to remove product from wishlist:", error);
      set({ loading: false, error: error.message });
      toast({
        variant: "destructive",
        title: error?.response?.data?.message,
      });
    }
  },

  setWishlist: (wishlist) => set({ wishlist }),
}));

export default useWishlistStore;
