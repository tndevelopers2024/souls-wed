"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface PayNowButtonProps {
  planId: string;
  className?: string;
}

export default function PayNowButton({ planId, className = "" }: PayNowButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/plans/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();

      if (res.status === 401) {
        router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
      if (!res.ok || !data.url) {
        setError(data.message || "Could not start payment.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Could not start payment. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-stretch gap-1.5 w-full">
      <button
        type="button"
        onClick={startCheckout}
        disabled={loading}
        className={`w-full px-5 py-2.5 rounded-full font-bold text-sm text-white transition-opacity cursor-pointer hover:opacity-90 disabled:opacity-60 disabled:cursor-default flex items-center justify-center gap-2 ${className}`}
        style={{ background: "var(--sw-primary)" }}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Starting…
          </>
        ) : (
          "PAY NOW"
        )}
      </button>
      {error && (
        <p className="text-[11px] font-semibold text-red-500 text-center">{error}</p>
      )}
    </div>
  );
}
