"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "@/components/shared/CustomImage";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ArrowLeft, ArrowRight, Upload, Plus, Loader2, LayoutDashboard, Inbox, MapPin, Settings, ClipboardList, Camera, Brush, Sparkles, HeartHandshake } from "lucide-react";
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
  description?: string;
  website?: string;
  instagram?: string;
  priceFrom?: number | string;
  images?: string[];
  verified?: boolean;
  featured?: boolean;
  available?: boolean;
}

type TabType = "overview" | "leads" | "venues" | "settings" | "planners" | "photographers" | "decorators" | "makeupartists" | "sakhiservice";

interface DashboardBooking {
  _id: string;
  status?: string;
  [key: string]: unknown;
}

interface VenueItem {
  _id: string;
  name: string;
  city: string;
  location?: string;
  country?: string;
  image?: string;
  gallery?: string[];
  rating?: number;
  reviewCount?: number;
  price?: string;
  priceUnit?: string;
  pricePerPlateVeg?: string;
  pricePerPlateNonVeg?: string;
  rentalCost?: string;
  featured?: boolean;
  verified?: boolean;
  active?: boolean;
  type?: string;
  venueId?: string;
  minGuests?: number;
  maxGuests?: number;
  rooms?: number;
  outdoor?: boolean;
  indoor?: boolean;
  parking?: boolean;
  catering?: boolean;
  description?: string;
  features?: string[];
}

interface VenueFormState {
  name: string;
  city: string;
  location: string;
  country: string;
  type: string;
  price: string;
  priceUnit: string;
  pricePerPlateVeg: string;
  pricePerPlateNonVeg: string;
  rentalCost: string;
  image: string;
  minGuests: string;
  maxGuests: string;
  rooms: string;
  outdoor: boolean;
  indoor: boolean;
  parking: boolean;
  catering: boolean;
  description: string;
  features: string;
}

const defaultVenueForm: VenueFormState = {
  name: "", city: "", location: "", country: "India", type: "Banquet Hall",
  price: "", priceUnit: "per day", pricePerPlateVeg: "", pricePerPlateNonVeg: "",
  rentalCost: "", image: "", minGuests: "50", maxGuests: "500", rooms: "0",
  outdoor: false, indoor: true, parking: false, catering: false,
  description: "", features: "",
};

