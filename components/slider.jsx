"use client";

import React from "react";
import ProductCard from "./productCard";

const Slider = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full overflow-x-auto scrollbar-none py-4">
      <div className="flex gap-6 min-w-max px-4 sm:px-6">
        {data.map((item) => (
          <ProductCard
            key={item?._id}
            detail={item}
            className="w-64 sm:w-72 flex-shrink-0"
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
