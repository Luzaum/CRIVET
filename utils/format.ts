/**
 * Política global de formatação e arredondamento
 * Centraliza todas as regras de formatação numérica
 */

// Política de arredondamento por tipo de valor
export const ROUNDING_POLICY = {
  volumes: 2,        // mL - 2 casas decimais
  doses: 3,          // Doses - 3 casas decimais (mais precisão)
  concentrations: 4, // mg/mL - 4 casas decimais (máxima precisão)
  rates: 1,          // mL/h - 1 casa decimal
  weights: 1,        // kg - 1 casa decimal
} as const;

/**
 * Formata números com política de arredondamento específica
 */
export function formatNumber(
  value: number, 
  type: keyof typeof ROUNDING_POLICY
): number {
  const decimals = ROUNDING_POLICY[type];
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Formata número para exibição em PT-BR
 */
export function formatDisplayNumber(
  value: number, 
  type: keyof typeof ROUNDING_POLICY
): string {
  const rounded = formatNumber(value, type);
  const decimals = ROUNDING_POLICY[type];
  
  return rounded.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Converte string PT-BR para número (aceita vírgula e ponto)
 */
export function parseNumberPTBR(value: string): number {
  if (!value || value.trim() === '') return 0;
  
  // Remove espaços
  const trimmed = value.trim();
  
  // Verifica se há múltiplas vírgulas ou pontos (formato inválido)
  const commaCount = (trimmed.match(/,/g) || []).length;
  const dotCount = (trimmed.match(/\./g) || []).length;
  
  if (commaCount > 1 || dotCount > 1 || (commaCount > 0 && dotCount > 0)) {
    return 0; // Formato inválido
  }
  
  // Converte vírgula para ponto
  const cleanValue = trimmed.replace(',', '.');
  
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Formata número para input (aceita construção gradual)
 */
export function formatInputNumber(value: number | string): string {
  if (typeof value === 'string') {
    // Se já é string, permite construção gradual (ex: "0,")
    return value;
  }
  
  if (value === 0) return '';
  
  // Para números, formata normalmente
  return value.toString().replace('.', ',');
}

/**
 * Valida se string pode ser um número válido (incluindo construção gradual)
 */
export function isValidNumberInput(value: string): boolean {
  if (!value || value.trim() === '') return true; // Vazio é válido
  
  // Permite construção gradual: "0,", "0,1", "0,12", etc.
  const validPattern = /^[0-9]+([,][0-9]*)?$/;
  return validPattern.test(value.trim());
}

/**
 * Converte número para unidade específica com formatação
 */
export function formatWithUnit(
  value: number, 
  unit: string, 
  type: keyof typeof ROUNDING_POLICY
): string {
  const formatted = formatDisplayNumber(value, type);
  return `${formatted} ${unit}`;
}

/**
 * Formata volume de medicamento
 */
export function formatVolume(value: number): string {
  return formatWithUnit(value, 'mL', 'volumes');
}

/**
 * Formata concentração
 */
export function formatConcentration(value: number): string {
  return formatWithUnit(value, 'mg/mL', 'concentrations');
}

/**
 * Formata taxa de infusão
 */
export function formatInfusionRate(value: number): string {
  return formatWithUnit(value, 'mL/h', 'rates');
}

/**
 * Formata peso
 */
export function formatWeight(value: number): string {
  return formatWithUnit(value, 'kg', 'weights');
}

/**
 * Formata dose com unidade específica
 */
export function formatDose(value: number, unit: string): string {
  return formatWithUnit(value, unit, 'doses');
}
