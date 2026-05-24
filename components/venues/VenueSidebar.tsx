"use client";

import { useState } from "react";
import { Mail, Phone, ChevronDown, Flag, AlertTriangle, MessageCircle } from "lucide-react";
import type { Venue } from "@/lib/venues-data";

interface VenueSidebarProps {
  venue: Venue;
}

export default function VenueSidebar({ venue }: VenueSidebarProps) {
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true);

  return (
    <div className="sticky top-24 flex flex-col gap-6">
      
      {/* Pricing Information Card */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {/* Local Price */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Local Price</h3>
            <button className="text-xs font-semibold text-orange-600 flex items-center gap-1 hover:text-orange-700">
              Pricing Info <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xl font-bold text-orange-600">{venue.pricePerPlateVeg || "₹1,500"}</span>
                <span className="text-xs text-slate-500 ml-1">per plate <span className="text-slate-400 font-light">(taxes extra)</span></span>
              </div>
              <span className="text-sm font-semibold text-slate-700">Veg price</span>
            </div>
            
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-xl font-bold text-orange-600">{venue.pricePerPlateNonVeg || "₹1,800"}</span>
                <span className="text-xs text-slate-500 ml-1">per plate <span className="text-slate-400 font-light">(taxes extra)</span></span>
              </div>
              <span className="text-sm font-semibold text-slate-700">Non Veg price</span>
            </div>
          </div>
        </div>

        {/* Destination Price */}
        <div className="bg-orange-50/50 p-5 border-t border-slate-100">
          <h3 className="font-bold text-slate-800 mb-2">Destination Price</h3>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-slate-800">{venue.rentalCost || "₹18.00 Lakhs"}</span>
            <div className="text-right">
              <p className="text-xs font-medium text-slate-600">/day for {venue.rooms || 71} rooms</p>
              <p className="text-[10px] text-slate-400">(incl. Rooms + 3 Meals + Venue)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-full text-sm flex items-center justify-center gap-2 transition-colors shadow-sm">
          <Mail className="w-4 h-4" />
          Send Message
        </button>
        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-full text-sm flex items-center justify-center gap-2 transition-colors shadow-sm">
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </button>
      </div>

      {/* Contact Form Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 text-sm mb-5">Hi {venue.name},</h3>
        
        <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="border-b border-slate-300 pb-1">
              <input type="text" placeholder="Full name*" className="w-full text-sm outline-none text-slate-800 placeholder-slate-400" required />
              <p className="text-[10px] text-red-500 mt-1">Required</p>
            </div>
            <div className="border-b border-slate-300 pb-1 flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded text-xs">
                <span className="text-lg">🇮🇳</span> +91
              </div>
              <input type="tel" placeholder="Phone*" className="w-full text-sm outline-none text-slate-800 placeholder-slate-400" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border-b border-slate-300 pb-2">
              <input type="email" placeholder="Email address" className="w-full text-sm outline-none text-slate-800 placeholder-slate-400" />
            </div>
            <div className="border-b border-slate-300 pb-2">
              <input type="text" placeholder="Function date*" className="w-full text-sm outline-none text-slate-800 placeholder-slate-400" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border-b border-slate-300 pb-2">
              <input type="number" placeholder="No of guests* (min 50)" className="w-full text-sm outline-none text-slate-800 placeholder-slate-400" min="50" required />
            </div>
            <div className="border-b border-slate-300 pb-2">
              <input type="number" placeholder="No of rooms" className="w-full text-sm outline-none text-slate-800 placeholder-slate-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-xs font-bold text-slate-800 mb-3">Function Type</p>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <input type="radio" name="functionType" value="pre-wedding" className="accent-orange-600" /> Pre-Wedding
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <input type="radio" name="functionType" value="wedding" className="accent-orange-600" defaultChecked /> Wedding
                </label>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 mb-3">Function Time</p>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <input type="radio" name="functionTime" value="evening" className="accent-orange-600" defaultChecked /> Evening
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <input type="radio" name="functionTime" value="day" className="accent-orange-600" /> Day
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-800">Notify me on Whatsapp</span>
            <button 
              type="button"
              className={`w-10 h-5 rounded-full p-0.5 transition-colors ${notifyWhatsapp ? 'bg-green-500' : 'bg-slate-300'}`}
              onClick={() => setNotifyWhatsapp(!notifyWhatsapp)}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${notifyWhatsapp ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-full text-sm transition-colors mt-2 shadow-sm">
            Check Availability & Prices
          </button>
          
          <p className="text-[10px] text-slate-500 text-center -mt-2">
            Complete information ensures you get accurate and timely vendor responses
          </p>

          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded border border-orange-200">
              In High Demand
            </span>
            <span className="text-xs font-semibold text-slate-600">
              12 enquiries last week
            </span>
          </div>
        </form>
      </div>

      <button className="flex items-center justify-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors">
        <AlertTriangle className="w-3.5 h-3.5" />
        Report an Issue
      </button>
    </div>
  );
}
