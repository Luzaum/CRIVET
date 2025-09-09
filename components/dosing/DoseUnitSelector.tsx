import React from "react";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import type { Drug } from "../../types/drugs";
import type { DrugUnit } from "../../context/DrugContext";

const UNITS: DrugUnit[] = ["mcg/kg/min", "mcg/kg/h", "mg/kg/h"];

export function getRangeForUnit(drug: Drug | null, unit: DrugUnit) {
  // Primeiro tenta a estrutura antiga (cri.ranges)
  const r = drug?.cri?.ranges?.find((x) => x.unit === unit);
  if (r) return { min: r.min, max: r.max };
  
  // Depois tenta a nova estrutura (criDoses)
  const criDose = drug?.criDoses?.find((d) => d.cri.unit === unit);
  if (criDose) return { min: criDose.cri.min, max: criDose.cri.max };
  
  return { min: 0, max: 0 };
}

export function DoseUnitSelector({
  drug,
  unit,
  onChange,
}: {
  drug: Drug | null;
  unit: DrugUnit;
  onChange: (u: DrugUnit) => void;
}) {
  const preferred = (drug?.cri?.preferredUnit ?? "mcg/kg/min") as DrugUnit;
  return (
    <div className="flex justify-center gap-1 items-center w-full">
      {UNITS.map((u) => (
        <button
          key={u}
          type="button"
          onClick={() => onChange(u)}
          className={cn(
            "flex-1 px-2 py-1.5 rounded-md border text-sm transition text-center",
            unit === u
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-secondary hover:bg-accent border-border"
          )}
        >
          <div className="flex flex-col items-center gap-1">
            <span>{u}</span>
            {u === preferred && (
              <Badge variant="secondary" className="text-[9px] px-1 py-0">
                unidade recomendada
              </Badge>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
