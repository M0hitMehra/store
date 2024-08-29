"use client";

import { Separator } from "@/components/ui/separator";
import React, { useEffect } from "react";
import useCartStore from "@/stores/useCartStore";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import Loader from "@/components/loader";
import Link from "next/link";

const CartItem = ({ item }) => {
  return <div></div>;
};

const Cart = () => {
  const { user, loading } = useProtectedRoute();
  const { cart, fetchCart } = useCartStore((state) => state);

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  console.log(cart?.length)

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
     <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{user?.firstName+"'s"} Cart</h1>
      {cart?.length > 0 ? (
        <div className="space-y-4">
          {cart.map((item) => (
            <CartItem key={item.product._id} item={item} />
          ))}
          <div className="flex justify-between items-center mt-6">
            <Link href="/">
              <p className="text-blue-600 hover:text-blue-800">Continue Shopping</p>
            </Link>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
              Checkout
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p>Your cart is empty.</p>
          <Link href="/">
            <p className="text-blue-600 hover:text-blue-800 mt-4 block">Go shopping</p>
          </Link>
        </div>
      )}
    </div>
    </div>
  );
};

export default Cart;
