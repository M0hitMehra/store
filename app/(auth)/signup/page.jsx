"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState, useRef } from "react";
import { Separator } from "@/components/ui/separator";
import { server } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import axios from "axios";
import Loader from "@/components/loader";
import useAuthStore from "@/stores/useAuthStore";
import { EyeIcon, EyeOff } from "lucide-react";

const Signup = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeInput, setActiveInput] = useState(null);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const setUser = useAuthStore((state) => state.setUser);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (
      !firstName ||
      !lastName ||
      !validateEmail(email) ||
      password.length < 8
    ) {
      setError("Please fill all fields correctly.");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/auth/register`,
        {
          firstName,
          lastName,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Include this line
        }
      );
      if (data?.success) {
        setUser(data.user);

        setIsLoading(false);
        toast({
          title: "Signed up successfully",
          description: `Welcome to the designer store ${data?.user?.firstName}`,
        });
        setTimeout(() => {
          toast({
            variant: "warning",
            title: "Attention needed!",
            description: `${data?.user?.firstName} please verify your email either account will be deleted after 24 hours`,
          });
        }, 5000);
        router.replace("/dashboard");
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error?.response?.data?.message,
      });
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (user) {
    router.push("/dashboard");
  }

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
    setTimeout(() => {
      if (activeInput === "password" && passwordRef.current) {
        passwordRef.current.focus();
        passwordRef.current.setSelectionRange(password.length, password.length);
      }
    }, 0);
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-100 fixed pb-10">
      <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-semibold mb-4">Signup</h1>
        <Separator />
        <form onSubmit={onSubmit} className="flex flex-col w-full mt-4">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onFocus={() => setActiveInput("firstName")}
            className="w-full p-3 border rounded mt-4"
            placeholder="Enter your first name"
            aria-label="First Name"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onFocus={() => setActiveInput("lastName")}
            className="w-full p-3 border rounded mt-4"
            placeholder="Enter your last name"
            aria-label="Last Name"
          />
          <input
            type="email"
            ref={emailRef}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            onFocus={() => setActiveInput("email")}
            className="w-full p-3 border rounded mt-4"
            placeholder="Enter your email"
            aria-label="Email"
          />
          <div className="relative w-full mt-4">
            <input
              type={passwordVisible ? "text" : "password"}
              ref={passwordRef}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onFocus={() => setActiveInput("password")}
              className="w-full p-3 border rounded pr-10"
              placeholder="Enter your password"
              aria-label="Password"
            />
            {passwordVisible ? (
              <EyeIcon
                onClick={handlePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 cursor-pointer w-5"
              />
            ) : (
              <EyeOff
                onClick={handlePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 cursor-pointer w-5"
              />
            )}
          </div>
          {error && <span className="text-red-500 text-sm mt-2">{error}</span>}
          <Button
            className="w-full bg-black text-white font-semibold py-3 rounded mt-6"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? "Signing up..." : "Signup"}
          </Button>
        </form>
        <span className="text-sm font-light mt-6">
          Already have an account?{" "}
          <span
            className="text-sm font-medium text-blue-500 cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login here
          </span>
        </span>
      </div>
    </div>
  );
};

export default Signup;
