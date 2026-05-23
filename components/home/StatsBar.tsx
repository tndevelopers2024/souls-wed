"use client";

import { motion } from "framer-motion";
import AnimatedCounter from "@/components/shared/AnimatedCounter";

const stats = [
  { target: 500, suffix: "+", label: "Verified Vendors" },
  { target: 24, suffix: "", label: "Categories" },
  { target: 50, suffix: "+", label: "Destinations" },
  { target: 10000, suffix: "+", label: "Happy Couples" },
];

export default function StatsBar() {
  return (
    <section className="relative py-12 overflow-hidden">
      <div className="glass-dark mx-4 md:mx-8 lg:mx-16 rounded-3xl">
        <div className="max-w-5xl mx-auto px-8 py-10">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {stats.map((stat, i) => (
              <div key={stat.label} className="flex flex-col items-center text-center relative">
                {i > 0 && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-12 hidden md:block"
                    style={{ background: "rgba(255,255,255,0.15)" }}
                  />
                )}
                <span
                  className="text-4xl md:text-5xl font-bold"
                  style={{ fontFamily: "var(--font-heading)", color: "var(--sw-gold)" }}
                >
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                </span>
                <span
                  className="text-sm font-medium mt-2"
                  style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-body)" }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
