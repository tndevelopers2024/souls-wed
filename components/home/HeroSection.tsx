"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronDown, MapPin, Calendar, Users, Layers } from "lucide-react";
import { useState, useEffect } from "react";
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
const categories = [
  "All Categories",
  "Venues",
  "Photographers",
  "Decorators",
  "Caterers",
  "Make-up Artists",
  "Planners",
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
    <div className="w-full px-3 md:px-5 lg:px-6 pt-4 pb-8">
      <section className="relative min-h-[calc(100vh-2.5rem)] flex flex-col items-center justify-center overflow-hidden rounded-[32px] sm:rounded-[40px] border border-amber-100/60 shadow-[0_24px_70px_rgba(252,203,17,0.12)]">
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
        style={{ background: "var(--sw-orange)", animationDelay: "0s" }}
      />
      <div
        className="orb w-80 h-80 top-10 right-20"
        style={{ background: "var(--sw-gold)", animationDelay: "2s" }}
      />
      <div
        className="orb w-56 h-56 bottom-32 left-1/3"
        style={{ background: "var(--sw-navy)", animationDelay: "4s" }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center pt-24 pb-12">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium"
          style={{ color: "rgba(255,255,255,0.9)" }}
        >
          <span style={{ color: "var(--sw-gold)" }}>✦</span>
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
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold italic leading-tight mb-6" style={{ color: "var(--sw-gold)" }}>
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
          <div className="">
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Destination */}
              <div className="flex-1 min-w-0 flex items-center gap-3 glass-input px-4 py-3">
                <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: "var(--sw-orange)" }} />
                <select defaultValue="" className="bg-transparent w-full text-gray-900 text-sm font-semibold outline-none truncate appearance-none cursor-pointer">
                  <option value="" disabled hidden className="text-gray-500">Destination</option>
                  {destinations.map((d) => (
                    <option key={d} value={d} className="text-gray-900">{d}</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="flex-1 min-w-0 flex items-center gap-3 glass-input px-4 py-3">
                <Calendar className="w-5 h-5 flex-shrink-0" style={{ color: "var(--sw-gold)" }} />
                <input
                  type="text"
                  placeholder="Date"
                  className="bg-transparent w-full text-gray-900 placeholder-gray-500 text-sm font-semibold outline-none truncate"
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                />
              </div>

              {/* Guests */}
              <div className="flex-1 min-w-0 flex items-center gap-3 glass-input px-4 py-3">
                <Users className="w-5 h-5 flex-shrink-0" style={{ color: "var(--sw-steel)" }} />
                <input
                  type="number"
                  placeholder="Guests"
                  min={1}
                  className="bg-transparent w-full text-gray-900 placeholder-gray-500 text-sm font-semibold outline-none truncate"
                />
              </div>

              {/* Category */}
              <div className="flex-1 min-w-0 flex items-center gap-3 glass-input px-4 py-3">
                <Layers className="w-5 h-5 flex-shrink-0" style={{ color: "var(--sw-steel)" }} />
                <select className="bg-transparent w-full text-gray-900 text-sm font-semibold outline-none truncate appearance-none">
                  {categories.map((c) => (
                    <option key={c} value={c} className="text-gray-900">{c}</option>
                  ))}
                </select>
              </div>

              {/* CTA */}
              <button className="btn-glass whitespace-nowrap !rounded-full">
                Search Vendors
              </button>
            </div>

          </div>
        </motion.div>
      </div>

      {/* Carousel Pagination Dots */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        {bgVideos.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentVideoIndex(idx)}
            className="rounded-full transition-all duration-300 cursor-pointer"
            style={{
              width: currentVideoIndex === idx ? "28px" : "8px",
              height: "8px",
              background: currentVideoIndex === idx ? "var(--sw-gold)" : "rgba(255,255,255,0.4)",
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="w-8 h-8" style={{ color: "rgba(255,255,255,0.6)" }} />
      </motion.div>
    </section>
    </div>
  );
}
