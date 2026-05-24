"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    couple: "Priya & Arjun",
    date: "February 2025",
    venue: "Udaipur Palace",
    quote: "SoulsWed made our dream Udaipur wedding a reality. Every vendor was perfectly coordinated. Truly flawless!",
    image: "https://images.unsplash.com/photo-1529636444744-adffc9135a5e?w=800&q=80",
    stars: 5,
  },
  {
    id: 2,
    couple: "Meera & Rohan",
    date: "December 2024",
    venue: "Goa Beachside Resort",
    quote: "We planned our entire Goa beach wedding through SoulsWed in just 3 weeks. The booking process was seamless.",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
    stars: 5,
  },
  {
    id: 3,
    couple: "Ananya & Vikram",
    date: "March 2025",
    venue: "Dubai Marina Ballroom",
    quote: "A destination wedding in Dubai felt overwhelming until we found SoulsWed. They connected us with amazing vendors.",
    image: "https://images.unsplash.com/photo-1536321115970-5dfa13356211?w=800&q=80",
    stars: 5,
  },
  {
    id: 4,
    couple: "Divya & Karan",
    date: "January 2025",
    venue: "Jaipur Haveli",
    quote: "The royal Jaipur wedding we always dreamed of. SoulsWed's vendor network is unmatched — everything exceeded expectations.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    stars: 5,
  },
  {
    id: 5,
    couple: "Sana & Aditya",
    date: "April 2025",
    venue: "Bali Cliff Estate",
    quote: "We had the most magical Bali ceremony. SoulsWed made international wedding planning so simple. Everything was 10/10!",
    image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80",
    stars: 5,
  },
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTestimonial = testimonials[activeIndex];

  const next = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left: Text Content */}
          <div className="order-2 lg:order-1">
            <motion.p 
              className="text-sm font-bold uppercase tracking-widest mb-3" 
              style={{ color: "var(--sw-orange)" }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Real Love Stories
            </motion.p>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-12"
              style={{ fontFamily: "var(--font-heading)", color: "var(--sw-navy)" }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Couples Love SoulsWed
            </motion.h2>
            
            <div className="relative min-h-[260px] sm:min-h-[220px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Quote className="w-12 h-12 mb-6" style={{ color: "var(--sw-light-gray)" }} />
                  <div className="flex gap-1.5 mb-6">
                    {[...Array(activeTestimonial.stars)].map((_, i) => (
                      <Star key={i} className="w-5 h-5" style={{ color: "var(--sw-gold)" }} fill="var(--sw-gold)" />
                    ))}
                  </div>
                  <p className="text-2xl md:text-3xl leading-snug text-slate-800 font-medium italic mb-8" style={{ fontFamily: "var(--font-heading)" }}>
                    "{activeTestimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full w-1/3 bg-orange-400 rounded-full" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">{activeTestimonial.couple}</h4>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                        {activeTestimonial.venue} • {activeTestimonial.date}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 mt-10">
              <button 
                onClick={prev} 
                className="w-12 h-12 rounded-full border-2 border-slate-100 flex items-center justify-center transition-all hover:border-slate-300 hover:bg-slate-50 group"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-slate-700 transition-colors" />
              </button>
              <button 
                onClick={next} 
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:opacity-90 hover:scale-105 shadow-lg shadow-orange-500/20" 
                style={{ background: "var(--sw-navy)" }}
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
              
              <div className="ml-6 flex gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: activeIndex === idx ? "24px" : "8px",
                      background: activeIndex === idx ? "var(--sw-orange)" : "var(--sw-light-gray)",
                    }}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Image Slider */}
          <div className="order-1 lg:order-2 w-full max-w-[500px] mx-auto lg:ml-auto">
            <div className="relative aspect-[4/5] w-full rounded-[2rem] overflow-hidden shadow-2xl group">
              <AnimatePresence>
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={activeTestimonial.image}
                    alt={activeTestimonial.couple}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
                </motion.div>
              </AnimatePresence>
              
              {/* Decorative badge */}
              <div className="absolute top-6 right-6 backdrop-blur-md bg-white/20 border border-white/40 px-4 py-2 rounded-full shadow-xl">
                 <span className="text-white font-bold text-xs tracking-widest uppercase flex items-center gap-2">
                   <Star className="w-3 h-3 fill-white" />
                   Verified
                 </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
