"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { z } from "zod";
 import { zodResolver } from "@hookform/resolvers/zod";
import { server } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import useAuthStore from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";

const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, "New password is required"),
  confirmPassword: z.string().min(8, "Confirm password is required"),
});

const ResetPassword = ({ params }) => {
  const { token } = params;
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
        newPassword: "",
        confirmPassword: "",
        },
    });

  const resetPasswordHandler = async (formData) => {
    try {
      const { data } = await axios.put(
        `${server}/auth/user/reset/${token}`,
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
        router.push("/dashboard");
      }
      reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: error?.response?.data?.message,
      });
      reset();
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-100 fixed pb-10">
      <Card>
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Enter the new password (at least 8 characters long).{" "}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(resetPasswordHandler)}
            className=" flex flex-col justify-center items-center gap-5"
          >
            <div className="grid w-full max-w-sm items-center gap-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                type="password"
                placeholder="Enter your new password"
                {...register("newPassword")}
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="grid w-full max-w-sm items-center gap-2">
              <Label htmlFor="password">Confirm Password</Label>
              <Input
                type="password"
                placeholder="Enter your Confirm password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={!isDirty}>
              Reset Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
