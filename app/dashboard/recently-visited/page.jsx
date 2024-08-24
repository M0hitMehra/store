"use client";

import Loader from "@/components/loader";
import ProductCard from "@/components/productCard";
import { server } from "@/lib/utils";
import useCartStore from "@/stores/useCartStore";
import useWishlistStore from "@/stores/useWishlistStore";
import axios from "axios";
import React, { useEffect, useState } from "react";

const RecentlyVisited = () => {
  const [recentProducts, setRecentProducts] = useState(null);

  const { fetchCart } = useCartStore();

  const { fetchWishlist } = useWishlistStore();

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const getRecentlyVisited = async () => {
    const { data } = await axios.get(`${server}/auth/user/recently-visited`, {
      withCredentials: true,
    });
    if (data?.success) {
      setRecentProducts(data?.recentlyVisited);
    }
  };

  useEffect(() => {
    getRecentlyVisited();
  }, []);

  return (
    <div className=" h-full w-full">
      {recentProducts ? (
        <>
          {recentProducts && recentProducts?.length > 0 ? (
            <div className="flex flex-wrap gap-20 px-20 py-10 justify-center items-start">
              {recentProducts?.map((product) => (
                <ProductCard
                  key={product?._id}
                  detail={product}
                  className={"w-[200px] md:w-[280px]"}
                />
              ))}
            </div>
          ) : (
            <p className="h-full w-full flex justify-center items-center text-white font-medium text-xl">
              Uh Oh! you haven&apos;t visited any product yet
            </p>
          )}
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default RecentlyVisited;
