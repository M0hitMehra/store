import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ProductCarousel = ({ images, color, onClick }) => {
  return (
    <Carousel className="w-full max-w-[280px] md:max-w-xs">
      <CarouselContent onClick={onClick}>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="p-1 relative">
              <p className="absolute left-0 bg-red-500 text-white px-3 py-[0.9px] text-xs md:text-sm">
                -34%
              </p>
              <img
                src={image?.url}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default ProductCarousel;
