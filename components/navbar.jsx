"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Heart, Search, ShoppingCart, User } from "lucide-react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import pumaLogo from "@/public/puma-logo.svg";
import Image from "next/image";
import UserDropDown from "./userDropDown";
import MobileNavbar from "./mobile-navbar";
import SearchBar from "./search-bar";
import useCategoryStore from "@/stores/useCategoryStore";

const Navbar = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [hoveredLink, setHoveredLink] = useState("");
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const router = useRouter();

  //   Navbar Category Links
  const links = [
    { text: "New", key: "new" },
    { text: "Women", key: "Women" },
    { text: "Men", key: "Men" },
    { text: "Kids", key: "Kids" },
    { text: "FENTY x PUMA", key: "FENTY x PUMA" },
    { text: "Motorsport", key: "Motorsport" },
    { text: "Collaborations", key: "Collaborations" },
    { text: "Sports", key: "Sports" },
    { text: "Outlet", key: "Outlet" },
  ];

  const { categories, fetchCategories, loading, error } = useCategoryStore();
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  console.log(categories)

  //   all Category
  const navLinksDropDown = [
    {
      category: "new",
      leftSide: [
        "Launch Calendar",
        "Worn by Ibrahim Ali Khan",
        "A$AP ROCKY x PUMA",
        "Exclusives",
        "Travel Store",
        "Terrace",
        "Nitro Collection",
        "Kids Store",
      ],
      rightSide: [
        {
          title: "Shop By Gender",
          values: ["Men", "Women", "Kids & Teens"],
        },
        {
          title: "Classics",
          values: ["Shoes", "Clothing"],
        },
        {
          title: "Sneaker Store",
          values: ["Palermo", "Suede", "RS", "Rider", "Clyde", "Slipstream"],
        },
      ],
    },

    {
      category: "Women",
      leftSide: [
        "New & Trending",
        "Sneaker Store",
        "Palermo",
        "Curated Looks by Kareena",
        "Nitro Running",
        "Sports Bras",
        "Summer Daze",
        "Sale",
      ],
      rightSide: [
        {
          title: "Shoes",
          values: [
            "Sneakers",
            "Running",
            "Walking",
            "Training & Gym",
            "Slip-ons & Ballerinas",
            "Sandals & Flip Flops",
            "Motorsport",
            "Badminton",
            "Softride",
            "Nitro",
          ],
        },
        {
          title: "Clothing",
          values: [
            "T-Shirts & Tops",
            "Polos",
            "Sports Bras",
            "Jackets",
            "Sweatshirts & Hoodies",
            "Shorts",
            "Pants",
            "Tights & Leggings",
            "Dresses & Skirts",
            "Maternity Clothing",
            "Homewear",
            "Thermals & Winterwear",
            "Innerwear",
            "Modest Wear",
            "Tracksuits",
          ],
        },

        {
          title: "Accessories",
          values: [
            "Caps & Beanies",
            "Backpacks",
            "Bags: Gym & Casual",
            "Socks",
            "Water Bottles",
            "Sports Equipment",
            "Wallets",
            "Gloves",
            "Face Masks",
            "Eyewear",
          ],
        },

        {
          title: "Sports",
          values: ["Yoga", "Basketball", "Cricket", "Football"],
        },

        {
          title: "Motorsport",
          values: ["Scuderia Ferrari", "BMW M Motorsport"],
        },
      ],
    },

    {
      category: "Kids",
      leftSide: [
        "Kids Store",
        "New & Trending",
        "School Store",
        "Shoes Under $100",
        "Clothing Under $50",
        "Motorsport",
        "one8",
        "Sale",
      ],
      rightSide: [
        {
          title: "Seasons Favourites",
          values: [
            "Summer Camp",
            "PUMA x TROLLS",
            "PUMA x MIRACULOUS",
            "School Store",
            "Super Puma",
            "Sets",
            "Homewear",
          ],
        },

        {
          title: "Boys",
          values: [
            {
              title: "Bags & Accessories",
              values: [],
            },

            {
              title: "Shoes",
              values: [
                "Casual",
                "Sports",
                "Sandals & Flip Flops",
                "School Shoes",
              ],
            },

            {
              title: "Clothing",
              values: [
                "T-Shirts",
                "Hoodies & Sweatshirts",
                "Pants & Shorts",
                "Jackets",
              ],
            },

            {
              title: "AGE 0-4 YEARS",
              values: [],
            },

            {
              title: "AGE 4-8 YEARS",
              values: [],
            },

            {
              title: "AGE 8-16 YEARS",
              values: [],
            },
          ],
          isSubSection: true,
        },

        {
          title: "Girls",
          values: [
            {
              title: "Bags & Accessories",
              values: [],
            },

            {
              title: "Shoes",
              values: [
                "Casual",
                "Sports",
                "Sandals & Flip Flops",
                "School Shoes",
              ],
            },

            {
              title: "Clothing",
              values: [
                "T-Shirts",
                "Hoodies & Sweatshirts",
                "Pants & Shorts",
                "Jackets",
              ],
            },

            {
              title: "AGE 0-4 YEARS",
              values: [],
            },

            {
              title: "AGE 4-8 YEARS",
              values: [],
            },

            {
              title: "AGE 8-16 YEARS",
              values: [],
            },
          ],
          isSubSection: true,
        },

        {
          title: "Sports",
          values: ["Football", "Cricket", "Running", "Indoor Sports"],
        },

        {
          title: "Motorsport",
          values: [
            "Scuderia Ferrari",
            "BMW M Motorsport",
            "Mercedes AMG Petronas",
          ],
        },
      ],
    },

    {
      category: "Motorsport",
      leftSide: [],
      rightSide: [
        {
          title: "",
          values: [
            "Motorsport Store",
            "FORMULA 1",
            "Scuderia Ferrari",
            "Mercedes AMG Petronas",
          ],
        },

        {
          title: "",
          values: [
            "BMW M Motorsport",
            "Porsche Legacy",
            "Porsche Design",
            "Shoes",
          ],
        },

        {
          title: "",
          values: ["Clothing", "Accessories"],
        },
      ],
    },

    {
      category: "Collaborations",
      leftSide: [],
      rightSide: [
        {
          title: "Select",
          values: [
            "A$AP ROCKY x PUMA",
            "PUMA x PALM TREE CREW",
            "PUMA X MMQ",
            "PUMA x PLEASURES",
            "PUMA x PERKS AND MINI",
            "YONA",
            "PUMA x SOPHIA CHANG",
          ],
        },

        {
          title: "Partnerships",
          values: [
            "PUMA x ONE PIECE",
            "PUMA x PLAYSTATION",
            "PUMA x HARRDY SANDHU",
            "PUMA x CHEETOS",
            "PUMA x LEMLEM",
            "PUMA x STAPLE",
            "PUMA x TROLLS",
            "PUMA x one8",
            "Neymar Jr-",
          ],
        },
      ],
    },

    {
      category: "Sports",
      leftSide: [],
      rightSide: [
        {
          title: "Running",
          values: [
            "Running Store",
            "Everyday Running",
            "5-10 km Running",
            "Long Distance Running",
            "Trail Running",
            "Puma Run Clubs",
            "Clothing",
            "Accessories",
            "Nitro Collection",
            "First Mile",
            "Seasons Collection",
          ],
        },

        {
          title: "Football",
          values: [
            "Football Store",
            "Turf Trainers",
            "Firm/Artificial Ground Boots",
            "Indoor Shoes",
            "Footballs & Accessories",
            "Manchester City FC",
            "BVB",
            "AC Milan",
            "Pursuit Pack",
            "Phenomenal Pack",
            "AL-HILAL",
          ],
        },

        {
          title: "Basketball",
          values: [
            "Shoes",
            "Clothing",
            "BASKETBALL NOSTALGIA",
            "PUMA x CHEETOS",
            "PUMA x MELO",
            "CHILDHOOD DREAMS COLLECTION",
          ],
        },

        {
          title: "Training",
          values: [
            "Shoes",
            "Gym Wear",
            "Gym Bags & Accessories",
            "Yoga",
            "Sports Bras",
            "Summer Daze",
            "Maternity Wear",
          ],
        },

        {
          title: "Cricket",
          values: [
            "PUMA x RCB",
            "PUMA x DELHI CAPITALS",
            "Cricket Shoes - Rubber",
            "Cricket Shoes - Spike",
            "Clothing",
            "Cricket Gear & Accessories",
          ],
        },

        {
          title: "Badminton",
          values: ["Non-marking Shoes"],
        },

        {
          title: "Fanwear",
          values: [
            "Puma x RCB",
            "Manchester City FC",
            "BVB",
            "AC Milan",
            "Mumbai City FC",
            "Bengaluru FC",
            "PUMA x INSTITUTO NEYMAR JR",
          ],
        },
      ],
    },

    {
      category: "Outlet",
      leftSide: [
        "Shop All Outlet",
        "Sport Shoes",
        "Starting From",
        "Motorsport",
        "Collection Starting",
        "from $99",
        "Everything under",
        "New To Outlet",
      ],
      rightSide: [
        {
          title: "Outlet Men",
          values: [
            {
              title: "Bags & Accessories",
              values: [],
            },

            {
              title: "Shoes",
              values: [
                "Casual",
                "Sports",
                "Sandals & Flip Flops",
                "Motersport",
              ],
            },

            {
              title: "Clothing",
              values: [
                "T-Shirts",
                "Hoodies & Sweatshirts",
                "Jackets",
                "Pants & Shorts",
                "Polos",
                "Tracksuits",
              ],
            },
          ],
          isSubSection: true,
        },

        {
          title: "Outlet Women",
          values: [
            {
              title: "Bags & Accessories",
              values: [],
            },

            {
              title: "Shoes",
              values: [
                "Casual",
                "Sports",
                "Sandals & Flip Flops",
                "Motersport",
              ],
            },

            {
              title: "Clothing",
              values: [
                "T-Shirts & Tops",
                "Hoodies & Sweatshirts",
                "Pants & Shorts",
                "Tights & Leggings",
                "Innerwear",
              ],
            },
          ],
          isSubSection: true,
        },

        {
          title: "Outlet Kids",
          values: [
            {
              title: "Shoes",
              values: [
                "Casual",
                "Sports",
                "Sandals & Flip Flops",
                "Motersport",
              ],
            },

            {
              title: "Clothing",
              values: [
                "T-Shirts & Tops",
                "Hoodies & Sweatshirts",
                "Pants & Shorts",
                "Leggings",
                "Jackets",
              ],
            },
          ],
          isSubSection: true,
        },

        {
          title: "Outlet Motorsport",
          values: [
            "BMW M Motorsport",
            "Mercedes AMG Petronas",
            "Scuderia Ferrari",
            "Porsche Legacy",
          ],
        },

        {
          title: "Outlet Sports",
          values: [
            "Football",
            "Cricket",
            "Basketball",
            "Running",
            "Training",
            "Badminton",
          ],
        },
      ],
    },

    {
      category: "Men",
      leftSide: [
        "New & Trending",
        "Sneaker Store",
        "Worn by Ibrahim Ali Khan",
        "Terrace",
        "Nitro Running",
        "Motorsport",
        "Worn by Harrdy Sandhu",
        "Sale",
      ],
      rightSide: [
        {
          title: "Shoes",
          values: [
            "Sneakers",
            "Running",
            "Walking",
            "Training & Gym",
            "Slip-ons",
            "Sandals & Flip Flops",
            "Motorsport",
            "Cricket",
            "Badminton",
            "Basketball",
            "Football",
            "Softride",
            "Nitro",
            "TRC Blaze",
          ],
        },
        {
          title: "Clothing",
          values: [
            "T-Shirts: Active & Casual",
            "Polos",
            "Jackets",
            "Sweatshirts & Hoodies",
            "Pants",
            "Shorts",
            "Tracksuits",
            "Team Jerseys",
            "Homewear",
            "Thermals & Winterwear",
            "Innerwear",
            "Motorsport",
          ],
        },

        {
          title: "Accessories",
          values: [
            "Caps & Beanies",
            "Backpacks",
            "Bags: Gym & Casual",
            "Socks",
            "Face Masks",
            "Gloves",
            "Sports Equipment",
            "Wallets",
            "Water Bottles",
            "Motorsport",
          ],
        },

        {
          title: "Sports",
          values: [
            "Cricket",
            "Football",
            "Basketball",
            "Running",
            "Training & Gym",
            "Badminton",
            "Golf",
            "Yoga",
          ],
        },

        {
          title: "Motorsport",
          values: [
            "Scuderia Ferrari",
            "BMW M Motorsport",
            "Mercedes AMG Petronas",
            "Porsche Legacy",
          ],
        },
      ],
    },
  ];

  useEffect(() => {
    if(isSearchClicked)return
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setIsVisible(scrollPosition > currentScrollPos || currentScrollPos < 10);
      setScrollPosition(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isSearchClicked, scrollPosition]);

  const handleSearchClick = () => {
    setIsSearchClicked(true);
  };

  return (
    <section
      className={clsx(
        "w-screen top-0 z-50 transition-transform duration-300 fixed ",
        {
          "-translate-y-full": !isVisible ,
          "translate-y-0": isVisible ,
        }
      )}
    >
      <nav className="hidden xl:grid xl:grid-cols-12 px-5 py-5 bg-neutral-900 ">
        <div className="col-span-8 flex gap-10 justify-start items-center">
          {/* Logo */}
          <Image
            src="/puma-logo.svg"
            alt="Brand Logo"
            className="h-12 w-12 text-neutral-200 cursor-pointer"
            onClick={() => router.push("/")}
            width={48}
            height={48}
          />

          {/* Categories */}
          <div className="flex gap-10 justify-start items-center group">
            {links.map(({ text, key }) => (
              <div className="relative" key={key}>
                <Link
                  href={""}
                  className={clsx(
                    "text-white font-semibold relative flex flex-col text-nowrap",
                    {
                      "group-hover:text-white/50":
                        hoveredLink.toLowerCase() !== key.toLowerCase(),
                    }
                  )}
                  onMouseEnter={() => setHoveredLink(key)}
                  onMouseLeave={() => setHoveredLink("")}
                >
                  {text}
                  {hoveredLink.toLowerCase() === key.toLowerCase() && (
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-yellow-400 transition-all"></span>
                  )}
                </Link>
                <span
                  className="absolute top-0 h-14 w-full"
                  onMouseEnter={() => setHoveredLink(key)}
                  onMouseLeave={() => setHoveredLink("")}
                ></span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-1"></div>
        <div className="col-span-3 flex gap-6 justify-end items-center">
          {/* search */}
          <Button
            variant={"ghost"}
            className="text-white xl:hidden flex gap-3 justify-between rounded-lg border-[1px] border-gray-500 hover:border-gray-400 shadow-xs shadow-white px-6
             hover:bg-neutral-900"
          >
            <Search color="white" width={18} height={18} />
            <p className="">Search</p>
          </Button>

          <Search
            color="white"
            width={40}
            height={40}
            className={clsx(
              "hover:rounded-full hover:bg-neutral-500 px-2 cursor-pointer text-white hidden xl:block ",
              {
                "absolute h-full w-full left-0 top-0 right-10 bg-black xl:hidden transition-all duration-300":
                  isSearchClicked,
              }
            )}
            onClick={handleSearchClick}
          />

          <SearchBar
          setIsSearchClicked={setIsSearchClicked}
            className={{
              "absolute h-full w-full left-0 top-0 right-10 bg-black transition-all duration-300 z-20":
                isSearchClicked,
              hidden: !isSearchClicked,
            }}
          />

          <Heart
            color="white"
            width={40}
            height={40}
            className="hover:rounded-full hover:bg-neutral-500 px-2 cursor-pointer"
            onClick={() => router.push("/dashboard/cart")}
          />
          <ShoppingCart
            color="white"
            width={40}
            height={40}
            className="hover:rounded-full hover:bg-neutral-500 px-2 cursor-pointer"
            onClick={() => router.push("/dashboard/wishlist")}
          />

          <UserDropDown />
        </div>
      </nav>

      <MobileNavbar links={links} navLinksDropDown={navLinksDropDown} isSearchClicked={isSearchClicked} setIsSearchClicked={setIsSearchClicked} />

      {navLinksDropDown?.map(
        (item) =>
          hoveredLink.toLowerCase() === item.category.toLowerCase() && (
            <div
              key={item?.category}
              className=" overflow-scroll scroll-smooth flex justify-start items-start gap-28 py-10 px-5 absolute text-white max-h-[80vh]  w-full z-20 bg-[#ffffff]"
              onMouseEnter={() => {
                setHoveredLink(item?.category);
              }}
              onMouseLeave={() => {
                setHoveredLink("");
              }}
            >
              <div className=" col-span-3">
                <ul className=" flex flex-col gap-3 justify-center items-start">
                  {item?.leftSide?.map((leftSideItem) => (
                    <li
                      key={leftSideItem}
                      className=" cursor-pointer text-nowrap font-bold hover:text-[#8a7350] text-[#6b5b42]"
                    >
                      {leftSideItem}
                    </li>
                  ))}
                </ul>
              </div>
              <div className=" flex gap-24 col-span-9  cursor-pointer  ">
                {item?.rightSide?.map((rightSideItem) => (
                  <div
                    key={rightSideItem?.title}
                    className=" flex flex-col justify-start items-start gap-2"
                  >
                    {!rightSideItem?.isSubSection ? (
                      <div className=" flex flex-col justify-start items-start gap-2">
                        {rightSideItem?.title && (
                          <h1 className="w-full text-nowrap font-semibold text-xl text-black hover:text-[#8a7350] border-b-2 border-black">
                            {rightSideItem?.title.toString()}
                          </h1>
                        )}
                        <ul className="flex flex-col justify-start items-start gap-3">
                          {rightSideItem?.values?.map((rightSideItemValues) => (
                            <li
                              key={rightSideItemValues}
                              className="text-base text-nowrap hover:text-[#1e170d] text-[#6b5b42]"
                            >
                              {rightSideItemValues.toString()}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className=" flex flex-col justify-start items-start gap-2">
                        {rightSideItem?.title && (
                          <h1 className=" text-nowrap w-full font-semibold text-xl text-black hover:text-[#8a7350] border-b-2 border-black">
                            {rightSideItem?.title.toString()}
                          </h1>
                        )}
                        <ul className="flex flex-col justify-start items-start gap-3">
                          {rightSideItem?.values?.map((rightSideItemValues) => (
                            <li key={rightSideItemValues} className="text-base">
                              <h1 className="w-full  cursor-pointer font-bold hover:text-[#8a7350] text-[#6b5b42]">
                                {rightSideItemValues?.title}
                              </h1>
                              {rightSideItemValues?.values.map(
                                (rightSideItemValuesSubSection) => (
                                  <p
                                    key={rightSideItemValuesSubSection}
                                    className=" ml-10  hover:text-[#1e170d] text-[#6b5b42]"
                                  >
                                    {rightSideItemValuesSubSection}
                                  </p>
                                )
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
      )}
      <span
        className={clsx(
          "absolute w-screen h-screen bg-white/30 backdrop-blur-sm top-0 left-0",
          {
            hidden: !isSearchClicked,
          }
        )}
        onClick={() => setIsSearchClicked(false)}
      ></span>
    </section>
  );
};

export default Navbar;
