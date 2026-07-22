/**
 * Subscription and advertisement rate cards.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  ⚠️  PRICES BELOW ARE TRANSCRIBED FROM THE CLIENT'S APRIL SCREENSHOTS AND
 *      HAVE NOT BEEN CONFIRMED. Several figures were partly obscured by the
 *      client's own annotations. Every number marked `NEEDS CONFIRMATION`
 *      must be checked against the client's rate card before going live.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * While `PLAN_TEST_MODE` is on, checkout charges TEST_PRICE_INR instead of the
 * real amount — the client asked for ₹30 / ₹50 so they can verify the payment
 * flow end to end, then switch back to the real prices. Flip the env var
 * NEXT_PUBLIC_PLAN_TEST_MODE to "false" to charge real amounts.
 */

export const PLAN_TEST_MODE =
  process.env.NEXT_PUBLIC_PLAN_TEST_MODE !== "false";

/** Test amounts the client asked for, in rupees. */
export const TEST_PRICE_INR = {
  low: 30,
  high: 50,
} as const;

export interface PlanFeature {
  text: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  club: string;
  /** Original price in USD, shown struck through. 0 = no "was" price. */
  listPriceUSD: number;
  /** Current offer price in USD. 0 = free tier, no payment button. */
  offerPriceUSD: number;
  /** Which test amount this plan uses while PLAN_TEST_MODE is on. */
  testTier: keyof typeof TEST_PRICE_INR;
  highlight?: boolean;
  features: string[];
}

/**
 * SUBSCRIPTION PLANS — for Banquet Halls and Rooms.
 * Four columns; Core is free, so three PAY NOW buttons (client item #7).
 */
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "core",
    name: "Core",
    club: "Jade Club — 6 months subscription",
    listPriceUSD: 0,
    offerPriceUSD: 0,
    testTier: "low",
    features: [
      "Lowest visibility (visible only after clicking 'Show More' below Sapphire subscribers)",
      "Not visible on the first page, where most visitors land",
      "A commission of 10% applicable on sales",
      "10 photos a year",
      "Can reply to reviews",
      "Can list either Venues or Rooms",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    club: "Sapphire Club — 1 year subscription + 2 months free",
    listPriceUSD: 990, // NEEDS CONFIRMATION
    offerPriceUSD: 690, // NEEDS CONFIRMATION
    testTier: "low",
    features: [
      "Visible below Diamond and Ruby",
      "Your property videos and pictures will be uploaded on our social media pages when we start marketing to attract customers to your property",
      "Visible on the first or second page",
      "Can reply to reviews",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    club: "Ruby Club — 1 year subscription + 3 months free",
    listPriceUSD: 3930, // NEEDS CONFIRMATION
    offerPriceUSD: 996, // NEEDS CONFIRMATION
    testTier: "high",
    highlight: true,
    features: [
      "Visible below Diamond Club",
      "Your property videos and pictures will be uploaded on our social media pages when we start marketing to attract customers to your property",
      "Showcase your property by adding videos",
      "Can reply to reviews",
    ],
  },
  {
    id: "luxe",
    name: "Luxe",
    club: "Diamond Club — 1 year subscription + 4 months free",
    listPriceUSD: 6930, // NEEDS CONFIRMATION
    offerPriceUSD: 2625, // NEEDS CONFIRMATION
    testTier: "high",
    features: [
      "Buy one, get one free — get registered on both SoulsWed and AmazingHalls for a discount",
      "Topmost visibility to attract wedding customers on SoulsWed.com and event clients on AmazingHalls.com",
      "Your property videos and pictures will be uploaded on our social media pages",
      "Can reply to reviews",
    ],
  },
];

export interface AdvertisementPlan {
  id: string;
  title: string;
  details: string[];
  listPriceUSD: number;
  offerPriceUSD: number;
  testTier: keyof typeof TEST_PRICE_INR;
  highlight?: boolean;
}

/**
 * ADVERTISEMENT PLANS — for Hotels.
 * Five boxes, each with its own PAY NOW button (client item #11).
 */
export const ADVERTISEMENT_PLANS: AdvertisementPlan[] = [
  {
    id: "ad-home-single-14d",
    title: "Property video on the home page of SoulsWed.com or AmazingHalls.com — 14 days",
    details: [
      "Video will be linked to your page on SoulsWed.com or AmazingHalls.com",
      "Shortened and full versions of videos to be uploaded on social media platforms including Instagram, YouTube and Facebook",
    ],
    listPriceUSD: 2499, // NEEDS CONFIRMATION
    offerPriceUSD: 1590, // NEEDS CONFIRMATION
    testTier: "low",
    highlight: true,
  },
  {
    id: "ad-home-both-14d",
    title: "Property video on the home page of both SoulsWed.com and AmazingHalls.com — 14 days",
    details: [
      "Video will be linked to your page on both SoulsWed.com and AmazingHalls.com",
      "Shortened and full versions of videos to be uploaded on social media platforms including Instagram, YouTube and Facebook",
    ],
    listPriceUSD: 4899, // NEEDS CONFIRMATION
    offerPriceUSD: 2499, // NEEDS CONFIRMATION
    testTier: "low",
  },
  {
    id: "ad-home-both-extra-14d",
    title: "Property video on the home page of both sites — additional 14 days each",
    details: [
      "Video will be linked to your page on both SoulsWed.com and AmazingHalls.com",
      "Shortened and full versions of videos to be uploaded on social media platforms including Instagram, YouTube and Facebook",
    ],
    listPriceUSD: 2065, // NEEDS CONFIRMATION
    offerPriceUSD: 1599, // NEEDS CONFIRMATION
    testTier: "high",
  },
  {
    id: "ad-home-both-extra-1m",
    title: "Property video on the home page of both sites — additional 1 month each",
    details: [
      "Video will be linked to your page on both SoulsWed.com and AmazingHalls.com",
      "Shortened and full versions of videos to be uploaded on social media platforms including Instagram, YouTube and Facebook",
    ],
    listPriceUSD: 5995, // NEEDS CONFIRMATION
    offerPriceUSD: 2959, // NEEDS CONFIRMATION
    testTier: "high",
  },
  {
    id: "ad-inside-both-1m",
    title: "Property video on the inside pages of both sites — additional 1 month each",
    details: [
      "Video will be linked to your page on both SoulsWed.com and AmazingHalls.com",
      "Shortened and full versions of videos to be uploaded on social media platforms including Instagram, YouTube and Facebook",
    ],
    listPriceUSD: 2045, // NEEDS CONFIRMATION
    offerPriceUSD: 1149, // NEEDS CONFIRMATION
    testTier: "high",
  },
];

/** Contact routes offered alongside every plan (client item #11). */
export const PLAN_CONTACT = {
  emails: [
    "weddings@pearlsntiaras.com",
    "info@soulswed.com",
    "info@amazinghalls.com",
  ],
  /**
   * WhatsApp number in international format, digits only.
   * The number in the client's screenshot was too blurred to transcribe —
   * set NEXT_PUBLIC_WHATSAPP_NUMBER once the client confirms it.
   */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
} as const;

export function findPlan(id: string): SubscriptionPlan | AdvertisementPlan | undefined {
  return (
    SUBSCRIPTION_PLANS.find((p) => p.id === id) ??
    ADVERTISEMENT_PLANS.find((p) => p.id === id)
  );
}
