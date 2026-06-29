"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(saved);
  }, []);

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem("darkMode", String(next));
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
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-stone-50 text-stone-850 font-body">
        <div className="w-10 h-10 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin mb-4" />
        <p className="font-bold text-sm tracking-wide">SECURE ACCESS</p>
      </div>
    );
  }

  if (!user) return null;

  const menuItems = [
    { id: "overview", label: "My Hub" },
    { id: "bookings", label: "My Bookings", count: bookings.length || null },
    { id: "settings", label: "Settings" },
  ];

  // Dark Mode helper CSS classes (shadow-none)
  const containerBg = isDarkMode ? "bg-stone-955 text-stone-200" : "bg-[#fafaf9] text-stone-850";
  const sidebarClass = isDarkMode ? "border-stone-800 bg-stone-900/80 text-stone-300" : "border-stone-200/60 bg-white/70 text-stone-650";
  const cardClass = isDarkMode ? "bg-stone-900/60 border-stone-800/80 text-stone-300" : "bg-white/70 border-stone-200/60 text-stone-650";
  const headerClass = isDarkMode ? "bg-stone-900/70 border-stone-800/80 text-white" : "bg-white/70 border-stone-200/60 text-stone-855";
  const headingText = isDarkMode ? "text-white" : "text-stone-900";
  const dividerClass = isDarkMode ? "border-stone-800" : "border-stone-100";

  return (
    <div className={`min-h-screen font-body flex relative overflow-hidden p-0 sm:p-2 transition-colors duration-300 ${containerBg}`}>
      
      {/* Ambient backgrounds */}
      <div className="absolute w-[50rem] h-[50rem] -top-96 -left-96 opacity-[0.03] pointer-events-none rounded-full bg-orange-500 blur-[120px]" />
      <div className="absolute w-[45rem] h-[45rem] -bottom-80 -right-80 opacity-[0.03] pointer-events-none rounded-full bg-amber-500 blur-[120px]" />

      {/* ─── FLOATING SIDEBAR (Desktop) ─── */}
      <aside className={`hidden lg:flex flex-col w-64 border rounded-3xl m-3 h-[calc(100vh-2rem)] sticky top-4 shrink-0 z-30 shadow-none transition-all duration-300 ${sidebarClass}`}>
        <div className={`p-6 border-b flex flex-col gap-1 ${dividerClass}`}>
          <h2 className="font-extrabold text-stone-900 text-sm tracking-tight dark:text-white uppercase">SoulsWed</h2>
          <p className="text-[9px] font-bold text-orange-600 uppercase tracking-widest">Couple Portal</p>
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? "bg-orange-500 text-white" 
                    : isDarkMode 
                      ? "text-stone-400 hover:text-white hover:bg-stone-850"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                }`}
              >
                <span>{item.label}</span>
                {item.count !== undefined && item.count !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                    isActive ? "bg-white/20 text-white" : "bg-stone-100 text-stone-500 border border-stone-200"
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className={`p-4 border-t bg-stone-50/50 rounded-b-3xl ${dividerClass} ${isDarkMode ? 'bg-stone-900/30' : ''}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 border border-orange-200 text-orange-700 flex items-center justify-center font-black text-xs uppercase">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className={`font-bold text-xs truncate ${headingText}`}>{user.name}</h4>
              <p className="text-[9px] font-bold text-stone-400 uppercase tracking-wider truncate">Couple Member</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 border rounded-xl text-[11px] font-bold transition-all cursor-pointer shadow-none ${
              isDarkMode 
                ? "bg-stone-850 hover:bg-red-950/30 text-stone-305 border-stone-800 hover:border-red-900/60 hover:text-red-455"
                : "bg-white hover:bg-red-50 text-stone-600 hover:text-red-605 border border-stone-200 hover:border-red-200"
            }`}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <div className="flex-1 min-w-0 flex flex-col p-3 gap-4 overflow-y-auto">
        
        {/* Floating Top Header */}
        <header className={`border rounded-2xl px-6 py-4 flex items-center justify-between shadow-none transition-colors duration-300 ${headerClass}`}>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden px-3 py-1.5 rounded-xl border text-xs font-bold ${
                isDarkMode ? "border-stone-855 text-stone-300 hover:bg-stone-850" : "border-stone-200 hover:bg-stone-50"
              }`}
            >
              {mobileMenuOpen ? "[Close]" : "[Menu]"}
            </button>
            <div>
              <h1 className={`font-extrabold text-lg tracking-tight font-serif capitalize ${headingText}`}>
                {activeTab === "overview" ? `Welcome, ${user.name}!` : menuItems.find(i=>i.id===activeTab)?.label}
              </h1>
              <p className="text-[10px] text-stone-500 font-semibold mt-0.5">
                {activeTab === "overview" ? "Plan your dream wedding, track bookings, and connect with partners." : "Manage your couple portal options."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleDarkMode}
              className={`px-3 py-1.5 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isDarkMode 
                  ? "border-stone-800 bg-stone-900 text-amber-400 hover:bg-stone-800" 
                  : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
              }`}
            >
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </button>

            <button 
              onClick={fetchBookings}
              disabled={loadingData}
              className={`flex items-center justify-center gap-2 px-3 py-1.5 border rounded-xl font-bold text-xs shadow-none cursor-pointer disabled:opacity-50 ${
                isDarkMode 
                  ? "border-stone-800 bg-stone-900 text-stone-300 hover:bg-stone-800" 
                  : "border-stone-200 bg-white hover:bg-stone-50 text-stone-700"
              }`}
            >
              <span>Sync</span>
            </button>
          </div>
        </header>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`lg:hidden border rounded-2xl p-4 shadow-none flex flex-col gap-2 z-20 ${
                isDarkMode ? "bg-stone-900 border-stone-800 text-white" : "bg-white border-stone-200 text-stone-800"
              }`}
            >
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as TabType);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all ${
                    activeTab === item.id 
                      ? "bg-orange-500 text-white" 
                      : isDarkMode
                        ? "text-stone-305 hover:bg-stone-800"
                        : "text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.count !== undefined && item.count !== null && (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                      activeTab === item.id ? "bg-white/20 text-white" : "bg-stone-100 text-stone-600"
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
              <hr className={`my-2 ${dividerClass}`} />
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 p-3 bg-red-50 text-red-700 font-bold rounded-xl text-xs"
              >
                Sign Out
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab contents */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="flex-1"
          >
            
            {/* OVERVIEW SECTION */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Profile Card & Wedding Prep */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                  
                  {/* Business Details card */}
                  <div className={`rounded-3xl p-6 border shadow-none ${cardClass}`}>
                    <h3 className={`font-extrabold text-sm mb-4 ${headingText}`}>My Account Profile</h3>
                    <div className={`flex flex-col gap-4 border-t pt-4 text-xs ${dividerClass}`}>
                      <div>
                        <span className="text-[10px] text-stone-400 block font-bold uppercase">Name</span>
                        <span className={`font-semibold ${headingText}`}>{user.name}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block font-bold uppercase">Email Address</span>
                        <span className={`font-semibold ${headingText}`}>{user.email}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block font-bold uppercase">Phone Number</span>
                        <span className={`font-semibold ${headingText}`}>{user.phone || "No phone added"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Prep status card */}
                  <div className={`rounded-3xl p-6 border shadow-none ${cardClass}`}>
                    <h4 className={`font-extrabold text-sm mb-4 ${headingText}`}>Your Wedding Prep</h4>
                    <div className="flex justify-between text-xs font-semibold text-stone-400 mb-2">
                      <span>Profile Completion</span>
                      <span className="text-orange-655 font-bold">65%</span>
                    </div>
                    <div className={`w-full h-2.5 rounded-full overflow-hidden mb-5 border ${
                      isDarkMode ? "bg-stone-950 border-stone-850" : "bg-stone-100 border-stone-200/30"
                    }`}>
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full w-[65%]" />
                    </div>
                    <ul className="text-xs text-stone-500 flex flex-col gap-2.5">
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
                        <span className="w-1.5 h-1.5 rounded-full bg-stone-300" /> Book your first vendor
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Performance stats & Bookings grid */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  
                  {/* Floating Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Saved Venues", count: "0" },
                      { label: "Bookings", count: bookings.length },
                      { label: "Enquiries", count: "0" },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className={`p-5 rounded-3xl border flex flex-col gap-3 relative overflow-hidden group shadow-none transition-all duration-200 ${cardClass}`}
                      >
                        <span className={`text-2xl font-black ${headingText}`}>{stat.count}</span>
                        <span className="text-xs font-bold text-stone-400">{stat.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Upcoming bookings list */}
                  <div className={`rounded-3xl p-6 border shadow-none flex flex-col gap-5 min-h-[300px] ${cardClass}`}>
                    <div className={`flex justify-between items-center pb-2 border-b ${dividerClass}`}>
                      <h3 className={`font-extrabold text-sm ${headingText}`}>Upcoming Bookings</h3>
                      <button 
                        onClick={() => setActiveTab("bookings")}
                        className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-0.5 cursor-pointer"
                      >
                        View All
                      </button>
                    </div>

                    {bookings.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                        <h4 className={`font-bold text-sm ${isDarkMode ? 'text-stone-300' : 'text-slate-705'}`}>No upcoming bookings yet</h4>
                        <p className="text-xs text-stone-400 max-w-xs mt-1 font-medium">
                          Start by browsing our premium verified venues directory.
                        </p>
                        <Link
                          href="/venues"
                          className="mt-4 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-xs font-bold transition-all shadow-none"
                        >
                          Browse Venues
                        </Link>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 overflow-y-auto pr-1">
                        {bookings.slice(0, 3).map((booking) => (
                          <BookingCard key={booking._id} booking={booking} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* BOOKINGS LIST SECTION */}
            {activeTab === "bookings" && (
              <div className={`rounded-3xl p-6 border shadow-none min-h-[400px] flex flex-col gap-5 ${cardClass}`}>
                <div className={`flex justify-between items-center pb-2 border-b ${dividerClass}`}>
                  <h3 className={`font-extrabold text-base ${headingText}`}>Booking History</h3>
                  <span className={`text-[10px] font-black border px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    isDarkMode ? "bg-stone-850 border-stone-750 text-stone-300" : "bg-stone-100 border-stone-200 text-stone-600"
                  }`}>
                    {bookings.length} reservations total
                  </span>
                </div>

                {bookings.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                    <h4 className="font-bold text-stone-705 text-sm">No bookings recorded</h4>
                    <p className="text-xs text-stone-400 max-w-xs mt-1 font-medium">
                      Checkouts and active vendor deposits will show here.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {bookings.map((booking) => (
                      <BookingCard key={booking._id} booking={booking} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SETTINGS SECTION */}
            {activeTab === "settings" && (
              <div className={`rounded-3xl p-6 border shadow-none min-h-[400px] ${cardClass}`}>
                <h3 className={`font-extrabold text-base pb-3 border-b mb-6 ${dividerClass} ${headingText}`}>Account Settings</h3>
                
                <div className="max-w-md flex flex-col gap-5 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-stone-500 uppercase tracking-wider">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue={user.name} 
                      className={`border rounded-xl px-4 py-2.5 outline-none font-semibold ${
                        isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-850"
                      }`} 
                      disabled
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-stone-500 uppercase tracking-wider">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue={user.email} 
                      className={`border rounded-xl px-4 py-2.5 outline-none font-semibold ${
                        isDarkMode ? "bg-stone-955 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-850"
                      }`} 
                      disabled
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-stone-500 uppercase tracking-wider">Phone</label>
                    <input 
                      type="text" 
                      placeholder="Add phone number" 
                      defaultValue={user.phone} 
                      className={`border rounded-xl px-4 py-2.5 outline-none font-semibold ${
                        isDarkMode ? "bg-stone-955 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-850"
                      }`} 
                      disabled
                    />
                  </div>
                  <p className="text-[10px] text-stone-400 font-medium">Profile parameters are currently managed by the administrator directory sync.</p>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
