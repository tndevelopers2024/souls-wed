/**
 * 🎓 BOOKING FORM COMPONENT
 * 
 * This is the main booking form that replaces the static enquiry form
 * in VenueSidebar. It combines:
 * 
 * 1. BookingCalendar — for date selection
 * 2. Guest/Room count inputs
 * 3. LIVE price calculation
 * 4. Function type and time selectors
 * 5. "Book Now" button that creates a pending booking
 * 
 * LIVE PRICE CALCULATION:
 * For Venues:  totalAmount = guestCount × pricePerPlate
 * For Rooms:   totalAmount = roomCount × pricePerNight × numberOfNights
 * 
 * The advance amount (30%) updates automatically as inputs change.
 * This gives the user instant feedback on cost.
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { formatAsCurrency, CURRENCIES } from "@/lib/currency";
import {
  Users,
  BedDouble,
  CalendarDays,
  IndianRupee,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Phone,
  User,
} from "lucide-react";
import BookingCalendar from "./BookingCalendar";

// ─── Types ───────────────────────────────────────────────────
interface BookingFormProps {
  venueId: string;
  venueName: string;
  /** Price per veg plate (e.g., "₹5,695") — we parse the number from this */
  pricePerPlateVeg?: string;
  /** Price per non-veg plate */
  pricePerPlateNonVeg?: string;
  /** Rental cost per day */
  rentalCost?: string;
  /** Price per room per night */
  pricePerRoom?: number;
  /** Min guests allowed */
  minGuests: number;
  /** Max guests allowed */
  maxGuests: number;
  /** Number of rooms available */
  totalRooms: number;
}

/** Parse a price string like "₹5,695" or "₹3,35,840" to a number */
function parsePrice(priceStr: string | undefined): number {
  if (!priceStr) return 0;
  // Remove ₹, commas, spaces, and any non-digit characters
  const cleaned = priceStr.replace(/[₹,\s]/g, "");
  return parseInt(cleaned, 10) || 0;
}


