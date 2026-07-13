"use client";

import Image from "@/components/shared/CustomImage";
import { motion } from "framer-motion";

const INSPIRATION_ITEMS = [
  { id: 1, title: "Tuscan Sunsets", category: "Destination", img: "/soulswed/venue.jpg" },
  { id: 2, title: "Modern Minimalist", category: "Decor & Design", img: "/soulswed/decorators.jpg" },
  { id: 3, title: "Royal Heritage", category: "Luxury Venues", img: "/images/shared/9368d5bcfe07eea016da3567805d57c9.jpg" },
  { id: 4, title: "Boho Chic Beach", category: "Style", img: "/soulswed/venue.jpg" },
  { id: 5, title: "Enchanted Forest", category: "Real Weddings", img: "/images/shared/9368d5bcfe07eea016da3567805d57c9.jpg" },
  { id: 6, title: "Classic Elegance", category: "Style", img: "/soulswed/decorators.jpg" },
];

export default function InspirationPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold mb-6"
            style={{ fontFamily: "var(--font-heading)", color: "var(--sw-navy)" }}
          >
            Real Weddings & <span className="text-orange-500">Inspiration</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Discover breathtaking aesthetics, trendsetting designs, and timeless elegance curated from our finest global celebrations.
          </motion.p>
        </div>

        {/* Gallery Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {INSPIRATION_ITEMS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group rounded-[24px] overflow-hidden break-inside-avoid shadow-lg cursor-pointer"
            >
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: index % 2 === 0 ? "3/4" : "4/3" }}>
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-orange-300 text-xs font-bold uppercase tracking-wider mb-2">{item.category}</p>
                  <h3 className="text-white text-xl font-heading font-bold">{item.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
