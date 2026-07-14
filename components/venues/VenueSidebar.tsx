/**
 * 🎓 VENUE SIDEBAR — Updated with BookingForm
 * 
 * BEFORE: Had a static enquiry form that didn't do anything
 * AFTER:  Integrates the real BookingForm with calendar + live pricing
 * 
 * The sidebar has two sections:
 * 1. Pricing Info Card — shows local and destination prices
 * 2. BookingForm — the interactive booking flow
 */

"use client";

import { AlertTriangle } from "lucide-react";
import type { Venue } from "@/lib/venues-data";
import BookingForm from "@/components/booking/BookingForm";
import { useCurrency } from "@/lib/CurrencyContext";
import { convertPriceString } from "@/lib/currency";

interface VenueSidebarProps {
  venue: Venue;
  type?: string | null;
}

export default function VenueSidebar({ venue, type }: VenueSidebarProps) {
  const { currency } = useCurrency();
  const bookingTypes = [];
  
  if (type === "room") {
    bookingTypes.push({ value: "room", label: "Book Rooms" });
  } else {
    // Default to venue booking only, completely removing the tab toggle
    bookingTypes.push({ value: "venue", label: "Book Venue" });
  }
  return (
    <div className="sticky top-24 flex flex-col gap-6">
      
      {/* Pricing Information Card */}
      <div className="bg-white/60 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] overflow-hidden p-6">
        <h3 className="font-bold text-slate-900 mb-5 text-lg">Starting Price</h3>
        <div className="flex flex-col gap-4">
          {venue.pricePerPlateVeg && (
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-4">
              <div>
                <span className="text-2xl font-bold text-slate-900">
                  {convertPriceString(venue.pricePerPlateVeg, currency)}
                </span>
                <span className="text-xs text-slate-500 ml-1 font-medium">per plate</span>
              </div>
              <span className="text-xs font-bold tracking-widest uppercase text-slate-400">Veg</span>
            </div>
          )}
          {venue.pricePerPlateNonVeg && (
            <div className="flex items-center justify-between pb-2">
              <div>
                <span className="text-2xl font-bold text-slate-900">
                  {convertPriceString(venue.pricePerPlateNonVeg, currency)}
                </span>
                <span className="text-xs text-slate-500 ml-1 font-medium">per plate</span>
              </div>
              <span className="text-xs font-bold tracking-widest uppercase text-slate-400">Non-Veg</span>
            </div>
          )}
        </div>

        {venue.rentalCost && (
          <div className="mt-4 pt-4 border-t border-slate-200/50">
            <h3 className="font-bold text-slate-900 mb-3 text-lg">Venue Rental</h3>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-slate-900">
                {convertPriceString(venue.rentalCost, currency)}
              </span>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-500">/day for {venue.rooms || 1} rooms</p>
                <p className="text-[10px] text-slate-400 font-medium">(incl. Rooms + Venue)</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── BOOKING FORM ─── */}
      {/**
       * 🎓 This is where the old static enquiry form used to be.
       * Now it's a real interactive booking form with:
       * - Calendar date picker
       * - Live price calculation
       * - Booking creation API call
       */}
      <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-[24px] p-6">
        <h3 className="font-bold text-slate-900 text-lg mb-5">
          Book {venue.name}
        </h3>
        <BookingForm
          providerId={venue.id}
          providerName={venue.name}
          bookingTypes={bookingTypes}
          pricePerPlateVeg={venue.pricePerPlateVeg}
          pricePerPlateNonVeg={venue.pricePerPlateNonVeg}
          rentalCost={venue.rentalCost}
          pricePerRoom={Math.round(
            (parseInt(venue.rentalCost?.replace(/[₹,\s]/g, "") || "0", 10) || 0) /
            (venue.rooms || 1)
          )}
          minGuests={venue.minGuests}
          maxGuests={venue.maxGuests}
          totalRooms={venue.rooms}
        />
      </div>

      {/* Demand badge */}
      <div className="flex items-center justify-center gap-2">
        <span className="bg-primary-100 text-primary-800 text-[10px] font-bold px-2 py-0.5 rounded border border-primary-200">
          In High Demand
        </span>
        <span className="text-xs font-semibold text-slate-600">
          12 enquiries last week
        </span>
      </div>

      <button className="flex items-center justify-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors">
        <AlertTriangle className="w-3.5 h-3.5" />
        Report an Issue
      </button>
    </div>
  );
}
