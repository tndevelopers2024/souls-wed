"use client";

import { motion } from "framer-motion";
import Image from "@/components/shared/CustomImage";
import Link from "next/link";
import { MapPin } from "lucide-react";

const destinations = [
  {
    name: "Paris, France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800",
    venues: 12,
  },
  {
    name: "Lake Como, Italy",
    image: "https://images.unsplash.com/photo-1559817730-8488e0a301ec?q=80&w=800",
    venues: 8,
  },
  {
    name: "Udaipur, India",
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=800",
    venues: 24,
  },
  {
    name: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800",
    venues: 18,
  },
  {
    name: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800",
    venues: 15,
  },
  {
    name: "Dubai, UAE",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800",
    venues: 30,
  },
];

export default function DestinationsPage() {
  return (
    <div className="min-h-screen bg-[var(--sw-white)]">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#fdf6f0] to-[#f5dcc9] -z-10" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl mx-auto">
          <p className="text-[var(--sw-primary)] font-bold tracking-widest uppercase text-sm mb-4">Discover the World</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-[var(--sw-navy)] font-heading leading-tight">
            Top Wedding <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--sw-primary)] to-[#f5a623]">Destinations</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            From the romantic streets of Paris to the royal palaces of Udaipur, explore the most breathtaking backdrops for your love story.
          </p>
        </motion.div>
      </div>

      {/* Destinations Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest, i) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={`/venues?city=${dest.name.split(',')[0]}`} className="group block relative h-[400px] rounded-3xl overflow-hidden shadow-md">
                <Image src={dest.image} alt={dest.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300" />
                
                <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-[var(--sw-primary)]" />
                    <h3 className="text-2xl font-bold font-heading">{dest.name}</h3>
                  </div>
                  <p className="text-sm text-white/80 font-medium">Explore {dest.venues} luxury venues &rarr;</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
