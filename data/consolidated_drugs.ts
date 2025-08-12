import { Drug, CriDose, BolusDose, DrugConcentration, CriDoseUnit, BolusDoseUnit, WarningType } from '../types';

// Importando dados do arquivo original
import { DRUGS as ORIGINAL_DRUGS } from './drugs';

// Importando dados do arquivo comprehensive
import { COMPREHENSIVE_DRUGS } from './comprehensive_drugs';

// Função para remover duplicatas baseado no ID
function removeDuplicates(drugs: Drug[]): Drug[] {
  const seen = new Set();
  return drugs.filter(drug => {
    if (seen.has(drug.id)) {
      return false;
    }
    seen.add(drug.id);
    return true;
  });
}

// Combinando todos os fármacos e removendo duplicatas
export const CONSOLIDATED_DRUGS: Drug[] = removeDuplicates([
  ...ORIGINAL_DRUGS,
  ...COMPREHENSIVE_DRUGS
]);

// Exportando também as outras constantes do comprehensive_drugs
export { COMPATIBILITY_MATRIX, FORMULAS, EXAMPLES } from './comprehensive_drugs';
