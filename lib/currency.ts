export interface CurrencyDetail {
  code: string;
  /** How many INR equal 1 unit of this currency (e.g. 1 USD = 83.5 INR) */
  rate: number;
  symbol: string;
}

export const CURRENCIES: Record<string, CurrencyDetail> = {
  INR: { code: "INR", rate: 1.0,   symbol: "₹"    },
  USD: { code: "USD", rate: 83.5,  symbol: "$"    },
  EUR: { code: "EUR", rate: 90.0,  symbol: "€"    },
  GBP: { code: "GBP", rate: 106.0, symbol: "£"    },
  AED: { code: "AED", rate: 22.7,  symbol: "AED " },
  CAD: { code: "CAD", rate: 61.0,  symbol: "C$"   },
  CHF: { code: "CHF", rate: 93.0,  symbol: "CHF " },
  LKR: { code: "LKR", rate: 0.28,  symbol: "Rs "  },
  NZD: { code: "NZD", rate: 51.0,  symbol: "NZ$"  },
  THB: { code: "THB", rate: 2.27,  symbol: "฿"    },
  ZAR: { code: "ZAR", rate: 4.45,  symbol: "R "   },
};

/**
 * Converts an INR amount to the target currency amount.
 */
export function convertINRTo(amountInINR: number, targetCurrency: string): number {
  const detail = CURRENCIES[targetCurrency] ?? CURRENCIES.INR;
  return amountInINR / detail.rate;
}

/**
 * Formats an INR amount as a display string in the target currency.
 */
export function formatAsCurrency(amountInINR: number, targetCurrency: string): string {
  const detail = CURRENCIES[targetCurrency] ?? CURRENCIES.INR;
  const converted = convertINRTo(amountInINR, targetCurrency);

  if (targetCurrency === "INR") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amountInINR);
  }

  return `${detail.symbol}${Math.round(converted).toLocaleString()}`;
}

/**
 * Parses an INR price string like "₹3,35,840" or "₹335840" (or a raw number) into a plain number.
 */
function parseINRString(priceStr: string | number | undefined | null): number {
  if (!priceStr) return 0;
  if (typeof priceStr === "number") return priceStr;
  const cleaned = String(priceStr).replace(/[₹,\s]/g, "");
  return parseFloat(cleaned) || 0;
}

/**
 * Converts an INR price string or number (e.g. "₹335840" or 335840) to a display string in the target currency.
 */
export function convertPriceString(priceStr: string | number | undefined | null, targetCurrency: string): string {
  const inr = parseINRString(priceStr);
  if (inr === 0) return priceStr ? String(priceStr) : "";
  return formatAsCurrency(inr, targetCurrency);
}
