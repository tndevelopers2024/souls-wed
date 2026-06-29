"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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

type TabType = "overview" | "leads" | "settings";

export default function VendorDashboard() {
  const router = useRouter();
  const [vendor, setVendor] = useState<VendorSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [available, setAvailable] = useState(true);
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
      <div className="min-h-screen flex flex-col justify-center items-center bg-stone-50 text-stone-800 font-body">
        <div className="w-10 h-10 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin mb-4" />
        <p className="font-bold text-sm tracking-wide">SECURE WORKSPACE</p>
      </div>
    );
  }

  if (!vendor) return null;

  const menuItems = [
    { id: "overview", label: "Dashboard" },
    { id: "leads", label: "Booking Inquiries", count: bookings.length || null },
    { id: "settings", label: "Business Profile" },
  ];

  // Dark Mode helper CSS classes (corrected color classes to standard Tailwind tokens)
  const containerBg = isDarkMode ? "bg-stone-950 text-stone-200" : "bg-[#fafaf9] text-stone-800";
  const sidebarClass = isDarkMode ? "border-stone-800 bg-stone-900/80 text-stone-300" : "border-stone-200 bg-white/70 text-stone-600";
  const cardClass = isDarkMode ? "bg-stone-900/60 border-stone-800 text-stone-300" : "bg-white/70 border-stone-200 text-stone-600";
  const headerClass = isDarkMode ? "bg-stone-900/70 border-stone-800 text-white" : "bg-white/70 border-stone-200 text-stone-800";
  const headingText = isDarkMode ? "text-white" : "text-stone-900";
  const dividerClass = isDarkMode ? "border-stone-800" : "border-stone-100";

  return (
    <div className={`min-h-screen font-body flex relative overflow-hidden p-0 sm:p-2 transition-colors duration-300 ${containerBg}`}>
      
      {/* Ambient background gradients */}
      <div className="absolute w-[50rem] h-[50rem] -top-96 -left-96 opacity-[0.03] pointer-events-none rounded-full bg-orange-500 blur-[120px]" />
      <div className="absolute w-[45rem] h-[45rem] -bottom-80 -right-80 opacity-[0.03] pointer-events-none rounded-full bg-amber-500 blur-[120px]" />

      {/* ─── FLOATING SIDEBAR (Desktop) ─── */}
      <aside className={`hidden lg:flex flex-col w-64 border rounded-3xl m-3 h-[calc(100vh-2rem)] sticky top-4 shrink-0 z-30 shadow-none transition-all duration-300 ${sidebarClass}`}>
        <div className={`p-6 border-b flex flex-col gap-1 ${dividerClass}`}>
          <h2 className="font-extrabold text-stone-900 text-sm tracking-tight dark:text-white uppercase">SoulsWed</h2>
          <p className="text-[9px] font-bold text-orange-600 uppercase tracking-widest">Partner Portal</p>
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
                      ? "text-stone-400 hover:text-white hover:bg-stone-800/60"
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
              {vendor.businessName ? vendor.businessName.slice(0, 2) : "VP"}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className={`font-bold text-xs truncate ${headingText}`}>{vendor.businessName || vendor.name}</h4>
              <p className="text-[9px] font-bold text-stone-400 uppercase tracking-wider truncate">Partner Vendor</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 border rounded-xl text-[11px] font-bold transition-all cursor-pointer shadow-none ${
              isDarkMode 
                ? "bg-stone-800 hover:bg-red-950/30 text-stone-300 border-stone-700 hover:border-red-900/60 hover:text-red-400"
                : "bg-white hover:bg-red-50 text-stone-600 hover:text-red-600 border border-stone-200 hover:border-red-200"
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
                isDarkMode ? "border-stone-800 text-stone-300 hover:bg-stone-800" : "border-stone-200 hover:bg-stone-50"
              }`}
            >
              {mobileMenuOpen ? "[Close]" : "[Menu]"}
            </button>
            <div>
              <h1 className={`font-extrabold text-lg tracking-tight font-serif capitalize ${headingText}`}>
                {activeTab === "overview" ? (vendor.businessName || "Partner Dashboard") : menuItems.find(i=>i.id===activeTab)?.label}
              </h1>
              <p className="text-[10px] text-stone-500 font-semibold mt-0.5">
                {activeTab === "overview" ? "Manage your profile showcase, settings, and upcoming client bookings." : "Manage your vendor portal configuration."}
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
                        ? "text-stone-300 hover:bg-stone-800"
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
              <div className="flex flex-col gap-5">
                
                {/* Account verification warning banner */}
                <div className={`border rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-none ${
                  isDarkMode ? "bg-amber-950/10 border-amber-900/50" : "bg-amber-50/60 border-amber-200"
                }`}>
                  <div className="flex gap-3 text-xs font-semibold">
                    <div>
                      <h4 className={`font-bold ${headingText}`}>Account Verification Pending</h4>
                      <p className="text-[10px] text-stone-500 mt-0.5 font-medium">
                        Administrators will verify your brand details soon. Showcase catalog is active for updates.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column: Profile Card & Availability */}
                  <div className="lg:col-span-1 flex flex-col gap-6">
                    
                    {/* Business details card */}
                    <div className={`rounded-3xl p-6 border shadow-none ${cardClass}`}>
                      <h3 className={`font-extrabold text-sm mb-4 ${headingText}`}>Business Profile</h3>
                      <div className={`flex flex-col gap-4 border-t pt-4 text-xs ${dividerClass}`}>
                        <div>
                          <span className="text-[10px] text-stone-400 block font-bold uppercase">Brand Name</span>
                          <span className={`font-semibold ${headingText}`}>{vendor.businessName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block font-bold uppercase">Category & City</span>
                          <span className={`font-semibold ${headingText}`}>{vendor.category} • {vendor.city}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block font-bold uppercase">Representative</span>
                          <span className={`font-semibold ${headingText}`}>{vendor.name}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block font-bold uppercase">Email Address</span>
                          <span className={`font-semibold ${headingText}`}>{vendor.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Availability Card */}
                    <div className={`rounded-3xl p-6 border shadow-none ${cardClass}`}>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className={`font-extrabold text-sm ${headingText}`}>Accepting Enquiries</h4>
                        <div
                          onClick={() => setAvailable(!available)}
                          className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors ${available ? "bg-emerald-500" : "bg-stone-300"}`}
                        >
                          <div className={`bg-white w-4 h-4 rounded-full shadow-none transition-transform ${available ? "translate-x-5" : "translate-x-0"}`} />
                        </div>
                      </div>
                      <p className="text-[10px] text-stone-500 leading-relaxed font-medium">
                        Toggle visibility to accept or pause pricing requests from couples searching in {vendor.city}.
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Performance and Active Leads */}
                  <div className="lg:col-span-2 flex flex-col gap-6">
                    
                    {/* Performance grid */}
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: "Partner Rating", count: "New" },
                        { label: "Total Reviews", count: "0" },
                        { label: "Active Leads", count: bookings.length },
                      ].map((stat, i) => (
                        <div
                          key={i}
                          className={`p-5 rounded-3xl border flex flex-col gap-3 relative overflow-hidden group shadow-none transition-all duration-300 hover:-translate-y-0.5 ${cardClass}`}
                        >
                          <span className={`text-2xl font-black ${headingText}`}>{stat.count}</span>
                          <span className="text-xs font-bold text-stone-450">{stat.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Leads list section */}
                    <div className={`rounded-3xl p-6 border shadow-none flex flex-col gap-5 min-h-[320px] ${cardClass}`}>
                      <div className={`flex justify-between items-center pb-2 border-b ${dividerClass}`}>
                        <h3 className={`font-extrabold text-sm ${headingText}`}>Active Inquiries</h3>
                        <button 
                          onClick={() => setActiveTab("leads")}
                          className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-0.5 cursor-pointer"
                        >
                          View All Leads
                        </button>
                      </div>

                      {bookings.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                          <h4 className={`font-bold text-sm ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>All Caught Up!</h4>
                          <p className="text-xs text-stone-400 max-w-xs mt-1 font-medium">
                            No active couple requests currently. Complete your business information to start appearing in search queries.
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4 overflow-y-auto pr-1">
                          {bookings.slice(0, 3).map((booking) => (
                            <BookingCard key={booking._id} booking={booking} isVendor={true} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* LEADS LIST SECTION */}
            {activeTab === "leads" && (
              <div className={`rounded-3xl p-6 border shadow-none min-h-[400px] flex flex-col gap-5 ${cardClass}`}>
                <div className={`flex justify-between items-center pb-2 border-b ${dividerClass}`}>
                  <h3 className={`font-extrabold text-base ${headingText}`}>Booking Inquiries</h3>
                  <span className={`text-[10px] font-black border px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    isDarkMode ? "bg-emerald-950/20 text-emerald-400 border-emerald-900" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}>
                    {bookings.length} active leads
                  </span>
                </div>

                {bookings.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                    <h4 className="font-bold text-stone-705 text-sm">No inquiries recorded</h4>
                    <p className="text-xs text-stone-400 max-w-xs mt-1">
                      Couple checkout orders and price requests will show here.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {bookings.map((booking) => (
                      <BookingCard key={booking._id} booking={booking} isVendor={true} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SETTINGS SECTION */}
            {activeTab === "settings" && (
              <div className={`rounded-3xl p-6 border shadow-none min-h-[400px] ${cardClass}`}>
                <h3 className={`font-extrabold text-base pb-3 border-b mb-6 ${dividerClass} ${headingText}`}>Business Showcase Settings</h3>
                
                <div className="max-w-md flex flex-col gap-5 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-stone-500 uppercase tracking-wider">Brand Name</label>
                    <input 
                      type="text" 
                      defaultValue={vendor.businessName} 
                      className={`border rounded-xl px-4 py-2.5 outline-none font-semibold ${
                        isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-800"
                      }`} 
                      disabled
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-stone-500 uppercase tracking-wider">Category Category</label>
                    <input 
                      type="text" 
                      defaultValue={vendor.category} 
                      className={`border rounded-xl px-4 py-2.5 outline-none font-semibold ${
                        isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-800"
                      }`} 
                      disabled
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-stone-500 uppercase tracking-wider">Base City Location</label>
                    <input 
                      type="text" 
                      defaultValue={vendor.city} 
                      className={`border rounded-xl px-4 py-2.5 outline-none font-semibold ${
                        isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-800"
                      }`} 
                      disabled
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-stone-500 uppercase tracking-wider">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue={vendor.email} 
                      className={`border rounded-xl px-4 py-2.5 outline-none font-semibold ${
                        isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-800"
                      }`} 
                      disabled
                    />
                  </div>
                  <p className="text-[10px] text-stone-400 font-medium">Business credentials are managed by administrators under listing policies.</p>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
