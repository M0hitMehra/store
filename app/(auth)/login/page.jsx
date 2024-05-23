"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Invalid email address");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 8 characters long");
      return;
    }
    setError("");
    setIsLoading(true);
    // Simulate a login request
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to another page on successful login
      router.push("/dashboard");
    }, 2000);
  };

  return (
    <div className="h-screen w-screen fixed flex justify-center items-center bg-slate-100">
      <div className="border-[0.6px] border-neutral-500 shadow-md shadow-black rounded-lg h-3/5 w-1/2 mb-20 grid grid-cols-7">
        <img
          src="./loginSideScreen.avif"
          alt="Login"
          className="col-span-3 h-full w-full rounded-l-md"
        />
        <div className="col-span-4 flex flex-col w-full justify-start items-center p-6 px-10 gap4">
          <h1 className="text-2xl font-bold pb-2">Login</h1>
          <Separator />
          <form
            onSubmit={onSubmit}
            className="flex flex-col w-full justify-start items-center my-5 mt-10 gap-8"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full outline-none focus:outline-[0.6px] focus:outline-blue-300 rounded-sm p-3 outline-[0.6px] outline-neutral-500"
              placeholder="Enter your email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full outline-none focus:outline-[0.6px] focus:outline-blue-300 rounded-sm p-3 outline-[0.6px] outline-neutral-500"
              placeholder="Enter your password"
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
            Don't have an account?{" "}
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
