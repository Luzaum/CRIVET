// utils/doseUnits.ts
export type DoseUnit = "mcg/kg/min" | "mcg/kg/h" | "mg/kg/h";

export interface RecRange { min: number; max: number }

const TO_BASE: Record<DoseUnit,(v:number)=>number> = {
  // BASE = mg/kg/h
  "mg/kg/h":   (v) => v,
  "mcg/kg/h":  (v) => v / 1000,
  "mcg/kg/min":(v) => (v * 60) / 1000, // µg/min → mg/h
};

const FROM_BASE: Record<DoseUnit,(v:number)=>number> = {
  "mg/kg/h":   (v) => v,
  "mcg/kg/h":  (v) => v * 1000,
  "mcg/kg/min":(v) => (v * 1000) / 60,
};

export function convertDose(value: number, from: DoseUnit, to: DoseUnit) {
  if (!Number.isFinite(value)) return 0;
  const base = TO_BASE[from](value);
  return FROM_BASE[to](base);
}

export function convertRange(range: RecRange, from: DoseUnit, to: DoseUnit): RecRange {
  return {
    min: convertDose(range.min, from, to),
    max: convertDose(range.max, from, to),
  };
}

// Função para construir range absoluto coerente
export function buildAbs(rec: RecRange): {min: number; max: number} {
  if (rec.min === 0 && rec.max === 0) return { min: 0, max: 10 }; // fallback seguro p/ UI
  const max = Math.max(rec.max * 2, rec.max + (rec.max - rec.min)); // 2x o topo ou margem acima
  return { min: 0, max: Math.ceil(max * 10) / 10 }; // arredonda "bonito"
}
