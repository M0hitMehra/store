"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { server } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

const forgetPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
});

const ForgetPassword = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgetPasswordHandler = async (formData) => {
    try {
      const { data } = await axios.post(
        `${server}/auth/user/password/forgot`,
        formData,
        {
          withCredentials: true,
        }
      );
      if (data?.success) {
        toast({
          variant: "success",
          title:
            "Reset password link has been successfully sent to your email address",
        });
        router.push("/");
      }
      reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: error?.response?.data?.message || "An error occurred",
      });
      reset();
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-100 fixed pb-10">
      <Card>
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address to receive a reset password link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(forgetPasswordHandler)}
            className=" flex flex-col justify-center items-center gap-5"
          >
            <div className="grid w-full max-w-sm items-center gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                placeholder="Enter your email address"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.email.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={!isDirty}>
              Send Link
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgetPassword;
