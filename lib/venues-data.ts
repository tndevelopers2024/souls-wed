export interface VenueReview {
  id: number;
  author: string;
  avatar: string;
  date: string;
  rating: number;
  text: string;
}

export interface Venue {
  id: string;
  name: string;
  location: string;
  city: string;
  country: string;
  type: string;
  price: string;
  priceUnit: string;
  pricePerPlateVeg?: string;
  pricePerPlateNonVeg?: string;
  rentalCost?: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  featured: boolean;
  image: string;
  gallery: string[];
  minGuests: number;
  maxGuests: number;
  rooms: number;
  outdoor: boolean;
  indoor: boolean;
  parking: boolean;
  catering: boolean;
  description: string;
  features: string[];
  faqs: { question: string; answer: string }[];
  reviews: VenueReview[];
}

export const venues: Venue[] = [
  {
    id: "ritz-carlton-nomad",
    name: "The Ritz-Carlton New York, NoMad",
    location: "NoMad, Manhattan",
    city: "New York",
    country: "United States",
    type: "5-Star Hotel",
    price: "₹144,000",
    priceUnit: "per day",
    pricePerPlateVeg: "₹12,000",
    pricePerPlateNonVeg: "₹15,000",
    rentalCost: "₹144,000",
    rating: 5.0,
    reviewCount: 48,
    verified: true,
    featured: true,
    image: "/soulswed/vendors/1213.jpg",
    gallery: [
      "/soulswed/vendors/1213.jpg",
      "/soulswed/vendors/1207.jpg",
      "/soulswed/vendors/1206.jpg",
    ],
    minGuests: 50,
    maxGuests: 500,
    rooms: 250,
    outdoor: false,
    indoor: true,
    parking: true,
    catering: true,
    description:
      "A landmark of understated elegance in Midtown Manhattan, The Ritz-Carlton New York, NoMad offers breathtaking skyline views and world-class event spaces that have hosted celebrity weddings for decades. Every detail — from the hand-painted murals to the bespoke floral installations — can be tailored to your vision.",
    features: ["Skyline Views", "In-house Catering", "Bridal Suite", "Valet Parking", "Concierge Service", "AV & Lighting"],
    faqs: [
      { question: "What is the minimum guest count?", answer: "We accommodate weddings from 50 up to 500 guests across our event spaces." },
      { question: "Is outside catering allowed?", answer: "The Ritz-Carlton has an exclusive in-house catering team. Outside caterers are not permitted." },
      { question: "How far in advance should we book?", answer: "We recommend booking at least 12–18 months in advance for peak dates." },
      { question: "Is a bridal suite included?", answer: "Yes, a complimentary bridal suite is included for weddings over 100 guests." },
    ],
    reviews: [
      { id: 1, author: "Priya Sharma", avatar: "P", date: "March 2025", rating: 5, text: "Absolutely magical experience. The staff went above and beyond to make our wedding unforgettable." },
      { id: 2, author: "Rahul & Ananya", avatar: "R", date: "January 2025", rating: 5, text: "From the first inquiry to the last dance, everything was flawless. Worth every rupee." },
    ],
  },
  {
    id: "conrad-new-york",
    name: "Conrad New York Downtown",
    location: "Battery Park City",
    city: "New York",
    country: "United States",
    type: "5-Star Hotel",
    price: "₹50,000",
    priceUnit: "per day",
    pricePerPlateVeg: "₹6,500",
    pricePerPlateNonVeg: "₹8,000",
    rentalCost: "₹50,000",
    rating: 5.0,
    reviewCount: 32,
    verified: true,
    featured: true,
    image: "https://i0.wp.com/jimbyerstravel.com/wp-content/uploads/2024/02/12-11-13A-1-2.jpg?resize=1920%2C1794&ssl=1",
    gallery: [
      "https://i0.wp.com/jimbyerstravel.com/wp-content/uploads/2024/02/12-11-13A-1-2.jpg?resize=1920%2C1794&ssl=1",
      "/soulswed/vendors/1213.jpg",
    ],
    minGuests: 30,
    maxGuests: 350,
    rooms: 463,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description:
      "Perched in Battery Park City with sweeping Hudson River vistas, Conrad New York Downtown is the ultimate urban venue. Sleek contemporary design, wraparound terraces, and a Michelin-trained culinary team make every celebration truly world-class.",
    features: ["Hudson River Views", "Terrace Spaces", "In-house Catering", "Valet Parking", "463 Guest Rooms", "AV Support"],
    faqs: [
      { question: "Can ceremonies be held outdoors?", answer: "Yes, our terraces overlook the Hudson River and are perfect for outdoor ceremonies." },
      { question: "What is the capacity?", answer: "We can host up to 350 guests for a seated dinner or 500 for a cocktail reception." },
      { question: "Do you allow external decorators?", answer: "Yes, external decorators are welcome with advance notice and our team's coordination." },
    ],
    reviews: [
      { id: 1, author: "Deepa Menon", avatar: "D", date: "February 2025", rating: 5, text: "The Hudson River sunset during our ceremony was beyond words. Conrad's team was exceptional." },
    ],
  },
  {
    id: "refinery-hotel-new-york",
    name: "Refinery Hotel New York",
    location: "Garment District",
    city: "New York",
    country: "United States",
    type: "Boutique Hotel",
    price: "₹38,000",
    priceUnit: "per day",
    pricePerPlateVeg: "₹5,000",
    pricePerPlateNonVeg: "₹6,500",
    rentalCost: "₹38,000",
    rating: 4.8,
    reviewCount: 24,
    verified: true,
    featured: false,
    image: "https://static.prod.r53.tablethotels.com/media/hotels/slideshow_images_staged/large/1268892.jpg",
    gallery: [
      "https://static.prod.r53.tablethotels.com/media/hotels/slideshow_images_staged/large/1268892.jpg",
      "/soulswed/vendors/1207.jpg",
    ],
    minGuests: 20,
    maxGuests: 250,
    rooms: 197,
    outdoor: true,
    indoor: true,
    parking: false,
    catering: true,
    description:
      "Housed in a stunning 1912 hat factory, Refinery Hotel blends industrial-chic architecture with modern luxury. The rooftop bar and exposed brick event spaces create an intimate, editorial atmosphere perfect for couples who want something unique and unforgettable.",
    features: ["Rooftop Terrace", "Industrial-Chic Décor", "Custom Menus", "City Views", "Bridal Suite", "Event Coordinator"],
    faqs: [
      { question: "Is parking available?", answer: "Street parking and nearby garages are available; valet is not offered on-site." },
      { question: "What makes Refinery unique?", answer: "The 1912 hat factory architecture — exposed brick, iron columns, and a stunning rooftop — creates a one-of-a-kind backdrop." },
    ],
    reviews: [
      { id: 1, author: "Kavya & Arjun", avatar: "K", date: "November 2024", rating: 5, text: "The rooftop at golden hour was absolutely breathtaking. Our guests couldn't stop talking about the venue." },
    ],
  },
  {
    id: "jw-marriott-hong-kong",
    name: "JW Marriott Hotel Hong Kong",
    location: "Pacific Place, Admiralty",
    city: "Hong Kong",
    country: "Hong Kong",
    type: "5-Star Hotel",
    price: "₹27,000",
    priceUnit: "per day",
    pricePerPlateVeg: "₹4,500",
    pricePerPlateNonVeg: "₹6,000",
    rentalCost: "₹27,000",
    rating: 0,
    reviewCount: 0,
    verified: true,
    featured: true,
    image: "https://www.luxurylifestylemag.co.uk/wp-content/uploads/2020/07/HG9pPi4.jpg",
    gallery: [
      "https://www.luxurylifestylemag.co.uk/wp-content/uploads/2020/07/HG9pPi4.jpg",
      "/soulswed/vendors/1207.jpg",
    ],
    minGuests: 50,
    maxGuests: 700,
    rooms: 602,
    outdoor: false,
    indoor: true,
    parking: true,
    catering: true,
    description:
      "Soaring above Pacific Place in Admiralty, the JW Marriott Hotel Hong Kong is synonymous with grandeur. Its pillar-free Grand Ballroom, panoramic harbour views, and seamless banquet service have made it the preferred choice for discerning couples across Asia.",
    features: ["Grand Ballroom", "Harbour Views", "In-house Catering", "602 Rooms", "Concierge", "AV & Staging"],
    faqs: [
      { question: "What is the Grand Ballroom capacity?", answer: "The Grand Ballroom can accommodate up to 700 guests for a banquet dinner or 1,000 for a cocktail reception." },
      { question: "Is there a minimum spend?", answer: "Minimum spend requirements vary by date and season. Please contact our events team for details." },
    ],
    reviews: [],
  },
  {
    id: "intercontinental-hong-kong",
    name: "InterContinental Grand Stanford Hong Kong",
    location: "Tsim Sha Tsui",
    city: "Hong Kong",
    country: "Hong Kong",
    type: "5-Star Hotel",
    price: "₹17,000",
    priceUnit: "per day",
    pricePerPlateVeg: "₹3,500",
    pricePerPlateNonVeg: "₹5,000",
    rentalCost: "₹17,000",
    rating: 5.0,
    reviewCount: 18,
    verified: true,
    featured: false,
    image: "/soulswed/vendors/1207.jpg",
    gallery: [
      "/soulswed/vendors/1207.jpg",
      "/soulswed/vendors/1206.jpg",
    ],
    minGuests: 30,
    maxGuests: 450,
    rooms: 578,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description:
      "Overlooking the legendary Victoria Harbour, the InterContinental Grand Stanford offers unrivalled waterfront views and versatile banquet spaces. From intimate rooftop solemnisations to grand harbour-view receptions, every wedding here becomes an iconic Hong Kong memory.",
    features: ["Victoria Harbour Views", "Waterfront Terrace", "Multiple Ballrooms", "In-house Catering", "578 Rooms", "Dedicated Wedding Planner"],
    faqs: [
      { question: "Can we have a harbour-view ceremony?", answer: "Absolutely — our waterfront terrace offers unobstructed views of Victoria Harbour, perfect for ceremonies and photo sessions." },
    ],
    reviews: [
      { id: 1, author: "Meera & Vikram", avatar: "M", date: "December 2024", rating: 5, text: "Victoria Harbour at night during our reception was a dream. The team handled every detail." },
    ],
  },
  {
    id: "harbour-grand-hong-kong",
    name: "Harbour Grand Hong Kong",
    location: "North Point",
    city: "Hong Kong",
    country: "Hong Kong",
    type: "5-Star Hotel",
    price: "₹1,166,401",
    priceUnit: "per engagement",
    pricePerPlateVeg: "₹8,000",
    pricePerPlateNonVeg: "₹10,000",
    rentalCost: "₹1,166,401",
    rating: 5.0,
    reviewCount: 11,
    verified: true,
    featured: true,
    image: "/soulswed/vendors/1206.jpg",
    gallery: [
      "/soulswed/vendors/1206.jpg",
      "/soulswed/vendors/1207.jpg",
    ],
    minGuests: 100,
    maxGuests: 800,
    rooms: 828,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description:
      "Harbour Grand Hong Kong commands panoramic views across Victoria Harbour and the iconic Hong Kong skyline. With expansive ballrooms, a dedicated wedding planning team, and world-class cuisine, this is where the grandest celebrations come to life.",
    features: ["Panoramic Harbour Views", "Grand Ballrooms", "Expert Wedding Planner", "828 Rooms", "Full Catering", "AV & Décor"],
    faqs: [
      { question: "What is the maximum capacity?", answer: "Harbour Grand can host up to 800 guests for a banquet dinner." },
      { question: "Is a wedding coordinator provided?", answer: "Yes, each couple is assigned a dedicated wedding planner from inquiry to the event day." },
    ],
    reviews: [
      { id: 1, author: "Sanjana & Rohit", avatar: "S", date: "October 2024", rating: 5, text: "Everything was beyond perfect. The harbour views, the food, the staff — a flawless wedding." },
    ],
  },
  // Indian venues
  {
    id: "yaan-udaipur",
    name: "YAAN Udaipur",
    location: "Eklingji, Udaipur",
    city: "Udaipur",
    country: "India",
    type: "4-Star Resort",
    price: "₹2,200",
    priceUnit: "per plate",
    pricePerPlateVeg: "₹2,200",
    pricePerPlateNonVeg: "₹2,800",
    rentalCost: "₹10,00,000",
    rating: 5.0,
    reviewCount: 10,
    verified: true,
    featured: true,
    image: "/soulswed/pageimg_venues.jpg",
    gallery: [
      "/soulswed/pageimg_venues.jpg",
      "/soulswed/venue.jpg",
      "/soulswed/vendors/1206.jpg",
    ],
    minGuests: 50,
    maxGuests: 1200,
    rooms: 48,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description:
      "Nestled in the scenic Aravalli Hills on the outskirts of the City of Lakes, YAAN Udaipur is a world unto itself. Sprawling manicured lawns, regal architecture, and curated Rajasthani décor make it the most sought-after destination wedding resort in Rajasthan. The resort's team of seasoned wedding specialists will craft a celebration as timeless as Udaipur itself.",
    features: ["Aravalli Hill Views", "Sprawling Lawns", "Rajasthani Décor", "In-house Catering", "48 Rooms", "Wedding Specialist Team", "Outdoor Stage", "Floral Design"],
    faqs: [
      { question: "How many guests can YAAN accommodate?", answer: "We accommodate weddings from 50 up to 1,200 guests across our indoor and outdoor spaces." },
      { question: "Is destination wedding pricing different?", answer: "Yes, multi-day destination wedding packages are available with special room block rates." },
      { question: "What style of cuisine is served?", answer: "We offer Rajasthani, pan-Indian, Continental, and custom menus crafted by our executive chefs." },
      { question: "Can we bring our own decorator?", answer: "External decorators are welcome; our coordinator will liaise with them to align with venue guidelines." },
    ],
    reviews: [
      { id: 1, author: "Ishaan & Riya", avatar: "I", date: "February 2025", rating: 5, text: "YAAN exceeded every expectation. The sunset ceremony against the Aravalli hills was like a dream." },
      { id: 2, author: "Tanvi Kapoor", avatar: "T", date: "January 2025", rating: 5, text: "The staff remembered every detail we discussed months ago. Truly exceptional service." },
      { id: 3, author: "Aryan Mehta", avatar: "A", date: "December 2024", rating: 5, text: "Our guests flew in from 12 countries and every single one said it was the best wedding they'd ever attended." },
    ],
  },
  {
    id: "leela-ashtamudi",
    name: "The Leela Ashtamudi",
    location: "Kazhakkoottam, Trivandrum",
    city: "Trivandrum",
    country: "India",
    type: "Backwater Resort",
    price: "₹1,800",
    priceUnit: "per plate",
    pricePerPlateVeg: "₹1,800",
    pricePerPlateNonVeg: "₹1,800",
    rentalCost: "₹8,00,000",
    rating: 5.0,
    reviewCount: 3,
    verified: true,
    featured: true,
    image: "/soulswed/acc_Venue.jpg",
    gallery: [
      "/soulswed/acc_Venue.jpg",
      "/soulswed/venue.jpg",
    ],
    minGuests: 80,
    maxGuests: 600,
    rooms: 96,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description:
      "Set on the tranquil shores of the Ashtamudi Lake in Kerala, The Leela is a sanctuary of traditional Kerala architecture and modern luxury. Floating ceremonies on the lake, lush coconut groves, and authentic Keralan cuisine create a wedding experience unlike any other in India.",
    features: ["Backwater Views", "Lakeside Ceremony", "Kerala Architecture", "96 Rooms", "Authentic Kerala Cuisine", "Outdoor Mandap", "Spa & Wellness"],
    faqs: [
      { question: "Can ceremonies be held on the lake?", answer: "Yes, we offer floating ceremony setups on Ashtamudi Lake — one of our most popular wedding experiences." },
      { question: "What is the best season for a wedding here?", answer: "October through March offers the most pleasant weather and clear skies." },
    ],
    reviews: [
      { id: 1, author: "Nisha & Kiran", avatar: "N", date: "November 2024", rating: 5, text: "The backwater ceremony at sunset was pure magic. Every detail was handled with love." },
    ],
  },
  {
    id: "royal-palms-chennai",
    name: "The Royal Palms",
    location: "Vettuvankeni, Chennai",
    city: "Chennai",
    country: "India",
    type: "Garden Venue",
    price: "₹2,50,000",
    priceUnit: "rental",
    pricePerPlateVeg: "₹1,200",
    pricePerPlateNonVeg: "₹1,600",
    rentalCost: "₹2,50,000",
    rating: 4.8,
    reviewCount: 20,
    verified: true,
    featured: false,
    image: "/soulswed/acc_Planners.jpg",
    gallery: [
      "/soulswed/acc_Planners.jpg",
      "/soulswed/acc_Venue.jpg",
    ],
    minGuests: 500,
    maxGuests: 700,
    rooms: 4,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description:
      "The Royal Palms in Chennai's scenic Vettuvankeni neighbourhood offers a lush, garden-wedding experience with manicured lawns, majestic palm-lined pathways, and elegant banquet halls. A favourite for grand South Indian weddings, it combines open-air grandeur with the warmth of traditional hospitality.",
    features: ["Lush Garden Lawns", "Palm-lined Pathways", "Banquet Halls", "South Indian Cuisine", "4 Rooms", "Stage & Lighting", "Car Parking"],
    faqs: [
      { question: "What is the venue's guest capacity?", answer: "The Royal Palms can comfortably host 500 to 700 guests across its indoor and outdoor spaces." },
      { question: "Do they provide catering?", answer: "Yes, in-house catering with South Indian, North Indian, and Continental menus is available." },
    ],
    reviews: [
      { id: 1, author: "Preethi & Suresh", avatar: "P", date: "January 2025", rating: 5, text: "The garden setting was stunning. A classic Chennai wedding venue that never disappoints." },
      { id: 2, author: "Aarthi Rajan", avatar: "A", date: "October 2024", rating: 4, text: "Beautiful venue, great food. The lawn area was perfect for our outdoor ceremony." },
    ],
  },
];

export const cities = [
  { name: "Delhi NCR", image: "/soulswed/acc_Venue.jpg" },
  { name: "Mumbai", image: "/soulswed/acc_Planners.jpg" },
  { name: "Bangalore", image: "/soulswed/acc_Photographers.jpg" },
  { name: "Goa", image: "/soulswed/acc_decorators1.jpg" },
  { name: "Jaipur", image: "/soulswed/pageimg_venues.jpg" },
  { name: "Udaipur", image: "/soulswed/venue.jpg" },
  { name: "Kerala", image: "/soulswed/acc_Venue.jpg" },
  { name: "Chennai", image: "/soulswed/acc_Planners.jpg" },
];

export function getVenueById(id: string): Venue | undefined {
  return venues.find((v) => v.id === id);
}
