/**
 * Enums centralizados para o sistema CRIVET
 * Modelo de dados mais robusto e type-safe
 */

export enum Species {
  Canine = 'canine',
  Feline = 'feline'
}

export enum UnitFamily {
  MASS_PER_MASS_PER_TIME = 'mass_per_mass_per_time', // mg/kg/h, mcg/kg/min
  MASS_PER_MASS = 'mass_per_mass',                   // mg/kg, mcg/kg
  MASS_PER_VOL = 'mass_per_vol',                     // mg/mL, mcg/mL
  VOLUME = 'volume',                                 // mL, L
  TIME = 'time',                                     // h, min
  RATE = 'rate'                                      // mL/h, mL/min
}

export enum CriDoseUnit {
  MCG_KG_MIN = 'mcg/kg/min',
  MCG_KG_H = 'mcg/kg/h',
  MG_KG_MIN = 'mg/kg/min',
  MG_KG_H = 'mg/kg/h',
  MG_KG_DAY = 'mg/kg/dia',
  U_KG_H = 'U/kg/h',
  MU_KG_MIN = 'mU/kg/min',
}

export enum BolusDoseUnit {
  MCG_KG = 'mcg/kg',
  MG_KG = 'mg/kg',
  U_KG = 'U/kg',
}

export enum Fluid {
  D5W = 'SG 5%',
  NS = 'NaCl 0.9%',
  LR = 'Ringer Lactato',
}

export enum WarningLevel {
  Info = 'info',
  Caution = 'caution',
  Danger = 'danger',
}

export enum PatientState {
  Young = 'young',
  Adult = 'adult',
  Senior = 'senior',
}

export enum AdministrationType {
  CRI = 'cri',
  Bolus = 'bolus',
}

export enum VehicleType {
  Syringe = 'syringe',
  Bag = 'bag',
}

export enum DrugCategory {
  Vasopressor = 'vasopressor',
  Sedative = 'sedative',
  Analgesic = 'analgesic',
  Anticonvulsant = 'anticonvulsant',
  Antibiotic = 'antibiotic',
  Antiarrhythmic = 'antiarrhythmic',
  Diuretic = 'diuretic',
  Bronchodilator = 'bronchodilator',
  Anesthetic = 'anesthetic',
}

export enum CompatibilityStatus {
  Compatible = 'compatible',
  Caution = 'caution',
  Incompatible = 'incompatible',
}

export enum LightSensitivity {
  None = 'none',
  Moderate = 'moderate',
  High = 'high',
}

export enum Stability {
  Stable = 'stable',
  Limited = 'limited',
  Unstable = 'unstable',
}
