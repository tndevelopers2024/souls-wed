/**
 * Subscription and advertisement rate cards.
 *
 * SOURCE OF TRUTH: transcribed directly from the live legacy soulswed.com
 * Angular bundle (`this.venuesPlans`, `this.photoGraphersPlans`,
 * `this.mackupArtistsPlans`, `this.decoratorsPlans`, `this.weddingPlanersPlans`,
 * `this.hotelServices`, `this.advertisePlans`). These are the real production
 * figures, not a reading of the client's annotated screenshots.
 *
 * While `PLAN_TEST_MODE` is on, checkout charges TEST_PRICE_INR instead of the
 * real amount — the client asked for ₹30 / ₹50 so they can verify the payment
 * flow end to end, then switch back. Set NEXT_PUBLIC_PLAN_TEST_MODE to "false"
 * to charge real prices.
 */

export const PLAN_TEST_MODE =
  process.env.NEXT_PUBLIC_PLAN_TEST_MODE !== "false";

/** Test amounts the client asked for, in rupees. */
export const TEST_PRICE_INR = {
  low: 30,
  high: 50,
} as const;

export interface SubscriptionTier {
  id: string;
  name: string;
  /** Original price in USD, shown struck through. 0 = free tier. */
  listPriceUSD: number;
  /** Current offer price in USD. 0 = free tier, no payment button. */
  offerPriceUSD: number;
  /** e.g. "2 months free" — shown next to the price where the legacy site had it. */
  extra?: string;
  highlight: boolean;
  features: string[];
}

export interface SubscriptionRateCard {
  slug: string;
  label: string;
  subtitle: string;
  tiers: SubscriptionTier[];
}

export interface AdvertisementOption {
  id: string;
  title: string;
  details: string[];
  listPriceUSD: number;
  offerPriceUSD: number;
  highlight: boolean;
}

export interface AdvertisementRateCard {
  slug: string;
  label: string;
  options: AdvertisementOption[];
}

