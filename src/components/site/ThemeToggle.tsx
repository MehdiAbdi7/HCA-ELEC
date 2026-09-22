"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/features/theme/useTheme";
import { SunIcon, MoonIcon } from "./icons";

export function ThemeToggle() {
  const { mode, setMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Évite un rendu incohérent entre le HTML serveur et le client :
    // on réserve juste la place du bouton.
    return <div className="h-9 w-9" />;
  }

  const isDark =
    mode === "dark" ||
    (mode === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <button
      type="button"
      onClick={() => setMode(isDark ? "light" : "dark")}
      aria-label={isDark ? "Passer au thème clair" : "Passer au thème sombre"}
      className="flex h-9 w-9 items-center justify-center border border-line rounded-full text-ink-soft transition-colors hover:border-orange hover:text-orange hover:cursor-pointer"
    >
      {isDark ? (
        <SunIcon className="h-4 w-4" />
      ) : (
        <MoonIcon className="h-4 w-4" />
      )}
    </button>
  );
}
