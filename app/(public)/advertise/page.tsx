import { Check } from "lucide-react";
import { ADVERTISEMENT_PLANS, PLAN_TEST_MODE, TEST_PRICE_INR } from "@/lib/config/plans";
import PayNowButton from "@/components/plans/PayNowButton";
import PlanContactStrip from "@/components/plans/PlanContactStrip";
import PlanCheckoutStatus from "@/components/plans/PlanCheckoutStatus";

export const metadata = {
  title: "Advertise With Us | SoulsWed",
  description:
    "Put your property video on the home page of SoulsWed.com and AmazingHalls.com and reach high-value guests worldwide.",
};

function formatUSD(amount: number) {
  return `US $ ${amount.toLocaleString("en-US")}`;
}

export default function AdvertisePage() {
  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <PlanCheckoutStatus />

        {/* ── Header ── */}
        <div className="text-center mb-4">
          <h1
            className="text-3xl md:text-4xl font-extrabold font-heading mb-3"
            style={{ color: "var(--sw-primary)" }}
          >
            Advertisement Plans
          </h1>
          <p className="text-sm font-semibold" style={{ color: "var(--sw-steel)" }}>
            For Hotels
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
            className="mb-10 rounded-xl border px-4 py-3 text-center text-xs font-semibold"
            style={{ borderColor: "var(--sw-primary)", color: "var(--sw-primary)" }}
          >
            Payment verification mode — checkout currently charges ₹
            {TEST_PRICE_INR.low} / ₹{TEST_PRICE_INR.high} instead of the listed price,
            so the payment flow can be tested end to end.
          </div>
        )}

        {/* ── One box per plan, each with its own PAY NOW (client item #11) ── */}
        <div className="flex flex-col gap-4 mb-14">
          {ADVERTISEMENT_PLANS.map((plan) => (
            <div
              key={plan.id}
              className="rounded-2xl border p-5 sm:p-6 grid gap-5 md:grid-cols-[1fr_auto] md:items-center transition-shadow hover:shadow-lg"
              style={{
                borderColor: plan.highlight ? "var(--sw-primary)" : "var(--sw-light-gray)",
                borderWidth: plan.highlight ? 2 : 1,
                background: "var(--sw-surface)",
              }}
            >
              <div>
                <h2
                  className="text-sm font-bold uppercase tracking-wide leading-snug mb-3"
                  style={{ color: "var(--sw-navy)" }}
                >
                  {plan.title}
                </h2>
                <ul className="flex flex-col gap-2">
                  {plan.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-2 text-xs leading-relaxed">
                      <Check
                        className="w-3.5 h-3.5 shrink-0 mt-0.5"
                        style={{ color: "var(--sw-primary)" }}
                      />
                      <span style={{ color: "var(--sw-steel)" }}>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price + payment, at the spot the client circled */}
              <div className="md:w-56 flex flex-col gap-3 md:text-right md:pl-6 md:border-l"
                style={{ borderColor: "var(--sw-light-gray)" }}
              >
                <div>
                  {plan.listPriceUSD > 0 && (
                    <p
                      className="text-xs line-through opacity-70"
                      style={{ color: "var(--sw-steel)" }}
                    >
                      {formatUSD(plan.listPriceUSD)}/-
                    </p>
                  )}
                  <p
                    className="text-base font-extrabold leading-snug"
                    style={{ color: "var(--sw-blue)" }}
                  >
                    Now {formatUSD(plan.offerPriceUSD)}/- + taxes
                  </p>
                </div>
                <PayNowButton planId={plan.id} />
              </div>
            </div>
          ))}
        </div>

        <PlanContactStrip />
      </div>
    </main>
  );
}
