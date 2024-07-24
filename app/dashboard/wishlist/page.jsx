"use client";

import Loader from "@/components/loader";
import ProductCard from "@/components/productCard";
import { toast } from "@/components/ui/use-toast";
import { server } from "@/lib/utils";
import useCartStore from "@/stores/useCartStore";
import useWishlistStore from "@/stores/useWishlistStore";
import axios from "axios";
import clsx from "clsx";
import { Trash2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";

const Wishlist = () => {
  const [wishListProducts, setWishListProducts] = useState(null);

  const { fetchCart } = useCartStore();

  const { fetchWishlist, wishlist } = useWishlistStore();

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const getWishlistedItem = async () => {
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
    getWishlistedItem();
  }, [wishlist]);

  return (
    <>
      {wishListProducts ? (
        <>
          {wishListProducts && wishListProducts?.length > 0 ? (
            <div className=" flex flex-wrap gap-20 px-20 py-10 justify-center items-start">
              {wishListProducts?.map((item) => (
                <div
                  className=" flex flex-col justify-center items-center "
                  key={item?._id}
                >
                  <ProductCard
                    key={item?._id}
                    detail={item?.product}
                    className={"w-[200px] md:w-[280px] "}
                  />
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
