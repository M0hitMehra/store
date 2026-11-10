"use client";

import React, { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { server, formatPrice } from "@/lib/utils";
import ProductCard from "@/components/productCard";
import ComponentLoader from "@/components/component-loader";
import {
  Search as SearchIcon,
  Filter,
  X,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import clsx from "clsx";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filters state initialized from URL params if available
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("query") || searchParams.get("search") || ""
  );
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [brand, setBrand] = useState(searchParams.get("brand") || "");
  const [selectedColor, setSelectedColor] = useState(
    searchParams.get("color") || searchParams.get("colors") || ""
  );
  const [selectedSize, setSelectedSize] = useState(
    searchParams.get("size") || searchParams.get("sizes") || ""
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "createdAt");
  const [order, setOrder] = useState(searchParams.get("order") || "desc");
  const [page, setPage] = useState(1);

  // Data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const limit = 12;

  // Sync state with URL params when they change
  useEffect(() => {
    const q = searchParams.get("query") || searchParams.get("search") || "";
    const c = searchParams.get("category") || "";
    const b = searchParams.get("brand") || "";
    const col = searchParams.get("color") || searchParams.get("colors") || "";
    const sz = searchParams.get("size") || searchParams.get("sizes") || "";
    const s = searchParams.get("sort") || "createdAt";
    const ord = searchParams.get("order") || "desc";

    if (q !== searchTerm) setSearchTerm(q);
    if (c !== category) setCategory(c);
    if (b !== brand) setBrand(b);
    if (col !== selectedColor) setSelectedColor(col);
    if (sz !== selectedSize) setSelectedSize(sz);
    if (s !== sort) setSort(s);
    if (ord !== order) setOrder(ord);
  }, [searchParams]);

  // Fetch filter metadata on mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catRes, brandRes, colorRes, sizeRes] = await Promise.all([
          axios.get(`${server}/category/getAll`),
          axios.get(`${server}/brand/getAll`),
          axios.get(`${server}/color/getAll`),
          axios.get(`${server}/size/getAll`),
        ]);

        setCategories(catRes.data?.categories || []);
        setBrands(brandRes.data?.brands || []);
        setColors(colorRes.data?.colors || []);
        setSizes(sizeRes.data?.sizes || []);
      } catch (err) {
        console.error("Error fetching filters:", err);
      }
    };

    fetchFilters();
  }, []);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit,
          sort,
          order,
        };

        // Backend requires search length >= 3
        if (searchTerm && searchTerm.trim().length >= 3) {
          params.search = searchTerm.trim();
        }

        if (category) params.category = category;
        if (brand) params.brand = brand;
        // Backend expects colors and sizes
        if (selectedColor) params.colors = selectedColor;
        if (selectedSize) params.sizes = selectedSize;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;

        const { data } = await axios.get(`${server}/products`, { params });
        if (data?.success) {
          setProducts(data.products || []);
          setTotalProducts(data.pagination?.total || 0);
          setTotalPages(data.pagination?.totalPages || 1);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
        setTotalProducts(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    searchTerm,
    category,
    brand,
    selectedColor,
    selectedSize,
    minPrice,
    maxPrice,
    sort,
    order,
    page,
  ]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setCategory("");
    setBrand("");
    setSelectedColor("");
    setSelectedSize("");
    setMinPrice("");
    setMaxPrice("");
    setSort("createdAt");
    setOrder("desc");
    setPage(1);
    router.push("/search");
  };

  const hasActiveFilters =
    Boolean(searchTerm) ||
    Boolean(category) ||
    Boolean(brand) ||
    Boolean(selectedColor) ||
    Boolean(selectedSize) ||
    Boolean(minPrice) ||
    Boolean(maxPrice);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-8 border-b border-neutral-200">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-neutral-400">
            Catalog
          </span>
          <h1 className="text-3xl font-black uppercase font-mono tracking-tight text-neutral-900 mt-0.5">
            All Products
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Showing {products.length} of {totalProducts} items
          </p>
        </div>

        {/* Search input in page */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <SearchIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-9 py-2 text-xs bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-500 font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider bg-white border border-neutral-200 rounded-xl"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Active Filter Chips & Sort Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-neutral-100">
        {/* Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear all</span>
            </button>
          )}

          {category && (
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-neutral-100 text-neutral-800 rounded-full">
              Category:{" "}
              {categories.find((c) => c._id === category)?.name || "Selected"}
              <X
                className="w-3 h-3 cursor-pointer hover:text-black"
                onClick={() => setCategory("")}
              />
            </span>
          )}

          {brand && (
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-neutral-100 text-neutral-800 rounded-full">
              Brand: {brands.find((b) => b._id === brand)?.name || "Selected"}
              <X
                className="w-3 h-3 cursor-pointer hover:text-black"
                onClick={() => setBrand("")}
              />
            </span>
          )}

          {selectedColor && (
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-neutral-100 text-neutral-800 rounded-full">
              Color:{" "}
              {colors.find((c) => c._id === selectedColor)?.name || "Selected"}
              <X
                className="w-3 h-3 cursor-pointer hover:text-black"
                onClick={() => setSelectedColor("")}
              />
            </span>
          )}

          {selectedSize && (
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-neutral-100 text-neutral-800 rounded-full">
              Size: {sizes.find((s) => s._id === selectedSize)?.name || "Selected"}
              <X
                className="w-3 h-3 cursor-pointer hover:text-black"
                onClick={() => setSelectedSize("")}
              />
            </span>
          )}

          {(minPrice || maxPrice) && (
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-neutral-100 text-neutral-800 rounded-full">
              Price: {minPrice ? `₹${minPrice}` : "₹0"} -{" "}
              {maxPrice ? `₹${maxPrice}` : "Any"}
              <X
                className="w-3 h-3 cursor-pointer hover:text-black"
                onClick={() => {
                  setMinPrice("");
                  setMaxPrice("");
                }}
              />
            </span>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">
            Sort:
          </span>
          <select
            value={`${sort}-${order}`}
            onChange={(e) => {
              const [newSort, newOrder] = e.target.value.split("-");
              setSort(newSort);
              setOrder(newOrder);
              setPage(1);
            }}
            className="text-xs font-semibold bg-white border border-neutral-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-neutral-500 cursor-pointer"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="stock-desc">In Stock First</option>
          </select>
        </div>
      </div>

      {/* Main Content Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block md:col-span-3 space-y-8 pr-4 border-r border-neutral-100">
          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900 mb-3 font-mono">
              Categories
            </h3>
            <div className="space-y-1.5">
              <button
                onClick={() => {
                  setCategory("");
                  setPage(1);
                }}
                className={clsx(
                  "block w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors",
                  category === ""
                    ? "font-bold bg-neutral-900 text-white"
                    : "text-neutral-600 hover:text-black hover:bg-neutral-50"
                )}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => {
                    setCategory(category === cat._id ? "" : cat._id);
                    setPage(1);
                  }}
                  className={clsx(
                    "block w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors",
                    category === cat._id
                      ? "font-bold bg-neutral-900 text-white"
                      : "text-neutral-600 hover:text-black hover:bg-neutral-50"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900 mb-3 font-mono">
              Brands
            </h3>
            <div className="space-y-1.5">
              <button
                onClick={() => {
                  setBrand("");
                  setPage(1);
                }}
                className={clsx(
                  "block w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors",
                  brand === ""
                    ? "font-bold bg-neutral-900 text-white"
                    : "text-neutral-600 hover:text-black hover:bg-neutral-50"
                )}
              >
                All Brands
              </button>
              {brands.map((b) => (
                <button
                  key={b._id}
                  onClick={() => {
                    setBrand(brand === b._id ? "" : b._id);
                    setPage(1);
                  }}
                  className={clsx(
                    "block w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors",
                    brand === b._id
                      ? "font-bold bg-neutral-900 text-white"
                      : "text-neutral-600 hover:text-black hover:bg-neutral-50"
                  )}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900 mb-3 font-mono">
              Colors
            </h3>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => {
                const isSelected = selectedColor === c._id;
                return (
                  <button
                    key={c._id}
                    onClick={() => {
                      setSelectedColor(isSelected ? "" : c._id);
                      setPage(1);
                    }}
                    title={c.name}
                    className={clsx(
                      "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all",
                      isSelected
                        ? "border-black bg-neutral-900 text-white"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                    )}
                  >
                    <span
                      style={{ backgroundColor: c.code || "#ccc" }}
                      className="w-2.5 h-2.5 rounded-full border border-black/10"
                    />
                    <span className="capitalize">{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900 mb-3 font-mono">
              Sizes
            </h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => {
                const isSelected = selectedSize === s._id;
                return (
                  <button
                    key={s._id}
                    onClick={() => {
                      setSelectedSize(isSelected ? "" : s._id);
                      setPage(1);
                    }}
                    className={clsx(
                      "px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all",
                      isSelected
                        ? "border-black bg-neutral-900 text-white"
                        : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                    )}
                  >
                    {s.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900 mb-3 font-mono">
              Price Range (₹)
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setPage(1);
                }}
                className="w-1/2 p-2 text-xs border border-neutral-200 rounded-lg bg-white"
              />
              <span className="text-neutral-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPage(1);
                }}
                className="w-1/2 p-2 text-xs border border-neutral-200 rounded-lg bg-white"
              />
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="md:col-span-9">
          {loading ? (
            <div className="py-24 flex items-center justify-center">
              <ComponentLoader />
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} detail={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12 pt-6 border-t border-neutral-100">
                  <button
                    disabled={page <= 1}
                    onClick={() => {
                      setPage((prev) => Math.max(1, prev - 1));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-white border border-neutral-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1 px-3 text-xs font-semibold text-neutral-600">
                    <span>Page {page} of {totalPages}</span>
                  </div>

                  <button
                    disabled={page >= totalPages}
                    onClick={() => {
                      setPage((prev) => Math.min(totalPages, prev + 1));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-white border border-neutral-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-24 text-center space-y-4">
              <p className="text-lg font-bold text-neutral-800">No products found</p>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                We couldn&apos;t find any items matching your current filters. Try resetting
                filters or adjusting your search keywords.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-black text-white rounded-xl hover:bg-neutral-800 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />
          <div className="relative w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6 z-10">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h2 className="text-sm font-bold uppercase tracking-wider font-mono">
                Filters
              </h2>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                Categories
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setCategory("")}
                  className={clsx(
                    "block w-full text-left px-2.5 py-1.5 text-xs rounded-lg",
                    category === "" ? "font-bold bg-neutral-900 text-white" : "text-neutral-600"
                  )}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c._id}
                    onClick={() => setCategory(category === c._id ? "" : c._id)}
                    className={clsx(
                      "block w-full text-left px-2.5 py-1.5 text-xs rounded-lg",
                      category === c._id ? "font-bold bg-neutral-900 text-white" : "text-neutral-600"
                    )}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Brands */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                Brands
              </h3>
              <div className="space-y-1">
                {brands.map((b) => (
                  <button
                    key={b._id}
                    onClick={() => setBrand(brand === b._id ? "" : b._id)}
                    className={clsx(
                      "block w-full text-left px-2.5 py-1.5 text-xs rounded-lg",
                      brand === b._id ? "font-bold bg-neutral-900 text-white" : "text-neutral-600"
                    )}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-3 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl mt-6"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center"><ComponentLoader /></div>}>
      <SearchContent />
    </Suspense>
  );
}
