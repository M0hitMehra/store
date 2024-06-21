"use client";

import Error from "@/components/error";
import Loader from "@/components/loader";
import axios from "axios";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../../globals.css";
import { cn, server } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import SingleProductCarousel from "@/components/singleProductCarousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/authContext";
import Slider from "@/components/slider";

const ProductDetails = ({ params }) => {
  const { product_id } = params;
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState(null);
  const [duplicateProductDetails, setDuplicateProductDetails] = useState([]);
  const [selectedSize, setsSelectedSize] = useState("");
  const [selectedStock, setSelectedStock] = useState(1);
  const [error, setError] = useState(null);
  const [buttonLoadingState, setButtonLoadingState] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const [recentProducts, setRecentProducts] = useState(null);
  const [isPresentOnWishList, setisPresentOnWishList] = useState(false);

  const router = useRouter();

  function formatNumberWithCommas(number) {
    if (typeof number !== "number") {
      throw new TypeError("Input must be a number");
    }
    return number.toLocaleString();
  }

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const { data } = await axios.get(`${server}/product/${product_id}`);
        if (data.success) {
          setProductDetails(data?.product);
          setsSelectedSize(data?.product?.size?.[0]?._id);

          const productWithDifferentAttributes = await axios.get(
            `${server}/products`,
            {
              params: { title: data?.product?.title },
            }
          );
          setDuplicateProductDetails(
            productWithDifferentAttributes?.data?.products
          );
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [product_id]);

  useEffect(() => {
    (async () => {
      if (user) {
        let wishlist = user?.wishlist;
        let doesExist = wishlist?.includes(product_id);
        setisPresentOnWishList(doesExist);
        const historyResponse = await axios.post(
          `${server}/auth/user/history/${product_id}`,
          {},
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
      }
    })();
  }, [user, product_id]);

  const addToWishlistHandler = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Please login to perfrom the action",
      });
      return;
    }
    setButtonLoadingState(true);
    const productId = product_id;
    try {
      const { data } = await axios.post(
        `${server}/auth/wishlist/${productId}`,
        {},
        {
          withCredentials: true, // Include credentials for cookies
        }
      );

      if (data.success) {
        setisPresentOnWishList(true);
        toast({
          variant: "success",
          title: "Added to wishlist successfully",
        });
      }
      setButtonLoadingState(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to add to wishlist",
      });
      setButtonLoadingState(false);
    }
  };

  const removeFromWishlistHandler = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Please login to perfrom the action",
      });
      return;
    }
    setButtonLoadingState(true);
    const productId = product_id;
    try {
      const { data } = await axios.delete(
        `${server}/auth/wishlist/remove/${productId}`,
        {
          withCredentials: true, // Include credentials for cookies
        }
      );

      if (data.success) {
        setisPresentOnWishList(false);
        toast({
          variant: "success",
          title: "Removed from wishlist successfully",
        });
      }
      setButtonLoadingState(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to remove from wishlist",
      });
      setButtonLoadingState(false);
    }
  };

  const getRecentlyVisited = async () => {
    const { data } = await axios.get(
      `${server}/auth/user/recently-visited`,

      {
        withCredentials: true,
      }
    );
    if (data?.success) {
      setRecentProducts(data?.recentlyVisited);
    }
  };

  useEffect(() => {
    getRecentlyVisited();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Error
        message={
          "Sorry nothing to display right now, please search something else " +
          error
        }
      />
    );
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center p-5 gap-10 xl:p-0 pt-20 ">
        <div className="grid grid-cols-1 md:grid-cols-9 w-full border-b">
          <div
            className="col-span-1 md:col-span-5 overflow-y-auto md:h-screen "
            style={{
              scrollbarWidth: "none" /* Firefox */,
              msOverflowStyle: "none" /* IE and Edge */,
            }}
          >
            <div className="p-1 flex justify-start items-center gap-5 flex-wrap">
              {productDetails?.images?.map((image, index) => (
                <Dialog key={index}>
                  <DialogTrigger className="max-w-[45%] h-full object-cover rounded-sm cursor-pointer">
                    {" "}
                    <img
                      src={image?.url}
                      alt=""
                      style={{
                        boxShadow:
                          "0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)",
                      }}
                      // onClick={() => setIsCarouselOpen((prev) => !prev)}
                      className=" h-full w-full"
                    />
                  </DialogTrigger>
                  <DialogContent className="p-8 rounded-lg">
                    <DialogHeader>
                      <DialogTitle>{productDetails?.title}</DialogTitle>
                      <DialogDescription>
                        <SingleProductCarousel data={productDetails?.images} />
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>
          <div className="col-span-1 md:col-span-4 flex flex-col gap-8 md:gap-12 p-5 pb-0">
            <div className="flex flex-col gap-2 title-price">
              <h1 className="font-bold text-xl md:text-2xl">
                {productDetails?.title}
              </h1>
              <h5 className="text-sm md:text-base font-semibold flex flex-col gap-1">
                ${formatNumberWithCommas(productDetails?.price)}{" "}
                <span className="font-light text-xs">Prices include GST</span>
              </h5>
            </div>

            {/* Color choice */}
            <div className="flex flex-col gap-4 md:gap-6">
              <div>
                <h2 className="font-bold text-xl md:text-2xl">Color</h2>
                <p className="font-light text-sm">
                  {productDetails?.color?.name.toUpperCase()}
                </p>
              </div>

              <div className="color-select overflow-x-auto w-full flex gap-4 md:gap-6 px-1">
                {duplicateProductDetails?.length &&
                  duplicateProductDetails?.map((duplicateProduct) => (
                    <div
                      key={duplicateProduct?._id}
                      className="flex flex-col gap-1 cursor-pointer"
                      onClick={() => {
                        router.replace(`/product/${duplicateProduct?._id}`);
                      }}
                    >
                      <img
                        src={duplicateProduct?.images?.[0]?.url}
                        alt=""
                        className={clsx(
                          "h-20 w-20 hover:opacity-80 color-select-images",
                          {
                            "border-2 border-black rounded-md hover:opacity-100 cursor-default":
                              duplicateProduct?._id === productDetails?._id,
                          }
                        )}
                      />
                      <span className="text-xs md:text-sm font-light text-center hover:opacity-80">
                        {duplicateProduct?.color?.name.toUpperCase()}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
            <hr />
            {/* Offers */}
            {productDetails?.offers && <span>{productDetails?.offers}</span>}

            {/* Size selection */}
            <div className="flex flex-col gap-4 md:gap-5">
              <h2 className="font-bold text-xl md:text-2xl">
                Size {productDetails?.size?.name}{" "}
              </h2>
              <div className="overflow-x-auto w-full flex gap-4 md:gap-6 py-2 px-1">
                {productDetails?.size?.map((duplicateProduct) => (
                  <p
                    key={duplicateProduct?._id}
                    onClick={() => {
                      setsSelectedSize(duplicateProduct?._id);
                    }}
                    className={cn(
                      clsx(
                        "h-10 p-2 border-2 rounded-md border-neutral-200 hover:opacity-80 text-center color-select-images cursor-pointer text-xs md:text-sm",
                        {
                          "border-2 border-black hover:opacity-100 cursor-default":
                            selectedSize === duplicateProduct?._id,
                        }
                      )
                    )}
                  >
                    {duplicateProduct?.name}
                  </p>
                ))}
              </div>
            </div>
            <hr />

            {/* Buying buttons */}
            <div className="grid grid-cols-3">
              <div className="flex flex-col md:flex-row col-span-1 p-3 pr-0">
                {productDetails?.stock <= 0 ? (
                  <p className="m-auto text-red-500 text-xs md:text-sm font-bold">
                    OUT OF STOCK
                  </p>
                ) : (
                  <>
                    <Button
                      className="w-8 h-8 md:w-10 md:h-10"
                      onClick={() => {
                        setSelectedStock((prev) =>
                          productDetails?.stock > prev ? prev + 1 : prev
                        );
                      }}
                    >
                      +
                    </Button>
                    <input
                      type="text"
                      className="w-8 h-8 md:w-10 md:h-10 text-center"
                      value={selectedStock}
                    />
                    <Button
                      className="w-8 h-8 md:w-10 md:h-10"
                      onClick={() => {
                        setSelectedStock((prev) => (prev === 1 ? 1 : prev - 1));
                      }}
                    >
                      -
                    </Button>
                  </>
                )}
              </div>
              <div className="col-span-2 flex flex-col gap-2 md:gap-4 p-3 pl-0">
                {productDetails?.stock > 0 && <Button>Add To Cart</Button>}
                {isPresentOnWishList ? (
                  <Button
                    variant={"outline"}
                    onClick={removeFromWishlistHandler}
                    disabled={buttonLoadingState}
                  >
                    {buttonLoadingState
                      ? "Removing..."
                      : "Remove From Wishlist"}
                  </Button>
                ) : (
                  <Button
                    variant={"outline"}
                    onClick={addToWishlistHandler}
                    disabled={buttonLoadingState}
                  >
                    {buttonLoadingState ? "Adding..." : "Add To Wishlist"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Extra details */}
        {productDetails?.otherDetails?.productStory?.description &&
          productDetails?.otherDetails?.productDetails?.description &&
          productDetails?.otherDetails?.manufacturAddress?.description &&
          productDetails?.otherDetails?.countoryOrigin?.description && (
            <div className=" p-8 w-full">
              <div className=" flex flex-col justify-center items-center  rounded-md p-5  bg-gray-200 w-full gap-10">
                {/* {productDetails?.otherDetails?.productStory?.title} */}
                {productDetails?.otherDetails?.productStory && (
                  <div className=" w-full flex flex-col justify-center items-start gap-3">
                    <h1 className=" text-2xl font-bold ">
                      {" "}
                      {productDetails?.otherDetails?.productStory?.title}
                    </h1>
                    <p className=" text-base font-light text-neutral-800">
                      {" "}
                      {productDetails?.otherDetails?.productStory?.description}
                    </p>
                  </div>
                )}
                <div className=" grid grid-cols-6 justify-center items-start w-full">
                  {productDetails?.otherDetails?.productDetails && (
                    <div className=" col-span-3 flex flex-col justify-center items-start gap-3">
                      <h1 className=" text-2xl font-bold ">
                        {" "}
                        {productDetails?.otherDetails?.productDetails?.title}
                      </h1>
                      <ul className=" list-disc flex flex-col justify-center items-start pl-4 gap-2">
                        {productDetails?.otherDetails?.productDetails
                          ?.description &&
                          productDetails?.otherDetails?.productDetails?.description?.map(
                            (detail) => (
                              <li
                                key={detail}
                                className="text-base font-light text-neutral-800"
                              >
                                {detail}
                              </li>
                            )
                          )}
                      </ul>
                    </div>
                  )}

                  {productDetails?.otherDetails?.manufacturAddress && (
                    <div className=" col-span-3 flex flex-col justify-center items-start gap-3">
                      <h1 className=" text-2xl font-bold ">
                        {" "}
                        {productDetails?.otherDetails?.manufacturAddress?.title}
                      </h1>
                      <p className="text-base font-light text-neutral-800">
                        {" "}
                        {
                          productDetails?.otherDetails?.manufacturAddress
                            ?.description
                        }
                      </p>
                    </div>
                  )}
                </div>
                {productDetails?.otherDetails?.countoryOrigin && (
                  <div className=" w-full flex flex-col justify-center items-start gap-3">
                    <h1 className=" text-2xl font-bold ">
                      {" "}
                      {productDetails?.otherDetails?.countoryOrigin?.title}
                    </h1>
                    <p className="text-base font-light text-neutral-800">
                      {
                        productDetails?.otherDetails?.countoryOrigin
                          ?.description
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

        {/* You may also like */}
        <div className=" flex flex-col gap-1">
          <h1 className=" pl-9 text-2xl font-bold">Recently Visited</h1>
          <Slider data={recentProducts} />
        </div>

        {/* Recently Visited */}
      </div>
    </>
  );
};

export default ProductDetails;
