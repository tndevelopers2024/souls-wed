"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

interface ThemeToggleProps {
  className?: string;
  /**
   * "nav"  — compact pill used inside dashboard headers.
   * "fab"  — 56px floating action button matching the scroll-top / WhatsApp stack.
   */
  variant?: "nav" | "fab";
}

export default function ThemeToggle({ className = "", variant = "nav" }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  const base =
    variant === "fab"
      ? "flex items-center justify-center w-14 h-14 rounded-full shadow-xl transition-all hover:scale-110 hover:shadow-2xl border bg-[var(--sw-surface)] border-black/10 text-[var(--sw-navy)] dark:border-white/15"
      : "relative inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-300 border-black/10 text-[var(--sw-navy)] hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10";

  const iconSize = variant === "fab" ? "h-6 w-6" : "h-[18px] w-[18px]";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={`${base} ${className}`}
      style={variant === "fab" ? { boxShadow: "0 8px 24px rgba(0,0,0,0.18)" } : undefined}
    >
      <span className="relative inline-flex items-center justify-center">
        <Sun className={`${iconSize} rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0`} />
        <Moon className={`${iconSize} absolute rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100`} />
      </span>
    </button>
  );
}
