"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTheme, type ThemeMode } from "./themeSlice";

function applyTheme(mode: ThemeMode) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = mode === "dark" || (mode === "system" && prefersDark);
  document.documentElement.classList.toggle("dark", isDark);
}

export function useTheme() {
  const mode = useAppSelector((state) => state.theme.mode);
  const dispatch = useAppDispatch();

  useEffect(() => {
    applyTheme(mode);
    try {
      localStorage.setItem("theme", mode);
    } catch {
      // ignore
    }
  }, [mode]);

  useEffect(() => {
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  return { mode, setMode: (next: ThemeMode) => dispatch(setTheme(next)) };
}
