"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    couple: "Priya & Arjun",
    location: "Paris",
    quote: "Our fairy-tale wedding at Château de Chantilly was beyond anything we imagined — the gardens, the grand ballroom, every detail perfectly coordinated by SoulsWed.",
  },
  {
    id: 2,
    couple: "Meera & Rohan",
    location: "London",
    quote: "We celebrated at The Savoy and it was pure Edwardian elegance. SoulsWed lined up every vendor flawlessly for our riverside London wedding.",
  },
  {
    id: 3,
    couple: "Ananya & Vikram",
    location: "Dubai",
    quote: "Saying 'I do' on the Burj Al Arab terrace above the Arabian Gulf was a dream. SoulsWed made our destination wedding completely effortless.",
  },
  {
    id: 4,
    couple: "Divya & Karan",
    location: "New York",
    quote: "A Grand Ballroom wedding at The Plaza felt straight out of a movie. SoulsWed made our Manhattan celebration absolutely seamless.",
  },
  {
    id: 5,
    couple: "Sana & Aditya",
    location: "Bali",
    quote: "Our cliff-top ceremony at Ayana with the legendary Bali sunset was magical. SoulsWed made planning from afar so simple — everything was 10/10!",
  },
  {
    id: 6,
    couple: "Sneha & Rahul",
    location: "Udaipur",
    quote: "The palace backdrop was surreal. SoulsWed took care of all the logistics, so we just enjoyed our big day with our loved ones.",
  },
  {
    id: 7,
    couple: "Neha & Siddharth",
    location: "Goa",
    quote: "A stunning beach wedding! The colors, the decor, the vibe—everything was just right. Highly recommend their destination experts.",
  },
  {
    id: 8,
    couple: "Kavya & Manish",
    location: "Lake Como",
    quote: "I never thought planning an Italian wedding from India would be this easy. They handled everything from florists to catering brilliantly.",
  },
  {
    id: 9,
    couple: "Aisha & Kabir",
    location: "Jaipur",
    quote: "Royal, majestic, and completely hassle-free. SoulsWed made our dream Rajasthan wedding a stunning reality.",
  }
];

const TestimonialCard = ({ t }: { t: any }) => (
  <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-shadow duration-300 w-full mb-6 rounded-2xl border border-white">
    <p className="text-[14px] text-slate-600 italic leading-[1.6] mb-6" style={{ fontFamily: "var(--font-inter)" }}>
      {t.quote}
    </p>
    
    <div className="flex items-center gap-4">
      <div 
        className="w-9 h-9 flex items-center justify-center text-[var(--sw-primary)] text-sm font-bold rounded-lg bg-[#FFF5EF] border border-[#FFE1D1]"
      >
        {t.couple.charAt(0)}
      </div>
      <div>
        <h4 className="font-bold text-[13px]" style={{ color: "var(--sw-navy)" }}>{t.couple}</h4>
        <p className="text-[10px] tracking-widest uppercase mt-0.5 font-medium" style={{ color: "var(--sw-primary)" }}>{t.location}</p>
      </div>
    </div>
  </div>
);

export default function TestimonialsSection() {
  const col1 = [testimonials[0], testimonials[3], testimonials[6]];
  const col2 = [testimonials[1], testimonials[4], testimonials[7]];
  const col3 = [testimonials[2], testimonials[5], testimonials[8]];

  return (
    <section className="py-16 md:py-32 relative bg-orange-50/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-16 gap-4 md:gap-6 relative z-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--sw-primary)" }}>
              CLIENT STORIES
            </p>
            <h2 className="section-heading">
              Planned with <span className="italic" style={{ color: "var(--sw-primary)" }}>love</span>, cherished forever
            </h2>
            <p className="section-subtext mx-auto">Hear what our couples have to say about their special day</p>
          </div>
        </div>

        {/* Marquee Columns */}
        <div className="h-[500px] md:h-[750px] flex gap-6 justify-center overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] -mx-4 px-4">
          
          {/* Column 1 (Scrolls Down/Up) */}
          <motion.div 
            className="w-full max-w-sm flex flex-col"
            animate={{ y: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 35, repeat: Infinity }}
          >
            {[...col1, ...col1].map((t, idx) => (
              <TestimonialCard key={`col1-${idx}`} t={t} />
            ))}
          </motion.div>

          {/* Column 2 (Scrolls Opposite for effect) */}
          <motion.div 
            className="w-full max-w-sm flex-col hidden md:flex"
            animate={{ y: ["-50%", "0%"] }}
            transition={{ ease: "linear", duration: 45, repeat: Infinity }}
          >
            {[...col2, ...col2].map((t, idx) => (
              <TestimonialCard key={`col2-${idx}`} t={t} />
            ))}
          </motion.div>

          {/* Column 3 */}
          <motion.div 
            className="w-full max-w-sm flex-col hidden lg:flex"
            animate={{ y: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 40, repeat: Infinity }}
          >
            {[...col3, ...col3].map((t, idx) => (
              <TestimonialCard key={`col3-${idx}`} t={t} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
