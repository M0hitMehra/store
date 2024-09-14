"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "@/lib/utils"; // Adjust this import based on your project structure
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("asc");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch products from API based on filters
  useEffect(() => {
    fetchProducts();
  }, [searchTerm, category, brand, color, size, sort, order]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/products`, {
        params: {
          search: searchTerm,
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
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {/* Add options for categories */}
        </Select>

        <Select value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="">All Brands</option>
          {/* Add options for brands */}
        </Select>

        <Select value={color} onChange={(e) => setColor(e.target.value)}>
          <option value="">All Colors</option>
          {/* Add options for colors */}
        </Select>

        <Select value={size} onChange={(e) => setSize(e.target.value)}>
          <option value="">All Sizes</option>
          {/* Add options for sizes */}
        </Select>

        <Select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="createdAt">Newest</option>
          <option value="price">Price</option>
          {/* Add other sorting options if needed */}
        </Select>

        <Select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </Select>
      </div>

      {/* Product Results */}
      <div className="mt-6">
        {loading ? (
          <p>Loading...</p>
        )  : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="border p-4">
                <h3 className="font-bold">{product.title}</h3>
                <p>{product.description}</p>
                <p>${product.price}</p>
                {/* Add more product details as needed */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
