"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "@/components/shared/CustomImage";
import { ChevronDown, MapPin, Calendar, Users, Layers, Search, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { VENDOR_CATEGORIES } from "@/lib/config/categories";

const destinations = [
  "Paris",
  "New York",
  "London",
  "Tokyo",
  "Dubai",
  "Rome",
  "Bali",
  "Mumbai",
  "Jaipur",
  "Goa",
  "Udaipur",
  "Sydney",
  "Istanbul"
];

const words = ["Extraordinary", "Events,"];
const words2 = ["Effortlessly", "Planned"];

const bgVideos = [
  "/videos/home/98d54592b8b559aaba3a1be833d89a41.mp4", // Default
  "/videos/home/6443f7453a5075757e193491d6a69ea1.mp4",
  "/videos/home/dd38fc3826a28cf0ac334ea9e9835830.mp4",
  "/videos/home/6fd8249497054ca4fe24aaf816e55282.mp4",
];

export default function HeroSection() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % bgVideos.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full px-3 md:px-2 lg:px-2 pt-3">
      <section className="relative min-h-[calc(100vh-2.5rem)] flex flex-col items-center justify-center overflow-hidden rounded-[32px] sm:rounded-[35px] border border-amber-100/60 shadow-[0_24px_70px_rgba(252,203,17,0.12)]">
        {/* Background image carousel */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence>
            <motion.div
              key={currentVideoIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <video
                src={bgVideos[currentVideoIndex]}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover object-center"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Simple dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Floating orbs */}
        <div
          className="orb w-64 h-64 top-20 left-10"
          style={{ background: "var(--sw-primary)", animationDelay: "0s" }}
        />
        <div
          className="orb w-80 h-80 top-10 right-20"
          style={{ background: "var(--sw-secondary)", animationDelay: "2s" }}
        />
        <div
          className="orb w-56 h-56 bottom-32 left-1/3"
          style={{ background: "var(--sw-ink)", animationDelay: "4s" }}
        />

        {/* Content */}
        <div className="relative z-10 w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center pt-24 pb-12">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium"
            style={{ color: "var(--sw-chip-bg-hover)" }}
          >
            <Sparkles className="w-4 h-4 inline-block mr-1" style={{ color: "var(--sw-secondary)" }} />
            Flawless Moves. Perfect Events.
          </motion.div>

          {/* Headline Line 1 */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-2">
            <span className="flex flex-wrap justify-center gap-x-4">
              {words.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.12, ease: [0.4, 0, 0.2, 1] }}
                  className="text-white"
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Headline Line 2 — gold italic */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold italic leading-tight mb-6" style={{ color: "var(--sw-secondary)" }}>
            <span className="flex flex-wrap justify-center gap-x-4">
              {words2.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.36 + i * 0.12, ease: [0.4, 0, 0.2, 1] }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-lg md:text-xl max-w-2xl mb-12"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            Book premier venues, flights, and vendors all in one place.
          </motion.p>

          {/* Floating Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease: [0.4, 0, 0.2, 1] }}
            className="w-full max-w-5xl xl:max-w-6xl"
          >
            <div className="bg-white/95 dark:bg-[var(--sw-surface)]/95 backdrop-blur-md rounded-[32px] md:rounded-full p-2 md:p-2.5 shadow-2xl border border-white/30 flex flex-col md:flex-row items-center relative z-20 w-full">

              {/* Destination */}
              <div className="flex-1 w-full md:w-auto px-6 py-2.5 hover:bg-gray-100/60 rounded-full cursor-pointer transition-colors flex flex-col justify-center items-start text-left group relative">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 group-hover:text-gray-800 cursor-pointer mb-0.5">Destination</label>
                <select defaultValue="" className="bg-transparent w-full text-gray-900 text-[15px] font-semibold outline-none truncate appearance-none cursor-pointer p-0 m-0 leading-tight">
                  <option value="" disabled hidden className="text-gray-400 font-normal">Where to?</option>
                  {destinations.map((d) => (
                    <option key={d} value={d} className="text-gray-900">{d}</option>
                  ))}
                </select>
              </div>

              <div className="hidden md:block w-px h-10 bg-gray-200" />

              {/* Date */}
              <div className="flex-1 w-full md:w-auto px-6 py-2.5 hover:bg-gray-100/60 rounded-full cursor-pointer transition-colors flex flex-col justify-center items-start text-left group relative">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 group-hover:text-gray-800 cursor-pointer mb-0.5">Date</label>
                <input
                  type="text"
                  placeholder="Add dates"
                  className="bg-transparent w-full text-gray-900 placeholder-gray-400 text-[15px] font-semibold outline-none truncate p-0 m-0 cursor-pointer leading-tight"
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                />
              </div>

              <div className="hidden md:block w-px h-10 bg-gray-200" />

              {/* Guests */}
              <div className="flex-1 w-full md:w-auto px-6 py-2.5 hover:bg-gray-100/60 rounded-full cursor-pointer transition-colors flex flex-col justify-center items-start text-left group relative">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 group-hover:text-gray-800 cursor-pointer mb-0.5">Guests</label>
                <input
                  type="number"
                  placeholder="Add guests"
                  min={1}
                  className="bg-transparent w-full text-gray-900 placeholder-gray-400 text-[15px] font-semibold outline-none truncate p-0 m-0 cursor-pointer leading-tight"
                />
              </div>

              <div className="hidden md:block w-px h-10 bg-gray-200" />

              {/* Category */}
              <div className="flex-1 w-full md:w-auto px-6 py-2.5 hover:bg-gray-100/60 rounded-full cursor-pointer transition-colors flex flex-col justify-center items-start text-left group relative">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 group-hover:text-gray-800 cursor-pointer mb-0.5">Category</label>
                <select className="bg-transparent w-full text-gray-900 text-[15px] font-semibold outline-none truncate appearance-none cursor-pointer p-0 m-0 leading-tight">
                  <option value="" disabled hidden className="text-gray-400 font-normal">All Categories</option>
                  {VENDOR_CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug} className="text-gray-900">{c.name}</option>
                  ))}
                </select>
              </div>

              {/* CTA */}
              <div className="w-full md:w-auto mt-2 md:mt-0 md:ml-2">
                <button
                  className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 md:py-3.5 rounded-full font-bold transition-colors duration-300 h-[52px]"
                  style={{ transform: 'none' }}
                >
                  <Search className="w-4 h-4 text-white font-bold" strokeWidth={3} />
                  <span className="text-[15px]">Search</span>
                </button>
              </div>

            </div>
          </motion.div>
        </div>


      </section>
    </div>
  );
}
