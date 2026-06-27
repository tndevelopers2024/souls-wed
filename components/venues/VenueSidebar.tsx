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

interface VenueSidebarProps {
  venue: Venue;
}

export default function VenueSidebar({ venue }: VenueSidebarProps) {
  return (
    <div className="sticky top-24 flex flex-col gap-6">
      
      {/* Pricing Information Card */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {/* Local Price */}
        <div className="p-5">
          <h3 className="font-bold text-slate-800 mb-3">Starting Price</h3>
          <div className="flex flex-col gap-3">
            {venue.pricePerPlateVeg && (
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xl font-bold text-orange-600">{venue.pricePerPlateVeg}</span>
                  <span className="text-xs text-slate-500 ml-1">per plate</span>
                </div>
                <span className="text-sm font-semibold text-slate-700">Veg</span>
              </div>
            )}
            {venue.pricePerPlateNonVeg && (
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-xl font-bold text-orange-600">{venue.pricePerPlateNonVeg}</span>
                  <span className="text-xs text-slate-500 ml-1">per plate</span>
                </div>
                <span className="text-sm font-semibold text-slate-700">Non-Veg</span>
              </div>
            )}
          </div>
        </div>

        {/* Destination Price */}
        {venue.rentalCost && (
          <div className="bg-orange-50/50 p-5 border-t border-slate-100">
            <h3 className="font-bold text-slate-800 mb-2">Venue Rental</h3>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-slate-800">{venue.rentalCost}</span>
              <div className="text-right">
                <p className="text-xs font-medium text-slate-600">/day for {venue.rooms || 1} rooms</p>
                <p className="text-[10px] text-slate-400">(incl. Rooms + Venue)</p>
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
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="font-bold text-slate-800 text-sm mb-4">
          Book {venue.name}
        </h3>
        <BookingForm
          venueId={venue.id}
          venueName={venue.name}
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
        <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded border border-orange-200">
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
