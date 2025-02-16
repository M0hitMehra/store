"use client";

import Error from "@/components/error";
import Loader from "@/components/loader";
import axios from "axios";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../../globals.css";
import { cn, invertColor, server } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import SingleProductCarousel from "@/components/singleProductCarousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/authContext";
import Slider from "@/components/slider";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import useCartStore from "@/stores/useCartStore";
import useWishlistStore from "@/stores/useWishlistStore";
import useRecommendedProductsStore from "@/stores/useRecommendedProductsStore";

const ProductDetails = ({ params }) => {
  const { product_id } = params;
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedStock, setSelectedStock] = useState(1);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [recentProducts, setRecentProducts] = useState(null);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [availableColors, setAvailableColors] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);

  const {
    wishlist,
    fetchWishlist,
    addProductToWishlist,
    removeProductFromWishlist,
    loading: wishlistLoading,
  } = useWishlistStore();
  const { cart, addProduct, removeProduct, fetchCart } = useCartStore();

  const router = useRouter();

  function formatNumberWithCommas(number) {
    if (typeof number !== "number") return "0";
    return number.toLocaleString();
  }

  // Fetch product details and set initial state
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const { data } = await axios.get(`${server}/product/${product_id}`);
        if (data.success) {
          const product = data.product;
          setProductDetails(product);

          // Handle variants
          if (product.variants && product.variants.length > 0) {
            setVariants(product.variants);

            // Set initial variant
            setSelectedVariant(product.variants[0]);

            // Set available colors and sizes
            const uniqueColors = [
              ...new Map(
                product.variants.map((v) => [v.color._id, v.color])
              ).values(),
            ];

            const uniqueSizes = [
              ...new Map(
                product.variants.map((v) => [v.size._id, v.size])
              ).values(),
            ];

            console.log(uniqueColors, uniqueSizes);
            setAvailableColors(uniqueColors);
            setAvailableSizes(uniqueSizes);
          }
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [product_id]);

  // Handle variant selection
  const handleVariantSelect = (colorId, sizeId) => {
    const newVariant = variants.find(
      (v) => v.color._id === colorId && v.size._id === sizeId
    );

    if (newVariant) {
      setSelectedVariant(newVariant);
      // Reset stock selection when variant changes
      setSelectedStock(1);
      return;
    }

    const newColorVariant = variants.find(
      (v) =>
        v.color._id === colorId && v.color._id !== selectedVariant?.color?._id
    );

    if (newColorVariant) {
      setSelectedVariant(newColorVariant);
      // Reset stock selection when variant changes
      setSelectedStock(1);
      return;
    }

    const newSizeVariant = variants.find((v) => v.size._id === sizeId);

    if (newSizeVariant) {
      setSelectedVariant(newSizeVariant);
      // Reset stock selection when variant changes
      setSelectedStock(1);
      return;
    }

    toast({
      variant: "destructive",
      title: "This combination is not available right now.",
    });
  };

  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  // Check if product is in wishlist/cart
  useEffect(() => {
    setIsInWishlist(
      wishlist.some((item) => item?.product?._id === productDetails?._id)
    );
  }, [wishlist, productDetails]);

  useEffect(() => {
    setIsInCart(
      cart?.some(
        (item) =>
          item?.product._id === productDetails?._id &&
          item?.variant === selectedVariant?._id
      )
    );
  }, [cart, productDetails, selectedVariant]);

  const handleWishlistClick = async () => {
    if (!productDetails) return;

    if (isInWishlist) {
      await removeProductFromWishlist(productDetails._id);
    } else {
      await addProductToWishlist(productDetails._id);
    }
    fetchWishlist();
  };

  const handleCartClick = async () => {
    if (!productDetails || !selectedVariant) return;

    if (isInCart) {
      // await removeProduct(productDetails._id);
      router.push("/dashboard/cart");
    } else {
      await addProduct(productDetails._id, selectedVariant._id, selectedStock);
    }
    fetchCart();
  };
  const { recommendedProducts, getRecommendationProduct } =
    useRecommendedProductsStore();

  // Fetch recently visited products
  useEffect(() => {
    const getRecentlyVisited = async () => {
      if (!user) return;
      getRecommendationProduct(user._id);
      try {
        const { data } = await axios.get(
          `${server}/auth/user/recently-visited`,
          {
            params: { limit: 10 },
            withCredentials: true,
          }
        );
        if (data?.success) {
          setRecentProducts(data.recentlyVisited);
        }
      } catch (error) {
        console.error("Error fetching recent products:", error);
      }
    };

    getRecentlyVisited();
  }, [user]);

  if (loading) return <Loader />;
  if (error) return <Error message={`Unable to display product: ${error}`} />;

  const isAddToCartDisabled = !selectedVariant || selectedVariant.stock <= 0;
  return (
    <div className="flex flex-col justify-center items-center p-5 gap-10">
      {/* Product Images and Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-9 w-full border-b">
        {/* Images Section */}
        <div className="col-span-1 md:col-span-5 overflow-y-auto md:max-h-screen">
          <div className="p-1 flex justify-start items-center gap-5 flex-wrap">
            {selectedVariant?.images && selectedVariant?.images?.length > 0
              ? selectedVariant?.images?.map((image, index) => (
                  <Dialog key={index}>
                    <DialogTrigger className="max-w-[45%] h-full">
                      <Image
                        src={
                          image?.url ||
                          "https://res.cloudinary.com/mohit786/image/upload/v1693677254/cv9gdgz150vtoimcga0e.jpg"
                        }
                        alt={productDetails?.title}
                        width={800}
                        height={600}
                        className="w-full h-full object-cover rounded-sm"
                      />
                    </DialogTrigger>
                    <DialogContent className="max-w-[90vw] max-h-[90vh]">
                      <DialogHeader>
                        <DialogTitle>{productDetails?.title}</DialogTitle>
                        <DialogDescription>
                          <SingleProductCarousel
                            data={selectedVariant?.images}
                          />
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                ))
              : productDetails?.images?.map((image, index) => (
                  <Dialog key={index}>
                    <DialogTrigger className="max-w-[45%] h-full">
                      <Image
                        src={
                          image?.url ||
                          "https://res.cloudinary.com/mohit786/image/upload/v1693677254/cv9gdgz150vtoimcga0e.jpg"
                        }
                        alt={productDetails?.title}
                        width={800}
                        height={600}
                        className="w-full h-full object-cover rounded-sm"
                      />
                    </DialogTrigger>
                    <DialogContent className="max-w-[90vw] max-h-[90vh]">
                      <DialogHeader>
                        <DialogTitle>{productDetails?.title}</DialogTitle>
                        <DialogDescription>
                          <SingleProductCarousel
                            data={productDetails?.images}
                          />
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-8 p-5">
          {/* Title and Price */}
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-2xl">{productDetails?.title}</h1>
            <h5 className="text-lg font-semibold">
              ₹{" "}
              {formatNumberWithCommas(
                selectedVariant?.price || productDetails?.price
              )}
              <span className="text-xs font-light block">Includes GST</span>
            </h5>
          </div>

          <Separator />

          {/* Variant Selection */}
          {variants.length > 0 && (
            <div className="flex flex-col gap-6">
              {/* Colors */}
              <div className="flex flex-col gap-3">
                <h2 className="font-bold text-xl">Select Color</h2>
                <div className="flex gap-4 flex-wrap">
                  {availableColors.map((color) => (
                    <Button
                      variant={"ghost"}
                      key={color._id}
                      onClick={() =>
                        handleVariantSelect(color._id, selectedVariant.size._id)
                      }
                      className={clsx(
                        "p-2 border rounded-md",
                        selectedVariant?.color?._id === color?._id
                          ? "border-black"
                          : "border-gray-200"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color?.code }}
                        />
                        <span>{color?.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="flex flex-col gap-3">
                <h2 className="font-bold text-xl">Select Size</h2>
                <div className="flex gap-4 flex-wrap">
                  {availableSizes.map((size) => (
                    <Button
                      variant={"ghost"}
                      key={size._id}
                      onClick={() =>
                        handleVariantSelect(selectedVariant.color._id, size._id)
                      }
                      className={clsx(
                        "px-4 py-2 border rounded-md",
                        selectedVariant?.size._id === size._id
                          ? "border-black"
                          : "border-gray-200"
                      )}
                    >
                      {size.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Stock Selection and Add to Cart */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1 flex items-center justify-start gap-2">
              {!isInCart && selectedVariant && selectedVariant.stock > 0 && (
                <>
                  <Button
                    onClick={() =>
                      setSelectedStock((prev) =>
                        Math.min(prev + 1, selectedVariant.stock)
                      )
                    }
                    className="w-10 h-10"
                  >
                    +
                  </Button>
                  <input
                    type="text"
                    className="w-10 h-10 text-center"
                    value={selectedStock}
                    readOnly
                  />
                  <Button
                    onClick={() =>
                      setSelectedStock((prev) => Math.max(prev - 1, 1))
                    }
                    className="w-10 h-10"
                  >
                    -
                  </Button>
                </>
              )}
            </div>

            <div className="col-span-2 flex flex-col gap-2">
              <Button onClick={handleCartClick} disabled={isAddToCartDisabled}>
                {isInCart ? "Go to Cart" : "Add to Cart"}
              </Button>
              <Button
                variant="outline"
                onClick={handleWishlistClick}
                disabled={wishlistLoading}
              >
                {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Extra details */}
      {productDetails?.otherDetails?.productStory?.description &&
        productDetails?.otherDetails?.productDetails?.description &&
        productDetails?.otherDetails?.manufacturAddress?.description &&
        productDetails?.otherDetails?.countoryOrigin?.description && (
          <div className="p-4 sm:p-8 w-full">
            <div className="flex flex-col justify-center items-center rounded-md p-4 sm:p-5 bg-gray-200 w-full gap-6 sm:gap-10">
              {productDetails?.otherDetails?.productStory && (
                <div className="w-full flex flex-col justify-center items-start gap-2 sm:gap-3">
                  <h1 className="text-lg sm:text-2xl font-bold">
                    {productDetails?.otherDetails?.productStory?.title}
                  </h1>
                  <p className="text-sm sm:text-base font-light text-neutral-800">
                    {productDetails?.otherDetails?.productStory?.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-6 justify-center items-start w-full gap-4">
                {productDetails?.otherDetails?.productDetails && (
                  <div className="sm:col-span-3 flex flex-col justify-center items-start gap-2 sm:gap-3">
                    <h1 className="text-lg sm:text-2xl font-bold">
                      {productDetails?.otherDetails?.productDetails?.title}
                    </h1>
                    <ul className="list-disc flex flex-col justify-center items-start pl-4 gap-1 sm:gap-2">
                      {productDetails?.otherDetails?.productDetails?.description?.map(
                        (detail) => (
                          <li
                            key={detail}
                            className="text-sm sm:text-base font-light text-neutral-800"
                          >
                            {detail}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {productDetails?.otherDetails?.manufacturAddress && (
                  <div className="sm:col-span-3 flex flex-col justify-center items-start gap-2 sm:gap-3">
                    <h1 className="text-lg sm:text-2xl font-bold">
                      {productDetails?.otherDetails?.manufacturAddress?.title}
                    </h1>
                    <p className="text-sm sm:text-base font-light text-neutral-800">
                      {
                        productDetails?.otherDetails?.manufacturAddress
                          ?.description
                      }
                    </p>
                  </div>
                )}
              </div>

              {productDetails?.otherDetails?.countoryOrigin && (
                <div className="w-full flex flex-col justify-center items-start gap-2 sm:gap-3">
                  <h1 className="text-lg sm:text-2xl font-bold">
                    {productDetails?.otherDetails?.countoryOrigin?.title}
                  </h1>
                  <p className="text-sm sm:text-base font-light text-neutral-800">
                    {productDetails?.otherDetails?.countoryOrigin?.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
    

      {/* Recommended Products */}
      {recentProducts && recentProducts.length > 0 && (
        <div className="w- flex flex-col gap-4">
          <h2 className="text-2xl font-bold pl-9">Recommended Products</h2>
          <Slider data={recommendedProducts} />
        </div>
      )}

        {/* Recently Visited */}
        {recentProducts && recentProducts.length > 0 && (
        <div className="w- flex flex-col gap-4">
          <h2 className="text-2xl font-bold pl-9">Recently Visited</h2>
          <Slider data={recentProducts} />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
