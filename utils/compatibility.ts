export type Fluid = 'rl' | 'sf' | 'd25' | 'd5';

export type CompatibilityLevel = 'success' | 'warning' | 'danger';

export function checkCompatibility(
  selectedFluid: Fluid,
  opts: {
    preferred?: Fluid;
    compatible?: Fluid[];
    avoid?: Fluid[];
    notes?: string;
  },
): { level: CompatibilityLevel; message: string; reason: string } {
  if (!opts) {
    return { level: 'warning', message: 'Compatibilidade desconhecida', reason: 'Sem dados para este fármaco.' };
  }
  if (opts.avoid?.includes(selectedFluid)) {
    return {
      level: 'danger',
      message: '🚨 Fluido incompatível',
      reason: 'Incompatibilidade declarada para este fluido. ' + (opts.notes || ''),
    };
  }
  if (opts.preferred === selectedFluid) {
    return {
      level: 'success',
      message: 'Compatível (preferido)',
      reason: 'Fluido recomendado para estabilidade e pH/osmolaridade adequados.',
    };
  }
  if (opts.compatible?.includes(selectedFluid)) {
    return {
      level: 'warning',
      message: 'Parcialmente compatível',
      reason: 'Compatível, porém não é o fluido preferido. ' + (opts.notes || ''),
    };
  }
  // sem match explícito
  return {
    level: 'warning',
    message: 'Compatibilidade não verificada',
    reason: 'Não há registro específico para este fluido. Use com cautela.',
  };
}