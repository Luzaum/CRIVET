import React, { useMemo, useState, useRef } from "react";

// =============================================================
// Helpers (pure) — kept simple for easier debugging & tests
// =============================================================
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const fmt = (n: number) => (Number.isInteger(n) ? n.toString() : n.toFixed(2).replace(/\.00$/, ""));

function computeSteps(min: number, max: number) {
  const stepFine = Math.max(0.01, (max - min) / 100);
  const stepCoarse = Math.max(stepFine * 5, (max - min) / 10);
  return { stepFine, stepCoarse };
}

function computeTrackPercents(min: number, max: number, rec: { min: number; max: number }) {
  // Se não há faixa recomendada definida, usa os limites originais
  if (rec.min === 0 && rec.max === 0) {
    return {
      lowLeft: 0, lowRight: 0,
      recLeft: 0, recRight: 100,
      highLeft: 100, highRight: 100,
      adjustedMin: min, adjustedMax: max
    };
  }
  
  // Calcula as faixas baseadas na dose recomendada
  const lowThreshold = rec.min * 0.5; // 50% abaixo da dose mínima
  const highThreshold = rec.max * 1.5; // 50% acima da dose máxima
  
  // Usa a faixa recomendada como base, expandindo apenas o necessário
  const range = rec.max - rec.min;
  const margin = range * 0.5; // 50% da faixa como margem
  
  const adjustedMin = Math.max(0, rec.min - margin);
  const adjustedMax = rec.max + margin;
  
  // Calcula os percentuais das faixas
  const totalRange = adjustedMax - adjustedMin;
  
  // Faixa amarela: de 0% até o início da dose recomendada (cobre toda a subdose)
  const lowLeft = 0;
  const lowRight = ((rec.min - adjustedMin) / totalRange) * 100;
  
  // Faixa verde: dose recomendada
  const recLeft = ((rec.min - adjustedMin) / totalRange) * 100;
  const recRight = ((rec.max - adjustedMin) / totalRange) * 100;
  
  // Faixa vermelha: de onde a verde termina até 100%
  const highLeft = recRight;
  const highRight = 100;
  
  return { 
    lowLeft, lowRight, 
    recLeft, recRight, 
    highLeft, highRight,
    adjustedMin, adjustedMax 
  };
}

function valueToPercent(min: number, max: number, value: number) {
  return ((clamp(value, min, max) - min) / (max - min)) * 100;
}

function percentToValue(min: number, max: number, percent: number) {
  const p = clamp(percent, 0, 100) / 100;
  return min + (max - min) * p;
}

function sanitizePresets(input: number[] | undefined, min: number, max: number, fallback: number[]): number[] {
  if (!input || input.length === 0) return fallback;
  const uniq = Array.from(new Set(input.map((n) => Number(n))));
  const clamped = uniq.map((n) => clamp(n, min, max));
  const sorted = clamped.sort((a, b) => a - b);
  return sorted.slice(0, 5); // Limita a 5 presets
}

// =============================================================
// Theme tokens (shadcn-esque, BLUE palette responsive to dark)
// =============================================================
const twCard =
  "rounded-xl p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-4";
const twValue = "text-2xl font-bold";

