// Classifica a dose atual vs. faixas declaradas no fármaco (sem bloquear cálculo).
import type { Drug } from '../types'

export type DoseUnit =
  | 'mcg/kg/min' | 'mcg/kg/h' | 'mg/kg/h' // CRI
  | 'mg/kg' | 'mcg/kg'                    // Bolus

export type RangeLevel = 'within' | 'below' | 'above' | 'unknown'

export interface RangeStatus {
  level: RangeLevel
  message: string
  targetUnit?: string
  min?: number
  max?: number
}

// Helper para conversão de unidades (simplificado)
function convertUnit(value: number, fromUnit: DoseUnit, toUnit: DoseUnit): number {
  // Converter tudo para mg/kg/h como base
  let baseValue: number
  
  switch (fromUnit) {
    case 'mcg/kg/min': baseValue = (value * 60) / 1000; break
    case 'mcg/kg/h': baseValue = value / 1000; break
    case 'mg/kg/h': baseValue = value; break
    case 'mg/kg': baseValue = value; break
    case 'mcg/kg': baseValue = value / 1000; break
    default: return value
  }
  
  // Converter da base para a unidade alvo
  switch (toUnit) {
    case 'mcg/kg/min': return (baseValue * 1000) / 60
    case 'mcg/kg/h': return baseValue * 1000
    case 'mg/kg/h': return baseValue
    case 'mg/kg': return baseValue
    case 'mcg/kg': return baseValue * 1000
    default: return baseValue
  }
}

export function classifyCriDose(
  drug: Drug | null,
  currentDoseValue: number,
  currentDoseUnit: DoseUnit
): RangeStatus {
  if (!drug?.criDoses?.length || !Number.isFinite(currentDoseValue)) {
    return { level: 'unknown', message: 'Sem faixa cadastrada para este fármaco.' }
  }

  // Procura primeiro uma faixa com mesma unidade; se não achar, converte.
  const preferred = drug.criDoses.find(d => d.cri.unit === currentDoseUnit)
    ?? drug.criDoses[0]

  const minInCurrent = preferred.cri.unit === currentDoseUnit
    ? preferred.cri.min
    : convertUnit(preferred.cri.min, preferred.cri.unit as DoseUnit, currentDoseUnit)

  const maxInCurrent = preferred.cri.unit === currentDoseUnit
    ? preferred.cri.max
    : convertUnit(preferred.cri.max, preferred.cri.unit as DoseUnit, currentDoseUnit)

  if (!Number.isFinite(minInCurrent) || !Number.isFinite(maxInCurrent)) {
    return { level: 'unknown', message: 'Faixa não pôde ser convertida para a unidade atual.' }
  }

  if (currentDoseValue < minInCurrent) {
    return {
      level: 'below',
      message: `Abaixo da faixa recomendada (${minInCurrent.toFixed(3)}–${maxInCurrent.toFixed(3)} ${currentDoseUnit}).`,
      targetUnit: currentDoseUnit, min: minInCurrent, max: maxInCurrent,
    }
  }
  if (currentDoseValue > maxInCurrent) {
    return {
      level: 'above',
      message: `Acima da faixa recomendada (${minInCurrent.toFixed(3)}–${maxInCurrent.toFixed(3)} ${currentDoseUnit}).`,
      targetUnit: currentDoseUnit, min: minInCurrent, max: maxInCurrent,
    }
  }
  return {
    level: 'within',
    message: `Dentro da faixa (${minInCurrent.toFixed(3)}–${maxInCurrent.toFixed(3)} ${currentDoseUnit}).`,
    targetUnit: currentDoseUnit, min: minInCurrent, max: maxInCurrent,
  }
}

export function classifyBolusDose(
  drug: Drug | null,
  currentDoseValue: number,
  currentDoseUnit: DoseUnit
): RangeStatus {
  if (!drug?.bolusDoses?.length || !Number.isFinite(currentDoseValue)) {
    return { level: 'unknown', message: 'Sem faixa cadastrada para bólus.' }
  }
  
  const preferred = drug.bolusDoses.find(d => d.unit === currentDoseUnit)
    ?? drug.bolusDoses[0]

  const minInCurrent = preferred.unit === currentDoseUnit
    ? preferred.min
    : convertUnit(preferred.min, preferred.unit as DoseUnit, currentDoseUnit)

  const maxInCurrent = preferred.unit === currentDoseUnit
    ? preferred.max
    : convertUnit(preferred.max, preferred.unit as DoseUnit, currentDoseUnit)

  if (!Number.isFinite(minInCurrent) || !Number.isFinite(maxInCurrent)) {
    return { level: 'unknown', message: 'Faixa não pôde ser convertida para a unidade atual.' }
  }

  if (currentDoseValue < minInCurrent) {
    return {
      level: 'below',
      message: `Abaixo da faixa recomendada (${minInCurrent.toFixed(3)}–${maxInCurrent.toFixed(3)} ${currentDoseUnit}).`,
      targetUnit: currentDoseUnit, min: minInCurrent, max: maxInCurrent,
    }
  }
  if (currentDoseValue > maxInCurrent) {
    return {
      level: 'above',
      message: `Acima da faixa recomendada (${minInCurrent.toFixed(3)}–${maxInCurrent.toFixed(3)} ${currentDoseUnit}).`,
      targetUnit: currentDoseUnit, min: minInCurrent, max: maxInCurrent,
    }
  }
  return {
    level: 'within',
    message: `Dentro da faixa (${minInCurrent.toFixed(3)}–${maxInCurrent.toFixed(3)} ${currentDoseUnit}).`,
    targetUnit: currentDoseUnit, min: minInCurrent, max: maxInCurrent,
  }
}
