"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin } from "lucide-react";

const destinations = [
  { city: "Mumbai", country: "India", vendors: 142, image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=700&q=80", large: true },
  { city: "Goa", country: "India", vendors: 98, image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=700&q=80", large: true },
  { city: "Udaipur", country: "India", vendors: 76, image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=700&q=80", large: true },
  { city: "Delhi", country: "India", vendors: 167, image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=500&q=80", large: false },
  { city: "Jaipur", country: "India", vendors: 89, image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=500&q=80", large: false },
  { city: "Dubai", country: "UAE", vendors: 54, image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&q=80", large: false },
  { city: "Bali", country: "Indonesia", vendors: 43, image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&q=80", large: false },
  { city: "Maldives", country: "Maldives", vendors: 28, image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=500&q=80", large: false },
];

function DestinationCard({ city, country, vendors, image, delay }: {
  city: string; country: string; vendors: number; image: string; delay: number;
}) {
  return (
    <motion.div
      className="relative rounded-3xl overflow-hidden cursor-pointer group h-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <Image
        src={image}
        alt={city}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      {/* Overlay */}
      <div
        className="absolute inset-0 transition-all duration-300"
        style={{
          background: "linear-gradient(to top, rgba(33,37,41,0.75) 0%, rgba(33,37,41,0.1) 60%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "rgba(33,37,41,0.2)" }}
      />
      {/* Info pill */}
      <div className="absolute bottom-4 left-4">
        <div className="glass flex items-center gap-2 px-4 py-2 rounded-full !rounded-full">
          <MapPin className="w-4 h-4" style={{ color: "var(--sw-gold)" }} />
          <span className="text-white font-bold text-sm">{city}</span>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full !rounded-full"
            style={{ background: "var(--sw-gold)", color: "var(--sw-navy)" }}
          >
            {vendors} vendors
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function PopularDestinations() {
  const large = destinations.filter((d) => d.large);
  const small = destinations.filter((d) => !d.large);

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-heading">Say &apos;I Do&apos; Anywhere in the World</h2>
          <p className="section-subtext">From royal palaces to tropical beaches — we cover it all</p>
        </motion.div>

        {/* Row 1 — large cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {large.map((d, i) => (
            <div key={d.city} className="h-72">
              <DestinationCard {...d} delay={i * 0.1} />
            </div>
          ))}
        </div>

        {/* Row 2 — small cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {small.map((d, i) => (
            <div key={d.city} className="h-48">
              <DestinationCard {...d} delay={0.3 + i * 0.08} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
