"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "@/lib/utils"; // Adjust this import based on your project structure
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce"; // For debouncing search
import CustomSelect from "@/components/custom-select";
import ProductCard from "@/components/productCard";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("asc");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debouncedTerm] = useDebounce(searchTerm, 500); // Debounce search term

  // Fetch filter options (categories, brands, colors, sizes) from APIs
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoryRes, brandRes, colorRes, sizeRes] = await Promise.all([
          axios.get(`${server}/category/getAll`),
          axios.get(`${server}/brand/getAll`),
          axios.get(`${server}/color/getAll`),
          axios.get(`${server}/size/getAll`),
        ]);

        setCategories(categoryRes.data.categories || []);
        setBrands(brandRes.data.brands || []);
        setColors(colorRes.data.colors || []);
        setSizes(sizeRes.data.sizes || []);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };

    fetchFilters();
  }, []);

  // Fetch products from API based on filters
  useEffect(() => {
    fetchProducts();
  }, [debouncedTerm, category, brand, color, size, sort, order]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/products`, {
        params: {
          search: debouncedTerm,
          category,
          brand,
          color,
          size,
          sort,
          order,
          limit: 9,
        },
      });
      setProducts(data.products);
    } catch (error) {
      setError("Error fetching products");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const sortOptions = [
    { _id: "createdAt", name: "Newest" },
    { _id: "price", name: "Price" },
    // Add more sort options here if needed
  ];

  const orderOptions = [
    { _id: "asc", name: "Ascending" },
    { _id: "desc", name: "Descending" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Search Products</h1>

      {/* Search Bar */}
      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for products..."
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mt-4">
        {/* Category Filter */}
        <CustomSelect
          placeholder={"Categories"}
          options={categories}
          value={category}
          setValue={setCategory}
        />

        {/* Brand Filter */}
        <CustomSelect
          placeholder={"Brands"}
          options={brands}
          value={brand}
          setValue={setBrand}
        />

        {/* Color Filter */}
        <CustomSelect
          placeholder={"Colors"}
          options={colors}
          value={color}
          setValue={setColor}
        />

        {/* Size Filter */}
        <CustomSelect
          placeholder={"Sizes"}
          options={sizes}
          value={size}
          setValue={setSize}
        />

        {/* Sort and Order */}
        <CustomSelect
          placeholder={"Sort By"}
          options={sortOptions}
          value={sort}
          setValue={setSort}
        />

        <CustomSelect
          placeholder={"Order By"}
          options={orderOptions}
          value={order}
          setValue={setOrder}
        />
      </div>

      {/* Product Results */}
      <div className="mt-6">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 border-2 justify-center items-center gap-6">
            {products.map((product) => (
              <ProductCard key={product?._id} detail={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
