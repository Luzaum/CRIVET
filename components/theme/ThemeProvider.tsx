import React, { useEffect, useState, createContext, useContext } from "react";

export type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// Aplica o tema em html[data-theme] e .dark (Tailwind)
function applyTheme(theme: Theme, storageKey: string) {
  const root = document.documentElement;
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const effective = theme === "dark" || (theme === "system" && mq.matches) ? "dark" : "light";

  root.setAttribute("data-theme", effective);
  if (effective === "dark") root.classList.add("dark");
  else root.classList.remove("dark");

  localStorage.setItem(storageKey, theme);
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "cri-vet-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
  });

  useEffect(() => {
    applyTheme(theme, storageKey);
  }, [theme, storageKey]);

  // Segue o sistema quando for "system"
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system", storageKey);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, [theme, storageKey]);

  const value = {
    theme,
    setTheme: (t: Theme) => setThemeState(t),
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

