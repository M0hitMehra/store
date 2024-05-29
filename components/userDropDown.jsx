"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import axios from "axios";
import { server } from "@/lib/utils";
import { toast } from "./ui/use-toast";

const UserDropDown = () => {
  const router = useRouter();
  const { user, loading } = useProtectedRoute();

  const logoutHandler = () => {
    const { data } = axios.get(`${server}/auth/logout`, {
      withCredentials: true,
    });
    toast({
      title: "Looged out successfully",
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.pn\g" />
          <AvatarFallback className="bg-transparent">
            {" "}
            <User
              color="white"
              width={40}
              height={40}
              className=" hover:rounded-full hover:bg-neutral-500 px-2 cursor-pointer"
              onClick={() => router.push("/login")}
            />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="px-4 pb-4 pt-1">
        <DropdownMenuLabel className="text-base my-1 font-medium">
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-base my-1 font-medium">
          Wishlist
        </DropdownMenuItem>
        <DropdownMenuItem className="text-base my-1 font-medium">
          Check Order Status
        </DropdownMenuItem>
        <DropdownMenuItem className="text-base my-1 font-medium">
          Store Finder
        </DropdownMenuItem>

        {!user ? (
          <div className=" flex flex-col gap-2 ">
            <DropdownMenuItem className="w-full p-0">
              <Button
                className="w-full p-0"
                onClick={() => {
                  router.push("/login");
                }}
              >
                Login
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem className="w-full p-0">
              <Button
                className="w-full p-0"
                variant={"outline"}
                onClick={() => {
                  router.push("/signup");
                }}
              >
                Register Here
              </Button>
            </DropdownMenuItem>
          </div>
        ) : (
          <DropdownMenuItem className="w-full p-0">
            <Button className="w-full p-0" onClick={logoutHandler}>
              Logout
            </Button>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropDown;
