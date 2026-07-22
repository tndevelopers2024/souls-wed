"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Globe, Check } from "lucide-react";
import { XIcon } from "@/components/ui/x";

interface PlanOfferModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Shown after a vendor saves their listing — points them at the subscription
 * and advertising rate cards. Always closable with the X (client item #9).
 */
export default function PlanOfferModal({ open, onClose }: PlanOfferModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Subscription and advertising offers"
    >
      <div
        className="relative w-full max-w-md rounded-2xl border shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-300"
        style={{ background: "var(--sw-surface)", borderColor: "var(--sw-light-gray)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-black/10 cursor-pointer"
          style={{ color: "var(--sw-steel)" }}
        >
          <XIcon className="w-4 h-4" />
        </button>

        <p
          className="flex items-start gap-2.5 font-extrabold text-lg leading-snug mb-3 pr-6"
          style={{ color: "var(--sw-navy)" }}
        >
          <Globe className="w-5 h-5 shrink-0 mt-1" style={{ color: "var(--sw-primary)" }} />
          Promote Your Hotel to High-Paying Customers!
        </p>

        <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--sw-steel)" }}>
          Get maximum visibility across the world and attract high-value guests to your hotel.
        </p>

        <ul className="flex flex-col gap-2 mb-6">
          {["Increase bookings", "Reach luxury travelers", "Boost your brand globally"].map(
            (benefit) => (
              <li
                key={benefit}
                className="flex items-center gap-2.5 text-sm font-semibold"
                style={{ color: "var(--sw-navy)" }}
              >
                <Check className="w-4 h-4 shrink-0" style={{ color: "var(--sw-primary)" }} />
                {benefit}
              </li>
            )
          )}
        </ul>

        <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
          <Link
            href="/subscribe"
            className="flex-1 text-center px-4 py-2.5 rounded-full font-bold text-sm text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--sw-primary)" }}
          >
            Subscribe here
          </Link>
          <Link
            href="/advertise"
            className="flex-1 text-center px-4 py-2.5 rounded-full font-bold text-sm border transition-opacity hover:opacity-80"
            style={{ borderColor: "var(--sw-primary)", color: "var(--sw-primary)" }}
          >
            Advertise with us
          </Link>
        </div>
      </div>
    </div>
  );
}
