"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Globe, Check } from "lucide-react";
import { XIcon } from "@/components/ui/x";

/**
 * Site-wide "sticker" promoting subscription and advertising to vendors.
 *
 * The client asked for this on every page until the vendor subscribes, with
 * Subscribe / Advertise buttons opening the two rate cards, and an X to close
 * it. Dismissal is remembered for the rest of the browsing session.
 */

const DISMISS_KEY = "sw-promo-sticker-dismissed";

export default function PromoSticker() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY) === "1") return;

    let cancelled = false;
    // Only vendors are being sold to — couples and admins never see this.
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data?.authenticated && data?.user?.role === "vendor") {
          setVisible(true);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed z-[95] bottom-24 left-4 sm:left-6 w-[320px] max-w-[calc(100vw-2rem)] rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500"
      style={{ background: "var(--sw-surface)", borderColor: "var(--sw-light-gray)" }}
      role="complementary"
      aria-label="Subscription and advertising offers"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Close"
        className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center transition-colors hover:bg-black/10 cursor-pointer"
        style={{ color: "var(--sw-steel)" }}
      >
        <XIcon className="w-3.5 h-3.5" />
      </button>

      <div className="p-4 pr-9">
        <p
          className="flex items-start gap-2 font-extrabold text-sm leading-snug mb-2"
          style={{ color: "var(--sw-navy)" }}
        >
          <Globe className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--sw-primary)" }} />
          Promote Your Hotel to High-Paying Customers!
        </p>

        <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--sw-steel)" }}>
          Get maximum visibility across the world and attract high-value guests to your hotel.
        </p>

        <ul className="flex flex-col gap-1.5 mb-4">
          {["Increase bookings", "Reach luxury travelers", "Boost your brand globally"].map(
            (benefit) => (
              <li
                key={benefit}
                className="flex items-center gap-2 text-xs font-semibold"
                style={{ color: "var(--sw-navy)" }}
              >
                <Check className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--sw-primary)" }} />
                {benefit}
              </li>
            )
          )}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/subscribe"
            className="flex-1 text-center px-3 py-2 rounded-full font-bold text-xs text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--sw-primary)" }}
          >
            Subscribe here
          </Link>
          <Link
            href="/advertise"
            className="flex-1 text-center px-3 py-2 rounded-full font-bold text-xs border transition-opacity hover:opacity-80"
            style={{
              borderColor: "var(--sw-primary)",
              color: "var(--sw-primary)",
              background: "transparent",
            }}
          >
            Advertise with us
          </Link>
        </div>
      </div>
    </div>
  );
}
