"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "@/components/shared/CustomImage";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { formatAsCurrency } from "@/lib/currency";
import { Trash2 } from "lucide-react";
import { Star, MapPin, Heart, Flower2, ClipboardList, BedDouble, Users, Sparkles, Building2, LayoutDashboard, UserCheck, BookOpen, Map, Camera, Brush, HeartHandshake, UtensilsCrossed, Utensils, Palette, Package, Briefcase, ChevronDown, ChevronRight, Settings, Lock, Save, Loader2, Wand2, Eye, EyeOff } from "lucide-react";
import ThemeToggle from "@/components/shared/ThemeToggle";
import ListingCard, { CardTag } from "@/components/shared/ListingCard";
import { useTheme } from "@/lib/ThemeContext";

interface AdminSession {
  id: string;
  name: string;
  email: string;
  role: string;
}

type TabType = "overview" | "approvals" | "vendors" | "bookings" | "users" | "venues" | "rooms" | "planners" | "caterers" | "decorators" | "settings";

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
  const [servicesList, setServicesList] = useState<any[]>([]);
  
  // Copy state for feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { isDark: isDarkMode } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [servicesExpanded, setServicesExpanded] = useState(false);

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
      const res = await fetch("/api/admin/settings/password", {
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


  const fetchAllData = async () => {
    setLoadingData(true);
    setError(null);
    try {
      const [statsRes, vendorsRes, bookingsRes, usersRes, venuesRes, servicesRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/vendors"),
        fetch("/api/admin/bookings"),
        fetch("/api/admin/users"),
        fetch("/api/venues?limit=100"),
        fetch("/api/services?limit=500"),
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

      if (servicesRes.ok) {
        const data = await servicesRes.json();
        setServicesList(data.services || []);
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

  const handleUpdateServiceStatus = async (serviceId: string, verified?: boolean, featured?: boolean, active?: boolean) => {
    try {
      const res = await fetch("/api/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, verified, featured, active }),
      });
      const data = await res.json();
      if (res.ok) {
        fetchAllData();
      } else {
        alert(data.message || "Failed to update service.");
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

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Are you sure you want to permanently delete this service?")) return;
    try {
      const res = await fetch(`/api/services?serviceId=${serviceId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        fetchAllData();
      } else {
        alert(data.message || "Failed to delete service.");
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

  const totalVenueBookings = bookings.filter(b => b.bookingType === "venue").length;
  const totalRoomBookings = bookings.filter(b => b.bookingType === "room").length;
  const venuePercentage = bookings.length ? Math.round((totalVenueBookings / bookings.length) * 100) : 0;
  const roomPercentage = bookings.length ? Math.round((totalRoomBookings / bookings.length) * 100) : 0;

  const getActivityFeed = () => {
    const activities: any[] = [];
    
    users.slice(0, 4).forEach(u => {
      activities.push({
        type: "user",
        title: "New Client Registered",
        desc: `${u.name} joined as platform user`,
        time: u.createdAt,
        bgColor: isDarkMode ? "bg-stone-900/40 border-stone-800" : "bg-stone-50 border-stone-200",
      });
    });

    vendors.slice(0, 4).forEach(v => {
      activities.push({
        type: "vendor",
        title: v.verified ? "Vendor Partner Active" : "Vendor Registration Pending",
        desc: `${v.businessName || v.name} registered under ${v.category}`,
        time: v.createdAt,
        bgColor: isDarkMode ? "bg-stone-900/40 border-stone-800" : "bg-stone-50 border-stone-200",
      });
    });

    bookings.slice(0, 4).forEach(b => {
      activities.push({
        type: "booking",
        title: `Booking Order: ${(b.status || "pending").toUpperCase()}`,
        desc: `${b.userName || "Guest"} booked ${b.providerName || b.venueName || "Service"} (${formatAsCurrency(b.advanceAmount || 0, "INR")} advance)`,
        time: b.createdAt,
        bgColor: isDarkMode ? "bg-stone-900/40 border-stone-800" : "bg-stone-50 border-stone-200",
      });
    });

    return activities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 6);
  };

  const activities = getActivityFeed();
  const pendingApprovals = vendors.filter(v => !v.verified);

  const filteredApprovals = pendingApprovals.filter(v => {
    const val = searchTerm.toLowerCase();
    return (
      (v.businessName || "").toLowerCase().includes(val) ||
      (v.name || "").toLowerCase().includes(val) ||
      (v.city || "").toLowerCase().includes(val) ||
      (v.category || "").toLowerCase().includes(val)
    );
  });

  const filteredVendors = vendors.filter(v => {
    const val = searchTerm.toLowerCase();
    return (
      (v.businessName || "").toLowerCase().includes(val) ||
      (v.name || "").toLowerCase().includes(val) ||
      (v.city || "").toLowerCase().includes(val) ||
      (v.category || "").toLowerCase().includes(val)
    );
  });

  const filteredBookings = bookings.filter(b => {
    const val = searchTerm.toLowerCase();
    return (
      (b.providerName || b.venueName || "").toLowerCase().includes(val) ||
      (b.userName || "").toLowerCase().includes(val) ||
      (b.userEmail || "").toLowerCase().includes(val) ||
      (b.userPhone || "").toLowerCase().includes(val) ||
      (b.status || "").toLowerCase().includes(val) ||
      (b._id || "").toLowerCase().includes(val)
    );
  });

  const filteredUsers = users.filter(u => {
    const val = searchTerm.toLowerCase();
    return (
      (u.name || "").toLowerCase().includes(val) ||
      (u.email || "").toLowerCase().includes(val) ||
      (u.phone || "").toLowerCase().includes(val) ||
      (u.role || "").toLowerCase().includes(val)
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-stone-50 text-stone-800 font-body">
        <div className="w-10 h-10 rounded-full border-2 border-primary-500/20 border-t-orange-500 animate-spin mb-4" />
        <p className="font-bold text-sm tracking-wide">SECURE CONSOLE</p>
      </div>
    );
  }

  if (!admin) return null;

  const menuItems: any[] = [
    { id: "overview", label: "Overview", count: null, icon: LayoutDashboard },
    { 
      id: "services", 
      label: "Booking Categories", 
      icon: Briefcase,
      subItems: [
        { id: "venues", label: "Venue", count: venuesList.length || null, icon: Map },
        { id: "rooms", label: "Rooms", count: servicesList.filter(s => s.category === "rooms").length || null, icon: BedDouble },
        { id: "planners", label: "Wedding Planners", count: servicesList.filter(s => s.category === "planners").length || null, icon: ClipboardList },
        { id: "caterers", label: "Caterers", count: servicesList.filter(s => s.category === "caterers").length || null, icon: UtensilsCrossed },
        { id: "decorators", label: "Decorators", count: servicesList.filter(s => s.category === "decorators").length || null, icon: Flower2 },
      ]
    },
    { id: "approvals", label: "Approvals Queue", count: pendingApprovals.length || null, icon: UserCheck },
    { id: "vendors", label: "Vendors Directory", count: vendors.length || null, icon: Building2 },
    { id: "bookings", label: "Bookings Ledger", count: bookings.length || null, icon: BookOpen },
    { id: "users", label: "Client Registry", count: users.length || null, icon: Users },
    { id: "settings", label: "Settings", count: null, icon: Settings },
  ];

  // Standard theme variables for consistency (corrected colors from non-standard)
  const containerBg = isDarkMode ? "bg-stone-950 text-stone-200" : "bg-[#fafaf9] text-stone-800";
  const sidebarClass = isDarkMode ? "border-stone-800 bg-stone-900/80 text-stone-300" : "border-stone-200 bg-white/70 text-stone-600";
  const cardClass = isDarkMode ? "bg-stone-900/60 border-stone-800 text-stone-300" : "bg-white/70 border-stone-200 text-stone-600";
  const headerClass = isDarkMode ? "bg-stone-900/70 border-stone-800 text-white" : "bg-white/70 border-stone-200 text-stone-800";
  const headingText = isDarkMode ? "text-white" : "text-stone-900";
  const dividerClass = isDarkMode ? "border-stone-800" : "border-stone-100";
  const subCardClass = isDarkMode ? "bg-stone-950/60 border-stone-800" : "bg-[#fafaf9] border-stone-200";

  return (
    <div className={`h-screen font-body flex relative overflow-hidden p-0 sm:p-2 transition-colors duration-300 ${containerBg} ${isDarkMode ? "dark" : ""}`}>
      
      {/* Background Decorative Ambient Shapes */}
      <div className="absolute w-[50rem] h-[50rem] -top-96 -left-96 opacity-[0.03] pointer-events-none rounded-full bg-primary-500 blur-[150px]" />
      <div className="absolute w-[45rem] h-[45rem] -bottom-80 -right-80 opacity-[0.03] pointer-events-none rounded-full bg-amber-500 blur-[150px]" />

      {/* ─── FLOATING SIDEBAR ─── */}
      <aside className={`hidden lg:flex flex-col border rounded-3xl m-3 h-[calc(100vh-2rem)] sticky top-4 shrink-0 z-30 shadow-none transition-all duration-300 ${sidebarClass} ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        {/* Branding header with collapse button */}
        <div className={`p-6 border-b flex items-center justify-between ${dividerClass}`}>
          {!sidebarCollapsed ? (
            <div className="flex flex-col gap-1">
              <Link href="/">
                <Image 
                  src="/logo/logo-by-soulswed.png" 
                  alt="SoulsWed" 
                  width={150} 
                  height={45} 
                  className="h-8 w-auto hover:opacity-80 transition-opacity" 
                  priority
                />
              </Link>
              <p className="text-[9px] font-bold text-primary-600 uppercase tracking-widest mt-1">Admin Control</p>
            </div>
          ) : (
            <h2 className={`font-extrabold text-sm tracking-tight uppercase ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>SW</h2>
          )}
        </div>

        {/* Navigation Link list */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isSubActive = hasSubItems && item.subItems.some((sub: any) => sub.id === activeTab);
            const isActive = activeTab === item.id || isSubActive;
            const Icon = item.icon;
            
            return (
              <div key={item.id} className="w-full">
                <button
                  onClick={() => {
                    if (hasSubItems) {
                      setServicesExpanded(!servicesExpanded);
                      if (sidebarCollapsed) setSidebarCollapsed(false);
                    } else {
                      setActiveTab(item.id as TabType);
                      setSearchTerm("");
                    }
                  }}
                  className={`w-full relative flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? "bg-primary-500 text-white" 
                      : isDarkMode
                        ? "text-stone-400 hover:text-white hover:bg-stone-800/60"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-[18px] h-[18px] shrink-0" />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </div>
                  {!sidebarCollapsed && item.count !== undefined && item.count !== null && !hasSubItems && (
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
                  {!sidebarCollapsed && hasSubItems && (
                    servicesExpanded ? <ChevronDown className="w-4 h-4 opacity-70" /> : <ChevronRight className="w-4 h-4 opacity-70" />
                  )}
                  {sidebarCollapsed && item.count !== undefined && item.count !== null && !hasSubItems && (
                    <span className={`absolute right-1.5 top-1.5 px-1.5 py-0.5 rounded-full text-[8px] font-black ${
                      isActive 
                        ? "bg-white text-primary-600" 
                        : isDarkMode 
                          ? "bg-stone-800 text-stone-400 border border-stone-700"
                          : "bg-stone-100 text-stone-500 border border-stone-200"
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {hasSubItems && servicesExpanded && !sidebarCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="flex flex-col gap-1 ml-4 mt-1 pl-2 border-l-2 border-stone-100 dark:border-stone-800 overflow-hidden"
                    >
                      {item.subItems.map((subItem: any) => {
                        const SubIcon = subItem.icon;
                        const isSubItemActive = activeTab === subItem.id;
                        return (
                          <button
                            key={subItem.id}
                            onClick={() => {
                              setActiveTab(subItem.id as TabType);
                              setSearchTerm("");
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                              isSubItemActive 
                                ? "text-primary-600 bg-primary-50 dark:bg-primary-900/20" 
                                : isDarkMode
                                  ? "text-stone-400 hover:text-white hover:bg-stone-800/60"
                                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <SubIcon className="w-[15px] h-[15px] shrink-0" />
                              <span>{subItem.label}</span>
                            </div>
                            {subItem.count !== undefined && subItem.count !== null && (
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                                isSubItemActive 
                                  ? "bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300" 
                                  : isDarkMode 
                                    ? "bg-stone-800 text-stone-400 border border-stone-700"
                                    : "bg-stone-100 text-stone-500 border border-stone-200"
                              }`}>
                                {subItem.count}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Footer profile info */}
        <div className={`p-4 border-t flex flex-col gap-1.5 ${dividerClass} ${isDarkMode ? 'bg-stone-900/30' : 'bg-stone-50/50'} rounded-b-3xl`}>
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-start'} gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              isDarkMode 
                ? "text-stone-400 hover:text-white hover:bg-stone-800/60" 
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            }`}
            title={sidebarCollapsed ? "Expand sidebar" : "Hide sidebar"}
          >
            <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            {!sidebarCollapsed && <span>Hide sidebar</span>}
            </button>

          <div className="my-1 border-t border-transparent" />

          <div className={`flex items-center justify-between p-2 rounded-xl transition-colors ${isDarkMode ? 'bg-stone-900/50 hover:bg-stone-800' : 'bg-white hover:bg-stone-50 border border-stone-100'}`}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 shrink-0 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs uppercase">
                {admin.name.slice(0, 1)}
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0 flex-1 pr-2">
                  <h4 className={`font-bold text-xs truncate ${headingText}`}>{admin.name}</h4>
                  <p className="text-[10px] font-medium text-stone-500 truncate">{admin.email}</p>
                </div>
              )}
            </div>
            
            <button 
              onClick={handleLogout} 
              title="Sign Out" 
              className={`shrink-0 p-1.5 rounded-lg transition-colors cursor-pointer ${sidebarCollapsed ? 'mx-auto' : ''} ${isDarkMode ? 'text-stone-400 hover:text-red-400 hover:bg-red-950/30' : 'text-stone-500 hover:text-red-500 hover:bg-red-50'}`}
            >
              <svg className="w-[15px] h-[15px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <div className="flex-1 min-w-0 flex flex-col p-3 gap-4 overflow-y-auto">

        {/* Floating Top Header */}
        <header className={`border rounded-3xl px-6 py-4 flex items-center justify-between shadow-none transition-colors duration-305 ${headerClass}`}>
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
              <h1 className={`font-extrabold text-lg md:text-xl font-serif tracking-tight capitalize ${headingText}`}>
                {activeTab === "overview" ? "Analytics Command Room" : (menuItems.find(i=>i.id===activeTab) || menuItems.find(i=>i.subItems?.some((s: any)=>s.id===activeTab))?.subItems?.find((s: any)=>s.id===activeTab))?.label}
              </h1>
              <p className="text-[10px] text-stone-500 font-semibold mt-0.5">
                {loadingData ? "Syncing..." : `Status: Active • Operator: ${admin.name}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={fetchAllData}
              disabled={loadingData}
              className={`flex items-center justify-center gap-2 px-3.5 py-2 border rounded-xl font-bold text-xs shadow-none transition-all cursor-pointer disabled:opacity-50 ${
                isDarkMode
                  ? "border-stone-800 bg-stone-900 text-stone-300 hover:bg-stone-800"
                  : "border-stone-200 bg-white hover:bg-stone-50 text-stone-700"
              }`}
            >
              <span>Refresh</span>
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
              className={`lg:hidden border rounded-3xl px-6 py-4 absolute w-full top-[68px] z-30 shadow-none flex flex-col gap-2 ${
                isDarkMode ? "bg-stone-900 border-stone-800 text-white" : "bg-white border-stone-200 text-stone-800"
              }`}
            >
              {menuItems.map((item) => {
                const hasSubItems = item.subItems && item.subItems.length > 0;
                
                return (
                  <div key={item.id} className="flex flex-col gap-1">
                    <button
                      onClick={() => {
                        if (hasSubItems) {
                          setServicesExpanded(!servicesExpanded);
                        } else {
                          setActiveTab(item.id as TabType);
                          setSearchTerm("");
                          setMobileMenuOpen(false);
                        }
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all ${
                        activeTab === item.id || (hasSubItems && item.subItems.some((s: any)=>s.id === activeTab))
                          ? "bg-primary-500 text-white" 
                          : isDarkMode 
                            ? "text-stone-300 hover:bg-stone-800" 
                            : "text-stone-600 hover:bg-stone-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.count !== null && item.count !== undefined && !hasSubItems && (
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                            activeTab === item.id ? "bg-white/20 text-white" : "bg-stone-105 text-stone-600"
                          }`}>
                            {item.count}
                          </span>
                        )}
                        {hasSubItems && (
                          servicesExpanded ? <ChevronDown className="w-4 h-4 opacity-70" /> : <ChevronRight className="w-4 h-4 opacity-70" />
                        )}
                      </div>
                    </button>

                    {hasSubItems && servicesExpanded && (
                      <div className="flex flex-col gap-1 pl-4 ml-2 border-l border-stone-200 dark:border-stone-700">
                        {item.subItems.map((subItem: any) => (
                          <button
                            key={subItem.id}
                            onClick={() => {
                              setActiveTab(subItem.id as TabType);
                              setSearchTerm("");
                              setMobileMenuOpen(false);
                            }}
                            className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all ${
                              activeTab === subItem.id 
                                ? "text-primary-600 bg-primary-50 dark:bg-primary-900/20" 
                                : isDarkMode 
                                  ? "text-stone-400 hover:bg-stone-800" 
                                  : "text-stone-500 hover:bg-stone-50"
                            }`}
                          >
                            <span>{subItem.label}</span>
                            {subItem.count !== null && subItem.count !== undefined && (
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                                activeTab === subItem.id ? "bg-primary-100 text-primary-600" : "bg-stone-105 text-stone-500"
                              }`}>
                                {subItem.count}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <hr className={`my-2 ${dividerClass}`} />
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 p-3 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 font-bold rounded-xl text-xs"
              >
                Sign Out
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Error Notice */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/25 text-red-700 dark:text-red-400 flex gap-3 items-start">
            <div>
              <p className="text-xs font-black">Sync Failure Encountered</p>
              <p className="text-[11px] text-red-600 dark:text-red-400 mt-0.5">{error}</p>
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
                  
                  {/* Stats Cards Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {[
                      { 
                        title: "Total Revenue", 
                        value: formatAsCurrency(stats?.totalRevenue || 0, "INR"), 
                        change: "+12.4% vs last week", 
                        isUp: true, 
                        bgColor: "bg-white border-stone-200" ,
                        darkBg: "bg-stone-900/60 border-stone-800 text-stone-300"
                      },
                      { 
                        title: "Registered Users", 
                        value: stats?.totalUsers ?? "0", 
                        change: "+8.2% vs last month", 
                        isUp: true, 
                        bgColor: "bg-white border-stone-200",
                        darkBg: "bg-stone-900/60 border-stone-800 text-stone-300"
                      },
                      { 
                        title: "Partner Vendors", 
                        value: stats?.totalVendors ?? "0", 
                        change: `${pendingApprovals.length} pending`, 
                        isUp: pendingApprovals.length === 0, 
                        bgColor: "bg-white border-stone-200",
                        darkBg: "bg-stone-900/60 border-stone-800 text-stone-300"
                      },
                      { 
                        title: "Total Bookings", 
                        value: stats?.totalBookings ?? "0", 
                        change: `${bookings.filter(b=>b.status==='confirmed').length} confirmed`, 
                        isUp: true, 
                        bgColor: "bg-white border-stone-200",
                        darkBg: "bg-stone-900/60 border-stone-800 text-stone-300"
                      },
                    ].map((card, i) => (
                      <div key={i} className={`p-6 rounded-3xl border shadow-none flex flex-col justify-between min-h-[110px] transition-all duration-200 ${
                        isDarkMode ? card.darkBg : card.bgColor
                      }`}>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-stone-400">{card.title}</span>
                          <h3 className={`text-xl md:text-2xl font-black tracking-tight leading-none mt-2.5 ${isDarkMode ? 'text-white' : 'text-stone-905'}`}>{card.value}</h3>
                        </div>
                        <span className={`text-[10px] font-bold mt-2.5 inline-block ${card.isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'}`}>
                          {card.change}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Charts Row */}
                  <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    {/* CSS Bar Chart */}
                    <div className={`xl:col-span-3 rounded-3xl border p-6 shadow-none flex flex-col justify-between ${cardClass}`}>
                      <div className={`flex justify-between items-center pb-4 border-b ${dividerClass}`}>
                        <div>
                          <h4 className={`font-extrabold text-sm tracking-tight ${headingText}`}>Booking Volume & Revenue Trends</h4>
                          <p className="text-[10px] text-stone-400 font-semibold mt-0.5">Calculated dynamically from last 6 months of billing ledger</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-[9px] font-black text-primary-500">
                            <span className="w-2.5 h-2.5 rounded bg-primary-400 inline-block" /> Bookings
                          </div>
                          <div className="flex items-center gap-1.5 text-[9px] font-black text-amber-500">
                            <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block" /> Revenue
                          </div>
                        </div>
                      </div>

                      {/* The interactive bar container */}
                      <div className={`flex items-end justify-between h-56 pt-8 px-2 border-b relative ${dividerClass}`}>
                        {monthlyData.map((d, idx) => (
                          <div key={idx} className="flex flex-col items-center flex-1 group relative">
                            {/* Interactive tooltip */}
                            <div className="absolute bottom-full mb-3 bg-stone-950 text-white text-[10px] font-bold py-1.5 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 shadow-none whitespace-nowrap flex flex-col gap-0.5 border border-stone-800">
                              <span>Month: <span className="text-primary-400">{d.month}</span></span>
                              <span>Bookings: <span className="text-amber-400">{d.bookings}</span></span>
                              <span>Revenue: <span className="text-emerald-400">{formatAsCurrency(d.revenue, "INR")}</span></span>
                            </div>

                            {/* Dual side-by-side bars */}
                            <div className="flex gap-1.5 items-end h-36 w-full justify-center">
                              {/* Bookings bar */}
                              <div 
                                className="w-4 bg-primary-400 hover:bg-primary-500 rounded-t-lg transition-all duration-305"
                                style={{ height: `${(d.bookings / maxBookings) * 100}%` }}
                              />
                              {/* Revenue bar */}
                              <div 
                                className="w-4 bg-amber-500 hover:bg-amber-600 rounded-t-lg transition-all duration-305"
                                style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-black text-stone-500 mt-2.5 uppercase tracking-wide">{d.month}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-3 text-[10px] text-stone-400 font-semibold">
                        <span>Max Bookings: {maxBookings}</span>
                        <span>Max Revenue: {formatAsCurrency(maxRevenue, "INR")}</span>
                      </div>
                    </div>

                    {/* SVG Donut split */}
                    <div className={`xl:col-span-1 rounded-3xl border p-6 shadow-none flex flex-col justify-between ${cardClass}`}>
                      <div className={`pb-4 border-b ${dividerClass}`}>
                        <h4 className={`font-extrabold text-sm tracking-tight ${headingText}`}>Event Split</h4>
                        <p className="text-[10px] text-stone-400 font-semibold mt-0.5">Ratio of Venues vs Rooms</p>
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
                              className={isDarkMode ? "stroke-stone-800" : "stroke-stone-100"}
                              strokeWidth="8"
                              fill="transparent"
                            />
                            {/* Venue progress circle */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              className="stroke-primary-500 transition-all duration-1000"
                              strokeWidth="8"
                              strokeDasharray={2 * Math.PI * 40}
                              strokeDashoffset={2 * Math.PI * 40 * (1 - (venuePercentage || 50) / 100)}
                              fill="transparent"
                              strokeLinecap="round"
                            />
                          </svg>
                          {/* Center stats */}
                          <div className="absolute text-center">
                            <span className={`text-xl font-black tracking-tight ${headingText}`}>{venuePercentage}%</span>
                            <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">Venues</p>
                          </div>
                        </div>
                      </div>

                      <div className={`flex flex-col gap-2.5 border-t pt-4 ${dividerClass}`}>
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary-500" />
                            <span className={`font-bold ${isDarkMode ? 'text-stone-300' : 'text-stone-600'}`}>Venues</span>
                          </div>
                          <span className={`font-black ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>{totalVenueBookings} ({venuePercentage}%)</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-stone-700' : 'bg-stone-200'}`} />
                            <span className={`font-bold ${isDarkMode ? 'text-stone-300' : 'text-stone-600'}`}>Rooms</span>
                          </div>
                          <span className={`font-black ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>{totalRoomBookings} ({roomPercentage}%)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Logs & Monitor Row */}
                  <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    {/* Live Audit Log Feed */}
                    <div className={`xl:col-span-3 rounded-3xl border p-6 shadow-none ${cardClass}`}>
                      <div className={`pb-4 border-b flex items-center justify-between mb-4 ${dividerClass}`}>
                        <div>
                          <h4 className={`font-extrabold text-sm tracking-tight ${headingText}`}>System Audit Log</h4>
                          <p className="text-[10px] text-stone-400 font-semibold mt-0.5">Real-time database transaction logs</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider dark:border-stone-800">
                          LIVE LOGS
                        </span>
                      </div>

                      <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
                        {activities.length === 0 ? (
                          <p className="text-center py-12 text-stone-500 text-xs font-semibold">No recent logs recorded.</p>
                        ) : (
                          activities.map((act, idx) => (
                            <div key={idx} className={`p-3 rounded-2xl border flex items-center justify-between gap-3.5 transition-all duration-200 ${
                              isDarkMode ? "bg-stone-900/80 border-stone-800" : "bg-[#fafaf9] border-stone-200"
                            }`}>
                              <div className="min-w-0 flex-1">
                                <p className={`text-xs font-bold ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>{act.title}</p>
                                <p className="text-[10px] text-stone-505 truncate mt-0.5">{act.desc}</p>
                              </div>
                              <span className="text-[9px] font-bold text-stone-450 whitespace-nowrap tracking-wide">{formatDate(act.time)}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Server Latency & Health Console */}
                    <div className={`xl:col-span-1 rounded-3xl border p-6 shadow-none flex flex-col justify-between ${cardClass}`}>
                      <div className={`pb-4 border-b ${dividerClass}`}>
                        <h4 className={`font-extrabold text-sm tracking-tight ${headingText}`}>System Monitor</h4>
                      </div>

                      <div className="bg-stone-900 rounded-2xl p-4 font-mono text-[9px] text-emerald-400 flex flex-col gap-1.5 mt-4">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          <span className="text-stone-400 font-bold">DATABASE: CONNECTED</span>
                        </div>
                        <div className="flex justify-between border-b border-stone-800 pb-1 mt-1 text-stone-400">
                          <span>Connection</span>
                          <span className="text-stone-300 font-bold">direct-replica</span>
                        </div>
                        <div className="flex justify-between border-b border-stone-800 pb-1 text-stone-400">
                          <span>Ping Latency</span>
                          <span className="text-stone-300 font-bold">24 ms</span>
                        </div>
                        <div className="flex justify-between border-b border-stone-800 pb-1 text-stone-400">
                          <span>Admins</span>
                          <span className="text-stone-300 font-bold">{stats?.totalAdmins ?? "1"} active</span>
                        </div>
                        <div className="flex justify-between text-stone-450">
                          <span>Environment</span>
                          <span className="text-stone-300 font-bold">Production</span>
                        </div>
                      </div>

                      <button 
                        onClick={runDiagnostics}
                        disabled={checkingSystem}
                        className="w-full mt-5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        {checkingSystem ? "Syncing..." : "Sync Monitor"}
                      </button>
                    </div>
                  </div>

                  {/* ── 7-Category Real-Time Listing Grid (Admin) ── */}
                  {(() => {
                    const venueListings = venuesList;
                    const roomListings = servicesList.filter((s: any) => s.category === "rooms");
                    const plannerListings = servicesList.filter((s: any) => s.category === "planners");
                    const catererListings = servicesList.filter((s: any) => s.category === "caterers");
                    const decoratorListings = servicesList.filter((s: any) => s.category === "decorators");

                    const minPrice = (arr: any[], key = "priceFrom") =>
                      arr.length === 0 ? null : Math.min(...arr.map(i => Number(i[key] || i.price || 0)).filter(v => v > 0));

                    const avgPrice = (arr: any[], key = "priceFrom") => {
                      const valid = arr.map(i => Number(i[key] || i.price || 0)).filter(v => v > 0);
                      return valid.length === 0 ? null : valid.reduce((a, b) => a + b, 0) / valid.length;
                    };

                    const getTopName = (arr: any[]) => arr.filter(v => v.active)[0]?.name || arr[0]?.name || null;

                    const categories = [
                      { id: "venues", label: "Venues", icon: Building2, color: "from-amber-500 to-orange-500", lightBg: "bg-amber-50 border-amber-100", darkBg: "bg-amber-950/20 border-amber-900/30", count: venueListings.length, price: minPrice(venueListings, "price"), avg: avgPrice(venueListings, "price"), unit: "per day", live: venueListings.filter((v: any) => v.active).length, topName: getTopName(venueListings) },
                      { id: "rooms", label: "Rooms", icon: BedDouble, color: "from-blue-500 to-indigo-500", lightBg: "bg-blue-50 border-blue-100", darkBg: "bg-blue-950/20 border-blue-900/30", count: roomListings.length, price: minPrice(roomListings), avg: avgPrice(roomListings), unit: "per night", live: roomListings.filter((s: any) => s.active).length, topName: getTopName(roomListings) },
                      { id: "planners", label: "Planners", icon: ClipboardList, color: "from-violet-500 to-purple-500", lightBg: "bg-violet-50 border-violet-100", darkBg: "bg-violet-950/20 border-violet-900/30", count: plannerListings.length, price: minPrice(plannerListings), avg: avgPrice(plannerListings), unit: "per event", live: plannerListings.filter((s: any) => s.active).length, topName: getTopName(plannerListings) },
                      { id: "caterers", label: "Caterers", icon: Utensils, color: "from-emerald-500 to-teal-500", lightBg: "bg-emerald-50 border-emerald-100", darkBg: "bg-emerald-950/20 border-emerald-900/30", count: catererListings.length, price: minPrice(catererListings), avg: avgPrice(catererListings), unit: "per plate", live: catererListings.filter((s: any) => s.active).length, topName: getTopName(catererListings) },
                      { id: "decorators", label: "Decorators", icon: Palette, color: "from-pink-500 to-rose-500", lightBg: "bg-pink-50 border-pink-100", darkBg: "bg-pink-950/20 border-pink-900/30", count: decoratorListings.length, price: minPrice(decoratorListings), avg: avgPrice(decoratorListings), unit: "per event", live: decoratorListings.filter((s: any) => s.active).length, topName: getTopName(decoratorListings) },
                    ];

                    return (
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-extrabold text-sm tracking-tight ${headingText}`}>Platform Inventory by Category</h3>
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Live • {servicesList.length + venuesList.length} total listings</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
                          {categories.map((cat, idx) => (
                            <div
                              key={idx}
                              className={`relative group flex flex-col gap-2 p-4 rounded-2xl border text-left transition-all duration-200 hover:-translate-y-0.5 cursor-default ${isDarkMode ? cat.darkBg : cat.lightBg}`}
                            >
                              {/* Emoji + live badge */}
                              <div className="flex items-start justify-between mb-1">
                                <div className="text-2xl mb-2 opacity-90"><cat.icon className="w-8 h-8 text-stone-700" /></div>
                                {cat.live > 0 && (
                                  <span className="flex items-center gap-1 text-[8px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500 text-white uppercase tracking-wide">
                                    <span className="w-1 h-1 rounded-full bg-white animate-ping inline-block" />
                                    {cat.live} live
                                  </span>
                                )}
                              </div>

                              {/* Label */}
                              <div>
                                <p className={`text-[10px] font-extrabold uppercase tracking-wide leading-tight ${isDarkMode ? "text-stone-400" : "text-stone-500"}`}>Top {cat.label}</p>
                                {cat.topName ? (
                                  <p className={`text-[13px] font-bold mt-0.5 line-clamp-2 leading-snug ${isDarkMode ? "text-stone-200" : "text-stone-800"}`} title={cat.topName}>
                                    {cat.topName}
                                  </p>
                                ) : (
                                  <p className={`text-[13px] font-bold mt-0.5 line-clamp-2 leading-snug ${isDarkMode ? "text-stone-500" : "text-stone-400"}`}>
                                    No {cat.label.toLowerCase()}
                                  </p>
                                )}
                              </div>

                              {/* Count */}
                              <div className="flex items-baseline gap-1 mt-1">
                                <span className={`text-2xl font-black leading-none ${isDarkMode ? "text-white" : "text-stone-900"}`}>{cat.count}</span>
                                <span className="text-[10px] font-bold text-stone-400">{cat.count === 1 ? "listing" : "listings"}</span>
                              </div>

                              {/* Price section */}
                              <div className={`pt-2.5 border-t ${isDarkMode ? "border-stone-700" : "border-stone-200/70"} flex flex-col gap-1`}>
                                {cat.price !== null && cat.price > 0 ? (
                                  <>
                                    <div className="flex flex-col gap-0.5">
                                      <span className="text-[8px] font-black uppercase tracking-widest text-stone-400">from</span>
                                      <span className={`text-[13px] font-black leading-none ${isDarkMode ? "text-white" : "text-stone-800"}`}>₹{cat.price.toLocaleString("en-IN")}</span>
                                      <span className="text-[9px] text-stone-400 font-semibold">{cat.unit}</span>
                                    </div>
                                    {cat.avg !== null && cat.avg !== cat.price && (
                                      <div className="flex items-center gap-1 mt-1">
                                        <span className="text-[8px] text-stone-400 font-semibold">avg ₹{cat.avg.toLocaleString("en-IN")}</span>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-[10px] text-stone-400 font-semibold">No price set</span>
                                )}
                              </div>

                              {/* Gradient bottom line */}
                              <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl bg-gradient-to-r ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* ─── TAB: VENDOR APPROVALS ─── */}
              {activeTab === "approvals" && (
                <div className={`border rounded-3xl p-6 shadow-none ${cardClass}`}>
                  <div className={`flex justify-between items-center pb-4 border-b mb-6 ${dividerClass}`}>
                    <div>
                      <h3 className={`font-extrabold text-base ${headingText}`}>New Vendor Registrations</h3>
                      <p className="text-[10px] text-stone-400 font-semibold mt-0.5">Verify and moderate brand profile requests in the onboarding pipeline</p>
                    </div>
                    <span className="text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-wider dark:bg-amber-905/20 dark:border-amber-900/50">
                      {filteredApprovals.length} pending verification
                    </span>
                  </div>

                  {filteredApprovals.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center">
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
                          className="relative rounded-[24px] overflow-hidden shadow-none border border-slate-100 w-full h-auto min-h-[380px] cursor-pointer block group bg-gradient-to-br from-slate-800 to-slate-900"
                        >
                          {/* Ambient background decoration */}
                          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
                          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

                          {/* Tag pill top-left */}
                          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-slate-900/80 backdrop-blur-md">
                            <Sparkles className="w-3.5 h-3.5" />
                            {v.category}
                          </div>

                          {/* Status pill top-right */}
                          <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full text-[10px] font-bold text-amber-800 bg-amber-100 uppercase tracking-widest shadow-none">
                            Pending
                          </div>

                          {/* Content Area */}
                          <div className="absolute inset-x-0 bottom-0 z-20 px-5 pt-6 pb-5 flex flex-col h-full justify-end">
                            <div className="mb-4">
                              <h3 className="text-2xl font-bold leading-snug text-white line-clamp-2" style={{ fontFamily: "var(--font-heading)" }}>
                                {v.businessName || "No Business Name"}
                              </h3>
                              <div className="flex items-center gap-1 mt-2">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                <span className="text-xs font-medium text-slate-300 line-clamp-1">{v.city || "Not Specified"}</span>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2.5 mb-5 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-none">
                              <p className="text-xs text-slate-200"><span className="font-semibold text-white uppercase tracking-wider text-[10px] mr-2">Rep:</span> {v.name}</p>
                              <p className="text-xs text-slate-200"><span className="font-semibold text-white uppercase tracking-wider text-[10px] mr-2">Email:</span> {v.email}</p>
                              <p className="text-xs text-slate-200"><span className="font-semibold text-white uppercase tracking-wider text-[10px] mr-2">Phone:</span> {v.phone || "N/A"}</p>
                              <p className="text-xs text-slate-200"><span className="font-semibold text-white uppercase tracking-wider text-[10px] mr-2">Applied:</span> {formatDate(v.createdAt)}</p>
                              
                              {v.images && v.images.length > 0 && (
                                <div className="mt-2 border-t border-white/10 pt-2">
                                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-1.5">Showcase Gallery ({v.images.length}/6)</p>
                                  <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                                    {v.images.map((imgUrl: string, idx: number) => (
                                      <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/15 shrink-0 bg-slate-950">
                                        <img src={imgUrl} alt="Showcase Preview" className="w-full h-full object-cover" />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex gap-3 mt-1">
                              <button
                                onClick={() => handleUpdateVendorStatus(v._id, true)}
                                className="flex-1 bg-white hover:bg-slate-100 text-slate-900 font-bold py-3 rounded-full text-xs transition-colors shadow-none cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleDeleteVendor(v._id)}
                                className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-100 border border-red-500/30 font-bold py-3 rounded-full text-xs transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ─── TAB: VENDORS DIRECTORY ─── */}
              {activeTab === "vendors" && (
                <div className={`border rounded-3xl overflow-hidden p-6 shadow-none ${cardClass}`}>
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
                          <tr className={`border-b text-stone-505 font-bold ${isDarkMode ? 'bg-stone-900/50' : 'bg-[#fafaf9]'}`}>
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
                              isDarkMode ? "border-stone-800 hover:bg-stone-900/40" : "border-stone-200 hover:bg-primary-50/20"
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
                                <span className={`font-bold ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>Rating: {v.rating || 0} ({v.reviewCount || 0})</span>
                              </td>
                              <td className="p-4">
                                <button
                                  onClick={() => handleUpdateVendorStatus(v._id, !v.verified)}
                                  className={`px-3 py-1 rounded-full text-[10px] font-black cursor-pointer border transition-all ${
                                    v.verified
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900"
                                      : "bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900 dark:border-stone-800 dark:text-stone-400"
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
                                      ? "bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100 dark:hover:bg-primary-950/20 dark:text-primary-400 dark:border-primary-900"
                                      : "bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900 dark:border-stone-800 dark:text-stone-400"
                                  }`}
                                >
                                  {v.featured ? "Featured" : "Regular"}
                                </button>
                              </td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => handleDeleteVendor(v._id)}
                                  className="px-2.5 py-1 text-xs border rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 border-transparent hover:border-red-200 dark:border-red-500/25 text-stone-500 hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer"
                                >
                                  [Delete]
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
                <div className={`border rounded-3xl overflow-hidden p-6 shadow-none ${cardClass}`}>
                  <div className={`flex justify-between items-center pb-4 border-b mb-6 ${dividerClass}`}>
                    <div>
                      <h3 className={`font-extrabold text-base ${headingText}`}>Bookings Ledger</h3>
                      <p className="text-[10px] text-stone-400 font-semibold mt-0.5">Monitor client checkout orders, payments, and service statuses</p>
                    </div>
                  </div>

                  {filteredBookings.length === 0 ? (
                    <div className="py-20 text-center text-stone-505 text-sm font-semibold">
                      No bookings matching "{searchTerm}"
                    </div>
                  ) : (
                    <div className={`overflow-x-auto border rounded-2xl ${dividerClass}`}>
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className={`border-b text-stone-505 font-bold ${isDarkMode ? 'bg-stone-900/50' : 'bg-[#fafaf9]'}`}>
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
                              isDarkMode ? "border-stone-800 hover:bg-stone-900/40" : "border-stone-200 hover:bg-primary-50/20"
                            }`}>
                              <td className="p-4">
                                <p className={`font-black text-sm leading-tight ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>{b.venueName}</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span className="text-[9px] text-stone-400 font-mono">ID: {b._id.slice(0, 8)}...</span>
                                  <button 
                                    onClick={() => copyToClipboard(b._id)}
                                    className="text-[9px] font-bold text-stone-500 hover:underline cursor-pointer"
                                  >
                                    {copiedId === b._id ? "[Copied]" : "[Copy ID]"}
                                  </button>
                                </div>
                              </td>
                              <td className="p-4">
                                <p className={`font-bold ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>{b.userName}</p>
                                <p className="text-[10px] text-stone-450 mt-0.5">{b.userEmail} • {b.userPhone || "No Phone"}</p>
                              </td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase ${
                                  isDarkMode ? "bg-stone-800 border-stone-700 text-stone-300" : "bg-stone-100 border-stone-200 text-stone-600"
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
                                <p className={`font-black ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>{formatAsCurrency(b.totalAmount, b.currency || "INR")}</p>
                                <p className="text-[10px] text-stone-450 font-bold mt-0.5">Adv: {formatAsCurrency(b.advanceAmount, b.currency || "INR")}</p>
                              </td>
                              <td className="p-4">
                                <select
                                  value={b.status}
                                  onChange={(e) => handleUpdateBookingStatus(b._id, e.target.value)}
                                  className={`text-[10px] font-extrabold rounded-lg border px-2.5 py-1 bg-white outline-none cursor-pointer transition-colors dark:bg-stone-900 bg-none ${
                                    b.status === "confirmed"
                                      ? "text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/25 bg-emerald-50/70 dark:text-emerald-400 dark:border-emerald-900"
                                      : b.status === "completed"
                                      ? "text-blue-700 border-blue-200 bg-blue-50/70 dark:text-blue-400 dark:border-blue-900"
                                      : b.status === "cancelled"
                                      ? "text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/25 bg-red-50/70 dark:text-red-400 dark:border-red-900"
                                      : "text-amber-700 border-amber-200 bg-amber-50/70 dark:text-amber-400 dark:border-amber-900"
                                  }`}
                                >
                                  <option value="pending" className="text-amber-700 font-bold bg-white dark:bg-stone-900">Pending</option>
                                  <option value="confirmed" className="text-emerald-700 dark:text-emerald-400 font-bold bg-white dark:bg-stone-900">Confirmed</option>
                                  <option value="completed" className="text-blue-700 font-bold bg-white dark:bg-stone-900">Completed</option>
                                  <option value="cancelled" className="text-red-700 dark:text-red-400 font-bold bg-white dark:bg-stone-900">Cancelled</option>
                                </select>
                              </td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => handleDeleteBooking(b._id)}
                                  className="px-2 py-1 text-xs border rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 border-transparent hover:border-red-200 dark:border-red-500/25 text-stone-450 hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer"
                                >
                                  [Delete]
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
                <div className={`border rounded-3xl overflow-hidden p-6 shadow-none ${cardClass}`}>
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
                              isDarkMode ? "border-stone-800 hover:bg-stone-900/40" : "border-stone-200 hover:bg-primary-50/20"
                            }`}>
                              <td className={`p-4 font-black text-sm ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>{u.name}</td>
                              <td className={`p-4 font-semibold ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>{u.email}</td>
                              <td className={`p-4 font-medium ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>{u.phone || "N/A"}</td>
                              <td className="p-4">
                                <select
                                  value={u.role}
                                  onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                                  className="text-[10px] font-black bg-white border border-stone-300 text-stone-700 rounded-xl px-2.5 py-1 outline-none cursor-pointer hover:border-stone-400 transition-colors dark:bg-stone-900 dark:border-stone-700 dark:text-stone-300 bg-none"
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
                                  className="px-2.5 py-1 text-xs border rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 border-transparent hover:border-red-200 dark:border-red-500/25 text-stone-450 hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer"
                                >
                                  [Delete]
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

              {/* ─── TAB: SETTINGS ─── */}
              {activeTab === "settings" && (
                <div className={`border rounded-3xl overflow-hidden p-6 shadow-none max-w-2xl ${cardClass}`}>
                  <div className={`flex justify-between items-center pb-4 border-b mb-6 ${dividerClass}`}>
                    <div>
                      <h3 className={`font-extrabold text-base ${headingText}`}>Account Settings</h3>
                      <p className="text-[10px] text-stone-400 font-semibold mt-0.5">Manage your administrator account security</p>
                    </div>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-stone-500">Current Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                        <input
                          type="password"
                          required
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className={`w-full pl-9 pr-4 py-2 border rounded-xl text-sm outline-none transition-all ${isDarkMode ? "bg-stone-900 border-stone-800 text-stone-200 focus:border-primary-500" : "bg-stone-50 border-stone-200 focus:border-primary-400"}`}
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-semibold text-stone-500">New Password</label>
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
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          minLength={6}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className={`w-full pl-9 pr-10 py-2 border rounded-xl text-sm outline-none transition-all ${isDarkMode ? "bg-stone-900 border-stone-800 text-stone-200 focus:border-primary-500" : "bg-stone-50 border-stone-200 focus:border-primary-400"}`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 transition-colors"
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
                        className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                      >
                        {isChangingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save New Password
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ─── TAB: VENUES DIRECTORY ─── */}
              {activeTab === "venues" && (
                <div className={`border rounded-3xl overflow-hidden p-6 shadow-none ${cardClass}`}>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {filteredVenuesList.map((v) => (
                        <div key={v._id} className="group h-[470px]">
                          <ListingCard
                            name={v.name}
                            image={v.image || (v.gallery && v.gallery[0]) || ""}
                            location={v.city}
                            rating={v.rating || 0}
                            reviewCount={v.reviewCount}
                            priceDisplay={v.price ? `₹${Number(v.price).toLocaleString("en-IN")}` : "—"}
                            unit={`/${v.priceUnit || "per day"}`}
                            priceLabel="starting from"
                            badge={
                              v.featured ? (
                                <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-sm" style={{ background: "var(--sw-primary)" }}>
                                  <Star className="w-3 h-3 inline-block" /> Featured
                                </div>
                              ) : undefined
                            }
                            topRight={
                              <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm ${v.active ? "bg-emerald-500 text-white" : "bg-amber-400 text-white"}`}>
                                {v.active ? "Live" : "Hidden"}
                              </span>
                            }
                            tags={
                              <>
                                <CardTag><Users className="w-3 h-3" /> {v.minGuests}–{v.maxGuests} pax</CardTag>
                                {v.type && <CardTag tone="accent">{v.type}</CardTag>}
                              </>
                            }
                            action={
                              <button
                                onClick={async () => {
                                  if (!confirm(`Delete "${v.name}" permanently?`)) return;
                                  await fetch(`/api/venues?venueId=${v.venueId}`, { method: "DELETE" });
                                  fetchAllData();
                                }}
                                className="flex items-center justify-center w-9 h-9 rounded-full text-red-500 dark:text-red-400 bg-white/90 dark:bg-white/10 hover:bg-red-500 hover:text-white transition-all cursor-pointer shadow-sm"
                                title="Delete venue"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            }
                            footer={
                              <div className="flex flex-wrap gap-1.5">
                                <button
                                  onClick={async () => {
                                    await fetch("/api/venues", {
                                      method: "PATCH",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ venueId: v.venueId, verified: !v.verified }),
                                    });
                                    fetchAllData();
                                  }}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer border transition-all ${
                                    v.verified
                                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                                      : "bg-white/70 dark:bg-white/10 text-slate-500 dark:text-stone-400 border-slate-900/10 dark:border-white/15"
                                  }`}
                                >
                                  {v.verified ? "Verified" : "Pending"}
                                </button>
                                <button
                                  onClick={async () => {
                                    await fetch("/api/venues", {
                                      method: "PATCH",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ venueId: v.venueId, featured: !v.featured }),
                                    });
                                    fetchAllData();
                                  }}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer border transition-all ${
                                    v.featured
                                      ? "bg-primary-500/15 text-primary-700 dark:text-primary-300 border-primary-500/30"
                                      : "bg-white/70 dark:bg-white/10 text-slate-500 dark:text-stone-400 border-slate-900/10 dark:border-white/15"
                                  }`}
                                >
                                  {v.featured ? "Featured" : "Regular"}
                                </button>
                                <button
                                  onClick={async () => {
                                    await fetch("/api/venues", {
                                      method: "PATCH",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ venueId: v.venueId, active: !v.active }),
                                    });
                                    fetchAllData();
                                  }}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer border transition-all ${
                                    v.active
                                      ? "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30"
                                      : "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30"
                                  }`}
                                >
                                  {v.active ? "Live" : "Hidden"}
                                </button>
                              </div>
                            }
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {["rooms", "planners", "caterers", "decorators"].includes(activeTab) && (() => {
                const filteredServices = servicesList.filter(s => s.category === activeTab && (
                  s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  s.city.toLowerCase().includes(searchTerm.toLowerCase())
                ));
                return (
                  <div className={`border rounded-3xl overflow-hidden p-6 shadow-none ${cardClass}`}>
                    <div className={`flex justify-between items-center pb-4 border-b mb-6 ${dividerClass}`}>
                      <div>
                        <h3 className={`font-extrabold text-base capitalize ${headingText}`}>{activeTab} Directory</h3>
                        <p className="text-[10px] text-stone-400 font-semibold mt-0.5">Toggle live status, verified flags, and details on all listings</p>
                      </div>
                      <span className="text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200 px-3.5 py-1.5 rounded-full uppercase tracking-wider dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900">
                        {filteredServices.length} {activeTab} total
                      </span>
                    </div>

                    {filteredServices.length === 0 ? (
                      <div className="py-20 text-center text-stone-500 text-sm font-semibold">
                        No {activeTab} matching "{searchTerm}"
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredServices.map(s => (
                          <div key={s._id} className={`group h-[450px] ${!s.active ? "opacity-70" : ""}`}>
                            <ListingCard
                              name={s.name}
                              image={s.image || ""}
                              location={s.city}
                              rating={s.rating || 0}
                              reviewCount={s.reviewCount}
                              priceDisplay={`₹${Number(s.priceFrom || 0).toLocaleString("en-IN")}`}
                              unit={s.priceUnit ? `/${s.priceUnit}` : undefined}
                              priceLabel="starting at"
                              badge={
                                s.featured ? (
                                  <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-sm" style={{ background: "var(--sw-primary)" }}>
                                    <Star className="w-3 h-3 inline-block" /> Featured
                                  </div>
                                ) : undefined
                              }
                              topRight={
                                <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm ${s.active ? "bg-emerald-500 text-white" : "bg-amber-400 text-white"}`}>
                                  {s.active ? "Live" : "Hidden"}
                                </span>
                              }
                              tags={<CardTag tone="accent">{s.category}</CardTag>}
                              action={
                                <button
                                  onClick={() => handleDeleteService(s.serviceId)}
                                  className="flex items-center justify-center w-9 h-9 rounded-full text-red-500 dark:text-red-400 bg-white/90 dark:bg-white/10 hover:bg-red-500 hover:text-white transition-all cursor-pointer shadow-sm"
                                  title="Delete listing"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              }
                              footer={
                                <div className="flex flex-wrap gap-1.5">
                                  <button
                                    onClick={() => handleUpdateServiceStatus(s.serviceId, !s.verified, s.featured, s.active)}
                                    className={`px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer border transition-all ${
                                      s.verified
                                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                                        : "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30"
                                    }`}
                                  >
                                    {s.verified ? "Verified" : "Pending"}
                                  </button>
                                  <button
                                    onClick={() => handleUpdateServiceStatus(s.serviceId, s.verified, !s.featured, s.active)}
                                    className={`px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer border transition-all ${
                                      s.featured
                                        ? "bg-primary-500/15 text-primary-700 dark:text-primary-300 border-primary-500/30"
                                        : "bg-white/70 dark:bg-white/10 text-slate-500 dark:text-stone-400 border-slate-900/10 dark:border-white/15"
                                    }`}
                                  >
                                    {s.featured ? "Featured" : "Regular"}
                                  </button>
                                  <button
                                    onClick={() => handleUpdateServiceStatus(s.serviceId, s.verified, s.featured, !s.active)}
                                    className={`px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer border transition-all ${
                                      s.active
                                        ? "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30"
                                        : "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30"
                                    }`}
                                  >
                                    {s.active ? "Live" : "Hidden"}
                                  </button>
                                </div>
                              }
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
