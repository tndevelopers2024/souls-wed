"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VendorRootPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/login?role=vendor");
  }, [router]);
  return null;
}
