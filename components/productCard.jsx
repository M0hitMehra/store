"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import useWishlistStore from "@/stores/useWishlistStore";
import useCartStore from "@/stores/useCartStore";
import clsx from "clsx";

const ProductCard = ({ detail, className }) => {
  const router = useRouter();
  const { wishlist, addProductToWishlist, removeProductFromWishlist } = useWishlistStore();
  const { cart, addProduct } = useCartStore();
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!detail) return null;

  const isInWishlist = wishlist.some(
    (item) => (item?.product?._id || item?.product) === detail._id
  );

  const isInCart = cart.some(
    (item) => (item?.product?._id || item?.product) === detail._id
  );

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    if (isInWishlist) {
      await removeProductFromWishlist(detail._id);
    } else {
      await addProductToWishlist(detail._id);
    }
  };

  const handleQuickAdd = async (e) => {
    e.stopPropagation();
    // Find first available variant with stock
    const variant = detail.variants?.find((v) => v.stock > 0) || detail.variants?.[0];
    if (!variant) {
      // Direct user to product page to choose options
      router.push(`/product/${detail._id}`);
      return;
    }

    setAddingToCart(true);
    try {
      await addProduct(detail._id, variant._id, 1);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    } catch {
      // Store already showed toast
    } finally {
      setAddingToCart(false);
    }
  };

  const displayImage =
    detail?.images?.[0]?.url ||
    "https://res.cloudinary.com/mohit786/image/upload/v1693677254/cv9gdgz150vtoimcga0e.jpg";

  const brandName =
    typeof detail.brand === "object" ? detail.brand?.name : "STUDIO";

  const price = detail.price || detail.minPrice || 0;

  return (
    <div
      onClick={() => router.push(`/product/${detail._id}`)}
      className={clsx(
        "group relative flex flex-col bg-white border border-neutral-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-neutral-200 transition-all duration-300 cursor-pointer",
        className
      )}
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-neutral-50 overflow-hidden">
        <Image
          src={displayImage}
          alt={detail.title || "Product"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-neutral-700 hover:text-red-500 shadow-sm transition-all hover:scale-110 z-10"
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={clsx(
              "w-4 h-4 transition-colors",
              isInWishlist ? "fill-red-500 text-red-500" : "text-neutral-700"
            )}
          />
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {detail.totalStock !== undefined && detail.totalStock <= 5 && detail.totalStock > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white rounded-md shadow-sm">
              Only {detail.totalStock} left
            </span>
          )}
          {detail.variants?.length > 1 && (
            <span className="px-2 py-0.5 text-[10px] font-medium bg-black/70 backdrop-blur-sm text-white rounded-md shadow-sm">
              {detail.variants.length} Options
            </span>
          )}
        </div>

        {/* Quick Add Overlay on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 hidden sm:block">
          <button
            onClick={handleQuickAdd}
            disabled={addingToCart}
            className="w-full py-2.5 px-4 bg-neutral-950/90 backdrop-blur-md text-white text-xs font-semibold rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            {addedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Added to Bag</span>
              </>
            ) : addingToCart ? (
              <span>Adding...</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-2">
        <div>
          <p className="text-[11px] font-bold tracking-widest uppercase text-neutral-400">
            {brandName}
          </p>
          <h3 className="text-sm font-semibold text-neutral-900 line-clamp-1 mt-0.5 group-hover:text-neutral-600 transition-colors">
            {detail.title}
          </h3>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-neutral-100/80">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-neutral-900 font-mono">
              {formatPrice(price)}
            </span>
            {detail.maxPrice && detail.maxPrice > price && (
              <span className="text-xs text-neutral-400 line-through font-mono">
                {formatPrice(detail.maxPrice)}
              </span>
            )}
          </div>

          {/* Color Indicators preview */}
          {detail.variants && detail.variants.length > 0 && (
            <div className="flex items-center -space-x-1">
              {Array.from(
                new Set(
                  detail.variants
                    .map((v) => v.color?.code)
                    .filter(Boolean)
                )
              )
                .slice(0, 3)
                .map((code, idx) => (
                  <span
                    key={idx}
                    style={{ backgroundColor: code }}
                    className="w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs"
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
