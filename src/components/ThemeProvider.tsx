"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "snapdev-app-theme";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): Theme {
  return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void } | null>(null);

/**
 * Scoped to the /app shell only (not the marketing site, whose section
 * washes and chip colors aren't dark-aware) - the `dark` class lands on a
 * wrapper div here rather than <html>, so only this subtree's `--color-*`
 * custom properties flip to their dark values.
 *
 * Reads the stored preference via useSyncExternalStore rather than
 * useState+useEffect: it's built for exactly this (syncing to an external,
 * client-only store like localStorage) and its getServerSnapshot avoids a
 * hydration mismatch instead of flashing the wrong theme after mount.
 */
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    // The native "storage" event only fires in *other* tabs, so dispatch one
    // here too - that's what wakes this tab's useSyncExternalStore subscriber.
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`bg-bg text-ink flex min-h-screen flex-col ${theme === "dark" ? "dark" : ""}`}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
