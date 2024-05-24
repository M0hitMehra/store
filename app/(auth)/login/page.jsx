"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { server } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import axios from "axios";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import { Loader } from "lucide-react";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const { user, loading } = useProtectedRoute();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Invalid email address");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      const { data } = await axios.post(`${server}/auth/login`, {
        email,
        password,
      });
      if (data?.success) {
        setIsLoading(false);
        toast({
          variant: "secondary",
          title: "Logged in successfully",
          description: `Welcome to the store ${data?.user?.firstName}`,
        });
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
      setEmail("");
      setPassword("");
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: (
          <ToastAction
            altText="Refresh"
            onClick={() => {
              window.location.reload();
            }}
          >
            Refresh
          </ToastAction>
        ),
      });
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (user) {
    router.push("/dashboard");
  }

  return (
    <div className="h-screen w-screen fixed flex justify-center items-center bg-slate-100">
      <div className="border-[0.6px] border-neutral-500 shadow-md shadow-black rounded-lg h-3/5 w-1/2 mb-20 grid grid-cols-7">
        <img
          src="/loginSideScreen.avif"
          alt="Login"
          className="col-span-3 h-full w-full rounded-l-md"
        />
        <div className="col-span-4 flex flex-col w-full justify-start items-center p-6 px-10 gap-4">
          <h1 className="text-2xl font-bold pb-2">Login</h1>
          <Separator />
          <form
            onSubmit={onSubmit}
            className="flex flex-col w-full justify-start items-center my-5 mt-6 gap-6"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="w-full outline-none focus:outline-[0.6px] focus:outline-blue-300 rounded-sm p-3 outline-[0.6px] outline-neutral-500"
              placeholder="Enter your email"
              aria-label="Email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="w-full outline-none focus:outline-[0.6px] focus:outline-blue-300 rounded-sm p-3 outline-[0.6px] outline-neutral-500"
              placeholder="Enter your password"
              aria-label="Password"
            />
            {error && <span className="text-red-500 text-sm">{error}</span>}
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition duration-300"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <span className="text-sm font-light mt-4">
            Don&apos;t have an account?{" "}
            <span
              className="text-sm font-medium hover:text-blue-600 text-blue-500 cursor-pointer"
              onClick={() => router.push("/signup")}
            >
              Sign up here
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
