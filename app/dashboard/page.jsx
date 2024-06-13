"use client";

import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import { TypographyH3, TypographyP, server } from "@/lib/utils";
import clsx from "clsx";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { useRouter } from "next/navigation";

const ProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address"),
  address: z.string().optional(),
});

const UserProfile = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();
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

  const handleDeleteProfile = async () => {
    try {
      const { data } = await axios.delete(`${server}/auth/user/delete`, {
        withCredentials: true,
      });
      if (data?.success) {
        setUser(null);
        router.push("/");

        toast({
          title: "User deleted successfully",
          variant: "success",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <Loader />;
  }

  const checkDataIsEmpty = (data) => (data ? data : "N/A");

  const watchedFields = watch();

  return (
    <div className="px-5 py-5 md:px-20 md:py-10 flex justify-center items-center fixed -mt-10  h-screen">
      <div className="p-4  grid grid-cols-1 md:grid-cols-8 gap-4 md:gap-8 justify-center items-center ">
        {/* give background blur */}
        <div className="col-span-1 relative md:col-span-2 flex flex-col gap-6 justify-center items-center p-4 md:p-8     rounded-lg shadow-black shadow-sm ">
          <div className=" absolute backdrop-blur-sm blur-md bg-white/30 h-full w-full ">
            {" "}
          </div>
          <div className="relative rounded-full">
            <img
              src={user?.avatar?.url}
              className="rounded-full h-40 w-40 md:h-56 md:w-56 hover:opacity-95 shadow-md hover:scale-105 transition-all"
            />
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Edit className="absolute top-0 left-0 cursor-pointer text-gray-500 hover:text-gray-700" />
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
                            className="w-full   rounded-md"
                            style={{
                              height: '300px',
                            }}
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
            className={`w-full z-20 shadow-md ${
              editMode ? "bg-blue-500" : "bg-gray-500"
            }`}
            onClick={handleEditClick}
          >
            Edit profile
          </Button>
          <Button className="w-full shadow-md z-20 bg-blue-500">
            Reset password
          </Button>
          <Button className="w-full shadow-md z-20 bg-blue-500">
            Forget password
          </Button>
          <Button
            variant="destructive"
            className="w-full z-20 shadow-md bg-red-500"
          >
            <Dialog>
              <DialogTrigger>Delete my profile</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Are you sure you want to delete your account
                  </DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDeleteProfile}
                  >
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Button>
        </div>

        {/* give background blur */}

        <div className="col-span-1 relative md:col-span-6 flex flex-col gap-6 p-4 md:p-8   rounded-lg shadow-black shadow-sm  h-full">
          <div className=" absolute backdrop-blur-sm top-0 left-0 blur-md bg-white/30 h-full w-full rounded-lg">
            {" "}
          </div>
          {editMode ? (
            <form
              onSubmit={handleSubmit(handleUpdateProfile)}
              className="flex flex-col gap-6 justify-cente z-20"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col">
                  <label
                    htmlFor="firstName"
                    className="text-lg font-bold mb-2 text-gray-700"
                  >
                    First Name
                  </label>
                  <input
                    {...register("firstName")}
                    id="firstName"
                    className="p-3 input input-bordered w-full border border-transparent rounded-lg focus:border-blue-500 focus:ring-blue-500 transition duration-150 ease-in-out shadow-sm"
                    placeholder="First Name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="lastName"
                    className="text-lg font-bold mb-2 text-gray-700"
                  >
                    Last Name
                  </label>
                  <input
                    {...register("lastName")}
                    id="lastName"
                    className="p-3 input input-bordered w-full border border-transparent rounded-lg focus:border-blue-500 focus:ring-blue-500 transition duration-150 ease-in-out shadow-sm"
                    placeholder="Last Name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="phone"
                    className="text-lg font-bold mb-2 text-gray-700"
                  >
                    Phone Number
                  </label>
                  <input
                    {...register("phone")}
                    id="phone"
                    className="p-3 input input-bordered w-full border border-transparent rounded-lg focus:border-blue-500 focus:ring-blue-500 transition duration-150 ease-in-out shadow-sm"
                    placeholder="Phone Number"
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="email"
                    className="text-lg font-bold mb-2 text-gray-700"
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
                    <p className="text-red-500 text-sm mt-2">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2 flex flex-col">
                  <label
                    htmlFor="address"
                    className="text-lg font-bold mb-2 text-gray-700"
                  >
                    Address
                  </label>
                  <input
                    {...register("address")}
                    id="address"
                    className="p-3 input input-bordered w-full border border-transparent rounded-lg focus:border-blue-500 focus:ring-blue-500 transition duration-150 ease-in-out shadow-sm"
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
            <div className=" z-20 w-full flex flex-col gap-6 justify-center p-4">
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
                          className={`cursor-pointer ml-5 ${
                            user?.verified ? "text-green-400" : "text-red-400"
                          }`}
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
                    <span className="cursor-pointer ml-5 font-semibold text-green-400">
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
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
