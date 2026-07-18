"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import Image from "@/components/shared/CustomImage";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-6 h-6 animate-spin text-primary-500"/></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";
  const role = searchParams.get("role") || "user";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!email) {
      router.replace("/signup");
    }
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!otp || otp.length < 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role, otp }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || "Failed to verify email.");

      setSuccess(true);
      setTimeout(() => {
        if (role === "admin") router.push("/admin/dashboard");
        else if (role === "vendor") router.push("/vendor/dashboard");
        else router.push("/dashboard");
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-slate-50 font-body">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <div className="flex flex-col items-center mb-7">
          <Link href="/" className="group mb-5">
            <Image
              src="/logo/logo-by-soulswed.png"
              alt="SoulsWed"
              width={180}
              height={55}
              className="h-9 w-auto transition-opacity group-hover:opacity-70"
              priority
            />
          </Link>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Verify Your Account</p>
        </div>

        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl p-8">
          {success ? (
             <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="flex flex-col items-center text-center py-6"
             >
               <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
               <h3 className="text-xl font-bold text-slate-800 mb-2">Email Verified!</h3>
               <p className="text-sm text-slate-500">You are securely logged in. Redirecting to your dashboard...</p>
             </motion.div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-slate-800 mb-2">Check your email</h2>
                <p className="text-sm text-slate-500">We&apos;ve sent a 6-digit OTP to <strong className="text-slate-800">{email}</strong>.</p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 flex gap-3 items-start text-red-700 text-xs">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span className="font-medium">{error}</span>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider text-center">Enter OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="------"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Only allow digits
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-center text-2xl tracking-[0.5em] font-bold text-slate-900 outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all"
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full mt-4 bg-primary-500 hover:bg-primary-600 py-3.5 rounded-2xl font-bold text-sm tracking-wide text-white flex items-center justify-center gap-2 disabled:opacity-60 transition-all cursor-pointer shadow-lg shadow-primary-500/25"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</>
                  ) : (
                    "Verify Email"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
        
        <div className="mt-6 flex justify-center">
          <Link
            href="/signup"
            className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign up
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
