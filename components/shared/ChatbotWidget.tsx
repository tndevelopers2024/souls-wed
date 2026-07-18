"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, MessageCircle, Maximize2 } from "lucide-react";
import Image from "@/components/shared/CustomImage";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showFab, setShowFab] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowFab(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {(!isOpen && showFab) && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="w-12 h-12 rounded-full bg-[var(--sw-primary)] flex items-center justify-center text-white border-2 border-white/20"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-[88px] right-6 z-[100] w-[340px] max-w-[calc(100vw-2rem)] h-[480px] rounded-[32px] shadow-2xl flex flex-col"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 40%, rgba(253,246,240,0.95) 70%, rgba(238,116,41,0.15) 100%)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.4)",
            }}
          >
            {/* Header Controls */}
            <div className="flex justify-between items-start p-4 relative z-20">
              <button className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-slate-600 transition-colors">
                <Maximize2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 3D Robot Avatar */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="relative w-36 h-36"
              >
                <Image
                  src="/robot-avatar-orange.png"
                  alt="AI Assistant"
                  fill
                  className="object-contain drop-shadow-2xl"
                  unoptimized
                />
              </motion.div>
              {/* Fake shadow underneath robot */}
              <motion.div 
                animate={{ scale: [1, 0.7, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="w-16 h-2 bg-black/30 rounded-full mx-auto mt-2 blur-[4px]"
              />
            </div>

            {/* Chat Content / Suggestions */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4 relative z-10 pt-16">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-[18px] p-4 shadow-sm self-end max-w-[85%] border border-slate-100 cursor-pointer hover:shadow-md transition-shadow"
              >
                <p className="text-[14px] font-bold text-[var(--sw-primary)] mb-0.5 font-heading">Find a venue</p>
                <p className="text-[14px] text-slate-700">in Maldives under $5k</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-[18px] p-4 shadow-sm self-start max-w-[85%] border border-slate-100 cursor-pointer hover:shadow-md transition-shadow"
              >
                <p className="text-[14px] text-slate-700 font-medium">
                  Plan a relaxing getaway for <br/>
                  <span className="text-[var(--sw-primary)] font-bold font-heading">my parents...</span>
                </p>
              </motion.div>
            </div>

            {/* Input Area */}
            <div className="p-5 relative z-20">
              <div className="relative">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full h-[52px] bg-white rounded-2xl pl-4 pr-12 text-[14px] text-slate-800 placeholder-slate-400 focus:outline-none border-2 border-transparent focus:border-[var(--sw-primary)] shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center text-[var(--sw-primary)] hover:bg-[#EE7429]/10 transition-colors">
                  <Sparkles className="w-5 h-5" />
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
