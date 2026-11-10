"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  User,
  Package,
  ShoppingBag,
  Heart,
  History,
  Headphones,
  LogOut,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import axios from "axios";
import { server } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import useAuthStore from "@/stores/useAuthStore";
import clsx from "clsx";

const DashboardSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const logoutHandler = async () => {
    try {
      await axios.get(`${server}/auth/logout`, { withCredentials: true });
      setUser(null);
      toast({
        title: "Logged out successfully",
        description: "Come back soon!",
      });
      router.push("/login");
    } catch {
      setUser(null);
      router.push("/login");
    }
  };

  const links = [
    { href: "/dashboard", label: "My Profile", icon: User },
    { href: "/dashboard/orders", label: "Order History", icon: Package },
    { href: "/dashboard/cart", label: "Shopping Bag", icon: ShoppingBag },
    { href: "/dashboard/wishlist", label: "Saved Wishlist", icon: Heart },
    { href: "/dashboard/recently-visited", label: "Recently Visited", icon: History },
    { href: "/dashboard/contact", label: "Support & Helpline", icon: Headphones },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col justify-between w-64 bg-white border-r border-neutral-200 min-h-[calc(100vh-5rem)] p-6 flex-shrink-0">
        <div className="space-y-6">
          {/* User mini badge */}
          {user && (
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-1">
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                Account Status
              </p>
              <p className="text-sm font-bold text-neutral-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <div className="pt-1">
                {user.verified ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3 h-3" /> Verified Member
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    <ShieldAlert className="w-3 h-3" /> Unverified
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1">
            {links.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all",
                    isActive
                      ? "bg-neutral-950 text-white shadow-xs"
                      : "text-neutral-600 hover:text-black hover:bg-neutral-50"
                  )}
                >
                  <Icon className={clsx("w-4 h-4", isActive ? "text-white" : "text-neutral-400")} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="pt-6 border-t border-neutral-100">
          <button
            onClick={logoutHandler}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Scrollable Navigation Bar */}
      <div className="md:hidden fixed top-16 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-neutral-200 z-30 px-4 py-2 overflow-x-auto scrollbar-none flex gap-2">
        {links.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors flex-shrink-0",
                isActive
                  ? "bg-neutral-950 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              )}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default DashboardSidebar;
