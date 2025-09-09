import type { Patient } from '../types';

export function warningsFor(patient: Patient, drugId?: string): string[] {
  const w: string[] = [];

  if (patient.hepaticDisease) {
    w.push('⚠️ Doença hepática: ajuste de dose e monitorização de sinais de toxicidade.');
  }
  if (patient.renalDisease) {
    w.push('⚠️ Doença renal: avaliar clearance e fluídica.');
  }
  if (patient.cardiacDisease) {
    w.push('⚠️ Doença cardíaca: monitorar ECG/PA; risco de arritmias/hemodinâmica.');
  }
  if (patient.septicShock) {
    w.push('⚠️ Séptico/Choque: otimizar volume; titular dose com alvo hemodinâmico.');
  }
  if (patient.pregnant) {
    w.push('⚠️ Gestante: considerar passagem placentária e segurança fetal.');
  }
  if (patient.lactating) {
    w.push('ℹ️ Lactante: avaliar excreção em leite.');
  }

  // exemplos específicos por fármaco (lidocaína)
  if (drugId === 'lidocaina') {
    if (patient.hepaticDisease) {
      w.push('Lidocaína é metabolizada no fígado → risco de acumulação/toxicidade.');
    }
    if (patient.cardiacDisease) {
      w.push('Evitar em bloqueios de condução não monitorados; titular lentamente.');
    }
    // gatos mais sensíveis sistêmico
    if (patient.species === 'feline') {
      w.push('Gatos são mais sensíveis aos efeitos sistêmicos da lidocaína (dose com cautela).');
    }
  }

  return w;
}