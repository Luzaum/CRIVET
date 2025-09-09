import type { Drug, Fluid } from "../types/drugs";

export type CompatLevel = "success" | "warning" | "danger";
export function checkCompatibility(drug: Drug | null, fluid: Fluid | null) {
  if (!drug || !fluid) return { level: "warning" as CompatLevel, reason: "Selecione um fluido." };
  const c = drug.cri?.compatibility;
  if (!c) return { level: "warning" as CompatLevel, reason: "Dados de compatibilidade não informados." };
  if (c.avoid?.includes(fluid)) {
    return {
      level: "danger" as CompatLevel,
      reason:
        c.notes ||
        "Incompatível: risco de precipitação/pH/osmolaridade ou interação ativa. Troque o diluente."
    };
  }
  if (c.preferred === fluid) {
    return { level: "success" as CompatLevel, reason: "100% compatível. Fluido preferido para estabilidade." };
  }
  if (c.compatible?.includes(fluid)) {
    return {
      level: "warning" as CompatLevel,
      reason: "Parcialmente compatível: estabilidade depende de concentração/tempo/luz. Verifique rótulo."
    };
  }
  return {
    level: "warning" as CompatLevel,
    reason: "Compatibilidade não especificada; use com cautela."
  };
}