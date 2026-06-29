"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  // Check if session is already active on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user.role === "admin") {
            router.push("/admin/dashboard");
          }
        }
      } catch (err) {
        console.error("Session check error on admin login:", err);
      }
    }
    checkSession();
  }, [router]);

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
    <div
      className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-body"
      style={{ background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)" }}
    >
      {/* Decorative background shapes (no icons) */}
      <div
        className="absolute w-[32rem] h-[32rem] -top-40 -left-40 pointer-events-none rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, #fb923c, transparent)", filter: "blur(80px)" }}
      />
      <div
        className="absolute w-[28rem] h-[28rem] -bottom-32 -right-32 pointer-events-none rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #f97316, transparent)", filter: "blur(80px)" }}
      />

      <style jsx global>{`
        @keyframes adminShake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
          20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
        .admin-input {
          background: #ffffff;
          border: 1.5px solid #fed7aa;
          color: #1c1917;
          border-radius: 14px;
          padding: 12px 16px;
          font-size: 14px;
          width: 100%;
          outline: none;
          transition: border-color 0.2s;
        }
        .admin-input::placeholder { color: #a8a29e; }
        .admin-input:focus { border-color: #f97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.12); }
      `}</style>

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
              className="h-9 w-auto transition-opacity group-hover:opacity-70"
              priority
            />
          </Link>

          <div className="mb-2">
            <h1
              className="text-2xl font-bold tracking-tight text-center"
              style={{ color: "#9a3412", fontFamily: "var(--font-heading)" }}
            >
              Administrator Console
            </h1>
          </div>
          <p className="text-sm text-center" style={{ color: "#a16207" }}>
            Restricted access — authorized personnel only
          </p>
        </div>

        {/* Card */}
        <div
          className="p-8 rounded-3xl"
          style={{
            background: "rgba(255, 255, 255, 0.85)",
            border: "1.5px solid #fed7aa",
            backdropFilter: "blur(20px)",
            boxShadow: "0 20px 60px rgba(251,146,60,0.15), 0 4px 16px rgba(0,0,0,0.06)",
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
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4 text-sm font-black"
                  style={{ background: "#dcfce7", color: "#16a34a" }}
                >
                  OK
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "#1c1917" }}>Access Granted</h3>
                <p className="text-sm" style={{ color: "#78716c" }}>Redirecting to administrator console...</p>
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
                {/* Security notice */}
                <div
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold mb-1 text-center"
                  style={{
                    background: "#fff7ed",
                    border: "1px solid #fed7aa",
                    color: "#ea580c",
                  }}
                >
                  All access attempts are logged and monitored
                </div>

                {error && (
                  <div
                    className="rounded-2xl p-3.5 text-xs font-medium text-center"
                    style={{
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      color: "#dc2626",
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* Email Field */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "#78716c" }}
                  >
                    Administrator Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="admin-input"
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "#78716c" }}
                  >
                    Security Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="admin-input pr-16"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
                    >
                      {showPassword ? "[Hide]" : "[Show]"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #f97316, #ea580c)",
                    boxShadow: "0 8px 24px rgba(249,115,22,0.30)",
                    color: "white",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 12px 32px rgba(249,115,22,0.45)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 8px 24px rgba(249,115,22,0.30)")
                  }
                >
                  {loading ? "Authenticating..." : "Access Console"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Back link */}
        <div className="mt-6 flex justify-center">
          <Link
            href="/"
            className="text-xs font-semibold transition-colors"
            style={{ color: "#a16207" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#ea580c")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#a16207")}
          >
            Return to SoulsWed
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
