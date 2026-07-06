"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Heart, Phone, Mail, MessageCircle, ChevronUp } from "lucide-react";

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
  { label: "Venues & Banquet Halls", href: "/category/venues" },
  { label: "Wedding Planners", href: "/category/planners" },
  { label: "Photographers", href: "/category/photographers" },
  { label: "Decorators", href: "/category/decorators" },
  { label: "Make-up Artists", href: "/category/makeup" },
  { label: "Caterers", href: "/category/caterers" },
  { label: "DJs", href: "/category/djs" },
  { label: "Cruises", href: "/category/cruises" },
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
  { icon: IconInstagram, href: "/images/shared/73a78acdfa5d8547664ba493c089879d.jpg", label: "Instagram" },
  { icon: IconFacebook, href: "https://facebook.com/soulswed", label: "Facebook" },
  { icon: IconLinkedIn, href: "https://linkedin.com/company/soulswed", label: "LinkedIn" },
];

export default function Footer() {
  const pathname = usePathname();
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
      <div className="max-w-[94%] md:max-w-[90%] lg:max-w-[1200px] xl:max-w-[1300px] mx-auto px-4 pb-6 w-full">
      <footer
        className="relative overflow-hidden rounded-[48px] border border-amber-100/60 shadow-[0_24px_70px_rgba(252,203,17,0.12)] noise-texture transition-all duration-500 hover:shadow-[0_32px_80px_rgba(252,203,17,0.18)]"
        style={{
          background: "linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 253, 245, 0.97) 100%)",
        }}
      >
        {/* Top gold/amber gradient highlight line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 z-20" />

        {/* Animated glowing decorative gradient orbs */}
        <div className="absolute -right-32 -bottom-32 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-yellow-300/20 via-amber-200/15 to-orange-200/5 blur-3xl pointer-events-none z-0 animate-float-1" />
        <div className="absolute -left-28 -top-28 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-yellow-200/15 via-amber-100/10 to-transparent blur-3xl pointer-events-none z-0 animate-float-2" />
        <div className="absolute left-1/3 top-1/4 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-yellow-100/10 via-amber-50/5 to-transparent blur-3xl pointer-events-none z-0 animate-float-3" />

        {/* Background image overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/shared/9368d5bcfe07eea016da3567805d57c9.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center pointer-events-none"
            style={{ opacity: 0.02, mixBlendMode: "multiply" }}
          />
        </div>

        <div className="relative z-10 w-full mx-auto px-6 sm:px-10 lg:px-16 py-10 md:py-12">
          
          {/* Top Row: Newsletter Subscription */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8 mb-8 border-b border-amber-100/50">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest text-amber-700 bg-amber-50 border border-amber-100/60 mb-3 uppercase">
                ✨ Exclusive Club
              </span>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-800">
                Join the <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">SoulsWed Circle</span>
              </h3>
              <p className="text-xs text-slate-500 mt-2 max-w-xl font-medium leading-relaxed">
                Subscribe to receive curated destination wedding inspiration, venue guides, and exclusive partner promotions.
              </p>
            </div>
            <div className="lg:col-span-5 flex items-center">
              <form onSubmit={(e) => e.preventDefault()} className="relative w-full flex items-center">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full bg-white/80 border border-amber-200/60 focus:border-amber-400 focus:ring-4 focus:ring-amber-100/50 rounded-full px-5 py-3 pr-36 outline-none transition-all text-sm text-slate-800 shadow-inner font-medium placeholder-slate-400"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 px-7 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white font-bold text-xs tracking-wider uppercase hover:shadow-[0_4px_15px_rgba(238,116,41,0.35)] hover:from-amber-600 hover:to-orange-600 transition-all duration-300 hover:scale-102 cursor-pointer"
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
              <Link href="/" className="flex items-center mb-5 group inline-flex">
                <Image 
                  src="/logo/logo-by-soulswed.png"
                  alt="SoulsWed Logo"
                  width={200}
                  height={60}
                  className="h-7 md:h-8 w-auto transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
              <p className="text-sm leading-relaxed mb-1.5 font-bold text-slate-700">
                Flawless Moves. Perfect Events.
              </p>
              <p className="text-xs leading-relaxed mb-5 text-slate-500 font-medium max-w-sm">
                India&apos;s premium wedding marketplace for destination weddings across India and beyond. Providing luxury planners, venues, and media.
              </p>
              <div className="flex gap-3">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-115 hover:-translate-y-1 hover:bg-gradient-to-tr hover:from-amber-400 hover:to-orange-500 text-amber-700 hover:text-white border border-amber-100 hover:border-transparent bg-amber-50/40 shadow-xs"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2 — About Us */}
            <div>
              <h4 className="text-xs font-extrabold mb-6 uppercase tracking-widest text-slate-400">
                About Us
              </h4>
              <ul className="flex flex-col gap-3">
                {aboutLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group text-sm font-semibold text-slate-600 hover:text-amber-600 transition-all duration-200 flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 opacity-0 scale-50 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100" />
                      <span className="group-hover:translate-x-1.5 transition-transform duration-200 flex items-center gap-0.5">
                        {item.label}
                        <span className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-amber-500 font-light">→</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — Our Services */}
            <div>
              <h4 className="text-xs font-extrabold mb-6 uppercase tracking-widest text-slate-400">
                Our Services
              </h4>
              <ul className="flex flex-col gap-3">
                {services.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group text-sm font-semibold text-slate-600 hover:text-amber-600 transition-all duration-200 flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 opacity-0 scale-50 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100" />
                      <span className="group-hover:translate-x-1.5 transition-transform duration-200 flex items-center gap-0.5">
                        {item.label}
                        <span className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-amber-500 font-light">→</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4 — Contact Info (Bento interactive cards) */}
            <div>
              <h4 className="text-xs font-extrabold mb-6 uppercase tracking-widest text-slate-400">
                Contact Info
              </h4>
              <ul className="flex flex-col gap-3.5">
                {contactItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label} className="flex items-start gap-3 group bg-white/40 hover:bg-white/90 border border-amber-100/30 hover:border-amber-200/60 rounded-full pl-3 pr-5 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xs">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110 border border-amber-100"
                        style={{ background: "rgba(252, 203, 17, 0.12)" }}
                      >
                        <Icon className="w-4 h-4 text-amber-700" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          {item.label}
                        </p>
                        {item.lines.map((line) => (
                          <p key={line} className="text-[11px] text-slate-500 font-semibold mt-0.5">
                            {line}
                          </p>
                        ))}
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
          style={{ borderColor: "rgba(252, 203, 17, 0.12)" }}
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
            background: "var(--sw-orange)",
            color: "#fff",
            boxShadow: "0 8px 24px rgba(238,116,41,0.45)",
          }}
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-7 h-7 text-white transition-colors" />
        </button>
        
        {/* WhatsApp */}
        <a
          href="/images/shared/2cf5849d13c2075ac81cd9d3fdf4a688.jpg"
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
