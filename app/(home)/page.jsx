"use client";

import Image from "next/image";
import Link from "next/link";
import { Roboto } from "next/font/google";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import Banners from "./_components/banners";
import { useEffect, useState } from "react";
import Slider from "@/components/slider";
import axios from "axios";
import { server } from "@/lib/utils";
import Loader from "@/components/loader";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export default function Home() {
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    // Function to fetch product data
    const fetchProductData = async () => {
      try {
        const { data } = await axios.get(`${server}/products`);
        if (data.success) {
          setProductData(data.products);
        } else {
          // Handle unsuccessful response
          console.error("Failed to fetch product data:", data.error);
        }
      } catch (error) {
        // Handle network errors or other exceptions
        console.error("Error fetching product data:", error);
      }
    };

    // Call the fetchProductData function when the component mounts
    fetchProductData();
  }, []); // Dependency array is empty since this effect should only run once when the component mounts

  return (
    <div className=" flex flex-col gap-5">
      {productData && productData?.length > 0 ? (
        <>
          {/* Promotional Banner */}
          <Banners />

          {/* Recommended */}
          <Slider data={productData} />
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}
