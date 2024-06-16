import React from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import ProductCarousel from "./productCarousel";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import CustomTooltip from "./custom-tooltip";

const ProductCard = ({ detail, className }) => {
  const router = useRouter();
  const onClick = () => {
    router.push(`/product/${detail?._id}`);
  };

  return (
    <Card
      className={clsx(
        "w-[300px] md:w-[380px] flex-shrink-0 cursor-pointer",
        className
      )}
    >
      <CardContent className="relative">
        <ProductCarousel
          images={detail?.images}
          color={detail?.color}
          onClick={onClick}
        />
      </CardContent>
      <CardFooter>
        <div className="grid grid-cols-6" onClick={onClick}>
          <p className="text-sm md:text-base font-semibold col-span-5">
            <CustomTooltip description={detail?.title} side="top">
              {detail?.title?.slice(0, 30)} ...
            </CustomTooltip>
          </p>
          <span className="text-xs md:text-sm col-span-1">
            ${detail?.price}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
