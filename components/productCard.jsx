"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import ProductCarousel from "./productCarousel";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import CustomTooltip from "./custom-tooltip";
import { Button } from "./ui/button";
import {
  Heart,
  HeartOff,
  Loader,
  LucideTrash2,
  ShoppingCartIcon,
} from "lucide-react";
import useCartStore from "@/stores/useCartStore";
import { useAuth } from "@/context/authContext";
import useWishlistStore from "@/stores/useWishlistStore";

const ProductCard = ({ detail, className }) => {
  const router = useRouter();

  const { cart, addProduct, removeProduct, fetchCart } = useCartStore();
  const {
    wishlist,
    fetchWishlist,
    addProductToWishlist,
    removeProductFromWishlist,
  } = useWishlistStore();

  const [isInCart, setIsInCart] = useState(
    cart?.some((item) => item?.product._id === detail?._id)
  );
  const [isInWishlist, setIsInWishlist] = useState(
    wishlist.some((item) => item?.product?._id === detail?._id)
  );
  const [localCartLoading, setLocalCartLoading] = useState(false);
  const [localWishlistLoading, setLocalWishlistLoading] = useState(false);

  const checkIfInCart = () => {
    setIsInCart(cart?.some((item) => item?.product._id === detail?._id));
  };

  const checkIfInWishlist = () => {
    setIsInWishlist(
      wishlist.some((item) => item?.product?._id === detail?._id)
    );
  };

  const handleCartClick = async () => {
    setLocalCartLoading(true);
    if (isInCart) {
      await removeProduct(detail?._id);
    } else {
      await addProduct(detail?._id, 1);
    }
    fetchCart();
    checkIfInCart();
    setLocalCartLoading(false);
  };

  const handleWishlistClick = async () => {
    setLocalWishlistLoading(true);
    if (isInWishlist) {
      await removeProductFromWishlist(detail?._id);
    } else {
      await addProductToWishlist(detail?._id);
    }
    fetchWishlist();
    checkIfInWishlist();
    setLocalWishlistLoading(false);
  };

  useEffect(() => {
    checkIfInCart();
  }, [cart]);

  useEffect(() => {
    checkIfInWishlist();
  }, [wishlist]);

  const onClick = () => {
    router.push(`/product/${detail?._id}`);
  };

  return (
    <Card
      className={clsx(
        " flex-shrink-0 cursor-pointer w-[250px] h-[400px] md:w-[360px]  md:h-[400px]",
        className
      )}
    >
      <CardContent className="relative">
        <ProductCarousel
          images={detail?.images}
          color={detail?.color}
          onClick={onClick}
        />
      </CardContent>
      <CardFooter>
        <div className=" flex flex-col gap-5 justify-center items-center w-full">
          <div className="grid grid-cols-6 w-full" onClick={onClick}>
            <p className="text-sm md:text-base font-semibold col-span-5 ">
              <CustomTooltip content={detail?.title} side="top">
                <span>{detail?.title?.slice(0, 30)} ...</span>
              </CustomTooltip>
            </p>
            <span className="text-xs md:text-sm col-span-1">
              ${detail?.price}
            </span>
          </div>
          <div className=" w-full flex justify-center items-center gap-5">
            <CustomTooltip
              side="left"
              content={isInCart ? "Remove From Cart" : "Add To Cart"}
            >
              <Button
                className="w-full flex items-center justify-center"
                onClick={handleCartClick}
                disabled={localCartLoading}
              >
                {isInCart ? (
                  localCartLoading ? (
                    <Loader className="text-white animate-spin" />
                  ) : (
                    <LucideTrash2 />
                  )
                ) : localCartLoading ? (
                  <Loader className="text-white animate-spin" />
                ) : (
                  <ShoppingCartIcon />
                )}
              </Button>
            </CustomTooltip>

            <CustomTooltip
              side="right"
              content={
                isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"
              }
            >
              <Button
                variant="destructive"
                className="  w-full flex items-center justify-center  "
                onClick={handleWishlistClick}
                disabled={localWishlistLoading}
              >
                {isInWishlist ? (
                  localWishlistLoading ? (
                    <Loader className="text-white animate-spin" />
                  ) : (
                    <HeartOff className={clsx("text-white")} />
                  )
                ) : localWishlistLoading ? (
                  <Loader className="text-white animate-spin" />
                ) : (
                  <Heart className={clsx("text-white")} />
                )}
              </Button>
            </CustomTooltip>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
