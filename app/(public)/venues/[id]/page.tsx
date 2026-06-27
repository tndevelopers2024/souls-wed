"use client";

import { useState, useEffect } from "react";
import { notFound, useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  Star,
  BadgeCheck,
  ChevronLeft,
  ChevronDown,
  Users,
  BedDouble,
  Car,
  UtensilsCrossed,
  TreePine,
  Building,
  Check,
  Loader2,
} from "lucide-react";
import { getVenueById, venues } from "@/lib/venues-data";
import VenueHero from "@/components/venues/VenueHero";
import VenueGallery from "@/components/venues/VenueGallery";
import VenueSidebar from "@/components/venues/VenueSidebar";
import VenueReviews from "@/components/venues/VenueReviews";
import SimilarVenues from "@/components/venues/SimilarVenues";

export default function VenueDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = typeof params.id === "string" ? params.id : params.id?.[0] ?? "";
  const venue = getVenueById(id);

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // Stripe Payment Callback States
  const successParam = searchParams.get("success");
  const sessionId = searchParams.get("session_id");
  const bookingId = searchParams.get("booking_id");
  
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (successParam === "true" && sessionId && bookingId) {
      setVerifyingPayment(true);
      fetch("/api/bookings/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gateway: "stripe",
          payment_intent_id: sessionId,
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

  if (!venue) {
    notFound();
  }

  const similar = venues.filter((v) => v.id !== venue.id).slice(0, 5);

  return (
    <div className="min-h-screen" style={{ background: "var(--sw-white)" }}>


      {/* ── Main content ────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          {/* Left — main */}
          <div className="space-y-10">
            <VenueHero venue={venue} />

            {/* Tab Navigation */}
            <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 py-4 -mx-4 px-4 sm:mx-0 sm:px-0 mt-6 shadow-sm">
              <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-1">
                <a href="#areas" className="text-sm font-bold text-orange-600 border-b-2 border-orange-600 pb-1 whitespace-nowrap">Areas Available</a>
                <a href="#about" className="text-sm font-semibold text-slate-600 hover:text-orange-600 pb-1 whitespace-nowrap transition-colors">About</a>
                <a href="#gallery" className="text-sm font-semibold text-slate-600 hover:text-orange-600 pb-1 whitespace-nowrap transition-colors">Gallery</a>
                <a href="#pricing" className="text-sm font-semibold text-slate-600 hover:text-orange-600 pb-1 whitespace-nowrap transition-colors">Pricing</a>
                <a href="#reviews" className="text-sm font-semibold text-slate-600 hover:text-orange-600 pb-1 whitespace-nowrap transition-colors">Reviews</a>
              </div>
            </div>

            {/* Areas Available */}
            <section id="areas" className="scroll-mt-32">
              <h2
                className="text-2xl font-bold mb-5"
                style={{ fontFamily: "var(--font-heading)", color: "var(--sw-navy)" }}
              >
                Areas Available ({venue.outdoor && venue.indoor ? 2 : 1})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {venue.indoor && (
                  <div className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 hover:border-orange-200 transition-colors bg-white shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 text-orange-600">
                      <Building className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{venue.minGuests} Seating | {venue.maxGuests} Floating</h4>
                      <p className="text-xs text-slate-500 mt-1">Indoor • Banquet Hall</p>
                    </div>
                  </div>
                )}
                {venue.outdoor && (
                  <div className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 hover:border-orange-200 transition-colors bg-white shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0 text-green-600">
                      <TreePine className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{Math.floor(venue.maxGuests * 0.8)} Seating | {Math.floor(venue.maxGuests * 1.5)} Floating</h4>
                      <p className="text-xs text-slate-500 mt-1">Outdoor • Lawn</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Feature tags */}
              <div className="flex flex-wrap gap-2 mt-5">
                {venue.features.map((f) => (
                  <span
                    key={f}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200 text-slate-600"
                  >
                    <Check className="w-3.5 h-3.5 text-green-500" />
                    {f}
                  </span>
                ))}
              </div>
            </section>

            {/* About */}
            <section id="about" className="scroll-mt-32">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: "var(--font-heading)", color: "var(--sw-navy)" }}
              >
                About {venue.name}
              </h2>
              <p className="text-slate-600 leading-relaxed text-[15px]">{venue.description}</p>
            </section>

            {/* Gallery */}
            <section id="gallery" className="scroll-mt-32">
              <h2
                className="text-2xl font-bold mb-5"
                style={{ fontFamily: "var(--font-heading)", color: "var(--sw-navy)" }}
              >
                Gallery
              </h2>
              <VenueGallery images={venue.gallery} venueName={venue.name} />
            </section>

            {/* Pricing Table */}
            <section id="pricing" className="scroll-mt-32">
              <h2
                className="text-2xl font-bold mb-5"
                style={{ fontFamily: "var(--font-heading)", color: "var(--sw-navy)" }}
              >
                Pricing
              </h2>
              <div
                className="rounded-[24px] overflow-hidden border border-slate-100"
                style={{ background: "white" }}
              >
                {venue.pricePerPlateVeg && (
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">Veg Menu</p>
                      <p className="text-xs text-slate-400">Per plate, inclusive of taxes</p>
                    </div>
                    <p className="text-lg font-bold" style={{ color: "var(--sw-navy)" }}>
                      {venue.pricePerPlateVeg}
                    </p>
                  </div>
                )}
                {venue.pricePerPlateNonVeg && (
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">Non-Veg Menu</p>
                      <p className="text-xs text-slate-400">Per plate, inclusive of taxes</p>
                    </div>
                    <p className="text-lg font-bold" style={{ color: "var(--sw-navy)" }}>
                      {venue.pricePerPlateNonVeg}
                    </p>
                  </div>
                )}
                {venue.rentalCost && (
                  <div className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">Venue Rental</p>
                      <p className="text-xs text-slate-400">Full-day exclusive use</p>
                    </div>
                    <p className="text-lg font-bold" style={{ color: "var(--sw-navy)" }}>
                      {venue.rentalCost}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Reviews */}
            <section id="reviews" className="scroll-mt-32">
              <h2
                className="text-2xl font-bold mb-6"
                style={{ fontFamily: "var(--font-heading)", color: "var(--sw-navy)" }}
              >
                Reviews{venue.reviewCount > 0 && <span className="text-slate-400 ml-2 text-xl">({venue.reviewCount})</span>}
              </h2>
              <VenueReviews
                rating={venue.rating}
                reviewCount={venue.reviewCount}
                reviews={venue.reviews}
              />
            </section>

            {/* FAQ */}
            {venue.faqs.length > 0 && (
              <section id="faq" className="scroll-mt-32">
                <h2
                  className="text-2xl font-bold mb-5"
                  style={{ fontFamily: "var(--font-heading)", color: "var(--sw-navy)" }}
                >
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {venue.faqs.map((faq, i) => (
                    <div
                      key={i}
                      className="rounded-[20px] overflow-hidden border border-slate-100"
                      style={{ background: "white" }}
                    >
                      <button
                        className="w-full flex items-center justify-between px-5 py-4 text-left gap-3"
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      >
                        <span className="font-semibold text-sm text-slate-800">{faq.question}</span>
                        <ChevronDown
                          className="w-4 h-4 flex-shrink-0 text-slate-400 transition-transform"
                          style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0)" }}
                        />
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
            )}
          </div>

          {/* Right — sidebar */}
          <div>
            <VenueSidebar venue={venue} />
          </div>
        </div>
      </div>

      {/* Similar Venues */}
      <SimilarVenues venues={similar} />

      {/* Stripe Payment Verification Modal Overlay */}
      {(verifyingPayment || paymentSuccess) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-2xl border border-slate-100 flex flex-col items-center">
            {verifyingPayment ? (
              <>
                <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 mb-4">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Verifying Payment...</h3>
                <p className="text-sm text-slate-500">Please do not close this window or click back.</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 animate-bounce">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Payment Confirmed!</h3>
                <p className="text-sm text-slate-500 mb-6">Your booking is now confirmed. You can view all details in your dashboard.</p>
                <Link
                  href="/dashboard"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-full text-sm transition-colors text-center block shadow-md"
                >
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
