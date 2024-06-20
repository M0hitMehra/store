import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const SingleProductCarousel = ({ data }) => {
  return (
    <Carousel  >
      <CarouselContent >
        {data?.map((image, index) => (
          <CarouselItem key={index} >
            <img
              src={image?.url}
              alt=""
              style={{
                boxShadow:
                  "0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)",
              }}
              className=" h-[70vh] "
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
