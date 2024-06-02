"use client";

import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import { TypographyH3, TypographyP } from "@/lib/utils";
import clsx from "clsx";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InputOTPForm } from "@/components/input-otp";

const UserProfile = () => {
  const { user, loading } = useProtectedRoute();

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-8 gap-4 md:gap-8">
      <div className="col-span-1 md:col-span-2 flex flex-col gap-6 justify-center items-center p-4 md:p-8">
        <img
          src="https://assetsio.gnwcdn.com/batman-arkham-knight-canned-sequel-apparently-shown-via-concept-art-1636459291569.jpg?width=1200&height=900&fit=crop&quality=100&format=png&enable=upscale&auto=webp"
          alt="Profile picture"
          className="rounded-full h-40 w-40 md:h-[250px] md:w-[300px] hover:opacity-95 hover:scale-105 transition-all"
        />
        <Button className="w-full">Edit profile</Button>
        <Button className="w-full">Reset password</Button>
        <Button className="w-full">Forget password</Button>
        <Button variant="destructive" className="w-full">
          Delete my profile
        </Button>
      </div>
      <div className="col-span-1 md:col-span-6 p-4 md:p-10 flex flex-col gap-6 md:gap-10 justify-center">
        <div className="flex flex-col md:flex-row gap-4 md:gap-5 justify-start items-start md:items-center">
          <div>
            <TypographyH3>First Name</TypographyH3>
            <TypographyP>{user?.firstName}</TypographyP>
          </div>
          <div>
            <TypographyH3>Last Name</TypographyH3>
            <TypographyP>{user?.lastName}</TypographyP>
          </div>
        </div>
        <div>
          <TypographyH3>Phone Number</TypographyH3>
          <TypographyP>{user?.phone}</TypographyP>
        </div>
        <div>
          <TypographyH3>Email</TypographyH3>
          <TypographyP>
            {user?.email}

            {user?.verified ===false ? (
              <Dialog>
                <DialogTrigger>
                  {" "}
                  <span
                    className={clsx(
                      " cursor-pointer ml-5",
                      { "text-red-400": user?.verified === false },
                      { "text-green-400": user?.verified === true }
                    )}
                  >
                    {user?.verified ? "" : "Not Verified"}
                  </span>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Enter otp sent to your email address for verification?
                    </DialogTitle>
                    <DialogDescription>
                      <InputOTPForm />
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            ) : (
              <span
                className={clsx(" cursor-pointer ml-5 font-semibold", {
                  "text-green-400": user?.verified === true,
                })}
              >
                Verified
              </span>
            )}
          </TypographyP>
        </div>
        <div>
          <TypographyH3>Address</TypographyH3>
          <TypographyP>{user?.address}</TypographyP>
        </div>
        <div>
          <TypographyH3>Joined on</TypographyH3>
          <TypographyP>{Date(user?.createdAt)}</TypographyP>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
