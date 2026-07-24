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

import { useEffect, useState } from "react";
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
  const [recentEnquiries, setRecentEnquiries] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/bookings/demand?providerId=${encodeURIComponent(venue.id)}`)
      .then((res) => res.json())
      .then((data) => setRecentEnquiries(typeof data.count === "number" ? data.count : null))
      .catch(() => setRecentEnquiries(null));
  }, [venue.id]);

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
      {(venue.pricePerPlateVeg || venue.pricePerPlateNonVeg || venue.rentalCost || venue.price) && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden p-6">
          <h3 className="font-bold text-slate-900 mb-5 text-lg">Starting Price</h3>
          
          {(venue.pricePerPlateVeg || venue.pricePerPlateNonVeg) && (
            <div className="flex flex-col gap-4">
              {venue.pricePerPlateVeg && (
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
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
          )}

          {(venue.rentalCost || venue.price) && (
            <div className={`mt-4 ${venue.pricePerPlateVeg || venue.pricePerPlateNonVeg ? 'pt-4 border-t border-slate-200' : ''}`}>
              <h3 className="font-bold text-slate-900 mb-3 text-lg">Venue Rental</h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-slate-900">
                  {convertPriceString((venue.rentalCost || venue.price)!, currency)}
                </span>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-500">/day for {venue.rooms || 1} rooms</p>
                  <p className="text-[10px] text-slate-400 font-medium">(incl. Rooms + Venue)</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── BOOKING FORM ─── */}
      {/**
       * 🎓 This is where the old static enquiry form used to be.
       * Now it's a real interactive booking form with:
       * - Calendar date picker
       * - Live price calculation
       * - Booking creation API call
       */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="font-bold text-slate-900 text-lg mb-5">
          Book {venue.name}
        </h3>
        <BookingForm
          providerId={venue.id}
          providerName={venue.name}
          bookingTypes={bookingTypes}
          pricePerPlateVeg={venue.pricePerPlateVeg}
          pricePerPlateNonVeg={venue.pricePerPlateNonVeg}
          rentalCost={venue.rentalCost || venue.price}
          pricePerRoom={Math.round(
            (parseInt((venue.rentalCost || venue.price)?.toString().replace(/[^0-9]/g, "") || "0", 10) || 0) /
            (venue.rooms || 1)
          )}
          minGuests={venue.minGuests}
          maxGuests={venue.maxGuests}
          totalRooms={venue.rooms}
        />
      </div>

      {currency !== "INR" && (
        <p className="text-[11px] text-slate-400 text-center -mt-2">
          Prices shown in {currency} for reference — you&apos;ll be charged in INR at checkout.
        </p>
      )}

      {/* Demand badge — real count of bookings made in the last 7 days */}
      {recentEnquiries !== null && recentEnquiries > 0 && (
        <div className="flex items-center justify-center gap-2">
          <span className="bg-primary-100 text-primary-800 text-[10px] font-bold px-2 py-0.5 rounded border border-primary-200">
            In High Demand
          </span>
          <span className="text-xs font-semibold text-slate-600">
            {recentEnquiries} {recentEnquiries === 1 ? "enquiry" : "enquiries"} last week
          </span>
        </div>
      )}

      <a
        href={`mailto:hello@soulswed.com?subject=${encodeURIComponent(
          `Reporting an issue with ${venue.name}`
        )}&body=${encodeURIComponent(`Venue ID: ${venue.id}\n\nPlease describe the issue:\n`)}`}
        className="flex items-center justify-center gap-1.5 text-xs font-semibold text-red-500 hover:opacity-70 transition-opacity"
      >
        <AlertTriangle className="w-3.5 h-3.5" />
        Report an Issue
      </a>
    </div>
  );
}
