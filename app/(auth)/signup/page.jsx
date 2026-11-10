"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Eye, EyeOff, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { server } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import useAuthStore from "@/stores/useAuthStore";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import Loader from "@/components/loader";

export default function SignupPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useProtectedRoute();
  const setUser = useAuthStore((state) => state.setUser);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // OTP Verification Dialog state
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (user && !showOtpDialog) {
    router.replace("/dashboard");
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.phone ||
      !formData.dateOfBirth
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (formData.phone.length < 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/auth/register`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (data?.success) {
        setUser(data.user);
        toast({
          variant: "success",
          title: "Account Created!",
          description: "An OTP has been sent to your email for verification.",
        });
        setShowOtpDialog(true);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Signup failed. Please check your information and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpValue || otpValue.length < 4) {
      toast({
        variant: "destructive",
        title: "Please enter the OTP sent to your email",
      });
      return;
    }

    setVerifyingOtp(true);
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
          description: "Welcome to STUDIO ATELIER.",
        });
        router.push("/dashboard");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: err?.response?.data?.message || "Invalid or expired OTP",
      });
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-3xl p-8 sm:p-10 shadow-lg space-y-8">
        {/* Title */}
        <div className="space-y-2 text-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
            Member Registration
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-neutral-900 uppercase">
            Create Account
          </h1>
          <p className="text-xs text-neutral-500">
            Join STUDIO ATELIER for exclusive drops & tailored sizing.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-neutral-700">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl mt-1 focus:outline-none focus:border-neutral-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-neutral-700">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl mt-1 focus:outline-none focus:border-neutral-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-neutral-700">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@domain.com"
              className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl mt-1 focus:outline-none focus:border-neutral-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-neutral-700">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit number"
                className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl mt-1 focus:outline-none focus:border-neutral-500 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-neutral-700">
                Date of Birth *
              </label>
              <input
                type="date"
                name="dateOfBirth"
                required
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl mt-1 focus:outline-none focus:border-neutral-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-neutral-700">
              Password (min. 8 chars) *
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
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
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-neutral-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-neutral-950 underline hover:text-black"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Immediate OTP Verification Dialog */}
      {showOtpDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 space-y-6 shadow-2xl border border-neutral-100 text-center">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full">
                Step 2 of 2
              </span>
              <h3 className="text-xl font-black font-mono uppercase text-neutral-900 mt-2">
                Verify Your Account
              </h3>
              <p className="text-xs text-neutral-500">
                We sent an OTP to{" "}
                <span className="font-bold text-neutral-900 font-mono">
                  {formData.email}
                </span>
                . Enter it below to activate your account.
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <input
                type="text"
                maxLength={6}
                autoFocus
                required
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-full text-center tracking-[0.5em] text-2xl font-mono p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:outline-none focus:border-neutral-500 font-bold"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpDialog(false);
                    router.push("/dashboard");
                  }}
                  className="flex-1 py-3 bg-neutral-100 text-neutral-700 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-200"
                >
                  Verify Later
                </button>
                <button
                  type="submit"
                  disabled={verifyingOtp}
                  className="flex-1 py-3 bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-black transition-colors disabled:opacity-50"
                >
                  {verifyingOtp ? "Verifying..." : "Verify & Continue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
