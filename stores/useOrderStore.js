import { create } from "zustand";
import axios from "axios";
import { server } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

const useOrderStore = create((set) => ({
  orders: [],
  currentOrder: null,
  orderHistory: [],
  totalOrders: 0,
  totalPages: 1,
  currentPage: 1,
  loading: false,
  error: null,

  // Fetch all orders for the authenticated user
  fetchOrders: async (status = "", page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const params = { page, limit };
      if (status && status !== "all") {
        params.status = status;
      }
      const { data } = await axios.get(`${server}/order/orders`, {
        params,
        withCredentials: true,
      });

      if (data?.success) {
        set({
          orders: data.orders || [],
          totalOrders: data.totalOrders || 0,
          totalPages: data.totalPages || 1,
          currentPage: data.currentPage || page,
          loading: false,
        });
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to fetch orders";
      set({ loading: false, error: msg });
    }
  },

  // Get details for a single order
  fetchOrderDetails: async (orderId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get(`${server}/order/order/${orderId}`, {
        withCredentials: true,
      });
      if (data?.success) {
        set({ currentOrder: data.order, loading: false });
        return data.order;
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to load order details";
      set({ loading: false, error: msg });
      toast({
        variant: "destructive",
        title: "Order Details Error",
        description: msg,
      });
      throw error;
    }
  },

  // Create a new order (Checkout)
  createOrder: async (orderData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post(`${server}/order/order`, orderData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (data?.success) {
        toast({
          variant: "success",
          title: "Order Placed Successfully!",
          description: `Your order #${data.order?.orderId || ""} has been confirmed.`,
        });
        set({ loading: false });
        return data.order;
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to place order";
      set({ loading: false, error: msg });
      toast({
        variant: "destructive",
        title: "Order Failed",
        description: msg,
      });
      throw error;
    }
  },

  // Cancel an existing order
  cancelOrder: async (orderId, reason) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post(
        `${server}/order/order/${orderId}/cancel`,
        { reason },
        { withCredentials: true }
      );
      if (data?.success) {
        toast({
          variant: "success",
          title: "Order Cancelled",
          description: data.message || "Your order was successfully cancelled.",
        });
        // Optimistically update order status in list
        set((state) => ({
          orders: state.orders.map((o) =>
            o.orderId === orderId ? { ...o, orderStatus: "Cancelled" } : o
          ),
          loading: false,
        }));
        return true;
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Unable to cancel order";
      set({ loading: false, error: msg });
      toast({
        variant: "destructive",
        title: "Cancel Order Error",
        description: msg,
      });
      throw error;
    }
  },

  // Request return for an order
  requestReturn: async (orderId, items, reason) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post(
        `${server}/order/order/${orderId}/return`,
        { items, reason },
        { withCredentials: true }
      );
      if (data?.success) {
        toast({
          variant: "success",
          title: "Return Requested",
          description: "Your return request has been submitted.",
        });
        set({ loading: false });
        return true;
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to request return";
      set({ loading: false, error: msg });
      toast({
        variant: "destructive",
        title: "Return Request Failed",
        description: msg,
      });
      throw error;
    }
  },

  // Fetch timeline / history for an order
  fetchOrderHistory: async (orderId) => {
    try {
      const { data } = await axios.get(
        `${server}/order/order/${orderId}/history`,
        { withCredentials: true }
      );
      if (data?.success) {
        set({ orderHistory: data.history || [] });
        return data.history;
      }
    } catch (error) {
      console.error("Order history error:", error);
      return [];
    }
  },
}));

export default useOrderStore;
