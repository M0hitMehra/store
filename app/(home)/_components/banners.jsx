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
      <section className=" relative ">
        <Link href={""} className=" w-full h-full">
          <img src={"/punaBanner.webp"} alt="Banner" />
        </Link>
        <div className="grid grid-cols-6 w-full h-full absolute top-0 justify-center items-center">
          <div className=" col-span-3"></div>
          <div className=" col-span-3 flex flex-col gap-5 justify-center items-center">
            <div
              className={clsx(
                `flex flex-col gap-1 justify-center items-center text-white ${roboto.className}`
              )}
            >
              <p className={`text-[2.5rem] font-bold ${roboto.className}`}>
                CAN'T WAIT FOR SALE?
              </p>
              <p className=" text-[1.5rem] font-semibold">
                SHOP NOW AT EXTRA OFF ON SELECT STYLES
              </p>
              <p className=" text-sm text-gray-300 font-medium">
                Auto-applied at checkout
              </p>
            </div>
            <div className=" flex gap-5">
              <Button
                variant={"outline"}
                className={" w-28 uppercase font-bold rounded-sm"}
              >
                FOR HIM
              </Button>{" "}
              <Button
                variant={"outline"}
                className={" w-28 uppercase font-bold rounded-sm"}
              >
                FOR HER
              </Button>{" "}
              <Button
                variant={"outline"}
                className={" w-28 uppercase font-bold rounded-sm"}
              >
                FOR KIDS
              </Button>{" "}
            </div>
          </div>
        </div>
      </section>

      {/* Discount Banners -1 */}
      <section className=" flex flex-col justify-center items-center w-full h-full">
        <div className="py-8 flex flex-col justify-center items-center gap-2">
          <h1 className=" font-bold text-3xl">ROARING DEALS</h1>
          <h3 className=" font-semibold text-xl">
            EXTRA 25% OFF ON EVERYTHING*
          </h3>
          <h5 className=" font-medium text-md">Auto-applied at checkout</h5>
          <p className="text-sm">*Exclusions apply</p>
        </div>
        <div className=" grid grid-cols-6 relative w-full min-h-[30rem] ">
          <img
            src="/pumaBanner2.webp"
            alt="Banner"
            className=" z-10 absolute w-full h-full"
          />
          <div className="col-span-3 z-20 w-full h-full flex justify-center items-center flex-col gap-10 ">
            <div className=" flex justify-center items-center flex-col text-white gap-1">
              <h1 className=" font-bold text-[35px]">FLAT 25% OFF</h1>
              <h3 className=" font-bold text-[20px]">ON LATEST STYLES</h3>
              <h5 className=" text-sm">Auto-applied at checkout</h5>
            </div>
            <div className=" flex gap-5">
              <Button
                variant={"outline"}
                className={" w-28 uppercase font-bold rounded-sm"}
              >
                FOR HIM
              </Button>{" "}
              <Button
                variant={"outline"}
                className={" w-28 uppercase font-bold rounded-sm"}
              >
                FOR HER
              </Button>{" "}
              <Button
                variant={"outline"}
                className={" w-28 uppercase font-bold rounded-sm"}
              >
                FOR KIDS
              </Button>{" "}
            </div>
          </div>
          <div className="col-span-3"></div>
        </div>
      </section>

      {/* Discount Banners -2 */}
      <section className=" flex flex-col justify-center items-center w-full h-full">
        <div className="py-8 flex flex-col justify-center items-center gap-2">
          <h1 className=" font-bold text-3xl">ROARING DEALS</h1>
          <h3 className=" font-semibold text-xl">
            EXTRA 25% OFF ON EVERYTHING*
          </h3>
          <h5 className=" font-medium text-md">Auto-applied at checkout</h5>
          <p className="text-sm">*Exclusions apply</p>
        </div>
        <div className=" grid grid-cols-6 relative w-full min-h-[30rem] ">
          <img
            src="/pumaBanner2.webp"
            alt="Banner"
            className=" z-10 absolute w-full h-full scale-x-[-1]"
          />
          <div className="col-span-3 z-20 w-full h-full flex justify-center items-center flex-col gap-10 order-2">
            <div className=" flex justify-center items-center flex-col text-white gap-1">
              <h1 className=" font-bold text-[35px]">FLAT 25% OFF</h1>
              <h3 className=" font-bold text-[20px]">ON LATEST STYLES</h3>
              <h5 className=" text-sm">Auto-applied at checkout</h5>
            </div>
            <div className=" flex gap-5 order-1">
              <Button
                variant={"outline"}
                className={" w-28 uppercase font-bold rounded-sm"}
              >
                FOR HIM
              </Button>{" "}
              <Button
                variant={"outline"}
                className={" w-28 uppercase font-bold rounded-sm"}
              >
                FOR HER
              </Button>{" "}
              <Button
                variant={"outline"}
                className={" w-28 uppercase font-bold rounded-sm"}
              >
                FOR KIDS
              </Button>{" "}
            </div>
          </div>
          <div className="col-span-3"></div>
        </div>
      </section>
    </>
  );
};

export default Banners;
