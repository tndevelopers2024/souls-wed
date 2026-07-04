/**
 * 🎓 BOOKING CARD COMPONENT
 * 
 * Displays a single booking in the user or vendor dashboard.
 * Includes Stripe payment integration for pending bookings.
 */

"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { 
  CalendarDays, 
  MapPin, 
  Users, 
  BedDouble, 
  Clock, 
  AlertCircle,
  Heart
} from "lucide-react";
import { useRouter } from "next/navigation";
import { formatAsCurrency } from "@/lib/currency";
import { getVenueById } from "@/lib/venues-data";

interface BookingCardProps {
  booking: any;
  isVendor?: boolean;
}

export default function BookingCard({ booking, isVendor = false }: BookingCardProps) {
  const router = useRouter();
  const venueDetails = getVenueById(booking.venueId);
  const venueImage = venueDetails?.image;
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (isDeleted) return null;

  // ─── Format Dates ───
  const renderDate = () => {
    if (booking.bookingType === "venue") {
      return (
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <CalendarDays className="w-4 h-4 text-orange-500" />
          <span className="font-medium">
            {format(new Date(booking.eventDate), "EEE, MMM d, yyyy")}
          </span>
          {booking.functionTime && (
            <span className="text-slate-400 capitalize">({booking.functionTime})</span>
          )}
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <CalendarDays className="w-4 h-4 text-orange-500" />
          <span className="font-medium">
            {format(new Date(booking.checkIn), "MMM d")} → {format(new Date(booking.checkOut), "MMM d, yyyy")}
          </span>
        </div>
      );
    }
  };

  // ─── Status Badge ───
  const getStatusBadge = () => {
    switch (booking.status) {
      case "pending":
        return <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-bold">Pending Payment</span>;
      case "confirmed":
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-bold">Confirmed</span>;
      case "completed":
        return <span className="bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-full text-xs font-bold">Completed</span>;
      case "cancelled":
        return <span className="bg-red-100 text-red-800 border border-red-200 px-2.5 py-1 rounded-full text-xs font-bold">Cancelled</span>;
      default:
        return null;
    }
  };

  // ─── Handle Payment Flow ───
  const handlePayAdvance = async () => {
    setPaymentError(null);
    try {
      const res = await fetch("/api/bookings/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking._id ?? booking.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to initiate payment");

      if (!data.url) throw new Error("No payment URL returned from server.");

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err: unknown) {
      setPaymentError(err instanceof Error ? err.message : "Failed to initiate payment");
    }
  };

  const handleDeleteBooking = async () => {
    setShowCancelConfirm(false);
    setDeleting(true);
    setPaymentError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking._id ?? booking.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to cancel booking");

      setIsDeleted(true);
      router.refresh();
    } catch (err: unknown) {
      setPaymentError(err instanceof Error ? err.message : "Failed to cancel booking");
    } finally {
      setDeleting(false);
    }
  };



  return (
    <div className="relative rounded-[32px] overflow-hidden shadow-sm border border-slate-100 w-full h-[540px] cursor-pointer group bg-white [transform:translateZ(0)]">
      {/* Full Background Image */}
      {venueImage ? (
        <img
          src={venueImage}
          alt={booking.venueName}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-slate-800" />
      )}

      {/* Status Badge top-left */}
      <div className="absolute top-4 left-4 z-20">
        {getStatusBadge()}
      </div>

      {/* Heart pill top-right */}
      <button className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-sm" onClick={(e) => e.preventDefault()}>
        <Heart className="w-4 h-4" />
      </button>

      {/* Progressive frosted blur - Made taller to fit content */}
      <div className="absolute inset-x-0 bottom-0 h-[85%] z-10 pointer-events-none">
        {[ { blur: 1, solid: 55, fade: 100 }, { blur: 3, solid: 42, fade: 78 }, { blur: 6, solid: 28, fade: 58 }, { blur: 12, solid: 16, fade: 40 }, { blur: 24, solid: 6, fade: 24 } ].map((l, idx) => (
          <div key={idx} className="absolute inset-0" style={{ backdropFilter: `blur(${l.blur}px)`, WebkitBackdropFilter: `blur(${l.blur}px)`, maskImage: `linear-gradient(to top, black ${l.solid}%, transparent ${l.fade}%)`, WebkitMaskImage: `linear-gradient(to top, black ${l.solid}%, transparent ${l.fade}%)` }} />
        ))}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 45%, rgba(255,255,255,0.5) 65%, rgba(255,255,255,0.1) 85%, rgba(255,255,255,0) 100%)" }} />
      </div>

      {/* Content Area */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-5 pt-6 pb-5 flex flex-col h-full justify-end">
        
        <div className="mb-3">
          <p className="text-xs text-slate-600 font-mono mb-1 bg-white/50 w-fit px-2 py-0.5 rounded-md">ID: {booking._id.substring(18)}</p>
          <h3 className="text-2xl font-bold leading-snug text-slate-900 line-clamp-2" style={{ fontFamily: "var(--font-heading)" }}>
            {booking.venueName}
          </h3>
        </div>

        <div className="flex flex-col gap-2.5 mb-4 bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/40 shadow-sm">
          {renderDate()}
          <div className="flex items-center gap-4">
            {booking.bookingType === "venue" ? (
              <div className="flex items-center gap-1.5 text-sm text-slate-700 font-medium">
                <Users className="w-4 h-4 text-orange-500" />
                <span>{booking.guestCount} Guests</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-sm text-slate-700 font-medium">
                <BedDouble className="w-4 h-4 text-orange-500" />
                <span>{booking.roomCount} Rooms</span>
              </div>
            )}
            {booking.functionType && (
              <div className="flex items-center gap-1.5 text-sm text-slate-700 font-medium capitalize">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>{booking.functionType}</span>
              </div>
            )}
          </div>
        </div>

        {/* User Details (For Vendor View) */}
        {isVendor && (
          <div className="mb-4 bg-orange-50/80 backdrop-blur-sm rounded-xl p-3 border border-orange-200/50 shadow-sm">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Customer Details</p>
            <p className="text-sm font-bold text-slate-800">{booking.userName}</p>
            <p className="text-xs text-slate-600 font-medium mt-0.5">{booking.userPhone} • {booking.userEmail}</p>
          </div>
        )}

        <div className="flex items-end justify-between mt-1">
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <span className="text-[11px] font-medium text-slate-500 uppercase">Total</span>
              <span className="text-lg font-bold text-slate-900 leading-none">
                {formatAsCurrency(booking.totalAmount, booking.currency || "INR")}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[11px] font-medium text-slate-500 uppercase">Paid</span>
              <span className={`text-sm font-bold leading-none ${booking.status === 'confirmed' ? 'text-emerald-600' : 'text-slate-400'}`}>
                {booking.status === 'confirmed' 
                  ? formatAsCurrency(booking.advanceAmount, booking.currency || "INR")
                  : formatAsCurrency(0, booking.currency || "INR")
                }
              </span>
            </div>
          </div>

          {/* Action Buttons for User */}
          {!isVendor && (booking.status === "pending" || booking.status === "confirmed") && (
            <div className="flex flex-col gap-2">
              {booking.status === "pending" && (
                <button
                  onClick={handlePayAdvance}
                  disabled={deleting}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-full text-xs transition-colors shadow-sm disabled:opacity-50"
                >
                  Pay Advance
                </button>
              )}
              <button
                onClick={() => setShowCancelConfirm(true)}
                disabled={deleting}
                className="bg-white hover:bg-red-50 text-slate-700 hover:text-red-600 font-bold px-5 py-2 rounded-full text-[11px] transition-colors border border-slate-200 disabled:opacity-50"
              >
                {deleting ? "Cancelling..." : "Cancel Booking"}
              </button>
            </div>
          )}
        </div>

        {/* Payment Error */}
        {paymentError && (
          <div className="mt-3 flex items-start gap-1.5 text-[11px] font-medium text-red-600 bg-red-50/90 backdrop-blur-sm p-2 rounded-lg border border-red-100">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <p>{paymentError}</p>
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal via Portal */}
      {showCancelConfirm && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full mx-4 text-center shadow-2xl border border-slate-100 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4 animate-pulse">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">Cancel Booking?</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to cancel and delete this booking for <span className="font-bold text-slate-700">{booking.venueName}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-full text-xs transition-colors"
              >
                Keep Booking
              </button>
              <button
                onClick={handleDeleteBooking}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-full text-xs transition-colors shadow-sm shadow-red-200"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
