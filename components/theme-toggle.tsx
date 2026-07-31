"use client";

import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import { applyTheme, getActiveTheme, type Theme } from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getActiveTheme());

  function toggle() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle color theme"
      className="rounded-full bg-transparent p-1 text-foreground transition-opacity hover:opacity-70"
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
