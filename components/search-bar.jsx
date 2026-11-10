"use client";

import React, { useEffect, useState, useRef } from "react";
import clsx from "clsx";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import axios from "axios";
import { server, formatPrice } from "@/lib/utils";
import { Loader2, Search, X, ArrowRight } from "lucide-react";
import Image from "next/image";

const SearchBar = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm] = useDebounce(searchTerm, 400);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearchTerm("");
      setSuggestions([]);
    }
  }, [isOpen]);

  // Fetch suggestions when debouncedTerm is >= 3 characters
  useEffect(() => {
    const trimmed = debouncedTerm.trim();
    if (trimmed.length >= 3) {
      fetchSuggestions(trimmed);
    } else {
      setSuggestions([]);
      setLoading(false);
      setError(false);
    }
  }, [debouncedTerm]);

  const fetchSuggestions = async (term) => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await axios.get(
        `${server}/products?search=${encodeURIComponent(term)}&limit=6`
      );
      if (data?.products?.length === 0) {
        setError(true);
      }
      setSuggestions(data?.products || []);
    } catch (err) {
      setError(true);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        router.push(`/product/${suggestions[selectedIndex]._id}`);
        onClose();
      } else if (searchTerm.trim()) {
        router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
        onClose();
      }
    }
  };

  const executeSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center pt-24 px-4 transition-all">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-neutral-100 gap-3">
          <Search className="w-5 h-5 text-neutral-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="w-full text-base text-neutral-900 placeholder:text-neutral-400 bg-transparent outline-none font-medium"
            placeholder="Search footwear, apparel, styles (min. 3 letters)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {loading && <Loader2 className="w-5 h-5 text-neutral-400 animate-spin flex-shrink-0" />}
          {searchTerm && !loading && (
            <button
              onClick={() => setSearchTerm("")}
              className="p-1 hover:bg-neutral-100 rounded-full text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2.5 py-1 text-neutral-500 hover:text-black bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Suggestions / Results */}
        <div className="max-h-96 overflow-y-auto divide-y divide-neutral-50">
          {suggestions.length > 0 && (
            <div>
              <div className="px-5 py-2 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider bg-neutral-50">
                Products Found
              </div>
              {suggestions.map((product, index) => (
                <div
                  key={product._id}
                  onClick={() => {
                    router.push(`/product/${product._id}`);
                    onClose();
                  }}
                  className={clsx(
                    "flex items-center gap-4 px-5 py-3 cursor-pointer transition-colors",
                    index === selectedIndex
                      ? "bg-neutral-100 text-black"
                      : "hover:bg-neutral-50 text-neutral-800"
                  )}
                >
                  <div className="relative w-12 h-12 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={
                        product.images?.[0]?.url ||
                        "https://res.cloudinary.com/mohit786/image/upload/v1693677254/cv9gdgz150vtoimcga0e.jpg"
                      }
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wider text-neutral-400 font-medium truncate">
                      {product.brand?.name || "Premium Store"}
                    </p>
                    <p className="text-sm font-semibold text-neutral-900 truncate">
                      {product.title}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-neutral-900">
                      {formatPrice(product.price || product.minPrice)}
                    </p>
                    {product.stock > 0 ? (
                      <span className="text-[10px] text-emerald-600 font-medium">In Stock</span>
                    ) : (
                      <span className="text-[10px] text-neutral-400 font-medium">Out of Stock</span>
                    )}
                  </div>
                </div>
              ))}
              <div
                onClick={executeSearch}
                className="flex items-center justify-between px-5 py-3 text-xs font-semibold text-black bg-neutral-50 hover:bg-neutral-100 cursor-pointer border-t border-neutral-100"
              >
                <span>View all search results for &ldquo;{searchTerm}&rdquo;</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          )}

          {error && !loading && searchTerm.trim().length >= 3 && (
            <div className="px-5 py-8 text-center text-sm text-neutral-400">
              No products found matching &ldquo;{searchTerm}&rdquo;.
            </div>
          )}

          {searchTerm.trim().length > 0 && searchTerm.trim().length < 3 && (
            <div className="px-5 py-6 text-center text-xs text-neutral-400">
              Please enter at least 3 characters to search catalog.
            </div>
          )}

          {!searchTerm && (
            <div className="px-5 py-6">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {["Sneakers", "Motorsport", "Running", "Puma", "Shoes", "Clothing"].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchTerm(term);
                      }}
                      className="px-3 py-1.5 text-xs text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
