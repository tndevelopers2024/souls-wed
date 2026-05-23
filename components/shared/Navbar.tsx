"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Heart, Menu, X, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "Venues",
    href: "/venues",
    children: [
      { label: "Banquet Halls", href: "/venues/banquet" },
      { label: "Palace Venues", href: "/venues/palace" },
      { label: "Beach Resorts", href: "/venues/beach" },
      { label: "Destination Venues", href: "/venues/destination" },
    ],
  },
  {
    label: "Vendors",
    href: "/vendors",
    children: [
      { label: "Photographers", href: "/vendors/photographers" },
      { label: "Wedding Planners", href: "/vendors/planners" },
      { label: "Caterers", href: "/vendors/caterers" },
      { label: "Decorators", href: "/vendors/decorators" },
      { label: "Make-up Artists", href: "/vendors/makeup" },
    ],
  },
  { label: "Destinations", href: "/destinations" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
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
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      {/* Floating capsule bar */}
      <motion.div
        animate={{ boxShadow: scrolled ? "0 8px 40px rgba(0,0,0,0.15)" : "0 4px 20px rgba(0,0,0,0.08)" }}
        transition={{ duration: 0.3 }}
        className="rounded-full overflow-visible max-w-7xl mx-auto w-full"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.8)",
        }}
      >
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <Heart
                className="w-6 h-6 fill-current transition-transform group-hover:scale-110"
                style={{ color: "var(--sw-orange)" }}
              />
              <span
                className="text-xl font-bold tracking-tight font-serif"
                style={{ color: "var(--sw-navy)" }}
              >
                SoulsWed
              </span>
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
                    className="flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-colors hover:bg-orange-50"
                    style={{ color: "var(--sw-navy)" }}
                  >
                    {link.label}
                    {link.children && (
                      <ChevronDown
                        className="w-3 h-3 transition-transform"
                        style={{
                          transform: openDropdown === link.label ? "rotate(180deg)" : "rotate(0deg)",
                          color: "var(--sw-steel)",
                        }}
                      />
                    )}
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
                href="/book"
                className="text-sm font-bold px-5 py-2.5 rounded-full text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{
                  background: "var(--sw-orange)",
                  boxShadow: "0 4px 14px rgba(238,116,41,0.35)",
                }}
              >
                Book Now
              </Link>
            </div>

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
                        href="/book"
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
