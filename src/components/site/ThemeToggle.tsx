"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "@/features/theme/useTheme";
import { SunIcon, MoonIcon } from "./icons";

const noopSubscribe = () => () => {};

/** false pendant le rendu serveur / l'hydratation, true ensuite (sans setState dans un effet). */
function useIsMounted() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export function ThemeToggle() {
  const { mode, setMode } = useTheme();
  const mounted = useIsMounted();

  if (!mounted) {
    // Le thème réel n'est connu que côté navigateur : on réserve juste la place.
    return <div className="h-9 w-9" />;
  }

  const isDark =
    mode === "dark" || (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <button
      type="button"
      onClick={() => setMode(isDark ? "light" : "dark")}
      aria-label={isDark ? "Passer au thème clair" : "Passer au thème sombre"}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:cursor-pointer hover:border-orange hover:text-orange"
    >
      {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
    </button>
  );
}
