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
      console.error("Failed to fetch cart:", error);
      set({ loading: false, error: "Failed to fetch cart" });
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
        // Optionally, show a success toast here
        return Promise.resolve(); // Add this line
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: error?.response?.data?.message,
      });
      console.error("Failed to add product to cart:", error);
      set({ loading: false, error: "Failed to add product to cart" });
      // Optionally, show an error toast here
      return Promise.reject(error); // Add this line
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
        // Optionally, show a success toast here
        return Promise.resolve(); // Add this line
      }
    } catch (error) {
      console.error("Failed to remove product from cart:", error);
      set({ loading: false, error: "Failed to remove product from cart" });
      // Optionally, show an error toast here
      return Promise.reject(error); // Add this line
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
        // Optionally, show a success toast here
        return Promise.resolve(); // Add this line
      }
    } catch (error) {
      console.error("Failed to update product quantity:", error);
      set({ loading: false, error: "Failed to update product quantity" });
      // Optionally, show an error toast here
      return Promise.reject(error); // Add this line
    }
  },

  // Set cart state manually
  setCart: (cart) => set({ cart }),
}));

export default useCartStore;
