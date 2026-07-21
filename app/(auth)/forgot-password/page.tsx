"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "@/components/shared/CustomImage";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email) {
      setError("Please enter your email address.");
      setLoading(false);
      triggerShake();
      return;
    }

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to process request.");
      }

      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

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
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Account Recovery</p>
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
              <h2 className="text-xl font-bold text-slate-900 mb-2">Forgot Password</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Enter your email address and we'll send you a link to reset your password.
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
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Check your email</h3>
                  <p className="text-sm text-slate-500 mb-6">
                    If an account exists with <span className="font-medium text-slate-700">{email}</span>, we have sent a password reset link.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Try another email
                  </button>
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

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-2 transition-all pl-11"
                        style={{ "--tw-ring-color": accent.from } as React.CSSProperties}
                        required
                        maxLength={100}
                        autoComplete="email"
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
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
                        Sending Link...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Back to Login */}
        <div className="mt-6 flex justify-center">
          <Link
            href="/login"
            className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
