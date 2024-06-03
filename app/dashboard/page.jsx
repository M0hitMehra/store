"use client";

import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import { TypographyH3, TypographyP } from "@/lib/utils";
import clsx from "clsx";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InputOTPForm } from "@/components/input-otp";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomTooltip from "@/components/custom-tooltip";

const ProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address"),
  address: z.string().optional(),
});

const UserProfile = () => {
  const { user, loading } = useProtectedRoute();
  const [editMode, setEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      phone: user?.phone,
      email: user?.email,
      address: user?.address,
    },
  });

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelClick = () => {
    setEditMode(false);
    reset();
  };

  const handleUpdateProfile = (data) => {
    // Implement the logic to update the user profile
    console.log(data);
    setEditMode(false);
  };

  if (loading) {
    return <Loader />;
  }

  const checkDataIsEmpty = (data) => (data ? data : "N/A");

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-8 gap-4 md:gap-8">
      <div className="col-span-1 md:col-span-2 flex flex-col gap-6 justify-center items-center p-4 md:p-8">
        <img
          src="https://assetsio.gnwcdn.com/batman-arkham-knight-canned-sequel-apparently-shown-via-concept-art-1636459291569.jpg?width=1200&height=900&fit=crop&quality=100&format=png&enable=upscale&auto=webp"
          alt="Profile picture"
          className="rounded-full h-40 w-40 md:h-[250px] md:w-[300px] hover:opacity-95 hover:scale-105 transition-all"
        />
        <Button
          className={clsx("w-full", { "bg-blue-500": editMode })}
          onClick={handleEditClick}
        >
          Edit profile
        </Button>
        <Button className="w-full">Reset password</Button>
        <Button className="w-full">Forget password</Button>
        <Button variant="destructive" className="w-full">
          Delete my profile
        </Button>
      </div>
      <div className="col-span-1 md:col-span-6 p-4 md:p-10 flex flex-col gap-6 md:gap-10 justify-center">
        {editMode ? (
          <form
            onSubmit={handleSubmit(handleUpdateProfile)}
            className="space-y-6 flex flex-col gap-6 md:gap-4 justify-center"
          >
            <div className="grid grid-cols-3 gap-4 items-center">
              <TypographyH3>First Name:</TypographyH3>
              <input
                {...register("firstName")}
                className=" p-2 input input-bordered w-full max-w-xs border-[0.8px] border-neutral-400 rounded-md"
                placeholder="Please enter your First Name"
              />
              {errors.firstName && (
                <p className="text-red-500">{errors.firstName.message}</p>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
              <TypographyH3>Last Name:</TypographyH3>
              <input
                {...register("lastName")}
                className=" p-2 input input-bordered w-full max-w-xs border-[0.8px] border-neutral-400 rounded-md"
                placeholder="Please enter your Last Name"
              />
              {errors.lastName && (
                <p className="text-red-500">{errors.lastName.message}</p>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
              <TypographyH3>Phone Number:</TypographyH3>
              <input
                {...register("phone")}
                className=" p-2 input input-bordered w-full max-w-xs border-[0.8px] border-neutral-400 rounded-md"
                placeholder="Please enter your Phone Number"
              />
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
              <TypographyH3>Email:</TypographyH3>
              <CustomTooltip description={"You cannot change email address"} side = "right">
                <input
                  {...register("email")}
                  className="  cursor-pointer p-2 input input-bordered w-full max-w-xs border-[0.8px] border-neutral-400 rounded-md"
                  disabled
                  placeholder="Please enter your Email"
                />
              </CustomTooltip>
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
              <TypographyH3>Address:</TypographyH3>
              <input
                {...register("address")}
                className=" p-2 input input-bordered w-full max-w-xs border-[0.8px] border-neutral-400 rounded-md"
                placeholder="Please enter your Address"
              />
            </div>
            <div className="flex gap-4">
              <Button type="submit">Update Profile</Button>
              <Button type="button" onClick={handleCancelClick}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 items-center">
              <TypographyH3>First Name:</TypographyH3>
              <TypographyP>{checkDataIsEmpty(user?.firstName)}</TypographyP>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
              <TypographyH3>Last Name:</TypographyH3>
              <TypographyP>{checkDataIsEmpty(user?.lastName)}</TypographyP>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
              <TypographyH3>Phone Number:</TypographyH3>
              <TypographyP>{checkDataIsEmpty(user?.phone)}</TypographyP>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
              <TypographyH3>Email:</TypographyH3>
              <TypographyP>
                {user?.email}
                {user?.verified === false ? (
                  <Dialog>
                    <DialogTrigger>
                      <span
                        className={clsx(
                          "cursor-pointer ml-5",
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
                          Enter OTP sent to your email address for verification
                        </DialogTitle>
                        <DialogDescription>
                          <InputOTPForm />
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <span
                    className={clsx("cursor-pointer ml-5 font-semibold", {
                      "text-green-400": user?.verified === true,
                    })}
                  >
                    Verified
                  </span>
                )}
              </TypographyP>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
              <TypographyH3>Address:</TypographyH3>
              <TypographyP>{checkDataIsEmpty(user?.address)}</TypographyP>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
              <TypographyH3>Joined on:</TypographyH3>
              <TypographyP>
                {new Date(
                  checkDataIsEmpty(user?.createdAt)
                ).toLocaleDateString()}
              </TypographyP>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