// =============================================================
// Value badge (green=in, amber=low, rose=high)
// =============================================================
function ValueBadge({ value, unit, rec }: { value: number; unit: string; rec: { min: number; max: number } }) {
  const status = value < rec.min ? "low" : value > rec.max ? "high" : "in";
  const clsNum = status === "in" ? "text-green-600" : status === "low" ? "text-amber-600" : "text-rose-600";
  const clsTag =
    status === "in"
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
      : status === "low"
      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
      : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300";

  return (
    <div className="flex items-center justify-between" aria-live="polite">
      <div className={`${twValue} ${clsNum}`}>
        {fmt(value)} <span className="text-base font-medium opacity-70">{unit}</span>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${clsTag}`}>
        {status === "in" ? "Faixa recomendada" : status === "low" ? "Abaixo do recomendado" : "Acima do recomendado"}
      </span>
    </div>
  );
}

// =============================================================
// Track with color bands + DRAGGABLE indicator (amber | sky | rose)
// =============================================================
function Track({
  min,
  max,
  rec,
  value,
  onChange,
  step = 0.01,
  ariaLabel = "Seletor de dose"
}: {
  min: number;
  max: number;
  rec: { min: number; max: number };
  value: number;
  onChange: (v: number) => void;
  step?: number;
  ariaLabel?: string;
}) {
  const { 
    lowLeft, lowRight, 
    recLeft, recRight, 
    highLeft, highRight,
    adjustedMin, adjustedMax 
  } = computeTrackPercents(min, max, rec);
  
  // Clampeamento de percentuais para evitar deslocamentos
  const clampedLowLeft = clamp(lowLeft, 0, 100);
  const clampedLowRight = clamp(lowRight, 0, 100);
  const clampedRecLeft = clamp(recLeft, 0, 100);
  const clampedRecRight = clamp(recRight, 0, 100);
  const clampedHighLeft = clamp(highLeft, 0, 100);
  const clampedHighRight = clamp(highRight, 0, 100);
  
  const pos = valueToPercent(adjustedMin, adjustedMax, value);
  const clampedPos = clamp(pos, 0, 100);
  const posLeft = `${clampedPos}%`;

  const trackRef = useRef<HTMLDivElement | null>(null);

  const setFromClientX = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    const raw = percentToValue(adjustedMin, adjustedMax, pct);
    // Quantize to nearest step
    const snapped = Math.round(raw / step) * step;
    onChange(clamp(Number(snapped.toFixed(4)), adjustedMin, adjustedMax));
  };

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (e.buttons !== 1) return; // only while dragging
    setFromClientX(e.clientX);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "ArrowLeft") {
      onChange(clamp(value - step, adjustedMin, adjustedMax));
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      onChange(clamp(value + step, adjustedMin, adjustedMax));
      e.preventDefault();
    } else if (e.key === "Home") {
      onChange(adjustedMin);
      e.preventDefault();
    } else if (e.key === "End") {
      onChange(adjustedMax);
      e.preventDefault();
    }
  };

  return (
    <div className="relative w-full py-3 select-none">
      {/* Visual bar - sem overflow-hidden para evitar corte nas bordas */}
      <div
        ref={trackRef}
        className="relative h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        role="slider"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-valuemin={adjustedMin}
        aria-valuemax={adjustedMax}
        aria-valuenow={Number(value.toFixed(2))}
        onKeyDown={onKeyDown}
      >
        {/* zones - amarelo (50% abaixo), verde (recomendado), vermelho (50% acima) */}
        <div className="absolute top-1/2 -translate-y-1/2 h-2 bg-amber-400/80 rounded-full" style={{ left: `${clampedLowLeft}%`, width: `${clampedLowRight - clampedLowLeft}%` }} />
        <div className="absolute top-1/2 -translate-y-1/2 h-2 bg-green-500/90 border-2 border-green-600 shadow-sm rounded-full" style={{ left: `${clampedRecLeft}%`, width: `${clampedRecRight - clampedRecLeft}%` }} />
        <div className="absolute top-1/2 -translate-y-1/2 h-2 bg-rose-500/80 rounded-full" style={{ left: `${clampedHighLeft}%`, width: `${clampedHighRight - clampedHighLeft}%` }} />

        {/* indicator (draggable visual) - centralizado perfeitamente */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-white border-3 border-sky-600 shadow-lg ring-2 ring-sky-200 dark:ring-sky-800 cursor-pointer"
          style={{ left: posLeft }}
        />
      </div>
    </div>
  );
}

// =============================================================
// Advisory panels for under/over dose
// =============================================================
function Advice({ value, rec }: { value: number; rec: { min: number; max: number } }) {
  if (value < rec.min) {
    return (
      <div className="mt-2 rounded-md border border-amber-300/70 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 px-3 py-2 text-sm">
        <b>SUBdose</b> — dose abaixo da faixa recomendada pode resultar em <b>efeito terapêutico insuficiente</b>, atraso na resposta clínica e <b>falha terapêutica</b>. Ajuste dentro da faixa azul sempre que possível.
      </div>
    );
  }
  if (value > rec.max) {
    return (
      <div className="mt-2 rounded-md border border-rose-400/70 bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-200 px-3 py-2 text-sm">
        <b>Sobredose</b> — dose acima da faixa recomendada aumenta o risco de <b>eventos adversos</b> e <b>toxicidade</b>. Reduza para a faixa azul, a menos que haja justificativa clínica formal.
      </div>
    );
  }
  return null;
}

// =============================================================
// Chips + Stepper (recebe presets do app) — BLUE palette
// =============================================================
function ChipsStepper({
  min,
  max,
  rec,
  unit,
  presets,
  value,
  onChange
}: {
  min: number;
  max: number;
  rec: { min: number; max: number };
  unit: string;
  /** Optional: presets vindos do app/backend (doses mais usadas) */
  presets?: number[];
  value: number;
  onChange: (value: number) => void;
}) {
  const fallback = useMemo(() => {
    const a = rec.min;
    const b = (rec.min + rec.max) / 2;
    const c = rec.max;
    return [a, b, c].map((x) => Math.round(x * 100) / 100);
  }, [min, max, rec]);

  const presetValues = useMemo(() => sanitizePresets(presets, min, max, fallback), [presets, min, max, fallback]);

  const { stepFine, stepCoarse } = computeSteps(min, max);
  const { adjustedMin, adjustedMax } = computeTrackPercents(min, max, rec);
  const nudge = (delta: number) => onChange(clamp(Number((value + delta).toFixed(4)), adjustedMin, adjustedMax));

  return (
    <div className={twCard}>
      <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 text-center">Seletor de Dose</div>

      <ValueBadge value={value} unit={unit} rec={rec} />

      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center">Presets rápidos</div>
      <div className="flex flex-wrap gap-2 justify-center">
        {presetValues.map((p) => {
          const selected = Math.abs(p - value) < stepFine;
          const selectedCls = selected
            ? "bg-sky-600 text-white border-sky-600"
            : "border-slate-300 dark:border-slate-600 hover:bg-sky-50 dark:hover:bg-sky-900/20 text-slate-900 dark:text-slate-100";
          return (
            <button
              key={p}
              className={`px-3 py-2 rounded-md border text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800 ${selectedCls}`}
              aria-pressed={selected}
              onClick={() => onChange(p)}
              aria-label={`Definir dose para ${fmt(p)} ${unit}`}
            >
              {fmt(p)} {unit}
            </button>
          );
        })}
      </div>

      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center mt-2">Ajuste fino</div>
      <div className="flex items-center gap-2 justify-center">
        <button
          className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 hover:bg-sky-50 dark:hover:bg-sky-900/20 text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800"
          onClick={() => nudge(-stepCoarse)}
        >
          −{fmt(stepCoarse)}
        </button>
        <button
          className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 hover:bg-sky-50 dark:hover:bg-sky-900/20 text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800"
          onClick={() => nudge(-stepFine)}
        >
          −{fmt(stepFine)}
        </button>
        <div className="relative">
          <input
            type="number"
            step={stepFine}
            className="w-36 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 pr-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800"
            value={value}
            onChange={(e) => onChange(clamp(Number(e.target.value), adjustedMin, adjustedMax))}
            aria-label="Campo numérico da dose"
          />
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-500 dark:text-slate-400">{unit}</span>
        </div>
        <button
          className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 hover:bg-sky-50 dark:hover:bg-sky-900/20 text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800"
          onClick={() => nudge(+stepFine)}
        >
          +{fmt(stepFine)}
        </button>
        <button
          className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 hover:bg-sky-50 dark:hover:bg-sky-900/20 text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800"
          onClick={() => nudge(+stepCoarse)}
        >
          +{fmt(stepCoarse)}
        </button>
      </div>

      {/* draggable track/indicator */}
      <Track min={min} max={max} rec={rec} value={value} onChange={onChange} step={stepFine} />
      <div className="text-[11px] text-slate-500 dark:text-slate-400 text-center">Amarelo = 50% abaixo, Verde = recomendado, Vermelho = 50% acima.</div>

      {/* advisory */}
      <Advice value={value} rec={rec} />
    </div>
  );
}

// =============================================================
// Self-tests (logic only) — do not change unless wrong
// =============================================================
function SelfTest() {
  type T = { name: string; pass: boolean };
  const tests: T[] = [];

  // clamp
  tests.push({ name: "clamp middle", pass: clamp(5, 0, 10) === 5 });
  tests.push({ name: "clamp low", pass: clamp(-1, 0, 10) === 0 });
  tests.push({ name: "clamp high", pass: clamp(15, 0, 10) === 10 });

  // fmt
  tests.push({ name: "fmt int", pass: fmt(1) === "1" });
  tests.push({ name: "fmt decimals", pass: fmt(1.234) === "1.23" });

  // steps
  const { stepFine, stepCoarse } = computeSteps(0, 5);
  tests.push({ name: "step fine (0..5) = 0.05", pass: Math.abs(stepFine - 0.05) < 1e-9 });
  tests.push({ name: "step coarse (0..5) = 0.5", pass: Math.abs(stepCoarse - 0.5) < 1e-9 });

  // track percents - agora com faixas baseadas na dose recomendada
  const { recLeft, recRight } = computeTrackPercents(0, 5, { min: 1.5, max: 3.0 });
  tests.push({ name: "track recLeft% = 25", pass: Math.round(recLeft) === 25 });
  tests.push({ name: "track recRight% = 75", pass: Math.round(recRight) === 75 });

  // value ↔ percent
  const pMid = valueToPercent(0, 5, 2.5);
  const vMid = percentToValue(0, 5, pMid);
  tests.push({ name: "valueToPercent mid = 50%", pass: Math.round(pMid) === 50 });
  tests.push({ name: "percentToValue 50% = mid", pass: Math.abs(vMid - 2.5) < 1e-9 });

  // sanitizePresets - agora limitado a 5
  const san = sanitizePresets([10, -2, 2.5, 2.5, 1.5, 3.5, 4.5], 0, 5, [1, 2]);
  const sanStr = san.join(",");
  tests.push({ name: "sanitizePresets clamp/sort/unique/limit5", pass: sanStr === "0,1.5,2.5,3.5,4.5" });
  const sanFallback = sanitizePresets([], 0, 5, [0.5, 1, 1.5]);
  tests.push({ name: "sanitizePresets fallback", pass: sanFallback.join(",") === "0.5,1,1.5" });

  return (
    <div className="mt-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/50 p-4">
      <div className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-200">Self-tests</div>
      <ul className="space-y-1 text-sm">
        {tests.map((t, i) => (
          <li key={i} className="flex items-center justify-between">
            <span className="truncate">{t.name}</span>
            <span className={t.pass ? "text-sky-600" : "text-rose-600"}>{t.pass ? "✔" : "✖"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// =============================================================
// Exports for integration with the app
// =============================================================

// Tipos para compatibilidade
export interface RecRange {
  min: number;
  max: number;
}

export interface DoseStatus {
  status: "low" | "in" | "high";
  message: string;
}

// Wrapper para integração com o app
export interface DoseCRICardProps {
  title?: string;
  unit: string;
  dose: number;
  onDoseChange: (dose: number) => void;
  rec: RecRange;
  abs: { min: number; max: number };
  presets?: number[];
  onStatusChange?: (s: "low" | "in" | "high") => void;
}

export function DoseCRICard({
  title = "Seletor de Dose",
  unit,
  dose,
  onDoseChange,
  rec,
  abs,
  presets,
  onStatusChange
}: DoseCRICardProps) {
  // Notifica mudança de status
  React.useEffect(() => {
    const status = dose < rec.min ? "low" : dose > rec.max ? "high" : "in";
    onStatusChange?.(status);
  }, [dose, rec.min, rec.max, onStatusChange]);

  return (
    <ChipsStepper
      min={abs.min}
      max={abs.max}
      rec={rec}
      unit={unit}
      presets={presets}
      value={dose}
      onChange={onDoseChange}
    />
  );
}

// Utilitários para compatibilidade
export { clamp, fmt as formatDoseLocale };

export function parseDoseLocale(str: string): number {
  if (!str || str.trim() === "") return 0;
  // Remove espaços e substitui vírgula por ponto
  const cleaned = str.replace(/\s/g, "").replace(",", ".");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

// Componente principal para uso direto
export function DoseSelector({
  min,
  max,
  unit,
  rec,
  value,
  onChange,
  presets = [],
  onStatusChange
}: {
  min: number;
  max: number;
  unit: string;
  rec: RecRange;
  value: number;
  onChange: (v: number) => void;
  presets?: number[];
  onStatusChange?: (s: "low" | "in" | "high") => void;
}) {
  return (
    <ChipsStepper
      min={min}
      max={max}
      rec={rec}
      unit={unit}
      presets={presets}
      value={value}
      onChange={onChange}
    />
  );
}

// Demo page (opcional)
export default function DoseSelectorsDemo() {
  const unit = "mcg/kg/min";
  const min = 0;
  const max = 10000;
  const rec = { min: 2, max: 10 }; // Doses mais realistas para cetamina

  // Simula presets vindos do app/backend (doses mais usadas) - máximo 5
  const commonPresetsFromServer = [2, 4, 6, 8, 10];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-50 to-sky-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">CRIVET · Seletor Dinâmico de Dose (Blue)</h1>
          <div className="text-sm opacity-70">
            Faixa recomendada: {rec.min}–{rec.max} {unit}
          </div>
        </header>

        <div className="max-w-xl mx-auto">
          <ChipsStepper min={min} max={max} rec={rec} unit={unit} presets={commonPresetsFromServer} value={6} onChange={() => {}} />
          <SelfTest />
        </div>

        <footer className="mt-8 text-xs text-slate-500">
          * Acessível via teclado e compatível com modo claro/escuro.
        </footer>
      </div>
    </div>
  );
}