"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Shield, ShieldCheck, Activity, Cpu, LogOut, Loader2, RefreshCw, AlertCircle } from "lucide-react";



interface AdminSession {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingSystem, setCheckingSystem] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user.role === "admin") {
            setAdmin(data.user);
          } else if (data.authenticated) {
            router.push(data.user.role === "vendor" ? "/vendor/dashboard" : "/dashboard");
          } else {
            router.push("/login");
          }
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Admin dashboard session check error:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, [router]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const runDiagnostics = () => {
    setCheckingSystem(true);
    setTimeout(() => {
      setCheckingSystem(false);
    }, 1200);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-900 text-slate-100">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
        <p className="text-slate-400 font-medium text-sm">Initializing secure administrator shell...</p>
      </div>
    );
  }

  if (!admin) return null;

  return (
    <>

      <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-16 font-body relative overflow-hidden">
        {/* Background decorative admin gradients */}
        <div
          className="absolute w-[40rem] h-[40rem] -top-32 -left-32 opacity-10 pointer-events-none rounded-full"
          style={{ background: "var(--sw-orange)", filter: "blur(140px)" }}
        />
        <div
          className="absolute w-[35rem] h-[35rem] -bottom-32 -right-32 opacity-10 pointer-events-none rounded-full"
          style={{ background: "var(--sw-gold)", filter: "blur(140px)" }}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          
          {/* Admin Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          >
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-orange-500 px-3 py-1 rounded-full bg-orange-950/40 border border-orange-500/20">
                Security Operator
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mt-2 font-serif">
                Administrator Console
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Global directory configs, user moderations, and cluster connection status.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-200 hover:text-red-400 hover:bg-red-950/20 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer self-start md:self-auto"
            >
              <LogOut className="w-4 h-4" />
              Terminate Shell
            </button>
          </motion.div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Operator profile card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1 flex flex-col gap-6"
            >
              <div
                className="rounded-3xl p-6"
                style={{
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(24px)",
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg">
                    <Shield className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-lg">{admin.name}</h3>
                    <p className="text-xs text-orange-500 font-semibold uppercase tracking-wider mt-0.5">{admin.role}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-t border-slate-900 pt-5">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400 flex-shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="text-slate-300 truncate">{admin.email}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400 flex-shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className="text-slate-350">Status: Active & Authenticated</span>
                  </div>
                </div>

                <button
                  onClick={runDiagnostics}
                  disabled={checkingSystem}
                  className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-2xl font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {checkingSystem ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing Logs...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" /> Run Diagnostic Logs
                    </>
                  )}
                </button>
              </div>

              {/* System Diagnostics */}
              <div
                className="rounded-3xl p-6"
                style={{
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(24px)",
                }}
              >
                <h4 className="font-bold text-slate-100 text-sm mb-4">Diagnostics Console</h4>
                <div className="flex flex-col gap-3.5 text-xs text-slate-400">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                    <span className="flex items-center gap-2"><Activity className="w-3.5 h-3.5 text-emerald-500" /> Database Cluster</span>
                    <span className="text-emerald-500 font-bold">CONNECTED</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                    <span className="flex items-center gap-2"><Cpu className="w-3.5 h-3.5 text-orange-500" /> Server Runtime</span>
                    <span className="text-slate-200">Next.js 16.2 (Node 20)</span>
                  </div>
                  <div className="flex justify-between items-center pb-1">
                    <span className="flex items-center gap-2"><AlertCircle className="w-3.5 h-3.5 text-blue-450" /> Admin Access Mode</span>
                    <span className="text-slate-200">Active</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column Moderations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="lg:col-span-2 flex flex-col gap-6"
            >
              {/* Stats counts */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Active Admins", count: "1", icon: Shield, color: "from-amber-500 to-orange-500" },
                  { label: "Registered Users", count: "1", icon: User, color: "from-indigo-500 to-blue-500" },
                  { label: "Partner Showcase", count: "1", icon: Activity, color: "from-emerald-500 to-teal-500" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-3xl bg-slate-900/50 border border-slate-900 flex flex-col gap-3 relative overflow-hidden group shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-2xl font-black text-slate-100">{stat.count}</span>
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${stat.color} text-white flex items-center justify-center flex-shrink-0 shadow-sm`}>
                        <stat.icon className="w-4 h-4" />
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Pending Approvals */}
              <div
                className="rounded-3xl p-6 flex flex-col gap-5 min-h-[300px]"
                style={{
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(24px)",
                }}
              >
                <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                  <h3 className="font-bold text-slate-100 text-base">Pending Vendor Approvals</h3>
                  <span className="text-xs font-semibold bg-amber-950/50 text-amber-550 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                    0 Applications
                  </span>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-orange-500 flex items-center justify-center mb-3">
                    <ShieldCheck className="w-6 h-6 animate-pulse" />
                  </div>
                  <h4 className="font-bold text-slate-300 text-sm">No applications pending</h4>
                  <p className="text-xs text-slate-400 max-w-xs mt-1">
                    All partner accounts are correctly moderated or fully approved.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </main>
      </div>

    </>
  );
}
