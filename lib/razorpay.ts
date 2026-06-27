/**
 * 🎓 RAZORPAY SERVER SDK INITIALIZATION
 * 
 * This file creates a Razorpay instance for SERVER-SIDE use only.
 * 
 * WHY SERVER-SIDE ONLY?
 * The key_secret is a sensitive credential. If exposed to the browser,
 * anyone could create fake orders or verify fake payments.
 * We ONLY use this on the server (in API routes).
 * 
 * The key_id (public) is safe to expose to the browser — it just
 * identifies your Razorpay account. The key_secret (private) is
 * what signs and verifies everything.
 * 
 * TEST MODE:
 * When using test keys (rzp_test_...), no real money is charged.
 * You can use test card numbers like 4111 1111 1111 1111 to simulate.
 */

import Razorpay from "razorpay";

// Create a singleton Razorpay instance
// Using lazy initialization to avoid errors if env vars aren't set yet
let razorpayInstance: Razorpay | null = null;

export function getRazorpay(): Razorpay {
  if (!razorpayInstance) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error(
        "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in .env"
      );
    }

    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  return razorpayInstance;
}
