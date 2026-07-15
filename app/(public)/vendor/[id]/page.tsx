"use client";

import { useState, useEffect } from "react";
import { notFound, useParams, useSearchParams } from "next/navigation";
import Image from "@/components/shared/CustomImage";
import Link from "next/link";
import { MapPin, Star, BadgeCheck, ChevronLeft, Loader2, Sparkles, Building2, Quote, Check } from "lucide-react";
import type { PublicVendor } from "@/components/vendors/PublicVendorDirectory";
import VendorSidebar from "@/components/vendors/VendorSidebar";
import VenueGallery from "@/components/venues/VenueGallery";
import { useCurrency } from "@/lib/CurrencyContext";

export default function VendorDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = typeof params.id === "string" ? params.id : params.id?.[0] ?? "";
  const { currency } = useCurrency();

  const [vendor, setVendor] = useState<PublicVendor | null>(null);
  const [vendorLoading, setVendorLoading] = useState(true);
  const [vendorNotFound, setVendorNotFound] = useState(false);

  // Stripe Payment Callback States
  const successParam = searchParams.get("success");
  const sessionId = searchParams.get("session_id");
  const bookingId = searchParams.get("booking_id");
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Fetch this vendor from MongoDB API
  useEffect(() => {
    if (!id) return;
    setVendorLoading(true);
    fetch(`/api/vendors?id=${encodeURIComponent(id)}`)
      .then((res) => res.json())
      .then((data) => {
        const raw = data.vendor || data.vendors?.[0];
        if (!raw) {
          setVendorNotFound(true);
          return;
        }
        setVendor(raw);
      })
      .catch(() => setVendorNotFound(true))
      .finally(() => setVendorLoading(false));
  }, [id]);

  // Stripe payment verification
  useEffect(() => {
    if (successParam === "true" && sessionId && bookingId) {
      setVerifyingPayment(true);
      fetch("/api/bookings/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stripe_session_id: sessionId,
          bookingId: bookingId,
        }),
      })
        .then((res) => {
          if (res.ok) {
            setPaymentSuccess(true);
          } else {
            console.error("Failed to verify Stripe payment");
          }
        })
        .catch((err) => console.error("Error verifying payment:", err))
        .finally(() => setVerifyingPayment(false));
    }
  }, [successParam, sessionId, bookingId]);

  if (vendorLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "var(--sw-white)" }}>
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: "var(--sw-primary)" }} />
        <p className="text-sm text-slate-500 font-medium">Loading vendor details...</p>
      </div>
    );
  }

  if (vendorNotFound || !vendor) {
    notFound();
  }

  const name = vendor.businessName || vendor.name;
  const rating = vendor.rating || 5.0;
  const reviewCount = vendor.reviewCount || Math.floor(Math.random() * 100) + 10;
  const images = vendor.images && vendor.images.length > 0 ? vendor.images : [
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=85",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=85",
    "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=900&q=85",
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--sw-white)" }}>
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          
          {/* Left — main */}
          <div className="space-y-16">
            
            {/* Hero Section */}
            <div className="flex flex-col gap-6">
              <Link
                href={`/vendors/${vendor.category.toLowerCase()}`}
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors w-fit"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to {vendor.category}
              </Link>
              
              <div className="relative w-full h-[500px] rounded-[32px] overflow-hidden group">
                <Image
                  src={images[0]}
                  alt={name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/10" />
                
                {/* Badges on image */}
                <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                  <span className="bg-white/95 backdrop-blur-sm text-slate-900 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-primary-500" />
                    {vendor.category}
                  </span>
                  {vendor.verified && (
                    <span className="bg-emerald-500/95 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      Verified Pro
                    </span>
                  )}
                </div>
              </div>

              <div>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-3 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                      {name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm font-medium text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-primary-500" />
                        {vendor.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        {vendor.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white border border-slate-100 shadow-sm rounded-2xl p-3 shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-50 text-yellow-500">
                      <Star className="w-6 h-6 fill-yellow-400" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-slate-900">{rating.toFixed(1)}</div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{reviewCount} reviews</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-100 py-4 -mx-4 px-4 sm:mx-0 sm:px-0 mt-8">
              <div className="flex items-center gap-8 overflow-x-auto no-scrollbar pb-1">
                <a href="#about" className="text-sm font-bold text-slate-900 border-b-2 border-slate-900 pb-1.5 whitespace-nowrap">About</a>
                <a href="#gallery" className="text-sm font-medium text-slate-500 hover:text-slate-900 pb-1.5 whitespace-nowrap transition-colors">Portfolio</a>
              </div>
            </div>

            {/* About */}
            <section id="about" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--sw-navy)" }}>
                About {name}
              </h2>
              <div className="bg-slate-50/50 rounded-[24px] p-6 sm:p-8 border border-slate-100 relative">
                <Quote className="absolute top-6 left-6 w-10 h-10 text-slate-200 -z-10" />
                <p className="text-slate-600 leading-loose text-base font-medium max-w-4xl relative z-10 whitespace-pre-wrap">
                  {vendor.description || `${name} is a premier ${vendor.category.toLowerCase()} based in ${vendor.city}. We specialize in bringing your dream wedding to life with flawless execution and an eye for perfection. Contact us to learn more about our services and how we can make your special day truly unforgettable.`}
                </p>
              </div>
            </section>

            {/* Gallery */}
            <section id="gallery" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-5" style={{ fontFamily: "var(--font-heading)", color: "var(--sw-navy)" }}>
                Portfolio
              </h2>
              <VenueGallery images={images} venueName={name} />
            </section>

          </div>

          {/* Right — Sidebar */}
          <aside className="relative">
            <VendorSidebar vendor={vendor} />
          </aside>
        </div>
      </div>
      
      {/* Post-booking Success Toast */}
      {paymentSuccess && (
        <div className="fixed bottom-10 right-10 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-5 z-50">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold">Booking Confirmed!</p>
            <p className="text-sm opacity-90">Your payment has been successfully processed.</p>
          </div>
        </div>
      )}
    </div>
  );
}
