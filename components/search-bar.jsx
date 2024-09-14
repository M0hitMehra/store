"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { Input } from "./ui/input";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import axios from "axios";
import { server } from "@/lib/utils";
import { Loader, Search } from "lucide-react";

const SearchBar = ({ className }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm] = useDebounce(searchTerm, 500);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1); // For arrow key navigation
  const [loading, setLoading] = useState(false); // Loading state for API call
  const [error, setError] = useState(false); // Error state
  const router = useRouter();

  // Fetch suggestions from API based on debounced search term
  useEffect(() => {
    if (debouncedTerm.length >= 3) {
      fetchSuggestions(debouncedTerm);
    } else {
      setSuggestions([]);
      setLoading(false);
    }
  }, [debouncedTerm]);

  const fetchSuggestions = async (term) => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await axios.get(
        `${server}/products?search=${term}&limit=${10}`
      );
      if (data.products.length === 0) {
        setError(true); // Show "No results found" if empty array
      }
      setSuggestions(data.products);
    } catch (error) {
      setError(true); // Show error state in case of a failure
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setError(false); // Reset error when typing
  };

  // Highlight the matching part of the suggestion
  const highlightText = (text, searchTerm) => {
    const parts = text.split(new RegExp(`(${searchTerm})`, "gi")); // Split by the search term (case insensitive)
    return parts.map((part, index) => (
      <span
        key={index}
        className={clsx({
          "font-semibold text-blue-600":
            part.toLowerCase() === searchTerm.toLowerCase(),
        })}
      >
        {part}
      </span>
    ));
  };

  // Handle arrow key navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown" && selectedIndex === suggestions.length - 1) {
      setSelectedIndex(-1);
    }

    if (e.key === "ArrowUp" && selectedIndex === 0) {
      setSelectedIndex(suggestions.length);
    }

    if (e.key === "ArrowDown") {
      setSelectedIndex((prevIndex) =>
        Math.min(prevIndex + 1, suggestions.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0) {
        handleSuggestionClick(suggestions[selectedIndex]);
      } else {
        router.push(`/search?query=${searchTerm}`);
      }
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (product) => {
    router.push(`/product/${product._id}`);
  };

  // Handle search icon click (same as Enter key behavior)
  const handleSearchClick = () => {
    router.push(`/search?query=${searchTerm}`);
  };

  return (
    <div className={clsx("p-6 bg-black ", className)}>
      <div className="w-full h-full relative">
        <Input
          className="w-full h-full p-4 text-gray-600 rounded-b-none border-none ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search for products..."
          onClick={() => setSelectedIndex(-1)}
          onFocus={() => setSelectedIndex(-1)}
        />

        {/* Search icon with onClick handler */}
        {!loading && (
          <button
            className="absolute right-2 top-2 text-gray-600"
            onClick={handleSearchClick}
          >
            <Search size={24} />
          </button>
        )}

        {/* Loader */}
        {loading && (
          <div className="absolute right-2 top-2 text-gray-600 animate-spin">
            <Loader size={24} />
          </div>
        )}

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <ul className="absolute left-0 top-full w-full bg-white border border-gray-300 z-50 max-h-100 overflow-y-auto rounded-b-sm">
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion._id}
                className={clsx("p-2 cursor-pointer hover:bg-gray-200", {
                  "bg-gray-200": index === selectedIndex,
                })}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {highlightText(suggestion.title, debouncedTerm)}
              </li>
            ))}
          </ul>
        )}

        {/* No Results or Error Message */}
        {error && !loading && (
          <div className="absolute left-0 top-full w-full bg-white border border-gray-300 z-50 rounded-b-sm p-4 text-center text-gray-500">
            No results found.
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
