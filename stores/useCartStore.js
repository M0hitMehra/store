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
      set({ loading: false, error: "Login to view your cart" });
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.message || "Failed to fetch cart",
      });
    }
  },

  // Add product with variant to the cart
  addProduct: async (productId, variantId, quantity = 1) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post(
        `${server}/auth/cart/add`,
        { productId, variantId, quantity },
        { withCredentials: true }
      );
      if (data.success) {
        toast({
          variant: "success",
          title: "Success",
          description: data.message || "Added to cart successfully",
        });
        // Update cart state with the new cart data
        set((state) => ({
          cart: [...state.cart, data.cartItem],
          loading: false,
        }));
        return Promise.resolve();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to add product to cart",
      });
      set({ loading: false, error: "Failed to add product to cart" });
      return Promise.reject(error);
    }
  },

  // Remove product variant from the cart
  removeProduct: async (productId, variantId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post(
        `${server}/auth/cart/remove`,
        { productId, variantId },
        { withCredentials: true }
      );
      if (data.success) {
        toast({
          variant: "success",
          title: "Success",
          description: data.message || "Removed from cart successfully",
        });
        set((state) => ({
          cart: state.cart.filter(
            (item) =>
              !(
                item.product._id === productId && item.variant._id === variantId
              )
          ),
          loading: false,
        }));
        return Promise.resolve();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Failed to remove product from cart",
      });
      set({ loading: false, error: "Failed to remove product from cart" });
      return Promise.reject(error);
    }
  },

  // Update product variant quantity in the cart
  updateProductQuantity: async (productId, variantId, quantity) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.put(
        `${server}/auth/cart/update`,
        { productId, variantId, quantity },
        { withCredentials: true }
      );
      if (data.success) {
        // Immediately update the cart state
        set((state) => ({
          cart: state.cart.map((item) =>
            item.product._id === productId
              ? { ...item, quantity: quantity }
              : item
          ),
          loading: false,
        }));
        toast({
          variant: "success",
          title: "Success",
          description: data.message || "Product quantity updated successfully",
        });
        return Promise.resolve(data);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to update product quantity",
      });
      set({ loading: false, error: "Failed to update product quantity" });
      return Promise.reject(error);
    }
  },

  // Calculate cart totals
  getCartTotals: () => {
    return set((state) => {
      const totals = state.cart.reduce(
        (acc, item) => {
          const itemTotal = item.quantity * item.variant.price;
          return {
            totalItems: acc.totalItems + item.quantity,
            totalAmount: acc.totalAmount + itemTotal,
          };
        },
        { totalItems: 0, totalAmount: 0 }
      );
      return { cartTotals: totals };
    });
  },

  // Set cart state manually
  setCart: (cart) => set({ cart }),

  // Clear cart
  clearCart: () => set({ cart: [] }),
}));

export default useCartStore;
