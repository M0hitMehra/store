"use client";

import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import { TypographyH3, TypographyP, server } from "@/lib/utils";
import clsx from "clsx";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InputOTPForm } from "@/components/input-otp";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomTooltip from "@/components/custom-tooltip";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { Edit, ShieldBan } from "lucide-react";
import useAuthStore from "@/stores/useAuthStore";
import imageCompression from "browser-image-compression";

const ProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address"),
  address: z.string().optional(),
});

const UserProfile = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const { user, loading } = useProtectedRoute();
  const [editMode, setEditMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
    control,
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

  const handleUpdateProfile = async (formData) => {
    console.log(formData);
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
        setUser(data?.user);
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

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxSizeMB = 5; // Set the max file size limit (in MB)
      if (file.size / 1024 / 1024 > maxSizeMB) {
        toast({
          variant: "destructive",
          title: `File size should be less than ${maxSizeMB} MB`,
        });
        return;
      }

      try {
        const options = {
          maxSizeMB: 1, // Max file size in MB for compression
          maxWidthOrHeight: 1024, // Max width or height
          useWebWorker: true, // Enable web worker for better performance
        };
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(reader.result);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error compressing image:", error);
        toast({
          variant: "destructive",
          title: "Error compressing image",
        });
      }
    } else {
      setSelectedImage(null);
    }
  };

  const handleUpdateProfileImage = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${server}/auth/user/update/image`,
        { image: selectedImage },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (data?.success) {
        toast({
          variant: "success",
          title: "Profile picture updated successfully",
        });
      }
      setEditMode(false);
      setOpen(false); // Close the dialog after submitting
    } catch (error) {
      console.error("Error while updating user profile:", error);
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

  const watchedFields = watch();

  return (
    <div className=" px-20 py-5 flex justify-center items-center ">
      <div className="p-4 grid grid-cols-1 md:grid-cols-8 gap-4 md:gap-8  justify-center items-center   bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg">
        <div className="    col-span-1 md:col-span-2 flex flex-col gap-6 justify-center items-center p-4 md:p-8">
          <div className=" relative rounded-full ">
            <img
              src={user?.avatar?.url}
              className="rounded-full h-40 w-40 md:h-[250px] md:w-[300px] hover:opacity-95 hover:scale-105 transition-all "
            />

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Edit className="absolute top-0 left-0 cursor-pointer" />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select an image to upload</DialogTitle>
                  <DialogDescription>
                    <form
                      onSubmit={(e) =>
                        handleUpdateProfileImage(e, selectedImage)
                      }
                    >
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
        <div className=" col-span-1 shadow-sm rounded-md shadow-white md:col-span-6 p-4 md:p-10 flex flex-col gap-6 md:gap-10 justify-center">
          {editMode ? (
            <form
              onSubmit={handleSubmit(handleUpdateProfile)}
              className=" flex flex-col gap-6 justify-center p-4  "
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col">
                  <label
                    htmlFor="firstName"
                    className="text-lg font-bold mb-2 text-white"
                  >
                    First Name
                  </label>
                  <input
                    {...register("firstName")}
                    id="firstName"
                    className="p-3 input input-bordered w-full border border-transparent rounded-lg focus:border-white focus:ring-white transition duration-150 ease-in-out shadow-sm"
                    placeholder="First Name"
                  />
                  {errors.firstName && (
                    <p className="text-yellow-200 text-sm mt-2">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="lastName"
                    className="text-lg font-bold mb-2 text-white"
                  >
                    Last Name
                  </label>
                  <input
                    {...register("lastName")}
                    id="lastName"
                    className="p-3 input input-bordered w-full border border-transparent rounded-lg focus:border-white focus:ring-white transition duration-150 ease-in-out shadow-sm"
                    placeholder="Last Name"
                  />
                  {errors.lastName && (
                    <p className="text-yellow-200 text-sm mt-2">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="phone"
                    className="text-lg font-bold mb-2 text-white"
                  >
                    Phone Number
                  </label>
                  <input
                    {...register("phone")}
                    id="phone"
                    className="p-3 input input-bordered w-full border border-transparent rounded-lg focus:border-white focus:ring-white transition duration-150 ease-in-out shadow-sm"
                    placeholder="Phone Number"
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="email"
                    className="text-lg font-bold mb-2 text-white"
                  >
                    Email
                  </label>
                  <input
                    {...register("email")}
                    id="email"
                    className="cursor-not-allowed p-3 input input-bordered w-full border border-transparent rounded-lg bg-gray-100"
                    disabled
                    placeholder="Email"
                  />
                  {errors.email && (
                    <p className="text-yellow-200 text-sm mt-2">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2 flex flex-col">
                  <label
                    htmlFor="address"
                    className="text-lg font-bold mb-2 text-white"
                  >
                    Address
                  </label>
                  <input
                    {...register("address")}
                    id="address"
                    className="p-3 input input-bordered w-full border border-transparent rounded-lg focus:border-white focus:ring-white transition duration-150 ease-in-out shadow-sm"
                    placeholder="Address"
                  />
                </div>
              </div>
              <div className="flex gap-6 mt-6 justify-center">
                <button
                  type="submit"
                  disabled={!isDirty}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 transition duration-150 ease-in-out shadow-md transform hover:scale-105"
                >
                  Update Profile
                </button>
                <button
                  type="button"
                  onClick={handleCancelClick}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 active:bg-gray-800 transition duration-150 ease-in-out shadow-md transform hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className=" w-full  flex flex-col gap-6 justify-center p-4 ">
              <div className="grid grid-cols-3 gap-4 items-center ">
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
                            Enter OTP sent to your email address for
                            verification
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
            </div>
          )}
        </div>{" "}
      </div>
    </div>
  );
};

export default UserProfile;
