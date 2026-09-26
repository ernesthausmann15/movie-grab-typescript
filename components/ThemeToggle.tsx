"use client";

import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

/**
 * Fluid day/night control — Obsidian cinematic ↔ ultra-clean light.
 */
export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "theme-toggle group relative inline-flex min-h-[46px] items-center gap-2.5 overflow-hidden border px-[18px] py-[13px] font-mono text-[0.84rem] font-medium uppercase tracking-[0.04em] transition-all duration-500",
        isDark
          ? "is-dark border-white/20 text-zinc-100 hover:bg-red-500/15"
          : "is-light border-slate-300 bg-white/70 text-slate-900 hover:bg-sky-500/10",
        className,
      )}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      aria-pressed={isDark}
    >
      <span
        className={cn(
          "toggle-track relative h-3.5 w-7 shrink-0 rounded-full border transition-colors duration-500",
          isDark ? "border-red-500/40 bg-red-500/20" : "border-amber-400/50 bg-sky-400/25",
        )}
        aria-hidden="true"
      >
        <span
          className={cn(
            "toggle-orb absolute top-0.5 left-0.5 h-2.5 w-2.5 rounded-full transition-all duration-500 ease-out",
            isDark
              ? "translate-x-3 bg-[#E50914] shadow-[0_0_14px_rgba(229,9,20,0.85)]"
              : "translate-x-0 bg-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.85)]",
          )}
        />
      </span>
      <span className="toggle-label relative z-10 transition-opacity duration-300">
        {isDark ? "NIGHT" : "DAY"}
      </span>
    </button>
  );
}
