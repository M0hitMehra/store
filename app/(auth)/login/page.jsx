"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { server } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import useAuthStore from "@/stores/useAuthStore";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import Loader from "@/components/loader";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useProtectedRoute();
  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (user) {
    router.replace("/dashboard");
    return null;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/auth/login`,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (data?.success) {
        setUser(data.user);
        toast({
          variant: "success",
          title: "Welcome Back",
          description: `Logged in as ${data.user.firstName || "Member"}.`,
        });
        router.push("/dashboard");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-3xl p-8 sm:p-10 shadow-lg space-y-8">
        {/* Title */}
        <div className="space-y-2 text-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
            Member Access
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-neutral-900 uppercase">
            Sign In
          </h1>
          <p className="text-xs text-neutral-500">
            Enter your credentials to access your bag, orders & profile.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-neutral-700">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="you@domain.com"
              className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl mt-1 focus:outline-none focus:border-neutral-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-neutral-700">
                Password *
              </label>
              <Link
                href="/forget/password"
                className="text-[11px] font-medium text-neutral-500 hover:text-black"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="••••••••"
                className="w-full p-3 pr-10 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-neutral-950 text-white text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-2"
          >
            {loading ? "Signing in..." : "Sign In to Account"}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-neutral-500">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/signup"
              className="font-bold text-neutral-950 underline hover:text-black"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
