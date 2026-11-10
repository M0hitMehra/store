"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { History, ArrowRight } from "lucide-react";
import Loader from "@/components/loader";
import ProductCard from "@/components/productCard";
import { server } from "@/lib/utils";
import useCartStore from "@/stores/useCartStore";
import useWishlistStore from "@/stores/useWishlistStore";
import useProtectedRoute from "@/hooks/useProtectedRoute";

export default function RecentlyVisitedPage() {
  const { user, loading: userLoading } = useProtectedRoute();
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { fetchCart } = useCartStore();
  const { fetchWishlist } = useWishlistStore();

  useEffect(() => {
    if (user) {
      fetchCart();
      fetchWishlist();
    }
  }, [user, fetchCart, fetchWishlist]);

  useEffect(() => {
    const fetchRecentlyVisited = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${server}/auth/user/recently-visited?limit=12`,
          {
            withCredentials: true,
          }
        );
        if (data?.success) {
          setRecentProducts(data.recentlyVisited || []);
        }
      } catch (err) {
        console.error("Error fetching recently visited:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentlyVisited();
  }, [user]);

  if (userLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-6 border-b border-neutral-200">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-neutral-400">
            Browsing Activity
          </span>
          <h1 className="text-3xl font-black uppercase font-mono tracking-tight text-neutral-900 mt-1">
            Recently Visited
          </h1>
        </div>
        <p className="text-xs text-neutral-500 font-medium">
          {recentProducts.length} items viewed
        </p>
      </div>

      {/* Grid */}
      {recentProducts && recentProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recentProducts.map((product) => {
            if (!product) return null;
            return <ProductCard key={product._id} detail={product} />;
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 bg-white border border-neutral-100 rounded-3xl p-8">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400">
            <History className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold font-mono uppercase text-neutral-900">
              No Recently Viewed Products
            </h2>
            <p className="text-xs text-neutral-500 max-w-sm">
              Products you explore across the store will automatically appear here for quick access.
            </p>
          </div>
          <Link
            href="/search"
            className="px-6 py-2.5 bg-neutral-950 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-800 transition-colors"
          >
            Start Browsing
          </Link>
        </div>
      )}
    </div>
  );
}
