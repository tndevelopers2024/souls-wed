"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import Image from "@/components/shared/CustomImage";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrency } from "@/lib/CurrencyContext";
import { CURRENCIES } from "@/lib/currency";
import { useWishlistStore } from "@/lib/store/useWishlistStore";

// --- CUSTOM SVG ICON COMPONENTS (replacing lucide-react) ---

const UserIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
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
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

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

const ChevronRight = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
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
    <path d="m9 18 6-6-6-6" />
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

const Heart = ({ className, fill = "none" }: { className?: string, fill?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

// --- NAVIGATION CONFIG ---

const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "Categories",
    href: "/categories",
    megaMenu: [
      {
        title: "VENUES & STAYS",
        items: [
          { label: "Venues & Banquet Halls", href: "/venues" },
          { label: "Rooms & Accommodation", href: "/rooms" },
        ]
      },
      {
        title: "PLANNING & DESIGN",
        items: [
          { label: "Wedding Planners", href: "/planners" },
          { label: "Caterers", href: "/caterers" },
          { label: "Decorators", href: "/decorators" },
        ]
      }
    ],
  },
  { label: "Inspiration", href: "/inspiration" },
  { label: "Our Story", href: "/about" },
  { label: "Inquire", href: "/contact" },
];

function DropdownMenu({ columns }: { columns: { title: string; items: { label: string; href: string }[] }[] }) {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-max min-w-[280px] rounded-[24px] z-50 p-6 flex flex-col gap-6 before:absolute before:-top-6 before:left-0 before:w-full before:h-6 before:bg-transparent"
      style={{
        background: "var(--sw-nav-default)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(238,116,41,0.15)",
        boxShadow: "0 24px 60px rgba(238,116,41,0.12)",
      }}
      onMouseLeave={() => setHoveredItem(null)}
    >
      {columns.map((column, colIdx) => (
        <div key={colIdx} className="flex flex-col gap-4">
          <h4 className="text-xs font-black text-primary-600 uppercase tracking-widest pb-3 mb-1 border-b border-primary-600/20">{column.title}</h4>
          <div className="flex flex-col gap-2.5">
            {column.items.map((item) => {
              const isActive = pathname === item.href;
              const isHovered = hoveredItem === item.href;
              const showPill = isHovered || (!hoveredItem && isActive);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative block py-2 px-4 -ml-4 text-[14px] font-medium transition-colors z-10"
                  style={{ color: showPill ? "var(--sw-primary)" : "var(--sw-navy)", fontFamily: "var(--font-heading)" }}
                  onMouseEnter={() => setHoveredItem(item.href)}
                >
                  {showPill && (
                    <motion.div
                      layoutId="mega-menu-pill"
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "linear-gradient(135deg, rgba(238, 116, 41, 0.08) 0%, rgba(238, 116, 41, 0.02) 100%)",
                        border: "1px solid rgba(238, 116, 41, 0.2)",
                        backdropFilter: "blur(12px)",
                        zIndex: -1,
                      }}
                      transition={{ type: "spring", stiffness: 150, damping: 20 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [hoveredCurrency, setHoveredCurrency] = useState<string | null>(null);
  const { currency, setCurrency } = useCurrency();
  const lastScrollY = useRef(0);

  const currencyRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  
  // Wishlist state
  const wishlistItems = useWishlistStore((state) => state.items);
  const [mounted, setMounted] = useState(false);

  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/signup");

  interface UserSession {
    id: string;
    name: string;
    email: string;
    role: string;
    profileImage?: string;
  }
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
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
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;
      
      setScrolled(currentScrollY > 40);
      
      if (currentScrollY > 80 && !mobileOpen) {
        if (scrollDelta > 4) {
          // scrolling down
          setHidden(true);
        } else if (scrollDelta < -4) {
          // scrolling up
          setHidden(false);
        }
      } else if (currentScrollY <= 80) {
        setHidden(false);
      }
      
      lastScrollY.current = currentScrollY;
    };
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      // Close dropdowns if the click/touch event is outside the menus
      if (
        currencyRef.current && !currencyRef.current.contains(e.target as Node) &&
        accountRef.current && !accountRef.current.contains(e.target as Node)
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
  }, [mobileOpen]);

  useLayoutEffect(() => {
    return () => {
      setMobileOpen(false);
      setOpenDropdown(null);
    };
  }, []);

  if (isAuthPage) return null;

  return (
    <motion.div 
      className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 sm:px-6 sm:pt-6"
      initial={{ y: 0 }}
      animate={{ y: hidden ? "-100%" : 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Floating capsule bar */}
      <div
        className="overflow-visible w-full md:w-fit mx-auto transition-all duration-300 ease-in-out"
        style={{
          background: mobileOpen ? "var(--sw-nav-default)" : (scrolled ? "var(--sw-nav-scrolled)" : "var(--sw-nav-default)"),
          backdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(238,116,41,0.15)",
          transform: scrolled ? "translateY(2px)" : "translateY(0)",
          borderRadius: mobileOpen ? "28px" : "9999px"
        }}
      >
        <div className="px-3 py-2 sm:px-4 sm:py-2.5">
          <div className="flex items-center justify-between gap-4 md:gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image
                src="/logo/logo-by-soulswed.png"
                alt="SoulsWed Logo"
                width={160}
                height={48}
                className="h-6 md:h-8 w-auto"
                loading="eager"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <div
              className="hidden md:flex items-center gap-1"
              onMouseLeave={() => setHoveredPath(null)}
            >
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
                const isHovered = hoveredPath === link.href;
                const showPill = isHovered || (!hoveredPath && isActive);

                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => {
                      if (link.megaMenu) setOpenDropdown(link.label);
                      setHoveredPath(link.href);
                    }}
                    onMouseLeave={() => {
                      setOpenDropdown(null);
                    }}
                  >
                    <Link
                      href={link.href}
                      className="relative flex items-center gap-1 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:text-primary-600 group z-10"
                      style={{ color: showPill ? "var(--sw-primary)" : "var(--sw-navy)", fontFamily: "var(--font-heading)" }}
                    >
                      {showPill && (
                        <motion.div
                          layoutId="nav-active-pill"
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: "linear-gradient(135deg, rgba(238, 116, 41, 0.08) 0%, rgba(238, 116, 41, 0.02) 100%)",
                            border: "1px solid rgba(238, 116, 41, 0.1)",
                            backdropFilter: "blur(12px) saturate(150%)",
                            boxShadow: "inset 0 1px 1px var(--sw-chip-bg), 0 2px 10px rgba(238, 116, 41, 0.05)",
                            zIndex: -1,
                          }}
                          transition={{ type: "spring", stiffness: 120, damping: 20, mass: 1.1 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1">
                        {link.label}
                        {link.megaMenu && (
                          <ChevronDown
                            className="w-3.5 h-3.5 transition-transform duration-300 group-hover:text-primary-500"
                            style={{
                              transform: openDropdown === link.label ? "rotate(180deg)" : "rotate(0deg)",
                            }}
                          />
                        )}
                      </span>
                    </Link>
                    <AnimatePresence>
                      {link.megaMenu && openDropdown === link.label && (
                        <DropdownMenu columns={link.megaMenu} />
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              {/* Wishlist Link */}
              <Link 
                href="/wishlist" 
                className="relative flex items-center justify-center p-2.5 rounded-full transition-colors group z-10"
                title="Wishlist"
                onMouseEnter={() => setHoveredPath('/wishlist')}
                onMouseLeave={() => setHoveredPath(null)}
              >
                {(hoveredPath === '/wishlist' || (!hoveredPath && pathname === '/wishlist')) && (
                  <motion.div
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "linear-gradient(135deg, rgba(238, 116, 41, 0.08) 0%, rgba(238, 116, 41, 0.02) 100%)",
                      border: "1px solid rgba(238, 116, 41, 0.1)",
                      backdropFilter: "blur(12px) saturate(150%)",
                      boxShadow: "inset 0 1px 1px var(--sw-chip-bg), 0 2px 10px rgba(238, 116, 41, 0.05)",
                      zIndex: -1,
                    }}
                    transition={{ type: "spring", stiffness: 120, damping: 20, mass: 1.1 }}
                  />
                )}
                <Heart className={`w-[18px] h-[18px] transition-colors relative z-10 ${(hoveredPath === '/wishlist' || pathname === '/wishlist') ? 'text-red-500' : 'text-slate-500'}`} />
                {mounted && wishlistItems.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[16px] h-[16px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full shadow-sm z-10">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              <div
                className="relative"
                ref={currencyRef}
                onMouseEnter={() => {
                  setOpenDropdown('currency');
                  setHoveredPath('currency');
                }}
                onMouseLeave={() => {
                  setOpenDropdown(null);
                  setHoveredPath(null);
                }}
              >
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'currency' ? null : 'currency')}
                  className="relative flex items-center gap-1 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:text-primary-600 group z-10"
                  style={{ color: hoveredPath === 'currency' || openDropdown === 'currency' ? "var(--sw-primary)" : "var(--sw-navy)", fontFamily: "var(--font-heading)" }}
                  title="Change Currency"
                >
                  {(hoveredPath === 'currency' || openDropdown === 'currency') && (
                    <motion.div
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "linear-gradient(135deg, rgba(238, 116, 41, 0.08) 0%, rgba(238, 116, 41, 0.02) 100%)",
                        border: "1px solid rgba(238, 116, 41, 0.1)",
                        backdropFilter: "blur(12px) saturate(150%)",
                        boxShadow: "inset 0 1px 1px var(--sw-chip-bg), 0 2px 10px rgba(238, 116, 41, 0.05)",
                        zIndex: -1,
                      }}
                      transition={{ type: "spring", stiffness: 120, damping: 20, mass: 1.1 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1">
                    <span className="text-[16px] leading-none">{CURRENCIES[currency]?.symbol || currency}</span>
                    <ChevronDown
                      className="w-3.5 h-3.5 transition-transform duration-300 group-hover:text-primary-500"
                      style={{
                        transform: openDropdown === 'currency' ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </span>
                </button>
                <AnimatePresence>
                  {openDropdown === 'currency' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute top-full right-0 mt-6 min-w-[140px] rounded-[28px] p-2 z-50 flex flex-col before:absolute before:-top-6 before:left-0 before:w-full before:h-6 before:bg-transparent"
                      style={{
                        background: "var(--sw-nav-default)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(238,116,41,0.15)",
                        boxShadow: "0 24px 60px rgba(238,116,41,0.12)",
                      }}
                    >
                      <div
                        className="flex flex-col gap-1"
                        onMouseLeave={() => setHoveredCurrency(null)}
                      >
                        {Object.entries(CURRENCIES).map(([code, details]) => {
                          const isActive = currency === code;
                          const isHovered = hoveredCurrency === code;
                          const showPill = isHovered || (!hoveredCurrency && isActive);

                          return (
                            <button
                              key={code}
                              onClick={() => {
                                setCurrency(code);
                                setOpenDropdown(null);
                              }}
                              onMouseEnter={() => setHoveredCurrency(code)}
                              className="relative flex items-center px-4 py-2.5 text-sm font-medium transition-colors z-10 w-full text-left rounded-full"
                              style={{ color: isActive || showPill ? "var(--sw-primary)" : "var(--sw-navy)", fontFamily: "var(--font-heading)" }}
                            >
                              {showPill && (
                                <motion.div
                                  layoutId="currency-menu-pill"
                                  className="absolute inset-0 rounded-full"
                                  style={{
                                    background: "linear-gradient(135deg, rgba(238, 116, 41, 0.08) 0%, rgba(238, 116, 41, 0.02) 100%)",
                                    border: "1px solid rgba(238, 116, 41, 0.2)",
                                    backdropFilter: "blur(12px)",
                                    zIndex: -1,
                                  }}
                                  transition={{ type: "spring", stiffness: 150, damping: 20 }}
                                />
                              )}
                              <span className="relative z-10 w-full flex justify-between items-center font-bold">
                                <span>{code}</span>
                                <span className="opacity-70 font-normal">{details.symbol}</span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Login / My Account */}
              <Link
                href={user ? (user.role === "admin" ? "/admin/dashboard" : user.role === "vendor" ? "/vendor/dashboard" : "/dashboard") : "/login"}
                className="relative text-sm font-extrabold px-7 py-3 rounded-full text-white transition-all duration-300 overflow-hidden group flex items-center gap-2"
                style={{ background: "var(--sw-primary)" }}
              >
                {user && user.profileImage ? (
                  user.profileImage.startsWith("/") || user.profileImage.startsWith("http") || user.profileImage.startsWith("data:") ? (
                    <img src={user.profileImage} alt="" className="w-6 h-6 rounded-full object-cover border border-white/30 relative z-10" />
                  ) : (
                    <span className="relative z-10 text-base leading-none">{user.profileImage}</span>
                  )
                ) : null}
                <span className="relative z-10">{user ? "My Account" : "Login"}</span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[navbar-shimmer_1.5s_infinite] z-0" />
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-full transition-colors hover:bg-primary-50"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ color: "var(--sw-navy)" }}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden border-t transition-all duration-300 ease-in-out ${mobileOpen ? "max-h-[85vh] overflow-y-auto custom-scrollbar opacity-100" : "max-h-0 opacity-0 pointer-events-none"
            }`}
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <div className="px-4 py-3 pb-6 flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <div key={link.href} className="flex flex-col">
                  <Link
                    href={link.href}
                    className={`font-semibold py-2.5 px-3 rounded-full text-sm transition-colors hover:bg-primary-50 ${isActive ?'bg-primary-50':''}`}
                    style={{ color: isActive ? "var(--sw-primary)" : "var(--sw-navy)", fontFamily: "var(--font-heading)" }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </div>
              );
            })}
            <div className="flex items-center justify-between px-3 py-2 mt-2 border-t border-primary-100">
              <span className="text-sm font-bold text-slate-800">Currency</span>
              <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                {Object.keys(CURRENCIES).map(code => (
                  <button
                    key={code}
                    onClick={() => {
                      setCurrency(code);
                      setMobileOpen(false);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors whitespace-nowrap ${currency === code
                        ? 'bg-primary-500 text-white'
                        :'bg-slate-100 text-slate-600 hover:bg-primary-100'
                      }`}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-2 mt-1 border-t flex flex-col gap-2" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
              {loading ? (
                <div className="h-10 bg-slate-100 rounded-full animate-pulse"/>
              ) : user ? (
                <>
                  <div className="px-3 py-2 flex items-center gap-3">
                    {user.profileImage && (user.profileImage.startsWith("/") || user.profileImage.startsWith("http") || user.profileImage.startsWith("data:")) ? (
                      <div className="w-9 h-9 rounded-full overflow-hidden shadow-sm border border-white/20">
                        <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 shadow-sm border border-white/20">
                        <UserIcon className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-500 capitalize">{user.role} Profile</p>
                    </div>
                  </div>
                  <Link
                    href={user.role === "admin" ? "/admin/dashboard" : user.role === "vendor" ? "/vendor/dashboard" : "/dashboard"}
                    className="font-semibold text-sm py-2.5 px-4 rounded-full text-center border transition-colors hover:bg-primary-50 flex items-center justify-center gap-2"
                    style={{ color: "var(--sw-navy)", borderColor: "var(--sw-light-gray)" }}
                    onClick={() => setMobileOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4 text-primary-500" />
                    <span>Dashboard</span>
                  </Link>

                  {/* Mobile Wishlist Option */}
                  <Link
                    href="/wishlist"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-3 py-3 rounded-xl transition-colors hover:bg-slate-50 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-red-50 transition-colors">
                        <Heart className="w-4 h-4 text-slate-500 group-hover:text-red-500 transition-colors" />
                      </div>
                      <span className="text-sm font-semibold text-[var(--sw-navy)]">My Wishlist</span>
                    </div>
                    {mounted && wishlistItems.length > 0 && (
                      <span className="flex items-center justify-center min-w-[20px] h-[20px] px-1.5 bg-red-500 text-white text-[11px] font-bold rounded-full shadow-sm">
                        {wishlistItems.length}
                      </span>
                    )}
                  </Link>

                  <div className="h-px bg-slate-100 my-1 mx-3" />

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
                    className="flex-1 font-semibold text-sm py-2.5 px-3 rounded-full text-center border transition-colors hover:bg-primary-50"
                    style={{ color: "var(--sw-navy)", borderColor: "var(--sw-light-gray)" }}
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/venues"
                    className="flex-1 font-bold text-sm py-2.5 px-3 rounded-full text-center text-white"
                    style={{ background: "var(--sw-primary)" }}
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
    </motion.div>
  );
}
