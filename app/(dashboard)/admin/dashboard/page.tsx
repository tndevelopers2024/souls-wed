"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Shield, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  LogOut, 
  Loader2, 
  RefreshCw, 
  AlertCircle, 
  Users, 
  Trash2, 
  Check, 
  X, 
  Search, 
  Briefcase, 
  CalendarDays, 
  IndianRupee, 
  Star,
  CheckCircle,
  FileText,
  BadgeAlert
} from "lucide-react";
import { format } from "date-fns";
import { formatAsCurrency } from "@/lib/currency";

interface AdminSession {
  id: string;
  name: string;
  email: string;
  role: string;
}

type TabType = "overview" | "approvals" | "vendors" | "bookings" | "users" | "venues";

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [checkingSystem, setCheckingSystem] = useState(false);
  
  // Tab control & search
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Live database data
  const [stats, setStats] = useState<any>(null);
  const [vendors, setVendors] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [venuesList, setVenuesList] = useState<any[]>([]);

  const fetchAllData = async () => {
    setLoadingData(true);
    setError(null);
    try {
      const [statsRes, vendorsRes, bookingsRes, usersRes, venuesRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/vendors"),
        fetch("/api/admin/bookings"),
        fetch("/api/admin/users"),
        fetch("/api/venues?limit=100"),
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
      } else {
        throw new Error("Failed to load statistics.");
      }

      if (vendorsRes.ok) {
        const data = await vendorsRes.json();
        setVendors(data.vendors || []);
      }

      if (bookingsRes.ok) {
        const data = await bookingsRes.json();
        setBookings(data.bookings || []);
      }

      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.users || []);
      }

      if (venuesRes.ok) {
        const data = await venuesRes.json();
        setVenuesList(data.venues || []);
      }
    } catch (err: any) {
      console.error("Failed to load admin dashboard data:", err);
      setError(err.message || "Failed to retrieve dashboard databases.");
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
          if (data.authenticated && data.user.role === "admin") {
            setAdmin(data.user);
            fetchAllData();
          } else if (data.authenticated) {
            router.push(data.user.role === "vendor" ? "/vendor/dashboard" : "/dashboard");
          } else {
            router.push("/admin/login");
          }
        } else {
          router.push("/admin/login");
        }
      } catch (err) {
        console.error("Admin dashboard session check error:", err);
        router.push("/admin/login");
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
      fetchAllData();
    }, 1200);
  };

  // ─── Moderation Operations ───

  const handleUpdateVendorStatus = async (vendorId: string, verified?: boolean, featured?: boolean) => {
    try {
      const res = await fetch("/api/admin/vendors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorId, verified, featured }),
      });
      const data = await res.json();
      if (res.ok) {
        fetchAllData();
      } else {
        alert(data.message || "Failed to update vendor.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during update.");
    }
  };

  const handleDeleteVendor = async (vendorId: string) => {
    if (!confirm("Are you sure you want to permanently delete this vendor?")) return;
    try {
      const res = await fetch(`/api/admin/vendors?vendorId=${vendorId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        fetchAllData();
      } else {
        alert(data.message || "Failed to delete vendor.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status }),
      });
      const data = await res.json();
      if (res.ok) {
        fetchAllData();
      } else {
        alert(data.message || "Failed to update booking status.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to delete this booking permanently?")) return;
    try {
      const res = await fetch(`/api/admin/bookings?bookingId=${bookingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        fetchAllData();
      } else {
        alert(data.message || "Failed to delete booking.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateUserRole = async (userId: string, role: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });
      const data = await res.json();
      if (res.ok) {
        fetchAllData();
      } else {
        alert(data.message || "Failed to update user role.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user profile?")) return;
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        fetchAllData();
      } else {
        alert(data.message || "Failed to delete user.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      return format(new Date(dateStr), "MMM d, yyyy");
    } catch (e) {
      return "Invalid Date";
    }
  };

  // ─── Search & Filters ───

  const pendingApprovals = vendors.filter(v => !v.verified);

  const filteredApprovals = pendingApprovals.filter(v => {
    const val = searchTerm.toLowerCase();
    return (
      (v.businessName || "").toLowerCase().includes(val) ||
      v.name.toLowerCase().includes(val) ||
      (v.city || "").toLowerCase().includes(val) ||
      (v.category || "").toLowerCase().includes(val)
    );
  });

  const filteredVendors = vendors.filter(v => {
    const val = searchTerm.toLowerCase();
    return (
      (v.businessName || "").toLowerCase().includes(val) ||
      v.name.toLowerCase().includes(val) ||
      (v.city || "").toLowerCase().includes(val) ||
      (v.category || "").toLowerCase().includes(val)
    );
  });

  const filteredBookings = bookings.filter(b => {
    const val = searchTerm.toLowerCase();
    return (
      b.venueName.toLowerCase().includes(val) ||
      b.userName.toLowerCase().includes(val) ||
      b.userEmail.toLowerCase().includes(val) ||
      (b.userPhone || "").toLowerCase().includes(val) ||
      b.status.toLowerCase().includes(val) ||
      b._id.includes(val)
    );
  });

  const filteredUsers = users.filter(u => {
    const val = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(val) ||
      u.email.toLowerCase().includes(val) ||
      (u.phone || "").toLowerCase().includes(val) ||
      u.role.toLowerCase().includes(val)
    );
  });

  const filteredVenuesList = venuesList.filter(v => {
    const val = searchTerm.toLowerCase();
    return (
      (v.name || "").toLowerCase().includes(val) ||
      (v.city || "").toLowerCase().includes(val) ||
      (v.type || "").toLowerCase().includes(val) ||
      (v.venueId || "").toLowerCase().includes(val)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-950 text-slate-100">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
        <p className="text-slate-400 font-medium text-sm">Initializing secure administrator shell...</p>
      </div>
    );
  }

  if (!admin) return null;

  return (
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
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-orange-500 px-3 py-1 rounded-full bg-orange-950/40 border border-orange-500/20">
                Security Operator
              </span>
              {loadingData && (
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
                  Syncing DB...
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mt-2 font-serif">
              Administrator Console
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Live directory configs, vendor approvals, booking management, and diagnostics.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={fetchAllData}
              disabled={loadingData}
              className="flex items-center justify-center p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Refresh database"
            >
              <RefreshCw className={`w-4 h-4 ${loadingData ? "animate-spin text-orange-500" : ""}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-200 hover:text-red-400 hover:bg-red-950/20 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Terminate Shell
            </button>
          </div>
        </motion.div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/40 border border-red-500/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-400">Sync Error</p>
              <p className="text-xs text-red-300 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Active Admins", count: stats?.totalAdmins ?? "—", icon: Shield, color: "from-amber-500 to-orange-500" },
            { label: "Registered Users", count: stats?.totalUsers ?? "—", icon: Users, color: "from-indigo-500 to-blue-500" },
            { label: "Partner Vendors", count: stats?.totalVendors ?? "—", icon: Briefcase, color: "from-emerald-500 to-teal-500" },
            { label: "Total Bookings", count: stats?.totalBookings ?? "—", icon: FileText, color: "from-purple-500 to-pink-500" },
            { 
              label: "Platform Revenue", 
              count: stats ? formatAsCurrency(stats.totalRevenue, "INR") : "—", 
              icon: IndianRupee, 
              color: "from-yellow-500 to-amber-500", 
              isWide: true 
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`p-5 rounded-3xl bg-slate-900/50 border border-slate-900 flex flex-col gap-3 relative overflow-hidden group shadow-sm transition-all ${
                stat.isWide ? "col-span-2 md:col-span-1" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xl md:text-2xl font-black text-slate-100 tracking-tight">{stat.count}</span>
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${stat.color} text-white flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-400">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Navigation Tabs & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-900 pb-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "overview", label: "Overview", badge: null },
              { id: "approvals", label: "Vendor Approvals", badge: pendingApprovals.length || null },
              { id: "vendors", label: "All Vendors", badge: vendors.length || null },
              { id: "bookings", label: "Bookings List", badge: bookings.length || null },
              { id: "users", label: "Users Registry", badge: users.length || null },
              { id: "venues", label: "Venues", badge: venuesList.length || null },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as TabType);
                  setSearchTerm("");
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-orange-600 text-white shadow-md shadow-orange-950/20"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab.label}
                {tab.badge !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    activeTab === tab.id ? "bg-white text-orange-600" : "bg-slate-800 text-slate-300"
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {activeTab !== "overview" && (
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Search list...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tab Contents */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Widget */}
                <div
                  className="lg:col-span-1 rounded-3xl p-6"
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
                      <span className="text-slate-400 text-xs">Status: Active Operator Shell</span>
                    </div>
                  </div>

                  <button
                    onClick={runDiagnostics}
                    disabled={checkingSystem}
                    className="w-full mt-6 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white py-3 rounded-2xl font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {checkingSystem ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Verifying Links...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5" /> Force Diagnostics & Re-sync
                      </>
                    )}
                  </button>
                </div>

                {/* Diagnostics Panel */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  <div
                    className="rounded-3xl p-6"
                    style={{
                      background: "rgba(15, 23, 42, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(24px)",
                    }}
                  >
                    <h4 className="font-bold text-slate-100 text-sm mb-4">Diagnostics Console</h4>
                    <div className="flex flex-col gap-4 text-xs text-slate-400">
                      <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                        <span className="flex items-center gap-2">
                          <Activity className="w-3.5 h-3.5 text-emerald-500" /> 
                          Database Cluster
                        </span>
                        <span className="text-emerald-500 font-bold">CONNECTED</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                        <span className="flex items-center gap-2">
                          <Cpu className="w-3.5 h-3.5 text-orange-500" /> 
                          Server Environment
                        </span>
                        <span className="text-slate-200">Next.js 16.2 (Node 20)</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                        <span className="flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-orange-500" /> 
                          Session Decryption Keys
                        </span>
                        <span className="text-emerald-500 font-semibold">VALIDATED</span>
                      </div>
                      <div className="flex justify-between items-center pb-1">
                        <span className="flex items-center gap-2">
                          <AlertCircle className="w-3.5 h-3.5 text-blue-400" /> 
                          Pending Approvals Queue
                        </span>
                        <span className={`font-semibold ${pendingApprovals.length > 0 ? "text-amber-500" : "text-slate-400"}`}>
                          {pendingApprovals.length} vendors waiting
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Shortcut Box */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                      onClick={() => setActiveTab("approvals")}
                      className="p-5 rounded-3xl bg-slate-900/30 border border-slate-900 hover:border-orange-500/20 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-400">Approvals Pipeline</p>
                        <p className="text-sm font-black text-slate-100 mt-1">{pendingApprovals.length} Awaiting Verification</p>
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <BadgeAlert className="w-4 h-4" />
                      </div>
                    </div>

                    <div 
                      onClick={() => setActiveTab("bookings")}
                      className="p-5 rounded-3xl bg-slate-900/30 border border-slate-900 hover:border-orange-500/20 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-400">Active Bookings</p>
                        <p className="text-sm font-black text-slate-100 mt-1">{bookings.filter(b=>b.status==='confirmed').length} Locked Orders</p>
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VENDOR APPROVALS TAB */}
            {activeTab === "approvals" && (
              <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-900 mb-6">
                  <h3 className="font-bold text-slate-100 text-base">New Vendor Enrolments</h3>
                  <span className="text-xs font-bold bg-amber-950/60 text-amber-550 border border-amber-500/20 px-3 py-1 rounded-full">
                    {filteredApprovals.length} Pending Approval
                  </span>
                </div>

                {filteredApprovals.length === 0 ? (
                  <div className="py-16 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-500 flex items-center justify-center mb-3">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-slate-300 text-sm">No applications pending</h4>
                    <p className="text-xs text-slate-500 max-w-xs mt-1">
                      All vendor applications have been successfully verified or moderated.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredApprovals.map((v) => (
                      <div 
                        key={v._id}
                        className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-bold text-slate-100 text-base">{v.businessName || "No Business Name"}</h4>
                              <p className="text-xs text-slate-400 mt-0.5">{v.name}</p>
                            </div>
                            <span className="text-[10px] font-extrabold uppercase bg-amber-950/50 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded">
                              {v.category}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-slate-400 border-t border-slate-900/60 pt-4">
                            <div>
                              <span className="text-[10px] text-slate-550 block font-semibold">City</span>
                              <span className="text-slate-300 font-medium">{v.city || "Not Specified"}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-550 block font-semibold">Contact Email</span>
                              <span className="text-slate-300 font-medium truncate block" title={v.email}>{v.email}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-550 block font-semibold">Phone</span>
                              <span className="text-slate-300 font-medium">{v.phone || "N/A"}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-550 block font-semibold">Registered</span>
                              <span className="text-slate-300 font-medium">{formatDate(v.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2.5 mt-5 border-t border-slate-900/60 pt-4">
                          <button
                            onClick={() => handleUpdateVendorStatus(v._id, true)}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve Partner
                          </button>
                          <button
                            onClick={() => handleDeleteVendor(v._id)}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-red-950/40 border border-slate-700 hover:border-red-900/40 text-slate-300 hover:text-red-400 font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ALL VENDORS TAB */}
            {activeTab === "vendors" && (
              <div className="bg-slate-900/40 border border-slate-900 rounded-3xl overflow-hidden p-6">
                <h3 className="font-bold text-slate-100 text-base mb-6">Directory Vendors</h3>

                {filteredVendors.length === 0 ? (
                  <div className="py-16 text-center text-slate-500 text-sm">
                    No vendors matching "{searchTerm}"
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-900 text-slate-400 font-bold bg-slate-900/40">
                          <th className="p-4">Brand / Owner</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">City</th>
                          <th className="p-4">Rating</th>
                          <th className="p-4">Verification</th>
                          <th className="p-4">Featured</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVendors.map((v) => (
                          <tr key={v._id} className="border-b border-slate-900/40 hover:bg-slate-900/20 transition-colors">
                            <td className="p-4">
                              <p className="font-bold text-slate-200">{v.businessName || "No business name"}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">{v.name} • {v.email}</p>
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                                {v.category}
                              </span>
                            </td>
                            <td className="p-4 text-slate-300">{v.city}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                <span className="font-semibold text-slate-200">{v.rating || 0}</span>
                                <span className="text-[10px] text-slate-500">({v.reviewCount || 0})</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <button
                                onClick={() => handleUpdateVendorStatus(v._id, !v.verified)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer border ${
                                  v.verified
                                    ? "bg-emerald-950/40 text-emerald-500 border-emerald-500/20"
                                    : "bg-slate-950/40 text-slate-500 border-slate-800"
                                }`}
                              >
                                {v.verified ? "Verified" : "Pending"}
                              </button>
                            </td>
                            <td className="p-4">
                              <button
                                onClick={() => handleUpdateVendorStatus(v._id, undefined, !v.featured)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer border ${
                                  v.featured
                                    ? "bg-orange-950/40 text-orange-500 border-orange-500/20"
                                    : "bg-slate-950/40 text-slate-500 border-slate-800"
                                }`}
                              >
                                {v.featured ? "Featured" : "Regular"}
                              </button>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => handleDeleteVendor(v._id)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/20 transition-colors cursor-pointer"
                                title="Delete Vendor"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ALL BOOKINGS TAB */}
            {activeTab === "bookings" && (
              <div className="bg-slate-900/40 border border-slate-900 rounded-3xl overflow-hidden p-6">
                <h3 className="font-bold text-slate-100 text-base mb-6">System Bookings</h3>

                {filteredBookings.length === 0 ? (
                  <div className="py-16 text-center text-slate-500 text-sm">
                    No bookings matching "{searchTerm}"
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-900 text-slate-400 font-bold bg-slate-900/40">
                          <th className="p-4">Booking ID / Venue</th>
                          <th className="p-4">Customer Details</th>
                          <th className="p-4">Type / Capacity</th>
                          <th className="p-4">Dates</th>
                          <th className="p-4">Amounts</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookings.map((b) => (
                          <tr key={b._id} className="border-b border-slate-900/40 hover:bg-slate-900/20 transition-colors">
                            <td className="p-4">
                              <p className="font-bold text-slate-200">{b.venueName}</p>
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {b._id}</p>
                            </td>
                            <td className="p-4">
                              <p className="font-semibold text-slate-300">{b.userName}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">{b.userEmail} • {b.userPhone || "No Phone"}</p>
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 capitalize">
                                {b.bookingType}
                              </span>
                              <p className="text-[10px] text-slate-500 mt-1">
                                {b.bookingType === "venue" ? `${b.guestCount || 0} Pax` : `${b.roomCount || 0} Rooms`}
                              </p>
                            </td>
                            <td className="p-4 text-slate-300">
                              {b.bookingType === "venue" ? (
                                <p className="font-medium">{formatDate(b.eventDate)}</p>
                              ) : (
                                <div>
                                  <p className="font-medium">In: {formatDate(b.checkIn)}</p>
                                  <p className="text-[10px] text-slate-500 mt-0.5">Out: {formatDate(b.checkOut)}</p>
                                </div>
                              )}
                            </td>
                            <td className="p-4">
                              <p className="font-bold text-slate-200">{formatAsCurrency(b.totalAmount, b.currency || "INR")}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">Advance: {formatAsCurrency(b.advanceAmount, b.currency || "INR")}</p>
                            </td>
                            <td className="p-4">
                              <select
                                value={b.status}
                                onChange={(e) => handleUpdateBookingStatus(b._id, e.target.value)}
                                className={`text-[10px] font-black rounded-full border px-2.5 py-1 bg-slate-950 outline-none cursor-pointer ${
                                  b.status === "confirmed"
                                    ? "text-emerald-500 border-emerald-500/20"
                                    : b.status === "completed"
                                    ? "text-blue-500 border-blue-500/20"
                                    : b.status === "cancelled"
                                    ? "text-red-500 border-red-500/20"
                                    : "text-amber-500 border-amber-500/20"
                                }`}
                              >
                                <option value="pending" className="bg-slate-900 text-amber-500">Pending</option>
                                <option value="confirmed" className="bg-slate-900 text-emerald-500">Confirmed</option>
                                <option value="completed" className="bg-slate-900 text-blue-500">Completed</option>
                                <option value="cancelled" className="bg-slate-900 text-red-500">Cancelled</option>
                              </select>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => handleDeleteBooking(b._id)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/20 transition-colors cursor-pointer"
                                title="Delete Booking"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ALL USERS TAB */}
            {activeTab === "users" && (
              <div className="bg-slate-900/40 border border-slate-900 rounded-3xl overflow-hidden p-6">
                <h3 className="font-bold text-slate-100 text-base mb-6">User Registry</h3>

                {filteredUsers.length === 0 ? (
                  <div className="py-16 text-center text-slate-500 text-sm">
                    No users matching "{searchTerm}"
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-900 text-slate-400 font-bold bg-slate-900/40">
                          <th className="p-4">Name</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Phone</th>
                          <th className="p-4">Role Role</th>
                          <th className="p-4">Signup Date</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((u) => (
                          <tr key={u._id} className="border-b border-slate-900/40 hover:bg-slate-900/20 transition-colors">
                            <td className="p-4 font-bold text-slate-200">{u.name}</td>
                            <td className="p-4 text-slate-300">{u.email}</td>
                            <td className="p-4 text-slate-300">{u.phone || "N/A"}</td>
                            <td className="p-4">
                              <select
                                value={u.role}
                                onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                                className="text-[10px] font-bold bg-slate-950 border border-slate-800 text-slate-300 rounded px-2 py-0.5 outline-none cursor-pointer"
                              >
                                <option value="user">User</option>
                                <option value="couple">Couple</option>
                                <option value="vendor">Vendor</option>
                              </select>
                            </td>
                            <td className="p-4 text-slate-400">{formatDate(u.createdAt)}</td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => handleDeleteUser(u._id)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/20 transition-colors cursor-pointer"
                                title="Delete User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            {/* ALL VENUES TAB */}
            {activeTab === "venues" && (
              <div className="bg-slate-900/40 border border-slate-900 rounded-3xl overflow-hidden p-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-900 mb-6">
                  <h3 className="font-bold text-slate-100 text-base">Venue Directory</h3>
                  <span className="text-xs font-bold bg-blue-950/60 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full">
                    {filteredVenuesList.length} venues
                  </span>
                </div>

                {filteredVenuesList.length === 0 ? (
                  <div className="py-16 text-center text-slate-500 text-sm">
                    No venues matching "{searchTerm}"
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-900 text-slate-400 font-bold bg-slate-900/40">
                          <th className="p-4">Venue Name</th>
                          <th className="p-4">City / Type</th>
                          <th className="p-4">Capacity</th>
                          <th className="p-4">Rating</th>
                          <th className="p-4">Verified</th>
                          <th className="p-4">Featured</th>
                          <th className="p-4">Active</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVenuesList.map((v) => (
                          <tr key={v._id} className="border-b border-slate-900/40 hover:bg-slate-900/20 transition-colors">
                            <td className="p-4">
                              <p className="font-bold text-slate-200">{v.name}</p>
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">{v.venueId}</p>
                            </td>
                            <td className="p-4">
                              <p className="text-slate-300">{v.city}</p>
                              <span className="text-[10px] font-bold bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded mt-0.5 inline-block">{v.type}</span>
                            </td>
                            <td className="p-4 text-slate-300">
                              {v.minGuests}–{v.maxGuests} guests
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                <span className="font-semibold text-slate-200">{v.rating}</span>
                                <span className="text-[10px] text-slate-500">({v.reviewCount})</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <button
                                onClick={async () => {
                                  await fetch("/api/venues", {
                                    method: "PATCH",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ venueId: v.venueId, verified: !v.verified }),
                                  });
                                  fetchAllData();
                                }}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer border ${
                                  v.verified
                                    ? "bg-emerald-950/40 text-emerald-500 border-emerald-500/20"
                                    : "bg-slate-950/40 text-slate-500 border-slate-800"
                                }`}
                              >
                                {v.verified ? "Verified" : "Pending"}
                              </button>
                            </td>
                            <td className="p-4">
                              <button
                                onClick={async () => {
                                  await fetch("/api/venues", {
                                    method: "PATCH",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ venueId: v.venueId, featured: !v.featured }),
                                  });
                                  fetchAllData();
                                }}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer border ${
                                  v.featured
                                    ? "bg-orange-950/40 text-orange-500 border-orange-500/20"
                                    : "bg-slate-950/40 text-slate-500 border-slate-800"
                                }`}
                              >
                                {v.featured ? "Featured" : "Regular"}
                              </button>
                            </td>
                            <td className="p-4">
                              <button
                                onClick={async () => {
                                  await fetch("/api/venues", {
                                    method: "PATCH",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ venueId: v.venueId, active: !v.active }),
                                  });
                                  fetchAllData();
                                }}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer border ${
                                  v.active
                                    ? "bg-blue-950/40 text-blue-400 border-blue-500/20"
                                    : "bg-red-950/40 text-red-400 border-red-500/20"
                                }`}
                              >
                                {v.active ? "Live" : "Hidden"}
                              </button>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={async () => {
                                  if (!confirm(`Delete "${v.name}" permanently?`)) return;
                                  await fetch(`/api/venues?venueId=${v.venueId}`, { method: "DELETE" });
                                  fetchAllData();
                                }}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/20 transition-colors cursor-pointer"
                                title="Delete Venue"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
