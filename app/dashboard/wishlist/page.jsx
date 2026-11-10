"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import Loader from "@/components/loader";
import ProductCard from "@/components/productCard";
import useWishlistStore from "@/stores/useWishlistStore";
import useCartStore from "@/stores/useCartStore";
import useProtectedRoute from "@/hooks/useProtectedRoute";

export default function WishlistPage() {
  const { user, loading: userLoading } = useProtectedRoute();
  const { wishlist, fetchWishlist, loading: wishlistLoading } = useWishlistStore();
  const { fetchCart } = useCartStore();

  useEffect(() => {
    if (user) {
      fetchWishlist();
      fetchCart();
    }
  }, [user, fetchWishlist, fetchCart]);

  if (userLoading || wishlistLoading) {
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
            Saved Items
          </span>
          <h1 className="text-3xl font-black uppercase font-mono tracking-tight text-neutral-900 mt-1">
            My Wishlist
          </h1>
        </div>
        <p className="text-xs text-neutral-500 font-medium">
          {wishlist.length} {wishlist.length === 1 ? "product" : "products"} saved
        </p>
      </div>

      {/* Wishlist Items Grid */}
      {wishlist && wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => {
            const product = item?.product;
            if (!product) return null;
            return <ProductCard key={product._id || item._id} detail={product} />;
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 bg-white border border-neutral-100 rounded-3xl p-8">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400">
            <Heart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold font-mono uppercase text-neutral-900">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs text-neutral-500 max-w-sm">
              Save products you love while browsing to purchase later or monitor price drops.
            </p>
          </div>
          <Link
            href="/search"
            className="px-6 py-2.5 bg-neutral-950 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-800 transition-colors"
          >
            Explore Catalog
          </Link>
        </div>
      )}
    </div>
  );
}
