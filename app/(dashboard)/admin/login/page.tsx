"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Mail, Loader2, AlertCircle, CheckCircle, ArrowLeft, Lock } from "lucide-react";
import PasswordInput from "@/components/auth/PasswordInput";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError("Please fill out all fields.");
      setLoading(false);
      triggerShake();
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: "admin" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 1200);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-slate-950 relative overflow-hidden font-body">
      {/* Ambient background */}
      <div
        className="absolute w-[40rem] h-[40rem] -top-48 -left-32 opacity-10 pointer-events-none rounded-full"
        style={{ background: "var(--sw-orange)", filter: "blur(150px)" }}
      />
      <div
        className="absolute w-[35rem] h-[35rem] -bottom-40 -right-32 opacity-10 pointer-events-none rounded-full"
        style={{ background: "var(--sw-gold)", filter: "blur(140px)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        {/* Branding */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center group mb-5">
            <Image
              src="/logo/soulswedlogo-pc.png"
              alt="SoulsWed Logo"
              width={180}
              height={55}
              className="h-9 w-auto brightness-0 invert transition-opacity group-hover:opacity-80"
              priority
            />
          </Link>

          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1
              className="text-2xl font-bold text-slate-100 tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Administrator Console
            </h1>
          </div>
          <p className="text-slate-500 text-sm text-center">
            Restricted access — authorized personnel only
          </p>
        </div>

        {/* Card */}
        <div
          className="p-8 rounded-3xl"
          style={{
            background: "rgba(15, 23, 42, 0.70)",
            border: "1px solid rgba(255, 255, 255, 0.07)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 32px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-8"
              >
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-2">Access Granted</h3>
                <p className="text-sm text-slate-400">Redirecting to administrator console...</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                style={{
                  animation: shake ? "adminShake 0.5s ease-in-out" : undefined,
                }}
                className="flex flex-col gap-5"
              >
                <style jsx global>{`
                  @keyframes adminShake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
                    20%, 40%, 60%, 80% { transform: translateX(6px); }
                  }
                `}</style>

                {/* Security badge */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-950/30 border border-orange-500/15 text-xs text-orange-400 font-semibold mb-1">
                  <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>All access attempts are logged and monitored</span>
                </div>

                {error && (
                  <div className="bg-red-950/40 border border-red-500/20 rounded-2xl p-3.5 flex gap-3 items-start text-red-400 text-xs">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span className="font-medium">{error}</span>
                  </div>
                )}

                {/* Email Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Administrator Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="admin@soulswed.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-800 focus:border-orange-500/50 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all pl-11"
                      required
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  </div>
                </div>

                {/* Password Field — dark themed override */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Security Password
                  </label>
                  <PasswordInput
                    label=""
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="!bg-slate-900/60 !border-slate-800 focus:!border-orange-500/50 !text-slate-100 !placeholder-slate-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #f59e0b, #ea580c)",
                    boxShadow: "0 8px 24px rgba(245,158,11,0.25)",
                    color: "white",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 12px 32px rgba(245,158,11,0.40)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 8px 24px rgba(245,158,11,0.25)")
                  }
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      Access Console
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Back link */}
        <div className="mt-6 flex justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to SoulsWed
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
