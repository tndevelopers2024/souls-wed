"use client";

import Link from "next/link";
import Image from "@/components/shared/CustomImage";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Phone, Mail, MessageCircle, ChevronUp, Sparkles } from "lucide-react";
import { useCurrency } from "@/lib/CurrencyContext";
import { CURRENCIES } from "@/lib/currency";

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function IconFacebook({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

function IconLinkedIn({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

const aboutLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "Press", href: "/press" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
];

const services = [
  { label: "Venues & Banquet Halls", href: "/venues" },
  { label: "Wedding Planners", href: "/planners" },
  { label: "Decorators", href: "/decorators" },
  { label: "Photographers", href: "/photographers" },
  { label: "Caterers", href: "/caterers" },
  { label: "Make-up Artists", href: "/makeup" },
  { label: "Chartered Airlines", href: "/chartered-airlines" },
];

const contactItems = [
  {
    icon: Phone,
    label: "24/7 Support",
    lines: ["+91 98765 43210", "+91 98765 43211"],
  },
  {
    icon: MessageCircle,
    label: "WhatsApp Enquiry",
    lines: ["+91 96000 43002"],
  },
  {
    icon: Phone,
    label: "For Bookings",
    lines: ["+91 80412 48273"],
  },
  {
    icon: Mail,
    label: "Email Us",
    lines: ["hello@soulswed.com", "vendors@soulswed.com"],
  },
];

const socialLinks = [
  { icon: IconInstagram, href: "https://www.instagram.com/soulswed/", label: "Instagram" },
  { icon: IconFacebook, href: "https://www.facebook.com/soulswed/", label: "Facebook" },
  { icon: IconLinkedIn, href: "https://www.linkedin.com/company/soulswed/", label: "LinkedIn" },
];

export default function Footer() {
  const pathname = usePathname();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const { currency, setCurrency } = useCurrency();
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const currencyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setCurrencyOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/signup");
  
  if (isAuthPage) return null;

  return (
    <>
      {/* Self-contained CSS animations for the background floating gradient mesh */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-orb-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -60px) scale(1.2); }
        }
        @keyframes float-orb-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-50px, 40px) scale(1.1); }
        }
        @keyframes float-orb-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, 30px) scale(1.15); }
        }
        .animate-float-1 {
          animation: float-orb-1 18s ease-in-out infinite;
        }
        .animate-float-2 {
          animation: float-orb-2 22s ease-in-out infinite;
        }
        .animate-float-3 {
          animation: float-orb-3 26s ease-in-out infinite;
        }
      `}} />

      {/* Floating capsule footer with increased dynamic width */}
      <div className="max-w-[94%] md:max-w-[90%] lg:max-w-[1200px] xl:max-w-[1300px] mx-auto px-4 py-10 lg:py-16 w-full">
      <footer
        className="relative overflow-hidden rounded-3xl md:rounded-[48px] transition-all duration-500"
        style={{
          background: "rgba(255,244,230,0.95)",
          backdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(238,116,41,0.15)",
        }}
      >
        <div className="relative z-10 w-full mx-auto px-5 sm:px-10 lg:px-16 py-8 md:py-12">
          
          {/* Top Row: Newsletter Subscription */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8 mb-8 border-b border-amber-100/50">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest text-amber-700 bg-amber-50 border border-amber-100/60 mb-3 uppercase">
                <Sparkles className="w-3.5 h-3.5 inline-block mr-1 text-amber-500" />
                Exclusive Club
              </span>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-800">
                Join the <span className="bg-gradient-to-r from-amber-600 to-primary-500 bg-clip-text text-transparent">SoulsWed Circle</span>
              </h3>
              <p className="text-xs text-slate-500 mt-2 max-w-xl font-medium leading-relaxed">
                Subscribe to receive curated destination wedding inspiration, venue guides, and exclusive partner promotions.
              </p>
            </div>
            <div className="lg:col-span-5 flex items-center lg:justify-end mt-4 lg:mt-0">
              <form onSubmit={(e) => e.preventDefault()} className="relative w-full lg:max-w-[400px]">
                <input
                  id="newsletterEmail"
                  name="newsletterEmail"
                  type="email"
                  placeholder="Your Email Address"
                  className="w-full bg-white/80 border border-amber-200/60 focus:border-amber-400 focus:ring-4 focus:ring-amber-100/50 rounded-full px-5 py-3.5 pr-28 md:px-6 md:py-4 md:pr-36 outline-none transition-all text-sm md:text-base text-slate-800 shadow-inner font-medium placeholder-slate-400"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-5 md:right-2 md:top-2 md:bottom-2 md:px-7 rounded-full text-white font-bold text-[11px] md:text-[13px] tracking-wider uppercase transition-all duration-300 cursor-pointer"
                  style={{ background: "var(--sw-primary)" }}
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Middle Row: Links Grid (Asymmetrical Layout) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">

            {/* Col 1 — Brand (Spans 2 columns on lg for gorgeous breathing room) */}
            <div className="lg:col-span-2 lg:pr-12">
              <Link href="/" className="flex items-center mb-5 inline-flex">
                <Image 
                  src="/logo/logo-by-soulswed.png"
                  alt="SoulsWed Logo"
                  width={200}
                  height={60}
                  className="h-7 md:h-8 w-auto"
                />
              </Link>
              <p className="text-sm leading-relaxed mb-1.5 font-bold text-slate-700">
                Flawless Moves. Perfect Events.
              </p>
              <p className="text-xs leading-relaxed mb-5 text-slate-500 font-medium max-w-sm">
                Say &apos;I do&apos; in a dreamy destination! Transforming couples&apos; visions into amazing international wedding celebrations with ease.
              </p>
              <div className="flex gap-3">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-115 hover:-translate-y-1 hover:bg-gradient-to-tr hover:from-amber-400 hover:to-primary-500 text-amber-700 hover:text-white border border-amber-100 hover:border-transparent bg-amber-50/40 shadow-xs"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2 — About Us */}
            <div>
              <h4 className="text-xs font-black text-amber-700 uppercase tracking-widest pb-3 mb-4 border-b border-amber-600/20">
                About Us
              </h4>
              <ul className="flex flex-col gap-1">
                {aboutLinks.map((item) => {
                  const isHovered = hoveredLink === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`relative block py-2 px-4 -ml-4 text-[14px] font-medium transition-colors z-10 ${isHovered ? 'text-amber-600' : 'text-slate-600'}`}
                        onMouseEnter={() => setHoveredLink(item.href)}
                        onMouseLeave={() => setHoveredLink(null)}
                      >
                        <AnimatePresence>
                          {isHovered && (
                            <motion.div
                              layoutId="footer-about-pill"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 rounded-full"
                              style={{
                                background: "linear-gradient(135deg, rgba(238, 116, 41, 0.08) 0%, rgba(238, 116, 41, 0.02) 100%)",
                                border: "1px solid rgba(238, 116, 41, 0.1)",
                                backdropFilter: "blur(12px) saturate(150%)",
                                boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.6), 0 2px 10px rgba(238, 116, 41, 0.05)",
                                zIndex: -1,
                              }}
                              transition={{ type: "spring", stiffness: 120, damping: 20, mass: 1.1 }}
                            />
                          )}
                        </AnimatePresence>
                        <span className="relative z-10">{item.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Col 3 — Our Services */}
            <div>
              <h4 className="text-xs font-black text-amber-700 uppercase tracking-widest pb-3 mb-4 border-b border-amber-600/20">
                Our Services
              </h4>
              <ul className="flex flex-col gap-1">
                {services.map((item) => {
                  const isHovered = hoveredLink === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`relative block py-2 px-4 -ml-4 text-[14px] font-medium transition-colors z-10 ${isHovered ? 'text-amber-600' : 'text-slate-600'}`}
                        onMouseEnter={() => setHoveredLink(item.href)}
                        onMouseLeave={() => setHoveredLink(null)}
                      >
                        <AnimatePresence>
                          {isHovered && (
                            <motion.div
                              layoutId="footer-services-pill"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 rounded-full"
                              style={{
                                background: "linear-gradient(135deg, rgba(238, 116, 41, 0.08) 0%, rgba(238, 116, 41, 0.02) 100%)",
                                border: "1px solid rgba(238, 116, 41, 0.1)",
                                backdropFilter: "blur(12px) saturate(150%)",
                                boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.6), 0 2px 10px rgba(238, 116, 41, 0.05)",
                                zIndex: -1,
                              }}
                              transition={{ type: "spring", stiffness: 120, damping: 20, mass: 1.1 }}
                            />
                          )}
                        </AnimatePresence>
                        <span className="relative z-10">{item.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Col 4 — Contact Info */}
            <div>
              <h4 className="text-xs font-black text-amber-700 uppercase tracking-widest pb-3 mb-4 border-b border-amber-600/20">
                Contact Info
              </h4>
              <ul className="flex flex-col gap-1.5">
                {contactItems.map((item) => {
                  const Icon = item.icon;
                  const isHovered = hoveredLink === item.label;
                  return (
                    <li key={item.label}>
                      <div 
                        className="relative block py-2 px-4 -ml-4 z-10 transition-colors cursor-pointer"
                        onMouseEnter={() => setHoveredLink(item.label)}
                        onMouseLeave={() => setHoveredLink(null)}
                      >
                        <AnimatePresence>
                          {isHovered && (
                            <motion.div
                              layoutId="footer-contact-pill"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 rounded-3xl"
                              style={{
                                background: "linear-gradient(135deg, rgba(238, 116, 41, 0.08) 0%, rgba(238, 116, 41, 0.02) 100%)",
                                border: "1px solid rgba(238, 116, 41, 0.1)",
                                backdropFilter: "blur(12px) saturate(150%)",
                                boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.6), 0 2px 10px rgba(238, 116, 41, 0.05)",
                                zIndex: -1,
                              }}
                              transition={{ type: "spring", stiffness: 120, damping: 20, mass: 1.1 }}
                            />
                          )}
                        </AnimatePresence>
                        <div className="relative z-10 flex items-start gap-3">
                           <Icon className={`w-4 h-4 mt-0.5 ${isHovered ? 'text-amber-600' : 'text-amber-500'} transition-colors`} />
                           <div>
                             <p className={`text-[13px] font-bold ${isHovered ? 'text-amber-700' : 'text-slate-800'} transition-colors`}>{item.label}</p>
                             <div className="flex flex-col gap-0.5 mt-0.5">
                               {item.lines.map((line) => (
                                 <p key={line} className="text-[12px] text-slate-500 font-medium">{line}</p>
                               ))}
                             </div>
                           </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <div
          className="relative z-10 border-t py-4 px-6"
          style={{ borderColor: "rgba(238, 116, 41, 0.15)" }}
        >
          <div className="max-w-none mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400 font-semibold">
              © 2026 SoulsWed. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-xs text-slate-400 hover:text-amber-600 transition-colors font-semibold">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs text-slate-400 hover:text-amber-600 transition-colors font-semibold">
                Terms of Service
              </Link>
              <span className="text-xs flex items-center gap-1 text-slate-400 font-semibold">
                Made with
                <Heart className="w-3 h-3 fill-current mx-0.5 text-red-500 animate-pulse" />
                in India
              </span>
              <div className="relative" ref={currencyRef}>
                <button 
                  onClick={() => setCurrencyOpen(!currencyOpen)}
                  className="px-3 py-1.5 ml-2 text-xs font-bold rounded-full bg-slate-800 text-slate-200 hover:bg-primary-500 hover:text-white transition-all duration-300 cursor-pointer flex items-center gap-1 shadow-sm border border-slate-700 hover:border-primary-500"
                  title="Change Currency"
                >
                  <span className="opacity-70 text-[10px]">Currency:</span> {currency}
                  <ChevronUp className={`w-3 h-3 transition-transform duration-300 ${currencyOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {currencyOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full right-0 mb-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden min-w-[140px] z-50 flex flex-col"
                    >
                      {Object.entries(CURRENCIES).map(([code, details]) => (
                        <button
                          key={code}
                          onClick={() => {
                            setCurrency(code);
                            setCurrencyOpen(false);
                          }}
                          className={`flex flex-col items-start px-4 py-3 hover:bg-primary-50 transition-colors border-b border-slate-50 last:border-0 ${
                            currency === code ? 'bg-primary-50/50' : ''
                          }`}
                        >
                          <span className={`text-sm font-bold ${currency === code ? 'text-primary-600' : 'text-slate-800'}`}>
                            {code} ({details.symbol})
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </footer>
      </div>

      {/* Floating Action Buttons (Scroll to Top & WhatsApp) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
        {/* Scroll to Top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center justify-center w-14 h-14 rounded-full shadow-xl transition-all hover:scale-110 hover:shadow-2xl group ml-auto"
          style={{
            background: "var(--sw-primary)",
            color: "#fff",
            boxShadow: "0 8px 24px rgba(238,116,41,0.45)",
          }}
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-7 h-7 text-white transition-colors" />
        </button>
        
        {/* WhatsApp */}
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 rounded-full shadow-xl transition-all hover:scale-110 hover:shadow-2xl"
          style={{
            background: "#25D366",
            color: "#fff",
            boxShadow: "0 8px 24px rgba(37, 211, 102, 0.45)",
          }}
          aria-label="Contact on WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.662-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </a>
      </div>
    </>
  );
}
