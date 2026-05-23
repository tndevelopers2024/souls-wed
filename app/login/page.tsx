"use client";

import React, { useState, useLayoutEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import PasswordInput from "@/components/auth/PasswordInput";

type UserRole = "user" | "vendor" | "admin";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useLayoutEffect(() => {
    return () => {
      setEmail("");
      setPassword("");
      setLoading(false);
      setError(null);
      setSuccess(false);
      setRole("user");
    };
  }, []);

  // Form error shake animations
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
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials.");
      }

      setSuccess(true);
      
      // Simulate redirection delay for premium UX
      setTimeout(() => {
        if (role === "admin") {
          router.push("/admin/dashboard");
        } else if (role === "vendor") {
          router.push("/vendor/dashboard");
        } else {
          router.push("/dashboard");
        }
      }, 1500);
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
    <AuthLayout
      title={
        role === "user"
          ? "User Portal"
          : role === "vendor"
          ? "Vendor Portal"
          : "Admin Console"
      }
      subtitle={
        role === "user"
          ? "Sign in to manage your bookings and profile"
          : role === "vendor"
          ? "Manage your showcase, bookings, and responses"
          : "Access global settings, vendor verifications, and directory configs"
      }
    >
      {/* Switcher Tab bar */}
      <div className="flex bg-slate-100 p-1 rounded-2xl mb-8 relative z-0">
        <motion.div
          layout
          className="absolute top-1 bottom-1 rounded-xl shadow-sm bg-white"
          style={{
            width: "calc(33.33% - 4px)",
            left: role === "user" ? "4px" : role === "vendor" ? "33.33%" : "66.66%",
            zIndex: -1,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
        />
        {["user", "vendor", "admin"].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => {
              setRole(r as UserRole);
              setError(null);
            }}
            className={`flex-1 text-center py-2.5 text-xs font-bold capitalize transition-colors ${
              role === r ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {r === "user" ? "User" : r}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success-message"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center text-center py-8"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mb-4 animate-bounce">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Access Granted</h3>
            <p className="text-sm text-slate-550">Redirecting to your dashboard...</p>
          </motion.div>
        ) : (
          <motion.form
            key={role}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleSubmit}
            className={`flex flex-col gap-5 ${shake ? "animate-shake" : ""}`}
            style={{
              animation: shake ? "shake 0.5s ease-in-out" : undefined,
            }}
          >
            {/* Inject shake keyframe styles inline to prevent writing external CSS */}
            <style jsx global>{`
              @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
                20%, 40%, 60%, 80% { transform: translateX(6px); }
              }
            `}</style>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3 items-start text-red-700 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/60 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-orange-500 focus:bg-white transition-all pl-11"
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Password Field */}
            <PasswordInput
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Remember & Forgot */}
            <div className="flex justify-between items-center text-xs mt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-550 font-medium">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-orange-550 focus:ring-orange-500 w-4 h-4"
                />
                <span>Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-orange-600 hover:text-orange-700 font-semibold transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-glass !rounded-2xl py-3.5 flex items-center justify-center gap-2 font-bold text-sm tracking-wide transition-all mt-4 disabled:opacity-50"
              style={{
                boxShadow: "0 8px 24px rgba(252,203,17,0.3)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
                </>
              ) : (
                `Sign In as ${role === "user" ? "User" : role === "vendor" ? "Vendor" : "Admin"}`
              )}
            </button>

            {/* Sign up prompt */}
            {role !== "admin" && (
              <div className="text-center text-slate-500 text-xs mt-4">
                {role === "vendor" ? "New vendor?" : "New user?"}{" "}
                <Link
                  href={role === "vendor" ? "/signup?role=vendor" : "/signup"}
                  className="text-orange-600 hover:text-orange-700 font-bold transition-colors"
                >
                  Create an account
                </Link>
              </div>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}
