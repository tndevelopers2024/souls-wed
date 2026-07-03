export interface CurrencyDetail {
  code: string;
  rate: number; // 1 unit of this currency = how many INR (e.g. 1 USD = 83.5 INR)
  symbol: string;
  isRazorpay: boolean; // Route INR to Razorpay, others to Stripe
}

export const CURRENCIES: Record<string, CurrencyDetail> = {
  INR: { code: "INR", rate: 1.0, symbol: "₹", isRazorpay: true },
  USD: { code: "USD", rate: 83.5, symbol: "$", isRazorpay: false },
  EUR: { code: "EUR", rate: 90.0, symbol: "€", isRazorpay: false },
  GBP: { code: "GBP", rate: 106.0, symbol: "£", isRazorpay: false },
  AED: { code: "AED", rate: 22.7, symbol: "AED ", isRazorpay: false },
  CAD: { code: "CAD", rate: 61.0, symbol: "C$", isRazorpay: false },
  CHF: { code: "CHF", rate: 93.0, symbol: "CHF ", isRazorpay: false },
  LKR: { code: "LKR", rate: 0.28, symbol: "Rs ", isRazorpay: false },
  NZD: { code: "NZD", rate: 51.0, symbol: "NZ$", isRazorpay: false },
  THB: { code: "THB", rate: 2.27, symbol: "฿", isRazorpay: false },
  ZAR: { code: "ZAR", rate: 4.45, symbol: "R ", isRazorpay: false },
};

/**
 * Converts an INR amount to target currency.
 */
export function convertINRTo(amountInINR: number, targetCurrency: string): number {
  const currencyDetail = CURRENCIES[targetCurrency] || CURRENCIES.INR;
  return amountInINR / currencyDetail.rate;
}

/**
 * Formats an amount with the currency symbol.
 */
export function formatAsCurrency(amountInINR: number, targetCurrency: string): string {
  const currencyDetail = CURRENCIES[targetCurrency] || CURRENCIES.INR;
  const converted = convertINRTo(amountInINR, targetCurrency);
  
  // Format based on currency type
  if (targetCurrency === "INR") {
    // Standard Indian formatting (e.g., Lakhs/Crores)
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amountInINR);
  }

  // Standard international formatting
  return `${currencyDetail.symbol}${Math.round(converted).toLocaleString()}`;
}

/**
 * Parses an INR price string like "₹3,35,840" or "₹335840" into a plain number.
 */
export function parseINRString(priceStr: string | undefined | null): number {
  if (!priceStr) return 0;
  const cleaned = priceStr.replace(/[₹,\s]/g, "");
  return parseFloat(cleaned) || 0;
}

/**
 * Converts an INR price string (e.g. "₹335840") to the target currency formatted string.
 * Drop-in replacement for displaying any price stored as an INR string.
 */
export function convertPriceString(priceStr: string | undefined | null, targetCurrency: string): string {
  const inr = parseINRString(priceStr);
  if (inr === 0) return priceStr || "";
  return formatAsCurrency(inr, targetCurrency);
}
