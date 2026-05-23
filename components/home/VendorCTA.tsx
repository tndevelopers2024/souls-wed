"use client";

import { motion } from "framer-motion";
import { TrendingUp, Calendar, CreditCard, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const benefits = [
  { icon: TrendingUp, text: "Real-time bookings & analytics" },
  { icon: Calendar, text: "Smart calendar management" },
  { icon: CreditCard, text: "Integrated payment gateway" },
  { icon: MessageCircle, text: "Direct chat with couples" },
];

export default function VendorCTA() {
  return (
    <section
      className="py-24 px-4"
      style={{ background: "var(--sw-white)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* relative wrapper so badges can be absolutely positioned outside the overflow-hidden grid */}
        <div className="relative">
          <div className="rounded-3xl overflow-hidden grid md:grid-cols-2">
            {/* Left */}
            <motion.div
              className="relative p-10 md:p-14 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, var(--sw-deep-navy) 0%, var(--sw-navy) 100%)`,
              }}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Orbs */}
              <div className="orb w-48 h-48 top-0 right-0" style={{ background: "var(--sw-orange)", opacity: 0.2 }} />
              <div className="orb w-32 h-32 bottom-10 left-5" style={{ background: "var(--sw-gold)", opacity: 0.15, animationDelay: "3s" }} />

              <div className="relative z-10">
                <div
                  className="inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-6"
                  style={{ background: "rgba(252,203,17,0.2)", color: "var(--sw-gold)" }}
                >
                  FOR WEDDING VENDORS
                </div>
                <h2
                  className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight"
                >
                  Grow Your Wedding Business
                </h2>
                <p className="text-sm mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Join 500+ vendors already on SoulsWed. Reach couples planning their dream weddings and grow your bookings effortlessly.
                </p>

                <div className="flex flex-col gap-4 mb-10">
                  {benefits.map((b) => {
                    const Icon = b.icon;
                    return (
                      <div key={b.text} className="flex items-center gap-3">
                        <div
                           className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(252,203,17,0.15)" }}
                        >
                          <Icon className="w-4 h-4" style={{ color: "var(--sw-gold)" }} />
                        </div>
                        <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>
                          {b.text}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <Link href="/signup" className="btn-glass inline-flex items-center gap-2">
                  List Your Business Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Right — Dashboard mockup */}
            <motion.div
              className="relative p-10 md:p-14"
              style={{ background: "var(--sw-peach)" }}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="glass-dark rounded-3xl p-6 h-full flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-sm font-serif">
                    Vendor Dashboard
                  </span>
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded-full"
                    style={{ background: "rgba(56,206,56,0.2)", color: "#5ceb5c" }}
                  >
                    ● Live
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Bookings This Month", value: "24", delta: "+40%", up: true },
                    { label: "Revenue", value: "₹2.1L", delta: "+₹2L", up: true },
                    { label: "Profile Views", value: "1,842", delta: "+120", up: true },
                    { label: "Avg Rating", value: "4.9★", delta: "+0.2", up: true },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-2xl p-4"
                      style={{ background: "rgba(255,255,255,0.08)" }}
                    >
                      <div className="text-xs mb-1" style={{ color: "var(--sw-steel)" }}>{s.label}</div>
                      <div className="text-xl font-bold text-white">{s.value}</div>
                      <div className="text-xs mt-1 font-semibold" style={{ color: "#5ceb5c" }}>{s.delta}</div>
                    </div>
                  ))}
                </div>

                {/* Recent bookings */}
                <div className="flex flex-col gap-2">
                  <div className="text-xs font-semibold mb-1" style={{ color: "var(--sw-steel)" }}>RECENT BOOKINGS</div>
                  {[
                    { couple: "Priya & Arjun", date: "Jun 15", status: "Confirmed" },
                    { couple: "Meera & Rohan", date: "Jul 4", status: "Pending" },
                  ].map((b) => (
                    <div
                      key={b.couple}
                      className="flex items-center justify-between rounded-xl px-4 py-3"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    >
                      <span className="text-sm font-medium text-white">{b.couple}</span>
                      <span className="text-xs" style={{ color: "var(--sw-steel)" }}>{b.date}</span>
                      <span
                        className="text-xs font-semibold px-2 py-1 rounded-full"
                        style={{
                          background: b.status === "Confirmed" ? "rgba(56,206,56,0.15)" : "rgba(252,203,17,0.15)",
                          color: b.status === "Confirmed" ? "#5ceb5c" : "var(--sw-gold)",
                        }}
                      >
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Floating badges — outside overflow-hidden so they aren't clipped by the grid */}
          <motion.div
            className="absolute -top-4 -right-4 glass text-white text-xs font-bold px-4 py-2 rounded-full !rounded-full shadow-lg"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ color: "var(--sw-gold)" }}
          >
            +40% bookings
          </motion.div>
          <motion.div
            className="absolute -bottom-4 glass text-white text-xs font-bold px-4 py-2 rounded-full !rounded-full shadow-lg"
            style={{ left: "calc(50% - 1rem)", color: "#5ceb5c" }}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            +₹2L revenue
          </motion.div>
        </div>
      </div>
    </section>
  );
}
