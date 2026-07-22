import { Check } from "lucide-react";
import { SUBSCRIPTION_PLANS, PLAN_TEST_MODE, TEST_PRICE_INR } from "@/lib/config/plans";
import PayNowButton from "@/components/plans/PayNowButton";
import PlanContactStrip from "@/components/plans/PlanContactStrip";
import PlanCheckoutStatus from "@/components/plans/PlanCheckoutStatus";

export const metadata = {
  title: "Subscription Plans | SoulsWed",
  description:
    "Choose a SoulsWed subscription and get your property in front of couples planning destination weddings worldwide.",
};

function formatUSD(amount: number) {
  return `US $ ${amount.toLocaleString("en-US")}`;
}

export default function SubscribePage() {
  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <PlanCheckoutStatus />

        {/* ── Header ── */}
        <div className="text-center mb-4">
          <h1
            className="text-3xl md:text-4xl font-extrabold font-heading mb-3"
            style={{ color: "var(--sw-primary)" }}
          >
            Subscription Plans
          </h1>
          <p className="text-sm font-semibold" style={{ color: "var(--sw-steel)" }}>
            For Banquet Halls and Rooms
          </p>
        </div>

        <div className="text-center mb-10">
          <p className="text-lg font-bold" style={{ color: "var(--sw-blue)" }}>
            Special Pre-Launch Offer*
          </p>
          <p className="text-[11px] mt-1" style={{ color: "var(--sw-steel)" }}>
            (Terms and Conditions Apply)
          </p>
        </div>

        {PLAN_TEST_MODE && (
          <div
            className="max-w-3xl mx-auto mb-10 rounded-xl border px-4 py-3 text-center text-xs font-semibold"
            style={{ borderColor: "var(--sw-primary)", color: "var(--sw-primary)" }}
          >
            Payment verification mode — checkout currently charges ₹
            {TEST_PRICE_INR.low} / ₹{TEST_PRICE_INR.high} instead of the listed price,
            so the payment flow can be tested end to end.
          </div>
        )}

        {/* ── Plan columns ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-14 items-stretch">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isFree = plan.offerPriceUSD <= 0;
            return (
              <div
                key={plan.id}
                className="rounded-2xl border flex flex-col p-6 transition-shadow hover:shadow-lg"
                style={{
                  borderColor: plan.highlight ? "var(--sw-primary)" : "var(--sw-light-gray)",
                  borderWidth: plan.highlight ? 2 : 1,
                  background: "var(--sw-surface)",
                }}
              >
                <h2
                  className="text-xl font-extrabold text-center font-heading"
                  style={{ color: "var(--sw-primary)" }}
                >
                  {plan.name}
                </h2>

                {/* Pricing — blue, not yellow (client item #7) */}
                <div className="text-center mt-4 mb-5 min-h-[72px] flex flex-col justify-center">
                  {plan.listPriceUSD > 0 && (
                    <p
                      className="text-xs line-through opacity-70"
                      style={{ color: "var(--sw-steel)" }}
                    >
                      {formatUSD(plan.listPriceUSD)}/-
                    </p>
                  )}
                  <p className="text-lg font-extrabold" style={{ color: "var(--sw-blue)" }}>
                    {isFree
                      ? "US $ 0 (Free)"
                      : `Now ${formatUSD(plan.offerPriceUSD)}/- + taxes`}
                  </p>
                </div>

                <p
                  className="text-[11px] font-bold uppercase tracking-wider text-center mb-4 pb-4 border-b"
                  style={{ color: "var(--sw-navy)", borderColor: "var(--sw-light-gray)" }}
                >
                  {plan.club}
                </p>

                <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs leading-relaxed">
                      <Check
                        className="w-3.5 h-3.5 shrink-0 mt-0.5"
                        style={{ color: "var(--sw-primary)" }}
                      />
                      <span style={{ color: "var(--sw-steel)" }}>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Free tier has nothing to pay for — hence 3 PAY NOW buttons, not 4 */}
                <div className="mt-auto">
                  {isFree ? (
                    <p
                      className="text-center text-xs font-bold py-2.5 rounded-full border"
                      style={{ borderColor: "var(--sw-light-gray)", color: "var(--sw-steel)" }}
                    >
                      Included free
                    </p>
                  ) : (
                    <PayNowButton planId={plan.id} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <PlanContactStrip />
      </div>
    </main>
  );
}
