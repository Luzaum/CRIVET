/**
 * Testes para o sistema de formatação
 * Valida formatação PT-BR e parsing de números
 */

import { describe, it, expect } from 'vitest';
import {
  formatNumber,
  formatDisplayNumber,
  parseNumberPTBR,
  formatInputNumber,
  isValidNumberInput,
  formatWithUnit,
  formatVolume,
  formatConcentration,
  formatInfusionRate,
  formatWeight,
  formatDose
} from '../format';

describe('Sistema de Formatação', () => {
  describe('Arredondamento', () => {
    it('deve arredondar volumes para 2 casas decimais', () => {
      expect(formatNumber(1.234567, 'volumes')).toBe(1.23);
      expect(formatNumber(1.236, 'volumes')).toBe(1.24);
    });

    it('deve arredondar doses para 3 casas decimais', () => {
      expect(formatNumber(1.234567, 'doses')).toBe(1.235);
      expect(formatNumber(1.2344, 'doses')).toBe(1.234);
    });

    it('deve arredondar concentrações para 4 casas decimais', () => {
      expect(formatNumber(1.23456789, 'concentrations')).toBe(1.2346);
      expect(formatNumber(1.23444, 'concentrations')).toBe(1.2344);
    });

    it('deve arredondar taxas para 1 casa decimal', () => {
      expect(formatNumber(1.234567, 'rates')).toBe(1.2);
      expect(formatNumber(1.26, 'rates')).toBe(1.3);
    });

    it('deve arredondar pesos para 1 casa decimal', () => {
      expect(formatNumber(1.234567, 'weights')).toBe(1.2);
      expect(formatNumber(1.26, 'weights')).toBe(1.3);
    });
  });

  describe('Formatação para exibição', () => {
    it('deve formatar números em PT-BR', () => {
      expect(formatDisplayNumber(1234.567, 'volumes')).toBe('1.234,57');
      expect(formatDisplayNumber(0.123, 'doses')).toBe('0,123');
      expect(formatDisplayNumber(1, 'weights')).toBe('1,0');
    });

    it('deve formatar com unidade', () => {
      expect(formatWithUnit(1.23, 'mL', 'volumes')).toBe('1,23 mL');
      expect(formatWithUnit(0.123, 'mg/kg/h', 'doses')).toBe('0,123 mg/kg/h');
    });

    it('deve formatar tipos específicos', () => {
      expect(formatVolume(1.23)).toBe('1,23 mL');
      expect(formatConcentration(0.1234)).toBe('0,1234 mg/mL');
      expect(formatInfusionRate(10.5)).toBe('10,5 mL/h');
      expect(formatWeight(25.7)).toBe('25,7 kg');
      expect(formatDose(0.123, 'mcg/kg/min')).toBe('0,123 mcg/kg/min');
    });
  });

  describe('Parsing PT-BR', () => {
    it('deve converter vírgula para ponto', () => {
      expect(parseNumberPTBR('1,23')).toBe(1.23);
      expect(parseNumberPTBR('0,123')).toBe(0.123);
      expect(parseNumberPTBR('1234,56')).toBe(1234.56);
    });

    it('deve aceitar ponto como separador decimal', () => {
      expect(parseNumberPTBR('1.23')).toBe(1.23);
      expect(parseNumberPTBR('0.123')).toBe(0.123);
    });

    it('deve lidar com strings vazias', () => {
      expect(parseNumberPTBR('')).toBe(0);
      expect(parseNumberPTBR('   ')).toBe(0);
    });

    it('deve lidar com valores inválidos', () => {
      expect(parseNumberPTBR('abc')).toBe(0);
      expect(parseNumberPTBR('1,2,3')).toBe(0);
    });

    it('deve lidar com números inteiros', () => {
      expect(parseNumberPTBR('123')).toBe(123);
      expect(parseNumberPTBR('0')).toBe(0);
    });
  });

  describe('Formatação para input', () => {
    it('deve formatar números para input', () => {
      expect(formatInputNumber(1.23)).toBe('1,23');
      expect(formatInputNumber(0)).toBe('');
      expect(formatInputNumber(123)).toBe('123');
    });

    it('deve manter strings inalteradas', () => {
      expect(formatInputNumber('1,2')).toBe('1,2');
      expect(formatInputNumber('0,')).toBe('0,');
    });
  });

  describe('Validação de input', () => {
    it('deve aceitar números válidos', () => {
      expect(isValidNumberInput('123')).toBe(true);
      expect(isValidNumberInput('1,23')).toBe(true);
      expect(isValidNumberInput('0,123')).toBe(true);
      expect(isValidNumberInput('0,')).toBe(true); // Construção gradual
    });

    it('deve aceitar strings vazias', () => {
      expect(isValidNumberInput('')).toBe(true);
      expect(isValidNumberInput('   ')).toBe(true);
    });

    it('deve rejeitar números inválidos', () => {
      expect(isValidNumberInput('abc')).toBe(false);
      expect(isValidNumberInput('1,2,3')).toBe(false);
      expect(isValidNumberInput('1.2.3')).toBe(false);
      expect(isValidNumberInput('1,2a')).toBe(false);
    });

    it('deve aceitar construção gradual', () => {
      expect(isValidNumberInput('0,')).toBe(true);
      expect(isValidNumberInput('1,')).toBe(true);
      expect(isValidNumberInput('12,')).toBe(true);
    });
  });

  describe('Casos extremos', () => {
    it('deve lidar com valores muito pequenos', () => {
      expect(formatDisplayNumber(0.0001, 'concentrations')).toBe('0,0001');
      expect(parseNumberPTBR('0,0001')).toBe(0.0001);
    });

    it('deve lidar com valores muito grandes', () => {
      expect(formatDisplayNumber(1234567.89, 'volumes')).toBe('1.234.567,89');
      expect(parseNumberPTBR('1234567,89')).toBe(1234567.89);
    });

    it('deve lidar com zero', () => {
      expect(formatDisplayNumber(0, 'volumes')).toBe('0,00');
      expect(parseNumberPTBR('0')).toBe(0);
      expect(parseNumberPTBR('0,0')).toBe(0);
    });
  });
});
