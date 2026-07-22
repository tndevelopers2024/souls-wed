"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type {
  SubscriptionRateCard,
  AdvertisementRateCard,
} from "@/lib/config/plans";
import PayNowButton from "./PayNowButton";

function formatUSD(amount: number) {
  return `US $ ${amount.toLocaleString("en-US")}`;
}

function Tabs({
  options,
  active,
  onSelect,
}: {
  options: { slug: string; label: string }[];
  active: string;
  onSelect: (slug: string) => void;
}) {
  if (options.length < 2) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
      {options.map((o) => {
        const isActive = o.slug === active;
        return (
          <button
            key={o.slug}
            type="button"
            onClick={() => onSelect(o.slug)}
            className="px-4 py-2 rounded-full text-xs font-bold border transition-colors cursor-pointer"
            style={
              isActive
                ? { background: "var(--sw-primary)", borderColor: "var(--sw-primary)", color: "#fff" }
                : { borderColor: "var(--sw-light-gray)", color: "var(--sw-steel)", background: "var(--sw-surface)" }
            }
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Subscription rate cards — one tab per vendor category. */
export function SubscriptionRateCards({ cards }: { cards: SubscriptionRateCard[] }) {
  const [active, setActive] = useState(cards[0]?.slug ?? "");
  const card = cards.find((c) => c.slug === active) ?? cards[0];
  if (!card) return null;

  return (
    <>
      <Tabs options={cards} active={card.slug} onSelect={setActive} />

      <p className="text-center text-sm font-semibold mb-8" style={{ color: "var(--sw-steel)" }}>
        {card.subtitle}
      </p>

      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-6 mb-14 items-stretch ${
          card.tiers.length >= 4 ? "xl:grid-cols-4" : "lg:grid-cols-3"
        }`}
      >
        {card.tiers.map((tier) => {
          const isFree = tier.offerPriceUSD <= 0;
          return (
            <div
              key={tier.id}
              className="rounded-2xl border flex flex-col p-6 transition-shadow hover:shadow-lg"
              style={{
                borderColor: tier.highlight ? "var(--sw-primary)" : "var(--sw-light-gray)",
                borderWidth: tier.highlight ? 2 : 1,
                background: "var(--sw-surface)",
              }}
            >
              <h3
                className="text-xl font-extrabold text-center font-heading"
                style={{ color: "var(--sw-primary)" }}
              >
                {tier.name}
              </h3>

              {/* Pricing — blue, not yellow (client item #7) */}
              <div className="text-center mt-4 mb-5 min-h-[76px] flex flex-col justify-center">
                {tier.listPriceUSD > 0 && (
                  <p className="text-xs line-through opacity-70" style={{ color: "var(--sw-steel)" }}>
                    {formatUSD(tier.listPriceUSD)}/-
                  </p>
                )}
                <p className="text-lg font-extrabold" style={{ color: "var(--sw-blue)" }}>
                  {isFree ? "US $ 0 (Free)" : `Now ${formatUSD(tier.offerPriceUSD)}/- + taxes`}
                </p>
                {tier.extra && (
                  <p className="text-[11px] font-bold mt-0.5" style={{ color: "var(--sw-primary)" }}>
                    + {tier.extra}
                  </p>
                )}
              </div>

              <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs leading-relaxed">
                    <Check
                      className="w-3.5 h-3.5 shrink-0 mt-0.5"
                      style={{ color: "var(--sw-primary)" }}
                    />
                    <span style={{ color: "var(--sw-steel)" }}>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Free tier has nothing to pay for — so a 4-tier card shows 3 PAY NOW buttons */}
              <div className="mt-auto">
                {isFree ? (
                  <p
                    className="text-center text-xs font-bold py-2.5 rounded-full border"
                    style={{ borderColor: "var(--sw-light-gray)", color: "var(--sw-steel)" }}
                  >
                    Included free
                  </p>
                ) : (
                  <PayNowButton planId={tier.id} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/** Advertisement rate cards — one tab for hotels, one for all other vendors. */
export function AdvertisementRateCards({ cards }: { cards: AdvertisementRateCard[] }) {
  const [active, setActive] = useState(cards[0]?.slug ?? "");
  const card = cards.find((c) => c.slug === active) ?? cards[0];
  if (!card) return null;

  return (
    <>
      <Tabs options={cards} active={card.slug} onSelect={setActive} />

      <div className="flex flex-col gap-4 mb-14">
        {card.options.map((option) => (
          <div
            key={option.id}
            className="rounded-2xl border p-5 sm:p-6 grid gap-5 md:grid-cols-[1fr_auto] md:items-center transition-shadow hover:shadow-lg"
            style={{
              borderColor: option.highlight ? "var(--sw-primary)" : "var(--sw-light-gray)",
              borderWidth: option.highlight ? 2 : 1,
              background: "var(--sw-surface)",
            }}
          >
            <div>
              <h3
                className="text-sm font-bold uppercase tracking-wide leading-snug mb-3"
                style={{ color: "var(--sw-navy)" }}
              >
                {option.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {option.details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs leading-relaxed">
                    <Check
                      className="w-3.5 h-3.5 shrink-0 mt-0.5"
                      style={{ color: "var(--sw-primary)" }}
                    />
                    <span style={{ color: "var(--sw-steel)" }}>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price + payment, at the spot the client circled (item #11) */}
            <div
              className="md:w-56 flex flex-col gap-3 md:text-right md:pl-6 md:border-l"
              style={{ borderColor: "var(--sw-light-gray)" }}
            >
              <div>
                {option.listPriceUSD > 0 && (
                  <p className="text-xs line-through opacity-70" style={{ color: "var(--sw-steel)" }}>
                    {formatUSD(option.listPriceUSD)}/-
                  </p>
                )}
                <p
                  className="text-base font-extrabold leading-snug"
                  style={{ color: "var(--sw-blue)" }}
                >
                  Now {formatUSD(option.offerPriceUSD)}/- + taxes
                </p>
              </div>
              <PayNowButton planId={option.id} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
