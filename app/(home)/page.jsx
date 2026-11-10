"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { ArrowRight, Sparkles, TrendingUp, Compass, ArrowUpRight } from "lucide-react";
import { server } from "@/lib/utils";
import ProductCard from "@/components/productCard";
import Loader from "@/components/loader";
import { useAuth } from "@/context/authContext";
import useRecommendedProductsStore from "@/stores/useRecommendedProductsStore";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { recommendedProducts, getRecommendationProduct } =
    useRecommendedProductsStore();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const { data } = await axios.get(`${server}/products?limit=8`);
        if (data?.success) {
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  useEffect(() => {
    if (user?._id) {
      getRecommendationProduct(user._id);
    }
  }, [user, getRecommendationProduct]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-16">
      {/* Editorial Minimalist Hero */}
      <section className="relative w-full bg-neutral-950 text-white overflow-hidden">
        {/* Subtle geometric background overlay */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-7xl mx-auto px-6 py-20 sm:py-28 md:py-36 relative z-10">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Spring / Summer 2026 Collection</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight font-mono uppercase leading-tight sm:leading-none text-white">
              ENGINEERED FOR MOTION.
            </h1>

            <p className="text-base sm:text-lg text-neutral-400 font-normal leading-relaxed max-w-xl">
              Clean lines, elevated performance materials, and modern silhouettes.
              Explore our curation of contemporary footwear and apparel.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/search"
                className="px-7 py-3.5 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-200 transition-all flex items-center gap-2 group shadow-lg"
              >
                <span>Shop Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/search?sort=createdAt&order=desc"
                className="px-7 py-3.5 bg-transparent border border-neutral-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-900 transition-all"
              >
                New Releases
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills & Highlights */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-8 border-b border-neutral-200">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-neutral-400">
              Department
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight uppercase font-mono mt-1">
              Curated Collections
            </h2>
          </div>
          <Link
            href="/search"
            className="text-xs font-bold uppercase tracking-widest text-neutral-600 hover:text-black flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
          {/* Footwear Card */}
          <Link
            href="/search?category=6506fa1bd53e7e34d0f9d101"
            className="group relative h-80 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200 flex flex-col justify-end p-8 text-white transition-all hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
            <div className="relative z-20 space-y-2">
              <span className="text-xs font-mono tracking-widest uppercase text-neutral-400">
                Category 01
              </span>
              <h3 className="text-2xl font-black font-mono tracking-tight uppercase">
                Footwear
              </h3>
              <p className="text-xs text-neutral-300">
                Motorsport, running & everyday contemporary sneakers.
              </p>
              <div className="pt-2 flex items-center text-xs font-bold uppercase tracking-wider text-white gap-2 group-hover:translate-x-1 transition-transform">
                <span>Explore Footwear</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>

          {/* Clothing Card */}
          <Link
            href="/search?category=6506fa1bd53e7e34d0f9d102"
            className="group relative h-80 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200 flex flex-col justify-end p-8 text-white transition-all hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
            <div className="relative z-20 space-y-2">
              <span className="text-xs font-mono tracking-widest uppercase text-neutral-400">
                Category 02
              </span>
              <h3 className="text-2xl font-black font-mono tracking-tight uppercase">
                Apparel & Tops
              </h3>
              <p className="text-xs text-neutral-300">
                Tailored activewear, jackets, tracksuits and tops.
              </p>
              <div className="pt-2 flex items-center text-xs font-bold uppercase tracking-wider text-white gap-2 group-hover:translate-x-1 transition-transform">
                <span>Explore Apparel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>

          {/* New In / Limited Drops */}
          <Link
            href="/search?sort=createdAt&order=desc"
            className="group relative h-80 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200 flex flex-col justify-end p-8 text-white transition-all hover:shadow-xl sm:col-span-2 lg:col-span-1"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
            <div className="relative z-20 space-y-2">
              <span className="text-xs font-mono tracking-widest uppercase text-neutral-400">
                Edition 2026
              </span>
              <h3 className="text-2xl font-black font-mono tracking-tight uppercase">
                Latest Drops
              </h3>
              <p className="text-xs text-neutral-300">
                Fresh releases and exclusive motorsport collaborations.
              </p>
              <div className="pt-2 flex items-center text-xs font-bold uppercase tracking-wider text-white gap-2 group-hover:translate-x-1 transition-transform">
                <span>View Releases</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Drops Grid */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-8 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-neutral-500" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-neutral-400">
                Selected Work
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight uppercase font-mono mt-1">
              Featured Products
            </h2>
          </div>
          <Link
            href="/search"
            className="text-xs font-bold uppercase tracking-widest text-neutral-600 hover:text-black flex items-center gap-1 group"
          >
            <span>Browse All ({products.length > 0 ? "30+" : "0"})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-8">
          {products.map((product) => (
            <ProductCard key={product._id} detail={product} />
          ))}
        </div>
      </section>

      {/* Algorithm Recommendations / Personalized Spotlight */}
      {recommendedProducts && recommendedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 w-full">
          <div className="p-8 sm:p-12 bg-neutral-900 text-white rounded-3xl space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-6 border-b border-neutral-800">
              <div>
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-neutral-400 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-neutral-400" /> Algorithmic Recommendation
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight uppercase font-mono mt-1 text-white">
                  Curated For Your Profile
                </h2>
              </div>
              <p className="text-xs text-neutral-400 max-w-xs">
                Generated dynamically from your browsing activity & preferences.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recommendedProducts.slice(0, 4).map((product) => (
                <ProductCard key={product._id} detail={product} className="bg-neutral-800 border-neutral-700" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Editorial Quote / Philosophy Section */}
      <section className="border-y border-neutral-200 bg-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold">
            Design Philosophy
          </span>
          <blockquote className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-neutral-800 leading-snug">
            &ldquo;We believe minimalism is not the absence of design, but the perfection of essentials.&rdquo;
          </blockquote>
          <div className="pt-2">
            <p className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold">
              ATELIER STUDIO • HERZOGENAURACH & DELI
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
