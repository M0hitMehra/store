"use client";

import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import { TypographyH3, TypographyP, server } from "@/lib/utils";
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
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { Edit } from "lucide-react";

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
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
    }
  };

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

  const handleUpdateProfile = async (e, formData) => {
    e.preventDefault();
    // Implement the logic to update the user profile
    try {
      const { data } = await axios.post(
        `${server}/auth/user/update`,
        formData,
        {
          withCredentials: true,
        }
      );
      if (data?.success) {
        toast({
          variant: "success",
          title: "Profile updated successfully",
        });
      }
      setEditMode(false);
      setOpen(false); // Close the dialog after submitting
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error while updating user profile",
      });
      setOpen(false); // Close the dialog after submitting
    }
  };

  if (loading) {
    return <Loader />;
  }

  const checkDataIsEmpty = (data) => (data ? data : "N/A");

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-8 gap-4 md:gap-8">
      <div className="col-span-1 md:col-span-2 flex flex-col gap-6 justify-center items-center p-4 md:p-8">
        <div className=" relative rounded-full">
          <img
            src={user?.avatar?.url}
            className="rounded-full h-40 w-40 md:h-[250px] md:w-[300px] hover:opacity-95 hover:scale-105 transition-all"
          />

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Edit className="absolute top-0 left-0 cursor-pointer" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select an image to upload</DialogTitle>
                <DialogDescription>
                  <form onSubmit={handleUpdateProfile}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload image
                      </label>
                      <div className="relative flex items-center justify-center">
                        <input
                          type="file"
                          name="profileImage"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex items-center justify-center w-full py-2 px-3 border border-dashed border-gray-300 rounded-md shadow-sm text-sm text-gray-500 bg-white hover:bg-gray-50">
                          <svg
                            className="w-6 h-6 text-gray-400 mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 16V4a2 2 0 012-2h6a2 2 0 012 2v12m-4 4h-4a2 2 0 01-2-2v-2h8v2a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span>Click to upload or drag and drop</span>
                        </div>
                      </div>
                    </div>
                    {selectedImage && (
                      <div className="mb-4">
                        <img
                          src={selectedImage}
                          alt="Selected Preview"
                          className="w-full h-auto rounded-md"
                        />
                      </div>
                    )}
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Submit
                    </button>
                  </form>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
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
              <CustomTooltip
                description={"You cannot change email address"}
                side="right"
              >
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
