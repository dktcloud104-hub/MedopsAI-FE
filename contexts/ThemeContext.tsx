"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Always start with "light" so server and client match (avoids hydration error)
  const [theme, setTheme] = useState<Theme>("light");

  // After mount, read theme from localStorage and apply (client-only)
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme === "dark" || savedTheme === "light") {
      document.documentElement.classList.add("no-transition");
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      setTheme(savedTheme);
      setTimeout(() => document.documentElement.classList.remove("no-transition"), 100);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    
    // Ensure no-transition is removed
    document.documentElement.classList.remove("no-transition");
    
    // Function to apply theme
    const applyTheme = () => {
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme);
    };
    
    // Use View Transitions API if available for smoother transition
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document).startViewTransition(() => applyTheme());
    } else {
      // Fallback to regular transition
      applyTheme();
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
