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

const ProductDetails = ({ params }) => {
  const { product_id } = params;
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState(null);
  const [duplicateProductDetails, setDuplicateProductDetails] = useState([]);
  const [selectedSize, setsSelectedSize] = useState("");
  const [selectedStock, setSelectedStock] = useState(1);
  const [error, setError] = useState(null);
  const router = useRouter();

  function formatNumberWithCommas(number) {
    if (typeof number !== "number") {
      throw new TypeError("Input must be a number");
    }
    return number.toLocaleString();
  }

  // Example usage:
  const input = 6999;
  const output = formatNumberWithCommas(input);
  console.log(output); // Output: 6,999

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const { data } = await axios.get(
          `${server}/product/${product_id}`
        );
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
  console.log(duplicateProductDetails);

  return (
    <div className=" flex flex-col justify-center items-center p-5 gap-10">
      <div className=" grid grid-cols-9 w-full">
        <div
          className=" col-span-5 overflow-y-auto h-screen "
          style={{
            scrollbarWidth: "none" /* Firefox */,
            msOverflowStyle: "none" /* IE and Edge */,
          }}
        >
          <div className="p-1 flex justify-start items-center gap-5 flex-wrap">
            {productDetails?.images?.map((image, index) => (
              <img
                key={index}
                src={image?.url}
                alt=""
                className={`max-w-[45%] h-full object-cover rounded-sm `}
                style={{
                  boxShadow:
                    "0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)",
                }}
              />
            ))}
          </div>
        </div>
        <div className=" col-span-4 flex flex-col gap-12 p-5">
          <div className=" flex flex-col gap-2 title-price">
            <h1 className=" font-bold text-2xl">{productDetails?.title}</h1>
            <h5 className=" text-base font-semibold flex flex-col gap-1">
              ${formatNumberWithCommas(productDetails?.price)}{" "}
              <span className=" font-light text-xs">Prices include GST</span>
            </h5>
          </div>

          {/* //! Color chose  */}
          <div className=" flex flex-col gap-6">
            <div>
              <h2 className=" font-bold text-2xl">Color</h2>
              <p className=" font-light text-sm">
                {productDetails?.color?.name.toUpperCase()}
              </p>
            </div>

            <div className=" color-select overflow-x-auto w-full flex gap-6  px-1 ">
              {duplicateProductDetails?.length &&
                duplicateProductDetails?.map((duplicateProduct) => (
                  <div
                    key={duplicateProduct?._id}
                    className=" flex flex-col gap-1 cursor-pointer"
                    onClick={() => {
                      router.replace(`/product/${duplicateProduct?._id}`);
                    }}
                  >
                    <img
                      src={duplicateProduct?.images?.[0]?.url}
                      alt=""
                      className={clsx(
                        " h-20 w-20 hover:opacity-80  color-select-images",
                        {
                          "border-2 border-black rounded-md  hover:opacity-100 cursor-default":
                            duplicateProduct?._id === productDetails?._id,
                        }
                      )}
                    />
                    <span className=" text-sm font-light text-center hover:opacity-80">
                      {duplicateProduct?.color?.name.toUpperCase()}
                    </span>
                  </div>
                ))}
            </div>
          </div>
          <hr />
          {/* // !Offers */}
          {productDetails?.offers && <span>{productDetails?.offers}</span>}

          {/* //! Size  */}
          <div className=" flex flex-col gap-5">
            <h2 className=" font-bold text-2xl">
              Size {productDetails?.size?.name}{" "}
            </h2>
            <div className=" overflow-x-auto w-full flex gap-6 py-2 px-1 ">
              {productDetails?.size?.map((duplicateProduct) => (
                <p
                  key={duplicateProduct?._id}
                  onClick={() => {
                    setsSelectedSize(duplicateProduct?._id);
                  }}
                  className={cn(
                    clsx(
                      " h-10 p-2 border-2 rounded-md border-neutral-200 hover:opacity-80 text-center color-select-images cursor-pointer text-sm",
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

          {/* //! buying Buttons */}
          <div className=" grid grid-cols-3">
            <div className="flex col-span-1 p-3 pr-0">
              {productDetails?.stock <= 0 ? (
                <p className=" m-auto text-red-500 text-sm font-bold">
                  OUT OF STOCK
                </p>
              ) : (
                <>
                  <Button
                    className="w-10 h-10"
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
                    className="w-10 h-10 text-center"
                    value={selectedStock}
                  />
                  <Button
                    className="w-10 h-10"
                    onClick={() => {
                      setSelectedStock((prev) => (prev === 1 ? 1 : prev - 1));
                    }}
                  >
                    -
                  </Button>
                </>
              )}
            </div>
            <div className=" col-span-2 flex flex-col gap-4 p-3 pl-0">
              {productDetails?.stock > 0 && <Button>Add To Cart</Button>}
              <Button variant={"outline"}>Add To Wishlist</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
