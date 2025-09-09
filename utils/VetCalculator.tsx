import React, { useState } from "react";

export function VetCalculator() {
  const [expr, setExpr] = useState<string>("");
  const [out, setOut] = useState<string>("");

  const press = (v: string) => {
    if (v === "C") { setExpr(""); setOut(""); return; }
    if (v === "=") {
      try { // eslint-disable-next-line no-new-func
        const r = Function(`"use strict"; return (${expr})`)();
        setOut(String(r));
      } catch { setOut("Erro"); }
      return;
    }
    setExpr((s) => s + v);
  };

  const keys = ["7","8","9","/","4","5","6","*","1","2","3","-","0",".","C","+","="];

  return (
    <div className="w-full h-full p-6 bg-white/90 dark:bg-slate-900/80 backdrop-blur">
      <div className="text-slate-500 text-xs mb-2">{expr || "\u00A0"}</div>
      <div className="text-3xl font-semibold text-slate-900 dark:text-white mb-4">={out || "0"}</div>
      <div className="grid grid-cols-4 gap-2">
        {keys.map((k) => (
          <button
            key={k}
            onClick={() => press(k)}
            className={`h-12 rounded-xl ${
              k === "="
                ? "bg-blue-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            }`}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}
