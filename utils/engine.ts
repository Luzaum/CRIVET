export type Step = { label: string; formula: string; result: string };

export type Fluid = 'rl' | 'sf' | 'd25' | 'd5';

export type CriUnit = 'mcg/kg/min' | 'mcg/kg/h' | 'mg/kg/h';

export function convertCriToMcgKgH(value: number, unit: CriUnit) {
  switch (unit) {
    case 'mcg/kg/min': return value * 60;
    case 'mcg/kg/h':   return value;
    case 'mg/kg/h':    return value * 1000;
  }
}

export function calculateCRI(
  params: {
    doseValue: number;
    doseUnit: CriUnit;
    weightKg: number;
    rateMlH: number;
    vialConcMgMl: number;
    vehicleVolumeMl: number;
    durationH: number;
  }
) {
  const steps: Step[] = [];

  const doseMcgKgH = convertCriToMcgKgH(params.doseValue, params.doseUnit);
  steps.push({
    label: 'Dose (mcg/kg/h)',
    formula: `${params.doseValue} ${params.doseUnit} → ${doseMcgKgH.toFixed(2)} mcg/kg/h`,
    result: `${doseMcgKgH.toFixed(2)} mcg/kg/h`,
  });

  const totalMcgH = doseMcgKgH * params.weightKg;
  steps.push({
    label: 'Total (mcg/h)',
    formula: `${doseMcgKgH.toFixed(2)} × ${params.weightKg.toFixed(2)} kg`,
    result: `${totalMcgH.toFixed(2)} mcg/h`,
  });

  const neededMgMl = (totalMcgH / params.rateMlH) / 1000; // mg/mL
  steps.push({
    label: 'Concentração necessária (mg/mL)',
    formula: `${totalMcgH.toFixed(2)} ÷ ${params.rateMlH.toFixed(2)} ÷ 1000`,
    result: `${neededMgMl.toFixed(3)} mg/mL`,
  });

  const vialConc = params.vialConcMgMl; // mg/mL
  const drugVolumeMl = (neededMgMl * params.vehicleVolumeMl) / vialConc;
  steps.push({
    label: 'Volume do fármaco (mL)',
    formula: `(${neededMgMl.toFixed(3)} × ${params.vehicleVolumeMl}) ÷ ${vialConc}`,
    result: `${drugVolumeMl.toFixed(3)} mL`,
  });

  const diluentVolumeMl = params.vehicleVolumeMl - drugVolumeMl;

  return {
    results: {
      drugVolumeMl,
      diluentVolumeMl,
      finalConcMgMl: neededMgMl,
      rateMlH: params.rateMlH,
    },
    steps,
  };
}

export type BolusUnit = 'mg/kg' | 'mcg/kg';

export function normalizeConcToDoseUnit(vial: { value: number; unit: 'mg/mL' | 'μg/mL' }, targetUnit: BolusUnit) {
  if (vial.unit === 'mg/mL' && targetUnit === 'mcg/kg') return vial.value * 1000;
  if (vial.unit === 'μg/mL' && targetUnit === 'mg/kg') return vial.value / 1000;
  return vial.value;
}

export function calculateBolus(params: {
  doseValue: number;
  doseUnit: BolusUnit;
  weightKg: number;
  vialConc: { value: number; unit: 'mg/mL' | 'μg/mL' };
}) {
  const steps: Step[] = [];

  const concInDoseUnit = normalizeConcToDoseUnit(params.vialConc, params.doseUnit);
  steps.push({
    label: 'Concentração normalizada',
    formula: `${params.vialConc.value} ${params.vialConc.unit} → ${concInDoseUnit} ${params.doseUnit.replace('/kg','')}/mL`,
    result: `${concInDoseUnit} ${params.doseUnit.replace('/kg','')}/mL`,
  });

  const totalDose = params.doseValue * params.weightKg; // same unit as doseUnit
  steps.push({
    label: 'Dose total',
    formula: `${params.doseValue} × ${params.weightKg} kg`,
    result: `${totalDose.toFixed(3)} ${params.doseUnit.replace('/kg','')}`,
  });

  const totalVolume = totalDose / concInDoseUnit;
  steps.push({
    label: 'Volume do fármaco',
    formula: `${totalDose.toFixed(3)} ÷ ${concInDoseUnit}`,
    result: `${totalVolume.toFixed(3)} mL`,
  });

  return { results: { totalDose, totalVolume }, steps };
}

/* Compatibilidade simples baseada no cadastro do fármaco */
export function checkCompatibility(fluid: Fluid, drugCompat: {
  preferred: Fluid;
  compatible?: Fluid[];
  avoid?: Fluid[];
  notes?: string;
}) {
  if (drugCompat.avoid?.includes(fluid)) {
    return { level: 'danger' as const, label: '🚨 Incompatível', reason: drugCompat.notes || 'Estabilidade/pH não recomendados.' };
  }
  if (fluid === drugCompat.preferred) {
    return { level: 'success' as const, label: 'Compatível', reason: 'Fluido de eleição para estabilidade/pH.' };
  }
  if (drugCompat.compatible?.includes(fluid)) {
    return { level: 'warning' as const, label: 'Parcialmente compatível', reason: drugCompat.notes || 'Uso possível com cautela.' };
  }
  return { level: 'warning' as const, label: 'Sem dados robustos', reason: 'Preferir fluido recomendado.' };
}
