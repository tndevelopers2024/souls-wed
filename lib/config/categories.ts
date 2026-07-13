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
    image: "/soulswed/acc_Venue.jpg",
    icon: Building2,
  },
  {
    name: "Rooms",
    tagline: "Luxury stays for your guests",
    slug: "rooms",
    image: "/soulswed/hotels.jpg",
    icon: BedDouble,
  },
  {
    name: "Planners",
    tagline: "Experts who handle it all",
    slug: "planners",
    image: "/soulswed/acc_Planners.jpg",
    icon: ClipboardList,
  },
  {
    name: "Caterers",
    tagline: "Cuisines that steal the show",
    slug: "caterers",
    image: "/soulswed/caterers.jpg",
    icon: UtensilsCrossed,
  },
  {
    name: "Decorators",
    tagline: "Bring your vision to life",
    slug: "decorators",
    image: "/soulswed/acc_decorators1.jpg",
    icon: Flower2,
  },
  {
    name: "Photographers",
    tagline: "From moments to memories",
    slug: "photographers",
    image: "/soulswed/acc_Photographers.jpg",
    icon: Camera,
  },
  {
    name: "Chartered Airlines",
    tagline: "Fly in style to your wedding",
    slug: "chartered-airlines",
    image: "/soulswed/charters.jpg",
    icon: Plane,
  },
  {
    name: "Makeup Artists",
    tagline: "Beauty and the brushes",
    slug: "makeup",
    image: "/soulswed/acc_Makeupartists.jpg",
    icon: Sparkles,
  },
  {
    name: "Hairstylists",
    tagline: "Flawless looks, head to toe",
    slug: "hairstylists",
    image: "/soulswed/pageimg_makeup.jpg",
    icon: Scissors,
  },
  {
    name: "Mehndi Artists",
    tagline: "Intricate designs for your day",
    slug: "mehndi",
    image: "/soulswed/sakhi4.png",
    icon: Hand,
  },
  {
    name: "Florists",
    tagline: "Blooms that enchant & inspire",
    slug: "florists",
    image: "/soulswed/decorators.jpg",
    icon: Leaf,
  },
  {
    name: "Choreographers",
    tagline: "Dance moves that wow",
    slug: "choreographers",
    image: "/soulswed/sakhi.jpg",
    icon: PersonStanding,
  },
];
