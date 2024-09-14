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
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { Edit, ShieldBan, Trash2 } from "lucide-react";
import useAuthStore from "@/stores/useAuthStore";
import imageCompression from "browser-image-compression";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/date-picker";
import CustomTooltip from "@/components/custom-tooltip";

const ProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z
    .string()
    .optional()
    .refine((value) => !value || /^\d{10}$/.test(value), {
      message: "Phone number must be 10 digits",
    }),
  email: z.string().email("Invalid email address"),
  address: z
    .array(
      z.object({
        _id: z.string().optional(), // Mark _id as optional if it's not required during form creation
        street: z.string().min(1, "Street is required"),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        postalCode: z.string().min(1, "Postal Code is required"),
        country: z.string().min(1, "Country is required"),
      })
    )
    .optional(),
  dateOfBirth: z.string().refine((value) => new Date(value) < new Date(), {
    message: "Date of birth must be in the past",
  }),
});

const UpdatePasswordSchema = z.object({
  oldPassword: z.string().min(8, "Old password is required"),
  newPassword: z.string().min(8, "New password is required"),
  confirmPassword: z.string().min(8, "Confirm password is required"),
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
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      phone: user?.phone,
      email: user?.email,
      address: user?.address || [
        {
          _id: "",
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        },
      ],

      dateOfBirth: user?.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().slice(0, 10)
        : "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "address", // This maps to the `address` field in the schema
  });

  const {
    register: registerupdatePassword,
    handleSubmit: handleSubmitupdatePassword,
    formState: { errors: errorsupdatePassword, isDirty: isDirtyupdatePassword },
    reset: updatePassword,
    watch: watchupdatePassword,
  } = useForm({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
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
    try {
      const { data } = await axios.post(
        `${server}/auth/user/update`, // Adjust the server URL if needed
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          shippingAddress: formData.shippingAddress,
          billingAddress: formData.billingAddress,
          dateOfBirth: formData.dateOfBirth,
        },
        {
          withCredentials: true,
        }
      );

      if (data?.success) {
        console.log(data?.user);
        toast({
          variant: "success",
          title: "Profile updated successfully",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error while updating profile",
        description: error?.response?.data?.message || "Something went wrong",
      });
    }
  };

  const updatePasswordHandler = async (formData) => {
    try {
      const { data } = await axios.put(
        `${server}/auth/user/password/update`,
        formData,
        {
          withCredentials: true,
        }
      );
      if (data?.success) {
        setUser(data?.user);
        toast({
          variant: "success",
          title: "Password updated successfully",
        });
      }
      updatePassword();
    } catch (error) {
      toast({
        variant: "destructive",
        title: error?.response?.data?.message,
      });
      updatePassword();
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
      if (user?.verified === false) {
        toast({
          variant: "destructive",
          title: "Only verified users can update profile image.",
        });
        return;
      }
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
        setUser(data?.user);

        toast({
          variant: "success",
          title: "Profile picture updated successfully",
        });
      }
      setEditMode(false);
      setOpen(false); // Close the dialog after submitting
    } catch (error) {
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
      toast({
        title: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const forgetPasswordHandler = async (email) => {
    try {
      const { data } = await axios.post(
        `${server}/auth/user/password/forgot`,
        { email },
        {
          withCredentials: true,
        }
      );
      if (data?.success) {
        toast({
          title: "Reset Link has been sent to your email",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to send password reset link",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <Loader />;
  }

  const checkDataIsEmpty = (data) => (data ? data : "N/A");

  return (
    <>
      {user ? (
        <div className="  flex justify-center items-start  w-full  h-full">
          <div className="p-4  grid grid-cols-1 md:grid-cols-8 gap-4 md:gap-8 justify-center items-center w-full h-full">
            <div className="col-span-1 relative flex flex-col gap-6 justify-center items-center md:col-span-2  p-2 px-4 rounded-lg shadow-black shadow-sm w-full h-full">
              <div className=" absolute backdrop-blur-sm blur-md bg-white/30 h-full w-full ">
                {" "}
              </div>
              <div className="relative rounded-full">
                <img
                  src={user?.avatar?.url}
                  className="rounded-full h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 lg:h-56 lg:w-56 hover:opacity-95 shadow-md hover:scale-105 transition-all"
                  alt="User Avatar"
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
                                className="w-full rounded-md"
                                style={{ height: "auto", maxHeight: "300px" }}
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
                className="w-full shadow-md z-20 bg-blue-500"
                onClick={() => forgetPasswordHandler(user?.email)}
              >
                Forget password
              </Button>

              <Dialog>
                <DialogTrigger asChild className="z-20 w-full">
                  <Button className="w-full shadow-md z-20 bg-blue-500">
                    Update password
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Password</DialogTitle>
                    <DialogDescription>
                      <form
                        className="flex justify-center items-center flex-col p-5 gap-8"
                        onSubmit={handleSubmitupdatePassword(
                          updatePasswordHandler
                        )}
                      >
                        <div className="grid w-full max-w-sm items-center gap-2">
                          <Label htmlFor="password">Old Password</Label>
                          <Input
                            type="password"
                            placeholder="Old Password"
                            {...registerupdatePassword("oldPassword")}
                          />
                          {errorsupdatePassword.oldPassword && (
                            <p className="text-red-500 text-sm mt-2">
                              {errorsupdatePassword.oldPassword.message}
                            </p>
                          )}
                        </div>

                        <div className="grid w-full max-w-sm items-center gap-2">
                          <Label htmlFor="password">New Password</Label>
                          <Input
                            type="password"
                            placeholder="New Password"
                            {...registerupdatePassword("newPassword")}
                          />
                          {errorsupdatePassword.newPassword && (
                            <p className="text-red-500 text-sm mt-2">
                              {errorsupdatePassword.newPassword.message}
                            </p>
                          )}
                        </div>

                        <div className="grid w-full max-w-sm items-center gap-2">
                          <Label htmlFor="password">Confirm Password</Label>
                          <Input
                            type="password"
                            placeholder="Confirm Password"
                            {...registerupdatePassword("confirmPassword")}
                          />
                          {errorsupdatePassword.confirmPassword && (
                            <p className="text-red-500 text-sm mt-2">
                              {errorsupdatePassword.confirmPassword.message}
                            </p>
                          )}
                        </div>

                        <Button
                          type="submit"
                          className=""
                          disabled={!isDirtyupdatePassword}
                        >
                          Update Password
                        </Button>
                      </form>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild className="z-20 w-full">
                  <Button
                    variant="destructive"
                    className="w-full z-20 shadow-md bg-red-500"
                  >
                    Delete my profile
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Are you sure you want to delete your account?
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
            </div>

            <div className="col-span-1 relative md:col-span-6 flex flex-col gap-6 rounded-lg shadow-black shadow-sm  h-full w-full md:overflow-auto">
              <div className="container mx-auto px-4 flex flex-col gap-5">
                {/* Sticky Profile Heading */}
                <TypographyH3 className=" relative md:sticky top-0 bg-white w-full z-10 py-3">
                  Your Profile
                </TypographyH3>

                <form
                  onSubmit={handleSubmit(handleUpdateProfile)}
                  className="space-y-4"
                >
                  <div className="lg:grid flex flex-col   lg:grid-cols-2 gap-4 my-2">
                    {/* First Name */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        {...register("firstName", { required: true })}
                      />
                      {errors.firstName && (
                        <span className="text-sm text-red-500">
                          *{errors.firstName.message}
                        </span>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        {...register("lastName", { required: true })}
                      />
                      {errors.lastName && (
                        <span className="text-sm text-red-500">
                          *{errors.lastName.message}
                        </span>
                      )}
                    </div>

                    {/* D.O.B */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="dateOfBirth">D.O.B</Label>
                      <DatePicker
                        value={watch("dateOfBirth")}
                        onChange={(date) => {
                          const localDate = new Date(
                            date.getTime() - date.getTimezoneOffset() * 60000
                          )
                            .toISOString()
                            .slice(0, 10);
                          setValue("dateOfBirth", localDate);
                        }}
                      />
                      {errors.dateOfBirth && (
                        <span className="text-sm text-red-500">
                          *{errors.dateOfBirth.message}
                        </span>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" {...register("phone")} />
                      {errors.phone && (
                        <span className="text-sm text-red-500">
                          *{errors.phone.message}
                        </span>
                      )}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        {...register("email", { required: true })}
                      />
                      {errors.email && (
                        <span className="text-sm text-red-500">
                          *{errors.email.message}
                        </span>
                      )}
                    </div>

                    {/* Dynamic Address Fields */}
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex flex-col gap-2 md:col-span-2 mb-3 border p-4 rounded-lg"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-base text-nowrap font-semibold">
                            Address {index + 1}
                          </h3>
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => remove(index)}
                            className="ml-4"
                            size="icon"
                          >
                            <CustomTooltip content={"Remove Address"}>
                              <Trash2 />
                            </CustomTooltip>
                          </Button>
                        </div>

                        <Label htmlFor={`address.${index}.street`}>
                          Street
                        </Label>
                        <Input
                          id={`address.${index}.street`}
                          {...register(`address.${index}.street`)}
                        />
                        {errors.address?.[index]?.street && (
                          <span className="text-sm text-red-500">
                            *{errors.address[index].street.message}
                          </span>
                        )}

                        <Label htmlFor={`address.${index}.city`}>City</Label>
                        <Input
                          id={`address.${index}.city`}
                          {...register(`address.${index}.city`)}
                        />
                        {errors.address?.[index]?.city && (
                          <span className="text-sm text-red-500">
                            *{errors.address[index].city.message}
                          </span>
                        )}

                        <Label htmlFor={`address.${index}.state`}>State</Label>
                        <Input
                          id={`address.${index}.state`}
                          {...register(`address.${index}.state`)}
                        />
                        {errors.address?.[index]?.state && (
                          <span className="text-sm text-red-500">
                            *{errors.address[index].state.message}
                          </span>
                        )}

                        <Label htmlFor={`address.${index}.postalCode`}>
                          Postal Code
                        </Label>
                        <Input
                          id={`address.${index}.postalCode`}
                          {...register(`address.${index}.postalCode`)}
                        />
                        {errors.address?.[index]?.postalCode && (
                          <span className="text-sm text-red-500">
                            *{errors.address[index].postalCode.message}
                          </span>
                        )}

                        <Label htmlFor={`address.${index}.country`}>
                          Country
                        </Label>
                        <Input
                          id={`address.${index}.country`}
                          {...register(`address.${index}.country`)}
                        />
                        {errors.address?.[index]?.country && (
                          <span className="text-sm text-red-500">
                            *{errors.address[index].country.message}
                          </span>
                        )}
                      </div>
                    ))}

                    <Button
                      type="button"
                      className="flex m-auto col-span-2"
                      onClick={() =>
                        append({
                          street: "",
                          city: "",
                          state: "",
                          postalCode: "",
                          country: "",
                        })
                      }
                    >
                      Add Address
                    </Button>
                  </div>

                  {/* Sticky Update Profile Button for small screens */}
                  <div className=" w-full bottom-0 bg-white p-2 pt-1 z-10 sticky">
                    <Button type="submit" className="w-full">
                      Update Profile
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default UserProfile;
