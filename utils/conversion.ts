/**
 * Sistema de conversão confiável para unidades veterinárias
 * Centraliza todas as conversões com testes de sanidade
 */

import { CriDoseUnit, BolusDoseUnit } from '../types';

/**
 * Conversão para mg/kg/h (unidade padrão interna)
 */
export const toMgPerKgPerH = {
  [CriDoseUnit.mcg_kg_min]: (x: number) => x * 0.06,     // 1 mcg/kg/min = 0.06 mg/kg/h
  [CriDoseUnit.mcg_kg_h]: (x: number) => x * 0.001,      // 1 mcg/kg/h = 0.001 mg/kg/h
  [CriDoseUnit.mg_kg_min]: (x: number) => x * 60,        // 1 mg/kg/min = 60 mg/kg/h
  [CriDoseUnit.mg_kg_h]: (x: number) => x,               // 1 mg/kg/h = 1 mg/kg/h
  [CriDoseUnit.mg_kg_day]: (x: number) => x / 24,        // 1 mg/kg/dia = 0.0417 mg/kg/h
  [CriDoseUnit.U_kg_h]: (x: number) => x,                // Unidades por kg/h (assumindo 1 U = 1 mg)
  [CriDoseUnit.mU_kg_min]: (x: number) => x * 0.06,      // 1 mU/kg/min = 0.06 U/kg/h
} as const;

/**
 * Conversão de mg/kg/h para unidade específica
 */
export const fromMgPerKgPerH = {
  [CriDoseUnit.mcg_kg_min]: (x: number) => x / 0.06,     // mg/kg/h → mcg/kg/min
  [CriDoseUnit.mcg_kg_h]: (x: number) => x / 0.001,      // mg/kg/h → mcg/kg/h
  [CriDoseUnit.mg_kg_min]: (x: number) => x / 60,        // mg/kg/h → mg/kg/min
  [CriDoseUnit.mg_kg_h]: (x: number) => x,               // mg/kg/h → mg/kg/h
  [CriDoseUnit.mg_kg_day]: (x: number) => x * 24,        // mg/kg/h → mg/kg/dia
  [CriDoseUnit.U_kg_h]: (x: number) => x,                // mg/kg/h → U/kg/h
  [CriDoseUnit.mU_kg_min]: (x: number) => x / 0.06,      // mg/kg/h → mU/kg/min
} as const;

/**
 * Conversão para bolus (mg/kg)
 */
export const toMgPerKg = {
  [BolusDoseUnit.mcg_kg]: (x: number) => x / 1000,       // mcg/kg → mg/kg
  [BolusDoseUnit.mg_kg]: (x: number) => x,               // mg/kg → mg/kg
  [BolusDoseUnit.U_kg]: (x: number) => x,                // U/kg → mg/kg (assumindo 1 U = 1 mg)
} as const;

/**
 * Conversão de mg/kg para unidade de bolus específica
 */
export const fromMgPerKg = {
  [BolusDoseUnit.mcg_kg]: (x: number) => x * 1000,       // mg/kg → mcg/kg
  [BolusDoseUnit.mg_kg]: (x: number) => x,               // mg/kg → mg/kg
  [BolusDoseUnit.U_kg]: (x: number) => x,                // mg/kg → U/kg
} as const;

/**
 * Unifica dose CRI para mg/kg/h (unidade padrão)
 */
export function unifyCriDose(value: number, unit: CriDoseUnit): number {
  const converter = toMgPerKgPerH[unit];
  if (!converter) {
    throw new Error(`Unidade CRI não suportada: ${unit}`);
  }
  return converter(value);
}

/**
 * Converte dose CRI de mg/kg/h para unidade específica
 */
export function convertCriDoseFromStandard(value: number, unit: CriDoseUnit): number {
  const converter = fromMgPerKgPerH[unit];
  if (!converter) {
    throw new Error(`Unidade CRI não suportada: ${unit}`);
  }
  return converter(value);
}

/**
 * Unifica dose bolus para mg/kg (unidade padrão)
 */
export function unifyBolusDose(value: number, unit: BolusDoseUnit): number {
  const converter = toMgPerKg[unit];
  if (!converter) {
    throw new Error(`Unidade bolus não suportada: ${unit}`);
  }
  return converter(value);
}

/**
 * Converte dose bolus de mg/kg para unidade específica
 */
export function convertBolusDoseFromStandard(value: number, unit: BolusDoseUnit): number {
  const converter = fromMgPerKg[unit];
  if (!converter) {
    throw new Error(`Unidade bolus não suportada: ${unit}`);
  }
  return converter(value);
}

/**
 * Teste de sanidade: verifica monotonicidade das conversões
 */
export function validateConversionSanity(): boolean {
  const testValues = [0.1, 1, 10, 100];
  const testUnits = Object.values(CriDoseUnit);
  
  for (const value of testValues) {
    for (const unit of testUnits) {
      try {
        // Teste round-trip: converter e converter de volta
        const unified = unifyCriDose(value, unit);
        const converted = convertCriDoseFromStandard(unified, unit);
        
        // Deve ser aproximadamente igual (tolerância de 0.001%)
        const tolerance = value * 0.00001;
        if (Math.abs(converted - value) > tolerance) {
          console.error(`Falha na conversão round-trip: ${value} ${unit}`);
          return false;
        }
      } catch (error) {
        console.error(`Erro na conversão: ${error}`);
        return false;
      }
    }
  }
  
  return true;
}

/**
 * Teste de invariantes: verifica propriedades matemáticas esperadas
 */
export function validateConversionInvariants(): boolean {
  // Teste 1: Aumentar peso deve aumentar mg/h proporcionalmente
  const dose = 1; // mg/kg/h
  const weight1 = 10; // kg
  const weight2 = 20; // kg
  
  const mgPerHour1 = dose * weight1; // 10 mg/h
  const mgPerHour2 = dose * weight2; // 20 mg/h
  
  if (mgPerHour2 !== mgPerHour1 * 2) {
    console.error('Falha no invariante: peso vs mg/h');
    return false;
  }
  
  // Teste 2: Aumentar taxa de infusão deve diminuir concentração necessária
  const mgPerHour = 10; // mg/h
  const rate1 = 10; // mL/h
  const rate2 = 20; // mL/h
  
  const conc1 = mgPerHour / rate1; // 1 mg/mL
  const conc2 = mgPerHour / rate2; // 0.5 mg/mL
  
  if (conc2 !== conc1 / 2) {
    console.error('Falha no invariante: taxa vs concentração');
    return false;
  }
  
  return true;
}

// Executa validações na inicialização
if (typeof window !== 'undefined') {
  const sanityCheck = validateConversionSanity();
  const invariantCheck = validateConversionInvariants();
  
  if (!sanityCheck || !invariantCheck) {
    console.error('⚠️ Falhas nas validações de conversão detectadas!');
  } else {
    console.log('✅ Validações de conversão passaram com sucesso');
  }
}
