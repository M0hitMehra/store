"use client";

import Error from "@/components/error";
import Loader from "@/components/loader";
import axios from "axios";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../../globals.css";
import { cn, invertColor, server } from "@/lib/utils";
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
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import useCartStore from "@/stores/useCartStore";
import useWishlistStore from "@/stores/useWishlistStore";

const ProductDetails = ({ params }) => {
  const { product_id } = params;
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState(null);
  const [duplicateProductDetails, setDuplicateProductDetails] = useState([]);
  const [selectedStock, setSelectedStock] = useState(1);
  const [error, setError] = useState(null);
  const [buttonLoadingState, setButtonLoadingState] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const [recentProducts, setRecentProducts] = useState(null);
  const [isPresentOnWishList, setisPresentOnWishList] = useState(false);

  const [filteredColors, setFilteredColors] = useState([]);
  const [filteredSizes, setFilteredSizes] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const {
    wishlist,
    fetchWishlist,
    addProductToWishlist,
    removeProductFromWishlist,
    loading: wishlistLoading,
  } = useWishlistStore();
  const { cart, addProduct, removeProduct, fetchCart } = useCartStore();

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
          let variants = data.product.variants;
          setProductDetails(data.product);
          variants.push(data.product);
          setDuplicateProductDetails(variants);
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
    if (duplicateProductDetails.length > 0) {
      // Filter sizes based on selected color
      if (selectedColor) {
        const sizes = duplicateProductDetails
          .filter((variant) => variant.color._id === selectedColor)
          .map((variant) => variant.size);
        setFilteredSizes(sizes);
      } else {
        setFilteredSizes(
          Array.from(
            new Set(duplicateProductDetails.map((variant) => variant.size))
          )
        );
      }

      // Filter colors based on selected size
      if (selectedSize) {
        const colors = duplicateProductDetails
          .filter((variant) => variant.size._id === selectedSize)
          .map((variant) => variant.color);
        setFilteredColors(colors);
      } else {
        setFilteredColors(
          Array.from(
            new Set(duplicateProductDetails.map((variant) => variant.color))
          )
        );
      }
    }
  }, [selectedColor, selectedSize, duplicateProductDetails]);

  // Handle color and size selection
  const handleColorSelect = (colorId) => {
    setSelectedColor(colorId);
  };

  const handleSizeSelect = (sizeId) => {
    setSelectedSize(sizeId);
  };

  const [isInWishlist, setIsInWishlist] = useState(
    wishlist.some((item) => item?.product?._id === productDetails?._id)
  );

  const [isInCart, setIsInCart] = useState(
    cart?.some((item) => item?.product._id === productDetails?._id)
  );

  const checkIfInWishlist = () => {
    setIsInWishlist(
      wishlist.some((item) => item?.product?._id === productDetails?._id)
    );
  };

  const checkIfInCart = () => {
    setIsInCart(
      cart?.some((item) => item?.product._id === productDetails?._id)
    );
  };

  const handleWishlistClick = async () => {
    if (isInWishlist) {
      await removeProductFromWishlist(productDetails?._id);
    } else {
      await addProductToWishlist(productDetails?._id);
    }
    fetchWishlist();
    checkIfInWishlist();
  };

  const handleCartClick = async () => {
    if (isInCart) {
      await removeProduct(productDetails?._id);
    } else {
      await addProduct(productDetails?._id, 1);
    }
    fetchCart();
    checkIfInCart();
  };

  useEffect(() => {
    checkIfInWishlist();
  }, [wishlist]);

  useEffect(() => {
    checkIfInCart();
  }, [cart]);

  const getRecentlyVisited = async () => {
    if (!user) {
      return;
    }
    const { data } = await axios.get(`${server}/auth/user/recently-visited`, {
      params: { limit: 10 },
      withCredentials: true,
    });
    if (data?.success) {
      setRecentProducts(data?.recentlyVisited);
    }
  };

  useEffect(() => {
    getRecentlyVisited();
  }, [user]);

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
            <div className="p-1 flex justify-start items-center gap-5 flex-wrap ">
              {productDetails?.images?.map((image, index) => (
                <Dialog key={index} className="max-w-[60vw] max-h-[100vh]">
                  <DialogTrigger className="max-w-[45%] h-full object-cover rounded-sm cursor-pointer">
                    {" "}
                    <Image
                      src={image?.url}
                      alt=""
                      style={{
                        boxShadow:
                          "0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)",
                      }}
                      className="h-full w-full"
                      width={800} // specify the width of the image
                      height={600} // specify the height of the image
                      // onClick={() => setIsCarouselOpen((prev) => !prev)}
                    />{" "}
                  </DialogTrigger>
                  <DialogContent className="p-8 rounded-lg max-w-[90vw] max-h-[100vh]">
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
                ₹ {formatNumberWithCommas(productDetails?.price)}{" "}
                <span className="font-light text-xs">Prices include GST</span>
              </h5>
            </div>
            <Separator />

            {/* Options */}
            <div className=" flex flex-col gap-3 justify-center items-start">
              <div className=" flex flex-col gap-5 justify-center items-start">
                <div className="flex flex-col gap-3 ">
                  <h1 className="font-bold text-xl md:text-2xl">Options</h1>
                  <p className="font-light text-sm flex gap-3 items-center">
                    {productDetails?.color?.name.toUpperCase()}
                    <span
                      className="rounded-full w-3 h-3 shadow-md"
                      style={{
                        backgroundColor: productDetails?.color?.code,
                        borderColor: invertColor(
                          productDetails?.color?.code || "#ffffff"
                        ),
                        boxShadow: `0 0 2px ${invertColor(
                          productDetails?.color?.code || "#ffffff"
                        )}`,
                      }}
                    ></span>
                  </p>
                </div>

                <div className="flex flex-col gap-3 ">
                  <h1 className="font-bold text-xl md:text-xl">
                    Available Sizes For{" "}
                    {productDetails?.color?.name.toUpperCase()} Color
                  </h1>

                  <div className="color-select overflow-x-auto w-full flex gap-4 md:gap-6 px-1">
                    {filteredSizes?.length &&
                      filteredSizes?.map((duplicateProduct) => (
                        <div
                          key={duplicateProduct?._id}
                          className="flex flex-col gap-1 cursor-pointer"
                          onClick={() => {
                            router.replace(`/product/${duplicateProduct?._id}`);
                          }}
                        >
                          <p
                            // onClick={() => {
                            //   setsSelectedSize(duplicateProduct?._id);
                            // }}
                            className={cn(
                              clsx(
                                "h-10 p-2 border-2 rounded-md border-neutral-200 hover:opacity-80 text-center color-select-images cursor-pointer text-xs md:text-sm",
                                {
                                  "border-2 border-black hover:opacity-100 cursor-default":
                                    productDetails?._id ===
                                    duplicateProduct?._id,
                                }
                              )
                            )}
                          >
                            {productDetails?.size?.name}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Color choice */}
            <div className="flex flex-col gap-4 md:gap-6">
              <div className=" flex flex-col gap-3 justify-center items-start">
                <h2 className="font-bold text-xl md:text-2xl">
                  {duplicateProductDetails.length > 0
                    ? "Other Available Colors:"
                    : "No Other Colors Available"}
                </h2>

                <p className="font-light text-sm flex gap-3 items-center">
                  {productDetails?.color?.name.toUpperCase()}
                  <span
                    className="rounded-full w-3 h-3 shadow-md"
                    style={{
                      backgroundColor: productDetails?.color?.code,
                      borderColor: invertColor(
                        productDetails?.color?.code || "#ffffff"
                      ),
                      boxShadow: `0 0 2px ${invertColor(
                        productDetails?.color?.code || "#ffffff"
                      )}`,
                    }}
                  ></span>
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
                      <Image
                        src={
                          duplicateProduct?.images?.[0]?.url ||
                          "https://res.cloudinary.com/mohit786/image/upload/v1693677254/cv9gdgz150vtoimcga0e.jpg"
                        }
                        alt=""
                        width={200}
                        height={80}
                        className={clsx(
                          " max-w-24 h-20  hover:opacity-100 color-select-images",
                          {
                            "border-2 border-black rounded-md hover:opacity-100 cursor-default opacity-100":
                              duplicateProduct?._id === productDetails?._id,
                          },
                          {
                            "opacity-70":
                              duplicateProduct?._id !== productDetails?._id,
                          }
                        )}
                        quality={75} // you can also specify the quality of the image
                      />

                      <p className="text-xs md:text-sm font-light text-center hover:opacity-80 flex gap-3 items-center justify-center">
                        {duplicateProduct?.color?.name.toUpperCase()}
                        <span
                          className="rounded-full w-3 h-3 shadow-md"
                          style={{
                            backgroundColor: duplicateProduct?.color?.code,
                            borderColor: invertColor(
                              duplicateProduct?.color?.code || "#ffffff"
                            ),
                            boxShadow: `0 0 2px ${invertColor(
                              duplicateProduct?.color?.code || "#ffffff"
                            )}`,
                          }}
                        ></span>
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            <Separator />

            {/* Offers */}
            {productDetails?.offers && <span>{productDetails?.offers}</span>}

            {/* Size selection */}

            <div className="flex flex-col gap-4 md:gap-6">
              <div className=" flex flex-col gap-3 justify-center items-start">
                <h2 className="font-bold text-xl md:text-2xl">
                  {" "}
                  {duplicateProductDetails.length > 0
                    ? "Other Available Sizes:"
                    : "No Other Sizes Available"}
                </h2>

                <p className="font-light text-sm flex gap-3 items-center">
                  {productDetails?.size?.name.toUpperCase()}
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
                      <p
                        className={cn(
                          clsx(
                            "h-10 p-2 border-2 rounded-md border-neutral-200 hover:opacity-80 text-center color-select-images cursor-pointer text-xs md:text-sm",
                            {
                              "border-2 border-black hover:opacity-100 cursor-default":
                                productDetails?._id === duplicateProduct?._id,
                            }
                          )
                        )}
                      >
                        {productDetails?.size?.name}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            <Separator />

            {/* Buying buttons */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col md:flex-row col-span-1 p-3 pr-0">
                {productDetails?.stock <= 0 ? (
                  <p className="m-auto text-red-500 text-xs md:text-sm font-bold">
                    OUT OF STOCK
                  </p>
                ) : (
                  <>
                    {!isInCart && (
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
                          readOnly
                        />
                        <Button
                          className="w-8 h-8 md:w-10 md:h-10"
                          onClick={() => {
                            setSelectedStock((prev) =>
                              prev === 1 ? 1 : prev - 1
                            );
                          }}
                        >
                          -
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
              <div className="col-span-2 flex flex-col gap-2 md:gap-4 p-3 pl-0">
                {productDetails?.stock > 0 && (
                  <Button onClick={handleCartClick} disabled={isInCart}>
                    {!isInCart ? <> Add To Cart</> : <> Go to cart</>}
                  </Button>
                )}
                {isInWishlist ? (
                  <Button
                    variant={"outline"}
                    onClick={handleWishlistClick}
                    disabled={wishlistLoading}
                  >
                    {wishlistLoading ? "Removing..." : "Remove From Wishlist"}
                  </Button>
                ) : (
                  <Button
                    variant={"outline"}
                    onClick={handleWishlistClick}
                    disabled={wishlistLoading}
                  >
                    {wishlistLoading ? "Adding..." : "Add To Wishlist"}
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

        {/* Recently Visited */}
        <div className=" flex flex-col gap-1">
          <h1 className=" pl-9 text-2xl font-bold">Recently Visited</h1>
          <Slider data={recentProducts} />
        </div>

        {/* You may also like section */}
      </div>
    </>
  );
};

export default ProductDetails;
