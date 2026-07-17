"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 relative">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-400/10 blur-[120px] rounded-full animate-[float-orb-1_20s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[60%] bg-amber-400/10 blur-[120px] rounded-full animate-[float-orb-2_25s_ease-in-out_infinite]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-4xl font-extrabold mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-heading)", color: "var(--sw-navy)" }}
          >
            Inquire With <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-amber-500">Us</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm text-slate-600 dark:text-stone-300 max-w-2xl mx-auto font-medium"
          >
            Begin your journey towards a flawless celebration. Reach out to schedule a bespoke consultation with our luxury wedding experts.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          {/* Contact Info Cards */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            {[
              {
                icon: Phone,
                title: "Call Us",
                content: <><p>+91 98765 43210</p><p>+91 80412 48273</p></>
              },
              {
                icon: Mail,
                title: "Email Us",
                content: <><p>hello@soulswed.com</p><p>vendors@soulswed.com</p></>
              },
              {
                icon: MapPin,
                title: "Visit Us",
                content: <p className="leading-relaxed">123 Wedding Boulevard,<br/>Mumbai, India 400001</p>
              }
            ].map((info, idx) => (
              <div 
                key={idx}
                className="group bg-white/70 dark:bg-[var(--sw-surface)]/70 backdrop-blur-xl rounded-[28px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 flex items-start gap-5 hover:shadow-[0_20px_40px_rgba(238,116,41,0.08)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-100 to-amber-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <info.icon className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold mb-1" style={{ color: "var(--sw-navy)", fontFamily: "var(--font-heading)" }}>
                    {info.title}
                  </h3>
                  <div className="text-xs text-slate-600 dark:text-stone-300 font-medium">
                    {info.content}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/80 dark:bg-[var(--sw-surface)]/80 backdrop-blur-2xl rounded-[32px] p-8 md:p-12 shadow-[0_24px_60px_rgba(238,116,41,0.08)] border border-white">
              <h2 className="text-xl font-extrabold mb-6" style={{ color: "var(--sw-navy)", fontFamily: "var(--font-heading)" }}>
                Request a Consultation
              </h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-[10px] font-bold tracking-widest text-slate-500 dark:text-stone-400 uppercase ml-2 mb-1">First Name</label>
                    <input id="firstName" name="firstName" type="text" className="w-full text-sm bg-white/50 border border-slate-200 dark:border-white/10/60 rounded-xl px-5 py-3 outline-none focus:bg-white dark:focus:bg-[var(--sw-surface)] focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 transition-all text-slate-800 dark:text-stone-200 placeholder-slate-400 font-medium shadow-sm" placeholder="Your First Name" required />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="lastName" className="block text-[10px] font-bold tracking-widest text-slate-500 dark:text-stone-400 uppercase ml-2 mb-1">Last Name</label>
                    <input id="lastName" name="lastName" type="text" className="w-full text-sm bg-white/50 border border-slate-200 dark:border-white/10/60 rounded-xl px-5 py-3 outline-none focus:bg-white dark:focus:bg-[var(--sw-surface)] focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 transition-all text-slate-800 dark:text-stone-200 placeholder-slate-400 font-medium shadow-sm" placeholder="Your Last Name" required />
                  </div>
                </div>
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-[10px] font-bold tracking-widest text-slate-500 dark:text-stone-400 uppercase ml-2 mb-1">Email Address</label>
                  <input id="email" name="email" type="email" className="w-full text-sm bg-white/50 border border-slate-200 dark:border-white/10/60 rounded-xl px-5 py-3 outline-none focus:bg-white dark:focus:bg-[var(--sw-surface)] focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 transition-all text-slate-800 dark:text-stone-200 placeholder-slate-400 font-medium shadow-sm" placeholder="your@email.com" required />
                </div>
                <div className="space-y-1">
                  <label htmlFor="message" className="block text-[10px] font-bold tracking-widest text-slate-500 dark:text-stone-400 uppercase ml-2 mb-1">Message</label>
                  <textarea id="message" name="message" rows={4} className="w-full text-sm bg-white/50 border border-slate-200 dark:border-white/10/60 rounded-xl px-5 py-3 outline-none focus:bg-white dark:focus:bg-[var(--sw-surface)] focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 transition-all text-slate-800 dark:text-stone-200 placeholder-slate-400 font-medium resize-none shadow-sm" placeholder="Tell us about your vision, preferred destinations, or any dates you have in mind..." required></textarea>
                </div>
                <button 
                  type="button" 
                  className="w-full relative overflow-hidden text-white font-extrabold tracking-wide uppercase text-sm rounded-full px-6 py-4 transition-all transform hover:-translate-y-1 shadow-[0_8px_20px_rgba(238,116,41,0.25)] hover:shadow-[0_12px_25px_rgba(238,116,41,0.35)] group mt-2"
                  style={{ background: "linear-gradient(135deg, var(--sw-primary), #f59e0b)" }}
                >
                  <span className="relative z-10">Submit Inquiry</span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[navbar-shimmer_1.5s_infinite] z-0" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
