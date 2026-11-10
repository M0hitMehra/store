"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, User, ShoppingBag, Heart, Package, Headphones, LogOut, LogIn } from "lucide-react";
import useAuthStore from "@/stores/useAuthStore";
import axios from "axios";
import { server } from "@/lib/utils";
import { toast } from "./ui/use-toast";
import clsx from "clsx";

const MobileNavbar = ({ isOpen, onClose, links = [] }) => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  if (!isOpen) return null;

  const handleLogout = async () => {
    try {
      await axios.get(`${server}/auth/logout`, { withCredentials: true });
      setUser(null);
      toast({ title: "Logged out successfully" });
      onClose();
      router.push("/login");
    } catch {
      setUser(null);
      onClose();
      router.push("/login");
    }
  };

  const navigateTo = (path) => {
    router.push(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
            <span className="font-mono text-xl font-black tracking-widest text-neutral-950 uppercase">
              ATELIER
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User info if logged in */}
          {user ? (
            <div className="py-4 px-3 my-4 bg-neutral-50 rounded-xl">
              <p className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                Signed in as
              </p>
              <p className="text-sm font-bold text-neutral-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-neutral-500 truncate">{user.email}</p>
            </div>
          ) : (
            <div className="py-4 my-2 flex gap-2">
              <button
                onClick={() => navigateTo("/login")}
                className="flex-1 py-2 text-xs font-semibold bg-neutral-950 text-white rounded-lg hover:bg-black text-center"
              >
                Sign In
              </button>
              <button
                onClick={() => navigateTo("/signup")}
                className="flex-1 py-2 text-xs font-semibold bg-neutral-100 text-neutral-800 rounded-lg hover:bg-neutral-200 text-center"
              >
                Register
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="py-4 space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-1">
              Shop Categories
            </p>
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={onClose}
                className="block px-3 py-2.5 text-sm font-semibold text-neutral-800 hover:text-black hover:bg-neutral-50 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/search"
              onClick={onClose}
              className="block px-3 py-2.5 text-sm font-semibold text-neutral-800 hover:text-black hover:bg-neutral-50 rounded-lg transition-colors"
            >
              Explore All Styles
            </Link>
          </nav>

          {/* Account shortcuts */}
          {user && (
            <div className="py-4 border-t border-neutral-100 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-1">
                Account
              </p>
              <button
                onClick={() => navigateTo("/dashboard")}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg"
              >
                <User className="w-4 h-4 text-neutral-400" />
                <span>My Profile</span>
              </button>
              <button
                onClick={() => navigateTo("/dashboard/orders")}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg"
              >
                <Package className="w-4 h-4 text-neutral-400" />
                <span>Orders & Tracking</span>
              </button>
              <button
                onClick={() => navigateTo("/dashboard/wishlist")}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg"
              >
                <Heart className="w-4 h-4 text-neutral-400" />
                <span>Wishlist</span>
              </button>
              <button
                onClick={() => navigateTo("/dashboard/cart")}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg"
              >
                <ShoppingBag className="w-4 h-4 text-neutral-400" />
                <span>Shopping Bag</span>
              </button>
              <button
                onClick={() => navigateTo("/dashboard/contact")}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg"
              >
                <Headphones className="w-4 h-4 text-neutral-400" />
                <span>Helpline</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="pt-6 border-t border-neutral-100">
          {user && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          )}
          <p className="text-[11px] text-neutral-400 text-center mt-4">
            © {new Date().getFullYear()} STUDIO ATELIER
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;
