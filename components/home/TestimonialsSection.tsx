"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    couple: "Priya & Arjun",
    date: "February 2025",
    venue: "Udaipur Palace",
    quote:
      "SoulsWed made our dream Udaipur wedding a reality. Every vendor was perfectly coordinated — from the palace venue to the mehendi artists. Truly flawless!",
    image: "https://images.unsplash.com/photo-1529636444744-adffc9135a5e?w=120&q=80",
    stars: 5,
  },
  {
    id: 2,
    couple: "Meera & Rohan",
    date: "December 2024",
    venue: "Goa Beachside Resort",
    quote:
      "We planned our entire Goa beach wedding through SoulsWed in just 3 weeks. The booking process was seamless and the support team was available 24/7. Absolutely loved it!",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=120&q=80",
    stars: 5,
  },
  {
    id: 3,
    couple: "Ananya & Vikram",
    date: "March 2025",
    venue: "Dubai Marina Ballroom",
    quote:
      "A destination wedding in Dubai felt overwhelming until we found SoulsWed. They connected us with amazing vendors and handled all the logistics. Worth every penny!",
    image: "https://images.unsplash.com/photo-1536321115970-5dfa13356211?w=120&q=80",
    stars: 5,
  },
  {
    id: 4,
    couple: "Divya & Karan",
    date: "January 2025",
    venue: "Jaipur Haveli",
    quote:
      "The royal Jaipur wedding we always dreamed of. SoulsWed's vendor network is unmatched — the choreographers, caterers, and decorators all exceeded our expectations.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=120&q=80",
    stars: 5,
  },
  {
    id: 5,
    couple: "Sana & Aditya",
    date: "April 2025",
    venue: "Bali Cliff Estate",
    quote:
      "We had the most magical Bali ceremony. SoulsWed made international wedding planning so simple. The app, the team, the vendors — everything was 10/10!",
    image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=120&q=80",
    stars: 5,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-current" style={{ color: "var(--sw-gold)" }} />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActive((p) => (p + 1) % testimonials.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const visibleCount = 3;
  const visible = Array.from({ length: visibleCount }, (_, i) =>
    testimonials[(active + i) % testimonials.length]
  );

  return (
    <section
      className="py-24 px-4 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, var(--sw-deep-navy) 0%, var(--sw-navy) 100%)`,
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="section-heading"
            style={{ color: "var(--sw-white)" }}
          >
            Couples Love SoulsWed
          </h2>
          <p className="section-subtext" style={{ color: "var(--sw-steel)" }}>
            Real stories from real couples
          </p>
        </motion.div>

        {/* Cards */}
        <div className="hidden md:grid grid-cols-3 gap-6 mb-10">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((t) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="glass-card p-6 flex flex-col gap-4"
              >
                <StarRating count={t.stars} />
                <p className="text-sm leading-relaxed italic" style={{ color: "rgba(255,255,255,0.85)" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-yellow-400">
                    <Image src={t.image} alt={t.couple} width={40} height={40} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <div className="font-bold text-sm" style={{ color: "var(--sw-white)", fontFamily: "var(--font-heading)" }}>
                      {t.couple}
                    </div>
                    <div className="text-xs" style={{ color: "var(--sw-steel)" }}>
                      {t.venue} · {t.date}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Mobile: single card */}
        <div className="md:hidden mb-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={testimonials[active].id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="glass-card p-6 flex flex-col gap-4"
            >
              <StarRating count={testimonials[active].stars} />
              <p className="text-sm leading-relaxed italic" style={{ color: "rgba(255,255,255,0.85)" }}>
                &ldquo;{testimonials[active].quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 mt-auto pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image src={testimonials[active].image} alt={testimonials[active].couple} width={40} height={40} className="object-cover w-full h-full" />
                </div>
                <div>
                  <div className="font-bold text-sm" style={{ color: "var(--sw-white)", fontFamily: "var(--font-heading)" }}>
                    {testimonials[active].couple}
                  </div>
                  <div className="text-xs" style={{ color: "var(--sw-steel)" }}>
                    {testimonials[active].venue} · {testimonials[active].date}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: active === i ? "28px" : "8px",
                height: "8px",
                background: active === i ? "var(--sw-gold)" : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
