"use client";

import Loader from "@/components/loader";
import ProductCard from "@/components/productCard";
import { server } from "@/lib/utils";
import axios from "axios";
import React, { useEffect, useState } from "react";

const RecentlyVisited = () => {
  const [recentProducts, setRecentProducts] = useState(null);

  const getRecentlyVisited = async () => {
    const { data } = await axios.get(
      `${server}/auth/user/recently-visited`,

      {
        withCredentials: true,
      }
    );
    if (data?.success) {
      setRecentProducts(data?.recentlyVisited);
    }
  };

  useEffect(() => {
    getRecentlyVisited();
  }, []);

  console.log(recentProducts);

  return (
    <>
      {recentProducts ? (
        <>
          {recentProducts && recentProducts?.length > 0 ? (
            <div className=" flex flex-wrap gap-20 px-20 py-10 justify-center items-start">
              {recentProducts?.map((product) => (
                <ProductCard
                  key={product?._id}
                  detail={product}
                  className={"w-[200px] md:w-[280px] h-[250px] md:h-[330px] "}
                />
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

export default RecentlyVisited;
