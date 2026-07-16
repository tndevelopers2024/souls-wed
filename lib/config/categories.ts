import {
  Building2,
  BedDouble,
  ClipboardList,
  UtensilsCrossed,
  Flower2,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface VendorCategory {
  name: string;
  tagline: string;
  slug: string;
  image: string;
  icon: LucideIcon;
}

export const VENDOR_CATEGORIES: VendorCategory[] = [
  {
    name: "Venues",
    tagline: "Dreamy halls & destinations",
    slug: "venues",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900&q=85",
    icon: Building2,
  },
  {
    name: "Rooms",
    tagline: "Luxury stays for your guests",
    slug: "rooms",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=85",
    icon: BedDouble,
  },
  {
    name: "Planners",
    tagline: "Experts who handle it all",
    slug: "planners",
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900&q=85",
    icon: ClipboardList,
  },
  {
    name: "Caterers",
    tagline: "Cuisines that steal the show",
    slug: "caterers",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=85",
    icon: UtensilsCrossed,
  },
  {
    name: "Decorators",
    tagline: "Bring your vision to life",
    slug: "decorators",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=85",
    icon: Flower2,
  },
];
