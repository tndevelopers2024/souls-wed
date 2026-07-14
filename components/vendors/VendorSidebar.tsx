"use client";

import { AlertTriangle } from "lucide-react";
import type { PublicVendor } from "@/components/vendors/PublicVendorDirectory";
import BookingForm from "@/components/booking/BookingForm";
import { formatAsCurrency } from "@/lib/currency";
import { useCurrency } from "@/lib/CurrencyContext";

interface VendorSidebarProps {
  vendor: PublicVendor;
}

export default function VendorSidebar({ vendor }: VendorSidebarProps) {
  const { currency } = useCurrency();
  
  const cat = vendor.category.toLowerCase();
  const isVenue = cat.includes("venue") || cat.includes("banquet");
  const isRoom = cat.includes("room") || cat.includes("accommodation");
  const isCaterer = cat.includes("cater");
  const isPerPlate = isVenue || isCaterer;

  // Set up BookingForm props based on category
  let bookingTypes = [{ value: "vendor", label: `Book ${vendor.category}` }];
  let bookingProps: any = {
    advancePercentage: vendor.advancePercentage || 30,
  };

  if (isPerPlate) {
    bookingTypes = [{ value: "venue", label: `Book ${vendor.category}` }];
    bookingProps.pricePerPlateVeg = (vendor.priceFrom || 50000).toString();
    bookingProps.pricePerPlateNonVeg = (Math.round((vendor.priceFrom || 50000) * 1.2)).toString();
    bookingProps.rentalCost = (vendor.priceFrom ? vendor.priceFrom * 5 : 250000).toString();
  } else if (isRoom) {
    bookingTypes = [{ value: "room", label: `Book ${vendor.category}` }];
    bookingProps.pricePerRoom = vendor.priceFrom || 5000;
    bookingProps.totalRooms = 10; // Default generic room count
  } else {
    // For Planners, Decorators, etc.
    bookingTypes = [{ value: "vendor", label: `Book ${vendor.category}` }];
    bookingProps.fixedPrice = vendor.priceFrom || 25000;
  }

  return (
    <div className="sticky top-24 flex flex-col gap-6">
      
      {/* Pricing Information Card */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5">
          <h3 className="font-bold text-slate-800 mb-3">Starting Price</h3>
          
          {isPerPlate ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xl font-bold text-primary-600">
                    {vendor.priceFrom ? formatAsCurrency(vendor.priceFrom, currency) : "On request"}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">per plate</span>
                </div>
                <span className="text-sm font-semibold text-slate-700">Veg</span>
              </div>
              
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-xl font-bold text-primary-600">
                    {vendor.priceFrom ? formatAsCurrency(Math.round(vendor.priceFrom * 1.2), currency) : "On request"}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">per plate</span>
                </div>
                <span className="text-sm font-semibold text-slate-700">Non-Veg</span>
              </div>
            </div>
          ) : isRoom ? (
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xl font-bold text-primary-600">
                  {vendor.priceFrom ? formatAsCurrency(vendor.priceFrom, currency) : "On request"}
                </span>
                <span className="text-xs text-slate-500 ml-1">per room/night</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xl font-bold text-primary-600">
                  {vendor.priceFrom ? formatAsCurrency(vendor.priceFrom, currency) : "On request"}
                </span>
                <span className="text-xs text-slate-500 ml-1">fixed fee</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Destination Price (Only for Venues) */}
      {isVenue && (
        <div className="bg-primary-50/50 p-5 border-t border-slate-100 border border-slate-200 rounded-xl mt-4 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-2">Venue Rental</h3>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-slate-800">
              {vendor.priceFrom ? formatAsCurrency(vendor.priceFrom * 5, currency) : "On request"}
            </span>
            <div className="text-right">
              <p className="text-xs font-medium text-slate-600">/day for 1 rooms</p>
              <p className="text-[10px] text-slate-400">(incl. Rooms + Venue)</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── BOOKING FORM ─── */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="font-bold text-slate-800 text-sm mb-4">
          Book {vendor.businessName || vendor.name}
        </h3>
        <BookingForm
          providerId={vendor._id}
          providerName={vendor.businessName || vendor.name}
          bookingTypes={bookingTypes}
          {...bookingProps}
        />
      </div>

      {/* Demand badge */}
      <div className="flex items-center justify-center gap-2">
        <span className="bg-primary-100 text-primary-800 text-[10px] font-bold px-2 py-0.5 rounded border border-primary-200">
          In High Demand
        </span>
        <span className="text-xs font-semibold text-slate-600">
          {Math.floor(Math.random() * 15) + 5} enquiries last week
        </span>
      </div>

      <button className="flex items-center justify-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors">
        <AlertTriangle className="w-3.5 h-3.5" />
        Report an Issue
      </button>
    </div>
  );
}
