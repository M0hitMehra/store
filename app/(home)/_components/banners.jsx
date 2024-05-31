import Link from "next/link";
import { Roboto } from "next/font/google";
import clsx from "clsx";
import { Button } from "@/components/ui/button";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

const Banners = () => {
  return (
    <>
      {/* Promotional Banner */}
      <section className="relative w-full  h-[50vh]">
        <Link href={""} className="w-full h-full">
          <img
            src={"/punaBanner.webp"}
            alt="Banner"
            className="w-full h-full object-fit"
          />
        </Link>
        <div className="grid  grid-cols-6 w-full h-full absolute top-0 justify-center items-center ">
          <div className=" col-span-2 md:col-span-3"></div>
          <div className=" col-span-4 md:col-span-3 flex flex-col gap-5 justify-center items-center h-full w-full p-5 md:p-0">
            <div
              className={clsx(
                `flex flex-col gap-1 justify-center items-center text-white ${roboto.className}`
              )}
            >
              <p
                className={`text-lg md:text-2xl xl:text-[2.5rem] font-bold ${roboto.className} text-center`}
              >
                CAN&apos;T WAIT FOR SALE?
              </p>
              <p className="text-sm md:text-lg xl:text-[1.5rem] font-semibold text-center">
                SHOP NOW AT EXTRA OFF ON SELECT STYLES
              </p>
              <p className="text-xs md:text-sm text-gray-300 font-medium text-center">
                Auto-applied at checkout
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                variant={"outline"}
                className={"w-20 md:w-28 uppercase font-bold rounded-sm"}
              >
                FOR HIM
              </Button>
              <Button
                variant={"outline"}
                className={"w-20 md:w-28 uppercase font-bold rounded-sm"}
              >
                FOR HER
              </Button>
              <Button
                variant={"outline"}
                className={"w-20 md:w-28 uppercase font-bold rounded-sm"}
              >
                FOR KIDS
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Discount Banners -1 */}
      <section className="flex flex-col justify-center items-center w-full h-full">
        <div className="py-8 flex flex-col justify-center items-center gap-2">
          <h1 className="font-bold text-2xl md:text-3xl">ROARING DEALS</h1>
          <h3 className="font-semibold text-lg md:text-xl">
            EXTRA 25% OFF ON EVERYTHING*
          </h3>
          <h5 className="font-medium text-sm md:text-md">
            Auto-applied at checkout
          </h5>
          <p className="text-xs md:text-sm">*Exclusions apply</p>
        </div>
        <div className="relative w-full min-h-[20rem] grid grid-cols-6">
          <img
            src="/pumaBanner2.webp"
            alt="Banner"
            className="z-10 absolute w-full h-full object-fit"
          />
          <div className="col-span-6 md:col-span-3 z-20 w-full h-full flex flex-col justify-center items-center gap-5 md:gap-10 p-5 md:p-0">
            <div className="flex flex-col justify-center items-center text-white gap-1 md:gap-2">
              <h1 className="font-bold text-2xl md:text-[35px]">
                FLAT 25% OFF
              </h1>
              <h3 className="font-bold text-lg md:text-[20px]">
                ON LATEST STYLES
              </h3>
              <h5 className="text-xs md:text-sm">Auto-applied at checkout</h5>
            </div>
            <div className="flex flex-wrap gap-3 md:gap-5 justify-center">
              <Button
                variant={"outline"}
                className={"w-20 md:w-28 uppercase font-bold rounded-sm"}
              >
                FOR HIM
              </Button>
              <Button
                variant={"outline"}
                className={"w-20 md:w-28 uppercase font-bold rounded-sm"}
              >
                FOR HER
              </Button>
              <Button
                variant={"outline"}
                className={"w-20 md:w-28 uppercase font-bold rounded-sm"}
              >
                FOR KIDS
              </Button>
            </div>
          </div>
          <div className="col-span-6 md:col-span-3"></div>
        </div>
      </section>

      {/* Discount Banners -2 */}
      <section className="flex flex-col justify-center items-center w-full h-full">
        <div className="py-8 flex flex-col justify-center items-center gap-2">
          <h1 className="font-bold text-2xl md:text-3xl">ROARING DEALS</h1>
          <h3 className="font-semibold text-lg md:text-xl">
            EXTRA 25% OFF ON EVERYTHING*
          </h3>
          <h5 className="font-medium text-sm md:text-md">
            Auto-applied at checkout
          </h5>
          <p className="text-xs md:text-sm">*Exclusions apply</p>
        </div>
        <div className="relative w-full min-h-[20rem] grid grid-cols-6">
          <img
            src="/pumaBanner2.webp"
            alt="Banner"
            className="z-10 absolute w-full h-full object-fit scale-x-[-1]"
          />
          <div className="col-span-6 md:col-span-3 z-20 w-full h-full flex flex-col justify-center items-center gap-5 md:gap-10 p-5 md:p-0 order-2 md:order-1">
            <div className="flex flex-col justify-center items-center text-white gap-1 md:gap-2">
              <h1 className="font-bold text-2xl md:text-[35px]">
                FLAT 25% OFF
              </h1>
              <h3 className="font-bold text-lg md:text-[20px]">
                ON LATEST STYLES
              </h3>
              <h5 className="text-xs md:text-sm">Auto-applied at checkout</h5>
            </div>
            <div className="flex flex-wrap gap-3 md:gap-5 justify-center order-1 md:order-2">
              <Button
                variant={"outline"}
                className={"w-20 md:w-28 uppercase font-bold rounded-sm"}
              >
                FOR HIM
              </Button>
              <Button
                variant={"outline"}
                className={"w-20 md:w-28 uppercase font-bold rounded-sm"}
              >
                FOR HER
              </Button>
              <Button
                variant={"outline"}
                className={"w-20 md:w-28 uppercase font-bold rounded-sm"}
              >
                FOR KIDS
              </Button>
            </div>
          </div>
          <div className="col-span-6 md:col-span-3 order-1 md:order-2"></div>
        </div>
      </section>
    </>
  );
};

export default Banners;
