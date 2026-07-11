"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "@/components/shared/CustomImage";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { venues } from "@/lib/venues-data";

const baseTestimonials = [
  {
    id: 1,
    couple: "Priya & Arjun",
    date: "February 2025",
    venueName: "Château de Chantilly",
    venueLocation: "Paris",
    quote: "Our fairy-tale wedding at Château de Chantilly was beyond anything we imagined — the gardens, the grand ballroom, every detail perfectly coordinated by SoulsWed.",
    stars: 5,
  },
  {
    id: 2,
    couple: "Meera & Rohan",
    date: "December 2024",
    venueName: "The Savoy",
    venueLocation: "London",
    quote: "We celebrated at The Savoy and it was pure Edwardian elegance. SoulsWed lined up every vendor flawlessly for our riverside London wedding.",
    stars: 5,
  },
  {
    id: 3,
    couple: "Ananya & Vikram",
    date: "March 2025",
    venueName: "Burj Al Arab",
    venueLocation: "Dubai",
    quote: "Saying 'I do' on the Burj Al Arab terrace above the Arabian Gulf was a dream. SoulsWed made our destination wedding completely effortless.",
    stars: 5,
  },
  {
    id: 4,
    couple: "Divya & Karan",
    date: "January 2025",
    venueName: "The Plaza Hotel",
    venueLocation: "New York",
    quote: "A Grand Ballroom wedding at The Plaza felt straight out of a movie. SoulsWed made our Manhattan celebration absolutely seamless.",
    stars: 5,
  },
  {
    id: 5,
    couple: "Sana & Aditya",
    date: "April 2025",
    venueName: "Ayana Resort and Spa",
    venueLocation: "Bali",
    quote: "Our cliff-top ceremony at Ayana with the legendary Bali sunset was magical. SoulsWed made planning from afar so simple — everything was 10/10!",
    stars: 5,
  },
];

const testimonials = baseTestimonials.map(t => {
  const venueData = venues.find(v => v.name === t.venueName);
  return {
    ...t,
    venue: `${t.venueName}, ${t.venueLocation}`,
    image: venueData?.image || "/images/venues/default.jpg",
  };
});

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const next = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [isHovered, activeIndex]);

  // Helper to determine the relative position of the card for the stack effect
  const getRelativeIndex = (idx: number) => {
    let diff = idx - activeIndex;
    if (diff < 0) diff += testimonials.length;
    return diff;
  };

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-bold uppercase tracking-[0.3em] mb-4" style={{ color: "var(--sw-orange)" }}>
            Real Love Stories
          </p>
          <h2 className="section-heading text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
            Couples <span className="italic font-light" style={{ color: "var(--sw-orange)" }}>Love</span><br />
            SoulsWed
          </h2>
        </motion.div>

        <div 
          className="grid lg:grid-cols-12 gap-16 lg:gap-8 items-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          
          {/* Left Side: Dynamic Text Content */}
          <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1 relative min-h-[350px]">
            <Quote className="w-20 h-20 mb-8 absolute -top-10 -left-8 opacity-10" style={{ color: "var(--sw-gold)" }} />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10"
              >
                <div className="flex gap-1.5 mb-8">
                   {[...Array(testimonials[activeIndex].stars)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-current" style={{ color: "var(--sw-gold)" }} />
                   ))}
                </div>
                
                <p className="text-2xl md:text-3xl lg:text-4xl leading-[1.4] font-medium mb-12 text-gray-800" style={{ fontFamily: "var(--font-heading)" }}>
                  "{testimonials[activeIndex].quote}"
                </p>
                
                <div className="flex items-center gap-6">
                  <div className="h-0.5 w-12" style={{ background: "var(--sw-orange)" }} />
                  <div>
                    <h4 className="text-2xl font-bold" style={{ color: "var(--sw-navy)" }}>{testimonials[activeIndex].couple}</h4>
                    <p className="text-sm font-bold tracking-widest uppercase mt-2" style={{ color: "var(--sw-orange)" }}>
                      {testimonials[activeIndex].venue} • {testimonials[activeIndex].date}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center gap-8 mt-16 pt-10 border-t border-gray-300/50">
              <div className="flex gap-4">
                 <button 
                   onClick={prev} 
                   className="w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110 shadow-sm bg-white"
                   style={{ border: "1px solid var(--sw-light-gray)", color: "var(--sw-navy)" }}
                   aria-label="Previous story"
                 >
                   <ChevronLeft className="w-6 h-6" />
                 </button>
                 <button 
                   onClick={next} 
                   className="w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110 shadow-xl"
                   style={{ background: "var(--sw-navy)", color: "var(--sw-white)" }}
                   aria-label="Next story"
                 >
                   <ChevronRight className="w-6 h-6" />
                 </button>
              </div>
              
              {/* Interactive Dots */}
              <div className="flex gap-3 ml-4">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`transition-all duration-300 rounded-full ${
                      idx === activeIndex ? "w-12 h-3" : "w-3 h-3 hover:bg-gray-400"
                    }`}
                    style={{ background: idx === activeIndex ? "var(--sw-orange)" : "var(--sw-light-gray)" }}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Spectacular Photo Stack */}
          <div className="lg:col-span-7 relative h-[450px] md:h-[650px] w-full order-1 lg:order-2 flex justify-center items-center">
             <div className="relative w-full max-w-[500px] h-[400px] md:h-[550px]">
               {testimonials.map((testimonial, idx) => {
                 const diff = getRelativeIndex(idx);
                 const isPrev = diff === testimonials.length - 1;
                 const isVisible = diff < 3 || isPrev;
                 
                 return (
                   <motion.div
                     key={testimonial.id}
                     animate={{
                       x: diff === 0 ? 0 : diff === 1 ? 50 : diff === 2 ? 100 : isPrev ? -50 : 150,
                       y: diff === 0 ? 0 : diff === 1 ? 30 : diff === 2 ? 60 : isPrev ? -30 : 90,
                       rotate: diff === 0 ? -2 : diff === 1 ? 4 : diff === 2 ? -2 : isPrev ? -6 : 6,
                       scale: diff === 0 ? 1 : diff === 1 ? 0.92 : diff === 2 ? 0.84 : isPrev ? 0.95 : 0.75,
                       opacity: isVisible ? 1 : 0,
                       zIndex: diff === 0 ? 30 : diff === 1 ? 20 : diff === 2 ? 10 : isPrev ? 5 : 0,
                     }}
                     transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                     whileHover={diff === 0 ? { scale: 1.02, rotate: 0 } : {}}
                     className="absolute inset-0 w-full h-full rounded-[2.5rem] overflow-hidden bg-white p-3 sm:p-4 border border-gray-200"
                     style={{ pointerEvents: diff === 0 ? "auto" : "none" }}
                   >
                     <div className="relative w-full h-full rounded-[1.8rem] overflow-hidden">
                       <Image 
                         src={testimonial.image} 
                         alt={testimonial.couple} 
                         fill 
                         className="object-cover"
                         sizes="(max-width: 1024px) 100vw, 50vw"
                         priority={diff === 0}
                       />
                     </div>
                   </motion.div>
                 );
               })}
             </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

