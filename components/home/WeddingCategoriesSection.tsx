"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Venues",
    tagline: "Dreamy halls & destinations",
    slug: "venues",
    image: "/soulswed/acc_Venue.jpg",
  },
  {
    name: "Planners",
    tagline: "Experts who handle it all",
    slug: "planners",
    image: "/soulswed/acc_Planners.jpg",
  },
  {
    name: "Photographers",
    tagline: "From moments to memories",
    slug: "photographers",
    image: "/soulswed/acc_Photographers.jpg",
  },
  {
    name: "Makeup Artists",
    tagline: "Beauty and the brushes",
    slug: "makeup",
    image: "/soulswed/Makeupartists.jpg",
  },
  {
    name: "Decorators",
    tagline: "Bring your vision to life",
    slug: "decorators",
    image: "/soulswed/acc_decorators1.jpg",
  },
  {
    name: "Sakhi Service",
    tagline: "Your personal wedding guide",
    slug: "sakhi",
    image: "/soulswed/sakhi4.png",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

export default function WeddingCategoriesSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-end justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-2"
              style={{ color: "var(--sw-orange)" }}
            >
              Browse By Category
            </p>
            <h2 className="section-heading">Wedding Categories</h2>
            <p className="section-subtext">Find every vendor you need for the perfect day</p>
          </div>
          <a
            href="/categories"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:gap-3"
            style={{ color: "var(--sw-navy)", border: "1.5px solid var(--sw-navy)" }}
          >
            View All <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* 3×2 Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {categories.map((cat) => (
            <motion.a
              key={cat.slug}
              href={`/category/${cat.slug}`}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="relative h-44 md:h-56 rounded-[32px] overflow-hidden cursor-pointer group"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Gradient */}
              <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(47,56,67,0.78) 100%)",
                }}
              />
              {/* Orange accent on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "rgba(238,116,41,0.18)" }}
              />
              {/* Text */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3
                  className="text-lg md:text-xl font-bold text-white leading-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {cat.name}
                </h3>
                <p className="text-xs md:text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.75)" }}>
                  {cat.tagline}
                </p>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
