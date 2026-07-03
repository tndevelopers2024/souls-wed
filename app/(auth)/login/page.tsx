"use client";

import React, { Suspense, useState, useLayoutEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import PasswordInput from "@/components/auth/PasswordInput";

type UserRole = "user" | "vendor" | "admin";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginLoading() {
  return (
    <AuthLayout title="User Portal" subtitle="Preparing secure access...">
      <div className="flex flex-col items-center justify-center py-10">
        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
      </div>
    </AuthLayout>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = getRoleFromParam(searchParams.get("role"));
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
      {/* Switcher Tab bar removed per user request to only show user login */}

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
                  placeholder="Enter email address"
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
                `Sign In`
              )}
            </button>

            {/* OAuth Separator */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-semibold uppercase tracking-wider">or continue with</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Dummy OAuth Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => alert('Google authentication coming soon!')}
                className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 rounded-2xl transition-colors text-sm shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </div>

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

            {/* Vendor / User toggle */}
            {role !== "admin" && (
              <div className="text-center text-slate-400 text-xs mt-1">
                {role === "vendor" ? (
                  <>
                    Not a vendor?{" "}
                    <Link
                      href="/login"
                      className="text-orange-500 hover:text-orange-600 font-semibold transition-colors"
                    >
                      User Login
                    </Link>
                  </>
                ) : (
                  <>
                    Are you a vendor?{" "}
                    <Link
                      href="/login?role=vendor"
                      className="text-orange-500 hover:text-orange-600 font-semibold transition-colors"
                    >
                      Vendor Login
                    </Link>
                  </>
                )}
              </div>
            )}

          </motion.form>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}

function getRoleFromParam(roleParam: string | null): UserRole {
  return roleParam === "vendor" || roleParam === "admin" || roleParam === "user"
    ? roleParam
    : "user";
}
