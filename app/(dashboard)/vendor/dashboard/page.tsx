"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Star, 
  MessageSquare, 
  LogOut, 
  Loader2, 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert,
  Activity,
  Sliders,
  Calendar,
  Menu,
  X,
  RefreshCw,
  ChevronRight
} from "lucide-react";
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
      <div className="min-h-screen flex flex-col justify-center items-center bg-orange-50 text-stone-850">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
        <p className="font-bold text-base tracking-wide">SECURE WORKSPACE</p>
        <p className="text-stone-500 text-xs mt-1">Authenticating partner credentials...</p>
      </div>
    );
  }

  if (!vendor) return null;

  const menuItems = [
    { id: "overview", label: "Dashboard", icon: <Activity className="w-4 h-4" /> },
    { id: "leads", label: "Booking Inquiries", icon: <MessageSquare className="w-4 h-4" />, count: bookings.length || null },
    { id: "settings", label: "Business Profile", icon: <Sliders className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9] text-stone-850 font-body flex relative overflow-hidden p-0 sm:p-2">
      
      {/* Ambient background gradients */}
      <div className="absolute w-[50rem] h-[50rem] -top-96 -left-96 opacity-[0.05] pointer-events-none rounded-full bg-orange-500 blur-[120px]" />
      <div className="absolute w-[45rem] h-[45rem] -bottom-80 -right-80 opacity-[0.05] pointer-events-none rounded-full bg-amber-500 blur-[120px]" />

      {/* ─── FLOATING SIDEBAR (Desktop) ─── */}
      <aside className="hidden lg:flex flex-col w-64 border border-stone-200/60 bg-white/70 backdrop-blur-md rounded-3xl m-3 h-[calc(100vh-2rem)] sticky top-4 shrink-0 z-30 shadow-md">
        <div className="p-6 border-b border-stone-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md">
            <Building className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="font-extrabold text-stone-900 text-sm tracking-tight">SoulsWed</h2>
            <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Partner Portal</p>
          </div>
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
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/10" 
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
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

        <div className="p-4 border-t border-stone-100 bg-stone-50/50 rounded-b-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-700 border border-orange-200 flex items-center justify-center font-black text-sm shadow-sm">
              {vendor.businessName ? vendor.businessName.slice(0, 2).toUpperCase() : "VP"}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-stone-850 text-xs truncate">{vendor.businessName || vendor.name}</h4>
              <p className="text-[9px] font-bold text-stone-400 uppercase tracking-wider truncate">Partner Vendor</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-red-50 text-stone-600 hover:text-red-650 border border-stone-200 hover:border-red-200 rounded-xl text-[11px] font-bold transition-all cursor-pointer shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <div className="flex-1 min-w-0 flex flex-col p-3 gap-4 overflow-y-auto">
        
        {/* Floating Top Header */}
        <header className="bg-white/70 backdrop-blur-md border border-stone-200/60 rounded-2xl px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h1 className="font-extrabold text-stone-900 text-lg tracking-tight font-serif capitalize">
                {activeTab === "overview" ? (vendor.businessName || "Partner Dashboard") : menuItems.find(i=>i.id===activeTab)?.label}
              </h1>
              <p className="text-[10px] text-stone-500 font-semibold mt-0.5">
                {activeTab === "overview" ? "Manage your profile showcase, settings, and upcoming client bookings." : "Manage your vendor portal configuration."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={fetchBookings}
              disabled={loadingData}
              className="flex items-center justify-center gap-2 px-3 py-1.5 border border-stone-200 rounded-xl bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs shadow-sm cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync Leads</span>
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
              className="lg:hidden bg-white/90 backdrop-blur-md border border-stone-200 rounded-2xl p-4 shadow-lg flex flex-col gap-2 z-20"
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
              <hr className="border-stone-100 my-2" />
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 p-3 bg-red-50 text-red-700 font-bold rounded-xl text-xs"
              >
                <LogOut className="w-4 h-4" />
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
                <div className="bg-amber-50/60 border border-amber-250 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                      <ShieldAlert className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-850 text-xs">Account Verification Pending</h4>
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
                    <div className="rounded-3xl p-6 bg-white/70 backdrop-blur-md border border-stone-200/60 shadow-sm">
                      <h3 className="font-extrabold text-stone-850 text-sm mb-4">Business Profile</h3>
                      <div className="flex flex-col gap-4 border-t border-stone-100 pt-4 text-xs">
                        <div>
                          <span className="text-[10px] text-stone-400 block font-bold uppercase">Brand Name</span>
                          <span className="text-stone-800 font-semibold">{vendor.businessName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block font-bold uppercase">Category & City</span>
                          <span className="text-stone-800 font-semibold">{vendor.category} • {vendor.city}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block font-bold uppercase">Representative</span>
                          <span className="text-stone-800 font-semibold">{vendor.name}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block font-bold uppercase">Email Address</span>
                          <span className="text-stone-800 font-semibold">{vendor.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Availability Card */}
                    <div className="rounded-3xl p-6 bg-white/70 backdrop-blur-md border border-stone-200/60 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-extrabold text-stone-850 text-sm">Accepting Enquiries</h4>
                        <div
                          onClick={() => setAvailable(!available)}
                          className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors ${available ? "bg-emerald-500" : "bg-stone-300"}`}
                        >
                          <div className={`bg-white w-4 h-4 rounded-full shadow-md transition-transform ${available ? "translate-x-5" : "translate-x-0"}`} />
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
                        { label: "Partner Rating", count: "New", icon: <Star className="w-4.5 h-4.5 text-amber-500 fill-amber-500" /> },
                        { label: "Total Reviews", count: "0", icon: <MessageSquare className="w-4.5 h-4.5 text-blue-600" /> },
                        { label: "Active Leads", count: bookings.length, icon: <Sparkles className="w-4.5 h-4.5 text-emerald-600" /> },
                      ].map((stat, i) => (
                        <div
                          key={i}
                          className="p-5 rounded-3xl bg-white/75 backdrop-blur-md border border-stone-200/60 flex flex-col gap-3 relative overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-2xl font-black text-stone-900">{stat.count}</span>
                            <div className="p-2 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center">
                              {stat.icon}
                            </div>
                          </div>
                          <span className="text-xs font-bold text-stone-400">{stat.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Leads list section */}
                    <div className="rounded-3xl p-6 bg-white/70 backdrop-blur-md border border-stone-200/60 shadow-sm flex flex-col gap-5 min-h-[320px]">
                      <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                        <h3 className="font-extrabold text-stone-850 text-sm">Active Inquiries</h3>
                        <button 
                          onClick={() => setActiveTab("leads")}
                          className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-0.5 cursor-pointer"
                        >
                          View All Leads <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {bookings.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 border border-orange-200/60 flex items-center justify-center mb-3">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                          <h4 className="font-bold text-stone-700 text-sm">All Caught Up!</h4>
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
              <div className="rounded-3xl p-6 bg-white/70 backdrop-blur-md border border-stone-200/60 shadow-sm min-h-[400px] flex flex-col gap-5">
                <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                  <h3 className="font-extrabold text-stone-850 text-base">Booking Inquiries</h3>
                  <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-250 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {bookings.length} active leads
                  </span>
                </div>

                {bookings.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 border border-orange-200 flex items-center justify-center mb-3">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-stone-700 text-sm">No inquiries recorded</h4>
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
              <div className="rounded-3xl p-6 bg-white/70 backdrop-blur-md border border-stone-200/60 shadow-sm min-h-[400px]">
                <h3 className="font-extrabold text-stone-850 text-base pb-3 border-b border-stone-100 mb-6">Business Showcase Settings</h3>
                
                <div className="max-w-md flex flex-col gap-5 text-xs text-stone-700">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-stone-500 uppercase tracking-wider">Brand Name</label>
                    <input 
                      type="text" 
                      defaultValue={vendor.businessName} 
                      className="bg-white border border-stone-200 rounded-xl px-4 py-2.5 outline-none font-semibold text-stone-800" 
                      disabled
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-stone-500 uppercase tracking-wider">Category Category</label>
                    <input 
                      type="text" 
                      defaultValue={vendor.category} 
                      className="bg-white border border-stone-200 rounded-xl px-4 py-2.5 outline-none font-semibold text-stone-800" 
                      disabled
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-stone-500 uppercase tracking-wider">Base City Location</label>
                    <input 
                      type="text" 
                      defaultValue={vendor.city} 
                      className="bg-white border border-stone-200 rounded-xl px-4 py-2.5 outline-none font-semibold text-stone-800" 
                      disabled
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-stone-500 uppercase tracking-wider">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue={vendor.email} 
                      className="bg-white border border-stone-200 rounded-xl px-4 py-2.5 outline-none font-semibold text-stone-800" 
                      disabled
                    />
                  </div>
                  <p className="text-[10px] text-stone-400 font-medium">Business directory credentials are managed by administrators under listing sync policies.</p>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
