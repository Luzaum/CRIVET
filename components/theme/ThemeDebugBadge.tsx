import React from "react";

export function ThemeDebugBadge() {
  const t = document.documentElement.getAttribute("data-theme");
  return (
    <span className="fixed bottom-2 right-2 text-xs px-2 py-1 rounded bg-muted text-muted-foreground z-50">
      tema: {t}
    </span>
  );
}

