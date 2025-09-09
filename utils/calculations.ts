/* src/utils/calculations.ts
 * Motor de cálculo puro para CRI e Bólus (sem dependências de UI ou React).
 * Mantém dados em mcg/mL internamente e expõe resultados em unidades amigáveis.
 */

import { CalcResult, CalcStep } from './calculations/types';

export type CriDoseUnitKey =
  | 'mcg_kg_min'
  | 'mcg_kg_h'
  | 'mg_kg_min'
  | 'mg_kg_h'
  | 'mg_kg_day';

export type BolusDoseUnitKey = 'mg_kg' | 'mcg_kg';

export type ConcentrationUnit = 'mg/mL' | 'mcg/mL' | 'μg/mL';

export type VehicleType = 'syringe' | 'bag';

export interface Vehicle {
  type: VehicleType;
  volume: number; // mL
}

export interface StockConcentration {
  value: number;
  unit: ConcentrationUnit; // mg/mL ou (mcg|μg)/mL
}

export interface CriInput {
  dose: { value: number; unit: CriDoseUnitKey };
  weightKg: number;
  stock: StockConcentration;
  vehicle: Vehicle;           // volume final (mL)
  durationHours: number;      // horas
  infusionRateMlPerHour?: number; // opcional: se fornecido, ignora rate = volume/duração
}

export interface CriResult {
  // Magnitudes principais
  massMgPerHour: number;           // mg/h (entregue)
  neededConcMgPerMl: number;       // mg/mL (requerida para a taxa escolhida)
  finalConcMgPerMl: number;        // mg/mL (resultante no recipiente)
  pumpRateMlPerHour: number;       // mL/h (taxa da bomba)
  volumeDrugMl: number;            // mL do fármaco a adicionar
  volumeDiluentMl: number;         // mL do diluente (vehicle.volume - volumeDrugMl)

  // Auxiliares em mcg
  massMcgPerHour: number;          // mcg/h
  stockMcgPerMl: number;           // mcg/mL (padrão interno)

  // Passos para UI
  steps: CalcStep[];
  warnings: string[];              // ex.: volumeDroga > volumeRecipiente, etc.
}

export interface BolusInput {
  dose: { value: number; unit: BolusDoseUnitKey };
  weightKg: number;
  stock: StockConcentration;
  // Diluição opcional para administração lenta:
  // se finalVolumeMl for informado, retorna também volume de diluente sugerido.
  finalVolumeMl?: number;
}

export interface BolusResult {
  totalDoseMg: number;           // mg
  volumeDrugMl: number;          // mL a retirar do frasco
  finalVolumeMl?: number;        // mL final após diluição
  diluentVolumeMl?: number;      // mL de diluente (= finalVolume - volumeDrugMl)
  stockMcgPerMl: number;
  steps: CalcStep[];
  warnings: string[];
}

// CalcStep já está definido em types.ts

/* ========= Helpers ========= */

const round = (n: number, d = 3) => {
  const p = Math.pow(10, d);
  return Math.round((n + Number.EPSILON) * p) / p;
};

const isFiniteNumber = (n: unknown): n is number =>
  typeof n === 'number' && Number.isFinite(n) && !Number.isNaN(n);

const toMcgPerMl = (stock: StockConcentration): number => {
  const u = stock.unit.replace('μ', 'mc'); // normaliza μg -> mcg
  if (u === 'mg/mL') return stock.value * 1000;
  if (u === 'mcg/mL' || u === 'ug/mL') return stock.value;
  // fallback para "μg/mL"
  if (stock.unit === 'μg/mL') return stock.value;
  throw new Error(`Unidade de concentração não suportada: ${stock.unit}`);
};

const toMcgPerKgPerHour = (value: number, unit: CriDoseUnitKey): number => {
  switch (unit) {
    case 'mcg_kg_min': return value * 60;
    case 'mcg_kg_h':   return value;
    case 'mg_kg_min':  return value * 1000 * 60;
    case 'mg_kg_h':    return value * 1000;
    case 'mg_kg_day':  return (value * 1000) / 24;
    default:
      throw new Error(`Unidade CRI não suportada: ${unit}`);
  }
};

