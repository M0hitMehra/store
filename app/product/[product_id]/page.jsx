"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  server,
  formatPrice,
  TypographyH1,
  TypographyP,
} from "@/lib/utils";
import {
  Heart,
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Minus,
  Plus,
  Share2,
  ChevronRight,
  Info,
} from "lucide-react";
import Loader from "@/components/loader";
import ErrorComponent from "@/components/error";
import ProductCard from "@/components/productCard";
import useCartStore from "@/stores/useCartStore";
import useWishlistStore from "@/stores/useWishlistStore";
import { useAuth } from "@/context/authContext";
import useRecommendedProductsStore from "@/stores/useRecommendedProductsStore";
import { toast } from "@/components/ui/use-toast";
import clsx from "clsx";

export default function ProductDetailPage({ params }) {
  const { product_id } = params;
  const router = useRouter();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Variant & Image states
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColorId, setSelectedColorId] = useState(null);
  const [selectedSizeId, setSelectedSizeId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  // Stores
  const { cart, addProduct, fetchCart } = useCartStore();
  const { wishlist, addProductToWishlist, removeProductFromWishlist } =
    useWishlistStore();
  const { recommendedProducts, getRecommendationProduct } =
    useRecommendedProductsStore();

  // 1. Fetch Product Details
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(`${server}/product/${product_id}`);
        if (data?.success && data?.product) {
          const p = data.product;
          setProduct(p);

          // Initialize variants
          if (p.variants && p.variants.length > 0) {
            const firstAvailable =
              p.variants.find((v) => v.stock > 0) || p.variants[0];
            setSelectedVariant(firstAvailable);
            setSelectedColorId(firstAvailable.color?._id || null);
            setSelectedSizeId(firstAvailable.size?._id || null);
          }
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [product_id]);

  // 2. Track visit in user history endpoint if logged in
  useEffect(() => {
    if (user && product_id) {
      axios
        .post(
          `${server}/auth/user/history/${product_id}`,
          {},
          { withCredentials: true }
        )
        .catch(() => {});

      getRecommendationProduct(user._id);
    }
  }, [user, product_id, getRecommendationProduct]);

  // Handle color / size changes to resolve variant
  const handleColorChange = (colorId) => {
    setSelectedColorId(colorId);
    if (!product?.variants) return;

    // Try finding variant with current size and this color
    const match = product.variants.find(
      (v) => v.color?._id === colorId && v.size?._id === selectedSizeId
    );
    if (match) {
      setSelectedVariant(match);
      setQuantity(1);
    } else {
      // Find any variant with this color
      const colorMatch = product.variants.find(
        (v) => v.color?._id === colorId
      );
      if (colorMatch) {
        setSelectedVariant(colorMatch);
        setSelectedSizeId(colorMatch.size?._id || null);
        setQuantity(1);
      }
    }
  };

  const handleSizeChange = (sizeId) => {
    setSelectedSizeId(sizeId);
    if (!product?.variants) return;

    // Try finding variant with current color and this size
    const match = product.variants.find(
      (v) => v.color?._id === selectedColorId && v.size?._id === sizeId
    );
    if (match) {
      setSelectedVariant(match);
      setQuantity(1);
    } else {
      // Find any variant with this size
      const sizeMatch = product.variants.find((v) => v.size?._id === sizeId);
      if (sizeMatch) {
        setSelectedVariant(sizeMatch);
        setSelectedColorId(sizeMatch.color?._id || null);
        setQuantity(1);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
        <ErrorComponent message={error || "Product not found"} />
        <button
          onClick={() => router.push("/search")}
          className="mt-4 px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-800"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  // Extract unique colors & sizes
  const uniqueColors = product.variants
    ? Array.from(
        new Map(
          product.variants
            .filter((v) => v.color)
            .map((v) => [v.color._id, v.color])
        ).values()
      )
    : [];

  const uniqueSizes = product.variants
    ? Array.from(
        new Map(
          product.variants
            .filter((v) => v.size)
            .map((v) => [v.size._id, v.size])
        ).values()
      )
    : [];

  // Gallery images: combine product images and variant images if any
  const galleryImages =
    selectedVariant?.images?.length > 0
      ? selectedVariant.images
      : product.images?.length > 0
      ? product.images
      : [
          {
            url: "https://res.cloudinary.com/mohit786/image/upload/v1693677254/cv9gdgz150vtoimcga0e.jpg",
          },
        ];

  const currentPrice = selectedVariant?.price || product.price || 0;
  const currentStock = selectedVariant?.stock !== undefined ? selectedVariant.stock : product.stock;
  const isOutOfStock = currentStock <= 0;

  const isInWishlist = wishlist.some(
    (item) => (item?.product?._id || item?.product) === product._id
  );

  const isInCart = cart.some(
    (item) =>
      (item?.product?._id || item?.product) === product._id &&
      (item?.variant?._id || item?.variant) === selectedVariant?._id
  );

  const handleWishlistToggle = async () => {
    if (isInWishlist) {
      await removeProductFromWishlist(product._id);
    } else {
      await addProductToWishlist(product._id);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast({
        variant: "destructive",
        title: "Please select size and color",
      });
      return;
    }
    setAddingToCart(true);
    try {
      await addProduct(product._id, selectedVariant._id, quantity);
    } catch {
      // Store handles toast
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) return;
    try {
      await addProduct(product._id, selectedVariant._id, quantity);
      router.push("/dashboard/cart");
    } catch {
      // Handled
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied to clipboard" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
        <button
          onClick={() => router.push("/")}
          className="hover:text-black transition-colors"
        >
          Home
        </button>
        <ChevronRight className="w-3 h-3" />
        <button
          onClick={() => router.push("/search")}
          className="hover:text-black transition-colors"
        >
          Shop
        </button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-neutral-800 font-semibold truncate max-w-xs">
          {product.title}
        </span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Image Gallery (7 cols) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[550px] pb-2 sm:pb-0 scrollbar-none flex-shrink-0">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={clsx(
                    "relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-neutral-50",
                    activeImageIndex === idx
                      ? "border-black shadow-xs"
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <Image
                    src={img.url}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Large Image */}
          <div className="relative flex-1 aspect-square sm:aspect-4/5 bg-neutral-50 rounded-3xl overflow-hidden border border-neutral-100 group">
            <Image
              src={galleryImages[activeImageIndex]?.url || galleryImages[0]?.url}
              alt={product.title}
              fill
              priority
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            {/* Wishlist toggle badge */}
            <button
              onClick={handleWishlistToggle}
              className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-md text-neutral-800 hover:text-red-500 transition-all hover:scale-110"
              aria-label="Wishlist"
            >
              <Heart
                className={clsx(
                  "w-5 h-5",
                  isInWishlist ? "fill-red-500 text-red-500" : ""
                )}
              />
            </button>
          </div>
        </div>

        {/* Right: Product Buy Info (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Brand & Stock status */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">
                {product.brand?.name || "STUDIO COLLECTION"}
              </span>
              {isOutOfStock ? (
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                  Out of Stock
                </span>
              ) : currentStock <= 5 ? (
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                  Only {currentStock} Left
                </span>
              ) : (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  In Stock ({currentStock})
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-neutral-950 uppercase leading-snug">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-3xl font-black font-mono text-neutral-950">
                {formatPrice(currentPrice)}
              </span>
              <span className="text-xs text-neutral-500 font-medium">
                (Inclusive of all taxes & GST)
              </span>
            </div>

            {/* Short Description */}
            {product.description && (
              <p className="text-sm text-neutral-600 leading-relaxed pt-2">
                {product.description}
              </p>
            )}

            {/* Color Selector */}
            {uniqueColors.length > 0 && (
              <div className="pt-4 border-t border-neutral-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 font-mono">
                    Color:{" "}
                    <span className="text-neutral-500 font-normal capitalize">
                      {uniqueColors.find((c) => c._id === selectedColorId)
                        ?.name || "Select"}
                    </span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {uniqueColors.map((c) => {
                    const isSelected = selectedColorId === c._id;
                    return (
                      <button
                        key={c._id}
                        onClick={() => handleColorChange(c._id)}
                        className={clsx(
                          "flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all",
                          isSelected
                            ? "border-black bg-neutral-900 text-white shadow-xs"
                            : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                        )}
                      >
                        <span
                          style={{ backgroundColor: c.code || "#ddd" }}
                          className="w-3.5 h-3.5 rounded-full border border-black/10"
                        />
                        <span className="capitalize">{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {uniqueSizes.length > 0 && (
              <div className="pt-4 border-t border-neutral-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 font-mono">
                    Size:{" "}
                    <span className="text-neutral-500 font-normal">
                      {uniqueSizes.find((s) => s._id === selectedSizeId)?.name ||
                        "Select"}
                    </span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {uniqueSizes.map((s) => {
                    const isSelected = selectedSizeId === s._id;
                    return (
                      <button
                        key={s._id}
                        onClick={() => handleSizeChange(s._id)}
                        className={clsx(
                          "min-w-12 h-10 px-3 text-xs font-bold rounded-xl border transition-all flex items-center justify-center",
                          isSelected
                            ? "border-black bg-neutral-950 text-white shadow-xs"
                            : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                        )}
                      >
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="pt-4 border-t border-neutral-100 flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 font-mono">
                Quantity:
              </span>
              <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-2 hover:bg-neutral-100 text-neutral-600 disabled:opacity-40 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-xs font-bold font-mono">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) =>
                      currentStock ? Math.min(currentStock, q + 1) : q + 1
                    )
                  }
                  disabled={quantity >= currentStock || isOutOfStock}
                  className="p-2 hover:bg-neutral-100 text-neutral-600 disabled:opacity-40 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-6 space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || isOutOfStock}
                  className="flex-1 py-4 bg-neutral-950 text-white text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-40 shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {isOutOfStock
                      ? "Out of Stock"
                      : addingToCart
                      ? "Adding to Bag..."
                      : isInCart
                      ? "Add Another to Bag"
                      : "Add to Shopping Bag"}
                  </span>
                </button>

                <button
                  onClick={handleShare}
                  className="p-4 border border-neutral-200 rounded-2xl hover:bg-neutral-100 text-neutral-700 transition-colors"
                  title="Share product"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {!isOutOfStock && (
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 bg-neutral-100 text-neutral-900 text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-neutral-200 transition-all text-center"
                >
                  Instant Checkout
                </button>
              )}
            </div>

            {/* Service badges */}
            <div className="pt-6 border-t border-neutral-100 grid grid-cols-3 gap-2 text-center text-[11px] text-neutral-500">
              <div className="p-2.5 bg-neutral-50 rounded-xl space-y-1">
                <Truck className="w-4 h-4 mx-auto text-neutral-800" />
                <p className="font-semibold text-neutral-800">Free Delivery</p>
                <p className="text-[10px]">On orders over ₹999</p>
              </div>
              <div className="p-2.5 bg-neutral-50 rounded-xl space-y-1">
                <RotateCcw className="w-4 h-4 mx-auto text-neutral-800" />
                <p className="font-semibold text-neutral-800">7-Day Returns</p>
                <p className="text-[10px]">Easy exchange policy</p>
              </div>
              <div className="p-2.5 bg-neutral-50 rounded-xl space-y-1">
                <ShieldCheck className="w-4 h-4 mx-auto text-neutral-800" />
                <p className="font-semibold text-neutral-800">100% Authentic</p>
                <p className="text-[10px]">Verified merchandise</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details & Specifications Accordion Section */}
      <div className="border-t border-neutral-200 pt-12 space-y-8">
        <h2 className="text-xl font-black uppercase font-mono tracking-tight text-neutral-900">
          Product Specifications & Story
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Story */}
          {product.otherDetails?.productStory?.description && (
            <div className="p-6 bg-neutral-50 rounded-2xl space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 font-mono">
                {product.otherDetails.productStory.title || "The Story"}
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {product.otherDetails.productStory.description}
              </p>
            </div>
          )}

          {/* Details / Bullet points */}
          {product.otherDetails?.productDetails?.description?.length > 0 && (
            <div className="p-6 bg-neutral-50 rounded-2xl space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 font-mono">
                Features & Highlights
              </h3>
              <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
                {product.otherDetails.productDetails.description.map(
                  (item, idx) => (
                    <li key={idx}>{item}</li>
                  )
                )}
              </ul>
            </div>
          )}

          {/* Manufacturer Information */}
          {product.otherDetails?.manufacturAddress?.description && (
            <div className="p-6 bg-neutral-50 rounded-2xl space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 font-mono">
                Manufacturing & Importer
              </h3>
              <p className="text-sm text-neutral-600">
                {product.otherDetails.manufacturAddress.description}
              </p>
              {product.otherDetails?.countoryOrigin?.description && (
                <p className="text-xs text-neutral-400 pt-1">
                  Country of Origin:{" "}
                  {product.otherDetails.countoryOrigin.description}
                </p>
              )}
            </div>
          )}

          {/* Category & Model details */}
          <div className="p-6 bg-neutral-50 rounded-2xl space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 font-mono">
              Product Identifier
            </h3>
            <p className="text-sm text-neutral-600 font-mono">
              Product ID: {product.productId || product._id}
            </p>
            <p className="text-xs text-neutral-400">
              Category: {product.category?.name || "Footwear & Lifestyle"}
            </p>
          </div>
        </div>
      </div>

      {/* Algorithmic Recommendations at bottom */}
      {recommendedProducts && recommendedProducts.length > 0 && (
        <div className="border-t border-neutral-200 pt-12 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">
                Recommended For You
              </span>
              <h2 className="text-2xl font-black uppercase font-mono tracking-tight text-neutral-900 mt-0.5">
                Complete Your Look
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {recommendedProducts
              .filter((p) => p._id !== product._id)
              .slice(0, 4)
              .map((item) => (
                <ProductCard key={item._id} detail={item} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
