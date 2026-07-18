"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { usePathname, useServerInsertedHTML } from "next/navigation";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Dark mode exists only in the admin and vendor dashboards. Everything a
 * customer can reach is light-only. `/vendor/dashboard` rather than `/vendor`
 * because `/vendor/[id]` is a public listing page.
 */
function isThemedPath(pathname: string | null | undefined) {
  return !!pathname && (pathname.startsWith("/admin") || pathname.startsWith("/vendor/dashboard"));
}

/**
 * Applies/removes the `.dark` class on <html> and syncs `color-scheme`.
 * The pre-hydration inline script in the root layout sets this before paint
 * to avoid a flash; this keeps React state in sync and persists user choice.
 */
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

// Runs before paint to set the theme class and avoid a flash of the wrong theme.
const themeInitScript = `(function(){try{var p=window.location.pathname;var isPriv=p.startsWith('/admin')||p.startsWith('/vendor/dashboard');if(!isPriv){document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme='light';return;}var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}var d=document.documentElement;d.classList.toggle('dark',t==='dark');d.style.colorScheme=t;}catch(e){}})();`;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const pathname = usePathname();

  useServerInsertedHTML(() => {
    return <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />;
  });

  // On mount, read what the anti-FOUC script already decided (localStorage or system).
  useEffect(() => {
    if (!isThemedPath(pathname)) {
      setThemeState("light");
      applyTheme("light");
      return;
    }

    const stored = (typeof localStorage !== "undefined" && localStorage.getItem("theme")) as Theme | null;
    const initial: Theme =
      stored === "light" || stored === "dark"
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    setThemeState(initial);
    applyTheme(initial);
  }, [pathname]);

  // Follow system changes only until the user makes an explicit choice.
  useEffect(() => {
    if (!isThemedPath(pathname)) return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        const next: Theme = e.matches ? "dark" : "light";
        setThemeState(next);
        applyTheme(next);
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [pathname]);

  const setTheme = useCallback((t: Theme) => {
    if (t === "dark" && !isThemedPath(window.location.pathname)) return;

    setThemeState(t);
    applyTheme(t);
    try {
      localStorage.setItem("theme", t);
    } catch {}
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === "dark", setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Safe fallback so components used outside the provider don't crash.
    return { theme: "light" as Theme, isDark: false, setTheme: () => {}, toggleTheme: () => {} };
  }
  return ctx;
}
