"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function VendorLoginPage() {
  const router = useRouter();
  useEffect(() => {
    router.push("/vendor/dashboard");
  }, [router]);
  return <div>Vendor Login Page</div>;
}
