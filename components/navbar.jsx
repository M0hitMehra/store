"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import clsx from "clsx";
import UserDropDown from "./userDropDown";
import SearchBar from "./search-bar";
import MobileNavbar from "./mobile-navbar";
import useCartStore from "@/stores/useCartStore";
import useWishlistStore from "@/stores/useWishlistStore";
import { useAuth } from "@/context/authContext";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { cart, fetchCart } = useCartStore();
  const { wishlist, fetchWishlist } = useWishlistStore();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
      fetchWishlist();
    }
  }, [user, fetchCart, fetchWishlist]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Collection", href: "/search" },
    { label: "Footwear", href: "/search?category=6506fa1bd53e7e34d0f9d101" },
    { label: "Clothing", href: "/search?category=6506fa1bd53e7e34d0f9d102" },
    { label: "New Arrivals", href: "/search?sort=createdAt&order=desc" },
  ];

  const totalCartCount = cart?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;
  const totalWishlistCount = wishlist?.length || 0;

  return (
    <>
      <header
        className={clsx(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-xs border-b border-neutral-100 py-3.5"
            : "bg-white border-b border-neutral-100/70 py-4"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Mobile Menu Toggle & Brand Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2 text-neutral-800 hover:text-black md:hidden rounded-lg hover:bg-neutral-100"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <Link href="/" className="flex items-center gap-2 group">
                <span className="font-mono text-xl sm:text-2xl font-black tracking-widest text-neutral-950 uppercase group-hover:opacity-80 transition-opacity">
                  ATELIER
                </span>
                <span className="text-[10px] tracking-widest font-semibold px-1.5 py-0.5 bg-neutral-100 text-neutral-700 rounded uppercase hidden sm:inline-block">
                  STORE
                </span>
              </Link>
            </div>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={clsx(
                      "text-xs uppercase tracking-widest font-semibold transition-colors relative py-1",
                      isActive
                        ? "text-black"
                        : "text-neutral-500 hover:text-black"
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-neutral-100 text-neutral-700 hover:text-black transition-colors"
                aria-label="Search Catalog"
              >
                <Search className="w-5 h-5" />
                <span className="text-xs text-neutral-400 font-medium hidden lg:inline-block pr-1">
                  Search...
                </span>
              </button>

              {/* Wishlist Link */}
              <Link
                href="/dashboard/wishlist"
                className="relative p-2 rounded-full hover:bg-neutral-100 text-neutral-700 hover:text-black transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {totalWishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-neutral-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalWishlistCount > 9 ? "9+" : totalWishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Bag Link */}
              <Link
                href="/dashboard/cart"
                className="relative p-2 rounded-full hover:bg-neutral-100 text-neutral-700 hover:text-black transition-colors"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalCartCount > 9 ? "9+" : totalCartCount}
                  </span>
                )}
              </Link>

              {/* User Dropdown */}
              <UserDropDown />
            </div>
          </div>
        </div>
      </header>

      {/* Live Search Modal */}
      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Navigation Drawer */}
      <MobileNavbar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        links={navLinks}
      />
    </>
  );
};

export default Navbar;
