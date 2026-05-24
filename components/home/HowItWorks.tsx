"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Search, CalendarCheck, Sparkles, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Search & Discover",
    desc: "Browse 500+ verified vendors across 24 wedding categories — venues, photographers, makeup artists, decorators & more.",
    pills: ["Venues", "Photographers", "Decorators", "Makeup"],
  },
  {
    number: "02",
    icon: CalendarCheck,
    title: "Check & Book",
    desc: "View real-time availability, compare packages side-by-side, and confirm your booking with secure payment.",
    pills: ["Real-time Calendar", "Compare Packages", "Instant Confirm"],
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Celebrate!",
    desc: "Relax while our on-ground team ensures flawless execution. Your dream wedding, delivered exactly as you imagined.",
    pills: ["On-ground Support", "Live Tracking", "Zero Stress"],
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section ref={sectionRef} className="py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── Header ── */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
        >
          <span
            className="inline-block text-xs font-bold uppercase tracking-[0.22em] px-4 py-1.5 rounded-full mb-5"
            style={{
              background: "rgba(238,116,41,0.1)",
              color: "var(--sw-orange)",
              border: "1px solid rgba(238,116,41,0.2)",
            }}
          >
            How It Works
          </span>

          <h2
            className="text-4xl md:text-5xl lg:text-[56px] font-black leading-tight mb-4"
            style={{ color: "var(--sw-navy)", fontFamily: "var(--font-heading)" }}
          >
            Book in{" "}
            <span
              className="relative inline-block"
              style={{ color: "var(--sw-orange)" }}
            >
              3 Simple
              {/* Underline squiggle */}
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.path
                  d="M2 5 Q25 2 50 5 Q75 8 100 5 Q125 2 150 5 Q175 8 198 5"
                  stroke="var(--sw-orange)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={inView ? { pathLength: 1, opacity: 0.6 } : {}}
                  transition={{ duration: 0.9, delay: 0.4 }}
                />
              </svg>
            </span>{" "}
            Steps
          </h2>

          <p
            className="text-base md:text-lg max-w-lg mx-auto"
            style={{ color: "var(--sw-navy)", opacity: 0.5 }}
          >
            From first search to your first dance — we make every step effortless.
          </p>
        </motion.div>

        {/* ── Steps row ── */}
        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">

          {/* Connector dots line (desktop only) */}
          <div className="hidden lg:flex absolute top-[52px] left-[calc(33.33%-40px)] right-[calc(33.33%-40px)] items-center pointer-events-none z-0">
            <div
              className="flex-1 h-px"
              style={{
                background:
                  "repeating-linear-gradient(90deg, var(--sw-orange) 0px, var(--sw-orange) 6px, transparent 6px, transparent 14px)",
                opacity: 0.3,
              }}
            />
          </div>

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 36 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.17 }}
                className="group flex flex-col items-center text-center"
              >
                {/* Number + icon stack */}
                <div className="relative mb-8">
                  {/* Ghost number */}
                  <span
                    className="absolute -top-6 left-1/2 -translate-x-1/2 text-[96px] font-black select-none leading-none pointer-events-none"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--sw-orange)",
                      opacity: 0.07,
                    }}
                  >
                    {step.number}
                  </span>

                  {/* Icon circle */}
                  <motion.div
                    className="relative w-[104px] h-[104px] rounded-full flex items-center justify-center mx-auto"
                    whileHover={{ scale: 1.07 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    style={{
                      background: "white",
                      boxShadow:
                        "0 8px 32px rgba(238,116,41,0.12), 0 2px 8px rgba(0,0,0,0.06)",
                      border: "2px solid rgba(238,116,41,0.15)",
                    }}
                  >
                    {/* Inner gradient ring */}
                    <div
                      className="absolute inset-2 rounded-full"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(238,116,41,0.08) 0%, rgba(252,203,17,0.06) 100%)",
                      }}
                    />
                    <Icon
                      className="relative z-10 w-9 h-9 transition-transform duration-300 group-hover:scale-110"
                      style={{ color: "var(--sw-orange)" }}
                    />

                    {/* Step badge */}
                    <span
                      className="absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white shadow-md"
                      style={{ background: "var(--sw-orange)" }}
                    >
                      {i + 1}
                    </span>
                  </motion.div>
                </div>

                {/* Text */}
                <h3
                  className="text-xl md:text-2xl font-bold mb-3"
                  style={{ color: "var(--sw-navy)", fontFamily: "var(--font-heading)" }}
                >
                  {step.title}
                </h3>

                <p
                  className="text-sm leading-relaxed mb-5 max-w-[280px] mx-auto"
                  style={{ color: "var(--sw-navy)", opacity: 0.55 }}
                >
                  {step.desc}
                </p>

                {/* Pills */}
                <div className="flex flex-wrap justify-center gap-2">
                  {step.pills.map((pill) => (
                    <span
                      key={pill}
                      className="text-[11px] font-semibold px-3 py-1 rounded-full"
                      style={{
                        background: "rgba(238,116,41,0.08)",
                        color: "var(--sw-orange)",
                        border: "1px solid rgba(238,116,41,0.18)",
                      }}
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── CTA strip ── */}
        <motion.div
          className="mt-20 relative rounded-[28px] overflow-hidden"
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.75 }}
        >
          {/* Background */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(120deg, #EE7429 0%, #f59644 50%, #FCCB11 100%)",
            }}
          />
          {/* Subtle pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-9">
            <div>
              <p className="text-white font-black text-2xl md:text-3xl mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                Ready to plan your perfect wedding?
              </p>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "14px" }}>
                Join 10,000+ couples who booked their dream wedding on SoulsWed.
              </p>
            </div>
            <Link
              href="/venues"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm whitespace-nowrap transition-all hover:gap-3 hover:scale-105 flex-shrink-0"
              style={{
                background: "white",
                color: "var(--sw-orange)",
                boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
              }}
            >
              Start Exploring <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
