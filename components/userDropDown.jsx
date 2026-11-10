"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User as UserIcon,
  ShoppingBag,
  Heart,
  Package,
  Headphones,
  LogOut,
  LogIn,
  UserPlus,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { server } from "@/lib/utils";
import { toast } from "./ui/use-toast";
import useAuthStore from "@/stores/useAuthStore";

const UserDropDown = () => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/auth/logout`, {
        withCredentials: true,
      });
      if (data?.success) {
        setUser(null);
        toast({
          title: "Logged out successfully",
          description: "See you next time!",
        });
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
      setUser(null);
      router.push("/login");
    }
  };

  const getInitials = () => {
    if (!user) return "U";
    const first = user.firstName ? user.firstName[0] : "";
    const last = user.lastName ? user.lastName[0] : "";
    return `${first}${last}`.toUpperCase() || "U";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative flex items-center justify-center p-2 rounded-full hover:bg-neutral-100 transition-colors focus:outline-none"
          aria-label="User Account"
        >
          {user ? (
            <Avatar className="h-8 w-8 border border-neutral-200">
              <AvatarImage
                src={user?.avatar?.url}
                alt={user?.firstName || "User"}
              />
              <AvatarFallback className="bg-neutral-900 text-white text-xs font-medium">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          ) : (
            <UserIcon className="w-5 h-5 text-neutral-800 hover:text-black" />
          )}
          {user && !user.verified && (
            <span
              className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white"
              title="Verification required"
            />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 p-2 bg-white shadow-xl border border-neutral-100 rounded-xl"
      >
        {user ? (
          <>
            <div className="px-3 py-2.5 bg-neutral-50 rounded-lg mb-1">
              <p className="text-sm font-semibold text-neutral-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-neutral-500 truncate">{user.email}</p>
              <div className="mt-1.5 flex items-center gap-1.5">
                {user.verified ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                ) : (
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 hover:bg-amber-100"
                  >
                    <ShieldAlert className="w-3 h-3" /> Verify Account
                  </button>
                )}
              </div>
            </div>

            <DropdownMenuItem
              className="cursor-pointer py-2 text-sm text-neutral-700 hover:text-black hover:bg-neutral-50 rounded-lg flex items-center gap-2.5"
              onClick={() => router.push("/dashboard")}
            >
              <UserIcon className="w-4 h-4 text-neutral-500" />
              <span>My Profile & Address</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer py-2 text-sm text-neutral-700 hover:text-black hover:bg-neutral-50 rounded-lg flex items-center gap-2.5"
              onClick={() => router.push("/dashboard/orders")}
            >
              <Package className="w-4 h-4 text-neutral-500" />
              <span>Orders & Tracking</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer py-2 text-sm text-neutral-700 hover:text-black hover:bg-neutral-50 rounded-lg flex items-center gap-2.5"
              onClick={() => router.push("/dashboard/cart")}
            >
              <ShoppingBag className="w-4 h-4 text-neutral-500" />
              <span>Shopping Bag</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer py-2 text-sm text-neutral-700 hover:text-black hover:bg-neutral-50 rounded-lg flex items-center gap-2.5"
              onClick={() => router.push("/dashboard/wishlist")}
            >
              <Heart className="w-4 h-4 text-neutral-500" />
              <span>My Wishlist</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer py-2 text-sm text-neutral-700 hover:text-black hover:bg-neutral-50 rounded-lg flex items-center gap-2.5"
              onClick={() => router.push("/dashboard/contact")}
            >
              <Headphones className="w-4 h-4 text-neutral-500" />
              <span>Customer Helpline</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1.5" />

            <DropdownMenuItem
              className="cursor-pointer py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg flex items-center gap-2.5"
              onClick={logoutHandler}
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </>
        ) : (
          <div className="p-2 space-y-2">
            <div className="text-center pb-2">
              <p className="text-sm font-semibold text-neutral-900">Welcome</p>
              <p className="text-xs text-neutral-500">Sign in to manage orders & bag</p>
            </div>
            <Button
              className="w-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs h-9 font-medium"
              onClick={() => router.push("/login")}
            >
              <LogIn className="w-3.5 h-3.5 mr-1.5" /> Sign In
            </Button>
            <Button
              variant="outline"
              className="w-full border-neutral-200 text-neutral-800 text-xs h-9 hover:bg-neutral-50 font-medium"
              onClick={() => router.push("/signup")}
            >
              <UserPlus className="w-3.5 h-3.5 mr-1.5" /> Create Account
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropDown;
