"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Mail, Phone, Building, MapPin, Star, MessageSquare, LogOut, Loader2, Sparkles, CheckCircle2, ShieldAlert } from "lucide-react";
import BookingCard from "@/components/booking/BookingCard";


interface VendorSession {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  businessName?: string;
  category: string;
  city: string;
}

export default function VendorDashboard() {
  const router = useRouter();
  const [vendor, setVendor] = useState<VendorSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [available, setAvailable] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch("/api/bookings");
        if (res.ok) {
          const data = await res.json();
          setBookings(data.bookings || []);
        }
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      }
    }

    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user.role === "vendor") {
            setVendor(data.user);
            fetchBookings();
          } else if (data.authenticated) {
            router.push(data.user.role === "admin" ? "/admin/dashboard" : "/dashboard");
          } else {
            router.push("/login");
          }
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Vendor dashboard session check error:", err);
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
        <p className="text-slate-500 font-medium text-sm">Securing vendor console...</p>
      </div>
    );
  }

  if (!vendor) return null;

  return (
    <>

      <div className="min-h-screen bg-slate-50 pt-28 pb-16 font-body relative overflow-hidden">
        {/* Background decorative orbs */}
        <div
          className="absolute w-[35rem] h-[35rem] -top-32 -left-32 opacity-25 pointer-events-none rounded-full"
          style={{ background: "var(--sw-orange)", filter: "blur(120px)" }}
        />
        <div
          className="absolute w-[30rem] h-[30rem] -bottom-32 -right-32 opacity-20 pointer-events-none rounded-full"
          style={{ background: "var(--sw-gold)", filter: "blur(120px)" }}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          
          {/* Header section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          >
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 px-3 py-1 rounded-full bg-amber-50 border border-amber-100">
                Partner Console
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 font-serif">
                {vendor.businessName || "Your Business Workspace"}
              </h1>
              <p className="text-slate-550 text-sm mt-1">
                Manage your profile, showcase catalog, and track leads in your destination city.
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

          {/* Verification Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-amber-50/70 border border-amber-200 rounded-3xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Account verification is pending</h4>
                <p className="text-xs text-slate-550 mt-0.5">
                  Platform administrators will verify your business registry credentials soon. You can build your page in the meantime.
                </p>
              </div>
            </div>
            <button className="text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap">
              Submit Docs
            </button>
          </motion.div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Info Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="lg:col-span-1 flex flex-col gap-6"
            >
              <div
                className="rounded-3xl p-6"
                style={{
                  background: "rgba(255, 255, 255, 0.75)",
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(24px)",
                  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.04)",
                }}
              >
                <h3 className="font-bold text-slate-800 text-base mb-4">Business Details</h3>
                
                <div className="flex flex-col gap-4 border-t border-slate-100 pt-4">
                  <div className="flex items-start gap-3 text-sm">
                    <Building className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Brand Name</p>
                      <p className="text-slate-800 font-bold mt-0.5">{vendor.businessName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Category & City</p>
                      <p className="text-slate-800 font-bold mt-0.5">{vendor.category} — {vendor.city}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <User className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Contact Representative</p>
                      <p className="text-slate-800 font-medium mt-0.5">{vendor.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <Mail className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Email Address</p>
                      <p className="text-slate-800 font-medium mt-0.5 truncate max-w-[200px]">{vendor.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <Phone className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Phone Number</p>
                      <p className="text-slate-800 font-medium mt-0.5">{vendor.phone || "Not specified"}</p>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-6 bg-slate-900 text-white hover:bg-slate-800 py-3 rounded-2xl font-bold text-xs transition-colors shadow-sm cursor-pointer">
                  Modify Showcase Page
                </button>
              </div>

              {/* Availability Status widget */}
              <div
                className="rounded-3xl p-6"
                style={{
                  background: "rgba(255, 255, 255, 0.75)",
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(24px)",
                  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-slate-800 text-sm">Accepting Enquiries</h4>
                  <div
                    onClick={() => setAvailable(!available)}
                    className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors ${available ? "bg-emerald-500" : "bg-slate-300"}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transition-transform ${available ? "translate-x-5" : "translate-x-0"}`} />
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  When toggled off, couples won't be able to request pricing proposals or submit booking enquiries for your services on the platform.
                </p>
              </div>
            </motion.div>

            {/* Right Column Hub stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 flex flex-col gap-6"
            >
              {/* Performance stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Partner Rating", count: "New", icon: Star, color: "from-amber-400 to-amber-500" },
                  { label: "Reviews", count: "0", icon: MessageSquare, color: "from-blue-500 to-indigo-500" },
                  { label: "Total Leads", count: "0", icon: Sparkles, color: "from-emerald-400 to-teal-500" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-3xl bg-white border border-slate-100 flex flex-col gap-3 relative overflow-hidden group shadow-sm hover:shadow-md transition-all"
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

              {/* Inquiries / leads container */}
              <div
                className="rounded-3xl p-6 flex flex-col gap-5 min-h-[320px]"
                style={{
                  background: "rgba(255, 255, 255, 0.75)",
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(24px)",
                  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800 text-base">Booking Inquiries</h3>
                  <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                    {bookings.length} Active Leads
                  </span>
                </div>

                {bookings.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-3">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-slate-700 text-sm">All caught up!</h4>
                    <p className="text-xs text-slate-400 max-w-xs mt-1">
                      No active couple requests currently. Complete your showcase page profile to start appearing in search queries.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 overflow-y-auto pr-1">
                    {bookings.map((booking) => (
                      <BookingCard key={booking._id} booking={booking} isVendor={true} />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

          </div>
        </main>
      </div>

    </>
  );
}
