"use client";
import Image from "next/image";
import {
  ArrowBigLeftDash,
  Heart,
  Menu,
  Search,
  ShoppingCart,
   X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import clsx from "clsx";
import axios from "axios";
import { toast } from "./ui/use-toast";
import useAuthStore from "@/stores/useAuthStore";

const MobileNavbar = ({ links, navLinksDropDown }) => {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [hoveredLink, setHoveredLink] = useState("");
  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/auth/logout`, {
        withCredentials: true,
      });
      if (data?.success) {
        setUser(null);
        router.push("/");
        setIsMobileMenu(false);
        setIsModalOpen(false);
        toast({
          title: "Logged out successfully",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error logging out",
      });
    }
  };

  return (
    <div className="xl:hidden sticky flex flex-col">
      <div className="xl:hidden flex justify-between items-center w-full fixed p-4 bg-neutral-900 z-10">
        {/* Logog */}
        <Image
          src="/puma-logo.svg"
          alt="Brand Logo"
          className="h-12 w-12 text-neutral-200 cursor-pointer"
          onClick={() => router.push("/")}
          width={48} // Specify the width of the image
          height={48} // Specify the height of the image
        />
        <div className=" flex  gap-6 justify-end items-center ">
          {/* search */}

          <Search
            color="white"
            width={30}
            height={30}
            className=" hover:rounded-full hover:bg-neutral-500 px-2 cursor-pointer"
          />

          <Heart
            color="white"
            width={30}
            height={30}
            className=" hover:rounded-full hover:bg-neutral-500 px-2 cursor-pointer"
          />
          <ShoppingCart
            color="white"
            width={30}
            height={30}
            className=" hover:rounded-full hover:bg-neutral-500 px-2 cursor-pointer"
          />

          {!isMobileMenu ? (
            <Menu
              color="white"
              width={30}
              height={30}
              className=" hover:rounded-full hover:bg-neutral-500 px-2 cursor-pointer"
              onClick={() => {
                setIsModalOpen(true);
                setIsMobileMenu(true);
              }}
            />
          ) : (
            <X
              color="white"
              width={30}
              height={30}
              className=" hover:rounded-full hover:bg-neutral-500 px-2 cursor-pointer"
              onClick={() => {
                setIsModalOpen(false);
                setIsMobileMenu(false);
              }}
            />
          )}
        </div>
      </div>
      {/* Modal */}
      <div
        className={`duration-500 transition-all  w-[70vw] ${
          !isModalOpen ? "translate-y-[-100%]" : "translate-y-[0]"
        }`}
      >
        {isModalOpen && (
          <>
            <div className=" overflow-x-hidden top-0 left-0  w-screen h-screen bg-[#eeecec] flex flex-col justify-start items-center pt-24">
              {/* Categories */}
              <div className=" flex flex-col justify-between items-center h-full">
                <div className=" flex flex-col justify-around gap-5">
                  {links.map(({ text, key }) => (
                    <div className="relative" key={key}>
                      <Link
                        href={""}
                        className={clsx(
                          "text-black font-semibold relative flex flex-col text-nowrap",
                          {
                            "group-hover:text-white/50":
                              hoveredLink.toLowerCase() !== key.toLowerCase(),
                          }
                        )}
                        onMouseEnter={() => setHoveredLink(key)}
                        onMouseLeave={() => setHoveredLink("")}
                      >
                        {text}
                      </Link>
                    </div>
                  ))}
                </div>
                <div className=" w-full flex gap-3 justify-center items-center p-10">
                  {user ? (
                    <>
                      <Button
                        className="px-10"
                        onClick={() => {
                          router.push("/login");
                          setIsMobileMenu(false);
                          setIsModalOpen(false);
                        }}
                      >
                        Login
                      </Button>
                      <Button
                        className="px-10"
                        onClick={() => {
                          router.push("/signup");
                          setIsMobileMenu(false);
                          setIsModalOpen(false);
                        }}
                      >
                        Signup
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        className="px-10"
                        onClick={() => {
                          router.push("/dashboard");
                          setIsMobileMenu(false);
                          setIsModalOpen(false);
                        }}
                      >
                        Account
                      </Button>
                      <Button
                        className="px-10"
                        onClick={logoutHandler}
                        variant="destructive"
                      >
                        Logout
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* Sub categories */}
            {navLinksDropDown?.map(
              (item) =>
                hoveredLink.toLowerCase() === item.category.toLowerCase() && (
                  <div
                    key={item?.category}
                    className=" overflow-scroll scroll-smooth absolute  top-0 left-0  w-screen h-screen bg-[#eeecec] flex flex-col justify-start items-center p-10 pt-24"
                    onMouseEnter={() => {
                      setHoveredLink(item?.category);
                    }}
                    onMouseLeave={() => {
                      setHoveredLink("");
                    }}
                  >
                    <div
                      className=" absolute left-0 pl-2 flex gap-2 cursor-pointer justify-center items-center   z-[1000] "
                      onClick={() => setHoveredLink("")}
                    >
                      <ArrowBigLeftDash />
                      <p className="text-neutral-60 font-bold">Go Back</p>
                    </div>
                    <div className=" flex flex-col gap-5  cursor-pointer  w-full ">
                      {item?.rightSide?.map((rightSideItem) => (
                        <div
                          key={rightSideItem?.title}
                          className=" flex flex-col justify-start items-center gap-2"
                        >
                          {!rightSideItem?.isSubSection ? (
                            <div className=" flex flex-col justify-start items-center gap-2">
                              {rightSideItem?.title && (
                                <h1 className="w-full text-nowrap font-semibold text-xl text-black hover:text-[#8a7350] border-b-2 border-black">
                                  {rightSideItem?.title.toString()}
                                </h1>
                              )}
                              <ul className="flex flex-col justify-start items-start gap-3">
                                {rightSideItem?.values?.map(
                                  (rightSideItemValues) => (
                                    <li
                                      key={rightSideItemValues}
                                      className="text-base text-nowrap hover:text-[#1e170d] text-[#6b5b42]"
                                    >
                                      {rightSideItemValues.toString()}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          ) : (
                            <div className=" flex flex-col justify-start items-start gap-2">
                              {rightSideItem?.title && (
                                <h1 className=" text-nowrap w-full font-semibold text-xl text-black hover:text-[#8a7350] border-b-2 border-black">
                                  {rightSideItem?.title.toString()}
                                </h1>
                              )}
                              {rightSideItem?.values?.map(
                                (rightSideItemValues) => (
                                  <>
                                    <h1
                                      key={rightSideItemValues}
                                      className="w-full  cursor-pointer font-bold hover:text-[#8a7350] text-[#6b5b42]"
                                    >
                                      {rightSideItemValues?.title}
                                    </h1>
                                    {rightSideItemValues?.values.map(
                                      (rightSideItemValuesSubSection) => (
                                        <p
                                          key={rightSideItemValuesSubSection}
                                          className="  hover:text-[#1e170d] text-[#6b5b42]"
                                        >
                                          {rightSideItemValuesSubSection}
                                        </p>
                                      )
                                    )}
                                  </>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MobileNavbar;
