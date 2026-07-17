"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How far in advance should I book my wedding venue?",
    answer: "For popular venues like Château de Chantilly or Burj Al Arab, we recommend booking at least 12 to 18 months in advance. For other venues, 9-12 months is usually sufficient. Our team can help you check real-time availability."
  },
  {
    question: "Do you offer full-service wedding planning?",
    answer: "Yes! SoulsWed provides comprehensive end-to-end wedding planning. From booking the venue and flights to coordinating with photographers, decorators, and makeup artists, we handle every detail so you can enjoy a flawless event."
  },
  {
    question: "Can I customize my vendor packages?",
    answer: "Absolutely. While we offer curated packages for convenience, every aspect of your wedding—from catering menus to floral arrangements—can be fully customized to match your unique vision and budget."
  },
  {
    question: "Are there any hidden fees when booking through SoulsWed?",
    answer: "No, transparency is our core value. The prices you see for venues and vendors include all standard taxes and service fees. Any additional customizations or premium upgrades will be clearly communicated before you confirm your booking."
  },
  {
    question: "Do you handle destination weddings and guest travel?",
    answer: "Yes, destination weddings are our specialty. We manage not only the venue and event logistics but also block bookings for flights, airport transfers, and luxury accommodations for all your guests."
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-transparent">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white dark:bg-[var(--sw-surface)] border border-gray-200">
               <HelpCircle className="w-6 h-6" style={{ color: "var(--sw-primary)" }} />
            </div>
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "var(--sw-primary)" }}>
            Got Questions?
          </p>
          <h2 className="section-heading font-extrabold tracking-tight">Frequently Asked Questions</h2>
          <p className="section-subtext max-w-2xl mx-auto">
            Everything you need to know about planning your dream wedding with SoulsWed.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`overflow-hidden transition-all duration-300 rounded-[20px] border ${isOpen ? 'border-primary-200/50 dark:border-primary-500/25 bg-white/80 dark:bg-[var(--sw-surface)]/80' : 'border-gray-200 bg-white/40 dark:bg-[var(--sw-surface)]/40 hover:bg-white/60 dark:bg-[var(--sw-surface)]/60'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left px-5 py-4 md:px-6 md:py-5 flex items-center justify-between gap-4"
                >
                  <h3 className="text-base md:text-lg font-bold pr-4" style={{ color: "var(--sw-navy)", fontFamily: "var(--font-heading)" }}>
                    {faq.question}
                  </h3>
                  <div 
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 shadow-sm ${isOpen ? 'rotate-180' : ''}`}
                    style={{ 
                      background: isOpen ? "var(--sw-primary)" : "var(--sw-white)", 
                      color: isOpen ? "var(--sw-white)" : "var(--sw-navy)",
                      border: isOpen ? "none" : "1px solid var(--sw-light-gray)"
                    }}
                  >
                    {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 md:px-6 md:pb-6 text-gray-700 leading-relaxed font-medium text-base md:text-md">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
