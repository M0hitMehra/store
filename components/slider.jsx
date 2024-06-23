import React, { useEffect } from "react";
import ProductCard from "./productCard";
import useCartStore from "@/stores/useCartStore";
import useWishlistStore from "@/stores/useWishlistStore";

const Slider = ({ data }) => {
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
  return (
    <div className="flex justify-start items-center overflow-x-auto gap-20 p-8 w-[99vw]">
      {data?.map((value) => (
        <ProductCard
          key={value?._id}
          detail={value}
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
  );
};

export default Slider;