/** Calculate number of nights between two date strings */
function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// ─── Component ───────────────────────────────────────────────
export default function BookingForm({
  venueId,
  venueName,
  pricePerPlateVeg,
  pricePerPlateNonVeg,
  rentalCost,
  pricePerRoom,
  minGuests,
  maxGuests,
  totalRooms,
}: BookingFormProps) {
  const router = useRouter();

  // ─── Booking type toggle ───
  const [bookingType, setBookingType] = useState<"venue" | "room">("venue");

  // ─── Calendar state ───
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [loadingDates, setLoadingDates] = useState(false);

  // ─── Payment & Currency State ───
  const [currency, setCurrency] = useState<string>("INR");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  // ─── Form fields ───
  const [guestCount, setGuestCount] = useState<number>(minGuests || 50);
  const [roomCount, setRoomCount] = useState<number>(1);
  const [menuType, setMenuType] = useState<"veg" | "nonveg">("veg");
  const [functionType, setFunctionType] = useState("wedding");
  const [functionTime, setFunctionTime] = useState("evening");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true);

  // ─── UI state ───
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  // ─── Check session on mount ───
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setIsLoggedIn(data.authenticated === true))
      .catch(() => setIsLoggedIn(false));
  }, []);

  // ─── Fetch availability when month changes ───
  const fetchAvailability = async (yearMonth: string) => {
    setLoadingDates(true);
    try {
      const res = await fetch(
        `/api/venues/${venueId}/availability?month=${yearMonth}`
      );
      if (res.ok) {
        const data = await res.json();
        setBookedDates(data.bookedDates || []);
      }
    } catch (err) {
      console.error("Failed to fetch availability:", err);
    } finally {
      setLoadingDates(false);
    }
  };

  // ─── LIVE PRICE CALCULATION ───
  /**
   * 🎓 useMemo recalculates ONLY when its dependencies change.
   * Without useMemo, this calculation would run on EVERY render.
   * With useMemo, it only recalculates when guestCount, menuType, etc. change.
   */
  const priceBreakdown = useMemo(() => {
    if (bookingType === "venue") {
      // Venue: guestCount × pricePerPlate
      const perPlate = menuType === "veg"
        ? parsePrice(pricePerPlateVeg)
        : parsePrice(pricePerPlateNonVeg);
      const total = guestCount * perPlate;
      const advance = Math.round(total * 0.3);
      return {
        perUnit: perPlate,
        unitLabel: "per plate",
        quantity: guestCount,
        quantityLabel: "guests",
        nights: 0,
        total,
        advance,
      };
    } else {
      // Room: roomCount × pricePerNight × nights
      const perNight = pricePerRoom || Math.round(parsePrice(rentalCost) / (totalRooms || 1));
      const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 1;
      const total = roomCount * perNight * nights;
      const advance = Math.round(total * 0.3);
      return {
        perUnit: perNight,
        unitLabel: "per room/night",
        quantity: roomCount,
        quantityLabel: "rooms",
        nights,
        total,
        advance,
      };
    }
  }, [bookingType, guestCount, roomCount, menuType, checkIn, checkOut,
      pricePerPlateVeg, pricePerPlateNonVeg, pricePerRoom, rentalCost, totalRooms]);

  // ─── Submit handler ───
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate date selection
    if (bookingType === "venue" && !selectedDate) {
      setError("Please select an event date on the calendar.");
      return;
    }
    if (bookingType === "room" && (!checkIn || !checkOut)) {
      setError("Please select check-in and check-out dates.");
      return;
    }
    if (priceBreakdown.total <= 0) {
      setError("Unable to calculate price. Please check your selections.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          venueId,
          venueName,
          bookingType,
          eventDate: bookingType === "venue" ? selectedDate : undefined,
          checkIn: bookingType === "room" ? checkIn : undefined,
          checkOut: bookingType === "room" ? checkOut : undefined,
          guestCount: bookingType === "venue" ? guestCount : undefined,
          roomCount: bookingType === "room" ? roomCount : undefined,
          totalAmount: priceBreakdown.total,
          advanceAmount: priceBreakdown.advance,
          currency,
          functionType,
          functionTime,
          specialRequests,
          notifyWhatsapp,
          userPhone: phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ? `${data.message} (${data.error})` : data.message || "Failed to create booking.");
      }

      setBookingId(data.booking.id);
      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Success state ───
  if (success && bookingId) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-8 px-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 animate-bounce">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">
          Booking Created!
        </h3>
        <p className="text-sm text-slate-500 mb-1">
          Your booking is <span className="font-bold text-amber-600">pending payment</span>.
        </p>
        <p className="text-xs text-slate-400 mb-6">
          Pay {formatAsCurrency(priceBreakdown.advance, currency)} advance to confirm.
        </p>

        <button
          onClick={() => router.push(`/dashboard`)}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-full text-sm transition-colors shadow-sm"
        >
          Go to Dashboard to Pay
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* ─── Booking Type Toggle ─── */}
      <div className="flex bg-slate-100 p-1 rounded-2xl relative">
        <button
          type="button"
          onClick={() => setBookingType("venue")}
          className={`flex-1 text-center py-2.5 text-xs font-bold transition-colors rounded-xl ${
            bookingType === "venue"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Book Venue
        </button>
        <button
          type="button"
          onClick={() => setBookingType("room")}
          className={`flex-1 text-center py-2.5 text-xs font-bold transition-colors rounded-xl ${
            bookingType === "room"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Book Rooms
        </button>
      </div>

      {/* ─── Calendar ─── */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4">
        <h4 className="text-xs font-bold text-slate-600 mb-3 flex items-center gap-1.5">
          <CalendarDays className="w-3.5 h-3.5 text-orange-500" />
          {bookingType === "venue" ? "Select Event Date" : "Select Stay Dates"}
        </h4>

        {loadingDates && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
          </div>
        )}

        <BookingCalendar
          mode={bookingType === "venue" ? "single" : "range"}
          bookedDates={bookedDates}
          venueId={venueId}
          onDateSelect={(date) => setSelectedDate(date)}
          onRangeSelect={(ci, co) => {
            setCheckIn(ci);
            setCheckOut(co);
          }}
          onMonthChange={fetchAvailability}
        />

        {/* Show selected dates */}
        {bookingType === "venue" && selectedDate && (
          <p className="text-xs font-semibold text-orange-600 mt-3">
            Event: {new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        )}
        {bookingType === "room" && checkIn && checkOut && (
          <p className="text-xs font-semibold text-orange-600 mt-3">
            {new Date(checkIn).toLocaleDateString("en-US", { day: "numeric", month: "short" })} → {new Date(checkOut).toLocaleDateString("en-US", { day: "numeric", month: "short" })} ({priceBreakdown.nights} night{priceBreakdown.nights > 1 ? "s" : ""})
          </p>
        )}
      </div>

      {/* ─── Guest / Room count ─── */}
      <div className="grid grid-cols-2 gap-3">
        {bookingType === "venue" ? (
          <>
            {/* Guest count */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-orange-500" /> Guests
              </label>
              <input
                type="number"
                min={minGuests}
                max={maxGuests}
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-orange-400 transition-colors"
              />
              <span className="text-[10px] text-slate-400">{minGuests}–{maxGuests} capacity</span>
            </div>

            {/* Menu type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600">Menu Type</label>
              <select
                value={menuType}
                onChange={(e) => setMenuType(e.target.value as "veg" | "nonveg")}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-orange-400 transition-colors appearance-none"
              >
                <option value="veg">Vegetarian</option>
                <option value="nonveg">Non-Vegetarian</option>
              </select>
            </div>
          </>
        ) : (
          <>
            {/* Room count */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5 text-orange-500" /> Rooms
              </label>
              <input
                type="number"
                min={1}
                max={totalRooms}
                value={roomCount}
                onChange={(e) => setRoomCount(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-orange-400 transition-colors"
              />
              <span className="text-[10px] text-slate-400">Max {totalRooms} rooms</span>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-orange-500" /> Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter contact number"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-orange-400 transition-colors"
              />
            </div>
          </>
        )}
      </div>

      {/* ─── Function type + time (venue mode only) ─── */}
      {bookingType === "venue" && (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-600">Function</label>
            <select
              value={functionType}
              onChange={(e) => setFunctionType(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-orange-400 transition-colors appearance-none"
            >
              <option value="wedding">Wedding</option>
              <option value="pre-wedding">Pre-Wedding</option>
              <option value="reception">Reception</option>
              <option value="engagement">Engagement</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-600">Time</label>
            <select
              value={functionTime}
              onChange={(e) => setFunctionTime(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-orange-400 transition-colors appearance-none"
            >
              <option value="evening">Evening</option>
              <option value="day">Day</option>
              <option value="fullday">Full Day</option>
            </select>
          </div>
        </div>
      )}

      {/* ─── Phone for venue mode ─── */}
      {bookingType === "venue" && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-orange-500" /> Contact Phone
          </label>
          <input
            type="tel"
            placeholder="Enter contact number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-orange-400 transition-colors"
          />
        </div>
      )}

      {/* ─── Special requests ─── */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-600">Special Requests (optional)</label>
        <textarea
          rows={2}
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          placeholder="Add any special requirements or notes here..."
          maxLength={1000}
          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-orange-400 transition-colors resize-none"
        />
      </div>

      {/* ─── WhatsApp toggle ─── */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700">Notify on WhatsApp</span>
        <button
          type="button"
          onClick={() => setNotifyWhatsapp(!notifyWhatsapp)}
          className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
            notifyWhatsapp ? "bg-green-500" : "bg-slate-300"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white transition-transform ${
              notifyWhatsapp ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* ─── LIVE PRICE BREAKDOWN ─── */}
      <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5 text-orange-500" /> Price Breakdown
          </h4>
          <div className="flex bg-white rounded-lg border border-orange-200 p-1">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="text-[10px] font-bold text-slate-700 bg-transparent outline-none cursor-pointer px-2 py-0.5 border-none rounded"
            >
              {Object.keys(CURRENCIES).map((c) => (
                <option key={c} value={c}>
                  {c} ({CURRENCIES[c].symbol.trim()})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">
              {formatAsCurrency(priceBreakdown.perUnit, currency)} {priceBreakdown.unitLabel} × {priceBreakdown.quantity} {priceBreakdown.quantityLabel}
              {priceBreakdown.nights > 0 ? ` × ${priceBreakdown.nights} night${priceBreakdown.nights > 1 ? "s" : ""}` : ""}
            </span>
            <span className="font-bold text-slate-800">
              {formatAsCurrency(priceBreakdown.total, currency)}
            </span>
          </div>
          <div className="border-t border-orange-200 pt-2 flex justify-between">
            <span className="text-slate-600 font-semibold">Advance (30%)</span>
            <span className="font-black text-orange-600 text-base">
              {formatAsCurrency(priceBreakdown.advance, currency)}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Pay {formatAsCurrency(priceBreakdown.advance, currency)} now to confirm. Balance {formatAsCurrency(priceBreakdown.total - priceBreakdown.advance, currency)} payable at venue.
          </p>
        </div>
      </div>

      {/* ─── Error message ─── */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2 items-start text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* ─── Submit button ─── */}
      {!isLoggedIn ? (
        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-full text-sm transition-colors shadow-sm"
          >
            Book Now
          </button>
        </div>
      ) : (
        <button
          type="submit"
          disabled={submitting || loadingDates}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-full text-sm transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Creating Booking...
            </>
          ) : (
            `Book Now — Pay ${formatAsCurrency(priceBreakdown.advance, currency)} Advance`
          )}
        </button>
      )}

      <p className="text-[10px] text-slate-500 text-center mt-3">
        Secure booking • 30% advance • Balance at venue
      </p>
    </form>
  );
}
