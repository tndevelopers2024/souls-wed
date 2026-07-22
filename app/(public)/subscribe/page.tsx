import { SUBSCRIPTION_RATE_CARDS, PLAN_TEST_MODE, TEST_PRICE_INR } from "@/lib/config/plans";
import { SubscriptionRateCards } from "@/components/plans/RateCardTabs";
import PlanContactStrip from "@/components/plans/PlanContactStrip";
import PlanCheckoutStatus from "@/components/plans/PlanCheckoutStatus";

export const metadata = {
  title: "Subscription Plans | SoulsWed",
  description:
    "Choose a SoulsWed subscription and get your property in front of couples planning destination weddings worldwide.",
};

export default function SubscribePage() {
  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <PlanCheckoutStatus />

        <div className="text-center mb-4">
          <h1
            className="text-3xl md:text-4xl font-extrabold font-heading mb-3"
            style={{ color: "var(--sw-primary)" }}
          >
            Subscription Plans
          </h1>
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

        <SubscriptionRateCards cards={SUBSCRIPTION_RATE_CARDS} />

        <PlanContactStrip />
      </div>
    </main>
  );
}
