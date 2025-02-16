"use client";

import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import useCartStore from "@/stores/useCartStore";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import Loader from "@/components/loader";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash } from "lucide-react";

const CartItem = ({ item, setChangesMade }) => {
  const route = useRouter();
  const updateProductQuantity = useCartStore(
    (state) => state?.updateProductQuantity
  );
  const removeProduct = useCartStore((state) => state?.removeProduct);

  const handleDecrease = async () => {
    if (item?.quantity > 1) {
      await updateProductQuantity(
        item?.product?._id,
        item?.variant,
        item?.quantity - 1
      );
    }
  };

  const handleIncrease = async () => {
    await updateProductQuantity(
      item?.product?._id,
      item?.variant,
      item?.quantity + 1
    );
  };

  const handleRemove = async () => {
    await removeProduct(item?.product?._id,item?.variant);
    setChangesMade((prev) => !prev);
  
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center items-start justify-between sm:p-4 p-1 border-b gap-4">
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={() => {
          route.push(`/product/${item?.product?._id}`);
        }}
      >
        <Image
          src={item?.product?.images[0]?.url || "/placeholder.png"}
          alt={item?.product?.title}
          width={80}
          height={100}
          className="rounded-md"
        />
        <div>
          <h3 className="font-semibold text-lg">{item?.product?.title}</h3>
          <p className="text-gray-600">${item?.product?.price?.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center w-full justify-center sm:justify-end gap-4">
        <button
          onClick={handleDecrease}
          className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
        >
          <Minus className="w-5 h-5" />
        </button>
        <span className="w-10 text-center">{item?.quantity}</span>
        <button
          onClick={handleIncrease}
          className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={handleRemove}
          className="text-red-600 hover:text-red-800"
        >
          <Trash className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const Cart = () => {
  const { user, loading } = useProtectedRoute();
  const {
    cart,
    fetchCart,
    loading: cartLoading,
  } = useCartStore((state) => state);

  const [changesMade, setChangesMade] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart,changesMade]);

  if (loading || cartLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="container mx-auto p-1 sm:p-4 w-full h-full">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
          {user?.firstName + "'s"} Cart
        </h1>
        {cart?.length > 0 ? (
          <div className="space-y-4">
            {cart?.map((item) => (
              <CartItem
                key={item?.product?._id}
                item={item}
                setChangesMade={setChangesMade}
              />
            ))}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
              <Link href="/">
                <p className="text-blue-600 hover:text-blue-800">
                  Continue Shopping
                </p>
              </Link>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
                Checkout
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center flex justify-center items-center h-full w-full flex-col p-4 sm:p-20">
            <div className="flex justify-center items-center flex-col p-10 sm:p-20 shadow-xl border-2 rounded-bl-full rounded-t-full">
              <p>Your cart is empty.</p>
              <Link href="/">
                <p className="text-blue-600 hover:text-blue-800 mt-4 block">
                  Go shopping
                </p>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
