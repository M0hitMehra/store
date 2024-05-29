"use client";
import Image from "next/image";
import {
  Cross,
  Crosshair,
  Heart,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import UserDropDown from "./userDropDown";
import { Button } from "./ui/button";

const MobileNavbar = ({ links, navLinksDropDown }) => {
  const router = useRouter();
  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="lg:hidden flex flex-col  w-full">
      <div className="lg:hidden flex justify-between items-center w-full fixed p-4 bg-neutral-900">
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

        {/* Modal */}
      </div>
      {isModalOpen && (
        <div className=" top-0 left-0  w-screen h-screen bg-orange-300"></div>
      )}
    </div>
  );
};

export default MobileNavbar;
