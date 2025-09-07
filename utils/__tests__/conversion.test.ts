/**
 * Testes para o sistema de conversão
 * Valida a precisão e consistência das conversões
 */

import { describe, it, expect } from 'vitest';
import { 
  unifyCriDose, 
  convertCriDoseFromStandard,
  unifyBolusDose,
  convertBolusDoseFromStandard,
  validateConversionSanity,
  validateConversionInvariants
} from '../conversion';
import { CriDoseUnit, BolusDoseUnit } from '../../types/enums';

describe('Sistema de Conversão', () => {
  describe('Conversões CRI', () => {
    it('deve converter mcg/kg/min para mg/kg/h corretamente', () => {
      const result = unifyCriDose(1, CriDoseUnit.MCG_KG_MIN);
      expect(result).toBeCloseTo(0.06, 5); // 1 mcg/kg/min = 0.06 mg/kg/h
    });

    it('deve converter mcg/kg/h para mg/kg/h corretamente', () => {
      const result = unifyCriDose(1000, CriDoseUnit.MCG_KG_H);
      expect(result).toBeCloseTo(1, 5); // 1000 mcg/kg/h = 1 mg/kg/h
    });

    it('deve converter mg/kg/min para mg/kg/h corretamente', () => {
      const result = unifyCriDose(1, CriDoseUnit.MG_KG_MIN);
      expect(result).toBeCloseTo(60, 5); // 1 mg/kg/min = 60 mg/kg/h
    });

    it('deve manter mg/kg/h inalterado', () => {
      const result = unifyCriDose(5, CriDoseUnit.MG_KG_H);
      expect(result).toBeCloseTo(5, 5);
    });

    it('deve converter mg/kg/dia para mg/kg/h corretamente', () => {
      const result = unifyCriDose(24, CriDoseUnit.MG_KG_DAY);
      expect(result).toBeCloseTo(1, 5); // 24 mg/kg/dia = 1 mg/kg/h
    });
  });

  describe('Conversões Bolus', () => {
    it('deve converter mcg/kg para mg/kg corretamente', () => {
      const result = unifyBolusDose(1000, BolusDoseUnit.MCG_KG);
      expect(result).toBeCloseTo(1, 5); // 1000 mcg/kg = 1 mg/kg
    });

    it('deve manter mg/kg inalterado', () => {
      const result = unifyBolusDose(5, BolusDoseUnit.MG_KG);
      expect(result).toBeCloseTo(5, 5);
    });
  });

  describe('Round-trip conversions', () => {
    it('deve manter precisão em conversões round-trip CRI', () => {
      const testCases = [
        { value: 0.1, unit: CriDoseUnit.MCG_KG_MIN },
        { value: 1, unit: CriDoseUnit.MCG_KG_H },
        { value: 0.5, unit: CriDoseUnit.MG_KG_MIN },
        { value: 10, unit: CriDoseUnit.MG_KG_H },
        { value: 24, unit: CriDoseUnit.MG_KG_DAY },
      ];

      testCases.forEach(({ value, unit }) => {
        const unified = unifyCriDose(value, unit);
        const converted = convertCriDoseFromStandard(unified, unit);
        expect(converted).toBeCloseTo(value, 5);
      });
    });

    it('deve manter precisão em conversões round-trip Bolus', () => {
      const testCases = [
        { value: 100, unit: BolusDoseUnit.MCG_KG },
        { value: 5, unit: BolusDoseUnit.MG_KG },
      ];

      testCases.forEach(({ value, unit }) => {
        const unified = unifyBolusDose(value, unit);
        const converted = convertBolusDoseFromStandard(unified, unit);
        expect(converted).toBeCloseTo(value, 5);
      });
    });
  });

  describe('Validações de sanidade', () => {
    it('deve passar na validação de sanidade', () => {
      expect(validateConversionSanity()).toBe(true);
    });

    it('deve passar na validação de invariantes', () => {
      expect(validateConversionInvariants()).toBe(true);
    });
  });

  describe('Casos extremos', () => {
    it('deve lidar com valores zero', () => {
      expect(unifyCriDose(0, CriDoseUnit.MG_KG_H)).toBe(0);
      expect(unifyBolusDose(0, BolusDoseUnit.MG_KG)).toBe(0);
    });

    it('deve lidar com valores muito pequenos', () => {
      const result = unifyCriDose(0.001, CriDoseUnit.MCG_KG_MIN);
      expect(result).toBeCloseTo(0.00006, 8);
    });

    it('deve lidar com valores grandes', () => {
      const result = unifyCriDose(1000, CriDoseUnit.MG_KG_H);
      expect(result).toBeCloseTo(1000, 5);
    });
  });
});
