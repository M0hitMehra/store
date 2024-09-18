import { create } from "zustand";
import axios from "axios";
import { server } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

const useCategoryStore = create((set) => ({
  categories: [],
  loading: false,
  error: null,

  // Fetch all categories from the server
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get(`${server}/category/getAll`, {
        withCredentials: true,
      });
      if (data.success) {
        set({ categories: data.data, loading: false });
      }
    } catch (error) {
      set({ loading: false, error: "Failed to fetch categories" });
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch categories",
      });
    }
  },

  // Add a new category
  addCategory: async (name, parent = null) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post(
        `${server}/category/add`,
        { name, parent },
        { withCredentials: true }
      );
      if (data.success) {
        toast({
          variant: "success",
          title: "Category added successfully",
        });
        set((state) => ({
          categories: [...state.categories, data.category],
          loading: false,
        }));
        return Promise.resolve();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add category",
      });
      set({ loading: false, error: "Failed to add category" });
      return Promise.reject(error);
    }
  },

  // Remove a category
  removeCategory: async (categoryId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post(
        `${server}/category/remove`,
        { categoryId },
        { withCredentials: true }
      );
      if (data.success) {
        toast({
          variant: "success",
          title: "Category removed successfully",
        });
        set((state) => ({
          categories: state.categories.filter(
            (category) => category._id !== categoryId
          ),
          loading: false,
        }));
        return Promise.resolve();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove category",
      });
      set({ loading: false, error: "Failed to remove category" });
      return Promise.reject(error);
    }
  },

  // Set categories state manually
  setCategories: (categories) => set({ categories }),
}));

export default useCategoryStore;
