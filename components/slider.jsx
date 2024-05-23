import React from "react";
import ProductCard from "./productCard";

const Slider = ({ data }) => {
  return (
    <div className="flex justify-start items-center overflow-x-auto gap-20 p-8">
      {data?.map((value) => (
        <ProductCard key={value._id} detail={value} />
      ))}
    </div>
  );
};

export default Slider;
