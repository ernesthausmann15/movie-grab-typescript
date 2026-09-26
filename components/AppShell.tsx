"use client";

import type { ReactNode } from "react";
import AmbientBackground from "@/components/AmbientBackground";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

export default function AppShell({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  return (
    <div
      className={cn(
        "app-shell relative isolate min-h-screen",
        theme === "light" ? "theme-light" : "theme-dark",
      )}
    >
      <AmbientBackground />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <div className="relative z-10 flex-1">{children}</div>
        <Footer />
      </div>
    </div>
  );
}
