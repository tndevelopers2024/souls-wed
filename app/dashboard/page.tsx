"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Calendar, Heart, MessageSquare, LogOut, ChevronRight, Loader2, Compass } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user.role === "user") {
            setUser(data.user);
          } else if (data.authenticated) {
            // Redirect to appropriate dashboard if role mismatches
            router.push(data.user.role === "admin" ? "/admin/dashboard" : "/vendor/dashboard");
          } else {
            router.push("/login");
          }
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Dashboard check session error:", err);
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
        <p className="text-slate-500 font-medium text-sm">Securing dashboard connection...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 pt-28 pb-16 font-body relative overflow-hidden">
        {/* Background orbs */}
        <div
          className="absolute w-[35rem] h-[35rem] -top-32 -left-32 opacity-20 pointer-events-none rounded-full"
          style={{ background: "var(--sw-orange)", filter: "blur(120px)" }}
        />
        <div
          className="absolute w-[30rem] h-[30rem] -bottom-32 -right-32 opacity-15 pointer-events-none rounded-full"
          style={{ background: "var(--sw-gold)", filter: "blur(120px)" }}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          >
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600 px-3 py-1 rounded-full bg-orange-50 border border-orange-100">
                Couple Portal
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 font-serif">
                Hello, {user.name}!
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Plan your dream wedding, track bookings, and connect with verified partners.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:text-red-600 hover:bg-red-50 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer self-start md:self-auto"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </motion.div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Quick Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1 flex flex-col gap-6"
            >
              <div
                className="rounded-3xl p-6 relative overflow-hidden"
                style={{
                  background: "rgba(255, 255, 255, 0.75)",
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(24px)",
                  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold text-xl uppercase shadow-md">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{user.name}</h3>
                    <p className="text-xs text-slate-400 font-semibold capitalize mt-0.5">{user.role} Member</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-t border-slate-100 pt-5">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 flex-shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="text-slate-650 truncate">{user.email}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 flex-shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="text-slate-650">{user.phone || "No phone added"}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 flex-shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span className="text-slate-650">Joined {new Date().toLocaleDateString(undefined, {month: 'long', year: 'numeric'})}</span>
                  </div>
                </div>

                <button className="w-full mt-6 bg-slate-900 text-white hover:bg-slate-800 py-3 rounded-2xl font-bold text-xs transition-colors shadow-sm cursor-pointer">
                  Edit Profile Settings
                </button>
              </div>

              {/* Planning Progress Widget */}
              <div
                className="rounded-3xl p-6"
                style={{
                  background: "rgba(255, 255, 255, 0.75)",
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(24px)",
                  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.04)",
                }}
              >
                <h4 className="font-bold text-slate-800 text-sm mb-4">Your Wedding Prep</h4>
                <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                  <span>Profile Completion</span>
                  <span className="text-orange-600">65%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-5">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full w-[65%]" />
                </div>
                <ul className="text-xs text-slate-600 flex flex-col gap-2.5">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Verify Email Address ✓
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Register account login keys ✓
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Save 3 wedding venues
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" /> Book your first vendor
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Right Column: Bookings & Shortcuts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="lg:col-span-2 flex flex-col gap-6"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Saved Venues", count: "0", icon: Heart, color: "from-pink-500 to-rose-500" },
                  { label: "Bookings", count: "0", icon: Calendar, color: "from-blue-500 to-indigo-500" },
                  { label: "Enquiries", count: "0", icon: MessageSquare, color: "from-amber-500 to-orange-500" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-3xl bg-white border border-slate-100 flex flex-col gap-3 relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-2xl font-black text-slate-800">{stat.count}</span>
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${stat.color} text-white flex items-center justify-center flex-shrink-0 shadow-sm`}>
                        <stat.icon className="w-4 h-4" />
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Bookings Section */}
              <div
                className="rounded-3xl p-6 flex flex-col gap-5 min-h-[300px]"
                style={{
                  background: "rgba(255, 255, 255, 0.75)",
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(24px)",
                  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800 text-base">Upcoming Bookings</h3>
                  <button className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-0.5 cursor-pointer">
                    View All <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Empty State */}
                <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-3">
                    <Compass className="w-6 h-6 animate-pulse" />
                  </div>
                  <h4 className="font-bold text-slate-700 text-sm">No upcoming bookings yet</h4>
                  <p className="text-xs text-slate-400 max-w-xs mt-1">
                    Start by browsing our premium verified vendors list and request availability.
                  </p>
                  <Link
                    href="/vendors"
                    className="mt-4 px-5 py-2.5 bg-orange-550 text-white rounded-full text-xs font-bold shadow-sm hover:shadow-md transition-shadow hover:bg-orange-600"
                    style={{ background: "var(--sw-orange)" }}
                  >
                    Browse Vendors
                  </Link>
                </div>
              </div>
            </motion.div>

          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
