import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Headphones } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-neutral-950 text-neutral-300 border-t border-neutral-900 mt-20">
      {/* Service Highlights */}
      <div className="border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-neutral-900 rounded-full text-white">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Fast Delivery</p>
              <p className="text-xs text-neutral-400">Standard & express shipping</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-neutral-900 rounded-full text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">100% Authentic</p>
              <p className="text-xs text-neutral-400">Directly from verified brands</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-neutral-900 rounded-full text-white">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Hassle-Free Returns</p>
              <p className="text-xs text-neutral-400">Easy 7-day return policy</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-neutral-900 rounded-full text-white">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Dedicated Support</p>
              <p className="text-xs text-neutral-400">Here to help anytime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Brand identity */}
        <div className="md:col-span-5 space-y-4">
          <Link href="/" className="inline-block">
            <span className="text-xl font-bold tracking-widest text-white uppercase font-mono">
              STUDIO • ATELIER
            </span>
          </Link>
          <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
            Curated footwear and apparel engineered for motion and contemporary design.
            Minimalism crafted with precision.
          </p>
          <div className="pt-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 text-xs rounded-full bg-neutral-900 text-neutral-300 border border-neutral-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Backend API Connected
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Shop</h4>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li>
              <Link href="/search" className="hover:text-white transition-colors">
                All Products
              </Link>
            </li>
            <li>
              <Link href="/search?category=6506fa1bd53e7e34d0f9d101" className="hover:text-white transition-colors">
                Footwear
              </Link>
            </li>
            <li>
              <Link href="/search?category=6506fa1bd53e7e34d0f9d102" className="hover:text-white transition-colors">
                Clothing
              </Link>
            </li>
            <li>
              <Link href="/search?sort=createdAt&order=desc" className="hover:text-white transition-colors">
                Latest Arrivals
              </Link>
            </li>
          </ul>
        </div>

        {/* Account & Help */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Account</h4>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li>
              <Link href="/dashboard" className="hover:text-white transition-colors">
                Profile & Settings
              </Link>
            </li>
            <li>
              <Link href="/dashboard/orders" className="hover:text-white transition-colors">
                Track Orders
              </Link>
            </li>
            <li>
              <Link href="/dashboard/cart" className="hover:text-white transition-colors">
                Shopping Bag
              </Link>
            </li>
            <li>
              <Link href="/dashboard/wishlist" className="hover:text-white transition-colors">
                Wishlist
              </Link>
            </li>
            <li>
              <Link href="/dashboard/contact" className="hover:text-white transition-colors">
                Support & Helpline
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Newsletter</h4>
          <p className="text-xs text-neutral-400">
            Receive early access to seasonal drops and limited releases.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-neutral-900 border border-neutral-800 text-white text-xs px-3 py-2.5 rounded-md w-full focus:outline-none focus:border-neutral-500"
            />
            <button className="bg-white text-black p-2.5 rounded-md hover:bg-neutral-200 transition-colors">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-900 py-6 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} STUDIO ATELIER. All rights reserved.</p>
          <div className="flex gap-6 text-neutral-500">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Shipping Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
