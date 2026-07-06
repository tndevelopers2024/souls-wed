"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Heart, Phone, Mail, ChevronUp, MapPin, ArrowUpRight } from "lucide-react";

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

function IconX({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function IconYouTube({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function IconWhatsApp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.662-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

const aboutLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Success Stories", href: "/stories" },
  { label: "Wedding Journal", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];

const servicesLinks = [
  { label: "Destination Weddings", href: "/services/destination" },
  { label: "Vendor Management", href: "/services/vendors" },
  { label: "Guest Hospitality", href: "/services/hospitality" },
  { label: "Event Styling", href: "/services/styling" },
  { label: "Consultation", href: "/services/consultation" },
];

const vendorLinks = [
  { label: "Venues", href: "/category/venues" },
  { label: "Planners", href: "/category/planners" },
  { label: "Photographers", href: "/category/photographers" },
  { label: "Decorators", href: "/category/decorators" },
  { label: "Makeup Artists", href: "/category/makeup" },
];

const socialLinks = [
  { icon: IconInstagram, href: "https://instagram.com/soulswed", label: "Instagram" },
  { icon: IconX, href: "https://x.com/soulswed", label: "X" },
  { icon: IconFacebook, href: "https://facebook.com/soulswed", label: "Facebook" },
  { icon: IconLinkedIn, href: "https://linkedin.com/company/soulswed", label: "LinkedIn" },
  { icon: IconYouTube, href: "https://youtube.com/soulswed", label: "YouTube" },
  { icon: IconWhatsApp, href: "https://wa.me/919600043002", label: "WhatsApp" },
];

export default function Footer() {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/signup");
  
  if (isAuthPage) return null;

  return (
    <>
      <div className="max-w-[96%] xl:max-w-[1440px] 2xl:max-w-[1580px] mx-auto px-4 pb-8 w-full mt-10">
        <footer
          className="rounded-[40px] overflow-hidden bg-gradient-to-b from-[#FDFBF9] to-[#F9F4EE] border border-amber-900/5 shadow-sm"
        >
          <div className="px-6 sm:px-10 md:px-16 lg:px-20 py-16 md:py-20">
            {/* Top Row: CTA */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-12 border-b border-slate-200/60 mb-12">
              <div>
                <h3 className="text-3xl md:text-4xl text-slate-800 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  Ready to start your <span className="text-amber-700 italic">SoulsWed journey?</span>
                </h3>
                <p className="text-slate-500">Book a free 30-minute consultation — no pressure, just clarity.</p>
              </div>
              <Link href="/contact" className="inline-flex items-center justify-center bg-[#b91c1c] hover:bg-[#991b1b] text-white font-bold px-7 py-4 rounded-full transition-colors whitespace-nowrap gap-2 shadow-sm text-sm">
                Book Free Strategy Call <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Middle Row: Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-6">
              
              {/* Col 1: Brand */}
              <div className="lg:col-span-4 xl:col-span-4 lg:pr-8">
                <Link href="/" className="inline-block mb-6">
                  <Image 
                    src="/logo/logo-by-soulswed.png"
                    alt="SoulsWed Logo"
                    width={180}
                    height={54}
                    className="h-12 w-auto"
                  />
                </Link>
                <p className="text-[17px] italic text-slate-700 mb-5 font-serif">
                  "Make your wedding flawless."
                </p>
                <p className="text-xs text-slate-500 leading-relaxed mb-8 max-w-sm">
                  India's premium wedding marketplace for destination weddings across India and beyond. Providing luxury planners, venues, and media.
                </p>
                
                <div className="flex flex-wrap gap-2.5">
                  {socialLinks.map(({ icon: Icon, href, label }) => (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-amber-700 hover:border-amber-200 hover:bg-amber-50 transition-all duration-300"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Col 2: COMMUNITY */}
              <div className="lg:col-span-2">
                <h4 className="text-[10px] font-bold text-amber-700 tracking-widest uppercase mb-6 flex items-center gap-2">
                  <span className="w-4 h-[1px] bg-amber-700/40"></span>
                  Community
                </h4>
                <ul className="flex flex-col gap-3.5">
                  {aboutLinks.map(link => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-[13px] text-slate-500 hover:text-amber-700 transition-colors font-medium">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 3: SERVICES */}
              <div className="lg:col-span-2">
                <h4 className="text-[10px] font-bold text-amber-700 tracking-widest uppercase mb-6 flex items-center gap-2">
                  <span className="w-4 h-[1px] bg-amber-700/40"></span>
                  Services
                </h4>
                <ul className="flex flex-col gap-3.5">
                  {servicesLinks.map(link => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-[13px] text-slate-500 hover:text-amber-700 transition-colors font-medium">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 4: VENDORS */}
              <div className="lg:col-span-2">
                <h4 className="text-[10px] font-bold text-amber-700 tracking-widest uppercase mb-6 flex items-center gap-2">
                  <span className="w-4 h-[1px] bg-amber-700/40"></span>
                  Vendors
                </h4>
                <ul className="flex flex-col gap-3.5">
                  {vendorLinks.map(link => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-[13px] text-slate-500 hover:text-amber-700 transition-colors font-medium">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 5: GET IN TOUCH */}
              <div className="lg:col-span-2">
                <h4 className="text-[10px] font-bold text-amber-700 tracking-widest uppercase mb-6 flex items-center gap-2">
                  <span className="w-4 h-[1px] bg-amber-700/40"></span>
                  Get In Touch
                </h4>
                <div className="flex flex-col gap-5">
                  <div className="flex gap-3">
                    <div className="w-7 h-7 shrink-0 rounded-full bg-[#fdf5eb] flex items-center justify-center text-amber-700">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 tracking-widest uppercase mb-0.5">Email</span>
                      <a href="mailto:hello@soulswed.com" className="text-[12px] text-slate-800 hover:text-amber-700 transition-colors font-medium">hello@soulswed.com</a>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-7 h-7 shrink-0 rounded-full bg-[#fdf5eb] flex items-center justify-center text-amber-700">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 tracking-widest uppercase mb-0.5">Phone</span>
                      <a href="tel:+919876543210" className="text-[12px] text-slate-800 hover:text-amber-700 transition-colors font-medium">+91 98765 43210</a>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-7 h-7 shrink-0 rounded-full bg-[#fdf5eb] flex items-center justify-center text-amber-700">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 tracking-widest uppercase mb-0.5">Location</span>
                      <span className="text-[12px] text-slate-800 font-medium leading-tight inline-block">Serving couples across India & NRIs.</span>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>

            {/* Bottom strip */}
            <div className="mt-16 pt-8 border-t border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-[10px] font-medium text-slate-400">
                © 2026 SoulsWed. All rights reserved.
              </p>
              <p className="text-[10px] font-medium text-slate-400 tracking-wide uppercase">
                India's Premium Wedding Marketplace • Trusted Platform
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating Action Buttons (Scroll to Top & WhatsApp) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
        {/* Scroll to Top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all hover:scale-110 hover:shadow-xl bg-white text-amber-700 border border-slate-100"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
        
        {/* WhatsApp */}
        <a
          href="https://wa.me/919600043002"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all hover:scale-110 hover:shadow-xl text-white"
          style={{ background: "#25D366" }}
          aria-label="Contact on WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.662-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </a>
      </div>
    </>
  );
}
