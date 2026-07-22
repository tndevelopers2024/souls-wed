import { MessageCircle, Mail } from "lucide-react";
import { PLAN_CONTACT } from "@/lib/config/plans";

/**
 * "Contact us for sharper discounts" — WhatsApp plus the three enquiry
 * addresses, shown under both rate cards (client item #11).
 */
export default function PlanContactStrip() {
  return (
    <div
      className="rounded-2xl border p-5 sm:p-6 flex flex-col items-center gap-4 text-center"
      style={{ borderColor: "var(--sw-light-gray)", background: "var(--sw-surface-2)" }}
    >
      <p className="text-sm font-semibold max-w-2xl" style={{ color: "var(--sw-navy)" }}>
        Want a sharper discount, or a package built around your property?
        Talk to us directly — we&apos;re happy to tailor something.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {PLAN_CONTACT.whatsapp && (
          <a
            href={`https://wa.me/${PLAN_CONTACT.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm text-white transition-opacity hover:opacity-90"
            style={{ background: "#25D366" }}
          >
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp
          </a>
        )}

        {PLAN_CONTACT.emails.map((email) => (
          <a
            key={email}
            href={`mailto:${email}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border font-semibold text-xs transition-colors hover:opacity-80"
            style={{
              borderColor: "var(--sw-light-gray)",
              color: "var(--sw-navy)",
              background: "var(--sw-surface)",
            }}
          >
            <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--sw-primary)" }} />
            {email}
          </a>
        ))}
      </div>
    </div>
  );
}
