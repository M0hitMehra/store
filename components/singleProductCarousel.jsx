"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

const SingleProductCarousel = ({ data }) => {
  return (
    <Carousel plugins={[Autoplay({ delay: 3000, stopOnMouseEnter: true })]}>
      <CarouselContent>
        {data?.map((image, index) => (
          <CarouselItem key={index}>
            <Image
              src={image?.url}
              alt="Product image"
              style={{
                boxShadow:
                  "0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)",
              }}
              className=" w-full h-[90vh]"
              width={800} // specify the width of the image
              height={600} // specify the height of the image
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default SingleProductCarousel;
