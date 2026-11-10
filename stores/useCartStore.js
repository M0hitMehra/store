import { create } from "zustand";
import axios from "axios";
import { server } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

const useCartStore = create((set, get) => ({
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
      if (data?.success) {
        set({ cart: data.cart || [], loading: false });
      }
    } catch (error) {
      set({ loading: false, error: "Unable to load cart" });
      // Do not popup error toast on passive load for unauthenticated visitors
    }
  },

  // Add product with variant to the cart
  addProduct: async (productId, variantId, quantity = 1) => {
    if (!productId || !variantId) {
      toast({
        variant: "destructive",
        title: "Please select a size / color first",
      });
      return Promise.reject(new Error("Missing variant"));
    }

    set({ loading: true, error: null });
    try {
      const { data } = await axios.post(
        `${server}/auth/cart/add`,
        { productId, variantId, quantity },
        { withCredentials: true }
      );
      if (data?.success) {
        toast({
          variant: "success",
          title: "Added to Cart",
          description: data.message || "Item added to your shopping bag",
        });
        await get().fetchCart();
        set({ loading: false });
        return Promise.resolve();
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to add product to cart";
      toast({
        variant: "destructive",
        title: "Could not add to cart",
        description: msg,
      });
      set({ loading: false, error: msg });
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
      if (data?.success) {
        toast({
          variant: "success",
          title: "Item Removed",
          description: "Removed from your shopping bag",
        });
        // Optimistically update
        set((state) => ({
          cart: state.cart.filter((item) => {
            const pId = item?.product?._id || item?.product;
            const vId = item?.variant?._id || item?.variant;
            return !(pId === productId && vId === variantId);
          }),
          loading: false,
        }));
        return Promise.resolve();
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to remove item";
      toast({
        variant: "destructive",
        title: "Error",
        description: msg,
      });
      set({ loading: false, error: msg });
      return Promise.reject(error);
    }
  },

  // Update product variant quantity in the cart
  updateProductQuantity: async (productId, variantId, quantity) => {
    if (quantity < 1) return;
    set({ loading: true, error: null });
    try {
      const { data } = await axios.put(
        `${server}/auth/cart/update`,
        { productId, variantId, quantity },
        { withCredentials: true }
      );
      if (data?.success) {
        set((state) => ({
          cart: state.cart.map((item) => {
            const pId = item?.product?._id || item?.product;
            const vId = item?.variant?._id || item?.variant;
            return pId === productId && vId === variantId
              ? { ...item, quantity }
              : item;
          }),
          loading: false,
        }));
        return Promise.resolve(data);
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to update quantity";
      toast({
        variant: "destructive",
        title: "Error",
        description: msg,
      });
      set({ loading: false, error: msg });
      return Promise.reject(error);
    }
  },

  // Clear cart
  clearCart: () => set({ cart: [] }),

  // Set cart manually
  setCart: (cart) => set({ cart }),
}));

export default useCartStore;
