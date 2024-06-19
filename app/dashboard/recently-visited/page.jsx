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

  const {
    cart,
    fetchCart,
    addProduct,
    removeProduct,
    updateProductQuantity,
    loading: carLoading,
    error,
  } = useCartStore();

  const {
    wishlist,
    fetchWishlist,
    addProductToWishlist,
    removeProductFromWishlist,
    loading: wishListLoading,
    // error,
  } = useWishlistStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleAddToCart = async (productId, quantity = 1) => {
    await addProduct(productId, quantity);
    fetchCart();

    // alert(12)
  };

  const handleRemoveFromCart = async (productId) => {
    await removeProduct(productId);
    fetchCart();
  };

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleAddToWishlist = async (productId) => {
    await addProductToWishlist(productId);
    fetchWishlist();
  };

  const handleRemoveFromWishlist = async (productId) => {
    await removeProductFromWishlist(productId);
    fetchWishlist();
  };

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
                  className={"w-[200px] md:w-[280px]  "}
                  cart={cart}
                  wishlist={wishlist}
                  handleAddToCart={handleAddToCart}
                  handleRemoveFromCart={handleRemoveFromCart}
                  handleAddToWishlist={handleAddToWishlist}
                  handleRemoveFromWishlist={handleRemoveFromWishlist}
                  carLoading={carLoading}
                  wishListLoading={wishListLoading}
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
