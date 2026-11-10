"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Truck,
  CheckCircle2,
  MapPin,
  CreditCard,
  Building,
} from "lucide-react";
import useCartStore from "@/stores/useCartStore";
import useOrderStore from "@/stores/useOrderStore";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import Loader from "@/components/loader";
import { formatPrice } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import clsx from "clsx";

export default function CartPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useProtectedRoute();
  const { cart, fetchCart, updateProductQuantity, removeProduct, clearCart, loading: cartLoading } =
    useCartStore();
  const { createOrder, loading: orderPlacing } = useOrderStore();

  // Checkout modal states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });
  const [shippingMethod, setShippingMethod] = useState("Standard");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [customerNotes, setCustomerNotes] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  if (userLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Calculate Subtotal & Price per item
  const getCartItemPrice = (item) => {
    if (typeof item.variant === "object" && item.variant?.price) {
      return item.variant.price;
    }
    // Check inside product.variants
    if (item.product?.variants?.length > 0) {
      const v = item.product.variants.find(
        (vr) => (vr._id || vr) === (item.variant?._id || item.variant)
      );
      if (v?.price) return v.price;
    }
    return item.product?.price || 0;
  };

  const subtotal = cart.reduce((acc, item) => {
    const price = getCartItemPrice(item);
    return acc + price * (item.quantity || 1);
  }, 0);

  const tax = subtotal * 0.18; // 18% GST as required by backend
  const shippingFee =
    subtotal === 0 ? 0 : shippingMethod === "Express" ? 100 : 50;
  const grandTotal = subtotal + tax + shippingFee;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    let shippingAddress = null;
    if (isAddingNewAddress || !user?.address?.length) {
      if (
        !newAddress.street ||
        !newAddress.city ||
        !newAddress.state ||
        !newAddress.postalCode
      ) {
        toast({
          variant: "destructive",
          title: "Incomplete Address",
          description: "Please fill in all address fields.",
        });
        return;
      }
      shippingAddress = newAddress;
    } else {
      shippingAddress = user.address[selectedAddressIndex];
    }

    if (!shippingAddress) {
      toast({
        variant: "destructive",
        title: "No shipping address selected",
      });
      return;
    }

    const itemsPayload = cart.map((item) => {
      const pId = item.product?._id || item.product;
      const vId = item.variant?._id || item.variant;
      return {
        product: pId,
        variant: vId,
        quantity: item.quantity || 1,
      };
    });

    try {
      const order = await createOrder({
        items: itemsPayload,
        shippingAddress,
        shippingMethod,
        paymentMethod,
        customerNotes,
      });

      if (order) {
        setPlacedOrder(order);
        clearCart();
        setIsCheckoutOpen(false);
      }
    } catch {
      // toast shown by store
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-6 border-b border-neutral-200">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-neutral-400">
            Checkout & Bag
          </span>
          <h1 className="text-3xl font-black uppercase font-mono tracking-tight text-neutral-900 mt-1">
            Shopping Bag
          </h1>
        </div>
        <p className="text-xs text-neutral-500 font-medium">
          {cart.length} {cart.length === 1 ? "item" : "items"} in bag
        </p>
      </div>

      {/* Cart Content or Empty State */}
      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Cart Items (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="divide-y divide-neutral-100 border-t border-b border-neutral-100">
              {cart.map((item, idx) => {
                const product = item.product;
                if (!product) return null;

                const variant =
                  typeof item.variant === "object"
                    ? item.variant
                    : product.variants?.find(
                        (v) => (v._id || v) === item.variant
                      );

                const itemPrice = getCartItemPrice(item);
                const displayImg =
                  variant?.images?.[0]?.url ||
                  product.images?.[0]?.url ||
                  "https://res.cloudinary.com/mohit786/image/upload/v1693677254/cv9gdgz150vtoimcga0e.jpg";

                const pId = product._id;
                const vId = variant?._id || item.variant;

                return (
                  <div
                    key={idx}
                    className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    {/* Image & Title */}
                    <div className="flex items-center gap-4">
                      <div
                        onClick={() => router.push(`/product/${product._id}`)}
                        className="relative w-20 h-20 sm:w-24 sm:h-24 bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-100 flex-shrink-0 cursor-pointer"
                      >
                        <Image
                          src={displayImg}
                          alt={product.title || "Product"}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                          {product.brand?.name || "STUDIO"}
                        </p>
                        <h3
                          onClick={() => router.push(`/product/${product._id}`)}
                          className="text-sm font-bold text-neutral-900 cursor-pointer hover:underline line-clamp-1"
                        >
                          {product.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          {variant?.color?.name && (
                            <span className="capitalize">
                              Color: {variant.color.name}
                            </span>
                          )}
                          {variant?.size?.name && (
                            <span>• Size: {variant.size.name}</span>
                          )}
                        </div>
                        <p className="text-sm font-bold font-mono text-neutral-900 pt-0.5">
                          {formatPrice(itemPrice)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity & Remove */}
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                      <div className="flex items-center border border-neutral-200 rounded-xl bg-white overflow-hidden">
                        <button
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateProductQuantity(pId, vId, item.quantity - 1);
                            } else {
                              removeProduct(pId, vId);
                            }
                          }}
                          className="p-1.5 hover:bg-neutral-100 text-neutral-600 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateProductQuantity(pId, vId, item.quantity + 1)
                          }
                          className="p-1.5 hover:bg-neutral-100 text-neutral-600 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right min-w-[80px]">
                        <p className="text-sm font-bold font-mono text-neutral-950">
                          {formatPrice(itemPrice * item.quantity)}
                        </p>
                      </div>

                      <button
                        onClick={() => removeProduct(pId, vId)}
                        className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex justify-between items-center text-xs">
              <Link
                href="/search"
                className="font-bold uppercase tracking-wider text-neutral-600 hover:text-black flex items-center gap-1.5"
              >
                <span>← Continue Shopping</span>
              </Link>
              <button
                onClick={() => clearCart()}
                className="text-neutral-400 hover:text-red-600 transition-colors"
              >
                Clear all bag items
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary (4 cols) */}
          <div className="lg:col-span-4">
            <div className="p-6 bg-white border border-neutral-200 rounded-3xl space-y-6 shadow-sm sticky top-28">
              <h2 className="text-sm font-bold uppercase tracking-widest font-mono text-neutral-900 pb-3 border-b border-neutral-100">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-neutral-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>GST & Taxes (18%)</span>
                  <span className="font-mono font-semibold text-neutral-900">
                    {formatPrice(tax)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-mono font-semibold text-neutral-900">
                    {shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}
                  </span>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex justify-between items-baseline text-sm font-bold text-neutral-950">
                  <span className="font-mono uppercase tracking-wider">
                    Total Amount
                  </span>
                  <span className="font-mono text-lg font-black">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Checkout trigger */}
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full py-4 bg-neutral-950 text-white text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-[11px] text-neutral-400 space-y-2">
                <p className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-600" />
                  <span>256-bit SSL encrypted secure checkout</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Doorstep delivery with real-time tracking</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Cart State */
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-5 bg-white border border-neutral-100 rounded-3xl p-8">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-mono uppercase text-neutral-900">
              Your Shopping Bag is Empty
            </h2>
            <p className="text-xs text-neutral-500 max-w-sm">
              Discover modern footwear, motorsport silhouettes, and elevated
              essentials ready to ship.
            </p>
          </div>
          <Link
            href="/search"
            className="px-6 py-3 bg-neutral-950 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-800 transition-colors"
          >
            Explore Catalog
          </Link>
        </div>
      )}

      {/* Interactive Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                  Fast & Secure
                </span>
                <h2 className="text-lg font-black font-mono uppercase tracking-tight text-neutral-900">
                  Complete Your Order
                </h2>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="text-xs font-bold px-3 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-600"
              >
                Close
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handlePlaceOrder} className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Shipping Address Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-neutral-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500" /> Shipping
                    Address
                  </h3>
                  {user?.address?.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setIsAddingNewAddress((prev) => !prev)
                      }
                      className="text-xs text-neutral-600 hover:text-black font-semibold underline"
                    >
                      {isAddingNewAddress ? "Use Saved Address" : "+ Add New Address"}
                    </button>
                  )}
                </div>

                {!isAddingNewAddress && user?.address?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {user.address.map((addr, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedAddressIndex(idx)}
                        className={clsx(
                          "p-4 rounded-2xl border text-xs cursor-pointer transition-all space-y-1",
                          selectedAddressIndex === idx
                            ? "border-black bg-neutral-50 shadow-xs"
                            : "border-neutral-200 hover:border-neutral-300"
                        )}
                      >
                        <p className="font-bold text-neutral-900">
                          Address #{idx + 1}
                        </p>
                        <p className="text-neutral-600">{addr.street}</p>
                        <p className="text-neutral-600">
                          {addr.city}, {addr.state} {addr.postalCode}
                        </p>
                        <p className="text-neutral-500">{addr.country}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Inline New Address Form */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-semibold text-neutral-600">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.street}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, street: e.target.value })
                        }
                        placeholder="House / Flat / Street"
                        className="w-full p-2.5 text-xs bg-white border border-neutral-200 rounded-xl mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-neutral-600">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.city}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, city: e.target.value })
                        }
                        placeholder="City"
                        className="w-full p-2.5 text-xs bg-white border border-neutral-200 rounded-xl mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-neutral-600">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.state}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, state: e.target.value })
                        }
                        placeholder="State"
                        className="w-full p-2.5 text-xs bg-white border border-neutral-200 rounded-xl mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-neutral-600">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.postalCode}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            postalCode: e.target.value,
                          })
                        }
                        placeholder="PIN Code"
                        className="w-full p-2.5 text-xs bg-white border border-neutral-200 rounded-xl mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-neutral-600">
                        Country
                      </label>
                      <input
                        type="text"
                        value={newAddress.country}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            country: e.target.value,
                          })
                        }
                        className="w-full p-2.5 text-xs bg-white border border-neutral-200 rounded-xl mt-1"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Shipping Method */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-neutral-900 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-neutral-500" /> Shipping
                  Method
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setShippingMethod("Standard")}
                    className={clsx(
                      "p-3.5 rounded-2xl border text-xs cursor-pointer transition-all flex justify-between items-center",
                      shippingMethod === "Standard"
                        ? "border-black bg-neutral-50 font-bold"
                        : "border-neutral-200 text-neutral-600"
                    )}
                  >
                    <div>
                      <p className="text-neutral-900 font-semibold">Standard</p>
                      <p className="text-[10px] text-neutral-500">3-5 Business Days</p>
                    </div>
                    <span className="font-mono">₹50</span>
                  </div>

                  <div
                    onClick={() => setShippingMethod("Express")}
                    className={clsx(
                      "p-3.5 rounded-2xl border text-xs cursor-pointer transition-all flex justify-between items-center",
                      shippingMethod === "Express"
                        ? "border-black bg-neutral-50 font-bold"
                        : "border-neutral-200 text-neutral-600"
                    )}
                  >
                    <div>
                      <p className="text-neutral-900 font-semibold">Express Air</p>
                      <p className="text-[10px] text-neutral-500">1-2 Business Days</p>
                    </div>
                    <span className="font-mono">₹100</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-neutral-900 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-neutral-500" /> Payment
                  Method
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {["COD", "Credit Card", "UPI"].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={clsx(
                        "py-3 px-2 rounded-xl border text-xs font-bold transition-all text-center",
                        paymentMethod === method
                          ? "border-black bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                      )}
                    >
                      {method === "COD" ? "Cash on Delivery" : method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Notes */}
              <div>
                <label className="text-[11px] font-semibold text-neutral-600">
                  Delivery Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Leave with security / Ring bell twice"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  className="w-full p-2.5 text-xs bg-white border border-neutral-200 rounded-xl mt-1"
                />
              </div>

              {/* Total Summary */}
              <div className="p-4 bg-neutral-50 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Items Total</span>
                  <span className="font-mono">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>18% GST</span>
                  <span className="font-mono">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Shipping ({shippingMethod})</span>
                  <span className="font-mono">{formatPrice(shippingFee)}</span>
                </div>
                <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline font-bold text-neutral-950 text-sm">
                  <span>Total Payable</span>
                  <span className="font-mono text-base font-black">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={orderPlacing}
                className="w-full py-4 bg-neutral-950 text-white text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {orderPlacing ? (
                  <span>Confirming Order...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Confirm & Place Order ({formatPrice(grandTotal)})</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Order Confirmation Success Dialog */}
      {placedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 text-center space-y-6 shadow-2xl border border-neutral-100">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full">
                Order Confirmed
              </span>
              <h2 className="text-2xl font-black font-mono uppercase text-neutral-900">
                Thank You For Your Order
              </h2>
              <p className="text-xs text-neutral-500">
                Your order ID is{" "}
                <span className="font-bold text-neutral-900 font-mono">
                  #{placedOrder.orderId || placedOrder._id}
                </span>
                . We have sent a confirmation details to your account.
              </p>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl text-xs space-y-1.5 text-left">
              <div className="flex justify-between">
                <span className="text-neutral-500">Payment:</span>
                <span className="font-semibold text-neutral-900">
                  {placedOrder.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Status:</span>
                <span className="font-semibold text-emerald-600">
                  {placedOrder.orderStatus || "Processing"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Total:</span>
                <span className="font-mono font-bold text-neutral-900">
                  {formatPrice(placedOrder.pricing?.totalAmount || grandTotal)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setPlacedOrder(null);
                  router.push("/dashboard/orders");
                }}
                className="flex-1 py-3 bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-black transition-colors"
              >
                Track Orders
              </button>
              <button
                onClick={() => {
                  setPlacedOrder(null);
                  router.push("/");
                }}
                className="flex-1 py-3 bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-200 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
