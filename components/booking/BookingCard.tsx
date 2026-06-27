/**
 * 🎓 BOOKING CARD COMPONENT
 * 
 * Displays a single booking in the user or vendor dashboard.
 * Includes Razorpay integration to pay for pending bookings.
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
  AlertCircle 
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
      // Step 1: Create Order (Stripe)
      const res = await fetch("/api/bookings/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking._id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to initiate payment");

      // Step 2: Redirect directly to Stripe Checkout
      window.location.href = data.url;
    } catch (err: any) {
      setPaymentError(err.message || "Failed to initiate payment");
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
        body: JSON.stringify({ bookingId: booking._id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to cancel booking");

      setIsDeleted(true);
      router.refresh();
    } catch (err: any) {
      setPaymentError(err.message || "Failed to cancel booking");
    } finally {
      setDeleting(false);
    }
  };



  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row">
      {/* Left: Venue Image */}
      {venueImage && (
        <div className="relative w-full md:w-56 h-48 md:h-auto flex-shrink-0 bg-slate-100">
          <img
            src={venueImage}
            alt={booking.venueName}
            className="w-full h-full object-cover"
          />
          {/* Status badge on mobile overlay */}
          <div className="absolute top-3 right-3 md:hidden">
            {getStatusBadge()}
          </div>
        </div>
      )}

      {/* Right: Content */}
      <div className="flex-grow flex flex-col justify-between">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-start justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">{booking.venueName}</h3>
            <p className="text-xs text-slate-500 font-mono">ID: {booking._id.substring(18)}</p>
          </div>
          <div className="hidden md:block">
            {getStatusBadge()}
          </div>
        </div>

        {/* Body */}
        <div className="p-5 flex-grow">
          <div className="flex flex-col gap-3">
            {renderDate()}
            
            <div className="flex items-center gap-4">
              {booking.bookingType === "venue" ? (
                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                  <Users className="w-4 h-4 text-orange-500" />
                  <span>{booking.guestCount} Guests</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                  <BedDouble className="w-4 h-4 text-orange-500" />
                  <span>{booking.roomCount} Rooms</span>
                </div>
              )}
              
              {booking.functionType && (
                <div className="flex items-center gap-1.5 text-sm text-slate-600 capitalize">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span>{booking.functionType}</span>
                </div>
              )}
            </div>

            {/* User Details (For Vendor View) */}
            {isVendor && (
              <div className="mt-3 bg-orange-50 rounded-xl p-3 border border-orange-100">
                <p className="text-xs font-bold text-slate-700 mb-1">Customer Details</p>
                <p className="text-sm font-semibold text-slate-800">{booking.userName}</p>
                <p className="text-xs text-slate-600">{booking.userPhone} • {booking.userEmail}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer / Pricing */}
        <div className="border-t border-slate-100 p-5 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs text-slate-500">Total Amount</p>
                <p className="font-bold text-slate-800">
                  {formatAsCurrency(booking.totalAmount, booking.currency || "INR")}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Advance Paid</p>
                <p className={`font-bold ${booking.status === 'confirmed' ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {booking.status === 'confirmed' 
                    ? formatAsCurrency(booking.advanceAmount, booking.currency || "INR")
                    : formatAsCurrency(0, booking.currency || "INR")
                  }
                </p>
              </div>
            </div>

            {/* Action Buttons for User */}
            {!isVendor && (booking.status === "pending" || booking.status === "confirmed") && (
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  disabled={deleting}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors disabled:opacity-50"
                >
                  {deleting ? "Cancelling..." : "Cancel"}
                </button>
                {booking.status === "pending" && (
                  <button
                    onClick={handlePayAdvance}
                    disabled={deleting}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors disabled:opacity-50 shadow-sm"
                  >
                    Pay Advance
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Payment Error */}
          {paymentError && (
            <div className="mt-3 flex items-start gap-1.5 text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p>{paymentError}</p>
            </div>
          )}


        </div>
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
