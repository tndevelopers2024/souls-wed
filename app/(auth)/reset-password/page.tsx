"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "@/components/shared/CustomImage";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Loader2, AlertCircle, Eye, EyeOff, Wand2, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetSkeleton />}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
    </div>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  const accent = {
    from: "#f97316",
    to: "#ea580c",
    glow: "rgba(249,115,22,0.25)",
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const generateStrongPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let pass = "";
    for (let i = 0; i < 16; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
    setConfirmPassword(pass);
    setShowPassword(true);
    setShowConfirmPassword(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!token) {
      setError("Invalid or missing password reset token.");
      setLoading(false);
      triggerShake();
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      triggerShake();
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password.");
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  if (!token && !success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-body">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Invalid Request</h2>
          <p className="text-slate-500 mb-6">The password reset link is missing or invalid.</p>
          <Link
            href="/forgot-password"
            className="inline-block bg-primary-600 text-white font-bold px-6 py-2.5 rounded-xl transition-colors hover:bg-primary-700"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-body"
      style={{ background: "linear-gradient(135deg, #fff7ed 0%, #fafaf9 50%, #f0f9ff 100%)" }}
    >
      {/* Ambient orbs */}
      <div
        className="absolute w-[38rem] h-[38rem] -top-40 -left-40 pointer-events-none rounded-full opacity-30"
        style={{ background: `radial-gradient(circle, ${accent.from}, transparent)`, filter: "blur(100px)", transition: "background 0.5s" }}
      />
      <div
        className="absolute w-[32rem] h-[32rem] -bottom-32 -right-32 pointer-events-none rounded-full opacity-20"
        style={{ background: `radial-gradient(circle, ${accent.to}, transparent)`, filter: "blur(100px)", transition: "background 0.5s" }}
      />

      <style jsx global>{`
        @keyframes unifiedShake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
          20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        {/* Logo */}
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
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Account Security</p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "var(--sw-glass-panel)",
            border: "1.5px solid var(--sw-chip-bg)",
            backdropFilter: "blur(24px)",
            boxShadow: `0 24px 64px ${accent.glow}, 0 4px 16px rgba(0,0,0,0.05)`,
            transition: "box-shadow 0.4s",
          }}
        >
          <div className="p-8">
            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Create New Password</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Please enter your new password below. Make it strong and memorable.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-6"
                >
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4 text-green-600">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Password Reset!</h3>
                  <p className="text-sm text-slate-500 mb-2">
                    Your password has been successfully updated.
                  </p>
                  <p className="text-xs text-slate-400">Redirecting to login...</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSubmit}
                  style={{
                    animation: shake ? "unifiedShake 0.5s ease-in-out" : undefined,
                  }}
                  className="flex flex-col gap-4"
                >
                  {/* Error */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex gap-3 items-start text-red-700 text-xs">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span className="font-medium">{error}</span>
                    </div>
                  )}

                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        New Password
                      </label>
                      <button
                        type="button"
                        onClick={generateStrongPassword}
                        className="text-[10px] flex items-center gap-1 font-bold text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        <Wand2 className="h-3 w-3" />
                        Generate Strong
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Min. 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-2 transition-all pl-11 pr-12"
                        style={{ "--tw-ring-color": accent.from } as React.CSSProperties}
                        required
                        minLength={8}
                      />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Repeat your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-2 transition-all pl-11 pr-12"
                        style={{ "--tw-ring-color": accent.from } as React.CSSProperties}
                        required
                        minLength={8}
                      />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3.5 rounded-xl font-bold text-sm tracking-wide text-white flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
                      boxShadow: `0 8px 24px ${accent.glow}`,
                    }}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
