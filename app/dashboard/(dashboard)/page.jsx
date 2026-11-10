"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import imageCompression from "browser-image-compression";
import {
  User,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Lock,
  Trash2,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Plus,
} from "lucide-react";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import useAuthStore from "@/stores/useAuthStore";
import { server } from "@/lib/utils";
import clsx from "clsx";

const ProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z
    .array(
      z.object({
        _id: z.string().optional(),
        street: z.string().min(1, "Street is required"),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        postalCode: z.string().min(1, "Postal Code is required"),
        country: z.string().min(1, "Country is required"),
      })
    )
    .optional(),
});

const PasswordSchema = z.object({
  oldPassword: z.string().min(8, "Old password must be at least 8 characters"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password must match"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function UserProfilePage() {
  const router = useRouter();
  const { user, loading } = useProtectedRoute();
  const setUser = useAuthStore((state) => state.setUser);

  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "addresses" | "security"
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // OTP Modal
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Avatar Upload
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Form for Profile & Addresses
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      dateOfBirth: "",
      address: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "address",
  });

  // Form for Password Update
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors, isDirty: isPasswordDirty },
  } = useForm({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Sync user data to form
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString().slice(0, 10)
          : "",
        address: user.address || [],
      });
    }
  }, [user, reset]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Handle Profile Update
  const onProfileSubmit = async (formData) => {
    setIsUpdatingProfile(true);
    try {
      const { data } = await axios.post(
        `${server}/auth/user/update`,
        formData,
        { withCredentials: true }
      );
      if (data?.success) {
        setUser(data.user);
        toast({
          variant: "success",
          title: "Profile Updated",
          description: "Your details have been saved successfully.",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: err?.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle Password Update
  const onPasswordSubmit = async (formData) => {
    setIsUpdatingPassword(true);
    try {
      const { data } = await axios.put(
        `${server}/auth/user/password/update`,
        formData,
        { withCredentials: true }
      );
      if (data?.success) {
        toast({
          variant: "success",
          title: "Password Updated",
          description: "Your password was changed successfully.",
        });
        resetPassword();
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error Changing Password",
        description: err?.response?.data?.message || "Failed to update password",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Handle Avatar Image Upload
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!user.verified) {
      toast({
        variant: "destructive",
        title: "Verification Required",
        description: "Please verify your account before uploading an avatar.",
      });
      return;
    }

    try {
      setUploadingAvatar(true);
      const options = {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };
      const compressed = await imageCompression(file, options);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        try {
          const { data } = await axios.post(
            `${server}/auth/user/update/image`,
            { image: base64Image },
            { withCredentials: true }
          );
          if (data?.success) {
            setUser(data.user);
            toast({
              variant: "success",
              title: "Avatar Updated",
              description: "New profile photo saved.",
            });
          }
        } catch (uploadErr) {
          toast({
            variant: "destructive",
            title: "Upload Failed",
            description: uploadErr?.response?.data?.message || "Could not upload image",
          });
        } finally {
          setUploadingAvatar(false);
        }
      };
      reader.readAsDataURL(compressed);
    } catch (err) {
      setUploadingAvatar(false);
      toast({
        variant: "destructive",
        title: "Error processing image",
      });
    }
  };

  // Handle OTP Verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpValue || otpValue.length < 4) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please enter a valid OTP.",
      });
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const { data } = await axios.post(
        `${server}/auth/verify`,
        { otp: Number(otpValue) },
        { withCredentials: true }
      );
      if (data?.success) {
        setUser(data.user);
        toast({
          variant: "success",
          title: "Account Verified!",
          description: "Your email and account are now verified.",
        });
        setIsOtpModalOpen(false);
        setOtpValue("");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: err?.response?.data?.message || "Invalid or expired OTP",
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Handle Delete User Account
  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you absolutely sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeletingAccount(true);
    try {
      const { data } = await axios.delete(`${server}/auth/user/delete`, {
        withCredentials: true,
      });
      if (data?.success) {
        setUser(null);
        toast({
          title: "Account Deleted",
          description: "Your account has been permanently removed.",
        });
        router.push("/");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Could not delete account",
        description: err?.response?.data?.message || "An error occurred",
      });
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-6 border-b border-neutral-200">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-neutral-400">
            Account Management
          </span>
          <h1 className="text-3xl font-black uppercase font-mono tracking-tight text-neutral-900 mt-1">
            Profile & Settings
          </h1>
        </div>
        <p className="text-xs text-neutral-500 font-medium font-mono">
          User ID: {user?._id?.slice(-8)}
        </p>
      </div>

      {/* Verification Alert Banner if unverified */}
      {user && !user.verified && (
        <div className="p-4 sm:p-5 bg-amber-50 border border-amber-200 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-full text-amber-700 flex-shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                Account Unverified
              </p>
              <p className="text-xs text-amber-700">
                Please enter the OTP sent to {user.email} to verify your account
                and enable avatar uploads.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOtpModalOpen(true)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex-shrink-0 shadow-sm"
          >
            Enter OTP Now
          </button>
        </div>
      )}

      {/* Profile Overview Card (Avatar + Names) */}
      <div className="p-6 sm:p-8 bg-white border border-neutral-200 rounded-3xl flex flex-col sm:flex-row items-center gap-6 shadow-xs">
        <div className="relative group">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-neutral-100 border-2 border-neutral-200">
            {user?.avatar?.url ? (
              <Image
                src={user.avatar.url}
                alt="Avatar"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-neutral-950 text-white text-2xl font-black font-mono">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </div>
            )}
            {uploadingAvatar && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs">
                Saving...
              </div>
            )}
          </div>
          <label className="absolute bottom-0 right-0 p-2 bg-neutral-900 text-white rounded-full hover:bg-black cursor-pointer shadow-md transition-transform hover:scale-110">
            <Camera className="w-3.5 h-3.5" />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={uploadingAvatar}
              className="hidden"
            />
          </label>
        </div>

        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-black font-mono text-neutral-900 uppercase">
              {user?.firstName} {user?.lastName}
            </h2>
            {user?.verified ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3 h-3" /> Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <ShieldAlert className="w-3 h-3" /> Unverified
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500">{user?.email}</p>
          <p className="text-xs text-neutral-400">
            Phone: {user?.phone || "Not set"} • Member since{" "}
            {new Date(user?.createdAt || Date.now()).getFullYear()}
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 border-b border-neutral-200 pb-2 overflow-x-auto scrollbar-none">
        {[
          { key: "profile", label: "Personal Information" },
          { key: "addresses", label: `Saved Addresses (${fields.length})` },
          { key: "security", label: "Password & Security" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={clsx(
              "px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all whitespace-nowrap",
              activeTab === tab.key
                ? "bg-neutral-950 text-white shadow-xs"
                : "bg-white text-neutral-600 hover:text-black hover:bg-neutral-100 border border-neutral-200"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Personal Profile */}
      {activeTab === "profile" && (
        <form
          onSubmit={handleSubmit(onProfileSubmit)}
          className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-neutral-700">
                First Name *
              </label>
              <input
                type="text"
                {...register("firstName")}
                className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl mt-1 focus:outline-none focus:border-neutral-500"
              />
              {errors.firstName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-700">
                Last Name *
              </label>
              <input
                type="text"
                {...register("lastName")}
                className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl mt-1 focus:outline-none focus:border-neutral-500"
              />
              {errors.lastName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-700">
                Email Address (Permanent)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full p-3 text-xs bg-neutral-100 border border-neutral-200 rounded-xl mt-1 text-neutral-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-700">
                Phone Number *
              </label>
              <input
                type="tel"
                {...register("phone")}
                className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl mt-1 focus:outline-none focus:border-neutral-500 font-mono"
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-700">
                Date of Birth *
              </label>
              <input
                type="date"
                {...register("dateOfBirth")}
                className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl mt-1 focus:outline-none focus:border-neutral-500"
              />
              {errors.dateOfBirth && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="px-6 py-3 bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-black transition-colors disabled:opacity-50"
            >
              {isUpdatingProfile ? "Saving Details..." : "Save Profile Changes"}
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Addresses */}
      {activeTab === "addresses" && (
        <form
          onSubmit={handleSubmit(onProfileSubmit)}
          className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs"
        >
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-neutral-900">
                Shipping & Delivery Addresses
              </h3>
              <p className="text-xs text-neutral-500">
                Addresses saved here will be available at checkout.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                append({
                  street: "",
                  city: "",
                  state: "",
                  postalCode: "",
                  country: "India",
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Address</span>
            </button>
          </div>

          {fields.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <MapPin className="w-8 h-8 text-neutral-300 mx-auto" />
              <p className="text-xs text-neutral-500">No addresses added yet.</p>
              <button
                type="button"
                onClick={() =>
                  append({
                    street: "",
                    city: "",
                    state: "",
                    postalCode: "",
                    country: "India",
                  })
                }
                className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl"
              >
                Add Your First Address
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-4 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono uppercase text-neutral-700">
                      Address #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-neutral-400 hover:text-red-600 transition-colors"
                      title="Remove Address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-semibold text-neutral-600">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        {...register(`address.${index}.street`)}
                        placeholder="House / Flat / Street"
                        className="w-full p-2.5 text-xs bg-white border border-neutral-200 rounded-xl mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-neutral-600">
                        City *
                      </label>
                      <input
                        type="text"
                        {...register(`address.${index}.city`)}
                        placeholder="City"
                        className="w-full p-2.5 text-xs bg-white border border-neutral-200 rounded-xl mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-neutral-600">
                        State *
                      </label>
                      <input
                        type="text"
                        {...register(`address.${index}.state`)}
                        placeholder="State"
                        className="w-full p-2.5 text-xs bg-white border border-neutral-200 rounded-xl mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-neutral-600">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        {...register(`address.${index}.postalCode`)}
                        placeholder="Postal Code"
                        className="w-full p-2.5 text-xs bg-white border border-neutral-200 rounded-xl mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-neutral-600">
                        Country
                      </label>
                      <input
                        type="text"
                        {...register(`address.${index}.country`)}
                        placeholder="Country"
                        className="w-full p-2.5 text-xs bg-white border border-neutral-200 rounded-xl mt-1"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="px-6 py-3 bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-black transition-colors"
                >
                  {isUpdatingProfile ? "Saving Addresses..." : "Save Addresses"}
                </button>
              </div>
            </div>
          )}
        </form>
      )}

      {/* Tab 3: Security & Password Update */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <form
            onSubmit={handleSubmitPassword(onPasswordSubmit)}
            className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs"
          >
            <div className="space-y-1 pb-2 border-b border-neutral-100">
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-neutral-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-neutral-500" />
                Change Password
              </h3>
              <p className="text-xs text-neutral-500">
                Ensure your account is protected with a secure password of at least 8 characters.
              </p>
            </div>

            <div className="space-y-4 max-w-md">
              <div>
                <label className="text-[11px] font-semibold text-neutral-700">
                  Current Password *
                </label>
                <input
                  type="password"
                  {...registerPassword("oldPassword")}
                  className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl mt-1 focus:outline-none focus:border-neutral-500"
                />
                {passwordErrors.oldPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    {passwordErrors.oldPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-700">
                  New Password *
                </label>
                <input
                  type="password"
                  {...registerPassword("newPassword")}
                  className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl mt-1 focus:outline-none focus:border-neutral-500"
                />
                {passwordErrors.newPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    {passwordErrors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-700">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  {...registerPassword("confirmPassword")}
                  className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl mt-1 focus:outline-none focus:border-neutral-500"
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    {passwordErrors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="px-6 py-3 bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-black transition-colors"
              >
                {isUpdatingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>

          {/* Danger Zone: Delete Account */}
          <div className="bg-red-50/50 border border-red-200 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono">
                Danger Zone
              </h3>
            </div>
            <p className="text-xs text-red-600/80 max-w-lg">
              Once you delete your account, all your saved addresses, cart items,
              and order history references will be permanently removed.
            </p>
            <button
              onClick={handleDeleteAccount}
              disabled={isDeletingAccount}
              className="px-5 py-2.5 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-red-700 transition-colors shadow-sm"
            >
              {isDeletingAccount ? "Deleting..." : "Permanently Delete Account"}
            </button>
          </div>
        </div>
      )}

      {/* OTP Verification Dialog */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-neutral-100">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                Verification
              </span>
              <h3 className="text-xl font-black font-mono uppercase text-neutral-900">
                Enter Email OTP
              </h3>
              <p className="text-xs text-neutral-500">
                Please enter the 6-digit one-time password sent to {user?.email}.
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="e.g. 123456"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                  className="w-full text-center tracking-[0.5em] text-2xl font-mono p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-500 font-bold"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOtpModalOpen(false)}
                  className="flex-1 py-3 bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifyingOtp}
                  className="flex-1 py-3 bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-black transition-colors"
                >
                  {isVerifyingOtp ? "Verifying..." : "Verify Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
