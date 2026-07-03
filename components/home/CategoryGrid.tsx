"use client";

import { motion } from "framer-motion";
import {
  Building2, ClipboardList, Camera, Flower2, Sparkles, Plane,
  BedDouble, Ship, Music, Car, Scissors, Hand, PersonStanding,
  Headphones, UtensilsCrossed, Zap, PartyPopper, BookOpen, Mail,
  Smile, Leaf, Heart, Salad, Brain,
} from "lucide-react";

const categories = [
  { name: "Venues & Halls", icon: Building2, slug: "venues" },
  { name: "Wedding Planners", icon: ClipboardList, slug: "planners" },
  { name: "Photographers", icon: Camera, slug: "photographers" },
  { name: "Decorators", icon: Flower2, slug: "decorators" },
  { name: "Make-up Artists", icon: Sparkles, slug: "makeup" },
  { name: "Chartered Airlines", icon: Plane, slug: "airlines" },
  { name: "Accommodation", icon: BedDouble, slug: "accommodation" },
  { name: "Cruises", icon: Ship, slug: "cruises" },
  { name: "Singers & Bands", icon: Music, slug: "singers" },
  { name: "Logistics & Transport", icon: Car, slug: "logistics" },
  { name: "Hairstylists", icon: Scissors, slug: "hairstylists" },
  { name: "Mehndi Artists", icon: Hand, slug: "mehndi" },
  { name: "Choreographers", icon: PersonStanding, slug: "choreographers" },
  { name: "DJs", icon: Headphones, slug: "djs" },
  { name: "Caterers", icon: UtensilsCrossed, slug: "caterers" },
  { name: "Laser Shows", icon: Zap, slug: "laser-shows" },
  { name: "Entrance Specialists", icon: PartyPopper, slug: "entrance" },
  { name: "Priests", icon: BookOpen, slug: "priests" },
  { name: "Invitation Cards", icon: Mail, slug: "invitations" },
  { name: "Cosmetic Dentist", icon: Smile, slug: "dentist" },
  { name: "Spa Treatments", icon: Leaf, slug: "spa" },
  { name: "Skin Specialists", icon: Heart, slug: "skin" },
  { name: "Dieticians", icon: Salad, slug: "dieticians" },
  { name: "Counsellors", icon: Brain, slug: "counsellors" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function CategoryGrid() {
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
          <h2 className="section-heading">Everything for Your Perfect Day</h2>
          <p className="section-subtext">Browse all 24 wedding categories</p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.a
                key={cat.slug}
                href={`/category/${cat.slug}`}
                variants={itemVariants}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group flex flex-col items-center gap-3 p-5 rounded-[32px] cursor-pointer text-center"
                style={{
                  background: "rgba(255,255,255,0.6)",
                  border: "1px solid var(--sw-light-gray)",
                  backdropFilter: "blur(10px)",
                  transition: "box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px rgba(238,116,41,0.25)`;
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--sw-orange)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--sw-light-gray)";
                }}
              >
                {/* Icon container */}
                <div
                  className="w-14 h-14 flex items-center justify-center rounded-3xl"
                  style={{
                    background: "linear-gradient(135deg, var(--sw-orange), var(--sw-gold))",
                  }}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span
                  className="text-xs font-semibold leading-tight"
                  style={{ color: "var(--sw-navy)" }}
                >
                  {cat.name}
                </span>
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
