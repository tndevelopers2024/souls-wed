"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { cities } from "@/lib/venues-data";

const filters = [
  { label: "No. of Guests", options: ["Up to 100", "100–300", "300–600", "600+"] },
  { label: "Price Range", options: ["Under ₹50,000", "₹50k–₹2L", "₹2L–₹5L", "₹5L+"] },
  { label: "Venue Type", options: ["5-Star Hotel", "Resort", "Garden Venue", "Banquet Hall", "Palace"] },
  { label: "Space", options: ["Indoor", "Outdoor", "Both"] },
  { label: "Features", options: ["In-house Catering", "Parking", "Bridal Suite", "Overnight Stay"] },
];

interface Props {
  activeCity: string;
  onCityChange: (city: string) => void;
}

export default function VenueFilterBar({ activeCity, onCityChange }: Props) {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const toggleFilter = (label: string) => {
    setOpenFilter(openFilter === label ? null : label);
  };

  const selectOption = (filterLabel: string, option: string) => {
    setActiveFilters((prev) => ({ ...prev, [filterLabel]: option }));
    setOpenFilter(null);
  };

  return (
    <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* Filter pills row */}
        <div className="flex items-center gap-2 py-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <button
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-semibold transition-colors"
            style={{ borderColor: "var(--sw-navy)", color: "var(--sw-navy)", background: "white" }}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          {filters.map((f) => {
            const isActive = !!activeFilters[f.label];
            const isOpen = openFilter === f.label;
            return (
              <div key={f.label} className="relative flex-shrink-0">
                <button
                  onClick={() => toggleFilter(f.label)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-semibold transition-all"
                  style={{
                    background: isActive ? "var(--sw-navy)" : "white",
                    color: isActive ? "white" : "var(--sw-navy)",
                    borderColor: isActive ? "var(--sw-navy)" : "var(--sw-light-gray)",
                  }}
                >
                  {isActive ? activeFilters[f.label] : f.label}
                  <ChevronDown
                    className="w-3.5 h-3.5 transition-transform"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
                  />
                </button>

                {isOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 w-52 rounded-[20px] overflow-hidden z-50 py-1.5"
                    style={{
                      background: "white",
                      border: "1px solid rgba(0,0,0,0.08)",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                    }}
                  >
                    {f.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => selectOption(f.label, opt)}
                        className="w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-orange-50"
                        style={{
                          color: activeFilters[f.label] === opt ? "var(--sw-orange)" : "var(--sw-navy)",
                          fontWeight: activeFilters[f.label] === opt ? 700 : 500,
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* City bubbles row */}
        <div className="flex items-center gap-4 py-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <button
            onClick={() => onCityChange("")}
            className="flex-shrink-0 flex flex-col items-center gap-1.5 group"
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all"
              style={{
                borderColor: activeCity === "" ? "var(--sw-orange)" : "transparent",
                background: "var(--sw-peach)",
                color: "var(--sw-navy)",
              }}
            >
              All
            </div>
            <span className="text-[11px] font-semibold text-slate-600">All Cities</span>
          </button>

          {cities.map((city) => (
            <button
              key={city.name}
              onClick={() => onCityChange(city.name)}
              className="flex-shrink-0 flex flex-col items-center gap-1.5 group"
            >
              <div
                className="w-14 h-14 rounded-full overflow-hidden relative border-2 transition-all"
                style={{
                  borderColor: activeCity === city.name ? "var(--sw-orange)" : "transparent",
                }}
              >
                <Image
                  src={city.image}
                  alt={city.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <span
                className="text-[11px] font-semibold transition-colors"
                style={{ color: activeCity === city.name ? "var(--sw-orange)" : "#64748b" }}
              >
                {city.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
