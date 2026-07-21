"use client";

import { useState, useEffect } from "react";
import Image from "@/components/shared/CustomImage";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, Star, Package } from "lucide-react";
import { CheckIcon } from "@/components/ui/check";
import { ChevronDownIcon } from "@/components/ui/chevron-down";

import { useCurrency } from "@/lib/CurrencyContext";
import { formatAsCurrency } from "@/lib/currency";
import type { PublicVendor } from "@/components/vendors/PublicVendorDirectory";
import VendorHero from "@/components/vendors/VendorHero";
import VendorSidebar from "@/components/vendors/VendorSidebar";
import VenueGallery from "@/components/venues/VenueGallery";


// Basic mocked reviews component to mimic VenueReviews
function VendorReviews({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  const displayRating = rating > 0 ? rating : 5;
  const count = reviewCount > 0 ? reviewCount : 2;
  return (
    <div className="flex flex-col md:flex-row gap-8 items-center bg-primary-50/40 p-6 rounded-2xl mb-8 border border-primary-100">
      <div className="text-center md:border-r border-primary-200/50 md:pr-10 shrink-0">
        <div className="text-5xl font-black text-slate-900 mb-1">{displayRating.toFixed(1)}</div>
        <div className="flex justify-center gap-0.5 mb-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{count} Reviews</p>
      </div>
      <div className="flex-1 text-slate-600 text-sm italic font-medium max-w-lg text-center md:text-left">
        &ldquo;Absolutely fantastic service. They were professional, accommodating, and delivered exactly what we wanted for our wedding!&rdquo;
      </div>
    </div>
  );
}

interface PublicVendorDetailPageProps {
  vendor: PublicVendor;
}

export default function PublicVendorDetailPage({ vendor }: PublicVendorDetailPageProps) {
  const searchParams = useSearchParams();
  const { currency } = useCurrency();

  const successParam = searchParams.get("success");
  const sessionId = searchParams.get("session_id");
  const bookingId = searchParams.get("booking_id");

  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("areas");

  // Scroll-spy: track which section is in view
  useEffect(() => {
    const sectionIds = ["areas", "about", "gallery", "pricing", "reviews"];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [vendor]);

  const cat = vendor.category.toLowerCase();
  const isVenue = cat.includes("venue") || cat.includes("banquet");
  const isRoom = cat.includes("room") || cat.includes("accommodation");
  const isCaterer = cat.includes("cater");
  const isPerPlate = isVenue || isCaterer;

  // ── Stripe payment verification ──
  useEffect(() => {
    if (successParam === "true" && sessionId && bookingId) {
      setVerifyingPayment(true);
      fetch("/api/bookings/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stripe_session_id: sessionId, bookingId }),
      })
        .then((res) => { if (res.ok) setPaymentSuccess(true); })
        .catch((err) => console.error("Error verifying payment:", err))
        .finally(() => setVerifyingPayment(false));
    }
  }, [successParam, sessionId, bookingId]);

  const images = vendor.images?.length ? vendor.images : ["/soulswed/vendors/1182.avif"];

  // Dynamic mocked FAQs based on category
  const faqs = [
    { question: "What is your booking and cancellation policy?", answer: "We require a 30% advance payment to lock in your date. Cancellations made more than 30 days prior to the event receive a full refund of the advance." },
    { question: `Do you travel for destination weddings?`, answer: "Yes, we travel all across India and internationally. Travel and accommodation charges are covered by the client." }
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--sw-white)" }}>
      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">

          {/* Left — main */}
          <div className="space-y-10">
            <VendorHero vendor={{ ...vendor, images }} />

            {/* Tab Navigation */}
            <div className="sticky top-20 z-40 bg-white py-4 -mx-4 px-4 sm:mx-0 sm:px-0 mt-6">
              <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 overflow-x-auto no-scrollbar">
                {[
                  { id: "areas", label: "Areas Available" },
                  { id: "about", label: "About" },
                  { id: "gallery", label: "Gallery" },
                  { id: "pricing", label: "Pricing" },
                  { id: "reviews", label: "Reviews" },
                ].map((tab) => (
                  <a
                    key={tab.id}
                    href={`#${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`text-sm rounded-lg px-4 py-2 whitespace-nowrap transition-colors ${activeTab === tab.id
                        ? "font-semibold text-slate-900 bg-white"
                        : "font-medium text-slate-500"
                      }`}
                  >
                    {tab.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Areas Available */}
            <section id="areas" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-5" style={{ fontFamily: "var(--font-heading)", color: "var(--sw-navy)" }}>
                Areas Available (2)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0 text-primary-600">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">200 Seating | 300 Floating</h4>
                    <p className="text-xs text-slate-500 mt-1">Indoor • Banquet Hall</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0 text-green-600">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">500 Seating | 800 Floating</h4>
                    <p className="text-xs text-slate-500 mt-1">Outdoor • Lawn</p>
                  </div>
                </div>
              </div>

              {/* Feature tags */}
              <div className="flex flex-wrap gap-2 mt-5">
                {["Air Conditioned", "Parking Available", "Power Backup"].map((f) => (
                  <span key={f} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200 text-slate-600">
                    <CheckIcon className="w-3.5 h-3.5 text-green-500" />
                    {f}
                  </span>
                ))}
              </div>
            </section>

            {/* About */}
            <section id="about" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--sw-navy)" }}>
                About {vendor.businessName || vendor.name}
              </h2>
              <p className="text-slate-600 leading-relaxed text-[15px]">
                {vendor.description || `${vendor.businessName || vendor.name} is a leading partner in the ${vendor.category} wedding vertical. Providing customized services, premium deliverables, and experienced service management to couples across ${vendor.city} and beyond.`}
              </p>
            </section>

            {/* Gallery */}
            <section id="gallery" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-5" style={{ fontFamily: "var(--font-heading)", color: "var(--sw-navy)" }}>
                Gallery
              </h2>
              <VenueGallery images={vendor.gallery?.length ? vendor.gallery : images} videos={vendor.videos || []} venueName={vendor.businessName || vendor.name} />
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-5" style={{ fontFamily: "var(--font-heading)", color: "var(--sw-navy)" }}>
                Pricing
              </h2>
              <div className="rounded-[24px] overflow-hidden border border-slate-100" style={{ background: "white" }}>

                {isPerPlate ? (
                  <>
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">Veg Menu</p>
                        <p className="text-xs text-slate-400">Per plate, inclusive of taxes</p>
                      </div>
                      <p className="text-lg font-bold" style={{ color: "var(--sw-navy)" }}>
                        {vendor.priceFrom ? formatAsCurrency(vendor.priceFrom, currency) : "On request"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">Non-Veg Menu</p>
                        <p className="text-xs text-slate-400">Per plate, inclusive of taxes</p>
                      </div>
                      <p className="text-lg font-bold" style={{ color: "var(--sw-navy)" }}>
                        {vendor.priceFrom ? formatAsCurrency(Math.round(vendor.priceFrom * 1.2), currency) : "On request"}
                      </p>
                    </div>
                    {isVenue && (
                      <div className="flex items-center justify-between px-6 py-4">
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">Venue Rental</p>
                          <p className="text-xs text-slate-400">Full-day exclusive use</p>
                        </div>
                        <p className="text-lg font-bold text-primary-600">
                          {vendor.priceFrom ? formatAsCurrency(vendor.priceFrom * 5, currency) : "On request"}
                        </p>
                      </div>
                    )}
                  </>
                ) : isRoom ? (
                  <div className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">Room Rate</p>
                      <p className="text-xs text-slate-400">Per room per night, inclusive of taxes</p>
                    </div>
                    <p className="text-lg font-bold text-primary-600">
                      {vendor.priceFrom ? formatAsCurrency(vendor.priceFrom, currency) : "On request"}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">Starting Package</p>
                      <p className="text-xs text-slate-400">Fixed starting fee for services</p>
                    </div>
                    <p className="text-lg font-bold text-primary-600">
                      {vendor.priceFrom ? formatAsCurrency(vendor.priceFrom, currency) : "On request"}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Reviews */}
            <section id="reviews" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)", color: "var(--sw-navy)" }}>
                Reviews <span className="text-slate-400 ml-2 text-xl">({(vendor.reviewCount || 0) > 0 ? vendor.reviewCount : 2})</span>
              </h2>
              <VendorReviews rating={vendor.rating || 5} reviewCount={vendor.reviewCount || 2} />
            </section>

            {/* FAQ */}
            <section id="faq" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-5" style={{ fontFamily: "var(--font-heading)", color: "var(--sw-navy)" }}>
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <div key={i} className="rounded-[20px] overflow-hidden border border-slate-100" style={{ background: "white" }}>
                    <button className="w-full flex items-center justify-between px-5 py-4 text-left gap-3 outline-none" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                      <span className="font-semibold text-sm text-slate-800">{faq.question}</span>
                      <ChevronDownIcon className="w-4 h-4 flex-shrink-0 text-slate-400 transition-transform" style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0)" }} />
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-4">
                        <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right — sidebar */}
          <div>
            <VendorSidebar vendor={vendor} />
          </div>
        </div>
      </div>

      {/* Stripe Payment Verification Modal Overlay */}
      {(verifyingPayment || paymentSuccess) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-2xl border border-slate-100 flex flex-col items-center">
            {verifyingPayment ? (
              <>
                <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 mb-4">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Verifying Payment...</h3>
                <p className="text-sm text-slate-500">Please do not close this window or click back.</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 animate-bounce">
                  <CheckIcon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Payment Confirmed!</h3>
                <p className="text-sm text-slate-500 mb-6">Your booking is now confirmed. You can view all details in your dashboard.</p>
                <Link href="/dashboard" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-full text-sm transition-colors text-center block shadow-md">
                  Go to Dashboard
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
