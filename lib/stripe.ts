import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY must be set in .env");
    }

    stripeInstance = new Stripe(secretKey, {
      apiVersion: "2025-02-24.acacia" as any, // Latest API version
    });
  }

  return stripeInstance;
}
