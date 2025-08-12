import { Drug, CriDose, BolusDose, DrugConcentration, CriDoseUnit, BolusDoseUnit, WarningType } from '../types';

// Importando dados do arquivo original
import { DRUGS as ORIGINAL_DRUGS } from './drugs';

// Importando dados do arquivo comprehensive
import { COMPREHENSIVE_DRUGS } from './comprehensive_drugs';

// Importando dados do arquivo expanded
import { EXPANDED_DRUGS } from './expanded_drugs';

// Importando dados do arquivo additional
import { ADDITIONAL_DRUGS } from './additional_drugs';

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
  ...COMPREHENSIVE_DRUGS,
  ...EXPANDED_DRUGS,
  ...ADDITIONAL_DRUGS
]);

// Exportando também as outras constantes
export { COMPATIBILITY_MATRIX, FORMULAS, EXAMPLES } from './comprehensive_drugs';
export { 
  EXPANDED_COMPATIBILITY_MATRIX, 
  EXPANDED_FORMULAS, 
  EXPANDED_EXAMPLES,
  TOOLTIPS,
  COMORBIDITY_ADJUSTMENTS,
  CHECKLISTS
} from './expanded_drugs';
export {
  ADDITIONAL_COMPATIBILITY_MATRIX,
  ADDITIONAL_FORMULAS,
  ADDITIONAL_EXAMPLES,
  ADDITIONAL_TOOLTIPS,
  ADDITIONAL_CHECKLISTS
} from './additional_drugs';
