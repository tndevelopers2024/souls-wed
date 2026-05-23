"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="py-20 px-4" style={{ background: "var(--sw-peach)" }}>
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "linear-gradient(135deg, var(--sw-orange), var(--sw-gold))" }}
          >
            <Mail className="w-7 h-7 text-white" />
          </div>
          <h2 className="section-heading mb-3">Get Exclusive Wedding Deals</h2>
          <p className="text-base mb-8" style={{ color: "var(--sw-steel)" }}>
            Join 50,000+ couples planning their dream wedding
          </p>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-3 py-4"
              style={{ color: "var(--sw-navy)" }}
            >
              <CheckCircle className="w-6 h-6" style={{ color: "var(--sw-orange)" }} />
              <span className="font-semibold">You&apos;re in! We&apos;ll be in touch soon.</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-3 bg-white rounded-2xl px-5 py-4 shadow-sm">
                <Mail className="w-5 h-5 flex-shrink-0" style={{ color: "var(--sw-steel)" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full text-sm outline-none bg-transparent"
                  style={{ color: "var(--sw-black)", fontFamily: "var(--font-body)" }}
                />
              </div>
              <button type="submit" className="btn-glass whitespace-nowrap">
                Subscribe
              </button>
            </form>
          )}

          <p className="text-xs mt-4" style={{ color: "var(--sw-steel)" }}>
            No spam. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