export const SUBSCRIPTION_RATE_CARDS: SubscriptionRateCard[] = [
  {
    slug: "venues",
    label: "Venues / Banquet Halls",
    subtitle: "For Hotels, Banquet Halls and Rooms",
    tiers: [
      {
        id: "venues-core",
        name: "Core",
        listPriceUSD: 0,
        offerPriceUSD: 0,
        extra: undefined,
        highlight: false,
        features: [
          "JADE CLUB – 6 MONTHS SUBSCRIPTION",
          "Lowest Visibility (Visible only after clicking 'Show More' button below Sapphire subscribers)",
          "Not visible on first page <9% visitors visit this section",
          "A commission of 10% applicable on sales",
          "15 photos a year",
          "Can reply to reviews",
          "Can list either Venues or Rooms",
        ],
      },
      {
        id: "venues-plus",
        name: "Plus",
        listPriceUSD: 1950,
        offerPriceUSD: 690,
        extra: undefined,
        highlight: false,
        features: [
          "SAPPHIRE CLUB – 1 YEAR SUBSCRIPTION + 2 MONTHS FREE",
          "Visible below Diamond and Ruby",
          "Your property videos and pictures will be uploaded on our social media pages when we start marketing to attract customers to your property",
          "Visible on first or second page",
          "Non-commissionable for 12 months + 2 months free",
          "Up to 42 photos per year",
          "Email support – info@soulswed.com",
          "Can reply to reviews",
          "Two reviews can be chosen to be pinned to top",
          "Analytics access",
          "Chat directly with customers",
          "Can list all Venues and Rooms in one property",
        ],
      },
      {
        id: "venues-elite",
        name: "Elite",
        listPriceUSD: 3930,
        offerPriceUSD: 996,
        extra: undefined,
        highlight: true,
        features: [
          "RUBY CLUB – 1 YEAR SUBSCRIPTION + 3 MONTHS FREE",
          "Visible below Diamond Club",
          "Your property videos and pictures will be uploaded on our social media pages when we start marketing to attract customers to your property.",
          "Showcase your property by adding 3 videos, including 3D video of your hotel/property, up to 2 GB.",
          "Videos can be made by our photography team at actual cost. Please contact us for estimated costs. Link here: (info@soulswed.com)",
          "Get the 'verified' tag next to your hotel for international clients, after verification by our team members.",
          "Visible on first or second page",
          "Non-commissionable for 1 year + 3 months free",
          "Unlimited photo uploads",
          "Call / WhatsApp/ Email support",
          "Can reply to reviews",
          "Two reviews can be chosen to be pinned to top",
          "Analytics access",
          "Request for Profile management",
          "Chat directly with customers",
          "Can list all Venues and Rooms in one property",
        ],
      },
      {
        id: "venues-luxe",
        name: "Luxe",
        listPriceUSD: 6900,
        offerPriceUSD: 2625,
        extra: undefined,
        highlight: false,
        features: [
          "DIAMOND CLUB – 1 YEAR SUBSCRIPTION + 4 MONTHS FREE – BUY ONE, GET ONE FREE! Get registered on both SoulsWed and Amazing Halls for a discount.",
          "Topmost Visibility to attract wedding customers on SoulsWed.com and Event clients on AmazingHalls.com",
          "Your property videos and pictures will be uploaded on our social media pages when we start marketing to attract customers to your property.",
          "Your property video can be placed on our header on the Home Page for 2 weeks. This will be connected to your landing page on our websites.",
          "Showcase your property by adding up to 5 videos of your hotel/property, including 3D videos, up to 3 GB.",
          "Videos can be made by our photography team at actual cost. Please contact us for estimated costs. Link here: (info@soulswed.com &  info@amazinghalls.com)",
          "Get the 'verified' tag next to your hotel for international clients. Our team members will visit your property for verification.",
          "Visible on the first page",
          "Non-commissionable for 1 year + 4 months free",
          "Unlimited photo uploads",
          "Call / WhatApp / Email support",
          "Can reply to reviews",
          "Five reviews can be chosen to be pinned to top",
          "Analytics access (they should be able to see how many customers are looking, how many booking etc.)",
          "Request for Profile management",
          "Chat directly with customers",
          "Can list all Venues and Rooms in one property on both SoulsWed.com and AmazingHalls.com",
          "Contact us – (link to go to info@soulswed.com and 091 94452 66640 Or info@amazinghalls.com",
        ],
      },
    ],
  },
  {
    slug: "photographers",
    label: "Photographers",
    subtitle: "For Photographers & Videographers",
    tiers: [
      {
        id: "photographers-core",
        name: "Core",
        listPriceUSD: 0,
        offerPriceUSD: 0,
        extra: undefined,
        highlight: false,
        features: [
          "No profile management support",
          "Email support only (no call support)",
          "Visible after other vendors",
          "Can be listed in one location",
          "Chat with customers",
          "Add up to 24 photos",
        ],
      },
      {
        id: "photographers-plus",
        name: "Plus",
        listPriceUSD: 2400,
        offerPriceUSD: 999,
        extra: "2 months free",
        highlight: false,
        features: [
          "Get more visibility than Core (free) plan",
          "Profile management support",
          "Email support only (no call support)",
          "Visible on first page below Luxe and Elite",
          "2 Relationship calls per year",
          "2 reviews can be chosen to be pinned to top",
          "Analytics access",
          "Can be listed in multiple cities (Additional Charges apply)",
          "Chat directly with customers",
          "Unlimited photo uploads",
        ],
      },
      {
        id: "photographers-elite",
        name: "Elite",
        listPriceUSD: 3900,
        offerPriceUSD: 1716,
        extra: "3 months free",
        highlight: true,
        features: [
          "Get more than 2x visibility of Plus plan",
          "Profile management support",
          "Call support",
          "Visible on first page below Luxe",
          "5 Relationship calls per year",
          "2 reviews can be chosen to be pinned to top",
          "Analytics access",
          "Can be listed in multiple cities (Additional Charges apply)",
          "Chat directly with customers",
          "Unlimited photo uploads",
        ],
      },
      {
        id: "photographers-luxe",
        name: "Luxe",
        listPriceUSD: 6900,
        offerPriceUSD: 3399,
        extra: "4 months free",
        highlight: false,
        features: [
          "Buy one, get one free – registration on both Soulswed and Amazing Halls",
          "Can put video on Photographer's page header for two weeks",
          "Get more than 4x visibility of Plus plan, and more than 2x visibility of Elite plan",
          "Profile management support",
          "Call support",
          "Visible on first page",
          "8 Relationship calls per year",
          "2 reviews can be chosen to be pinned to top",
          "Analytics access",
          "Can be listed in multiple cities (Additional Charges apply)",
          "Chat directly with customers",
          "Unlimited photo uploads",
        ],
      },
    ],
  },
  {
    slug: "makeup-artists",
    label: "Makeup Artists",
    subtitle: "For Makeup Artists",
    tiers: [
      {
        id: "makeup-artists-core",
        name: "Core",
        listPriceUSD: 0,
        offerPriceUSD: 0,
        extra: undefined,
        highlight: false,
        features: [
          "No profile management support",
          "Email support only (no call support)",
          "Visible after other vendors",
          "Can be listed in one location",
          "Chat with customers",
          "Add up to 24 photos",
        ],
      },
      {
        id: "makeup-artists-plus",
        name: "Plus",
        listPriceUSD: 1249,
        offerPriceUSD: 492,
        extra: "2 months free",
        highlight: false,
        features: [
          "Get more visibility than Core (free) plan",
          "No Profile management support",
          "Email support only (no call)",
          "Visible on first page below Luxe and Elite",
          "2 Relationship calls per year",
          "2 reviews can be chosen to be pinned to top",
          "Analytics access",
          "Can be listed in multiple cities (Additional Charges apply)",
          "Chat with customers",
          "Unlimited photo uploads",
        ],
      },
      {
        id: "makeup-artists-elite",
        name: "Elite",
        listPriceUSD: 1590,
        offerPriceUSD: 699,
        extra: "3 months free",
        highlight: true,
        features: [
          "Get more than 2x visibility of Plus plan",
          "Profile management support",
          "Call support",
          "Visible on first page below Luxe",
          "6 Relationship calls per year",
          "2 reviews can be chosen to be pinned to top",
          "Analytics access",
          "Can be listed in multiple cities (Additional Charges apply)",
          "Chat with customers",
          "Unlimited photo uploads",
        ],
      },
      {
        id: "makeup-artists-luxe",
        name: "Luxe",
        listPriceUSD: 2500,
        offerPriceUSD: 1059,
        extra: "4 months free",
        highlight: false,
        features: [
          "Can put video on makeup page's header for two weeks",
          "Get more than 4x visibility of Plus plan, and more than 2x visibility of Elite plan",
          "Profile management support",
          "Call support",
          "Visible on first page",
          "9 Relationship calls per year",
          "2 reviews can be chosen to be pinned to top",
          "Analytics access",
          "Can be listed in multiple cities (Additional Charges apply)",
          "Chat with customers",
          "Unlimited photo uploads",
        ],
      },
    ],
  },
  {
    slug: "decorators",
    label: "Decorators",
    subtitle: "For Decorators",
    tiers: [
      {
        id: "decorators-core",
        name: "Core",
        listPriceUSD: 0,
        offerPriceUSD: 0,
        extra: undefined,
        highlight: false,
        features: [
          "No profile management support",
          "Email support only (no call support)",
          "Visible after other vendors",
          "Can be listed in one location",
          "Chat with customers",
          "Add up to 24 photos",
        ],
      },
      {
        id: "decorators-elite",
        name: "Elite",
        listPriceUSD: 1400,
        offerPriceUSD: 798,
        extra: undefined,
        highlight: true,
        features: [
          "Get more than 2x visibility of Core (free) plan",
          "Profile management support",
          "Call support",
          "Visible on first page below Luxe",
          "5 Relationship calls per year",
          "2 reviews can be chosen to be pinned to top",
          "Analytics access",
          "Can be listed in multiple cities (Additional Charges apply)",
          "Visible contact details of customers who call you",
          "Unlimited photo uploads",
        ],
      },
      {
        id: "decorators-luxe",
        name: "Luxe",
        listPriceUSD: 5469,
        offerPriceUSD: 2553,
        extra: undefined,
        highlight: false,
        features: [
          "Buy one, get one free – registration on both Soulswed and Amazing Halls",
          "Can put video on Planners page header for two weeks",
          "Get more than 4x visibility of Core (free) plan, and more than 2x visibility of Elite plan",
          "Profile management support",
          "Call support",
          "Visible on first page",
          "8 Relationship calls per year",
          "2 reviews can be chosen to be pinned to top",
          "Analytics access",
          "Can be listed in multiple cities (Additional Charges apply)",
          "Visible contact details of customers who call you",
          "Unlimited photo uploads",
        ],
      },
    ],
  },
  {
    slug: "planners",
    label: "Wedding Planners",
    subtitle: "For Wedding Planners",
    tiers: [
      {
        id: "planners-core",
        name: "Core",
        listPriceUSD: 0,
        offerPriceUSD: 0,
        extra: undefined,
        highlight: false,
        features: [
          "No profile management support",
          "Email support only (no call support)",
          "Visible after other vendors",
          "Can be listed in one location",
          "Chat with customers",
          "Add up to 24 photos",
        ],
      },
      {
        id: "planners-elite",
        name: "Elite",
        listPriceUSD: 2139,
        offerPriceUSD: 996,
        extra: undefined,
        highlight: true,
        features: [
          "Get more than 2x visibility of Core (free) plan",
          "Profile management support",
          "Call support",
          "Visible on first page below Luxe",
          "5 Relationship calls per year",
          "2 reviews can be chosen to be pinned to top",
          "Analytics access",
          "Can be listed in multiple cities (Additional Charges apply)",
          "Chat with customers",
          "Unlimited photo uploads",
        ],
      },
      {
        id: "planners-luxe",
        name: "Luxe",
        listPriceUSD: 5469,
        offerPriceUSD: 2553,
        extra: undefined,
        highlight: false,
        features: [
          "Buy one, get one free – registration on both Soulswed and Amazing Halls",
          "Can put video on Planners page header for two weeks",
          "Get more than 4x visibility of Core (free) plan, and more than 2x visibility of Elite plan",
          "Profile management support",
          "Call support",
          "Visible on first page",
          "8 Relationship calls per year",
          "2 reviews can be chosen to be pinned to top",
          "Analytics access",
          "Can be listed in multiple cities (Additional Charges apply)",
          "Chat with customers",
          "Unlimited photo uploads",
        ],
      },
    ],
  },
];
export const ADVERTISEMENT_RATE_CARDS: AdvertisementRateCard[] = [
  {
    slug: "hotels",
    label: "For Hotels",
    options: [
      {
        id: "ad-hotels-1",
        title: "PROPERTY VIDEO ON HOME PAGE OF SOULSWED.COM or AMAZINGHALLS.COM  - 14 days",
        details: [
          "Video will connect to your page on SoulsWed.com or AmazingHalls.com",
          "SHORTENED AND FULL VERSIONS OF VIDEOS TO BE UPLOADED ON SOCIAL MEDIA PLATFORMS INCLUDING INSTAGRAM, YOUTUBE, FACEBOOK",
        ],
        listPriceUSD: 2400,
        offerPriceUSD: 1590,
        highlight: true,
      },
      {
        id: "ad-hotels-2",
        title: "PROPERTY VIDEO ON HOME PAGE OF BOTH SOULSWED.COM AND AMAZINGHALLS.COM – 14 days",
        details: [
          "Video will be linked to your page on both SoulsWed.com and AmazingHalls.com",
          "SHORTENED AND FULL VERSIONS OF VIDEOS TO BE UPLOADED ON SOCIAL MEDIA PLATFORMS INCLUDING INSTAGRAM, YOUTUBE, FACEBOOK",
        ],
        listPriceUSD: 4590,
        offerPriceUSD: 2499,
        highlight: false,
      },
      {
        id: "ad-hotels-3",
        title: "PROPERTY VIDEO ON HOME PAGE OF BOTH SOULSWED.COM AND AMAZINGHALLS.COM – For additional 14 days each",
        details: [
          "Video will be linked to your page on both SoulsWed.com and AmazingHalls.com",
          "SHORTENED AND FULL VERSIONS OF VIDEOS TO BE UPLOADED ON SOCIAL MEDIA PLATFORMS INCLUDING INSTAGRAM, YOUTUBE, FACEBOOK",
        ],
        listPriceUSD: 3069,
        offerPriceUSD: 1599,
        highlight: false,
      },
      {
        id: "ad-hotels-4",
        title: "PROPERTY VIDEO ON HOME PAGE OF BOTH SOULSWED.COM AND AMAZINGHALLS.COM – for additional 1 month each",
        details: [
          "Video will be linked to your page on both SoulsWed.com and AmazingHalls.com",
          "SHORTENED AND FULL VERSIONS OF VIDEOS TO BE UPLOADED ON SOCIAL MEDIA PLATFORMS INCLUDING INSTAGRAM, YOUTUBE, FACEBOOK",
        ],
        listPriceUSD: 5969,
        offerPriceUSD: 2959,
        highlight: false,
      },
      {
        id: "ad-hotels-5",
        title: "PROPERTY VIDEO ON INSIDE PAGES OF BOTH SOULSWED.COM AND AMAZINGHALLS.COM – for additional 1 month each",
        details: [
          "Video will be linked to your page on both SoulsWed.com and AmazingHalls.com",
          "SHORTENED AND FULL VERSIONS OF VIDEOS TO BE UPLOADED ON SOCIAL MEDIA PLATFORMS INCLUDING INSTAGRAM, YOUTUBE, FACEBOOK",
        ],
        listPriceUSD: 2949,
        offerPriceUSD: 1149,
        highlight: false,
      },
    ],
  },
  {
    slug: "vendors",
    label: "For All Other Vendors",
    options: [
      {
        id: "ad-vendors-1",
        title: "YOUR VIDEO (less than 9 seconds) ON HOME PAGE OF SOULSWED.COM or AMAZINGHALLS.COM  - 14 days",
        details: [
          "Video will connect to your page on SoulsWed.com or AmazingHalls.com",
          "SHORTENED AND FULL VERSIONS OF VIDEOS TO BE UPLOADED ON SOCIAL MEDIA PLATFORMS INCLUDING INSTAGRAM, YOUTUBE, FACEBOOK",
        ],
        listPriceUSD: 2400,
        offerPriceUSD: 1590,
        highlight: true,
      },
      {
        id: "ad-vendors-2",
        title: "YOUR VIDEO (less than 9 seconds) ON HOME PAGE OF BOTH SOULSWED.COM AND AMAZINGHALLS.COM – 14 days",
        details: [
          "Video will be linked to your page on both SoulsWed.com and AmazingHalls.com",
          "SHORTENED AND FULL VERSIONS OF VIDEOS TO BE UPLOADED ON SOCIAL MEDIA PLATFORMS INCLUDING INSTAGRAM, YOUTUBE, FACEBOOK",
        ],
        listPriceUSD: 4590,
        offerPriceUSD: 2499,
        highlight: false,
      },
      {
        id: "ad-vendors-3",
        title: "YOUR VIDEO (less than 9 seconds)  ON HOME PAGE OF BOTH SOULSWED.COM AND AMAZINGHALLS.COM – For additional 14 days each",
        details: [
          "Video will be linked to your page on both SoulsWed.com and AmazingHalls.com",
          "SHORTENED AND FULL VERSIONS OF VIDEOS TO BE UPLOADED ON SOCIAL MEDIA PLATFORMS INCLUDING INSTAGRAM, YOUTUBE, FACEBOOK",
        ],
        listPriceUSD: 3069,
        offerPriceUSD: 1599,
        highlight: false,
      },
      {
        id: "ad-vendors-4",
        title: "YOUR VIDEO (less than 9 seconds) ON HOME PAGE OF BOTH SOULSWED.COM AND AMAZINGHALLS.COM – for additional 1 month each",
        details: [
          "Video will be linked to your page on both SoulsWed.com and AmazingHalls.com",
          "SHORTENED AND FULL VERSIONS OF VIDEOS TO BE UPLOADED ON SOCIAL MEDIA PLATFORMS INCLUDING INSTAGRAM, YOUTUBE, FACEBOOK",
        ],
        listPriceUSD: 5969,
        offerPriceUSD: 2959,
        highlight: false,
      },
      {
        id: "ad-vendors-5",
        title: "YOUR VIDEO (less than 9 seconds) ON INSIDE PAGES OF EITHER SOULSWED.COM OR AMAZINGHALLS.COM – for 1 month",
        details: [
          "Video will be linked to your page on EITHER SoulsWed.com or AmazingHalls.com",
          "SHORTENED AND FULL VERSIONS OF VIDEOS TO BE UPLOADED ON SOCIAL MEDIA PLATFORMS INCLUDING INSTAGRAM, YOUTUBE, FACEBOOK",
        ],
        listPriceUSD: 1959,
        offerPriceUSD: 789,
        highlight: false,
      },
      {
        id: "ad-vendors-6",
        title: "YOUR VIDEO (less than 9 seconds) ON INSIDE PAGES OF BOTH SOULSWED.COM AND AMAZINGHALLS.COM – for additional 1 month each",
        details: [
          "Video will be linked to your page on both SoulsWed.com and AmazingHalls.com",
          "SHORTENED AND FULL VERSIONS OF VIDEOS TO BE UPLOADED ON SOCIAL MEDIA PLATFORMS INCLUDING INSTAGRAM, YOUTUBE, FACEBOOK",
        ],
        listPriceUSD: 2949,
        offerPriceUSD: 1149,
        highlight: false,
      },
    ],
  },
];
/**
 * Contact routes offered alongside every plan (client item #11).
 *
 * NOTE: the April to-do list asked for `weddings@pearlsntiaras.com`, but the
 * live site uses `info@pearlsntiaras.com`. The live address is used here since
 * it is known to work — confirm with the client which they want.
 */
