"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { formatAsCurrency } from "@/lib/currency";
import { 
  Users, 
  Store, 
  Calendar, 
  DollarSign, 
  Activity, 
  Terminal, 
  Shield, 
  RefreshCw, 
  LogOut, 
  Check, 
  AlertCircle, 
  Sparkles, 
  MapPin, 
  Star, 
  Trash, 
  Lock, 
  Search, 
  Copy, 
  HelpCircle,
  Menu,
  X,
  CheckCircle,
  ChevronRight,
  TrendingUp,
  Sliders,
  Database,
  Sun,
  Moon
} from "lucide-react";

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
  
  // Copy state for feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);
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
            router.push("/admin");
          }
        } else {
          router.push("/admin");
        }
      } catch (err) {
        console.error("Admin dashboard session check error:", err);
        router.push("/admin");
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // ─── Dynamic Aggregations & Charts Data ───

  const getMonthlyStats = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    
    interface MonthlyAgg {
      monthName: string;
      year: number;
      monthIndex: number;
      bookings: number;
      revenue: number;
    }
    
    // Generate structure for the last 6 months
    const last6Months: MonthlyAgg[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      last6Months.push({
        monthName: months[d.getMonth()],
        year: d.getFullYear(),
        monthIndex: d.getMonth(),
        bookings: 0,
        revenue: 0,
      });
    }

    // Populate data dynamically from live bookings array
    bookings.forEach(b => {
      if (!b.createdAt) return;
      const date = new Date(b.createdAt);
      const m = date.getMonth();
      const y = date.getFullYear();
      
      const target = last6Months.find(item => item.monthIndex === m && item.year === y);
      if (target) {
        target.bookings += 1;
        if (b.status === "confirmed" || b.status === "completed") {
          target.revenue += b.advanceAmount || 0;
        }
      }
    });

    return last6Months.map(item => ({
      month: item.monthName,
      bookings: item.bookings,
      revenue: item.revenue,
    }));
  };

  const monthlyData = getMonthlyStats();
  const maxBookings = Math.max(...monthlyData.map(d => d.bookings), 1);
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue), 1);

  // Donut chart calculations
  const totalVenueBookings = bookings.filter(b => b.bookingType === "venue").length;
  const totalRoomBookings = bookings.filter(b => b.bookingType === "room").length;
  const venuePercentage = bookings.length ? Math.round((totalVenueBookings / bookings.length) * 100) : 0;
  const roomPercentage = bookings.length ? Math.round((totalRoomBookings / bookings.length) * 100) : 0;

  // Dynamic Activity Stream
  const getActivityFeed = () => {
    const activities: any[] = [];
    
    users.slice(0, 4).forEach(u => {
      activities.push({
        type: "user",
        title: "New Client Registered",
        desc: `${u.name} joined as a platform client`,
        time: u.createdAt,
        icon: <Users className="w-4 h-4 text-blue-600" />,
        bgColor: isDarkMode ? "bg-blue-950/40 border-blue-900/50" : "bg-blue-50 border-blue-200",
      });
    });

    vendors.slice(0, 4).forEach(v => {
      activities.push({
        type: "vendor",
        title: v.verified ? "Vendor Partner Active" : "Vendor Awaiting Action",
        desc: `${v.businessName || v.name} registered under ${v.category}`,
        time: v.createdAt,
        icon: <Store className="w-4 h-4 text-emerald-600" />,
        bgColor: v.verified 
          ? (isDarkMode ? "bg-emerald-950/40 border-emerald-900/50" : "bg-emerald-50 border-emerald-250") 
          : (isDarkMode ? "bg-amber-955/40 border-amber-900/50" : "bg-amber-50 border-amber-250"),
      });
    });

    bookings.slice(0, 4).forEach(b => {
      activities.push({
        type: "booking",
        title: `Order: ${b.status.toUpperCase()}`,
        desc: `${b.userName} booked ${b.venueName} (${formatAsCurrency(b.advanceAmount, "INR")} advance)`,
        time: b.createdAt,
        icon: <Calendar className="w-4 h-4 text-purple-600" />,
        bgColor: isDarkMode ? "bg-purple-950/40 border-purple-900/50" : "bg-purple-50 border-purple-200",
      });
    });

    return activities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 6);
  };

  const activities = getActivityFeed();

  // Filter arrays
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

  // Mobile menu control
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-orange-50 text-stone-800 font-body">
        <div className="w-12 h-12 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin mb-4" />
        <p className="text-orange-700 font-bold text-base tracking-wide">SECURE CONSOLE</p>
        <p className="text-stone-500 text-xs mt-1">Contacting databases & decrypting session keys...</p>
      </div>
    );
  }

  if (!admin) return null;

  const menuItems = [
    { id: "overview", label: "Overview", icon: <Activity className="w-4 h-4" />, count: null },
    { id: "approvals", label: "Approvals Queue", icon: <Shield className="w-4 h-4" />, count: pendingApprovals.length || null },
    { id: "vendors", label: "Vendors Directory", icon: <Store className="w-4 h-4" />, count: vendors.length || null },
    { id: "bookings", label: "Bookings Ledger", icon: <Calendar className="w-4 h-4" />, count: bookings.length || null },
    { id: "users", label: "Client Registry", icon: <Users className="w-4 h-4" />, count: users.length || null },
    { id: "venues", label: "Venues Directory", icon: <MapPin className="w-4 h-4" />, count: venuesList.length || null },
  ];

  // Dark Mode Style Classes helpers
  const containerBg = isDarkMode ? "bg-stone-950 text-stone-200" : "bg-[#fafaf9] text-stone-850";
  const sidebarClass = isDarkMode ? "border-stone-800 bg-stone-900/80 text-stone-300" : "border-stone-200/60 bg-white/70 backdrop-blur-md text-stone-600";
  const cardClass = isDarkMode ? "bg-stone-900/60 border-stone-800/80 text-stone-300" : "bg-white/70 border-stone-200/60 text-stone-650";
  const headerClass = isDarkMode ? "bg-stone-900/70 border-stone-800/80 text-white" : "bg-white/70 border-stone-200/60 text-stone-850";
  const headingText = isDarkMode ? "text-white" : "text-stone-900";
  const dividerClass = isDarkMode ? "border-stone-800" : "border-stone-100";
  const subCardClass = isDarkMode ? "bg-stone-950/60 border-stone-850" : "bg-[#fafaf9] border-stone-200";

  return (
    <div className={`min-h-screen font-body flex relative overflow-hidden p-0 sm:p-2 transition-colors duration-300 ${containerBg}`}>
      
      {/* Background Decorative Ambient Shapes */}
      <div className="absolute w-[50rem] h-[50rem] -top-96 -left-96 opacity-[0.06] pointer-events-none rounded-full bg-[#EE7429] blur-[150px]" />
      <div className="absolute w-[45rem] h-[45rem] -bottom-80 -right-80 opacity-[0.06] pointer-events-none rounded-full bg-[#FCCB11] blur-[150px]" />

      {/* ─── FLOATING SIDEBAR (Desktop) ─── */}
      <aside className={`hidden lg:flex flex-col w-64 border rounded-3xl m-3 h-[calc(100vh-2rem)] sticky top-4 shrink-0 z-30 shadow-md transition-all duration-300 ${sidebarClass}`}>
        {/* Branding header */}
        <div className={`p-6 border-b flex items-center gap-3 ${dividerClass}`}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md">
            <Lock className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="font-extrabold text-stone-900 text-sm tracking-tight dark:text-white">SoulsWed</h2>
            <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Admin Control</p>
          </div>
        </div>

        {/* Navigation Link list */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as TabType);
                  setSearchTerm("");
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/10" 
                    : isDarkMode
                      ? "text-stone-400 hover:text-white hover:bg-stone-800/60"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.count !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                    isActive 
                      ? "bg-white/20 text-white" 
                      : isDarkMode 
                        ? "bg-stone-800 text-stone-400 border border-stone-700"
                        : "bg-stone-100 text-stone-500 border border-stone-200"
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer profile info */}
        <div className={`p-4 border-t bg-stone-50/50 rounded-b-3xl ${dividerClass} ${isDarkMode ? 'bg-stone-900/30' : ''}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 border border-orange-200 text-orange-700 flex items-center justify-center font-black text-sm">
              {admin.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className={`font-bold text-xs truncate ${headingText}`}>{admin.name}</h4>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider truncate">{admin.role}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={handleLogout}
              className={`w-full flex items-center justify-center gap-2 px-3 py-2 border rounded-xl text-[11px] font-bold transition-all cursor-pointer shadow-sm ${
                isDarkMode 
                  ? "bg-stone-850 hover:bg-red-950/30 text-stone-300 border-stone-800 hover:border-red-900/60 hover:text-red-400" 
                  : "bg-white hover:bg-red-50 text-stone-600 hover:text-red-650 border border-stone-200 hover:border-red-200"
              }`}
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <div className="flex-1 min-w-0 flex flex-col p-3 gap-4 overflow-y-auto">

        {/* Floating Top Header */}
        <header className={`border rounded-2xl px-6 py-4 flex items-center justify-between shadow-sm transition-colors duration-300 ${headerClass}`}>
          <div className="flex items-center gap-4">
            {/* Mobile menu hamburger toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <div>
              <h1 className={`font-extrabold text-lg md:text-xl font-serif tracking-tight capitalize ${headingText}`}>
                {activeTab === "overview" ? "Analytics Command Room" : menuItems.find(i=>i.id===activeTab)?.label}
              </h1>
              <p className="text-[10px] text-stone-500 font-semibold mt-0.5">
                {loadingData ? "Fetching real-time updates..." : `Sync Status: Active • Operator: ${admin.name}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Dark Mode toggle */}
            <button 
              onClick={toggleDarkMode}
              className={`p-2 border rounded-xl shadow-sm transition-all cursor-pointer ${
                isDarkMode 
                  ? "border-stone-800 bg-stone-900 text-amber-400 hover:bg-stone-800" 
                  : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
              }`}
              title="Toggle Theme Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <button 
              onClick={fetchAllData}
              disabled={loadingData}
              className={`flex items-center justify-center gap-2 px-3.5 py-2 border rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50 ${
                isDarkMode 
                  ? "border-stone-800 bg-stone-900 text-stone-300 hover:bg-stone-800" 
                  : "border-stone-200 bg-white hover:bg-stone-50 text-stone-700"
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`lg:hidden border rounded-2xl px-6 py-4 absolute w-full top-[68px] z-30 shadow-lg flex flex-col gap-2 ${
                isDarkMode ? "bg-stone-900 border-stone-800 text-white" : "bg-white border-stone-200 text-stone-800"
              }`}
            >
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as TabType);
                    setSearchTerm("");
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
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.count !== null && (
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
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Error Notice */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex gap-3 items-start shadow-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-black">Sync Failure Encountered</p>
              <p className="text-[11px] text-red-650 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Dynamic Tab Panel */}
        <main className="flex-1 z-10 w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              
              {/* ─── TAB: OVERVIEW ─── */}
              {activeTab === "overview" && (
                <div className="flex flex-col gap-6">
                  
                  {/* Rich Stats Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {[
                      { 
                        title: "Total Revenue", 
                        value: formatAsCurrency(stats?.totalRevenue || 0, "INR"), 
                        change: "+12.4% vs last week", 
                        isUp: true, 
                        icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
                        bgColor: "bg-emerald-50/50 border-emerald-200" ,
                        darkBg: "bg-emerald-950/20 border-emerald-900/30 text-emerald-300"
                      },
                      { 
                        title: "Registered Users", 
                        value: stats?.totalUsers ?? "0", 
                        change: "+8.2% vs last month", 
                        isUp: true, 
                        icon: <Users className="w-5 h-5 text-blue-600" />,
                        bgColor: "bg-blue-50/50 border-blue-200",
                        darkBg: "bg-blue-950/20 border-blue-900/30 text-blue-300"
                      },
                      { 
                        title: "Partner Vendors", 
                        value: stats?.totalVendors ?? "0", 
                        change: `${pendingApprovals.length} waiting approvals`, 
                        isUp: pendingApprovals.length === 0, 
                        icon: <Store className="w-5 h-5 text-amber-600" />,
                        bgColor: "bg-amber-50/50 border-amber-250",
                        darkBg: "bg-amber-955/20 border-amber-900/30 text-amber-300"
                      },
                      { 
                        title: "Total Bookings", 
                        value: stats?.totalBookings ?? "0", 
                        change: `${bookings.filter(b=>b.status==='confirmed').length} confirmed orders`, 
                        isUp: true, 
                        icon: <Calendar className="w-5 h-5 text-purple-600" />,
                        bgColor: "bg-purple-50/50 border-purple-200",
                        darkBg: "bg-purple-950/20 border-purple-900/30 text-purple-300"
                      },
                      { 
                        title: "Security Console", 
                        value: stats?.totalAdmins ?? "1", 
                        change: "Session keys active", 
                        isUp: true, 
                        icon: <Shield className="w-5 h-5 text-orange-600" />,
                        bgColor: "bg-orange-50/50 border-orange-200",
                        darkBg: "bg-orange-950/20 border-orange-900/30 text-orange-300"
                      },
                    ].map((card, i) => (
                      <div key={i} className={`p-5 rounded-3xl border shadow-sm flex flex-col justify-between min-h-[120px] transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md ${
                        isDarkMode ? card.darkBg : card.bgColor
                      }`}>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">{card.title}</span>
                          <div className={`p-2 rounded-xl border shadow-sm ${
                            isDarkMode ? "bg-stone-900 border-stone-800" : "bg-white border-stone-100"
                          }`}>{card.icon}</div>
                        </div>
                        <div className="mt-3">
                          <h3 className={`text-xl md:text-2xl font-black tracking-tight leading-none ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>{card.value}</h3>
                          <span className={`text-[10px] font-bold mt-1.5 inline-block ${card.isUp ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {card.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Dynamic Analytics & Charts Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* CSS Bar Chart */}
                    <div className={`rounded-3xl border p-6 shadow-sm flex flex-col justify-between ${cardClass}`}>
                      <div className={`flex justify-between items-center pb-4 border-b ${dividerClass}`}>
                        <div>
                          <h4 className={`font-extrabold text-sm tracking-tight ${headingText}`}>Booking Volume & Revenue Trends</h4>
                          <p className="text-[10px] text-stone-400 font-semibold mt-0.5">Calculated dynamically from last 6 months of billing ledger</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-[9px] font-black text-orange-500">
                            <span className="w-2.5 h-2.5 rounded bg-orange-400 inline-block" /> Bookings
                          </div>
                          <div className="flex items-center gap-1.5 text-[9px] font-black text-amber-500">
                            <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block" /> Revenue (Adv)
                          </div>
                        </div>
                      </div>

                      {/* The interactive bar container */}
                      <div className={`flex items-end justify-between h-56 pt-8 px-2 border-b relative ${dividerClass}`}>
                        {monthlyData.map((d, idx) => (
                          <div key={idx} className="flex flex-col items-center flex-1 group relative">
                            {/* Interactive tooltip */}
                            <div className="absolute bottom-full mb-3 bg-stone-900 text-white text-[10px] font-bold py-1.5 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 shadow-md whitespace-nowrap flex flex-col gap-0.5 border border-stone-800">
                              <span>Month: <span className="text-orange-400">{d.month}</span></span>
                              <span>Bookings: <span className="text-amber-400">{d.bookings}</span></span>
                              <span>Revenue: <span className="text-emerald-400">{formatAsCurrency(d.revenue, "INR")}</span></span>
                            </div>

                            {/* Dual side-by-side bars */}
                            <div className="flex gap-1.5 items-end h-36 w-full justify-center">
                              {/* Bookings bar */}
                              <div 
                                className="w-4 bg-orange-400 hover:bg-orange-500 rounded-t-lg transition-all duration-300 shadow-sm"
                                style={{ height: `${(d.bookings / maxBookings) * 100}%` }}
                              />
                              {/* Revenue bar */}
                              <div 
                                className="w-4 bg-amber-500 hover:bg-amber-600 rounded-t-lg transition-all duration-300 shadow-sm"
                                style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-black text-stone-500 mt-2.5 uppercase tracking-wide">{d.month}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-3 text-[10px] text-stone-400 font-semibold">
                        <span>Max Bookings: {maxBookings}</span>
                        <span>Max Revenue Cap: {formatAsCurrency(maxRevenue, "INR")}</span>
                      </div>
                    </div>

                    {/* SVG Donut split */}
                    <div className={`rounded-3xl border p-6 shadow-sm flex flex-col justify-between ${cardClass}`}>
                      <div className={`pb-4 border-b ${dividerClass}`}>
                        <h4 className={`font-extrabold text-sm tracking-tight ${headingText}`}>Event Split</h4>
                        <p className="text-[10px] text-stone-400 font-semibold mt-0.5">Booking ratio of Venues vs Overnight Rooms</p>
                      </div>

                      <div className="flex flex-col items-center justify-center py-6">
                        <div className="relative w-36 h-36 flex items-center justify-center">
                          {/* Radial Progress SVG */}
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            {/* Background circle */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              className={isDarkMode ? "stroke-stone-800" : "stroke-stone-50"}
                              strokeWidth="8"
                              fill="transparent"
                            />
                            {/* Venue progress circle */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              className="stroke-orange-500 transition-all duration-1000"
                              strokeWidth="8"
                              strokeDasharray={2 * Math.PI * 40}
                              strokeDashoffset={2 * Math.PI * 40 * (1 - (venuePercentage || 50) / 100)}
                              fill="transparent"
                              strokeLinecap="round"
                            />
                          </svg>
                          {/* Center stats */}
                          <div className="absolute text-center">
                            <span className={`text-2xl font-black tracking-tight ${headingText}`}>{venuePercentage}%</span>
                            <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">Venues</p>
                          </div>
                        </div>
                      </div>

                      <div className={`flex flex-col gap-2.5 border-t pt-4 ${dividerClass}`}>
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                            <span className={`font-bold ${isDarkMode ? 'text-stone-300' : 'text-stone-600'}`}>Banquet & Venues</span>
                          </div>
                          <span className={`font-black ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>{totalVenueBookings} ({venuePercentage}%)</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${isDarkMode ? 'bg-stone-700' : 'bg-stone-200'}`} />
                            <span className={`font-bold ${isDarkMode ? 'text-stone-300' : 'text-stone-600'}`}>Overnight Rooms</span>
                          </div>
                          <span className={`font-black ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>{totalRoomBookings} ({roomPercentage}%)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Audit Logs Feed & Server Health */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Live Audit Log Feed */}
                    <div className={`lg:col-span-2 rounded-3xl border p-6 shadow-sm ${cardClass}`}>
                      <div className={`pb-4 border-b flex items-center justify-between mb-4 ${dividerClass}`}>
                        <div>
                          <h4 className={`font-extrabold text-sm tracking-tight ${headingText}`}>System Audit Log</h4>
                          <p className="text-[10px] text-stone-400 font-semibold mt-0.5">Real-time chronologically sorted registry logs</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-orange-50 text-orange-655 border border-orange-200 uppercase tracking-wider dark:bg-orange-950/20 dark:border-orange-900/50">
                          LIVE LOGS
                        </span>
                      </div>

                      <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
                        {activities.length === 0 ? (
                          <p className="text-center py-12 text-stone-450 text-xs font-semibold">No recent logs recorded in active database.</p>
                        ) : (
                          activities.map((act, idx) => (
                            <div key={idx} className={`p-3 rounded-2xl border flex items-center gap-3.5 transition-all duration-200 hover:scale-[1.005] ${
                              isDarkMode ? "bg-stone-900/80 border-stone-850" : "bg-[#fafaf9] border-stone-200/50"
                            }`}>
                              <div className={`p-2 rounded-xl border shrink-0 ${
                                isDarkMode ? "bg-stone-950 border-stone-800" : "bg-white border-stone-200/50"
                              }`}>{act.icon}</div>
                              <div className="min-w-0 flex-1">
                                <p className={`text-xs font-black ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>{act.title}</p>
                                <p className="text-[10px] text-stone-500 truncate mt-0.5">{act.desc}</p>
                              </div>
                              <span className="text-[9px] font-bold text-stone-400 whitespace-nowrap tracking-wide">{formatDate(act.time)}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Server Latency & Health Console */}
                    <div className={`lg:col-span-1 rounded-3xl border p-6 shadow-sm flex flex-col justify-between ${cardClass}`}>
                      <div className={`pb-4 border-b flex items-center gap-2 ${dividerClass}`}>
                        <Terminal className="w-4 h-4 text-stone-500" />
                        <h4 className={`font-extrabold text-sm tracking-tight ${headingText}`}>System Monitor</h4>
                      </div>

                      <div className="bg-stone-900 rounded-2xl p-4 font-mono text-[10px] text-emerald-400 flex flex-col gap-1.5 shadow-inner mt-4">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          <span className="text-stone-400">DATABASE:</span>
                          <span className="font-bold">CONNECTED</span>
                        </div>
                        <div className="flex justify-between border-b border-stone-800 pb-1 mt-1 text-stone-450">
                          <span>Connection Type</span>
                          <span className="text-stone-300 font-bold">direct-sharded</span>
                        </div>
                        <div className="flex justify-between border-b border-stone-800 pb-1 text-stone-450">
                          <span>Ping Latency</span>
                          <span className="text-stone-300 font-bold">24 ms (local)</span>
                        </div>
                        <div className="flex justify-between border-b border-stone-800 pb-1 text-stone-450">
                          <span>Server Platform</span>
                          <span className="text-stone-300 font-bold">Next.js 16.2 (Node 20)</span>
                        </div>
                        <div className="flex justify-between text-stone-450">
                          <span>Decrypted Session</span>
                          <span className="text-stone-300 font-bold">OK (Validated)</span>
                        </div>
                      </div>

                      <button 
                        onClick={runDiagnostics}
                        disabled={checkingSystem}
                        className="w-full mt-5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        {checkingSystem ? "Syncing System Keys..." : "Force Diagnostics & Re-sync"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── TAB: VENDOR APPROVALS ─── */}
              {activeTab === "approvals" && (
                <div className={`bg-white border rounded-3xl p-6 shadow-sm ${cardClass}`}>
                  <div className={`flex justify-between items-center pb-4 border-b mb-6 ${dividerClass}`}>
                    <div>
                      <h3 className={`font-extrabold text-base ${headingText}`}>New Vendor Registrations</h3>
                      <p className="text-[10px] text-stone-400 font-semibold mt-0.5">Verify and moderate brand profile requests in the onboarding pipeline</p>
                    </div>
                    <span className="text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-wider dark:bg-amber-950/20 dark:border-amber-900/50">
                      {filteredApprovals.length} pending verification
                    </span>
                  </div>

                  {filteredApprovals.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-4 dark:bg-emerald-950/20 dark:border-emerald-900/50">
                        <Check className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-stone-800 text-sm dark:text-stone-200">Approvals Queue is Clear</h4>
                      <p className="text-xs text-stone-500 max-w-xs mt-1">
                        All submitted vendor profile requests have been moderated.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredApprovals.map((v) => (
                        <div 
                          key={v._id}
                          className={`p-5 rounded-2xl border flex flex-col justify-between hover:border-orange-250 transition-colors shadow-sm ${subCardClass}`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h4 className={`font-extrabold text-base leading-tight ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>{v.businessName || "No Business Name"}</h4>
                                <p className="text-xs text-stone-550 font-medium mt-1">{v.name}</p>
                              </div>
                              <span className="text-[9px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full shrink-0 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-300">
                                {v.category}
                              </span>
                            </div>

                            <div className={`grid grid-cols-2 gap-3 mt-5 border-t pt-4 text-xs ${dividerClass}`}>
                              <div>
                                <span className="text-[10px] text-stone-400 block font-bold uppercase tracking-wide">Base City</span>
                                <span className={`font-semibold ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>{v.city || "Not Specified"}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-stone-400 block font-bold uppercase tracking-wide">Contact Email</span>
                                <span className={`font-semibold truncate block ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`} title={v.email}>{v.email}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-stone-400 block font-bold uppercase tracking-wide">Phone</span>
                                <span className={`font-semibold ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>{v.phone || "N/A"}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-stone-400 block font-bold uppercase tracking-wide">Registered</span>
                                <span className={`font-semibold ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>{formatDate(v.createdAt)}</span>
                              </div>
                            </div>
                          </div>

                          <div className={`flex gap-2.5 mt-6 border-t pt-4 ${dividerClass}`}>
                            <button
                              onClick={() => handleUpdateVendorStatus(v._id, true)}
                              className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
                            >
                              Approve Partner
                            </button>
                            <button
                              onClick={() => handleDeleteVendor(v._id)}
                              className={`flex-1 flex items-center justify-center border font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-sm ${
                                isDarkMode 
                                  ? "bg-stone-900 border-stone-850 hover:bg-red-950/20 text-stone-300 hover:border-red-900 hover:text-red-400" 
                                  : "bg-white hover:bg-red-50 border-stone-200 hover:border-red-200 text-stone-600 hover:text-red-650"
                              }`}
                            >
                              Reject Application
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ─── TAB: VENDORS DIRECTORY ─── */}
              {activeTab === "vendors" && (
                <div className={`border rounded-3xl overflow-hidden p-6 shadow-sm ${cardClass}`}>
                  <div className={`flex justify-between items-center pb-4 border-b mb-6 ${dividerClass}`}>
                    <div>
                      <h3 className={`font-extrabold text-base ${headingText}`}>Partners Directory</h3>
                      <p className="text-[10px] text-stone-400 font-semibold mt-0.5">Manage and review all partner accounts register status and features</p>
                    </div>
                  </div>

                  {filteredVendors.length === 0 ? (
                    <div className="py-20 text-center text-stone-500 text-sm font-semibold">
                      No vendor profiles match "{searchTerm}"
                    </div>
                  ) : (
                    <div className={`overflow-x-auto border rounded-2xl ${dividerClass}`}>
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className={`border-b text-stone-500 font-bold ${isDarkMode ? 'bg-stone-900/50' : 'bg-[#fafaf9]'}`}>
                            <th className="p-4">Brand / Owner</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">City</th>
                            <th className="p-4">Review Score</th>
                            <th className="p-4">Verification</th>
                            <th className="p-4">Featured badge</th>
                            <th className="p-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredVendors.map((v) => (
                            <tr key={v._id} className={`border-b last:border-0 transition-colors ${
                              isDarkMode ? "border-stone-850 hover:bg-stone-900/40" : "border-stone-150 hover:bg-orange-50/20"
                            }`}>
                              <td className="p-4">
                                <p className={`font-black text-sm ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>{v.businessName || "No Business Name"}</p>
                                <p className="text-[10px] text-stone-400 font-semibold mt-0.5">{v.name} • {v.email}</p>
                              </td>
                              <td className="p-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wide ${
                                  isDarkMode ? "bg-stone-800 border-stone-700 text-stone-300" : "bg-stone-100 border-stone-200 text-stone-600"
                                }`}>
                                  {v.category}
                                </span>
                              </td>
                              <td className={`p-4 font-semibold ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>{v.city || "N/A"}</td>
                              <td className="p-4">
                                <div className="flex items-center gap-1.5">
                                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                  <span className={`font-bold ${isDarkMode ? 'text-stone-305' : 'text-stone-755'}`}>{v.rating || 0}</span>
                                  <span className="text-[10px] text-stone-400 font-medium">({v.reviewCount || 0})</span>
                                </div>
                              </td>
                              <td className="p-4">
                                <button
                                  onClick={() => handleUpdateVendorStatus(v._id, !v.verified)}
                                  className={`px-3 py-1 rounded-full text-[10px] font-black cursor-pointer border transition-all ${
                                    v.verified
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-250 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900"
                                      : "bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100 dark:bg-stone-900 dark:border-stone-800 dark:text-stone-400"
                                  }`}
                                >
                                  {v.verified ? "Verified" : "Pending"}
                                </button>
                              </td>
                              <td className="p-4">
                                <button
                                  onClick={() => handleUpdateVendorStatus(v._id, undefined, !v.featured)}
                                  className={`px-3 py-1 rounded-full text-[10px] font-black cursor-pointer border transition-all ${
                                    v.featured
                                      ? "bg-orange-50 text-orange-700 border-orange-250 hover:bg-orange-100 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900"
                                      : "bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100 dark:bg-stone-900 dark:border-stone-800 dark:text-stone-400"
                                  }`}
                                >
                                  {v.featured ? "Featured" : "Regular"}
                                </button>
                              </td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => handleDeleteVendor(v._id)}
                                  className="p-2 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-200 text-stone-400 hover:text-red-650 transition-all cursor-pointer dark:hover:bg-red-950/30"
                                  title="Delete Vendor Account"
                                >
                                  <Trash className="w-3.5 h-3.5" />
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

              {/* ─── TAB: BOOKINGS LEDGER ─── */}
              {activeTab === "bookings" && (
                <div className={`border rounded-3xl overflow-hidden p-6 shadow-sm ${cardClass}`}>
                  <div className={`flex justify-between items-center pb-4 border-b mb-6 ${dividerClass}`}>
                    <div>
                      <h3 className={`font-extrabold text-base ${headingText}`}>Bookings Ledger</h3>
                      <p className="text-[10px] text-stone-400 font-semibold mt-0.5">Monitor client checkout orders, payments, dates, and complete service cycles</p>
                    </div>
                  </div>

                  {filteredBookings.length === 0 ? (
                    <div className="py-20 text-center text-stone-500 text-sm font-semibold">
                      No bookings matching "{searchTerm}"
                    </div>
                  ) : (
                    <div className={`overflow-x-auto border rounded-2xl ${dividerClass}`}>
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className={`border-b text-stone-500 font-bold ${isDarkMode ? 'bg-stone-900/50' : 'bg-[#fafaf9]'}`}>
                            <th className="p-4">Booking Info</th>
                            <th className="p-4">Client Details</th>
                            <th className="p-4">Specifications</th>
                            <th className="p-4">Dates</th>
                            <th className="p-4">Advance Paid</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredBookings.map((b) => (
                            <tr key={b._id} className={`border-b last:border-0 transition-colors ${
                              isDarkMode ? "border-stone-850 hover:bg-stone-900/40" : "border-stone-150 hover:bg-orange-50/20"
                            }`}>
                              <td className="p-4">
                                <p className={`font-black text-sm leading-tight ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>{b.venueName}</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span className="text-[9px] text-stone-400 font-mono">ID: {b._id.slice(0, 8)}...</span>
                                  <button 
                                    onClick={() => copyToClipboard(b._id)}
                                    className="text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                                    title="Copy full ID"
                                  >
                                    {copiedId === b._id ? (
                                      <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded dark:bg-emerald-950/20">Copied!</span>
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                              </td>
                              <td className="p-4">
                                <p className={`font-bold ${isDarkMode ? 'text-stone-300' : 'text-stone-750'}`}>{b.userName}</p>
                                <p className="text-[10px] text-stone-450 mt-0.5">{b.userEmail} • {b.userPhone || "No Phone"}</p>
                              </td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase ${
                                  isDarkMode ? "bg-stone-850 border-stone-750 text-stone-300" : "bg-stone-100 border-stone-200 text-stone-650"
                                }`}>
                                  {b.bookingType}
                                </span>
                                <p className="text-[10px] font-semibold text-stone-500 mt-1.5">
                                  {b.bookingType === "venue" ? `${b.guestCount || 0} Guests` : `${b.roomCount || 0} Rooms`}
                                </p>
                              </td>
                              <td className="p-4">
                                {b.bookingType === "venue" ? (
                                  <p className={`font-semibold ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>{formatDate(b.eventDate)}</p>
                                ) : (
                                  <div className={`font-semibold ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>
                                    <p className="text-xs">In: {formatDate(b.checkIn)}</p>
                                    <p className="text-[10px] text-stone-400 font-medium mt-0.5">Out: {formatDate(b.checkOut)}</p>
                                  </div>
                                )}
                              </td>
                              <td className="p-4">
                                <p className={`font-black ${isDarkMode ? 'text-stone-200' : 'text-stone-850'}`}>{formatAsCurrency(b.totalAmount, b.currency || "INR")}</p>
                                <p className="text-[10px] text-stone-450 font-bold mt-0.5">Adv: {formatAsCurrency(b.advanceAmount, b.currency || "INR")}</p>
                              </td>
                              <td className="p-4">
                                <select
                                  value={b.status}
                                  onChange={(e) => handleUpdateBookingStatus(b._id, e.target.value)}
                                  className={`text-[10px] font-extrabold rounded-full border px-3 py-1 bg-white outline-none cursor-pointer transition-colors dark:bg-stone-900 ${
                                    b.status === "confirmed"
                                      ? "text-emerald-700 border-emerald-250 bg-emerald-50/70 dark:text-emerald-400 dark:border-emerald-900"
                                      : b.status === "completed"
                                      ? "text-blue-700 border-blue-200 bg-blue-50/70 dark:text-blue-400 dark:border-blue-900"
                                      : b.status === "cancelled"
                                      ? "text-red-700 border-red-200 bg-red-50/70 dark:text-red-400 dark:border-red-900"
                                      : "text-amber-700 border-amber-250 bg-amber-50/70 dark:text-amber-400 dark:border-amber-900"
                                  }`}
                                >
                                  <option value="pending" className="text-amber-700 font-bold bg-white dark:bg-stone-900">Pending</option>
                                  <option value="confirmed" className="text-emerald-700 font-bold bg-white dark:bg-stone-900">Confirmed</option>
                                  <option value="completed" className="text-blue-700 font-bold bg-white dark:bg-stone-900">Completed</option>
                                  <option value="cancelled" className="text-red-700 font-bold bg-white dark:bg-stone-900">Cancelled</option>
                                </select>
                              </td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => handleDeleteBooking(b._id)}
                                  className="p-2 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-200 text-stone-400 hover:text-red-650 transition-all cursor-pointer dark:hover:bg-red-950/30"
                                  title="Delete Booking"
                                >
                                  <Trash className="w-3.5 h-3.5" />
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

              {/* ─── TAB: USERS REGISTRY ─── */}
              {activeTab === "users" && (
                <div className={`border rounded-3xl overflow-hidden p-6 shadow-sm ${cardClass}`}>
                  <div className={`flex justify-between items-center pb-4 border-b mb-6 ${dividerClass}`}>
                    <div>
                      <h3 className={`font-extrabold text-base ${headingText}`}>User Registry</h3>
                      <p className="text-[10px] text-stone-400 font-semibold mt-0.5">Moderate system users login authorization and profiles</p>
                    </div>
                  </div>

                  {filteredUsers.length === 0 ? (
                    <div className="py-20 text-center text-stone-500 text-sm font-semibold">
                      No user accounts match "{searchTerm}"
                    </div>
                  ) : (
                    <div className={`overflow-x-auto border rounded-2xl ${dividerClass}`}>
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className={`border-b text-stone-500 font-bold ${isDarkMode ? 'bg-stone-900/50' : 'bg-[#fafaf9]'}`}>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email Address</th>
                            <th className="p-4">Contact Phone</th>
                            <th className="p-4">Access Role</th>
                            <th className="p-4">Signup Date</th>
                            <th className="p-4 text-center">Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((u) => (
                            <tr key={u._id} className={`border-b last:border-0 transition-colors ${
                              isDarkMode ? "border-stone-850 hover:bg-stone-900/40" : "border-stone-150 hover:bg-orange-50/20"
                            }`}>
                              <td className={`p-4 font-black text-sm ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>{u.name}</td>
                              <td className={`p-4 font-semibold ${isDarkMode ? 'text-stone-305' : 'text-stone-700'}`}>{u.email}</td>
                              <td className={`p-4 font-medium ${isDarkMode ? 'text-stone-305' : 'text-stone-700'}`}>{u.phone || "N/A"}</td>
                              <td className="p-4">
                                <select
                                  value={u.role}
                                  onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                                  className="text-[10px] font-black bg-white border border-stone-300 text-stone-700 rounded-xl px-2.5 py-1.5 outline-none cursor-pointer hover:border-stone-400 transition-colors dark:bg-stone-900 dark:border-stone-700 dark:text-stone-300"
                                >
                                  <option value="user">User</option>
                                  <option value="couple">Couple</option>
                                  <option value="vendor">Vendor</option>
                                </select>
                              </td>
                              <td className="p-4 text-stone-500 font-semibold">{formatDate(u.createdAt)}</td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => handleDeleteUser(u._id)}
                                  className="p-2 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-200 text-stone-400 hover:text-red-655 transition-all cursor-pointer dark:hover:bg-red-950/30"
                                  title="Delete User"
                                >
                                  <Trash className="w-3.5 h-3.5" />
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

              {/* ─── TAB: VENUES DIRECTORY ─── */}
              {activeTab === "venues" && (
                <div className={`border rounded-3xl overflow-hidden p-6 shadow-sm ${cardClass}`}>
                  <div className={`flex justify-between items-center pb-4 border-b mb-6 ${dividerClass}`}>
                    <div>
                      <h3 className={`font-extrabold text-base ${headingText}`}>Venue Directory</h3>
                      <p className="text-[10px] text-stone-400 font-semibold mt-0.5">Toggle live status, verified flags, and details on all listings</p>
                    </div>
                    <span className="text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200 px-3.5 py-1.5 rounded-full uppercase tracking-wider dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900">
                      {filteredVenuesList.length} venues total
                    </span>
                  </div>

                  {filteredVenuesList.length === 0 ? (
                    <div className="py-20 text-center text-stone-500 text-sm font-semibold">
                      No venues matching "{searchTerm}"
                    </div>
                  ) : (
                    <div className={`overflow-x-auto border rounded-2xl ${dividerClass}`}>
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className={`border-b text-stone-500 font-bold ${isDarkMode ? 'bg-stone-900/50' : 'bg-[#fafaf9]'}`}>
                            <th className="p-4">Venue Details</th>
                            <th className="p-4">City / Style</th>
                            <th className="p-4">Guests Cap</th>
                            <th className="p-4">Review Star</th>
                            <th className="p-4">Verify Flag</th>
                            <th className="p-4">Featured Flag</th>
                            <th className="p-4">Active State</th>
                            <th className="p-4 text-center">Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredVenuesList.map((v) => (
                            <tr key={v._id} className={`border-b last:border-0 transition-colors ${
                              isDarkMode ? "border-stone-850 hover:bg-stone-900/40" : "border-stone-150 hover:bg-orange-50/20"
                            }`}>
                              <td className="p-4">
                                <p className={`font-black text-sm leading-tight ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>{v.name}</p>
                                <p className="text-[9px] text-stone-400 font-mono mt-1">CODE: {v.venueId}</p>
                              </td>
                              <td className="p-4">
                                <p className={`font-bold ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>{v.city}</p>
                                <span className={`text-[9px] font-black border px-2 py-0.5 rounded-full mt-1.5 inline-block uppercase tracking-wide ${
                                  isDarkMode ? "bg-stone-800 border-stone-700 text-stone-450" : "bg-stone-100 border-stone-200 text-stone-600"
                                }`}>{v.type}</span>
                              </td>
                              <td className={`p-4 font-semibold ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>
                                {v.minGuests}–{v.maxGuests} pax
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-1.5">
                                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                  <span className={`font-bold ${isDarkMode ? 'text-stone-300' : 'text-stone-750'}`}>{v.rating}</span>
                                  <span className="text-[10px] text-stone-400 font-medium">({v.reviewCount})</span>
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
                                  className={`px-3 py-1 rounded-full text-[10px] font-black cursor-pointer border transition-all ${
                                    v.verified
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-250 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900"
                                      : "bg-stone-50 text-stone-550 border-stone-200 hover:bg-stone-100 dark:bg-stone-900 dark:border-stone-800 dark:text-stone-400"
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
                                  className={`px-3 py-1 rounded-full text-[10px] font-black cursor-pointer border transition-all ${
                                    v.featured
                                      ? "bg-orange-50 text-orange-700 border-orange-255 hover:bg-orange-100 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900"
                                      : "bg-stone-50 text-stone-550 border-stone-200 hover:bg-stone-100 dark:bg-stone-900 dark:border-stone-800 dark:text-stone-400"
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
                                  className={`px-3 py-1 rounded-full text-[10px] font-black cursor-pointer border transition-all ${
                                    v.active
                                      ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900"
                                      : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900"
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
                                  className="p-2 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-200 text-stone-400 hover:text-red-650 transition-all cursor-pointer dark:hover:bg-red-950/30"
                                  title="Delete Venue Profile"
                                >
                                  <Trash className="w-3.5 h-3.5" />
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
    </div>
  );
}
