"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Heart, Menu, X, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Venues", href: "/venues" },
  { label: "Planners", href: "/vendors/planners" },
  { label: "Photographers", href: "/vendors/photographers" },
  {
    label: "Other Services",
    href: "#",
    children: [
      { label: "Decorators", href: "/vendors/decorators" },
      { label: "Makeup Artists", href: "/vendors/makeup" },
      { label: "Sakhi Service", href: "/services/sakhi" },
    ],
  },
  { label: "Destinations", href: "/destinations" },
  { label: "About", href: "/about" },
];

function DropdownMenu({ items }: { items: { label: string; href: string }[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 rounded-[24px] overflow-hidden z-50"
      style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      }}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="block px-5 py-3 text-sm font-medium transition-colors hover:bg-orange-50"
          style={{ color: "var(--sw-navy)" }}
        >
          {item.label}
        </Link>
      ))}
    </motion.div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/signup");

  interface UserSession {
    id: string;
    name: string;
    email: string;
    role: string;
  }
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setUser(data.user);
          } else {
            setUser(null);
          }
        }
      } catch (err) {
        console.error("Failed to check session", err);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        setUser(null);
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    setScrolled(scrollY.get() > 40);
    return scrollY.on("change", (y) => setScrolled(y > 40));
  }, [scrollY]);

  useLayoutEffect(() => {
    return () => {
      setMobileOpen(false);
      setOpenDropdown(null);
    };
  }, []);

  if (isAuthPage) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      {/* Floating capsule bar */}
      <motion.div
        animate={{ 
          boxShadow: scrolled ? "0 10px 40px rgba(0,0,0,0.08)" : "0 4px 20px rgba(0,0,0,0.04)",
          y: scrolled ? 2 : 0,
          borderRadius: mobileOpen ? "28px" : "9999px"
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-visible max-w-7xl mx-auto w-full"
        style={{
          background: mobileOpen ? "rgba(255,255,255,0.98)" : (scrolled ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.95)"),
          backdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.8)",
        }}
      >
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center group flex-shrink-0">
              <Image 
                src="/logo/logo-by-soulswed.png"
                alt="SoulsWed Logo"
                width={160}
                height={48}
                className="h-6 md:h-8 w-auto transition-transform group-hover:scale-105"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => link.children && setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className="relative flex items-center gap-1 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 hover:bg-orange-50/80 hover:text-orange-600 group"
                    style={{ color: "var(--sw-navy)" }}
                  >
                    {link.label}
                    {link.children && (
                      <ChevronDown
                        className="w-3.5 h-3.5 transition-transform duration-300 group-hover:text-orange-500"
                        style={{
                          transform: openDropdown === link.label ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      />
                    )}
                    {/* Hover micro-animation underline */}
                    <span className="absolute bottom-1.5 left-4 right-4 h-0.5 bg-orange-500 rounded-full scale-x-0 opacity-0 transition-all duration-300 group-hover:scale-x-100 group-hover:opacity-100" />
                  </Link>
                  <AnimatePresence>
                    {link.children && openDropdown === link.label && (
                      <DropdownMenu items={link.children} />
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-orange-100/50 animate-pulse" />
              ) : user ? (
                <div className="relative" onMouseEnter={() => setOpenDropdown("userMenu")} onMouseLeave={() => setOpenDropdown(null)}>
                  <button
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all hover:bg-orange-50 outline-none cursor-pointer"
                    style={{ color: "var(--sw-navy)" }}
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold text-[10px] uppercase shadow-sm">
                      {user.name.charAt(0)}
                    </div>
                    <span className="max-w-[100px] truncate text-xs">{user.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-60 transition-transform" style={{ transform: openDropdown === "userMenu" ? "rotate(180deg)" : "rotate(0)" }} />
                  </button>
                  
                  <AnimatePresence>
                    {openDropdown === "userMenu" && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 rounded-[24px] overflow-hidden z-50 p-1.5"
                        style={{
                          background: "rgba(255,255,255,0.98)",
                          backdropFilter: "blur(20px)",
                          border: "1px solid rgba(0,0,0,0.07)",
                          boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
                        }}
                      >
                        <div className="px-4 py-2.5 border-b border-slate-100 mb-1">
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Signed in as</p>
                          <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                          <span className="inline-block mt-1 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700">
                            {user.role}
                          </span>
                        </div>
                        <Link
                          href={user.role === "admin" ? "/admin/dashboard" : user.role === "vendor" ? "/vendor/dashboard" : "/dashboard"}
                          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:bg-orange-50 text-slate-700 hover:text-slate-900"
                        >
                          <LayoutDashboard className="w-4 h-4 text-orange-500" />
                          <span>My Dashboard</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:bg-red-50 text-red-600 hover:text-red-700 text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-semibold px-4 py-2 rounded-full transition-colors hover:bg-orange-50"
                  style={{ color: "var(--sw-navy)" }}
                >
                  Sign In
                </Link>
              )}
              
              <Link
                href="/venues"
                className="relative text-sm font-extrabold px-7 py-3 rounded-full text-white transition-all duration-300 hover:scale-105 hover:shadow-lg overflow-hidden group"
                style={{
                  background: "linear-gradient(135deg, var(--sw-orange), #f95c02)",
                  boxShadow: "0 6px 20px rgba(238,116,41,0.35)",
                }}
              >
                <span className="relative z-10">Book Now</span>
                {/* Shine effect overlay */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shimmer_1.5s_infinite] z-0" />
              </Link>
            </div>
            
            {/* Adding global animation style for shimmer */}
            <style jsx global>{`
              @keyframes shimmer {
                100% { transform: translateX(100%); }
              }
            `}</style>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-full transition-colors hover:bg-orange-50"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ color: "var(--sw-navy)" }}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t"
              style={{ borderColor: "rgba(0,0,0,0.06)" }}
            >
              <div className="px-4 py-3 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-medium py-2.5 px-3 rounded-full text-sm transition-colors hover:bg-orange-50"
                    style={{ color: "var(--sw-navy)" }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-2 mt-1 border-t flex flex-col gap-2" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                  {loading ? (
                    <div className="h-10 bg-slate-100 rounded-full animate-pulse" />
                  ) : user ? (
                    <>
                      <div className="px-3 py-2 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold text-sm uppercase shadow-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{user.name}</p>
                          <p className="text-xs text-slate-500 capitalize">{user.role} Profile</p>
                        </div>
                      </div>
                      <Link
                        href={user.role === "admin" ? "/admin/dashboard" : user.role === "vendor" ? "/vendor/dashboard" : "/dashboard"}
                        className="font-semibold text-sm py-2.5 px-4 rounded-full text-center border transition-colors hover:bg-orange-50 flex items-center justify-center gap-2"
                        style={{ color: "var(--sw-navy)", borderColor: "var(--sw-light-gray)" }}
                        onClick={() => setMobileOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4 text-orange-500" />
                        <span>Dashboard</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileOpen(false);
                        }}
                        className="font-bold text-sm py-2.5 px-4 rounded-full text-center text-white bg-red-500 hover:bg-red-600 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <div className="flex gap-2 w-full">
                      <Link
                        href="/login"
                        className="flex-1 font-semibold text-sm py-2.5 px-3 rounded-full text-center border transition-colors hover:bg-orange-50"
                        style={{ color: "var(--sw-navy)", borderColor: "var(--sw-light-gray)" }}
                        onClick={() => setMobileOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/venues"
                        className="flex-1 font-bold text-sm py-2.5 px-3 rounded-full text-center text-white"
                        style={{ background: "var(--sw-orange)" }}
                        onClick={() => setMobileOpen(false)}
                      >
                        Book Now
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
