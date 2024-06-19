import React from "react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import axios from "axios";
import { toast } from "../../../components/ui/use-toast";
import useAuthStore from "@/stores/useAuthStore";
import { server } from "@/lib/utils";
import clsx from "clsx";
import { usePathname } from "next/navigation";

const DashboardSidebar = () => {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const pathname = usePathname();

  const setUser = useAuthStore((state) => state.setUser);
  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/auth/logout`, {
        withCredentials: true,
      });
      if (data?.success) {
        setUser(null);
        router.push("/");
        toast({
          title: "Logged out successfully",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const links = [
    { href: "/dashboard", label: "My Profile" },
    { href: "/dashboard/orders", label: "Orders" },
    { href: "/dashboard/recently-visited", label: "Recently Visited" },
    { href: "/dashboard/wishlist", label: "Wishlist" },
    { href: "/dashboard/contact", label: "Contact Us (Helpline)" },
  ];

  return (
    <>
      <div className="fixed  hidden md:block h-screen w-1/6 border-r-2 border-black p-4 bg-gradient-to-r from-slate-500 to-slate-800 shadow-lg shadow-black">
        <ul className="space-y-4">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} legacyBehavior>
                <a
                  className={clsx(
                    "block p-2 hover:bg-gray-300 rounded  hover:text-black",
                    {
                      "bg-neutral-100 text-gray-900 hover:bg-neutral-100 rounded hover:text-gray-900":
                        pathname === href,
                    },
                    {
                      "text-neutral-200": pathname !== href,
                    }
                  )}
                >
                  {label}
                </a>
              </Link>
            </li>
          ))}
          <li>
            <Button
              variant={"destructive"}
              className="block p-2 w-full rounded   "
              onClick={logoutHandler}
            >
              Logout
            </Button>
          </li>
        </ul>
      </div>

      {/* Top bar for small devices */}
      <div className="fixed md:hidden block py-2 px-4 bg-white shadow-lg z-50 w-full overflow-x-auto dashboard-top-bar">
        <ul className="flex gap-4">
          {links.map(({ href, label }) => (
            <li key={href} className="flex-shrink-0">
              <Link href={href} legacyBehavior>
                <a className="block rounded-lg hover:bg-gray-300 bg-gray-100 p-2 text-sm text-gray-700 whitespace-nowrap">
                  {label}
                </a>
              </Link>
            </li>
          ))}
          <li className="flex-shrink-0">
            <Button
              variant={"destructive"}
              className="block rounded-lg p-2 text-sm whitespace-nowrap"
              onClick={logoutHandler}
            >
              Logout
            </Button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default DashboardSidebar;
