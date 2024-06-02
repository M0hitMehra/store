import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "./ui/use-toast";
import useAuthStore from "@/stores/useAuthStore";
import { server } from "@/lib/utils";

const DashboardSidebar = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

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
  return (
    <div className="fixed h-screen w-1/6 border-r-2 border-black p-4">
      <ul className="space-y-4">
        <li>
          <Link href="/dashboard" legacyBehavior>
            <a className="block p-2 hover:bg-gray-200 rounded">My Profile</a>
          </Link>
        </li>
        <li>
          <Link href="/dashboard/orders" legacyBehavior>
            <a className="block p-2 hover:bg-gray-200 rounded">Orders</a>
          </Link>
        </li>
        <li>
          <Link href="/dashboard/recently-visited" legacyBehavior>
            <a className="block p-2 hover:bg-gray-200 rounded">
              Recently Visited
            </a>
          </Link>
        </li>
        <li>
          <Link href="/dashboard/wishlist" legacyBehavior>
            <a className="block p-2 hover:bg-gray-200 rounded">Wishlist</a>
          </Link>
        </li>
        <li>
          <Link href="/dashboard/contact" legacyBehavior>
            <a className="block p-2 hover:bg-gray-200 rounded">
              Contact Us (Helpline)
            </a>
          </Link>
        </li>
        <li>
          <Button
            variant={"destructive"}
            className="block p-2 w-full rounded"
            onClick={logoutHandler}
          >
            Logout
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default DashboardSidebar;
