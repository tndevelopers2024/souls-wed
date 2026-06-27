"use client";

import React, { useState, useLayoutEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Building, MapPin, Loader2, AlertCircle, KeyRound, Sparkles } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import PasswordInput from "@/components/auth/PasswordInput";

import { useEffect } from "react";

type UserRole = "user" | "vendor" | "admin";

const categories = [
  "Venues",
  "Photographers",
  "Decorators",
  "Caterers",
  "Make-up Artists",
  "Planners",
  "Singers & Bands",
  "DJs",
];

const cities = ["Mumbai", "Goa", "Udaipur", "Jaipur", "Delhi", "Dubai", "Bali", "Maldives"];

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("user");
  
  // Common fields
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  
  // Vendor specific fields
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [city, setCity] = useState(cities[0]);

  // Admin specific fields
  const [accessCode, setAccessCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  useLayoutEffect(() => {
    return () => {
      setEmail("");
      setName("");
      setPassword("");
      setBusinessName("");
      setPhone("");
      setCategory(categories[0]);
      setCity(cities[0]);
      setAccessCode("");
      setLoading(false);
      setError(null);
      setSuccess(false);
      setRole("user");
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const roleParam = params.get("role");
      if (roleParam === "vendor" || roleParam === "admin" || roleParam === "user") {
        setRole(roleParam as UserRole);
      } else if (params.get("admin") === "true") {
        setRole("admin");
      }
    }
  }, []);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(false);

    // Basic Validation
    if (!name || !email || !password) {
      setError("Please fill out all common fields.");
      triggerShake();
      return;
    }

    if (role === "vendor" && (!businessName || !phone)) {
      setError("Please fill out all business details.");
      triggerShake();
      return;
    }

    if (role === "admin" && !accessCode) {
      setError("Admin registration requires an Access Code.");
      triggerShake();
      return;
    }

    setLoading(true);

    try {
      let payload = {};
      if (role === "user") {
        payload = { role, name, email, password, phone };
      } else if (role === "vendor") {
        payload = { role, name, email, password, businessName, phone, category, city };
      } else if (role === "admin") {
        payload = { role, name, email, password, accessCode };
      }

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to register account.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 1800);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed. Please try again.");
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
          ? "Create Your Account"
          : role === "vendor"
          ? "Become a Partner"
          : "Register Admin"
      }
      subtitle={
        role === "user"
          ? "Create an account to explore vendors and save venues"
          : role === "vendor"
          ? "Create a vendor profile to exhibit services and receive enquiries"
          : "Create an administrator account to moderate and manage directory logs"
      }
    >
      {/* Switcher Tab bar removed to keep UI simple for users */}

      {role === "admin" && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold py-2.5 px-4 rounded-2xl mb-8 text-center uppercase tracking-wider">
          Security Console: Admin Registration
        </div>
      )}

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-8"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mb-4 animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Registration Complete!</h3>
            <p className="text-sm text-slate-505">Redirecting to login portal...</p>
          </motion.div>
        ) : (
          <motion.form
            key={role}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            style={{
              animation: shake ? "shake 0.5s ease-in-out" : undefined,
            }}
          >
            {/* Inline keyframe for shaking */}
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

            {/* Owner/Admin Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                {role === "user" ? "Your Name" : role === "vendor" ? "Contact Person Name" : "Full Name"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/60 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-orange-500 focus:bg-white transition-all pl-11"
                  required
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Vendor-specific fields */}
            {role === "vendor" && (
              <>
                {/* Business Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Business / Brand Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter business name"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full bg-white/60 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-orange-500 focus:bg-white transition-all pl-11"
                      required
                    />
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {/* Grid for Category & City */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">Service Category</label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-white/60 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-orange-500 focus:bg-white transition-all appearance-none"
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <Building className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">Primary City</label>
                    <div className="relative">
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-white/60 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-orange-500 focus:bg-white transition-all appearance-none"
                      >
                        {cities.map((ct) => (
                          <option key={ct} value={ct}>{ct}</option>
                        ))}
                      </select>
                      <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Phone Number */}
            {role !== "admin" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white/60 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-orange-500 focus:bg-white transition-all pl-11"
                    required={role === "vendor"}
                  />
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>
            )}

            {/* Email Address */}
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

            {/* Admin Access Code */}
            {role === "admin" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Admin Access Code</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter security authorization code"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="w-full bg-white/60 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-orange-500 focus:bg-white transition-all pl-11"
                    required
                  />
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>
            )}

            {/* Password Field */}
            <PasswordInput
              label="Password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showStrengthMeter={true}
              required
            />

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
                  <Loader2 className="w-4 h-4 animate-spin" /> Registering...
                </>
              ) : (
                `Create Account`
              )}
            </button>

            {/* OAuth Separator */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-semibold uppercase tracking-wider">or sign up with</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Dummy OAuth Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => alert('Google registration coming soon!')}
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

            {/* Redirect to login */}
            <div className="text-center text-slate-500 text-xs mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-orange-600 hover:text-orange-700 font-bold transition-colors">
                Sign In
              </Link>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}
