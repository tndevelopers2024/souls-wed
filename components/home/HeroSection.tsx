"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronDown, MapPin, Calendar, Users, Layers } from "lucide-react";
import { useState } from "react";

const popularTags = ["Mumbai", "Goa", "Udaipur", "Dubai", "Bali", "Jaipur"];

const categories = [
  "All Categories",
  "Venues",
  "Photographers",
  "Decorators",
  "Caterers",
  "Make-up Artists",
  "Planners",
];

const words = ["Your", "Dream", "Wedding,"];
const words2 = ["Begins", "Here"];

export default function HeroSection() {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background image */}
      <Image
        src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1800&q=80"
        alt="Luxury wedding venue"
        fill
        className="object-cover object-center"
        priority
      />

      {/* Gradient mesh overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(238,116,41,0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(252,203,17,0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(55,71,90,0.4) 0%, transparent 60%),
            rgba(33,37,41,0.6)
          `,
        }}
      />

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
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 flex flex-col items-center text-center pt-24 pb-12">
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
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-2">
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
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold italic leading-tight mb-6" style={{ color: "var(--sw-gold)" }}>
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
          Discover 24+ categories — venues, photographers, flights, cruises &amp; more
        </motion.p>

        {/* Floating Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-4xl"
        >
          <div className="glass-card p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Destination */}
              <div className="flex-1 flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3">
                <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: "var(--sw-orange)" }} />
                <input
                  type="text"
                  placeholder="Destination / City"
                  className="bg-transparent w-full text-white placeholder-white/60 text-sm font-medium outline-none"
                />
              </div>

              {/* Date */}
              <div className="flex-1 flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3">
                <Calendar className="w-5 h-5 flex-shrink-0" style={{ color: "var(--sw-gold)" }} />
                <input
                  type="text"
                  placeholder="Wedding Date"
                  className="bg-transparent w-full text-white placeholder-white/60 text-sm font-medium outline-none"
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                />
              </div>

              {/* Guests */}
              <div className="flex-1 flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3">
                <Users className="w-5 h-5 flex-shrink-0" style={{ color: "var(--sw-steel)" }} />
                <input
                  type="number"
                  placeholder="Guests"
                  min={1}
                  className="bg-transparent w-full text-white placeholder-white/60 text-sm font-medium outline-none"
                />
              </div>

              {/* Category */}
              <div className="flex-1 flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3">
                <Layers className="w-5 h-5 flex-shrink-0" style={{ color: "var(--sw-steel)" }} />
                <select className="bg-transparent w-full text-white text-sm font-medium outline-none">
                  {categories.map((c) => (
                    <option key={c} value={c} className="text-gray-900">{c}</option>
                  ))}
                </select>
              </div>

              {/* CTA */}
              <button className="btn-glass whitespace-nowrap !rounded-2xl">
                Search Vendors
              </button>
            </div>

            {/* Popular tags */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
                Popular:
              </span>
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                  className="glass text-xs font-semibold px-3 py-1.5 rounded-full transition-all !rounded-full"
                  style={{
                    color: activeTag === tag ? "var(--sw-navy)" : "rgba(255,255,255,0.85)",
                    background: activeTag === tag ? "var(--sw-gold)" : undefined,
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="w-8 h-8" style={{ color: "rgba(255,255,255,0.6)" }} />
      </motion.div>
    </section>
  );
}
