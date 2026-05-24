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
    id: "venue-paris-1",
    name: "Château de Chantilly",
    location: "Paris Center",
    city: "Paris",
    country: "Global",
    type: "Historic Château",
    price: "₹335840",
    priceUnit: "per day",
    pricePerPlateVeg: "₹5695",
    pricePerPlateNonVeg: "₹10161",
    rentalCost: "₹344724",
    rating: 4.7,
    reviewCount: 98,
    verified: true,
    featured: true,
    image: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHJ4SNiRzQGPi15Lq_BiOfldM3R2vQi9nuQTubW7wZh-tDURmPBWPlhozC6ZT29jLUvXdIbN0DgB8392BL8iTF6zCIw0q-EHJTZe7cYCyPS02cKvR9trqhr7cVo6kL-UhQSJboN1UTukLxq=s1360-w1360-h1020-rw",
    gallery: [
      "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHzY8pi9TVckyCUN0vh-QP9XJIIuxGXTVh1VhTsQtz3idJXyhwIc97I5gRTjA8EcAE5bGWEwTjRI2W2BUVkavJ5DCtWVN4QfLwRRVxZ3dM9DH6POdfNSj8sXlHyCOaeSLE0EMKl58f3Rp0=s1360-w1360-h1020-rw",
      "https://lh3.googleusercontent.com/gps-cs-s/APNQkAEdGXzqm2VqvkJIv-MqsKeLGdW1Dt57cs8bFS8XSA4_SkO8PLNn9TCGYXg39Z4AvTRKWZSmPX9Guf5_CwuYfYtpR-YDjR0nIZrARxKRI48gC0zd9tSFzc4k7Go6EqOQ_AVN-O6q=s1360-w1360-h1020-rw",
      "https://cdn.sortiraparis.com/images/80/87247/468337-le-chateau-de-chantilly.jpg",
    ],
    minGuests: 122,
    maxGuests: 468,
    rooms: 68,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description: "A majestic French château offering aristocratic elegance, vast manicured gardens, and opulent ballrooms for a truly royal wedding.",
    features: ["Valet Parking", "In-house Catering", "Bridal Suite", "AV & Lighting", "Concierge Service", "Scenic Views"],
    faqs: [
      { question: "What is the minimum guest count?", answer: "We accommodate weddings from 50 guests." },
      { question: "Is outside catering allowed?", answer: "We have an exclusive in-house catering team." }
    ],
    reviews: [
      { id: 1, author: "A Happy Couple", avatar: "A", date: "April 2025", rating: 5, text: "A truly unforgettable experience. Highly recommended!" }
    ]
  },
  {
    id: "venue-paris-2",
    name: "The Peninsula Paris",
    location: "Paris Center",
    city: "Paris",
    country: "Global",
    type: "5-Star Hotel",
    price: "₹278251",
    priceUnit: "per day",
    pricePerPlateVeg: "₹7624",
    pricePerPlateNonVeg: "₹8342",
    rentalCost: "₹264240",
    rating: 4.9,
    reviewCount: 233,
    verified: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1550340499-a6c60fc8287c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    ],
    minGuests: 103,
    maxGuests: 934,
    rooms: 112,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description: "Located steps from the Arc de Triomphe, offering rooftop views of the Eiffel Tower and exquisite Parisian gastronomy.",
    features: ["Valet Parking", "In-house Catering", "Bridal Suite", "AV & Lighting", "Concierge Service", "Scenic Views"],
    faqs: [
      { question: "What is the minimum guest count?", answer: "We accommodate weddings from 50 guests." },
      { question: "Is outside catering allowed?", answer: "We have an exclusive in-house catering team." }
    ],
    reviews: [
      { id: 1, author: "A Happy Couple", avatar: "A", date: "April 2025", rating: 5, text: "A truly unforgettable experience. Highly recommended!" }
    ]
  },
  {
    id: "venue-paris-3",
    name: "Hôtel Ritz Paris",
    location: "Paris Center",
    city: "Paris",
    country: "Global",
    type: "Luxury Palace",
    price: "₹269205",
    priceUnit: "per day",
    pricePerPlateVeg: "₹5460",
    pricePerPlateNonVeg: "₹7221",
    rentalCost: "₹302485",
    rating: 4.6,
    reviewCount: 164,
    verified: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1550340499-a6c60fc8287c?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1550340499-a6c60fc8287c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80",
    ],
    minGuests: 58,
    maxGuests: 733,
    rooms: 121,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description: "The epitome of French art de vivre. Host your reception in the legendary Grand Jardin or the lavish Salon Vendôme.",
    features: ["Valet Parking", "In-house Catering", "Bridal Suite", "AV & Lighting", "Concierge Service", "Scenic Views"],
    faqs: [
      { question: "What is the minimum guest count?", answer: "We accommodate weddings from 50 guests." },
      { question: "Is outside catering allowed?", answer: "We have an exclusive in-house catering team." }
    ],
    reviews: [
      { id: 1, author: "A Happy Couple", avatar: "A", date: "April 2025", rating: 5, text: "A truly unforgettable experience. Highly recommended!" }
    ]
  },
  {
    id: "venue-new-york-1",
    name: "The Plaza Hotel",
    location: "New York Center",
    city: "New York",
    country: "Global",
    type: "Historic Luxury",
    price: "₹253972",
    priceUnit: "per day",
    pricePerPlateVeg: "₹5274",
    pricePerPlateNonVeg: "₹10193",
    rentalCost: "₹344904",
    rating: 4.7,
    reviewCount: 230,
    verified: true,
    featured: true,
    image: "https://lh3.googleusercontent.com/p/AF1QipPbasggnz22sHPx6iw0zZMLlPigxIF1BRlIaFxA=s1360-w1360-h1020-rw",
    gallery: [
      "https://lh3.googleusercontent.com/proxy/ipvh78WdDrTG-dBhk_hRcV-1gD4LRPjnxXQCsz9qKsWdJuugOsPEvmaj8YbTt2UuktJNknnYY-HQjI3wM08LaXDPOhg-MNZgqYvpjCjK6_d_qeN3d-u4bstgY_OzHcnGRCNDNctLFSGAV7UqzxichwwuQDzdyTc=s1360-w1360-h1020-rw",
      "https://lh3.googleusercontent.com/proxy/MU9ZP2SQ93rYK575T2xeP90qlEl2SwhLMhF-W-Auf7Y957HKRqe4v4tqp4mAlmksAKYIGHaYMFtH7huD9d-LtA85RXnEyee3uXwebMLypEYKiw-BG9sdGWUFtsGUTFDb2GSL-4EyWhPsCUQiR90NCHSaolSPXiQ=s1360-w1360-h1020-rw",
      "https://lh3.googleusercontent.com/p/AF1QipPRroHZFlC4toS-Or5zaVts86T_kjoXwcLjVlUX=s1360-w1360-h1020-rw",
    ],
    minGuests: 78,
    maxGuests: 387,
    rooms: 25,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description: "An iconic Manhattan landmark. The Grand Ballroom provides a legendary, fairy-tale setting for the ultimate New York wedding.",
    features: ["Valet Parking", "In-house Catering", "Bridal Suite", "AV & Lighting", "Concierge Service", "Scenic Views"],
    faqs: [
      { question: "What is the minimum guest count?", answer: "We accommodate weddings from 50 guests." },
      { question: "Is outside catering allowed?", answer: "We have an exclusive in-house catering team." }
    ],
    reviews: [
      { id: 1, author: "A Happy Couple", avatar: "A", date: "April 2025", rating: 5, text: "A truly unforgettable experience. Highly recommended!" }
    ]
  },
  {
    id: "venue-new-york-2",
    name: "Tribeca Rooftop",
    location: "New York Center",
    city: "New York",
    country: "Global",
    type: "Modern Loft",
    price: "₹227412",
    priceUnit: "per day",
    pricePerPlateVeg: "₹7317",
    pricePerPlateNonVeg: "₹9037",
    rentalCost: "₹315009",
    rating: 4.5,
    reviewCount: 78,
    verified: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1536321115970-5dfa13356211?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80",
    ],
    minGuests: 143,
    maxGuests: 543,
    rooms: 141,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description: "Chic industrial vibes with panoramic views of the Hudson River and downtown Manhattan skyline from a stunning glass-enclosed penthouse.",
    features: ["Valet Parking", "In-house Catering", "Bridal Suite", "AV & Lighting", "Concierge Service", "Scenic Views"],
    faqs: [
      { question: "What is the minimum guest count?", answer: "We accommodate weddings from 50 guests." },
      { question: "Is outside catering allowed?", answer: "We have an exclusive in-house catering team." }
    ],
    reviews: [
      { id: 1, author: "A Happy Couple", avatar: "A", date: "April 2025", rating: 5, text: "A truly unforgettable experience. Highly recommended!" }
    ]
  },
  {
    id: "venue-new-york-3",
    name: "Oheka Castle",
    location: "New York Center",
    city: "New York",
    country: "Global",
    type: "Mansion Estate",
    price: "₹235190",
    priceUnit: "per day",
    pricePerPlateVeg: "₹5852",
    pricePerPlateNonVeg: "₹9549",
    rentalCost: "₹337141",
    rating: 4.6,
    reviewCount: 341,
    verified: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1536321115970-5dfa13356211?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1536321115970-5dfa13356211?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=800&q=80",
    ],
    minGuests: 60,
    maxGuests: 692,
    rooms: 24,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description: "Just outside the city, this Gilded Age mansion offers sprawling estates, European-style gardens, and unmatched grandeur.",
    features: ["Valet Parking", "In-house Catering", "Bridal Suite", "AV & Lighting", "Concierge Service", "Scenic Views"],
    faqs: [
      { question: "What is the minimum guest count?", answer: "We accommodate weddings from 50 guests." },
      { question: "Is outside catering allowed?", answer: "We have an exclusive in-house catering team." }
    ],
    reviews: [
      { id: 1, author: "A Happy Couple", avatar: "A", date: "April 2025", rating: 5, text: "A truly unforgettable experience. Highly recommended!" }
    ]
  },
  {
    id: "venue-london-1",
    name: "The Savoy",
    location: "London Center",
    city: "London",
    country: "Global",
    type: "5-Star Hotel",
    price: "₹317790",
    priceUnit: "per day",
    pricePerPlateVeg: "₹6049",
    pricePerPlateNonVeg: "₹7732",
    rentalCost: "₹210042",
    rating: 5.0,
    reviewCount: 152,
    verified: true,
    featured: true,
    image: "https://a.storyblok.com/f/286880889715208/1920x1080/1b5218305e/savoy.jpg",
    gallery: [
      "https://cdn.prod.website-files.com/68f4d1c2a6858f0bfbded01c/6968ce0e9f464dda99f373b7_692efc95321c1207372a5e51_TheSavoy_RoyalSuite_Livingroom_1_Jack_Hardy_2024_16_9-p-1600.webp",
      "https://www.thetimes.com/imageserver/image/da9e2ed2-2574-4ff1-baaf-09d53d42ccdd.jpg?strip=all&format=webp&crop=3000px%2C1978px%2C0px%2C35px&resize=2360",
      "https://media.blacktomato.com/cdn-cgi/image/width=1520,height=800,fit=cover,quality=82,format=auto/https://media.blacktomato.com/2014/03/thomas-foyer.jpg",
    ],
    minGuests: 55,
    maxGuests: 671,
    rooms: 87,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description: "World-renowned luxury on the River Thames. Blending Edwardian and Art Deco elegance for a quintessentially British celebration.",
    features: ["Valet Parking", "In-house Catering", "Bridal Suite", "AV & Lighting", "Concierge Service", "Scenic Views"],
    faqs: [
      { question: "What is the minimum guest count?", answer: "We accommodate weddings from 50 guests." },
      { question: "Is outside catering allowed?", answer: "We have an exclusive in-house catering team." }
    ],
    reviews: [
      { id: 1, author: "A Happy Couple", avatar: "A", date: "April 2025", rating: 5, text: "A truly unforgettable experience. Highly recommended!" }
    ]
  },
  {
    id: "venue-london-2",
    name: "Kew Gardens",
    location: "London Center",
    city: "London",
    country: "Global",
    type: "Botanical Garden",
    price: "₹342398",
    priceUnit: "per day",
    pricePerPlateVeg: "₹7212",
    pricePerPlateNonVeg: "₹7566",
    rentalCost: "₹316062",
    rating: 4.7,
    reviewCount: 170,
    verified: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80",
    ],
    minGuests: 58,
    maxGuests: 453,
    rooms: 160,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description: "Exchange vows in the spectacular Victorian glasshouse surrounded by the world's most diverse collection of living plants.",
    features: ["Valet Parking", "In-house Catering", "Bridal Suite", "AV & Lighting", "Concierge Service", "Scenic Views"],
    faqs: [
      { question: "What is the minimum guest count?", answer: "We accommodate weddings from 50 guests." },
      { question: "Is outside catering allowed?", answer: "We have an exclusive in-house catering team." }
    ],
    reviews: [
      { id: 1, author: "A Happy Couple", avatar: "A", date: "April 2025", rating: 5, text: "A truly unforgettable experience. Highly recommended!" }
    ]
  },
  {
    id: "venue-london-3",
    name: "Claridge's",
    location: "London Center",
    city: "London",
    country: "Global",
    type: "Luxury Hotel",
    price: "₹280157",
    priceUnit: "per day",
    pricePerPlateVeg: "₹7867",
    pricePerPlateNonVeg: "₹9159",
    rentalCost: "₹313898",
    rating: 4.9,
    reviewCount: 56,
    verified: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=800&q=80",
    ],
    minGuests: 133,
    maxGuests: 696,
    rooms: 136,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description: "The art deco jewel of Mayfair, synonymous with timeless elegance and impeccable royal-standard service.",
    features: ["Valet Parking", "In-house Catering", "Bridal Suite", "AV & Lighting", "Concierge Service", "Scenic Views"],
    faqs: [
      { question: "What is the minimum guest count?", answer: "We accommodate weddings from 50 guests." },
      { question: "Is outside catering allowed?", answer: "We have an exclusive in-house catering team." }
    ],
    reviews: [
      { id: 1, author: "A Happy Couple", avatar: "A", date: "April 2025", rating: 5, text: "A truly unforgettable experience. Highly recommended!" }
    ]
  },
  {
    id: "venue-tokyo-1",
    name: "Aman Tokyo",
    location: "Tokyo Center",
    city: "Tokyo",
    country: "Global",
    type: "Luxury Hotel",
    price: "₹343730",
    priceUnit: "per day",
    pricePerPlateVeg: "₹5067",
    pricePerPlateNonVeg: "₹10545",
    rentalCost: "₹312719",
    rating: 4.5,
    reviewCount: 54,
    verified: true,
    featured: true,
    image: "https://cdn.mos.cms.futurecdn.net/LgRbuFuc6zWGLcPxaNfXpE.jpg",
    gallery: [
      "https://www.telegraph.co.uk/content/dam/Travel/hotels/2025/june/aman-tokyo-hotel-bed-room-product-image.jpg",
      "https://www.aman.com/sites/default/files/styles/central_carousel_small/public/2021-02/Aman-Tokyo_Gallery_26.jpg?itok=1lo7QRCS",
      "https://images.mrandmrssmith.com/images/1736x1302/5965375-aman-tokyo-tokyo-suite-bedroom-.jpg",
    ],
    minGuests: 106,
    maxGuests: 806,
    rooms: 102,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description: "High above the city, blending traditional Japanese design with modern luxury, featuring panoramic views of the Imperial Palace Gardens.",
    features: ["Valet Parking", "In-house Catering", "Bridal Suite", "AV & Lighting", "Concierge Service", "Scenic Views"],
    faqs: [
      { question: "What is the minimum guest count?", answer: "We accommodate weddings from 50 guests." },
      { question: "Is outside catering allowed?", answer: "We have an exclusive in-house catering team." }
    ],
    reviews: [
      { id: 1, author: "A Happy Couple", avatar: "A", date: "April 2025", rating: 5, text: "A truly unforgettable experience. Highly recommended!" }
    ]
  },
  {
    id: "venue-tokyo-2",
    name: "Meiji Kinenkan",
    location: "Tokyo Center",
    city: "Tokyo",
    country: "Global",
    type: "Historic Shrine",
    price: "₹329373",
    priceUnit: "per day",
    pricePerPlateVeg: "₹5919",
    pricePerPlateNonVeg: "₹7056",
    rentalCost: "₹204415",
    rating: 4.7,
    reviewCount: 292,
    verified: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=800&q=80",
    ],
    minGuests: 119,
    maxGuests: 960,
    rooms: 145,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description: "A prestigious venue offering authentic Shinto wedding ceremonies in a serene forest setting right in the heart of Tokyo.",
    features: ["Valet Parking", "In-house Catering", "Bridal Suite", "AV & Lighting", "Concierge Service", "Scenic Views"],
    faqs: [
      { question: "What is the minimum guest count?", answer: "We accommodate weddings from 50 guests." },
      { question: "Is outside catering allowed?", answer: "We have an exclusive in-house catering team." }
    ],
    reviews: [
      { id: 1, author: "A Happy Couple", avatar: "A", date: "April 2025", rating: 5, text: "A truly unforgettable experience. Highly recommended!" }
    ]
  },
  {
    id: "venue-tokyo-3",
    name: "The Peninsula Tokyo",
    location: "Tokyo Center",
    city: "Tokyo",
    country: "Global",
    type: "5-Star Hotel",
    price: "₹283268",
    priceUnit: "per day",
    pricePerPlateVeg: "₹7199",
    pricePerPlateNonVeg: "₹9850",
    rentalCost: "₹241578",
    rating: 4.7,
    reviewCount: 309,
    verified: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
    ],
    minGuests: 78,
    maxGuests: 454,
    rooms: 167,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description: "Sleek sophistication with sweeping views of the skyline and Hibiya Park, featuring unparalleled Japanese hospitality.",
    features: ["Valet Parking", "In-house Catering", "Bridal Suite", "AV & Lighting", "Concierge Service", "Scenic Views"],
    faqs: [
      { question: "What is the minimum guest count?", answer: "We accommodate weddings from 50 guests." },
      { question: "Is outside catering allowed?", answer: "We have an exclusive in-house catering team." }
    ],
    reviews: [
      { id: 1, author: "A Happy Couple", avatar: "A", date: "April 2025", rating: 5, text: "A truly unforgettable experience. Highly recommended!" }
    ]
  },
  {
    id: "venue-dubai-1",
    name: "Burj Al Arab",
    location: "Dubai Center",
    city: "Dubai",
    country: "Global",
    type: "7-Star Hotel",
    price: "₹303040",
    priceUnit: "per day",
    pricePerPlateVeg: "₹5869",
    pricePerPlateNonVeg: "₹9544",
    rentalCost: "₹268886",
    rating: 5.0,
    reviewCount: 68,
    verified: true,
    featured: true,
    image: "https://lh3.googleusercontent.com/p/AF1QipPlizicQUiaeWIAm68u9snkGTNv4VBpm8NDytA2=s1360-w1360-h1020-rw",
    gallery: [
      "https://lh3.googleusercontent.com/proxy/9S6HT74EPa0unxvMx-BepwQAD-I6tyw7k8Fp9ckoQ5P_POkti-VF6p2f00K9N8QcNcCX8KcZl4q3kS2-eg549jYBLP7jhlCJnLiHCJQVxqX_oztKROEzGfxF0ioVZgtRTVEEYFvIbAEtVdcotuypZRn8IB_DM20=s1360-w1360-h1020-rw",
      "https://lh3.googleusercontent.com/p/AF1QipN3CmeC726I9CHvxJmEC6twAYwygJ6xKis3mZXI=s1360-w1360-h1020-rw",
      "https://lh3.googleusercontent.com/proxy/yhZmwQ9nkosjNdx9kOjojRFDC9LHjhbUExO580kIHIdEDhqPVNBKHN9DGwKbikut59M7owLhFx4cR-kuHoWJ1llrneF4xFOMaGDEBhgYPgUutgRGo41zy0kjjOXKfrH8o2etHco5XT17RnrgNMvrD8HMZ06XSg=s1360-w1360-h1020-rw",
    ],
    minGuests: 148,
    maxGuests: 545,
    rooms: 112,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description: "The ultimate symbol of Arabian luxury. Exchange vows on the stunning terrace jutting out into the Arabian Gulf.",
    features: ["Valet Parking", "In-house Catering", "Bridal Suite", "AV & Lighting", "Concierge Service", "Scenic Views"],
    faqs: [
      { question: "What is the minimum guest count?", answer: "We accommodate weddings from 50 guests." },
      { question: "Is outside catering allowed?", answer: "We have an exclusive in-house catering team." }
    ],
    reviews: [
      { id: 1, author: "A Happy Couple", avatar: "A", date: "April 2025", rating: 5, text: "A truly unforgettable experience. Highly recommended!" }
    ]
  },
  {
    id: "venue-dubai-2",
    name: "Atlantis The Palm",
    location: "Dubai Center",
    city: "Dubai",
    country: "Global",
    type: "Luxury Resort",
    price: "₹244358",
    priceUnit: "per day",
    pricePerPlateVeg: "₹6594",
    pricePerPlateNonVeg: "₹10197",
    rentalCost: "₹314189",
    rating: 4.6,
    reviewCount: 249,
    verified: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1546412414-8035e1776c9a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    ],
    minGuests: 117,
    maxGuests: 748,
    rooms: 37,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description: "From underwater suites to pristine private beaches and magnificent ballrooms, offering a spectacular destination wedding.",
    features: ["Valet Parking", "In-house Catering", "Bridal Suite", "AV & Lighting", "Concierge Service", "Scenic Views"],
    faqs: [
      { question: "What is the minimum guest count?", answer: "We accommodate weddings from 50 guests." },
      { question: "Is outside catering allowed?", answer: "We have an exclusive in-house catering team." }
    ],
    reviews: [
      { id: 1, author: "A Happy Couple", avatar: "A", date: "April 2025", rating: 5, text: "A truly unforgettable experience. Highly recommended!" }
    ]
  },
  {
    id: "venue-dubai-3",
    name: "Armani Hotel Dubai",
    location: "Dubai Center",
    city: "Dubai",
    country: "Global",
    type: "Boutique Hotel",
    price: "₹219168",
    priceUnit: "per day",
    pricePerPlateVeg: "₹5528",
    pricePerPlateNonVeg: "₹8026",
    rentalCost: "₹336940",
    rating: 4.6,
    reviewCount: 286,
    verified: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1546412414-8035e1776c9a?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1546412414-8035e1776c9a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
    ],
    minGuests: 83,
    maxGuests: 885,
    rooms: 160,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description: "Located in the Burj Khalifa, featuring minimalist Italian elegance designed by Giorgio Armani himself.",
    features: ["Valet Parking", "In-house Catering", "Bridal Suite", "AV & Lighting", "Concierge Service", "Scenic Views"],
    faqs: [
      { question: "What is the minimum guest count?", answer: "We accommodate weddings from 50 guests." },
      { question: "Is outside catering allowed?", answer: "We have an exclusive in-house catering team." }
    ],
    reviews: [
      { id: 1, author: "A Happy Couple", avatar: "A", date: "April 2025", rating: 5, text: "A truly unforgettable experience. Highly recommended!" }
    ]
  },
  {
    id: "venue-rome-1",
    name: "Villa Aurelia",
    location: "Rome Center",
    city: "Rome",
    country: "Global",
    type: "Historic Villa",
    price: "₹203399",
    priceUnit: "per day",
    pricePerPlateVeg: "₹5248",
    pricePerPlateNonVeg: "₹7638",
    rentalCost: "₹251905",
    rating: 4.6,
    reviewCount: 224,
    verified: true,
    featured: true,
    image: "https://www.emilianorusso.com/wp-content/uploads/2022/03/villa-aurelia-wedding-photographer-emiliano-russo-rome-wedding-14.jpg",
    gallery: [
      "https://www.framelines.it/wp-content/uploads/2017/01/wedding_at_villa-aurelia_rome.jpg",
      "https://exoticbaliproperties.com/wp-content/uploads/2024/12/Villa-Aurelia-Canggu-5.jpg",
      "https://wi-web-eiw.s3.eu-west-1.amazonaws.com/exclusiveitaly/images/original/603ce288-ae3c-4c74-8ff3-e8839bee5db4/rome-wedding-venue-villa-aurelia-10.jpg",
    ],
    minGuests: 109,
    maxGuests: 464,
    rooms: 100,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description: "Perched on the Janiculum Hill, offering breathtaking panoramic views of Rome and magnificent 17th-century gardens.",
    features: ["Valet Parking", "In-house Catering", "Bridal Suite", "AV & Lighting", "Concierge Service", "Scenic Views"],
    faqs: [
      { question: "What is the minimum guest count?", answer: "We accommodate weddings from 50 guests." },
      { question: "Is outside catering allowed?", answer: "We have an exclusive in-house catering team." }
    ],
    reviews: [
      { id: 1, author: "A Happy Couple", avatar: "A", date: "April 2025", rating: 5, text: "A truly unforgettable experience. Highly recommended!" }
    ]
  },
  {
    id: "venue-rome-2",
    name: "Hotel Eden",
    location: "Rome Center",
    city: "Rome",
    country: "Global",
    type: "5-Star Hotel",
    price: "₹267742",
    priceUnit: "per day",
    pricePerPlateVeg: "₹6813",
    pricePerPlateNonVeg: "₹8451",
    rentalCost: "₹271713",
    rating: 4.5,
    reviewCount: 94,
    verified: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1529154036614-a60975f5c760?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1529154036614-a60975f5c760?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
    ],
    minGuests: 148,
    maxGuests: 442,
    rooms: 64,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description: "Classic Roman elegance meets modern luxury, featuring a rooftop terrace with sweeping views of the Eternal City.",
    features: ["Valet Parking", "In-house Catering", "Bridal Suite", "AV & Lighting", "Concierge Service", "Scenic Views"],
    faqs: [
      { question: "What is the minimum guest count?", answer: "We accommodate weddings from 50 guests." },
      { question: "Is outside catering allowed?", answer: "We have an exclusive in-house catering team." }
    ],
    reviews: [
      { id: 1, author: "A Happy Couple", avatar: "A", date: "April 2025", rating: 5, text: "A truly unforgettable experience. Highly recommended!" }
    ]
  },
  {
    id: "venue-rome-3",
    name: "Castello di Bracciano",
    location: "Rome Center",
    city: "Rome",
    country: "Global",
    type: "Medieval Castle",
    price: "₹203533",
    priceUnit: "per day",
    pricePerPlateVeg: "₹7690",
    pricePerPlateNonVeg: "₹9126",
    rentalCost: "₹316967",
    rating: 4.7,
    reviewCount: 238,
    verified: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529154036614-a60975f5c760?auto=format&fit=crop&w=800&q=80",
    ],
    minGuests: 50,
    maxGuests: 988,
    rooms: 53,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description: "A short drive from Rome, this spectacular 15th-century castle offers a dramatic and romantic fairy-tale setting.",
    features: ["Valet Parking", "In-house Catering", "Bridal Suite", "AV & Lighting", "Concierge Service", "Scenic Views"],
    faqs: [
      { question: "What is the minimum guest count?", answer: "We accommodate weddings from 50 guests." },
      { question: "Is outside catering allowed?", answer: "We have an exclusive in-house catering team." }
    ],
    reviews: [
      { id: 1, author: "A Happy Couple", avatar: "A", date: "April 2025", rating: 5, text: "A truly unforgettable experience. Highly recommended!" }
    ]
  },
  {
    id: "venue-bali-1",
    name: "Ayana Resort and Spa",
    location: "Bali Center",
    city: "Bali",
    country: "Global",
    type: "Cliffside Resort",
    price: "₹292515",
    priceUnit: "per day",
    pricePerPlateVeg: "₹6633",
    pricePerPlateNonVeg: "₹9904",
    rentalCost: "₹307498",
    rating: 4.7,
    reviewCount: 97,
    verified: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    ],
    minGuests: 113,
    maxGuests: 999,
    rooms: 38,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description: "World-famous for its dramatic cliff-top wedding chapels overlooking the Indian Ocean and legendary Bali sunsets.",
    features: ["Valet Parking", "In-house Catering", "Bridal Suite", "AV & Lighting", "Concierge Service", "Scenic Views"],
    faqs: [
      { question: "What is the minimum guest count?", answer: "We accommodate weddings from 50 guests." },
      { question: "Is outside catering allowed?", answer: "We have an exclusive in-house catering team." }
    ],
    reviews: [
      { id: 1, author: "A Happy Couple", avatar: "A", date: "April 2025", rating: 5, text: "A truly unforgettable experience. Highly recommended!" }
    ]
  },
  {
    id: "venue-bali-2",
    name: "The Edge Bali",
    location: "Bali Center",
    city: "Bali",
    country: "Global",
    type: "Luxury Villas",
    price: "₹324749",
    priceUnit: "per day",
    pricePerPlateVeg: "₹6379",
    pricePerPlateNonVeg: "₹10363",
    rentalCost: "₹295290",
    rating: 4.5,
    reviewCount: 125,
    verified: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    ],
    minGuests: 132,
    maxGuests: 444,
    rooms: 38,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description: "Exclusive cliff-front luxury featuring a glass-bottom sky pool and breathtaking panoramic ocean views.",
    features: ["Valet Parking", "In-house Catering", "Bridal Suite", "AV & Lighting", "Concierge Service", "Scenic Views"],
    faqs: [
      { question: "What is the minimum guest count?", answer: "We accommodate weddings from 50 guests." },
      { question: "Is outside catering allowed?", answer: "We have an exclusive in-house catering team." }
    ],
    reviews: [
      { id: 1, author: "A Happy Couple", avatar: "A", date: "April 2025", rating: 5, text: "A truly unforgettable experience. Highly recommended!" }
    ]
  },
  {
    id: "venue-bali-3",
    name: "Four Seasons Sayan",
    location: "Bali Center",
    city: "Bali",
    country: "Global",
    type: "Jungle Resort",
    price: "₹295091",
    priceUnit: "per day",
    pricePerPlateVeg: "₹5882",
    pricePerPlateNonVeg: "₹10569",
    rentalCost: "₹233764",
    rating: 4.8,
    reviewCount: 225,
    verified: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80",
    ],
    minGuests: 125,
    maxGuests: 490,
    rooms: 78,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description: "Nestled in the lush Ayung River Valley in Ubud, offering a serene, deeply spiritual, and exotic wedding experience.",
    features: ["Valet Parking", "In-house Catering", "Bridal Suite", "AV & Lighting", "Concierge Service", "Scenic Views"],
    faqs: [
      { question: "What is the minimum guest count?", answer: "We accommodate weddings from 50 guests." },
      { question: "Is outside catering allowed?", answer: "We have an exclusive in-house catering team." }
    ],
    reviews: [
      { id: 1, author: "A Happy Couple", avatar: "A", date: "April 2025", rating: 5, text: "A truly unforgettable experience. Highly recommended!" }
    ]
  },
  {
    id: "venue-sydney-1",
    name: "Park Hyatt Sydney",
    location: "Sydney Center",
    city: "Sydney",
    country: "Global",
    type: "Luxury Hotel",
    price: "₹291227",
    priceUnit: "per day",
    pricePerPlateVeg: "₹7240",
    pricePerPlateNonVeg: "₹8957",
    rentalCost: "₹344271",
    rating: 4.8,
    reviewCount: 177,
    verified: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1536321115970-5dfa13356211?auto=format&fit=crop&w=800&q=80",
    ],
    minGuests: 141,
    maxGuests: 998,
    rooms: 74,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description: "Unrivaled waterfront luxury with direct views of the Sydney Opera House and Harbour Bridge from your reception.",
    features: ["Valet Parking", "In-house Catering", "Bridal Suite", "AV & Lighting", "Concierge Service", "Scenic Views"],
    faqs: [
      { question: "What is the minimum guest count?", answer: "We accommodate weddings from 50 guests." },
      { question: "Is outside catering allowed?", answer: "We have an exclusive in-house catering team." }
    ],
    reviews: [
      { id: 1, author: "A Happy Couple", avatar: "A", date: "April 2025", rating: 5, text: "A truly unforgettable experience. Highly recommended!" }
    ]
  },
  {
    id: "venue-sydney-2",
    name: "Taronga Centre",
    location: "Sydney Center",
    city: "Sydney",
    country: "Global",
    type: "Waterfront Venue",
    price: "₹337226",
    priceUnit: "per day",
    pricePerPlateVeg: "₹7384",
    pricePerPlateNonVeg: "₹10646",
    rentalCost: "₹242462",
    rating: 4.8,
    reviewCount: 327,
    verified: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1536321115970-5dfa13356211?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80",
    ],
    minGuests: 134,
    maxGuests: 716,
    rooms: 83,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description: "Offering sweeping 180-degree views of Sydney Harbour in a unique, lush setting.",
    features: ["Valet Parking", "In-house Catering", "Bridal Suite", "AV & Lighting", "Concierge Service", "Scenic Views"],
    faqs: [
      { question: "What is the minimum guest count?", answer: "We accommodate weddings from 50 guests." },
      { question: "Is outside catering allowed?", answer: "We have an exclusive in-house catering team." }
    ],
    reviews: [
      { id: 1, author: "A Happy Couple", avatar: "A", date: "April 2025", rating: 5, text: "A truly unforgettable experience. Highly recommended!" }
    ]
  },
  {
    id: "venue-sydney-3",
    name: "Gunners' Barracks",
    location: "Sydney Center",
    city: "Sydney",
    country: "Global",
    type: "Historic Venue",
    price: "₹335381",
    priceUnit: "per day",
    pricePerPlateVeg: "₹7132",
    pricePerPlateNonVeg: "₹10600",
    rentalCost: "₹224963",
    rating: 4.9,
    reviewCount: 344,
    verified: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1536321115970-5dfa13356211?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1536321115970-5dfa13356211?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a?auto=format&fit=crop&w=800&q=80",
    ],
    minGuests: 125,
    maxGuests: 780,
    rooms: 162,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description: "Nestled in bushland overlooking the harbour, featuring heritage charm, crystal chandeliers, and a sandstone courtyard.",
    features: ["Valet Parking", "In-house Catering", "Bridal Suite", "AV & Lighting", "Concierge Service", "Scenic Views"],
    faqs: [
      { question: "What is the minimum guest count?", answer: "We accommodate weddings from 50 guests." },
      { question: "Is outside catering allowed?", answer: "We have an exclusive in-house catering team." }
    ],
    reviews: [
      { id: 1, author: "A Happy Couple", avatar: "A", date: "April 2025", rating: 5, text: "A truly unforgettable experience. Highly recommended!" }
    ]
  },
  {
    id: "venue-istanbul-1",
    name: "Çırağan Palace Kempinski",
    location: "Istanbul Center",
    city: "Istanbul",
    country: "Global",
    type: "Ottoman Palace",
    price: "₹246986",
    priceUnit: "per day",
    pricePerPlateVeg: "₹7496",
    pricePerPlateNonVeg: "₹8933",
    rentalCost: "₹276407",
    rating: 4.7,
    reviewCount: 161,
    verified: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    ],
    minGuests: 66,
    maxGuests: 550,
    rooms: 144,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description: "The only Ottoman Imperial Palace and Hotel on the Bosphorus, offering unparalleled grandeur and waterfront elegance.",
    features: ["Valet Parking", "In-house Catering", "Bridal Suite", "AV & Lighting", "Concierge Service", "Scenic Views"],
    faqs: [
      { question: "What is the minimum guest count?", answer: "We accommodate weddings from 50 guests." },
      { question: "Is outside catering allowed?", answer: "We have an exclusive in-house catering team." }
    ],
    reviews: [
      { id: 1, author: "A Happy Couple", avatar: "A", date: "April 2025", rating: 5, text: "A truly unforgettable experience. Highly recommended!" }
    ]
  },
  {
    id: "venue-istanbul-2",
    name: "Four Seasons Bosphorus",
    location: "Istanbul Center",
    city: "Istanbul",
    country: "Global",
    type: "5-Star Hotel",
    price: "₹345756",
    priceUnit: "per day",
    pricePerPlateVeg: "₹5646",
    pricePerPlateNonVeg: "₹10960",
    rentalCost: "₹262752",
    rating: 4.8,
    reviewCount: 139,
    verified: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
    ],
    minGuests: 115,
    maxGuests: 382,
    rooms: 86,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description: "A beautifully restored 19th-century palace where East meets West, featuring stunning terraces along the Bosphorus strait.",
    features: ["Valet Parking", "In-house Catering", "Bridal Suite", "AV & Lighting", "Concierge Service", "Scenic Views"],
    faqs: [
      { question: "What is the minimum guest count?", answer: "We accommodate weddings from 50 guests." },
      { question: "Is outside catering allowed?", answer: "We have an exclusive in-house catering team." }
    ],
    reviews: [
      { id: 1, author: "A Happy Couple", avatar: "A", date: "April 2025", rating: 5, text: "A truly unforgettable experience. Highly recommended!" }
    ]
  },
  {
    id: "venue-istanbul-3",
    name: "Esma Sultan Mansion",
    location: "Istanbul Center",
    city: "Istanbul",
    country: "Global",
    type: "Historic Mansion",
    price: "₹267946",
    priceUnit: "per day",
    pricePerPlateVeg: "₹7993",
    pricePerPlateNonVeg: "₹8752",
    rentalCost: "₹291233",
    rating: 4.5,
    reviewCount: 229,
    verified: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80",
    ],
    minGuests: 116,
    maxGuests: 840,
    rooms: 140,
    outdoor: true,
    indoor: true,
    parking: true,
    catering: true,
    description: "A stunning brick shell of a historic mansion with a modern glass interior, situated right on the edge of the Bosphorus.",
    features: ["Valet Parking", "In-house Catering", "Bridal Suite", "AV & Lighting", "Concierge Service", "Scenic Views"],
    faqs: [
      { question: "What is the minimum guest count?", answer: "We accommodate weddings from 50 guests." },
      { question: "Is outside catering allowed?", answer: "We have an exclusive in-house catering team." }
    ],
    reviews: [
      { id: 1, author: "A Happy Couple", avatar: "A", date: "April 2025", rating: 5, text: "A truly unforgettable experience. Highly recommended!" }
    ]
  }
];




export const cities = [
  { name: "Paris", image: "/soulswed/vendors/1213.jpg" },
  { name: "New York", image: "/soulswed/vendors/1207.jpg" },
  { name: "London", image: "/soulswed/vendors/1206.jpg" },
  { name: "Tokyo", image: "/soulswed/acc_Photographers.jpg" },
  { name: "Dubai", image: "/soulswed/pageimg_venues.jpg" },
  { name: "Rome", image: "/soulswed/vendors/1213.jpg" },
  { name: "Bali", image: "/soulswed/acc_decorators1.jpg" },
  { name: "Sydney", image: "/soulswed/vendors/1207.jpg" },
  { name: "Istanbul", image: "/soulswed/vendors/1206.jpg" },
];

export function getVenueById(id: string): Venue | undefined {
  return venues.find((v) => v.id === id);
}