export default function VendorDashboard() {
  const router = useRouter();
  const [vendor, setVendor] = useState<VendorSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [available, setAvailable] = useState(true);
  const [bookings, setBookings] = useState<DashboardBooking[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDarkMode = false;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  // Showcase gallery states
  const [showcaseImages, setShowcaseImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Venues managed by this vendor account
  const [venues, setVenues] = useState<VenueItem[]>([]);

  // Venue management UI state
  const [venueView, setVenueView] = useState<"grid" | "add" | "edit">("grid");
  const [editingVenue, setEditingVenue] = useState<VenueItem | null>(null);
  const [venueForm, setVenueForm] = useState<VenueFormState>(defaultVenueForm);
  const [savingVenue, setSavingVenue] = useState(false);
  const [venueMessage, setVenueMessage] = useState<string | null>(null);
  const [uploadingVenueImage, setUploadingVenueImage] = useState(false);

  const fetchVenues = async () => {
    try {
      const res = await fetch("/api/venues");
      if (res.ok) {
        const data = await res.json();
        setVenues(data.venues || []);
      }
    } catch (err) {
      console.error("Failed to fetch venues", err);
    }
  };

  const openAddVenue = () => {
    setVenueForm(defaultVenueForm);
    setEditingVenue(null);
    setVenueMessage(null);
    setVenueView("add");
  };

  const openEditVenue = (v: VenueItem) => {
    setVenueForm({
      name: v.name || "",
      city: v.city || "",
      location: v.location || "",
      country: v.country || "India",
      type: v.type || "Banquet Hall",
      price: v.price || "",
      priceUnit: v.priceUnit || "per day",
      pricePerPlateVeg: v.pricePerPlateVeg || "",
      pricePerPlateNonVeg: v.pricePerPlateNonVeg || "",
      rentalCost: v.rentalCost || "",
      image: v.image || "",
      minGuests: String(v.minGuests ?? 50),
      maxGuests: String(v.maxGuests ?? 500),
      rooms: String(v.rooms ?? 0),
      outdoor: Boolean(v.outdoor),
      indoor: v.indoor !== false,
      parking: Boolean(v.parking),
      catering: Boolean(v.catering),
      description: v.description || "",
      features: Array.isArray(v.features) ? v.features.join(", ") : "",
    });
    setEditingVenue(v);
    setVenueMessage(null);
    setVenueView("edit");
  };

  const handleVenueImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVenueImage(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setVenueForm(prev => ({ ...prev, image: data.url }));
    } catch {
      setVenueMessage("Image upload failed. Try pasting a URL instead.");
    } finally {
      setUploadingVenueImage(false);
    }
  };

  const handleSaveVenue = async () => {
    if (!venueForm.name.trim() || !venueForm.city.trim()) {
      setVenueMessage("Venue name and city are required.");
      return;
    }
    setSavingVenue(true);
    setVenueMessage(null);
    try {
      const payload = {
        ...venueForm,
        minGuests: parseInt(venueForm.minGuests) || 50,
        maxGuests: parseInt(venueForm.maxGuests) || 500,
        rooms: parseInt(venueForm.rooms) || 0,
        features: venueForm.features.split(",").map(f => f.trim()).filter(Boolean),
      };
      if (venueView === "add") {
        const res = await fetch("/api/venues", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to create venue.");
        setVenueMessage("Venue submitted! Admin will review and activate it.");
        await fetchVenues();
        setTimeout(() => setVenueView("grid"), 1800);
      } else if (venueView === "edit" && editingVenue) {
        const res = await fetch("/api/venues", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ venueId: editingVenue.venueId, ...payload }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to update venue.");
        setVenueMessage("Venue updated successfully!");
        await fetchVenues();
        setTimeout(() => setVenueView("grid"), 1200);
      }
    } catch (err) {
      setVenueMessage(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSavingVenue(false);
    }
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
            setShowcaseImages(data.user.images || []);
            setAvailable(data.user.available !== false);
            fetchBookings();
            fetchVenues();
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

  const handleAvailabilityChange = async (next: boolean) => {
    const previous = available;
    setAvailable(next);
    setProfileMessage(null);
    try {
      const res = await fetch("/api/vendors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update availability.");
      setVendor((current) => current ? { ...current, available: next } : current);
      setProfileMessage(data.message || "Availability updated.");
    } catch (err) {
      setAvailable(previous);
      setProfileMessage(err instanceof Error ? err.message : "Failed to update availability.");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (showcaseImages.length >= 6) {
      setUploadError("Maximum of 6 images allowed.");
      return;
    }

    setUploadingImage(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to upload image.");
      }

      const data = await res.json();
      setShowcaseImages((prev) => [...prev, data.url]);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setShowcaseImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const moveImage = (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= showcaseImages.length) return;

    setShowcaseImages((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
  };

  const handleSaveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      businessName: String(formData.get("businessName") || ""),
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      category: String(formData.get("category") || ""),
      city: String(formData.get("city") || ""),
      description: String(formData.get("description") || ""),
      website: String(formData.get("website") || ""),
      instagram: String(formData.get("instagram") || ""),
      priceFrom: String(formData.get("priceFrom") || ""),
      images: showcaseImages,
    };

    try {
      const res = await fetch("/api/vendors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save vendor profile.");
      setVendor(data.vendor);
      setShowcaseImages(data.vendor.images || []);
      setAvailable(data.vendor.available !== false);
      setProfileMessage(data.message || "Profile saved.");
    } catch (err) {
      setProfileMessage(err instanceof Error ? err.message : "Failed to save vendor profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-stone-50 text-stone-800 font-body">
        <div className="w-10 h-10 rounded-full border-2 border-primary-500/20 border-t-orange-500 animate-spin mb-4" />
        <p className="font-bold text-sm tracking-wide">SECURE WORKSPACE</p>
      </div>
    );
  }

  if (!vendor) return null;

  const menuItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "leads", label: "Booking Inquiries", count: bookings.length || null, icon: Inbox },
    { id: "venues", label: "My Venues", count: venues.length || null, icon: MapPin },
    { id: "settings", label: "Business Profile", icon: Settings },
    { id: "planners", label: "Planners", icon: ClipboardList },
    { id: "photographers", label: "Photographers", icon: Camera },
    { id: "decorators", label: "Decorators", icon: Brush },
    { id: "makeupartists", label: "Makeup Artists", icon: Sparkles },
    { id: "sakhiservice", label: "Sakhi Service", icon: HeartHandshake },
  ];

  // Dark Mode helper CSS classes (corrected color classes to standard Tailwind tokens)
  const containerBg = isDarkMode ? "bg-stone-950 text-stone-200" : "bg-[#fafaf9] text-stone-800";
  const sidebarClass = isDarkMode ? "border-stone-800 bg-stone-900/80 text-stone-300" : "border-stone-200 bg-white/70 text-stone-600";
  const cardClass = isDarkMode ? "bg-stone-900/60 border-stone-800 text-stone-300" : "bg-white/70 border-stone-200 text-stone-600";
  const headerClass = isDarkMode ? "bg-stone-900/70 border-stone-800 text-white" : "bg-white/70 border-stone-200 text-stone-800";
  const headingText = isDarkMode ? "text-white" : "text-stone-900";
  const dividerClass = isDarkMode ? "border-stone-800" : "border-stone-100";

  return (
    <div className={`h-screen font-body flex relative overflow-hidden p-0 sm:p-2 transition-colors duration-300 ${containerBg} ${isDarkMode ? "dark" : ""}`}>
      
      {/* Ambient background gradients */}
      <div className="absolute w-[50rem] h-[50rem] -top-96 -left-96 opacity-[0.03] pointer-events-none rounded-full bg-primary-500 blur-[120px]" />
      <div className="absolute w-[45rem] h-[45rem] -bottom-80 -right-80 opacity-[0.03] pointer-events-none rounded-full bg-amber-500 blur-[120px]" />

      {/* ─── FLOATING SIDEBAR (Desktop) ─── */}
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
              <p className="text-[9px] font-bold text-primary-600 uppercase tracking-widest mt-1">Partner Portal</p>
            </div>
          ) : (
            <h2 className={`font-extrabold text-sm tracking-tight uppercase ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>SW</h2>
          )}
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
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
                {!sidebarCollapsed && item.count !== undefined && item.count !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                    isActive ? "bg-white/20 text-white" : "bg-stone-100 text-stone-500 border border-stone-200"
                  }`}>
                    {item.count}
                  </span>
                )}
                {sidebarCollapsed && item.count !== undefined && item.count !== null && (
                  <span className={`absolute right-1.5 top-1.5 px-1.5 py-0.5 rounded-full text-[8px] font-black ${
                    isActive ? "bg-white text-primary-600" : "bg-stone-100 text-stone-500 border border-stone-200"
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

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
                {vendor.businessName ? vendor.businessName.slice(0, 1) : "V"}
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0 flex-1 pr-2">
                  <h4 className={`font-bold text-xs truncate ${headingText}`}>{vendor.businessName || vendor.name}</h4>
                  <p className="text-[10px] font-medium text-stone-500 truncate">{vendor.email}</p>
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
                {activeTab === "overview" && "Manage your profile showcase, settings, and upcoming client bookings."}
                {activeTab === "leads" && "All couple enquiries and booking requests."}
                {activeTab === "venues" && "All active venue listings synced to the public directory."}
                {activeTab === "settings" && "Manage your vendor portal configuration."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
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
                      ? "bg-primary-500 text-white" 
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
                  vendor.verified
                    ? isDarkMode ? "bg-emerald-950/10 border-emerald-900/50" : "bg-emerald-50/60 border-emerald-200"
                    : isDarkMode ? "bg-amber-950/10 border-amber-900/50" : "bg-amber-50/60 border-amber-200"
                }`}>
                  <div className="flex gap-3 text-xs font-semibold">
                    <div>
                      <h4 className={`font-bold ${headingText}`}>
                        {vendor.verified ? "Profile Approved and Public" : "Account Verification Pending"}
                      </h4>
                      <p className="text-[10px] text-stone-500 mt-0.5 font-medium">
                        {vendor.verified
                          ? "Your profile can appear in the public vendor directory while accepting enquiries is enabled."
                          : "Administrators will verify your brand details soon. Public listing stays hidden until approval."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  
                  {/* Performance grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-0.5 cursor-pointer"
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
                      <div className="flex gap-5 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                        {bookings.slice(0, 6).map((booking) => (
                          <div key={booking._id} className="flex-shrink-0 w-[85vw] sm:w-[320px] lg:w-[360px]">
                            <BookingCard booking={booking} isVendor={true} />
                          </div>
                        ))}
                      </div>
                    )}
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
                  <div className="flex gap-5 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                    {bookings.map((booking) => (
                      <div key={booking._id} className="flex-shrink-0 w-[85vw] sm:w-[320px] lg:w-[360px]">
                        <BookingCard booking={booking} isVendor={true} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* MY VENUES TAB */}
            {activeTab === "venues" && (
              <div className="flex flex-col gap-5">

                {/* ── Header bar ── */}
                <div className={`rounded-3xl p-5 border flex items-center justify-between shadow-none ${cardClass}`}>
                  <div>
                    <h3 className={`font-extrabold text-base ${headingText}`}>My Venues</h3>
                    <p className="text-[10px] text-stone-400 font-medium mt-0.5">
                      {`${venues.length} venue${venues.length !== 1 ? "s" : ""} in your account`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={openAddVenue}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-[11px] font-bold cursor-pointer transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add New Venue
                    </button>
                  </div>
                </div>

                {/* ── ADD / EDIT FORM MODAL ── */}
                <AnimatePresence>
                  {(venueView === "add" || venueView === "edit") && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
                    >
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 md:p-8 border shadow-2xl relative ${cardClass}`}
                        style={{ scrollbarWidth: 'none' }}
                      >
                        <button
                          onClick={() => setVenueView("grid")}
                          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-500 transition-colors z-10 cursor-pointer"
                        >
                          ✕
                        </button>
                        <h3 className={`font-extrabold text-lg mb-6 ${headingText}`}>
                          {venueView === "add" ? "Add New Venue" : `Edit Venue: ${editingVenue?.name}`}
                        </h3>
                    {venueMessage && (
                      <div className={`mb-5 rounded-3xl px-4 py-3 text-xs font-bold border ${
                        venueMessage.includes("Failed") || venueMessage.includes("required")
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}>{venueMessage}</div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">

                      {/* Venue Name */}
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-stone-500 uppercase tracking-wider">Venue Name *</label>
                        <input
                          type="text" value={venueForm.name} required
                          onChange={e => setVenueForm(p => ({ ...p, name: e.target.value }))}
                          placeholder="e.g. Grand Palace Banquet"
                          className={`border rounded-xl px-4 py-2.5 outline-none font-semibold ${
                            isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-800"
                          }`}
                        />
                      </div>

                      {/* Venue Type */}
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-stone-500 uppercase tracking-wider">Venue Type</label>
                        <select
                          value={venueForm.type}
                          onChange={e => setVenueForm(p => ({ ...p, type: e.target.value }))}
                          className={`border rounded-xl px-4 py-2.5 outline-none font-semibold ${
                            isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-800"
                          }`}
                        >
                          {["Banquet Hall","Resort","Farm House","Palace","Beach Resort","Garden Venue","Heritage Hotel","Rooftop Venue","Convention Center","Destination Venue"].map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      {/* City */}
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-stone-500 uppercase tracking-wider">City *</label>
                        <input
                          type="text" value={venueForm.city} required
                          onChange={e => setVenueForm(p => ({ ...p, city: e.target.value }))}
                          placeholder="e.g. Mumbai"
                          className={`border rounded-xl px-4 py-2.5 outline-none font-semibold ${
                            isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-800"
                          }`}
                        />
                      </div>

                      {/* Location / Address */}
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-stone-500 uppercase tracking-wider">Location / Address</label>
                        <input
                          type="text" value={venueForm.location}
                          onChange={e => setVenueForm(p => ({ ...p, location: e.target.value }))}
                          placeholder="e.g. Andheri West"
                          className={`border rounded-xl px-4 py-2.5 outline-none font-semibold ${
                            isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-800"
                          }`}
                        />
                      </div>

                      {/* Price */}
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-stone-500 uppercase tracking-wider">Starting Price</label>
                        <input
                          type="text" value={venueForm.price}
                          onChange={e => setVenueForm(p => ({ ...p, price: e.target.value }))}
                          placeholder="e.g. 50000"
                          className={`border rounded-xl px-4 py-2.5 outline-none font-semibold ${
                            isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-800"
                          }`}
                        />
                      </div>

                      {/* Price Unit */}
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-stone-500 uppercase tracking-wider">Price Unit</label>
                        <select
                          value={venueForm.priceUnit}
                          onChange={e => setVenueForm(p => ({ ...p, priceUnit: e.target.value }))}
                          className={`border rounded-xl px-4 py-2.5 outline-none font-semibold ${
                            isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-800"
                          }`}
                        >
                          {["per day","per night","per plate","per person","per event"].map(u => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                        </select>
                      </div>

                      {/* Price Per Plate Veg */}
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-stone-500 uppercase tracking-wider">Price/Plate (Veg)</label>
                        <input
                          type="text" value={venueForm.pricePerPlateVeg}
                          onChange={e => setVenueForm(p => ({ ...p, pricePerPlateVeg: e.target.value }))}
                          placeholder="e.g. 800"
                          className={`border rounded-xl px-4 py-2.5 outline-none font-semibold ${
                            isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-800"
                          }`}
                        />
                      </div>

                      {/* Price Per Plate Non-Veg */}
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-stone-500 uppercase tracking-wider">Price/Plate (Non-Veg)</label>
                        <input
                          type="text" value={venueForm.pricePerPlateNonVeg}
                          onChange={e => setVenueForm(p => ({ ...p, pricePerPlateNonVeg: e.target.value }))}
                          placeholder="e.g. 1200"
                          className={`border rounded-xl px-4 py-2.5 outline-none font-semibold ${
                            isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-800"
                          }`}
                        />
                      </div>

                      {/* Min Guests */}
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-stone-500 uppercase tracking-wider">Min Guests</label>
                        <input
                          type="number" min="1" value={venueForm.minGuests}
                          onChange={e => setVenueForm(p => ({ ...p, minGuests: e.target.value }))}
                          className={`border rounded-xl px-4 py-2.5 outline-none font-semibold ${
                            isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-800"
                          }`}
                        />
                      </div>

                      {/* Max Guests */}
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-stone-500 uppercase tracking-wider">Max Guests</label>
                        <input
                          type="number" min="1" value={venueForm.maxGuests}
                          onChange={e => setVenueForm(p => ({ ...p, maxGuests: e.target.value }))}
                          className={`border rounded-xl px-4 py-2.5 outline-none font-semibold ${
                            isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-800"
                          }`}
                        />
                      </div>

                      {/* Rooms */}
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-stone-500 uppercase tracking-wider">Number of Rooms</label>
                        <input
                          type="number" min="0" value={venueForm.rooms}
                          onChange={e => setVenueForm(p => ({ ...p, rooms: e.target.value }))}
                          className={`border rounded-xl px-4 py-2.5 outline-none font-semibold ${
                            isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-800"
                          }`}
                        />
                      </div>

                      {/* Features */}
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-stone-500 uppercase tracking-wider">Features (comma-separated)</label>
                        <input
                          type="text" value={venueForm.features}
                          onChange={e => setVenueForm(p => ({ ...p, features: e.target.value }))}
                          placeholder="Swimming Pool, Lawn, AV System, Bridal Suite"
                          className={`border rounded-xl px-4 py-2.5 outline-none font-semibold ${
                            isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-800"
                          }`}
                        />
                      </div>

                    </div>

                    {/* ── Main Image ── */}
                    <div className="mt-5 flex flex-col gap-2 text-xs">
                      <label className="font-bold text-stone-500 uppercase tracking-wider">Main Venue Image</label>
                      <div className="flex items-start gap-4">
                        {venueForm.image && (
                          <div className="relative w-32 h-24 rounded-xl overflow-hidden border border-stone-200/20 flex-shrink-0">
                            <img src={venueForm.image} alt="preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 flex flex-col gap-2">
                          <label className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed cursor-pointer transition-all hover:border-primary-500 hover:bg-primary-50/5 text-stone-400 hover:text-primary-500 w-fit ${
                            isDarkMode ? "border-stone-700" : "border-stone-300"
                          }`}>
                            {uploadingVenueImage ? (
                              <><Loader2 className="w-4 h-4 animate-spin text-primary-500" /> Uploading...</>
                            ) : (
                              <><Upload className="w-4 h-4" /> Upload Photo</>
                            )}
                            <input type="file" accept="image/*" onChange={handleVenueImageUpload} disabled={uploadingVenueImage} className="hidden" />
                          </label>
                          <input
                            type="url" value={venueForm.image}
                            onChange={e => setVenueForm(p => ({ ...p, image: e.target.value }))}
                            placeholder="Or paste image URL..."
                            className={`border rounded-xl px-4 py-2 outline-none font-semibold text-[11px] ${
                              isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-800"
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* ── Amenities toggles ── */}
                    <div className="mt-5 text-xs">
                      <label className="font-bold text-stone-500 uppercase tracking-wider block mb-3">Amenities</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {(["outdoor","indoor","parking","catering"] as const).map(key => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setVenueForm(p => ({ ...p, [key]: !p[key] }))}
                            className={`flex items-center justify-between px-4 py-2.5 rounded-xl border font-bold capitalize cursor-pointer transition-all ${
                              venueForm[key]
                                ? "bg-primary-500 border-primary-500 text-white"
                                : isDarkMode
                                  ? "border-stone-700 text-stone-400 hover:border-stone-600"
                                  : "border-stone-200 text-stone-500 hover:border-stone-300"
                            }`}
                          >
                            <span>{key}</span>
                            <span className={`w-2.5 h-2.5 rounded-full ${
                              venueForm[key] ? "bg-white" : isDarkMode ? "bg-stone-700" : "bg-stone-200"
                            }`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ── Description ── */}
                    <div className="mt-5 flex flex-col gap-1.5 text-xs">
                      <label className="font-bold text-stone-500 uppercase tracking-wider">Description</label>
                      <textarea
                        value={venueForm.description} rows={4}
                        onChange={e => setVenueForm(p => ({ ...p, description: e.target.value }))}
                        placeholder="Describe your venue — ambiance, specialties, what makes it perfect for weddings."
                        className={`border rounded-xl px-4 py-2.5 outline-none font-semibold resize-none ${
                          isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-800"
                        }`}
                      />
                    </div>

                    {/* ── Save button ── */}
                    <div className="mt-6 flex items-center gap-3">
                      <button
                        onClick={handleSaveVenue}
                        disabled={savingVenue}
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-xs font-bold cursor-pointer transition-all"
                      >
                        {savingVenue ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> :
                         venueView === "add" ? "Submit for Review" : "Save Changes"}
                      </button>
                      <p className="text-[10px] text-stone-400">
                        {venueView === "add"
                          ? "New venues are inactive until an admin reviews and activates them."
                          : "Changes are saved immediately and visible on the public listing."}
                      </p>
                    </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── VENUE GRID ── */}
                {venues.length === 0 ? (
                    <div className={`rounded-3xl border p-12 flex flex-col items-center justify-center text-center shadow-none ${cardClass}`}>
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                        isDarkMode ? "bg-stone-800" : "bg-stone-100"
                      }`}>
                        <span className="text-2xl">🏛️</span>
                      </div>
                      <h4 className={`font-bold text-sm mb-1 ${headingText}`}>No venues yet</h4>
                      <p className="text-[11px] text-stone-400 max-w-xs mb-5">
                        Add your first venue listing — it will go to admin for review before going live.
                      </p>
                      <button
                        onClick={openAddVenue}
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold cursor-pointer transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Your First Venue
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {venues.map((venue) => {
                        const thumb = venue.image || (venue.gallery && venue.gallery[0]) || "";
                        const price = venue.price || venue.pricePerPlateVeg || "—";
                        const rating = venue.rating || 0;
                        return (
                          <div key={venue._id} className="relative group/card rounded-3xl overflow-hidden shadow-md border border-slate-100 h-[400px] sm:h-[440px]">

                            {/* Full-bleed image */}
                            {thumb ? (
                              <img
                                src={thumb}
                                alt={venue.name}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                              />
                            ) : (
                              <div className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${isDarkMode ? "bg-stone-800 text-stone-500" : "bg-stone-200 text-stone-400"}`}>
                                NO IMAGE
                              </div>
                            )}

                            {/* Featured badge top-left */}
                            {venue.featured && (
                              <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm" style={{ background: "var(--sw-primary)" }}>
                                ♛ Featured
                              </div>
                            )}

                            {/* Status badge top-right */}
                            <span className={`absolute top-3 right-3 z-20 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide ${
                              venue.active ? "bg-emerald-500 text-white" : "bg-amber-400 text-white"
                            }`}>
                              {venue.active ? "Live" : "Pending"}
                            </span>

                            {/* Progressive frosted blur overlay */}
                            <div className="absolute inset-x-0 bottom-0 h-[85%] z-10 pointer-events-none">
                              {[
                                { blur: 1,  solid: 55, fade: 100 },
                                { blur: 3,  solid: 42, fade: 78 },
                                { blur: 6,  solid: 28, fade: 58 },
                                { blur: 12, solid: 16, fade: 40 },
                                { blur: 24, solid: 6,  fade: 24 },
                              ].map((l, idx) => (
                                <div
                                  key={idx}
                                  className="absolute inset-0"
                                  style={{
                                    backdropFilter: `blur(${l.blur}px)`,
                                    WebkitBackdropFilter: `blur(${l.blur}px)`,
                                    maskImage: `linear-gradient(to top, black ${l.solid}%, transparent ${l.fade}%)`,
                                    WebkitMaskImage: `linear-gradient(to top, black ${l.solid}%, transparent ${l.fade}%)`,
                                  }}
                                />
                              ))}
                              <div
                                className="absolute inset-0"
                                style={{
                                  background: "linear-gradient(to top, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.8) 32%, rgba(255,255,255,0.45) 58%, rgba(255,255,255,0.12) 78%, rgba(255,255,255,0) 92%)",
                                }}
                              />
                            </div>

                            {/* Content area */}
                            <div className="absolute inset-x-0 bottom-0 z-20 px-3 pt-3 pb-3 flex flex-col">
                              <h3 className="text-[17px] font-bold leading-snug text-slate-900 line-clamp-1 mb-0.5" style={{ fontFamily: "var(--font-heading, serif)" }}>
                                {venue.name}
                              </h3>
                              <p className="text-[11px] text-slate-500 font-medium mb-1 line-clamp-1">
                                📍 {venue.location || venue.city}{venue.country ? `, ${venue.country}` : ""}
                              </p>

                              {/* Stars */}
                              {rating > 0 && (
                                <div className="flex items-center gap-1 mb-2">
                                  <div className="flex gap-0.5">
                                    {[1,2,3,4,5].map(i => (
                                      <span key={i} className="text-[11px]" style={{ color: i <= Math.round(rating) ? "#f59e0b" : "#d1d5db" }}>★</span>
                                    ))}
                                  </div>
                                  <span className="text-[12px] font-bold text-slate-800">{rating.toFixed(1)}</span>
                                  <span className="text-[12px] text-slate-500">({venue.reviewCount || 0} reviews)</span>
                                </div>
                              )}

                              {/* Pills row */}
                              <div className="flex flex-wrap gap-1 mb-2.5">
                                <span className="flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-white text-slate-700 shadow-sm">
                                  👥 {venue.minGuests || 50}–{venue.maxGuests || 500} pax
                                </span>
                                <span className="flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-white text-slate-700 shadow-sm">
                                  🛏 {venue.rooms || 0} Rooms
                                </span>
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white shadow-sm" style={{ color: "var(--sw-primary)" }}>
                                  {venue.type || "Venue"}
                                </span>
                              </div>

                              {/* Price + Edit button */}
                              <div className="flex items-end justify-between mt-auto">
                                <div>
                                  <span className="text-[10px] text-slate-500 block mb-0.5">from</span>
                                  <span className="text-[18px] font-bold text-slate-900 leading-none">
                                    {price}
                                  </span>
                                  <span className="text-[10px] text-slate-500 ml-1 capitalize">{venue.priceUnit || "per day"}</span>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (confirm(`Are you sure you want to delete ${venue.name}?`)) {
                                        setVenues(prev => prev.filter(v => v._id !== venue._id));
                                      }
                                    }}
                                    className="flex items-center justify-center w-8 h-8 rounded-full text-red-500 bg-white shadow-sm hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer border border-transparent hover:border-red-200"
                                    title="Delete Venue"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => openEditVenue(venue)}
                                    className="text-[12px] font-bold px-4 py-2 rounded-full text-white bg-primary-500 shadow-sm hover:bg-primary-600 transition-all cursor-pointer"
                                  >
                                    Edit ✎
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                }
              </div>
            )}

            {/* SETTINGS SECTION */}
            {activeTab === "settings" && (
              <div className={`rounded-3xl p-6 border shadow-none min-h-[400px] ${cardClass}`}>
                <h3 className={`font-extrabold text-base pb-3 border-b mb-6 ${dividerClass} ${headingText}`}>Business Showcase Settings</h3>
                
                <form onSubmit={handleSaveProfile} className="max-w-2xl flex flex-col gap-5 text-xs">
                  {profileMessage && (
                    <div className={`rounded-3xl border px-4 py-3 font-bold ${
                      profileMessage.includes("Failed")
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}>
                      {profileMessage}
                    </div>
                  )}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-stone-500 uppercase tracking-wider">Brand Name</label>
                    <input 
                      type="text" 
                      name="businessName"
                      defaultValue={vendor.businessName} 
                      className={`border rounded-xl px-4 py-2.5 outline-none font-semibold ${
                        isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-800"
                      }`} 
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-stone-500 uppercase tracking-wider">Representative</label>
                      <input 
                        type="text" 
                        name="name"
                        defaultValue={vendor.name} 
                        className={`border rounded-xl px-4 py-2.5 outline-none font-semibold ${
                          isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-800"
                        }`} 
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-stone-500 uppercase tracking-wider">Phone</label>
                      <input 
                        type="tel" 
                        name="phone"
                        defaultValue={vendor.phone} 
                        className={`border rounded-xl px-4 py-2.5 outline-none font-semibold ${
                          isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-800"
                        }`} 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-stone-500 uppercase tracking-wider">Category</label>
                      <select
                        name="category"
                        defaultValue={vendor.category}
                        className={`border rounded-xl px-4 py-2.5 outline-none font-semibold ${
                          isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-800"
                        }`}
                      >
                        {["Venues", "Rooms", "Planners", "Caterers", "Decorators", "Photographers", "Chartered Airlines", "Make-up Artists", "Hairstylists", "Mehndi Artists", "Florists", "Choreographers"].map((category) => (
                           <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-stone-500 uppercase tracking-wider">Base City Location</label>
                      <input 
                        type="text" 
                        name="city"
                        defaultValue={vendor.city} 
                        className={`border rounded-xl px-4 py-2.5 outline-none font-semibold ${
                          isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-800"
                        }`} 
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-stone-500 uppercase tracking-wider">Starting Price (INR)</label>
                      <input 
                        type="number" 
                        min="0"
                        name="priceFrom"
                        defaultValue={vendor.priceFrom || ""} 
                        className={`border rounded-xl px-4 py-2.5 outline-none font-semibold ${
                          isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-800"
                        }`} 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-stone-500 uppercase tracking-wider">Website</label>
                      <input 
                        type="url" 
                        name="website"
                        defaultValue={vendor.website} 
                        className={`border rounded-xl px-4 py-2.5 outline-none font-semibold ${
                          isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-800"
                        }`} 
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-stone-500 uppercase tracking-wider">Instagram</label>
                    <input 
                      type="text" 
                      name="instagram"
                      defaultValue={vendor.instagram} 
                      className={`border rounded-xl px-4 py-2.5 outline-none font-semibold ${
                        isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-800"
                      }`} 
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <label className="font-bold text-stone-500 uppercase tracking-wider text-xs">Showcase Gallery ({showcaseImages.length}/6)</label>
                      {uploadError && <span className="text-red-500 font-bold text-[10px]">{uploadError}</span>}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                      {showcaseImages.map((imgUrl, index) => (
                        <div key={index} className="relative aspect-square rounded-3xl overflow-hidden border border-stone-200/20 group">
                          <img
                            src={imgUrl}
                            alt={`Preview ${index + 1}`}
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="p-1.5 bg-red-600/95 text-white rounded-xl hover:bg-red-700 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="flex justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => moveImage(index, "left")}
                                disabled={index === 0}
                                className="p-1 bg-white/20 text-white rounded-xl disabled:opacity-30 hover:bg-white/40 cursor-pointer"
                              >
                                <ArrowLeft className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveImage(index, "right")}
                                disabled={index === showcaseImages.length - 1}
                                className="p-1 bg-white/20 text-white rounded-xl disabled:opacity-30 hover:bg-white/40 cursor-pointer"
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {showcaseImages.length < 6 && (
                        <label className="relative aspect-square rounded-3xl border-2 border-dashed border-stone-300 dark:border-stone-700 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-500/5 transition-all text-stone-400 hover:text-primary-500">
                          {uploadingImage ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin text-primary-500 mb-1" />
                              <span className="text-[9px] font-bold uppercase tracking-wider">Uploading...</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-5 h-5 mb-1" />
                              <span className="text-[9px] font-bold uppercase tracking-wider">Upload Item</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {showcaseImages.length < 6 && (
                      <div className="flex gap-2 mt-1">
                        <input
                          type="url"
                          placeholder="Or paste an image URL here..."
                          id="manual-url-input"
                          className={`flex-1 border rounded-xl px-4 py-2 outline-none font-semibold text-[11px] ${
                            isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-800"
                          }`}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const input = e.currentTarget;
                              const val = input.value.trim();
                              if (val) {
                                if (showcaseImages.length >= 6) {
                                  setUploadError("Maximum of 6 images allowed.");
                                  return;
                                }
                                setShowcaseImages((prev) => [...prev, val]);
                                input.value = "";
                              }
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById("manual-url-input") as HTMLInputElement | null;
                            const val = input?.value.trim();
                            if (val) {
                              if (showcaseImages.length >= 6) {
                                setUploadError("Maximum of 6 images allowed.");
                                return;
                              }
                              setShowcaseImages((prev) => [...prev, val]);
                              if (input) input.value = "";
                            }
                          }}
                          className="px-4 py-2 bg-stone-900 dark:bg-stone-800 hover:bg-primary-500 text-white rounded-xl font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Add URL
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-stone-500 uppercase tracking-wider">Public Description</label>
                    <textarea
                      name="description"
                      defaultValue={vendor.description}
                      rows={4}
                      className={`border rounded-xl px-4 py-2.5 outline-none font-semibold ${
                        isDarkMode ? "bg-stone-950 border-stone-800 text-stone-200" : "bg-white border-stone-200 text-stone-800"
                      }`} 
                      placeholder="Describe your services, style, and coverage."
                    />
                  </div>
                  <p className="text-[10px] text-stone-400 font-medium">
                    Saving listing details sends the profile back to admin approval before it appears publicly again.
                  </p>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="w-fit rounded-full bg-slate-900 px-6 py-3 text-xs font-bold text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
                  >
                    {savingProfile ? "Saving..." : "Save and Request Approval"}
                  </button>
                </form>
              </div>
            )}

            {["planners", "photographers", "decorators", "makeupartists", "sakhiservice"].includes(activeTab) && (
              <div className={`rounded-3xl p-12 flex flex-col items-center justify-center text-center shadow-none ${cardClass} min-h-[400px]`}>
                <h4 className={`font-bold text-xl mb-2 ${headingText}`}>Coming Soon</h4>
                <p className="text-sm text-stone-400 max-w-md">
                  This module is currently under construction.
                </p>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
