import { create } from "zustand";
import axios from "axios";
import { server } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

const useCartStore = create((set) => ({
  cart: [],
  loading: false,
  error: null,

  // Fetch the cart from the server
  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get(`${server}/auth/cart`, {
        withCredentials: true,
      });
      if (data.success) {
        set({ cart: data.cart, loading: false });
      }
    } catch (error) {
      set({ loading: false, error: "Failed to fetch cart" });
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch cart",
      });
    }
  },

  // Add product to the cart
  addProduct: async (productId, quantity = 1) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post(
        `${server}/auth/cart/add`,
        { productId, quantity },
        { withCredentials: true }
      );
      if (data.success) {
        toast({
          variant: "success",
          title: "Added to cart successfully",
        });
        set((state) => ({
          cart: data.cart,
          loading: false,
        }));
        return Promise.resolve();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: error?.response?.data?.message || "Error",
        description: "Failed to add product to cart",
      });
      set({ loading: false, error: "Failed to add product to cart" });
      return Promise.reject(error);
    }
  },

  // Remove product from the cart
  removeProduct: async (productId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post(
        `${server}/auth/cart/remove`,
        { productId },
        { withCredentials: true }
      );
      if (data.success) {
        toast({
          variant: "success",
          title: "Removed from cart successfully",
        });
        set((state) => ({
          cart: data.cart,
          loading: false,
        }));
        return Promise.resolve();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove product from cart",
      });
      set({ loading: false, error: "Failed to remove product from cart" });
      return Promise.reject(error);
    }
  },

  // Update product quantity in the cart
  updateProductQuantity: async (productId, quantity) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.put(
        `${server}/auth/cart/update`,
        { productId, quantity },
        { withCredentials: true }
      );
      if (data.success) {
        toast({
          variant: "success",
          title: "Product quantity updated successfully",
        });
        set((state) => ({
          cart: data.cart,
          loading: false,
        }));
        return Promise.resolve();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update product quantity",
      });
      set({ loading: false, error: "Failed to update product quantity" });
      return Promise.reject(error);
    }
  },

  // Set cart state manually
  setCart: (cart) => set({ cart }),
}));

export default useCartStore;
