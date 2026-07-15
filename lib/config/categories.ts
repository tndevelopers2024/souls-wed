import {
  Building2,
  BedDouble,
  ClipboardList,
  UtensilsCrossed,
  Flower2,
  Camera,
  Plane,
  Sparkles,
  Scissors,
  Hand,
  Leaf,
  PersonStanding
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
  {
    name: "Photographers",
    tagline: "From moments to memories",
    slug: "photographers",
    image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=900&q=85",
    icon: Camera,
  },
  {
    name: "Chartered Airlines",
    tagline: "Fly in style to your wedding",
    slug: "chartered-airlines",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=900&q=85",
    icon: Plane,
  },
  {
    name: "Makeup Artists",
    tagline: "Beauty and the brushes",
    slug: "makeup",
    image: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=900&q=85",
    icon: Sparkles,
  },
  {
    name: "Hairstylists",
    tagline: "Flawless looks, head to toe",
    slug: "hairstylists",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=85",
    icon: Scissors,
  },
  {
    name: "Mehndi Artists",
    tagline: "Intricate designs for your day",
    slug: "mehndi",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&q=85",
    icon: Hand,
  },
  {
    name: "Florists",
    tagline: "Blooms that enchant & inspire",
    slug: "florists",
    image: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=900&q=85",
    icon: Leaf,
  },
  {
    name: "Choreographers",
    tagline: "Dance moves that wow",
    slug: "choreographers",
    image: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=900&q=85",
    icon: PersonStanding,
  },
];
