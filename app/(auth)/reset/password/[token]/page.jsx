"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react";
import { server } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import useAuthStore from "@/stores/useAuthStore";

export default function ResetPasswordPage({ params }) {
  const { token } = params;
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.put(
        `${server}/auth/user/reset/${token}`,
        {
          newPassword,
          confirmPassword,
        },
        { withCredentials: true }
      );

      if (data?.success) {
        setUser(data.user);
        toast({
          variant: "success",
          title: "Password Reset Successful",
          description: "Your new password is active. Welcome back!",
        });
        router.push("/dashboard");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Password reset failed or token has expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-3xl p-8 sm:p-10 shadow-lg space-y-8">
        <div className="space-y-2 text-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
            Security Update
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-neutral-900 uppercase">
            Create New Password
          </h1>
          <p className="text-xs text-neutral-500">
            Choose a strong password to secure your account.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-neutral-700">
              New Password *
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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

          <div>
            <label className="text-[11px] font-semibold text-neutral-700">
              Confirm Password *
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl mt-1 focus:outline-none focus:border-neutral-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-neutral-950 text-white text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-black transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? "Updating Password..." : "Set New Password"}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link
            href="/login"
            className="text-xs font-semibold text-neutral-500 hover:text-black underline"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
