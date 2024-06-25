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
  LucideHeartCrack,
  LucideTrash2,
  ShoppingCartIcon,
} from "lucide-react";
import axios from "axios";
import { toast } from "./ui/use-toast";
import { useAuth } from "@/context/authContext";
import { server } from "@/lib/utils";
import useCartStore from "@/stores/useCartStore";

const ProductCard = ({
  detail,
  wishlist,
  className,
  handleRemoveFromCart,
  handleAddToCart,
  cart,
  handleAddToWishlist,
  handleRemoveFromWishlist,
  carLoading,
  wishListLoading,
}) => {
  const router = useRouter();

  const { user, loading: authLoading } = useAuth();
  const [buttonLoadingState, setButtonLoadingState] = useState(false);
  const [isPresentOnWishList, setisPresentOnWishList] = useState(false);
  const [wishListProducts, setWishListProducts] = useState([]);
  const [isInCart, setIsInCart] = useState(
    cart.some((item) => item?.product?._id === detail?._id)
  );
  const [isInWishlist, setIsInWishlist] = useState(
    wishlist.some((item) => item?._id === detail?._id)
  );

  const onClick = () => {
    router.push(`/product/${detail?._id}`);
  };

  useEffect(() => {
    setIsInCart(cart.some((item) => item?.product?._id === detail?._id));
  }, [isInCart, cart, detail]);

  useEffect(() => {
    setIsInWishlist(wishlist.some((item) => item?._id === detail?._id));
  }, [wishlist, detail]);

  const addToWishlistHandler = async (productId) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Please login to perfrom the action",
      });
      return;
    }
    setButtonLoadingState(true);
    try {
      const { data } = await axios.post(
        `${server}/auth/wishlist/${productId}`,
        {},
        {
          withCredentials: true, // Include credentials for cookies
        }
      );

      if (data.success) {
        setWishListProducts((prevProducts) => [
          ...prevProducts,
          { _id: productId },
        ]);
        setisPresentOnWishList(true);
        toast({
          variant: "success",
          title: "Added to wishlist successfully",
        });
      }
      setButtonLoadingState(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to add to wishlist",
      });
      setButtonLoadingState(false);
    }
  };

  const removeFromWishlistHandler = async (productId) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Please login to perfrom the action",
      });
      return;
    }
    setButtonLoadingState(true);
    try {
      const { data } = await axios.delete(
        `${server}/auth/wishlist/remove/${productId}`,
        {
          withCredentials: true, // Include credentials for cookies
        }
      );

      if (data.success) {
        setisPresentOnWishList(false);
        toast({
          variant: "success",
          title: "Removed from wishlist successfully",
        });
        setWishListProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)
        );
      }
      setButtonLoadingState(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to remove from wishlist",
      });
      setButtonLoadingState(false);
    }
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
              <CustomTooltip description={detail?.title} side="top">
                {detail?.title?.slice(0, 30)} ...
              </CustomTooltip>
            </p>
            <span className="text-xs md:text-sm col-span-1">
              ${detail?.price}
            </span>
          </div>
          <div className=" w-full grid grid-cols-4 gap-5">
            <CustomTooltip
              className={" w-full col-span-2"}
              side="left"
              description={isInCart ? "Remove From Cart" : "Add To Cart"}
            >
              <Button
                className=" w-full flex items-center justify-center"
                onClick={() =>
                  isInCart
                    ? handleRemoveFromCart(detail?._id)
                    : handleAddToCart(detail?._id, 1)
                }
              >
                {isInCart ? (
                  carLoading ? (
                    <Loader className="text-white animate-spin" />
                  ) : (
                    <LucideTrash2 />
                  )
                ) : wishListLoading ? (
                  <Loader className="text-white animate-spin" />
                ) : (
                  <ShoppingCartIcon />
                )}
              </Button>
            </CustomTooltip>
            <CustomTooltip
              className={" w-full col-span-2"}
              side="right"
              description={
                isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"
              }
            >
              <Button
                variant="destructive"
                className="  w-full flex items-center justify-center  "
                onClick={() =>
                  isInWishlist
                    ? handleRemoveFromWishlist(detail?._id)
                    : handleAddToWishlist(detail?._id)
                }
              >
                {isInWishlist ? (
                  wishListLoading ? (
                    <Loader className="text-white animate-spin" />
                  ) : (
                    <HeartOff className={clsx("text-white")} />
                  )
                ) : wishListLoading ? (
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
