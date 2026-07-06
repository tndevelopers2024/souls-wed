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
    venue: "Château de Chantilly, Paris",
    quote: "Our fairy-tale wedding at Château de Chantilly was beyond anything we imagined — the gardens, the grand ballroom, every detail perfectly coordinated by SoulsWed.",
    image: "/images/venues/0b28a32376b53a93c1eb6c9bd2442c8d.jpg",
    stars: 5,
  },
  {
    id: 2,
    couple: "Meera & Rohan",
    date: "December 2024",
    venue: "The Savoy, London",
    quote: "We celebrated at The Savoy and it was pure Edwardian elegance. SoulsWed lined up every vendor flawlessly for our riverside London wedding.",
    image: "/images/venues/612c8e185f6636d5ae9501b2d48254c9.jpg",
    stars: 5,
  },
  {
    id: 3,
    couple: "Ananya & Vikram",
    date: "March 2025",
    venue: "Burj Al Arab, Dubai",
    quote: "Saying 'I do' on the Burj Al Arab terrace above the Arabian Gulf was a dream. SoulsWed made our destination wedding completely effortless.",
    image: "/images/venues/d0cd0e0d28bf57bfd0f5c89ea00579f3.webp",
    stars: 5,
  },
  {
    id: 4,
    couple: "Divya & Karan",
    date: "January 2025",
    venue: "The Plaza Hotel, New York",
    quote: "A Grand Ballroom wedding at The Plaza felt straight out of a movie. SoulsWed made our Manhattan celebration absolutely seamless.",
    image: "/images/venues/b1ea9c403e0b88139c71eaa449a366d8.webp",
    stars: 5,
  },
  {
    id: 5,
    couple: "Sana & Aditya",
    date: "April 2025",
    venue: "Ayana Resort, Bali",
    quote: "Our cliff-top ceremony at Ayana with the legendary Bali sunset was magical. SoulsWed made planning from afar so simple — everything was 10/10!",
    image: "/images/venues/d26340e9eba57f7de2f3222e2e7ad456.jpg",
    stars: 5,
  },
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTestimonial = testimonials[activeIndex];

  const next = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));

  useEffect(() => {
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 relative overflow-hidden bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 mb-12 text-center relative z-10">
        <motion.p 
          className="text-sm font-bold uppercase tracking-widest mb-3 text-amber-500" 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Real Love Stories
        </motion.p>
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-slate-800"
          style={{ fontFamily: "var(--font-heading)" }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Couples Love SoulsWed
        </motion.h2>
      </div>

      <div className="max-w-[96%] xl:max-w-[1440px] 2xl:max-w-[1580px] mx-auto px-4 relative z-10">
        <div className="relative w-full h-[600px] md:h-[700px] rounded-[32px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.15)] group">
          
          {/* Background Images */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Image
                src={activeTestimonial.image}
                alt={activeTestimonial.couple}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:p-16">
            <div className="max-w-3xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[24px] p-6 md:p-10 shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute -top-10 -right-10 text-white/10 rotate-12">
                    <Quote className="w-32 h-32" />
                  </div>
                  
                  <div className="flex gap-1 mb-6 relative z-10">
                    {[...Array(activeTestimonial.stars)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow-md" />
                    ))}
                  </div>
                  
                  <p className="text-xl md:text-3xl leading-relaxed text-white font-medium italic mb-8 relative z-10" style={{ fontFamily: "var(--font-heading)" }}>
                    "{activeTestimonial.quote}"
                  </p>
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-1 bg-white/30 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-amber-400 rounded-full" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white drop-shadow-md">{activeTestimonial.couple}</h4>
                      <p className="text-sm text-white/80 font-semibold tracking-widest mt-1">
                        {activeTestimonial.venue} • {activeTestimonial.date}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-8 z-20">
            <button 
              onClick={prev} 
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/20 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all hover:bg-white hover:border-white group cursor-pointer shadow-lg"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-white group-hover:text-slate-900 transition-colors" />
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-8 z-20">
            <button 
              onClick={next} 
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/20 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all hover:bg-white hover:border-white group cursor-pointer shadow-lg" 
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-white group-hover:text-slate-900 transition-colors" />
            </button>
          </div>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5 bg-black/30 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className="h-2 rounded-full transition-all duration-300 cursor-pointer shadow-sm"
                style={{
                  width: activeIndex === idx ? "32px" : "8px",
                  background: activeIndex === idx ? "#fbbf24" : "rgba(255,255,255,0.5)",
                }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
