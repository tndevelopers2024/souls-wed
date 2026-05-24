"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#EE7429] opacity/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#FCCB11] opacity/5 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-card max-w-lg w-full p-10 text-center relative z-10"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring", bounce: 0.5 }}
          className="mx-auto w-24 h-24 bg-[#EED9C4]/30 rounded-full flex items-center justify-center mb-8"
        >
          <SearchX className="w-12 h-12 text-[#EE7429]" />
        </motion.div>

        <h1 className="section-heading mb-4">404</h1>
        <h2 className="text-2xl font-bold text-[#37475A] mb-4 font-heading">
          Page Not Found
        </h2>
        <p className="section-subtext mb-10">
          Oops! The page you are looking for seems to have wandered off. Let's
          get you back to planning your perfect wedding.
        </p>

        <motion.div>
          <Link
            href="/"
            className="bg-[#FCCB11]/90 backdrop-blur-md border border-white/30 rounded-2xl px-8 py-[14px] font-bold text-[#37475A] shadow-[0_4px_20px_rgba(252,203,17,0.4)] inline-flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
