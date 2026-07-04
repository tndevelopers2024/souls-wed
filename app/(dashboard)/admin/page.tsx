"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * /admin → redirects to the unified login page with role=admin pre-selected.
 */
export default function AdminLoginRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/login?role=admin");
  }, [router]);
  return null;
}
