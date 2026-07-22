"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

function StatusBanner() {
  const searchParams = useSearchParams();
  const success = searchParams?.get("success") === "true";
  const canceled = searchParams?.get("canceled") === "true";

  if (!success && !canceled) return null;

  return (
    <div
      className="mb-8 rounded-2xl border px-5 py-4 flex items-start gap-3"
      style={{
        borderColor: success ? "var(--sw-primary)" : "var(--sw-light-gray)",
        background: "var(--sw-surface-2)",
      }}
    >
      {success ? (
        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--sw-primary)" }} />
      ) : (
        <XCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--sw-steel)" }} />
      )}
      <div>
        <p className="font-bold text-sm" style={{ color: "var(--sw-navy)" }}>
          {success ? "Payment received — thank you!" : "Payment cancelled"}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--sw-steel)" }}>
          {success
            ? "Our team will confirm your plan by email shortly."
            : "No charge was made. You can pick a plan again whenever you're ready."}
        </p>
      </div>
    </div>
  );
}

/** Shows the outcome after Stripe redirects back to the rate card. */
export default function PlanCheckoutStatus() {
  return (
    <Suspense fallback={null}>
      <StatusBanner />
    </Suspense>
  );
}
