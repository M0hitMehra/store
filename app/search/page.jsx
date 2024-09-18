"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { server } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce"; // For debouncing search
import CustomSelect from "@/components/custom-select";
import ProductCard from "@/components/productCard";
import ComponentLoader from "@/components/component-loader";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract search parameters from URL
  const initialSearchTerm = searchParams.get("query") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialBrand = searchParams.get("brand") || "";
  const initialColor = searchParams.get("color") || "";
  const initialSize = searchParams.get("size") || "";
  const initialSort = searchParams.get("sort") || "createdAt";
  const initialOrder = searchParams.get("order") || "asc";

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [category, setCategory] = useState(initialCategory);
  const [brand, setBrand] = useState(initialBrand);
  const [color, setColor] = useState(initialColor);
  const [size, setSize] = useState(initialSize);
  const [sort, setSort] = useState(initialSort);
  const [order, setOrder] = useState(initialOrder);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debouncedTerm] = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20; // Number of products per page

  // Fetch filter options (categories, brands, colors, sizes)
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

  // Fetch products from API based on filters and page
  useEffect(() => {
    fetchProducts(page);
  }, [debouncedTerm, category, brand, color, size, sort, order, page]);

  const fetchProducts = async (page) => {
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
          page,
          limit,
        },
      });

      setProducts(data.products);
      setTotalPages(Math.ceil(data.pagination.total / limit)); // Calculate total pages
    } catch (error) {
      setError("Error fetching products");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination handlers
  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const renderPagination = () => {
    const paginationItems = [];
    const totalPagesToShow = 5; // Number of pages to show around current

    if (totalPages <= totalPagesToShow) {
      // If total pages are less than or equal to the number to show
      for (let i = 1; i <= totalPages; i++) {
        paginationItems.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={() => setPage(i)}
              active={page === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first and last page
      paginationItems.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={() => setPage(1)}
            active={page === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (page > 3) {
        paginationItems.push(<PaginationEllipsis key="start-ellipsis" />);
      }

      // Pages around the current page
      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(totalPages - 1, page + 1);
        i++
      ) {
        paginationItems.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={() => setPage(i)}
              active={page === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (page < totalPages - 2) {
        paginationItems.push(<PaginationEllipsis key="end-ellipsis" />);
      }

      // Last page
      paginationItems.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={() => setPage(totalPages)}
            active={page === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return paginationItems;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Search Products</h1>

      {/* Search Bar */}
      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for products..."
        className="w-full"
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mt-4">
        <CustomSelect
          placeholder={"Categories"}
          options={categories}
          value={category}
          setValue={setCategory}
        />
        <CustomSelect
          placeholder={"Brands"}
          options={brands}
          value={brand}
          setValue={setBrand}
        />
        <CustomSelect
          placeholder={"Colors"}
          options={colors}
          value={color}
          setValue={setColor}
        />
        <CustomSelect
          placeholder={"Sizes"}
          options={sizes}
          value={size}
          setValue={setSize}
        />
        <CustomSelect
          placeholder={"Sort By"}
          options={[
            { _id: "createdAt", name: "Newest" },
            { _id: "price", name: "Price" },
          ]}
          value={sort}
          setValue={setSort}
        />
        <CustomSelect
          placeholder={"Order By"}
          options={[
            { _id: "asc", name: "Ascending" },
            { _id: "desc", name: "Descending" },
          ]}
          value={order}
          setValue={setOrder}
        />
      </div>

      {/* Product Results */}
      <div className="mt-6 flex justify-center items-center">
        {loading ? (
          <div className=" h-full w-full flex justify-center items-center">
            <ComponentLoader className={" mt-10 m-auto"} />
          </div>
        ) : error ? (
          <p>{error}</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="flex flex-wrap gap-10 justify-center">
            {products.map((product) => (
              <ProductCard
                key={product?._id}
                detail={product}
                className={"w-[300px] md:w-[330px]"}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={handlePrevious}
                disabled={page === 1}
              />
            </PaginationItem>

            {renderPagination()}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={handleNext}
                disabled={page === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default Search;
