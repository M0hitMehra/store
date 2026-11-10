"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { server } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post(
        `${server}/auth/user/password/forgot`,
        { email },
        { withCredentials: true }
      );
      if (data?.success) {
        setSubmitted(true);
        toast({
          variant: "success",
          title: "Reset Link Sent",
          description: `Instructions have been sent to ${email}.`,
        });
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to send reset email. Please ensure your email is registered."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-3xl p-8 sm:p-10 shadow-lg space-y-8">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>

        <div className="space-y-2 text-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
            Account Recovery
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-neutral-900 uppercase">
            Forgot Password
          </h1>
          <p className="text-xs text-neutral-500">
            Enter your email to receive a password reset link.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        {submitted ? (
          <div className="p-6 bg-emerald-50 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-sm font-bold text-neutral-900">
              Reset Email Dispatched
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              If an account with <span className="font-semibold">{email}</span>{" "}
              exists, you will receive a reset password link in your inbox shortly.
            </p>
            <Link
              href="/login"
              className="inline-block pt-2 text-xs font-bold uppercase tracking-wider text-neutral-950 underline"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-neutral-700">
                Registered Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl mt-1 focus:outline-none focus:border-neutral-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-neutral-950 text-white text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-black transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? "Sending Link..." : "Send Reset Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
