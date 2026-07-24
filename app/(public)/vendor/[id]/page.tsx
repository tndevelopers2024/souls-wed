"use client";

import { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { PublicVendor } from "@/components/vendors/PublicVendorDirectory";
import PublicVendorDetailPage from "@/components/vendors/PublicVendorDetailPage";

export default function VendorDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : params.id?.[0] ?? "";

  const [vendor, setVendor] = useState<PublicVendor | null>(null);
  const [vendorLoading, setVendorLoading] = useState(true);
  const [vendorNotFound, setVendorNotFound] = useState(false);

  // Record a real page view (feeds the vendor's analytics chart)
  useEffect(() => {
    if (!id) return;
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ providerId: id, providerType: "vendor" }),
    }).catch(() => {});
  }, [id]);

  // Fetch this vendor from MongoDB API
  useEffect(() => {
    if (!id) return;
    setVendorLoading(true);
    fetch(`/api/vendors?id=${encodeURIComponent(id)}`)
      .then((res) => res.json())
      .then((data) => {
        const raw = data.vendor || data.vendors?.[0];
        if (!raw) {
          setVendorNotFound(true);
          return;
        }
        setVendor(raw);
      })
      .catch(() => setVendorNotFound(true))
      .finally(() => setVendorLoading(false));
  }, [id]);

  if (vendorLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "var(--sw-white)" }}>
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: "var(--sw-primary)" }} />
        <p className="text-sm text-slate-500 font-medium">Loading vendor details...</p>
      </div>
    );
  }

  if (vendorNotFound || !vendor) {
    notFound();
  }

  return <PublicVendorDetailPage vendor={vendor} />;
}
