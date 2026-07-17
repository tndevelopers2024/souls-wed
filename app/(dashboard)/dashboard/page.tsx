"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, BookHeart, Settings, Lock, Save, Wand2, Eye, EyeOff, Loader2 } from "lucide-react";
import BookingCard from "@/components/booking/BookingCard";

interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

type TabType = "overview" | "bookings" | "settings";

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ text: "", type: "" });

  const generateStrongPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let pass = "";
    for (let i = 0; i < 16; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(pass);
    setShowPassword(true);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordMessage({ text: "New password must be at least 6 characters.", type: "error" });
      return;
    }
    setIsChangingPassword(true);
    setPasswordMessage({ text: "", type: "" });
    try {
      const res = await fetch("/api/auth/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordMessage({ text: "Password changed successfully!", type: "success" });
        setCurrentPassword("");
        setNewPassword("");
      } else {
        setPasswordMessage({ text: data.message || "Failed to change password.", type: "error" });
      }
    } catch (err) {
      setPasswordMessage({ text: "An error occurred.", type: "error" });
    }
    setIsChangingPassword(false);
  };

  const fetchBookings = async () => {
    setLoadingData(true);
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user.role === "user") {
            setUser(data.user);
            fetchBookings();
          } else if (data.authenticated) {
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
        setUser(null);
        router.push("/");
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-stone-50 dark:bg-[var(--sw-surface)]/5 text-stone-800 dark:text-stone-200 font-body">
        <div className="w-10 h-10 rounded-full border-2 border-primary-500/20 border-t-orange-500 animate-spin mb-4" />
        <p className="font-bold text-sm tracking-wide">SECURE ACCESS</p>
      </div>
    );
  }

  if (!user) return null;

  const menuItems = [
    { id: "overview", label: "My Hub", icon: LayoutDashboard },
    { id: "bookings", label: "My Bookings", count: bookings.length || null, icon: BookHeart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Clean & Simple UI Theme Classes
  const containerBg = "bg-slate-50/50 dark:bg-[var(--sw-surface)]/5 text-slate-800 dark:text-stone-200";
  const sidebarClass = "border-slate-100 dark:border-white/10 bg-white dark:bg-[var(--sw-surface)] text-slate-600 dark:text-stone-300 shadow-[0_2px_10px_rgba(0,0,0,0.02)]";
  const cardClass = "bg-white dark:bg-[var(--sw-surface)] border-slate-100 dark:border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-slate-700 dark:text-stone-300";
  const headerClass = "bg-white dark:bg-[var(--sw-surface)] border-slate-100 dark:border-white/10 text-slate-800 dark:text-stone-200";
  const headingText = "text-slate-900 dark:text-stone-100";
  const dividerClass = "border-slate-100 dark:border-white/10";

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[var(--sw-surface)]/5 font-body pt-32 pb-16 px-4">
      {/* Ambient Background Glows */}
      <div className="fixed w-[50rem] h-[50rem] -top-96 -left-96 opacity-[0.02] pointer-events-none rounded-full bg-primary-500 blur-[120px]" />
      <div className="fixed w-[45rem] h-[45rem] -bottom-80 -right-80 opacity-[0.02] pointer-events-none rounded-full bg-amber-500 blur-[120px]" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-stone-100 font-serif tracking-tight">
              {activeTab === "overview" ? `Welcome, ${user.name}!` : menuItems.find(i=>i.id===activeTab)?.label}
            </h1>
            <p className="text-sm text-slate-500 dark:text-stone-400 font-medium mt-1">
              {activeTab === "overview" ? "Plan your dream wedding, track bookings, and connect with partners." : "Manage your couple portal options."}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="self-start md:self-auto flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-[var(--sw-surface)] border border-slate-200 dark:border-white/10 shadow-sm text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-100 dark:border-red-500/20 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            Sign Out
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-6 border-b border-slate-200 dark:border-white/10 mb-8 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`flex items-center gap-2 pb-3 px-1 border-b-2 font-bold text-sm whitespace-nowrap transition-colors ${
                  isActive ? "border-primary-500 text-primary-600" : "border-transparent text-slate-500 dark:text-stone-400 hover:text-slate-800 dark:hover:text-stone-200 hover:border-slate-300"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
                {item.count !== undefined && item.count !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ml-1 ${isActive ? 'bg-primary-100 dark:bg-primary-500/15 text-primary-700' : 'bg-slate-100 dark:bg-[var(--sw-surface)]/10 text-slate-600 dark:text-stone-300'}`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab contents */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            
            {/* OVERVIEW SECTION */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Profile & Wedding Prep */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                  {/* Details card */}
                  <div className="bg-white dark:bg-[var(--sw-surface)] rounded-3xl p-6 border border-slate-100 dark:border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <h3 className="font-extrabold text-sm mb-4 text-slate-900 dark:text-stone-100">My Account Profile</h3>
                    <div className="flex flex-col gap-4 border-t border-slate-100 dark:border-white/10 pt-4 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 dark:text-stone-500 block font-bold uppercase">Name</span>
                        <span className="font-semibold text-slate-900 dark:text-stone-100">{user.name}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 dark:text-stone-500 block font-bold uppercase">Email Address</span>
                        <span className="font-semibold text-slate-900 dark:text-stone-100">{user.email}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 dark:text-stone-500 block font-bold uppercase">Phone Number</span>
                        <span className="font-semibold text-slate-900 dark:text-stone-100">{user.phone || "No phone added"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Prep status card */}
                  <div className="bg-white dark:bg-[var(--sw-surface)] rounded-3xl p-6 border border-slate-100 dark:border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <h4 className="font-extrabold text-sm mb-4 text-slate-900 dark:text-stone-100">Your Wedding Prep</h4>
                    <div className="flex justify-between text-xs font-semibold text-slate-400 dark:text-stone-500 mb-2">
                      <span>Profile Completion</span>
                      <span className="text-primary-600 font-bold">65%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full overflow-hidden mb-5 bg-slate-100 dark:bg-[var(--sw-surface)]/10 border border-slate-200 dark:border-white/10">
                      <div className="bg-gradient-to-r from-amber-500 to-primary-500 h-full rounded-full w-[65%]" />
                    </div>
                    <ul className="text-xs text-slate-500 dark:text-stone-400 flex flex-col gap-3">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Verify Email Address
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Secure user login verified
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Save 3 wedding venues
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" /> Book your first vendor
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Right Column: Performance stats & Bookings */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  {/* Floating Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { label: "Saved Venues", count: "0" },
                      { label: "Bookings", count: bookings.length },
                      { label: "Enquiries", count: "0" },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="bg-white dark:bg-[var(--sw-surface)] p-5 rounded-3xl border border-slate-100 dark:border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col gap-2"
                      >
                        <span className="text-3xl font-black text-slate-900 dark:text-stone-100">{stat.count}</span>
                        <span className="text-xs font-bold text-slate-400 dark:text-stone-500">{stat.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Upcoming bookings list */}
                  <div className="bg-white dark:bg-[var(--sw-surface)] rounded-3xl p-6 border border-slate-100 dark:border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col gap-5 min-h-[300px]">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-white/10">
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-stone-100">Upcoming Bookings</h3>
                      <button 
                        onClick={() => setActiveTab("bookings")}
                        className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-0.5 transition-colors"
                      >
                        View All
                      </button>
                    </div>

                    {bookings.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                        <h4 className="font-bold text-sm text-slate-700 dark:text-stone-300">No upcoming bookings yet</h4>
                        <p className="text-xs text-slate-400 dark:text-stone-500 max-w-xs mt-1 font-medium">
                          Start by browsing our premium verified venues directory.
                        </p>
                        <Link
                          href="/venues"
                          className="mt-5 px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-full text-xs font-bold transition-all shadow-sm"
                        >
                          Browse Venues
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-2">
                        {bookings.slice(0, 4).map((booking) => (
                          <div key={booking._id} className="w-full">
                            <BookingCard booking={booking} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* BOOKINGS LIST SECTION */}
            {activeTab === "bookings" && (
              <div className="bg-white dark:bg-[var(--sw-surface)] rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.02)] min-h-[400px] flex flex-col gap-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-white/10">
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-stone-100">Booking History</h3>
                  <span className="text-[10px] font-black border px-3 py-1 rounded-full uppercase tracking-wider bg-slate-50 dark:bg-[var(--sw-surface)]/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-stone-300">
                    {bookings.length} reservations
                  </span>
                </div>

                {bookings.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                    <h4 className="font-bold text-slate-700 dark:text-stone-300 text-sm">No bookings recorded</h4>
                    <p className="text-xs text-slate-400 dark:text-stone-500 max-w-xs mt-1 font-medium">
                      Checkouts and active vendor deposits will show here.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
                    {bookings.map((booking) => (
                      <div key={booking._id} className="w-full">
                        <BookingCard booking={booking} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SETTINGS SECTION */}
            {activeTab === "settings" && (
              <div className="bg-white dark:bg-[var(--sw-surface)] rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.02)] min-h-[400px]">
                <h3 className="font-extrabold text-lg pb-4 border-b mb-8 border-slate-100 dark:border-white/10 text-slate-900 dark:text-stone-100">Account Settings</h3>
                
                <div className="max-w-md flex flex-col gap-6 text-sm">
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-slate-500 dark:text-stone-400 uppercase tracking-wider text-[11px]">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue={user.name} 
                      className="border rounded-xl px-4 py-3 outline-none font-semibold bg-slate-50 dark:bg-[var(--sw-surface)]/5 border-slate-200 dark:border-white/10 text-slate-800 dark:text-stone-200" 
                      disabled
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-slate-500 dark:text-stone-400 uppercase tracking-wider text-[11px]">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue={user.email} 
                      className="border rounded-xl px-4 py-3 outline-none font-semibold bg-slate-50 dark:bg-[var(--sw-surface)]/5 border-slate-200 dark:border-white/10 text-slate-800 dark:text-stone-200" 
                      disabled
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-slate-500 dark:text-stone-400 uppercase tracking-wider text-[11px]">Phone</label>
                    <input 
                      type="text" 
                      placeholder="Add phone number" 
                      defaultValue={user.phone} 
                      className="border rounded-xl px-4 py-3 outline-none font-semibold bg-slate-50 dark:bg-[var(--sw-surface)]/5 border-slate-200 dark:border-white/10 text-slate-800 dark:text-stone-200" 
                      disabled
                    />
                  </div>
                  <p className="text-xs text-slate-400 dark:text-stone-500 font-medium mt-2 mb-4">Profile parameters are currently managed by the administrator directory sync.</p>
                  
                  <div className="pt-6 border-t border-slate-100 dark:border-white/10">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-stone-100 mb-4">Account Security</h4>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold mb-1 text-slate-500 dark:text-stone-400">Current Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-stone-500" />
                          <input
                            type="password"
                            required
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border rounded-xl text-sm outline-none transition-all bg-slate-50 dark:bg-[var(--sw-surface)]/5 border-slate-200 dark:border-white/10 focus:border-primary-400 text-slate-800 dark:text-stone-200"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-xs font-bold text-slate-500 dark:text-stone-400">New Password</label>
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
                          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-stone-500" />
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            minLength={6}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full pl-9 pr-10 py-2 border rounded-xl text-sm outline-none transition-all bg-slate-50 dark:bg-[var(--sw-surface)]/5 border-slate-200 dark:border-white/10 focus:border-primary-400 text-slate-800 dark:text-stone-200"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-slate-400 dark:text-stone-500 hover:text-slate-600 dark:hover:text-stone-300 transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      
                      {passwordMessage.text && (
                        <p className={`text-xs font-semibold p-2 rounded-lg ${passwordMessage.type === "error" ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400" : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"}`}>
                          {passwordMessage.text}
                        </p>
                      )}

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isChangingPassword}
                          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                        >
                          {isChangingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                          Update Password
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
