import { create } from "zustand";
import axios from "axios";
import { server } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

const useWishlistStore = create((set, get) => ({
  wishlist: [],
  loading: false,
  error: null,

  fetchWishlist: async () => {
    set({ loading: true });
    try {
      const { data } = await axios.get(`${server}/auth/wishlist`, {
        withCredentials: true,
      });
      if (data?.success) {
        set({ wishlist: data.wishlist || [], loading: false });
      }
    } catch (error) {
      set({ loading: false, error: error?.message });
      // Do not popup error toast on passive load for unauthenticated visitors
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
        toast({
          variant: "success",
          title: "Added to Wishlist",
          description: "Product saved to your wishlist",
        });
        await get().fetchWishlist();
        set({ loading: false });
        return Promise.resolve();
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to add to wishlist";
      set({ loading: false, error: msg });
      toast({
        variant: "destructive",
        title: "Wishlist Error",
        description: msg,
      });
      return Promise.reject(error);
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
          wishlist: state.wishlist.filter((item) => {
            const pId = item?.product?._id || item?.product;
            return pId !== productId;
          }),
          loading: false,
        }));
        toast({
          variant: "success",
          title: "Removed from Wishlist",
        });
        return Promise.resolve();
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to remove from wishlist";
      set({ loading: false, error: msg });
      toast({
        variant: "destructive",
        title: "Error",
        description: msg,
      });
      return Promise.reject(error);
    }
  },

  setWishlist: (wishlist) => set({ wishlist }),
}));

export default useWishlistStore;
