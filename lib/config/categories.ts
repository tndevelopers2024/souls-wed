import { Building2, BedDouble, ClipboardList, UtensilsCrossed, Flower2, Camera, Plane, Scissors, Palette, Flower, Activity, Mic, Headphones, Car, Map, Shirt, Crown, Briefcase, DoorOpen, ShoppingBag, BookOpen, Star, Zap, ShoppingCart, Package, Gem, Mail, Cake, Gift, Bath, Dumbbell, Droplet, Apple, Brain } from "lucide-react";
import { SparklesIcon } from "@/components/ui/sparkles";
import { SearchIcon } from "@/components/ui/search";
import { SmileIcon } from "@/components/ui/smile";
import { HeartIcon } from "@/components/ui/heart";
import { UserCheckIcon } from "@/components/ui/user-check";
import { LucideIcon } from "lucide-react";

export interface VendorCategory {
  name: string;
  tagline: string;
  slug: string;
  image?: string; // Optional since we are moving to icon-based
  icon: LucideIcon;
  features?: string; // e.g. "Booking feature with calendar and payment"
}

export const VENDOR_CATEGORIES: VendorCategory[] = [
  {
    name: "Venues / Banquet halls",
    tagline: "Dreamy halls & destinations",
    slug: "venues",
    icon: Building2,
    features: "Booking feature with calendar and payment"
  },
  {
    name: "Rooms",
    tagline: "Luxury stays for your guests",
    slug: "rooms",
    icon: BedDouble,
    features: "Booking feature with calendar and payment"
  },
  {
    name: "Wedding Planners",
    tagline: "Experts who handle it all",
    slug: "planners",
    icon: ClipboardList,
    features: "Booking feature with calendar and payment"
  },
  {
    name: "Caterers",
    tagline: "Cuisines that steal the show",
    slug: "caterers",
    icon: UtensilsCrossed,
    features: "Booking feature with calendar and payment"
  },
  {
    name: "Decorators",
    tagline: "Bring your vision to life",
    slug: "decorators",
    icon: Flower2,
    features: "Booking feature with calendar and payment"
  },
  {
    name: "Photographers & Videographers",
    tagline: "Capture timeless moments",
    slug: "photography",
    icon: Camera,
    features: "Booking feature with calendar and payment"
  },
  {
    name: "Chartered Airlines",
    tagline: "Arrive in ultimate style",
    slug: "airlines",
    icon: Plane,
    features: "Booking feature with calendar and payment"
  },
  {
    name: "Makeup Artists",
    tagline: "Flawless bridal beauty",
    slug: "makeup",
    icon: SparklesIcon,
    features: "Booking feature with calendar and payment"
  },
  {
    name: "Hairstylists",
    tagline: "Elegant styles for your day",
    slug: "hair",
    icon: Scissors,
    features: "Booking feature with calendar and payment"
  },
  {
    name: "Mehndi Artists",
    tagline: "Intricate bridal henna",
    slug: "mehndi",
    icon: Palette,
    features: "Booking feature with calendar and payment"
  },
  {
    name: "Florists",
    tagline: "Breathtaking floral designs",
    slug: "florists",
    icon: Flower,
    features: "Booking feature with calendar and payment"
  },
  {
    name: "Choreographers",
    tagline: "Dance your heart out",
    slug: "choreography",
    icon: Activity,
    features: "Booking feature with calendar and payment"
  },
  {
    name: "Singers & Bands",
    tagline: "Soulful melodies & bands",
    slug: "music",
    icon: Mic,
    features: "Booking feature with calendar and payment"
  },
  {
    name: "DJs",
    tagline: "Keep the dance floor alive",
    slug: "dj",
    icon: Headphones,
    features: "Booking feature with calendar and payment"
  },
  {
    name: "Logistics & Transport",
    tagline: "Seamless luxury logistics",
    slug: "transport",
    icon: Car,
    features: "Booking feature with calendar and payment"
  },
  {
    name: "Travel Agents",
    tagline: "Your honeymoon experts",
    slug: "travel",
    icon: Map,
    features: "Booking feature with calendar and payment"
  },
  {
    name: "Fashion Designers",
    tagline: "Bespoke designer wear",
    slug: "fashion-designers",
    icon: Shirt,
    features: "Appointments with calendar"
  },
  {
    name: "Bridal Wear",
    tagline: "Stunning bridal outfits",
    slug: "bridal-wear",
    icon: Crown,
    features: "Appointments with calendar"
  },
  {
    name: "Groom Wear",
    tagline: "Dapper groom collections",
    slug: "groom-wear",
    icon: Briefcase,
    features: "Appointments with calendar"
  },
  {
    name: "Detectives",
    tagline: "Background checks & security",
    slug: "detectives",
    icon: SearchIcon,
    features: "Booking feature with calendar and payment"
  },
  {
    name: "Entrance Specialists",
    tagline: "Grand bridal entry",
    slug: "entrance-specialists",
    icon: DoorOpen,
    features: "Booking feature with calendar and payment"
  },
  {
    name: "Personal Shoppers",
    tagline: "Curated wedding shopping",
    slug: "personal-shoppers",
    icon: ShoppingBag,
    features: "Booking feature with calendar and payment"
  },
  {
    name: "Priests",
    tagline: "Traditional wedding rituals",
    slug: "priests",
    icon: BookOpen,
    features: "Booking feature with calendar and payment"
  },
  {
    name: "Astrologers",
    tagline: "Horoscope & matchmaking",
    slug: "astrologers",
    icon: Star,
    features: "Booking feature with calendar and payment"
  },
  {
    name: "Laser Shows",
    tagline: "Spectacular light shows",
    slug: "laser-shows",
    icon: Zap,
    features: "Booking feature with calendar and payment"
  },
  {
    name: "Wedding Accessories",
    tagline: "Essential wedding addons",
    slug: "wedding-accessories",
    icon: ShoppingCart,
    features: "Ecommerce features"
  },
  {
    name: "Packaging Vendors",
    tagline: "Custom wedding packaging",
    slug: "packaging",
    icon: Package,
    features: "Appointments with calendar and payment"
  },
  {
    name: "Jewellers",
    tagline: "Exquisite bridal jewelry",
    slug: "jewellers",
    icon: Gem,
    features: "Ecommerce features with contact details"
  },
  {
    name: "Invitation Cards",
    tagline: "Beautiful wedding invites",
    slug: "invitations",
    icon: Mail,
    features: "Ecommerce features with contact details"
  },
  {
    name: "Cake Specialists",
    tagline: "Delicious wedding cakes",
    slug: "cakes",
    icon: Cake,
    features: "Booking feature with calendar and payment"
  },
  {
    name: "Gifts",
    tagline: "Thoughtful wedding favors",
    slug: "gifts",
    icon: Gift,
    features: "Ecommerce features with payment gateway"
  },
  {
    name: "Cosmetic Dentist",
    tagline: "Perfect your wedding smile",
    slug: "cosmetic-dentist",
    icon: SmileIcon,
    features: "Booking feature with calendar and payment"
  },
  {
    name: "Spa Treatments",
    tagline: "Relax & rejuvenate",
    slug: "spa",
    icon: Bath,
    features: "Booking feature with calendar and payment"
  },
  {
    name: "Gyms",
    tagline: "Get fit for the big day",
    slug: "gyms",
    icon: Dumbbell,
    features: "Booking feature with calendar and payment"
  },
  {
    name: "Skin Specialists",
    tagline: "Glowing bridal skin",
    slug: "skin-specialists",
    icon: Droplet,
    features: "Booking feature with calendar and payment"
  },
  {
    name: "Dieticians",
    tagline: "Healthy wedding diets",
    slug: "dieticians",
    icon: Apple,
    features: "Booking feature with calendar and payment"
  },
  {
    name: "Counsellors",
    tagline: "Pre-marital counseling",
    slug: "counsellors",
    icon: Brain,
    features: "Booking feature with calendar and payment"
  },
  {
    name: "Sexologists",
    tagline: "Intimacy experts",
    slug: "sexologists",
    icon: HeartIcon,
    features: "Booking feature with calendar and payment"
  },
  {
    name: "Image Consulting",
    tagline: "Personal styling & grooming",
    slug: "image-consulting",
    icon: UserCheckIcon,
    features: "Booking feature with calendar and payment"
  }
];

