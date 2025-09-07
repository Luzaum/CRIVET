import { describe, it, expect } from 'vitest'
import { calculateCRI, calculateBolus } from './calculations'

// Helper comparação com tolerância
const close = (a: number, b: number, tol = 0.02) => Math.abs(a - b) <= tol

describe('calculateCRI — cenários reais', () => {
  it('Cetamina — 0.5 mg/kg/h, 5.5 kg, 5 mL/h, seringa 60 mL, frasco 100 mg/mL => 0.33 mL de fármaco', () => {
    const r = calculateCRI({
      dose: { value: 0.5, unit: 'mg_kg_h' },
      weightKg: 5.5,
      stock: { value: 100, unit: 'mg/mL' },
      vehicle: { type: 'syringe', volume: 60 },
      durationHours: 12,         // irrelevante quando rate é fornecida
      infusionRateMlPerHour: 5,
    })
    expect(close(r.volumeDrugMl, 0.33, 0.01)).toBe(true)
  })

  it('Fentanil — 5 μg/kg/h, 5.5 kg, 5 mL/h, seringa 60 mL, frasco 50 μg/mL => 6.6 mL', () => {
    const r = calculateCRI({
      dose: { value: 5, unit: 'mcg_kg_h' },
      weightKg: 5.5,
      stock: { value: 50, unit: 'μg/mL' },
      vehicle: { type: 'syringe', volume: 60 },
      durationHours: 12,
      infusionRateMlPerHour: 5,
    })
    expect(close(r.volumeDrugMl, 6.6, 0.05)).toBe(true)
  })

  it('Remifentanil — 0.3 μg/kg/min, 5.5 kg, 5 mL/h, 1 mg/mL => ~1.19 mL', () => {
    const r = calculateCRI({
      dose: { value: 0.3, unit: 'mcg_kg_min' },
      weightKg: 5.5,
      stock: { value: 1, unit: 'mg/mL' },
      vehicle: { type: 'syringe', volume: 60 },
      durationHours: 12,
      infusionRateMlPerHour: 5,
    })
    expect(close(r.volumeDrugMl, 1.19, 0.03)).toBe(true)
  })

  it('Dobutamina — 0.45 mg/kg/h, 5.5 kg, 5 mL/h, 12.5 mg/mL => ~2.38 mL', () => {
    const r = calculateCRI({
      dose: { value: 0.45, unit: 'mg_kg_h' },
      weightKg: 5.5,
      stock: { value: 12.5, unit: 'mg/mL' },
      vehicle: { type: 'syringe', volume: 60 },
      durationHours: 12,
      infusionRateMlPerHour: 5,
    })
    expect(close(r.volumeDrugMl, 2.38, 0.05)).toBe(true)
  })
})

describe('calculateBolus — casos básicos', () => {
  it('Lidocaína 2 mg/kg, 5 kg, frasco 20 mg/mL => 10 mg, 0.5 mL', () => {
    const r = calculateBolus({
      dose: { value: 2, unit: 'mg_kg' },
      weightKg: 5,
      stock: { value: 20, unit: 'mg/mL' },
    })
    expect(close(r.totalDoseMg, 10, 0.01)).toBe(true)
    expect(close(r.volumeDrugMl, 0.5, 0.01)).toBe(true)
  })

  it('Bólus com diluição final 10 mL', () => {
    const r = calculateBolus({
      dose: { value: 2, unit: 'mg_kg' },
      weightKg: 5,
      stock: { value: 20, unit: 'mg/mL' },
      finalVolumeMl: 10,
    })
    expect(close(r.volumeDrugMl, 0.5, 0.01)).toBe(true)
    expect(close(r.diluentVolumeMl!, 9.5, 0.01)).toBe(true)
  })
})

describe('Unidades e validações', () => {
  it('mg/kg/min e mg/kg/dia convertem corretamente', () => {
    const rMin = calculateCRI({
      dose: { value: 0.01, unit: 'mg_kg_min' }, // 0.6 mg/kg/h
      weightKg: 10,
      stock: { value: 100, unit: 'mg/mL' },
      vehicle: { type: 'syringe', volume: 60 },
      durationHours: 10,
      infusionRateMlPerHour: 5,
    })
    const rDay = calculateCRI({
      dose: { value: 24, unit: 'mg_kg_day' }, // 1 mg/kg/h
      weightKg: 10,
      stock: { value: 100, unit: 'mg/mL' },
      vehicle: { type: 'syringe', volume: 60 },
      durationHours: 10,
      infusionRateMlPerHour: 5,
    })
    expect(rMin.massMgPerHour).toBeGreaterThan(0)
    expect(rDay.massMgPerHour).toBeGreaterThan(rMin.massMgPerHour)
  })

  it('Validações de entrada funcionam', () => {
    expect(() => calculateCRI({
      dose: { value: 0, unit: 'mg_kg_h' },
      weightKg: 5,
      stock: { value: 100, unit: 'mg/mL' },
      vehicle: { type: 'syringe', volume: 60 },
      durationHours: 10,
    })).toThrow('Dose inválida')

    expect(() => calculateCRI({
      dose: { value: 1, unit: 'mg_kg_h' },
      weightKg: 0,
      stock: { value: 100, unit: 'mg/mL' },
      vehicle: { type: 'syringe', volume: 60 },
      durationHours: 10,
    })).toThrow('Peso inválido')

    expect(() => calculateBolus({
      dose: { value: -1, unit: 'mg_kg' },
      weightKg: 5,
      stock: { value: 20, unit: 'mg/mL' },
    })).toThrow('Dose inválida')
  })

  it('Steps são gerados corretamente', () => {
    const r = calculateCRI({
      dose: { value: 1, unit: 'mg_kg_h' },
      weightKg: 10,
      stock: { value: 100, unit: 'mg/mL' },
      vehicle: { type: 'syringe', volume: 60 },
      durationHours: 10,
      infusionRateMlPerHour: 5,
    })
    
    expect(r.steps).toHaveLength(3)
    expect(r.steps[0].label).toContain('Passo 1')
    expect(r.steps[1].label).toContain('Passo 2')
    expect(r.steps[2].label).toContain('Passo 3')
    expect(r.steps[0].formula).toContain('Dose')
    expect(r.steps[1].formula).toContain('mg/h ÷ mL/h')
    expect(r.steps[2].formula).toContain('Concentração necessária')
  })
})
