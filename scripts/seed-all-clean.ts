import { connectDB } from "../lib/mongodb";
import { Vendor } from "../lib/models/Vendor";
import { Venue } from "../lib/models/Venue";
import { ServiceListing } from "../lib/models/ServiceListing";
import mongoose from "mongoose";

const VENDOR_ID = "international-vendor";

// ─── VENUES (7) ─────────────────────────────────────────────
const internationalVenues = [
  { name: "Villa Balbiano", city: "Lake Como", country: "Italy", location: "Ossuccio, Lake Como", type: "Historic Villa", price: 2500000, priceUnit: "per day", rating: 5.0, reviewCount: 142, minGuests: 50, maxGuests: 300, image: "https://images.unsplash.com/photo-1549488344-c6df6ba8378c?w=900&q=85", description: "An awe-inspiring Italian palazzo on the shores of Lake Como, featuring majestic 17th-century frescoes, manicured gardens, and a private boat pier.", features: ["Lakefront", "Historic Frescoes", "Private Boat Pier"] },
  { name: "Château de Villette", city: "Paris", country: "France", location: "Condécourt, Paris", type: "Château", price: 3000000, priceUnit: "per day", rating: 4.9, reviewCount: 98, minGuests: 100, maxGuests: 500, image: "https://images.unsplash.com/photo-1596395819057-cb351be0fc06?w=900&q=85", description: "Often called 'Le Petit Versailles', this breathtaking French château offers sprawling manicured gardens, ornate fountains, and timeless European elegance.", features: ["French Gardens", "Ornate Fountains", "Versailles Aesthetic"] },
  { name: "Amanzoe Resort", city: "Peloponnese", country: "Greece", location: "Kranidi, Peloponnese", type: "Luxury Resort", price: 4000000, priceUnit: "per day", rating: 5.0, reviewCount: 215, minGuests: 50, maxGuests: 250, image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&q=85", description: "A modern Acropolis offering 360-degree panoramic views of the Aegean Sea, featuring classical Greek architecture and ultra-luxurious private pavilions.", features: ["Aegean Sea Views", "Classical Architecture", "Private Pavilions"] },
  { name: "The Plaza Hotel", city: "New York City", country: "USA", location: "Fifth Avenue, NY", type: "Luxury Hotel", price: 3500000, priceUnit: "per day", rating: 4.8, reviewCount: 540, minGuests: 150, maxGuests: 800, image: "https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=900&q=85", description: "New York's most iconic hotel, featuring the legendary Grand Ballroom, crystal chandeliers, and unparalleled Central Park views.", features: ["Grand Ballroom", "Central Park Views", "Crystal Chandeliers"] },
  { name: "Bvlgari Resort Bali", city: "Bali", country: "Indonesia", location: "Uluwatu, Bali", type: "Cliffside Resort", price: 1800000, priceUnit: "per day", rating: 4.9, reviewCount: 310, minGuests: 20, maxGuests: 150, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=85", description: "A stunning cliffside resort perched 150 meters above the Indian Ocean, offering a breathtaking water wedding experience and volcanic stone architecture.", features: ["Cliffside Views", "Water Wedding", "Volcanic Architecture"] },
  { name: "Al Maha Desert Resort", city: "Dubai", country: "UAE", location: "Dubai Desert Conservation Reserve", type: "Desert Resort", price: 2200000, priceUnit: "per day", rating: 4.9, reviewCount: 185, minGuests: 30, maxGuests: 200, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&q=85", description: "An exclusive desert oasis offering Bedouin-style luxury, endless dune vistas, and ultimate privacy for an Arabian Nights wedding.", features: ["Desert Dunes", "Bedouin Luxury", "Private Oasis"] },
  { name: "Blenheim Palace", city: "Oxfordshire", country: "UK", location: "Woodstock, Oxfordshire", type: "Historic Palace", price: 4500000, priceUnit: "per day", rating: 5.0, reviewCount: 130, minGuests: 200, maxGuests: 2000, image: "https://images.unsplash.com/photo-1549466547-2bf7844a4dc1?w=900&q=85", description: "A monumental country house and UNESCO World Heritage Site offering unparalleled British grandeur, featuring the Orangery and Great Hall.", features: ["UNESCO Heritage", "The Orangery", "British Grandeur"] },
];

// ─── ROOMS (7) ─────────────────────────────────────────────
const internationalRooms = [
  { name: "Atlantis Royal Sky Suite", city: "Dubai", country: "UAE", location: "Palm Jumeirah, Dubai", priceFrom: 850000, priceUnit: "per night", rating: 5.0, reviewCount: 89, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=85", description: "Ultra-luxury penthouse suite offering panoramic views of the Arabian Gulf, a private infinity pool, and 24/7 dedicated butler service for wedding VIPs.", features: ["Private Infinity Pool", "Gulf Views", "24/7 Butler", "Helipad Access"] },
  { name: "Le Bristol Honeymoon Suite", city: "Paris", country: "France", location: "Rue du Faubourg, Paris", priceFrom: 450000, priceUnit: "per night", rating: 4.9, reviewCount: 145, image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&q=85", description: "Iconic Parisian romance featuring 18th-century antique furnishings, a marble bathroom, and a private terrace overlooking the Eiffel Tower.", features: ["Eiffel Tower View", "Marble Bathroom", "Antique Furnishings", "Michelin Dining"] },
  { name: "COMO Uma Ubud Jungle Villa", city: "Bali", country: "Indonesia", location: "Ubud, Bali", priceFrom: 180000, priceUnit: "per night", rating: 4.8, reviewCount: 312, image: "https://images.unsplash.com/photo-1590073242606-dbe11956e30f?w=900&q=85", description: "A serene jungle sanctuary nestled in Bali's lush valleys, featuring a private plunge pool, outdoor rain shower, and holistic spa treatments.", features: ["Jungle Valley View", "Private Plunge Pool", "Outdoor Shower", "Yoga Deck"] },
  { name: "The Savoy River View Suite", city: "London", country: "UK", location: "Strand, London", priceFrom: 350000, priceUnit: "per night", rating: 4.9, reviewCount: 230, image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&q=85", description: "Edwardian elegance meeting Art Deco design, offering sweeping views of the River Thames and seamless proximity to London's elite wedding venues.", features: ["River Thames View", "Art Deco Design", "Chauffeur Service", "Savoy Grill"] },
  { name: "Waldorf Astoria Water Villa", city: "Malé", country: "Maldives", location: "Ithaafushi, Maldives", priceFrom: 650000, priceUnit: "per night", rating: 5.0, reviewCount: 78, image: "https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?w=900&q=85", description: "An expansive overwater villa featuring glass floors, a massive private pool, and direct ocean access for the ultimate post-wedding retreat.", features: ["Overwater Villa", "Glass Floors", "Private Ocean Pool", "Reef Access"] },
  { name: "Ritz-Carlton Central Park Suite", city: "New York", country: "USA", location: "Manhattan, NY", priceFrom: 550000, priceUnit: "per night", rating: 4.8, reviewCount: 420, image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=900&q=85", description: "The epitome of New York luxury, offering bird's-eye views of Central Park, La Prairie spa access, and bespoke bridal preparation amenities.", features: ["Central Park View", "La Prairie Spa", "Bridal Amenities", "Towncar Service"] },
  { name: "Canaves Oia Cave Suite", city: "Santorini", country: "Greece", location: "Oia, Santorini", priceFrom: 280000, priceUnit: "per night", rating: 4.9, reviewCount: 198, image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900&q=85", description: "A beautifully sculpted whitewashed cave suite featuring a private infinity plunge pool and legendary sunset views over the Aegean caldera.", features: ["Caldera Sunset View", "Cave Architecture", "Infinity Plunge Pool", "Wine Cellar"] },
];

// ─── PLANNERS (7) ─────────────────────────────────────────────
const internationalPlanners = [
  { name: "Vandegaste Global Events", city: "Paris", country: "France", location: "Champs-Élysées, Paris", priceFrom: 2500000, priceUnit: "per event", rating: 5.0, reviewCount: 64, image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=85", description: "World-renowned luxury planners designing multi-million dollar weddings across European châteaus and Lake Como villas.", features: ["European Châteaus", "High-Profile Privacy", "Bespoke Design", "Global Logistics"] },
  { name: "Desert Rose Planners", city: "Dubai", country: "UAE", location: "Downtown Dubai", priceFrom: 1800000, priceUnit: "per event", rating: 4.9, reviewCount: 112, image: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=900&q=85", description: "Specialists in ultra-luxury UAE weddings, from Burj Al Arab helipad ceremonies to private desert oasis celebrations.", features: ["Desert Exclusivity", "Burj Al Arab Access", "VIP Logistics", "Helicopter Entry"] },
  { name: "Bali Dream Weddings", city: "Bali", country: "Indonesia", location: "Seminyak, Bali", priceFrom: 850000, priceUnit: "per event", rating: 4.8, reviewCount: 245, image: "https://images.unsplash.com/photo-1544079873-109033324f9c?w=900&q=85", description: "Experts in tropical luxury, handling everything from cliffside resort buyouts to beachfront fire-dance receptions.", features: ["Cliffside Buyouts", "Beach Receptions", "Local Vendor Network", "Fire Dance Shows"] },
  { name: "Manhattan Soirées", city: "New York", country: "USA", location: "Fifth Avenue, NY", priceFrom: 2000000, priceUnit: "per event", rating: 4.9, reviewCount: 178, image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=85", description: "New York's elite wedding planners, orchestrating high-society celebrations at The Plaza, New York Public Library, and private Hamptons estates.", features: ["High-Society Events", "Hamptons Estates", "Broadway Entertainment", "Elite Security"] },
  { name: "Aegean Vows", city: "Santorini", country: "Greece", location: "Fira, Santorini", priceFrom: 750000, priceUnit: "per event", rating: 4.8, reviewCount: 190, image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=900&q=85", description: "Santorini specialists mastering the logistics of caldera cliff weddings, private catamaran receptions, and Greek island-hopping itineraries.", features: ["Caldera Weddings", "Catamaran Receptions", "Island Hopping", "Greek Musicians"] },
  { name: "Royal British Events", city: "London", country: "UK", location: "Mayfair, London", priceFrom: 1500000, priceUnit: "per event", rating: 4.7, reviewCount: 134, image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&q=85", description: "Quintessentially British planners offering access to historic palaces, castles, and exclusive private members' clubs for regal celebrations.", features: ["Historic Castles", "Members' Clubs", "Regal Styling", "Vintage Rolls Royce"] },
  { name: "Maldives Paradise Planners", city: "Malé", country: "Maldives", location: "Malé City", priceFrom: 1200000, priceUnit: "per event", rating: 4.9, reviewCount: 88, image: "https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?w=900&q=85", description: "The definitive Maldives experts organizing private island buyouts, underwater ceremonies, and seaplane arrivals for ultimate tropical luxury.", features: ["Island Buyouts", "Underwater Ceremony", "Seaplane Logistics", "Private Yacht"] },
];

// ─── CATERERS (7) ─────────────────────────────────────────────
const internationalCaterers = [
  { name: "Al Muntaha Culinary", city: "Dubai", country: "UAE", location: "Jumeirah, Dubai", priceFrom: 45000, priceUnit: "per plate", rating: 5.0, reviewCount: 120, image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=900&q=85", description: "Michelin-caliber Arabian and French fusion catering featuring gold-leaf wagyu, caviar bars, and molecular gastronomy desserts.", features: ["Caviar Bar", "Gold Leaf Wagyu", "Molecular Gastronomy", "Sommelier Service"] },
  { name: "Alain Ducasse Events", city: "Paris", country: "France", location: "Plaza Athénée, Paris", priceFrom: 55000, priceUnit: "per plate", rating: 4.9, reviewCount: 85, image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=85", description: "Unrivaled French haute cuisine for weddings, offering bespoke tasting menus, vintage Champagne pairings, and impeccable silver service.", features: ["Haute Cuisine", "Vintage Champagne", "Silver Service", "Macaron Towers"] },
  { name: "Balinese Spice Kitchen", city: "Bali", country: "Indonesia", location: "Uluwatu, Bali", priceFrom: 15000, priceUnit: "per plate", rating: 4.8, reviewCount: 275, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=85", description: "Authentic Indonesian and Pan-Asian banquets featuring live satay grills, whole roasted babi guling, and tropical fruit grazing tables.", features: ["Live Satay Grill", "Babi Guling", "Tropical Grazing", "Arak Cocktails"] },
  { name: "Manhattan Epicurean", city: "New York", country: "USA", location: "Tribeca, NY", priceFrom: 35000, priceUnit: "per plate", rating: 4.8, reviewCount: 310, image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=900&q=85", description: "Contemporary American and international fusion with interactive chef stations, raw seafood bars, and custom craft cocktail mixology.", features: ["Raw Seafood Bar", "Interactive Chef", "Craft Mixology", "Midnight Sliders"] },
  { name: "The Savoy Banquets", city: "London", country: "UK", location: "Strand, London", priceFrom: 40000, priceUnit: "per plate", rating: 4.9, reviewCount: 195, image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=900&q=85", description: "Classic British culinary excellence featuring Beef Wellington, afternoon tea carts, and the finest selection of English sparkling wines.", features: ["Beef Wellington", "Afternoon Tea Cart", "English Sparkling", "Oyster Station"] },
  { name: "Maldivian Ocean Catch", city: "Malé", country: "Maldives", location: "Baa Atoll", priceFrom: 28000, priceUnit: "per plate", rating: 4.7, reviewCount: 142, image: "https://images.unsplash.com/photo-1574966739987-65e386c1da89?w=900&q=85", description: "Beachfront dining specialists offering freshly caught reef fish, Maldivian lobster barbecues, and barefoot luxury dining under the stars.", features: ["Lobster BBQ", "Fresh Reef Catch", "Barefoot Dining", "Coconut Cocktails"] },
  { name: "Selene Santorini Catering", city: "Santorini", country: "Greece", location: "Pyrgos, Santorini", priceFrom: 22000, priceUnit: "per plate", rating: 4.9, reviewCount: 165, image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=900&q=85", description: "Santorini's most acclaimed caterer serving authentic Greek-Mediterranean wedding feasts with fresh Aegean seafood, volcano wines, and traditional honey-walnut desserts.", features: ["Volcano Wine", "Aegean Seafood", "Greek Meze Feast", "Baklava & Loukoumades"] },
];

// ─── DECORATORS (7) ─────────────────────────────────────────────
const internationalDecorators = [
  { name: "Luxe Events Dubai", city: "Dubai", country: "UAE", location: "Sheikh Zayed Road, Dubai", priceFrom: 800000, priceUnit: "per event", rating: 4.9, reviewCount: 156, image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=85", description: "Dubai's most opulent wedding decorators producing gold-leaf installations, Swarovski crystal mandaps, and infinity-mirror walkways for ultra-luxury desert celebrations.", features: ["Gold Leaf Ceiling", "Swarovski Crystals", "Infinity Mirror Aisle", "Custom Monogram Lights"] },
  { name: "Maison des Fleurs Paris", city: "Paris", country: "France", location: "Palais Royal, Paris", priceFrom: 600000, priceUnit: "per event", rating: 4.8, reviewCount: 123, image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=85", description: "Paris's most celebrated floral design house — purveyors of full château gardens, cascading peonies and roses, and candlelit table arrangements for the world's elite.", features: ["Full Château Florals", "Cascading Peony Wall", "Candlelit Aisles", "Bespoke Scent Design"] },
  { name: "Tropical Luxe Bali", city: "Bali", country: "Indonesia", location: "Canggu, Bali", priceFrom: 150000, priceUnit: "per event", rating: 4.8, reviewCount: 298, image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&q=85", description: "Bali's most Instagrammed decorators creating tropical boho-luxury setups — floating flower installations, bamboo altars, frangipani-draped arches, and lantern-lit jungles.", features: ["Floating Flower Pool", "Bamboo Altar", "Frangipani Arch", "Lantern Forest"] },
  { name: "English Rose Events", city: "London", country: "UK", location: "Notting Hill, London", priceFrom: 500000, priceUnit: "per event", rating: 4.7, reviewCount: 134, image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&q=85", description: "Award-winning British wedding decorators famous for English garden aesthetics — wildflower meadows, vintage birdcages, Downton-era draping, and ivy-covered arches.", features: ["English Garden Setup", "Vintage Birdcages", "Ivy-Covered Arch", "Union Jack Styling"] },
  { name: "Ocean Bloom Maldives", city: "Malé", country: "Maldives", location: "Ari Atoll, Maldives", priceFrom: 900000, priceUnit: "per event", rating: 5.0, reviewCount: 67, image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=900&q=85", description: "The Maldives' premier overwater wedding decorators — floating petal mandaps, sea-glass aisle lanterns, coral-and-orchid centrepieces, and underwater flower tunnels.", features: ["Overwater Mandap", "Floating Petal Aisle", "Coral Centrepieces", "Underwater Florals"] },
  { name: "Gardens by Design Singapore", city: "Singapore", country: "Singapore", location: "Botanic Gardens, Singapore", priceFrom: 400000, priceUnit: "per event", rating: 4.7, reviewCount: 178, image: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=900&q=85", description: "Singapore's most innovative wedding decorators merging tropical botanic maximalism with cutting-edge LED technology and projection-mapped installations.", features: ["Projection Mapping", "Tropical Botanic Theme", "LED Canopy", "Custom Neon Signs"] },
  { name: "White Cave Aesthetics", city: "Santorini", country: "Greece", location: "Imerovigli, Santorini", priceFrom: 350000, priceUnit: "per event", rating: 4.9, reviewCount: 212, image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900&q=85", description: "Santorini's most celebrated aesthetic studio — whitewashed cave ceremonies draped in bougainvillea, Aegean blue linens, olive branch arches, and sunset terrace dinners.", features: ["Bougainvillea Canopy", "Olive Branch Arch", "Aegean Blue Linen", "Caldera Terrace Dinner"] },
];

// ─── PHOTOGRAPHERS (7) ─────────────────────────────────────────────
const internationalPhotographers = [
  { name: "Vogue Wedding Films", city: "Paris", country: "France", location: "Le Marais, Paris", priceFrom: 850000, priceUnit: "per event", rating: 5.0, reviewCount: 140, image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=900&q=85", description: "High-fashion editorial wedding photography. Famous for shooting royal and celebrity weddings globally in a cinematic, magazine-worthy style.", features: ["Editorial Style", "Drone Coverage", "Same-day Edit"] },
  { name: "Desert Light Studios", city: "Dubai", country: "UAE", location: "Media City, Dubai", priceFrom: 500000, priceUnit: "per event", rating: 4.8, reviewCount: 210, image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=85", description: "Specialists in capturing Arabian luxury, offering desert golden hour shoots, massive lighting setups, and grand ballroom coverage.", features: ["Golden Hour Shoots", "Grand Ballroom", "High-end Retouching"] },
  { name: "Bali Sunsets Media", city: "Bali", country: "Indonesia", location: "Uluwatu, Bali", priceFrom: 300000, priceUnit: "per event", rating: 4.9, reviewCount: 350, image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=900&q=85", description: "Experts at capturing tropical aesthetics, dramatic cliffside ceremonies, and intimate jungle weddings with a candid storytelling approach.", features: ["Tropical Candids", "Cliffside Shoots", "Storytelling Approach"] },
  { name: "Manhattan Memories", city: "New York", country: "USA", location: "SoHo, NY", priceFrom: 700000, priceUnit: "per event", rating: 4.7, reviewCount: 280, image: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=900&q=85", description: "Urban luxury wedding photography. Capturing the fast-paced glamour of NYC weddings from Central Park to rooftop penthouses.", features: ["Urban Luxury", "Rooftop Shoots", "Fast-paced Candids"] },
  { name: "Aegean Blues Photography", city: "Santorini", country: "Greece", location: "Oia, Santorini", priceFrom: 400000, priceUnit: "per event", rating: 4.9, reviewCount: 190, image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=900&q=85", description: "Masters of natural light photography, perfectly capturing the white architecture and blue domes of Santorini for breathtaking couple portraits.", features: ["Natural Light", "Caldera Portraits", "Fine Art Prints"] },
  { name: "The Crown Creatives", city: "London", country: "UK", location: "Chelsea, London", priceFrom: 600000, priceUnit: "per event", rating: 4.8, reviewCount: 165, image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&q=85", description: "Documentary-style British wedding photographers excelling in capturing authentic moments inside historic manors and London's elite clubs.", features: ["Documentary Style", "Historic Manors", "Black & White Classics"] },
  { name: "Oceanic Frames", city: "Malé", country: "Maldives", location: "North Malé Atoll", priceFrom: 450000, priceUnit: "per event", rating: 5.0, reviewCount: 95, image: "https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?w=900&q=85", description: "Specialized in underwater photography and crystal-clear beach shoots, turning Maldivian destination weddings into visual masterpieces.", features: ["Underwater Shoots", "Beach Candids", "Aerial Drone"] },
];

// ─── RENTALS (7) ─────────────────────────────────────────────
const internationalRentals = [
  { name: "Luxe Car Rentals", city: "Dubai", country: "UAE", location: "Downtown Dubai", priceFrom: 150000, priceUnit: "per day", rating: 4.9, reviewCount: 310, image: "https://images.unsplash.com/photo-1549466547-2bf7844a4dc1?w=900&q=85", description: "Rent Rolls Royce, Bentley, and vintage luxury cars for grand wedding entries and spectacular photoshoots.", features: ["Rolls Royce", "Bentley", "Chauffeur Service"] },
  { name: "Parisian Prop House", city: "Paris", country: "France", location: "Montmartre, Paris", priceFrom: 80000, priceUnit: "per event", rating: 4.8, reviewCount: 150, image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=85", description: "Exclusive vintage furniture, chandeliers, and antique decor rentals to elevate any château or ballroom wedding.", features: ["Vintage Furniture", "Antique Chandeliers", "Louis XVI Chairs"] },
  { name: "Bali Bamboo Tents", city: "Bali", country: "Indonesia", location: "Canggu, Bali", priceFrom: 120000, priceUnit: "per event", rating: 4.7, reviewCount: 220, image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&q=85", description: "Eco-luxury bamboo marquees, fairy-lit stretch tents, and bohemian furniture rentals for beachfront and jungle weddings.", features: ["Bamboo Marquees", "Bohemian Furniture", "Fairy Lights"] },
  { name: "Fifth Ave Bridal Wardrobe", city: "New York", country: "USA", location: "Fifth Avenue, NY", priceFrom: 250000, priceUnit: "per day", rating: 5.0, reviewCount: 90, image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=85", description: "Rent high-end designer bridal wear, tuxedos, and exclusive luxury accessories for your wedding weekend.", features: ["Designer Dresses", "Luxury Tuxedos", "Accessory Rentals"] },
  { name: "Aegean Sound & Light", city: "Santorini", country: "Greece", location: "Fira, Santorini", priceFrom: 100000, priceUnit: "per event", rating: 4.9, reviewCount: 180, image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900&q=85", description: "Premium AV, lighting, and sound system rentals designed specifically for windy cliffside venues and outdoor terraces.", features: ["Premium Sound Systems", "Architectural Lighting", "DJ Equipment"] },
  { name: "Royal Marquee UK", city: "London", country: "UK", location: "Richmond, London", priceFrom: 300000, priceUnit: "per event", rating: 4.8, reviewCount: 140, image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&q=85", description: "Luxury glasshouse marquees, clear-span tents, and premium dance floors for elegant English countryside weddings.", features: ["Glasshouse Marquees", "Premium Dance Floors", "Heating Solutions"] },
  { name: "Maldives Yacht Charters", city: "Malé", country: "Maldives", location: "Hulhumalé", priceFrom: 500000, priceUnit: "per day", rating: 5.0, reviewCount: 75, image: "https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?w=900&q=85", description: "Charter luxury yachts and catamarans for private pre-wedding parties, sunset cruises, or exclusive island transfers.", features: ["Luxury Yachts", "Sunset Cruises", "Island Transfers"] },
];

async function wipeAndSeed() {
  await connectDB();
  console.log("Connected to MongoDB. Wiping old test data...");

  await Venue.deleteMany({});
  await ServiceListing.deleteMany({});
  
  console.log("Database wiped clean.");
  console.log("Seeding international data for 7 categories...");

  // Venues
  for (const v of internationalVenues) {
    const slug = v.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const venueId = `venue-intl-${slug}-${Date.now()}`;
    await Venue.create({
      vendorId: VENDOR_ID,
      venueId,
      gallery: [],
      verified: true,
      featured: true,
      active: true,
      ...v,
    });
  }

  // Helper for services
  const seedServices = async (list: any[], category: string) => {
    for (const item of list) {
      const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      await ServiceListing.create({
        vendorId: VENDOR_ID,
        serviceId: `${category}-intl-${slug}-${Date.now()}`,
        category: category,
        verified: true,
        featured: true,
        active: true,
        ...item,
      });
    }
  };

  await seedServices(internationalRooms, "rooms");
  await seedServices(internationalPlanners, "planners");
  await seedServices(internationalCaterers, "caterers");
  await seedServices(internationalDecorators, "decorators");
  await seedServices(internationalPhotographers, "photographers");
  await seedServices(internationalRentals, "rentals");

  const total = internationalVenues.length + internationalRooms.length + internationalPlanners.length + internationalCaterers.length + internationalDecorators.length + internationalPhotographers.length + internationalRentals.length;
  console.log(`\n✨ Done! Seeded exactly ${total} international listings across 7 categories.`);
  process.exit(0);
}

wipeAndSeed().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
