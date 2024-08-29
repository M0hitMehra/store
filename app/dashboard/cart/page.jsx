"use client";

import { Separator } from "@/components/ui/separator";
import React, { useEffect } from "react";
import useCartStore from "@/stores/useCartStore";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import Loader from "@/components/loader";
import Link from "next/link";
import Image from "next/image";
import { Trash } from "lucide-react";

const CartItem = ({ item }) => {
  const updateProductQuantity = useCartStore((state) => state?.updateProductQuantity);
  const removeProduct = useCartStore((state) => state?.removeProduct);

  const handleQuantityChange = (event) => {
    const quantity = parseInt(event.target.value, 10);
    updateProductQuantity(item?.product?._id, quantity);
  };

  const handleRemove = () => {
    removeProduct(item?.product?._id);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b gap-4">
      <div className="flex items-center gap-4">
        <Image
          src={item?.product?.images[0]?.url || "/placeholder.png"}
          alt={item?.product?.title}
          width={80}
          height={80}
          className="rounded-md"
        />
        <div>
          <h3 className="font-semibold text-lg">{item?.product?.title}</h3>
          <p className="text-gray-600">${item?.product?.price?.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="number"
          min="1"
          value={item?.quantity}
          onChange={handleQuantityChange}
          className="w-16 p-1 border rounded text-center"
        />
        <button onClick={handleRemove} className="text-red-600 hover:text-red-800">
          <Trash className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const Cart = () => {
  const { user, loading } = useProtectedRoute();
  const { cart, fetchCart } = useCartStore((state) => state);

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

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
            {cart?.map((item) => (
              <CartItem key={item?.product?._id} item={item} />
            ))}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
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
