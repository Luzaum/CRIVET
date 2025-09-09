/**
 * Modelo de dados robusto para medicamentos veterinários
 * Baseado nas melhores práticas de farmacologia veterinária
 */

import { 
  Species, 
  CriDoseUnit, 
  BolusDoseUnit, 
  Fluid, 
  WarningLevel,
  DrugCategory,
  CompatibilityStatus,
  LightSensitivity,
  Stability
} from './enums';

/**
 * Faixa de dose com informações contextuais
 */
export interface DoseRange {
  unit: CriDoseUnit | BolusDoseUnit;
  min: number;
  max: number;
  typical?: string; // "mais usado", "inicial", "manutenção"
  notes?: string;
  extrapolated?: boolean; // Se é extrapolado de outras espécies
}

/**
 * Informações de compatibilidade
 */
export interface CompatibilityInfo {
  preferred: Fluid;
  compatible?: Fluid[];
  avoid?: string[];
  notes?: string;
  ySite?: {
    compatible: string[];
    caution: string[];
    incompatible: string[];
  };
}

/**
 * Diluição comum pré-calculada
 */
export interface CommonDilution {
  addMg: number;           // Quantidade de medicamento em mg
  vehicle: Fluid;          // Veículo de diluição
  volumeMl: number;        // Volume final em mL
  finalMcgMl: number;      // Concentração final em mcg/mL
  stability?: Stability;   // Estabilidade da solução
  notes?: string;
}

/**
 * Informações de apresentação do medicamento
 */
export interface DrugPresentation {
  concMgMl: number;        // Concentração em mg/mL
  lightSensitive?: LightSensitivity;
  stability?: Stability;
  preparationNotes?: string;
  isPowder?: boolean;
  reconstitutionGuide?: string;
}

/**
 * Informações de CRI (Infusão Contínua)
 */
export interface CriInfo {
  preferredUnit: CriDoseUnit;     // Unidade mais usada na prática
  ranges: DoseRange[];            // Faixas de dose por espécie/indicação
  titrationNotes?: string;        // Notas sobre titulação
  compatibility: CompatibilityInfo;
  commonDilutions?: CommonDilution[];
  contraindications?: string[];
  monitoring?: string[];
}

/**
 * Informações de Bolus
 */
export interface BolusInfo {
  allowed: boolean;               // Se bolus é permitido
  ranges?: DoseRange[];           // Faixas de dose para bolus
  notes?: string;                 // Notas específicas sobre bolus
  contraindications?: string[];   // Contraindicações específicas
}

/**
 * Cautela ou aviso
 */
export interface Caution {
  level: WarningLevel;
  text: string;
  context?: string;               // Quando aplicar (ex: "em gatos", "em hepatopatas")
}

/**
 * Referência bibliográfica
 */
export interface Reference {
  source: string;
  pages?: string;
  year?: number;
  edition?: string;
}

/**
 * Monografia completa do medicamento (bulário)
 */
export interface DrugMonograph {
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
}

/**
 * Modelo principal de medicamento
 */
export interface Drug {
  id: string;
  name: string;
  classes: DrugCategory[];        // Categorias farmacológicas
  species: Species[];             // Espécies habilitadas
  presentation: DrugPresentation;
  cri: CriInfo;
  bolus?: BolusInfo;
  cautions?: Caution[];
  references?: Reference[];
  monograph?: DrugMonograph;      // Monografia completa (bulário)
  
  // Campos legados para compatibilidade (serão removidos gradualmente)
  category?: string;
  concentrations?: Array<{ value: number; unit: string; label: string }>;
  criDoses?: any[];
  bolusDoses?: any[];
  info?: any;
}

/**
 * Informações do paciente
 */
export interface Patient {
  species: Species;
  state: PatientState;
  weight: number;
  hepaticDisease: boolean;
  renalDisease: boolean;
  cardiacDisease?: boolean;
  septicShock?: boolean;
  neuroDisease?: boolean;
  pregnant?: boolean;
  lactating?: boolean;
}

/**
 * Veículo de administração
 */
export interface Vehicle {
  type: 'syringe' | 'bag';
  volume: number;
  fluid?: Fluid;
}

/**
 * Informações de dose
 */
export interface DoseInfo {
  value: number;
  unit: CriDoseUnit | BolusDoseUnit;
  isRecommended?: boolean;
}

/**
 * Resultado de cálculo
 */
export interface CalculationResult {
  volumeDrug: number;
  finalConcentration: number;
  totalDosePerHour: number;
  steps: CalculationStep[];
}

/**
 * Passo do cálculo
 */
export interface CalculationStep {
  step: number;
  description: string;
  formula: string;
  result: number;
  unit: string;
}

/**
 * Mensagem de alerta
 */
export interface AlertMessage {
  type: 'error' | 'warning' | 'info';
  message: string;
  icon?: string;
  context?: string;
}

/**
 * Informações de compatibilidade entre medicamentos
 */
export interface DrugCompatibility {
  drug1: string;
  drug2: string;
  status: CompatibilityStatus;
  notes?: string;
  conditions?: string; // Condições específicas (ex: "apenas em Y-site")
}

/**
 * Configuração de cálculo
 */
export interface CalculationConfig {
  weight: number;
  dose: DoseInfo;
  administrationType: 'cri' | 'bolus';
  infusionRate?: number;      // mL/h (apenas para CRI)
  drugConcentration: number;  // mg/mL
  finalVolume: number;        // mL
  vehicle: Vehicle;
}

/**
 * Resultado de validação
 */
export interface ValidationResult {
  isValid: boolean;
  alerts: AlertMessage[];
  warnings: AlertMessage[];
  errors: AlertMessage[];
}

/**
 * Configuração de UI
 */
export interface UIConfig {
  theme: 'light' | 'dark';
  language: 'pt-BR' | 'en-US';
  showAdvancedOptions: boolean;
  autoCalculate: boolean;
  showStepByStep: boolean;
}

/**
 * Log de auditoria
 */
export interface AuditLog {
  timestamp: Date;
  action: string;
  drugId: string;
  patientWeight: number;
  dose: DoseInfo;
  result: CalculationResult;
  userAgent?: string;
  sessionId?: string;
}