export const PLAN_CONTACT = {
  emails: [
    "info@pearlsntiaras.com",
    "info@soulswed.com",
    "info@amazinghalls.com",
  ],
  /** From the live site's floating WhatsApp button: +91 94452 66640. */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919445266640",
} as const;

/** Every payable plan across both rate-card families, flattened for lookup. */
export function findPlan(
  id: string
): { id: string; label: string; offerPriceUSD: number; isSubscription: boolean } | undefined {
  for (const card of SUBSCRIPTION_RATE_CARDS) {
    const tier = card.tiers.find((t) => t.id === id);
    if (tier) {
      return {
        id: tier.id,
        label: `${card.label} — ${tier.name}`,
        offerPriceUSD: tier.offerPriceUSD,
        isSubscription: true,
      };
    }
  }
  for (const card of ADVERTISEMENT_RATE_CARDS) {
    const opt = card.options.find((o) => o.id === id);
    if (opt) {
      return {
        id: opt.id,
        label: `${card.label} — ${opt.title}`,
        offerPriceUSD: opt.offerPriceUSD,
        isSubscription: false,
      };
    }
  }
  return undefined;
}

/** Cheaper plans use the low test amount, pricier ones the high amount. */
export function testAmountFor(offerPriceUSD: number): number {
  return offerPriceUSD >= 1000 ? TEST_PRICE_INR.high : TEST_PRICE_INR.low;
}
