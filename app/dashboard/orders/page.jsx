"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  XCircle,
  Calendar,
  ChevronRight,
  Info,
} from "lucide-react";
import useOrderStore from "@/stores/useOrderStore";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import Loader from "@/components/loader";
import { formatPrice, formatDate } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import clsx from "clsx";

export default function OrdersPage() {
  const { user, loading: userLoading } = useProtectedRoute();
  const {
    orders,
    totalOrders,
    totalPages,
    currentPage,
    loading: ordersLoading,
    fetchOrders,
    cancelOrder,
    requestReturn,
    fetchOrderHistory,
  } = useOrderStore();

  const [activeStatus, setActiveStatus] = useState("all");
  const [selectedOrderForCancel, setSelectedOrderForCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState(null);
  const [returnReason, setReturnReason] = useState("");
  const [returning, setReturning] = useState(false);

  const [selectedOrderHistory, setSelectedOrderHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchOrders(activeStatus === "all" ? "" : activeStatus, 1);
    }
  }, [user, activeStatus, fetchOrders]);

  if (userLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrderForCancel || !cancelReason.trim()) {
      toast({
        variant: "destructive",
        title: "Please enter a cancellation reason",
      });
      return;
    }
    setCancelling(true);
    try {
      await cancelOrder(selectedOrderForCancel.orderId, cancelReason);
      setSelectedOrderForCancel(null);
      setCancelReason("");
      fetchOrders(activeStatus === "all" ? "" : activeStatus, currentPage);
    } catch {
      // Toast handled by store
    } finally {
      setCancelling(false);
    }
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrderForReturn || !returnReason.trim()) {
      toast({
        variant: "destructive",
        title: "Please enter a reason for returning",
      });
      return;
    }
    setReturning(true);
    try {
      const itemsPayload = selectedOrderForReturn.items.map((i) => ({
        product: i.product?._id || i.product,
        variant: i.variant?._id || i.variant,
        quantity: i.quantity,
      }));

      await requestReturn(
        selectedOrderForReturn.orderId,
        itemsPayload,
        returnReason
      );
      setSelectedOrderForReturn(null);
      setReturnReason("");
      fetchOrders(activeStatus === "all" ? "" : activeStatus, currentPage);
    } catch {
      // Handled
    } finally {
      setReturning(false);
    }
  };

  const handleViewHistory = async (order) => {
    setHistoryLoading(true);
    try {
      const history = await fetchOrderHistory(order._id || order.orderId);
      setSelectedOrderHistory({ order, history });
    } catch {
      setSelectedOrderHistory({ order, history: [] });
    } finally {
      setHistoryLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Truck className="w-3.5 h-3.5" /> Shipped
          </span>
        );
      case "processing":
      case "placed":
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> {status}
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-700">
            <Info className="w-3.5 h-3.5" /> {status || "Processing"}
          </span>
        );
    }
  };

  const statuses = [
    { label: "All Orders", key: "all" },
    { label: "Processing", key: "Processing" },
    { label: "Shipped", key: "Shipped" },
    { label: "Delivered", key: "Delivered" },
    { label: "Cancelled", key: "Cancelled" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-6 border-b border-neutral-200">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-neutral-400">
            Purchases & Shipments
          </span>
          <h1 className="text-3xl font-black uppercase font-mono tracking-tight text-neutral-900 mt-1">
            Order History
          </h1>
        </div>
        <p className="text-xs text-neutral-500 font-medium">
          {totalOrders} Total Orders recorded
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {statuses.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveStatus(tab.key)}
            className={clsx(
              "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all",
              activeStatus === tab.key
                ? "bg-neutral-950 text-white shadow-xs"
                : "bg-white text-neutral-600 hover:text-black border border-neutral-200 hover:border-neutral-300"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {ordersLoading ? (
        <div className="py-20 flex items-center justify-center">
          <Loader />
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => {
            const isCancellable =
              order.orderStatus !== "Cancelled" &&
              order.orderStatus !== "Delivered" &&
              order.orderStatus !== "Shipped";

            const isReturnable =
              order.orderStatus === "Delivered" && order.isReturnable !== false;

            return (
              <div
                key={order._id || order.orderId}
                className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm hover:border-neutral-300 transition-all"
              >
                {/* Top Info Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-sm font-bold text-neutral-900">
                      Order #{order.orderId || order._id?.slice(-8)}
                    </span>
                    <span className="text-xs text-neutral-400 font-medium">
                      • Placed on {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div>{getStatusBadge(order.orderStatus)}</div>
                </div>

                {/* Items in this order */}
                <div className="divide-y divide-neutral-50">
                  {order.items?.map((item, idx) => {
                    const product = item.product;
                    const variant = item.variant;
                    const displayImg =
                      product?.images?.[0]?.url ||
                      "https://res.cloudinary.com/mohit786/image/upload/v1693677254/cv9gdgz150vtoimcga0e.jpg";

                    return (
                      <div
                        key={idx}
                        className="py-4 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-100 flex-shrink-0">
                            <Image
                              src={displayImg}
                              alt={product?.title || "Item"}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-neutral-900 line-clamp-1">
                              {product?.title || "Product"}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-neutral-500">
                              <span>Qty: {item.quantity}</span>
                              {variant?.color?.name && (
                                <span className="capitalize">
                                  • {variant.color.name}
                                </span>
                              )}
                              {variant?.size?.name && (
                                <span>• Size {variant.size.name}</span>
                              )}
                            </div>
                            <p className="text-xs font-mono font-semibold text-neutral-800">
                              {formatPrice(item.price || 0)} each
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-bold font-mono text-neutral-950">
                            {formatPrice((item.price || 0) * (item.quantity || 1))}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Bar with Address & Actions */}
                <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-neutral-600">
                  <div className="space-y-1">
                    <p className="font-semibold text-neutral-900">
                      Payment: {order.paymentMethod || "COD"} • Total:{" "}
                      <span className="font-mono font-bold text-sm text-neutral-950">
                        {formatPrice(order.pricing?.totalAmount || 0)}
                      </span>
                    </p>
                    {order.shippingAddress && (
                      <p className="text-[11px] text-neutral-400">
                        Ship to: {order.shippingAddress.street},{" "}
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleViewHistory(order)}
                      className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-colors"
                    >
                      Tracking Timeline
                    </button>

                    {isCancellable && (
                      <button
                        onClick={() => setSelectedOrderForCancel(order)}
                        className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}

                    {isReturnable && (
                      <button
                        onClick={() => setSelectedOrderForReturn(order)}
                        className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-colors"
                      >
                        Request Return
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={currentPage <= 1}
                onClick={() =>
                  fetchOrders(
                    activeStatus === "all" ? "" : activeStatus,
                    currentPage - 1
                  )
                }
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white border border-neutral-200 rounded-lg disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs font-semibold px-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() =>
                  fetchOrders(
                    activeStatus === "all" ? "" : activeStatus,
                    currentPage + 1
                  )
                }
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white border border-neutral-200 rounded-lg disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 bg-white border border-neutral-100 rounded-3xl p-8">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold font-mono uppercase text-neutral-900">
              No Orders Found
            </h2>
            <p className="text-xs text-neutral-500 max-w-sm">
              {activeStatus === "all"
                ? "You haven't placed any orders yet. Discover our latest collection to get started."
                : `You don't have any orders with status "${activeStatus}".`}
            </p>
          </div>
          <Link
            href="/search"
            className="px-6 py-2.5 bg-neutral-950 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-800 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      )}

      {/* Cancel Order Modal */}
      {selectedOrderForCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl border border-neutral-100">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full">
                Cancellation Request
              </span>
              <h3 className="text-lg font-black font-mono uppercase text-neutral-900">
                Cancel Order #{selectedOrderForCancel.orderId}
              </h3>
              <p className="text-xs text-neutral-500">
                Are you sure you want to cancel this order? Item stocks will be
                restored.
              </p>
            </div>

            <form onSubmit={handleCancelSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-neutral-700">
                  Reason for Cancellation *
                </label>
                <textarea
                  required
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Ordered incorrect size / Changed my mind / Found better price"
                  className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl mt-1 focus:outline-none focus:border-neutral-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForCancel(null)}
                  className="flex-1 py-3 bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-200"
                >
                  Keep Order
                </button>
                <button
                  type="submit"
                  disabled={cancelling}
                  className="flex-1 py-3 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-red-700 disabled:opacity-50"
                >
                  {cancelling ? "Cancelling..." : "Confirm Cancel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return Request Modal */}
      {selectedOrderForReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl border border-neutral-100">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full">
                Return & Refund
              </span>
              <h3 className="text-lg font-black font-mono uppercase text-neutral-900">
                Return Order #{selectedOrderForReturn.orderId}
              </h3>
              <p className="text-xs text-neutral-500">
                Please provide details on why you are requesting a return for this
                delivered item.
              </p>
            </div>

            <form onSubmit={handleReturnSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-neutral-700">
                  Reason for Return *
                </label>
                <textarea
                  required
                  rows={3}
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder="e.g. Fit issues / Size too small / Defect in material"
                  className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl mt-1 focus:outline-none focus:border-neutral-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForReturn(null)}
                  className="flex-1 py-3 bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={returning}
                  className="flex-1 py-3 bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-black disabled:opacity-50"
                >
                  {returning ? "Submitting..." : "Submit Return"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tracking History Timeline Modal */}
      {selectedOrderHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-neutral-100">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                  Tracking
                </span>
                <h3 className="text-base font-black font-mono uppercase text-neutral-900">
                  Order Timeline #{selectedOrderHistory.order.orderId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderHistory(null)}
                className="text-xs font-semibold px-2.5 py-1 bg-neutral-100 rounded-lg hover:bg-neutral-200"
              >
                Close
              </button>
            </div>

            {selectedOrderHistory.history &&
            selectedOrderHistory.history.length > 0 ? (
              <div className="space-y-4">
                {selectedOrderHistory.history.map((step, idx) => (
                  <div key={idx} className="flex gap-3 relative">
                    <div className="flex flex-col items-center">
                      <span className="w-3 h-3 rounded-full bg-neutral-900" />
                      {idx < selectedOrderHistory.history.length - 1 && (
                        <span className="w-0.5 h-full bg-neutral-200 my-1" />
                      )}
                    </div>
                    <div className="space-y-0.5 pb-3">
                      <p className="text-xs font-bold text-neutral-900">
                        {step.status}
                      </p>
                      {step.comment && (
                        <p className="text-xs text-neutral-600">
                          {step.comment}
                        </p>
                      )}
                      <p className="text-[10px] text-neutral-400 font-mono">
                        {formatDate(step.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 py-4 text-center">
                <Clock className="w-8 h-8 text-neutral-400 mx-auto" />
                <p className="text-xs text-neutral-600">
                  Status:{" "}
                  <span className="font-bold text-neutral-900">
                    {selectedOrderHistory.order.orderStatus}
                  </span>
                </p>
                <p className="text-[11px] text-neutral-400">
                  Created: {formatDate(selectedOrderHistory.order.createdAt)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
