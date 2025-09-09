
// Re-export dos novos enums
export { Species, PatientState } from './types/enums';

export interface Patient {
  species: Species;
  state: PatientState;
  weight: number;
  hepaticDisease: boolean;
  renalDisease: boolean;
  cardiacDisease?: boolean;
  septicShock?: boolean;
  neuroDisease?: boolean;
}

export enum CriDoseUnit {
  mcg_kg_min = 'μg/kg/min',
  mcg_kg_h = 'μg/kg/h',
  mg_kg_min = 'mg/kg/min',
  mg_kg_h = 'mg/kg/h',
  mg_kg_day = 'mg/kg/dia',
  U_kg_h = 'U/kg/h',
  mU_kg_min = 'mU/kg/min',
}

export enum BolusDoseUnit {
    mcg_kg = 'µg/kg',
    mg_kg = 'mg/kg',
    U_kg = 'U/kg',
}

export interface CriDose {
  species: 'dog' | 'cat' | 'both';
  useCase?: string; 
  cri: {
    min: number;
    max: number;
    default: number;
    unit: CriDoseUnit;
  };
  notes?: string;
  extrapolated?: boolean; 
  recommendedBagInfusionTime?: number;
}

export interface BolusDose {
    species: 'dog' | 'cat' | 'both';
    useCase?: string;
    min: number;
    max: number;
    unit: BolusDoseUnit;
    infusionTimeMin?: number;
    notes?: string;
    extrapolated?: boolean;
}

export interface DrugConcentration {
  value: number;
  unit: 'mg/mL' | 'μg/mL' | 'U/mL';
  label: string;
}

export enum WarningType {
  VentilatorySupport = 'SUPORTE VENTILATÓRIO OBRIGATÓRIO',
  Vesicant = 'FÁRMACO VESICANTE',
  Photoprotection = 'PROTEGER DA LUZ',
}

export interface DrugInfo {
    indicationSummary: string[];
    dosesText: {
        dog: { cri?: string; bolus?: string };
        cat: { cri?: string; bolus?: string };
        notes?: string;
    };
    mechanism?: string;
    preferredUnit?: string;
    diluents: {
        recommended: FluidType[];
        notes?: string;
    };
    compatibility: {
        incompatibilities?: string[];
        ySite?: string[];
        notes?: string;
        preferred?: string;
        compatible?: string[];
        avoid?: string[];
    };
    photoprotection: boolean;
    adjustments: {
        renal?: string;
        hepatic?: string;
        cardiac?: string;
        neuro?: string;
        sepsis?: string;
        pediatric?: string;
        geriatric?: string;
        pregnancy?: string;
    };
    monitoring: string[];
    goodPractice: string[];
    contraindications?: string[];
    citations: string[];
}

export interface Drug {
  id: string;
  name: string;
  category: string;
  concentrations: DrugConcentration[];
  criDoses?: CriDose[];
  bolusDoses?: BolusDose[];
  isPowder?: boolean;
  preparationGuide?: string;
  isCombo?: boolean;
  comboDetails?: ComboDetails;
  specialWarnings?: WarningType[];
  info?: DrugInfo;
  // Campos adicionais para compatibilidade
  cri?: any;
  bolus?: any;
  cautions?: any[];
  references?: any[];
  mechanism?: string;
  indications?: string;
  contraindications?: string;
  monograph?: {
    mechanism?: string;
    indications?: string;
    contraindications?: string;
    criNotes?: string;
    bolusNotes?: string;
    dilution?: string;
    compatibility?: string;
    presentations?: string;
    alerts?: string;
    references?: string;
  };
}

export interface ComboDetails {
    description: string;
    targetSpecies: 'dog' | 'cat';
    ingredients: Array<{
        drugId: string;
        dose: number;
        unit: CriDoseUnit;
    }>;
    presets?: {
        '25%': Record<string, number>;
        '50%': Record<string, number>;
        '75%': Record<string, number>;
        '100%': Record<string, number>;
    };
    notes?: string;
}

export type FluidType = 'NaCl 0.9%' | 'Ringer Lactato' | 'SG 5%' | 'Glicose 5%' | 'Glicose 10%' | 'Oral';

export type Vehicle = 
  | { type: 'syringe'; volume: number }
  | { type: 'bag'; volume: number; fluid: FluidType };
