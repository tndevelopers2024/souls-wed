"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCurrency } from "@/lib/CurrencyContext";
import { CURRENCIES } from "@/lib/currency";

// --- CUSTOM SVG ICON COMPONENTS (replacing lucide-react) ---

const ChevronDown = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const DollarSign = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" x2="12" y1="2" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const Check = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const LayoutDashboard = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="10" rx="1" />
    <rect width="7" height="5" x="3" y="14" rx="1" />
  </svg>
);

const LogOut = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);

const User = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const X = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const Menu = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

// --- NAVIGATION CONFIG ---

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
    <div
      className="absolute top-full left-0 mt-3 w-52 rounded-[24px] overflow-hidden z-50 animate-navbar-dropdown"
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
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { currency, setCurrency } = useCurrency();

  const currencyRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

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
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      // Close dropdowns if the click/touch event is outside the menus
      if (
        currencyRef.current && !currencyRef.current.contains(e.target as Node) &&
        userRef.current && !userRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    
    // Initial check
    handleScroll();
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  useLayoutEffect(() => {
    return () => {
      setMobileOpen(false);
      setOpenDropdown(null);
    };
  }, []);

  if (isAuthPage) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 sm:px-6 sm:pt-5">
      {/* Floating capsule bar */}
      <div
        className="overflow-visible max-w-7xl mx-auto w-full transition-all duration-300 ease-in-out"
        style={{
          background: mobileOpen ? "rgba(255,255,255,0.98)" : (scrolled ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.95)"),
          backdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.8)",
          boxShadow: scrolled ? "0 10px 40px rgba(0,0,0,0.08)" : "0 4px 20px rgba(0,0,0,0.04)",
          transform: scrolled ? "translateY(2px)" : "translateY(0)",
          borderRadius: mobileOpen ? "28px" : "9999px"
        }}
      >
        <div className="px-5 sm:px-3">
          <div className="flex items-center justify-between h-16 md:h-18" style={{ minHeight: '68px' }}>
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
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => link.children && setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className="relative flex items-center gap-1 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-300 hover:bg-orange-50/80 hover:text-orange-600 group"
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
                  {link.children && openDropdown === link.label && (
                    <DropdownMenu items={link.children} />
                  )}
                </div>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">

              {/* ── Icon cluster pill ── */}
              <div className="flex items-center gap-1 p-1 rounded-full" style={{ background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.06)" }}>

                {/* Currency toggle */}
                <div ref={currencyRef} className="relative z-50">
                  <button
                    onClick={() => {
                      setOpenDropdown(openDropdown === "currencyMenu" ? null : "currencyMenu");
                    }}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white transition-all duration-200 outline-none cursor-pointer hover:bg-orange-600 hover:scale-105"
                    title="Change currency"
                  >
                    <DollarSign className="w-4 h-4" />
                  </button>
                  {openDropdown === "currencyMenu" && (
                    <div
                      className="absolute right-0 top-full mt-3 w-52 rounded-3xl overflow-hidden z-50 origin-top-right animate-navbar-menu"
                      style={{
                        background: "#ffffff",
                        border: "1px solid rgba(0,0,0,0.08)",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.06)",
                      }}
                    >
                      {/* Currency list */}
                      <div className="p-2 flex flex-col gap-0.5 max-h-72 overflow-y-auto custom-scrollbar">
                        {Object.keys(CURRENCIES).map((code) => {
                          const isSelected = currency === code;
                          const sym = CURRENCIES[code].symbol;
                          return (
                            <button
                              key={code}
                              onClick={() => { setCurrency(code); setOpenDropdown(null); }}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-150 text-left cursor-pointer ${
                                isSelected
                                  ? "bg-orange-50 text-orange-600"
                                  : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                              }`}
                            >
                              <span className={`flex items-center justify-center w-8 h-8 rounded-full text-[12px] font-bold flex-shrink-0 ${
                                isSelected ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600"
                              }`}>
                                {sym.trim()}
                              </span>
                              <span className="flex-1">{code}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="w-px h-4 bg-black/10 mx-0.5" />

                {/* User avatar / Sign in */}
                {loading ? (
                  <div className="w-8 h-8 rounded-full bg-orange-200 animate-pulse" />
                ) : user ? (
                  <div ref={userRef} className="relative">
                    <button
                      onClick={() => {
                        setOpenDropdown(openDropdown === "userMenu" ? null : "userMenu");
                      }}
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white font-extrabold text-[12px] uppercase transition-all duration-200 outline-none cursor-pointer hover:bg-orange-600 hover:scale-105"
                      title={user.name}
                    >
                      {user.name.charAt(0)}
                    </button>
                    {openDropdown === "userMenu" && (
                      <div
                        className="absolute right-0 top-full mt-3 w-60 rounded-3xl overflow-hidden z-50 animate-navbar-menu"
                        style={{
                          background: "#ffffff",
                          border: "1px solid rgba(0,0,0,0.08)",
                          boxShadow: "0 20px 60px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.06)",
                        }}
                      >
                        {/* Menu items */}
                        <div className="p-2">
                          <Link
                            href={user.role === "admin" ? "/admin/dashboard" : user.role === "vendor" ? "/vendor/dashboard" : "/dashboard"}
                            className="flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-colors group/link"
                          >
                            <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center group-hover/link:bg-orange-500 transition-colors">
                              <LayoutDashboard className="w-4 h-4 text-orange-500 group-hover/link:text-white transition-colors" />
                            </span>
                            <span>My Dashboard</span>
                          </Link>
                          <div className="my-1.5 mx-1 h-px bg-slate-100" />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors text-left cursor-pointer group/logout"
                          >
                            <span className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center group-hover/logout:bg-red-500 transition-colors">
                              <LogOut className="w-4 h-4 text-red-400 group-hover/logout:text-white transition-colors" />
                            </span>
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center justify-center w-8 h-8 rounded-full text-slate-600 text-sm font-semibold transition-colors hover:bg-orange-500 hover:text-white cursor-pointer"
                    title="Sign In"
                  >
                    <User className="w-4 h-4" />
                  </Link>
                )}
              </div>

              {/* Book Now */}
              <Link
                href="/venues"
                className="relative text-sm font-extrabold px-7 py-3 rounded-full text-white transition-all duration-300 hover:scale-105 overflow-hidden group"
                style={{ background: "var(--sw-orange)" }}
              >
                <span className="relative z-10">Book Now</span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[navbar-shimmer_1.5s_infinite] z-0" />
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
        <div
          className={`md:hidden overflow-hidden border-t transition-all duration-300 ease-in-out ${
            mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
          }`}
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
        </div>
      </div>

      {/* Adding global animation styles */}
      <style jsx global>{`
        @keyframes navbarFadeIn {
          from { opacity: 0; transform: translateY(8px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes navbarDropdownMenuFade {
          from { opacity: 0; transform: translateY(12px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes navbarShimmer {
          100% { transform: translateX(100%); }
        }
        .animate-navbar-dropdown {
          animation: navbarFadeIn 0.15s ease-out forwards;
        }
        .animate-navbar-menu {
          animation: navbarDropdownMenuFade 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        /* Invisible CSS bridges to fix the hover gap issue (mt-3 absolute positioned elements) */
        .animate-navbar-dropdown::before,
        .animate-navbar-menu::before {
          content: "";
          position: absolute;
          top: -16px;
          left: 0;
          right: 0;
          height: 16px;
          background: transparent;
        }
        /* Custom scrollbar utility for smooth scrolling & visual indicator */
        .custom-scrollbar {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.15) transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.15);
          border-radius: 99px;
          border: 1px solid transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}
