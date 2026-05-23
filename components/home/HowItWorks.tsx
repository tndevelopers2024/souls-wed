"use client";

import { motion } from "framer-motion";
import { Search, CalendarCheck, Heart } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Search & Discover",
    desc: "Browse 500+ verified vendors across 24 categories in top wedding destinations",
  },
  {
    number: "02",
    icon: CalendarCheck,
    title: "Check & Book",
    desc: "Real-time availability calendar with instant booking confirmation and secure payment",
  },
  {
    number: "03",
    icon: Heart,
    title: "Celebrate!",
    desc: "On-ground support and flawless execution for your perfect wedding day",
  },
];

export default function HowItWorks() {
  return (
    <section
      className="py-24 px-4 noise-texture relative overflow-hidden"
      style={{ background: "var(--sw-peach)" }}
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-heading">Book in 3 Simple Steps</h2>
          <p className="section-subtext">From discovery to your dream wedding day</p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting dashed line (desktop) */}
          <div
            className="hidden md:block absolute top-20 left-1/4 right-1/4 h-px"
            style={{
              background: "repeating-linear-gradient(90deg, var(--sw-orange) 0, var(--sw-orange) 12px, transparent 12px, transparent 24px)",
              opacity: 0.4,
            }}
          />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: i === 0 ? -40 : i === 2 ? 40 : 0, y: i === 1 ? 40 : 0 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative"
              >
                <div
                  className="glass-card p-8 relative overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.5)" }}
                >
                  {/* Large step number background */}
                  <span
                    className="absolute -top-4 -right-2 text-9xl font-black select-none pointer-events-none"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--sw-orange)",
                      opacity: 0.08,
                      lineHeight: 1,
                    }}
                  >
                    {step.number}
                  </span>

                  {/* Step number badge */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-5"
                    style={{ background: "var(--sw-orange)", color: "#fff" }}
                  >
                    {i + 1}
                  </div>

                  {/* Icon */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                    style={{ background: "linear-gradient(135deg, var(--sw-orange), var(--sw-gold))" }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ fontFamily: "var(--font-heading)", color: "var(--sw-navy)" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--sw-steel)" }}>
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
