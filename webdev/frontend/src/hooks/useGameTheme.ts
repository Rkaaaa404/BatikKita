"use client";

import { useState, useEffect, useCallback } from "react";

export type GameTheme = "light" | "dark";

export function useGameTheme() {
  const [theme, setThemeState] = useState<GameTheme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("batik_game_theme") as GameTheme | null;
    if (saved === "dark" || saved === "light") {
      setThemeState(saved);
    } else {
      // Default to light as per user requirements
      setThemeState("light");
    }

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<GameTheme>;
      if (customEvent.detail) {
        setThemeState(customEvent.detail);
      }
    };

    window.addEventListener("batik_game_theme_change", handleThemeChange);
    return () => {
      window.removeEventListener("batik_game_theme_change", handleThemeChange);
    };
  }, []);

  const setTheme = useCallback((newTheme: GameTheme) => {
    setThemeState(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("batik_game_theme", newTheme);
      window.dispatchEvent(
        new CustomEvent<GameTheme>("batik_game_theme_change", { detail: newTheme })
      );
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  return {
    theme: mounted ? theme : "light",
    isDark: mounted && theme === "dark",
    isLight: !mounted || theme === "light",
    toggleTheme,
    setTheme,
  };
}