const toMgFromBolus = (value: number, unit: BolusDoseUnitKey): number => {
  // converte dose (X por kg) para mg por kg
  switch (unit) {
    case 'mg_kg':  return value;          // já em mg/kg
    case 'mcg_kg': return value / 1000;   // mcg/kg -> mg/kg
    default:
      throw new Error(`Unidade de bólus não suportada: ${unit}`);
  }
};

/* ========= CRI ========= */

export function calculateCRI(input: CriInput): CriResult {
  const warnings: string[] = [];

  const {
    dose, weightKg, stock, vehicle, durationHours, infusionRateMlPerHour,
  } = input;

  if (!isFiniteNumber(dose.value) || dose.value <= 0) {
    throw new Error('Dose inválida (CRI).');
  }
  if (!isFiniteNumber(weightKg) || weightKg <= 0) {
    throw new Error('Peso inválido.');
  }
  if (!isFiniteNumber(stock.value) || stock.value <= 0) {
    throw new Error('Concentração do frasco inválida.');
  }
  if (!isFiniteNumber(vehicle.volume) || vehicle.volume <= 0) {
    throw new Error('Volume do recipiente inválido.');
  }
  if (!isFiniteNumber(durationHours) || durationHours <= 0) {
    throw new Error('Duração de infusão inválida.');
  }

  // 1) Dose em mcg/kg/h
  const doseMcgKgH = toMcgPerKgPerHour(dose.value, dose.unit);

  // 2) Total por hora (mcg/h) e mg/h
  const massMcgPerHour = doseMcgKgH * weightKg;
  const massMgPerHour  = massMcgPerHour / 1000;

  // 3) Taxa da bomba (mL/h)
  const pumpRateMlPerHour = isFiniteNumber(infusionRateMlPerHour)
    ? infusionRateMlPerHour!
    : vehicle.volume / durationHours;

  if (!isFiniteNumber(pumpRateMlPerHour) || pumpRateMlPerHour <= 0) {
    throw new Error('Taxa de infusão inválida (mL/h).');
  }

  // 4) Concentração necessária (mg/mL) = mg/h ÷ mL/h
  const neededConcMgPerMl = massMgPerHour / pumpRateMlPerHour;
  const neededConcMcgPerMl = neededConcMgPerMl * 1000;

  // 5) Converter frasco para mcg/mL
  const stockMcgPerMl = toMcgPerMl(stock);

  // 6) Volume de fármaco a adicionar (mL)
  const volumeDrugMl = (neededConcMcgPerMl * vehicle.volume) / stockMcgPerMl;
  const volumeDiluentMl = vehicle.volume - volumeDrugMl;

  if (volumeDrugMl < 0) warnings.push('Volume de fármaco calculado negativo (verifique parâmetros).');
  if (volumeDrugMl > vehicle.volume) warnings.push('Volume de fármaco excede volume do recipiente.');
  if (volumeDiluentMl < 0) warnings.push('Volume de diluente negativo.');

  // 7) Concentração final atingida (mg/mL)
  const finalConcMgPerMl = ((volumeDrugMl * stockMcgPerMl) / vehicle.volume) / 1000;

  // Passos para UI
  const steps: CalcStep[] = [
    {
      label: 'Passo 1: Dose em mg/kg/h',
      formula: 'Converte a unidade selecionada para mg/kg/h',
      example: (() => {
        const doseMgKgH =
          dose.unit === 'mcg_kg_min' ? round((dose.value * 60) / 1000, 3) :
          dose.unit === 'mcg_kg_h'   ? round(dose.value / 1000, 3) :
          dose.unit === 'mg_kg_min'  ? round(dose.value * 60, 3) :
          dose.unit === 'mg_kg_h'    ? round(dose.value, 3) :
          dose.unit === 'mg_kg_day'  ? round(dose.value / 24, 3) :
          round(massMgPerHour / weightKg, 3);
        return `${dose.value} ${dose.unit} = ${doseMgKgH} mg/kg/h`;
      })(),
    },
    {
      label: 'Passo 2: Dose por hora',
      formula: 'Dose (mg/kg/h) × Peso (kg) = mg/h',
      example: `${round(massMgPerHour / weightKg, 3)} × ${weightKg} = ${round(massMgPerHour, 3)} mg/h`,
    },
    {
      label: 'Passo 3: Concentração necessária',
      formula: 'mg/h ÷ mL/h = mg/mL',
      example: `${round(massMgPerHour, 3)} ÷ ${round(pumpRateMlPerHour, 3)} = ${round(neededConcMgPerMl, 3)} mg/mL`,
    },
    {
      label: 'Passo 4: Volume do fármaco',
      formula: '(mg/mL × Volume total) ÷ Concentração do frasco = mL de fármaco',
      example: `(${round(neededConcMgPerMl, 3)} × ${vehicle.volume}) ÷ ${round(stockMcgPerMl/1000, 3)} = ${round(volumeDrugMl, 3)} mL`,
    },
  ];
  
  return {
    massMcgPerHour: round(massMcgPerHour, 3),
    massMgPerHour : round(massMgPerHour , 3),
    neededConcMgPerMl: round(neededConcMgPerMl, 3),
    finalConcMgPerMl : round(finalConcMgPerMl , 3),
    pumpRateMlPerHour: round(pumpRateMlPerHour, 3),
    volumeDrugMl     : round(volumeDrugMl, 3),
    volumeDiluentMl  : round(volumeDiluentMl, 3),
    stockMcgPerMl    : round(stockMcgPerMl, 3),
    steps,
    warnings,
  };
}

