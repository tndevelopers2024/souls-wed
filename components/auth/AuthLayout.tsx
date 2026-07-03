"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 md:p-12 bg-slate-50 relative overflow-hidden font-body">
      {/* Background orbs for premium feel */}
      <div
        className="orb w-[30rem] h-[30rem] -top-32 -left-32 opacity-25 pointer-events-none"
        style={{ background: "var(--sw-orange)", filter: "blur(120px)" }}
      />
      <div
        className="orb w-[35rem] h-[35rem] -bottom-32 -right-32 opacity-25 pointer-events-none"
        style={{ background: "var(--sw-gold)", filter: "blur(120px)" }}
      />
      <div
        className="orb w-[25rem] h-[25rem] top-1/3 left-1/3 opacity-15 pointer-events-none"
        style={{ background: "var(--sw-peach)", filter: "blur(100px)", animationDelay: "2s" }}
      />

      {/* Main card wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg z-10"
      >
        {/* Branding header inside card wrapper */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center group mb-4">
            <Image 
              src="/logo/logo-by-soulswed.png"
              alt="SoulsWed Logo"
              width={200}
              height={60}
              className="h-10 w-auto transition-transform group-hover:scale-105"
              priority
            />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-slate-900 text-center" style={{ fontFamily: "var(--font-heading)" }}>
            {title}
          </h1>
          <p className="text-slate-505 text-sm text-center max-w-sm">{subtitle}</p>
        </div>

        {/* Form card with high-end glassmorphism */}
        <div
          className="p-8 md:p-10 rounded-3xl"
          style={{
            background: "rgba(255, 255, 255, 0.75)",
            border: "1px solid rgba(255, 255, 255, 0.5)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
          }}
        >
          {children}
        </div>

        {/* Centered back home navigation */}
        <div className="mt-8 flex justify-center text-xs font-semibold">
          <Link href="/" className="flex items-center gap-2 bg-orange-600 text-white hover:bg-orange-700 px-5 py-2.5 rounded-full transition-colors shadow-sm">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
