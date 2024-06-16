"use client";

import CustomTooltip from "@/components/custom-tooltip";
import Loader from "@/components/loader";
import ProductCard from "@/components/productCard";
import { toast } from "@/components/ui/use-toast";
import { server } from "@/lib/utils";
import axios from "axios";
import clsx from "clsx";
import { Trash2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";

const Wishlist = () => {
  const [wishListProducts, setWishListProducts] = useState(null);
  const [buttonLoadingState, setButtonLoadingState] = useState(false);

  const getRecentlyVisited = async () => {
    const { data } = await axios.get(
      `${server}/auth/wishlist`,

      {
        withCredentials: true,
      }
    );
    if (data?.success) {
      setWishListProducts(data?.wishlist);
    }
  };

  useEffect(() => {
    getRecentlyVisited();
  }, []);

  const removeFromWishlistHandler = async (productId) => {
    setButtonLoadingState(true);
    try {
      const { data } = await axios.delete(
        `${server}/auth/wishlist/remove/${productId}`,
        {
          withCredentials: true, // Include credentials for cookies
        }
      );

      if (data.success) {
        setWishListProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)
        );
        toast({
          variant: "success",
          title: "Removed from wishlist successfully",
        });
      }
      setButtonLoadingState(false);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Failed to remove from wishlist",
      });
      setButtonLoadingState(false);
    }
  };

  return (
    <>
      {wishListProducts ? (
        <>
          {wishListProducts && wishListProducts?.length > 0 ? (
            <div className=" flex flex-wrap gap-20 px-20 py-10 justify-center items-start">
              {wishListProducts?.map((product) => (
                <div
                  className=" flex flex-col justify-center items-center "
                  key={product?._id}
                >
                  <ProductCard
                    key={product?._id}
                    detail={product}
                    className={
                      "w-[200px] md:w-[280px] h-[250px] md:h-[330px] rounded-none rounded-t-xl "
                    }
                  />
                  <CustomTooltip
                    description={"Remove from wishlist"}
                    className="w-full"
                  >
                    <span
                      className={clsx(
                        "  w-full  bg-[tomato] hover:bg-red-400 rounded-b-xl flex gap-5 justify-center items-center py-5 px-3 cursor-pointer ",
                        {
                          "pointer-events-none opacity-95": buttonLoadingState,
                        }
                      )}
                      onClick={() => removeFromWishlistHandler(product?._id)}
                    >
                      <Trash2Icon className=" text-black" />
                    </span>
                  </CustomTooltip>
                </div>
              ))}
            </div>
          ) : (
            <p className=" h-full w-full flex justify-center items-center text-white font-medium text-xl">
              Uh Oh! you haven&apos;t wishlisted any product yet
            </p>
          )}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Wishlist;