/* ========= BÓLUS ========= */

export function calculateBolus(input: BolusInput): BolusResult {
  const warnings: string[] = [];

  const { dose, weightKg, stock, finalVolumeMl } = input;

  if (!isFiniteNumber(dose.value) || dose.value <= 0) {
    throw new Error('Dose inválida (Bólus).');
  }
  if (!isFiniteNumber(weightKg) || weightKg <= 0) {
    throw new Error('Peso inválido.');
  }
  if (!isFiniteNumber(stock.value) || stock.value <= 0) {
    throw new Error('Concentração do frasco inválida.');
  }
  if (isFiniteNumber(finalVolumeMl) && finalVolumeMl! <= 0) {
    warnings.push('Volume final de diluição inválido; ignorando diluição.');
  }

  const stockMcgPerMl = toMcgPerMl(stock);

  // Total mg a administrar:
  //  (dose mg/kg) = toMgFromBolus(dose.value, unit)
  const doseMgPerKg = toMgFromBolus(dose.value, dose.unit);
  const totalDoseMg = doseMgPerKg * weightKg;

  // Volume do fármaco (mL) = (mg × 1000) / (mcg/mL)
  const volumeDrugMl = (totalDoseMg * 1000) / stockMcgPerMl;

  const steps: CalcStep[] = [
    {
      label: 'Passo 1: Dose total',
      formula: 'mg/kg × kg = mg (ou mcg/kg × kg = mcg)',
      example: `${round(doseMgPerKg, 3)} × ${weightKg} = ${round(totalDoseMg, 3)} mg`,
    },
    {
      label: 'Passo 2: Volume',
      formula: 'Dose total ÷ Concentração = mL',
      example: `${round(totalDoseMg, 3)} ÷ ${round(stockMcgPerMl/1000, 3)} = ${round(volumeDrugMl, 3)} mL`,
    },
  ];

  const result: BolusResult = {
    totalDoseMg: round(totalDoseMg, 3),
    volumeDrugMl: round(volumeDrugMl, 3),
    stockMcgPerMl: round(stockMcgPerMl, 3),
    steps,
    warnings,
  };

  if (isFiniteNumber(finalVolumeMl) && finalVolumeMl! > 0) {
    const diluent = finalVolumeMl! - volumeDrugMl;
    if (diluent < 0) {
      warnings.push('Volume final menor que o volume de fármaco; ajuste a diluição.');
    }
    result.finalVolumeMl = round(finalVolumeMl!, 3);
    result.diluentVolumeMl = round(diluent, 3);
  }

  return result;
}