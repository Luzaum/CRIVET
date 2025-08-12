import { Drug, CriDose, BolusDose, DrugConcentration, CriDoseUnit, BolusDoseUnit, WarningType } from '../types';

export const EXPANDED_DRUGS: Drug[] = [
  // VASOPRESSINA
  {
    id: 'vasopressin',
    name: 'Vasopressina',
    category: 'Agentes Cardiovasculares',
    concentrations: [
      { label: '20 U/250 mL (0.08 U/mL)', value: 0.08, unit: 'U/mL' }
    ],
    criDoses: [
      {
        species: 'both',
        cri: { min: 0.5, default: 2.0, max: 5.0, unit: CriDoseUnit.mU_kg_min },
        useCase: 'Choque distributivo/vasoplegia',
        notes: 'Linha dedicada. Evitar bicarbonato no Y-site. Desmame lento.'
      }
    ],
    info: {
      indicationSummary: ['Choque distributivo', 'Vasoplegia'],
      mechanism: 'Vasoconstritor V1 - aumenta resistência vascular sistêmica',
      dosesText: {
        dog: { cri: '0.5-5 mU/kg/min' },
        cat: { cri: '0.5-5 mU/kg/min' }
      },
      adjustments: {
        hepatic: 'Sem ajuste claro; monitor perfusão/diurese',
        renal: 'Sem ajuste claro; monitor perfusão/diurese'
      }
    }
  },

  // AMIODARONA
  {
    id: 'amiodarone',
    name: 'Amiodarona',
    category: 'Agentes Cardiovasculares',
    concentrations: [
      { label: '900 mg/500 mL (1.8 mg/mL)', value: 1.8, unit: 'mg/mL' }
    ],
    criDoses: [
      {
        species: 'both',
        cri: { min: 10, default: 12.5, max: 15, unit: CriDoseUnit.mcg_kg_min },
        useCase: 'Taquiarritmias - manutenção',
        notes: 'Após carga de 5 mg/kg (20-60 min). D5W; filtro in-line; linha dedicada.'
      }
    ],
    bolusDoses: [
      {
        species: 'both',
        min: 5, max: 5, unit: BolusDoseUnit.mg_kg,
        infusionTimeMin: 60,
        useCase: 'Carga para taquiarritmias',
        notes: 'Infundir em 20-60 min. Hipotensão se infundir rápido.'
      }
    ],
    info: {
      indicationSummary: ['Taquiarritmias', 'Fibrilação atrial'],
      mechanism: 'Bloqueador de canais múltiplos (K+, Na+, Ca++)',
      dosesText: {
        dog: { bolus: '5 mg/kg (20-60 min)', cri: '10-15 µg/kg/min' },
        cat: { bolus: '5 mg/kg (20-60 min)', cri: '10-15 µg/kg/min' }
      },
      adjustments: {
        hepatic: 'Hepatotox/T4; monitor LFTs',
        cardiac: 'ECG/PA; risco hipotensão'
      }
    }
  },

  // NICARDIPINA
  {
    id: 'nicardipine',
    name: 'Nicardipina',
    category: 'Agentes Cardiovasculares',
    concentrations: [
      { label: '25 mg/250 mL (0.1 mg/mL)', value: 0.1, unit: 'mg/mL' }
    ],
    criDoses: [
      {
        species: 'both',
        cri: { min: 1, default: 3, max: 5, unit: CriDoseUnit.mcg_kg_min },
        useCase: 'Emergência hipertensiva',
        notes: 'D5W/SF; proteger da luz. Evitar soluções alcalinas.'
      }
    ],
    specialWarnings: [WarningType.Photoprotection],
    info: {
      indicationSummary: ['Emergência hipertensiva', 'Hipertensão refratária'],
      mechanism: 'Bloqueador de canais de cálcio diidropiridínico',
      dosesText: {
        dog: { cri: '1-5 µg/kg/min' },
        cat: { cri: '1-5 µg/kg/min' }
      },
      adjustments: {
        cardiac: 'Monitor PA/FC; risco hipotensão/taquicardia'
      }
    }
  },

  // MILRINONA
  {
    id: 'milrinone',
    name: 'Milrinona',
    category: 'Agentes Cardiovasculares',
    concentrations: [
      { label: '10 mg/100 mL (0.1 mg/mL)', value: 0.1, unit: 'mg/mL' }
    ],
    criDoses: [
      {
        species: 'both',
        cri: { min: 0.3, default: 0.5, max: 1.0, unit: CriDoseUnit.mcg_kg_min },
        useCase: 'IC refratária',
        notes: 'Após carga opcional de 50 µg/kg. D5W/SF. Evitar Y-site com furosemida.'
      }
    ],
    bolusDoses: [
      {
        species: 'both',
        min: 0.05, max: 0.05, unit: BolusDoseUnit.mg_kg,
        infusionTimeMin: 10,
        useCase: 'Carga opcional para IC',
        notes: 'Carga de 50 µg/kg em 10 min (opcional).'
      }
    ],
    info: {
      indicationSummary: ['Insuficiência cardíaca refratária'],
      mechanism: 'Inibidor da fosfodiesterase III - inotrópico e vasodilatador',
      dosesText: {
        dog: { bolus: '50 µg/kg (opcional)', cri: '0.3-1 µg/kg/min' },
        cat: { bolus: '50 µg/kg (opcional)', cri: '0.3-1 µg/kg/min' }
      },
      adjustments: {
        cardiac: 'PA/ECG; risco hipotensão/arrítmias'
      }
    }
  },

  // LIDOCAÍNA (ANTIARRÍTMICA)
  {
    id: 'lidocaine-antiarrhythmic',
    name: 'Lidocaína (Antiarritmica)',
    category: 'Agentes Cardiovasculares',
    concentrations: [
      { label: '2 g/250 mL (8 mg/mL)', value: 8, unit: 'mg/mL' }
    ],
    criDoses: [
      {
        species: 'dog',
        cri: { min: 25, default: 50, max: 75, unit: CriDoseUnit.mcg_kg_min },
        useCase: 'Arritmias ventriculares',
        notes: 'Após carga de 2 mg/kg (repetir até 8 mg/kg total). SF. PROIBIR "com adrenalina".'
      }
    ],
    bolusDoses: [
      {
        species: 'dog',
        min: 2, max: 2, unit: BolusDoseUnit.mg_kg,
        infusionTimeMin: 2,
        useCase: 'Carga para arritmias',
        notes: 'Repetir até 8 mg/kg total se necessário. Gatos: evitar dose de cão.'
      }
    ],
    info: {
      indicationSummary: ['Arritmias ventriculares', 'Taquicardia ventricular'],
      mechanism: 'Bloqueador de canais de sódio classe Ib',
      dosesText: {
        dog: { bolus: '2 mg/kg (repetir até 8)', cri: '25-75 µg/kg/min' },
        cat: { bolus: 'Evitar dose de cão', cri: 'Evitar dose de cão' }
      },
      adjustments: {
        cardiac: 'ECG; neurotoxicidade',
        hepatic: 'Metabolismo hepático - reduzir em hepatopatas'
      }
    }
  },

  // ESMOLOL
  {
    id: 'esmolol',
    name: 'Esmolol',
    category: 'Agentes Cardiovasculares',
    concentrations: [
      { label: '2.5 g/250 mL (10 mg/mL)', value: 10, unit: 'mg/mL' }
    ],
    criDoses: [
      {
        species: 'both',
        cri: { min: 25, default: 100, max: 200, unit: CriDoseUnit.mcg_kg_min },
        useCase: 'Taquiarritmias/controle FC',
        notes: 'Após carregamento de 50-200 µg/kg/min por 5-10 min. SF.'
      }
    ],
    info: {
      indicationSummary: ['Taquiarritmias', 'Controle de frequência cardíaca'],
      mechanism: 'Bloqueador β1-adrenérgico ultrarrápido',
      dosesText: {
        dog: { cri: '25-200 µg/kg/min' },
        cat: { cri: '25-200 µg/kg/min' }
      },
      adjustments: {
        cardiac: 'ECG/PA. Evitar em IC descompensada'
      }
    }
  },

  // DILTIAZEM
  {
    id: 'diltiazem',
    name: 'Diltiazem',
    category: 'Agentes Cardiovasculares',
    concentrations: [
      { label: '125 mg/250 mL (0.5 mg/mL)', value: 0.5, unit: 'mg/mL' }
    ],
    criDoses: [
      {
        species: 'both',
        cri: { min: 3, default: 8, max: 15, unit: CriDoseUnit.mcg_kg_min },
        useCase: 'FA/SVTa',
        notes: 'Após carga de 0.25 mg/kg. D5W/SF.'
      }
    ],
    bolusDoses: [
      {
        species: 'both',
        min: 0.25, max: 0.25, unit: BolusDoseUnit.mg_kg,
        infusionTimeMin: 2,
        useCase: 'Carga para FA/SVTa',
        notes: 'Carga de 0.25 mg/kg.'
      }
    ],
    info: {
      indicationSummary: ['Fibrilação atrial', 'Taquicardia supraventricular'],
      mechanism: 'Bloqueador de canais de cálcio não-dihidropiridínico',
      dosesText: {
        dog: { bolus: '0.25 mg/kg', cri: '3-15 µg/kg/min' },
        cat: { bolus: '0.25 mg/kg', cri: '3-15 µg/kg/min' }
      },
      adjustments: {
        cardiac: 'ECG/PA; bloqueios AV/bradicardia; cautela com β-bloq'
      }
    }
  },

  // PROCAINAMIDA
  {
    id: 'procainamide',
    name: 'Procainamida',
    category: 'Agentes Cardiovasculares',
    concentrations: [
      { label: '1 g/250 mL (4 mg/mL)', value: 4, unit: 'mg/mL' }
    ],
    criDoses: [
      {
        species: 'both',
        cri: { min: 20, default: 35, max: 50, unit: CriDoseUnit.mcg_kg_min },
        useCase: 'Arritmias ventriculares',
        notes: 'Após carga de 6-8 mg/kg. SF.'
      }
    ],
    bolusDoses: [
      {
        species: 'both',
        min: 6, max: 8, unit: BolusDoseUnit.mg_kg,
        infusionTimeMin: 5,
        useCase: 'Carga para arritmias',
        notes: 'Carga de 6-8 mg/kg.'
      }
    ],
    info: {
      indicationSummary: ['Arritmias ventriculares', 'Taquicardia ventricular'],
      mechanism: 'Bloqueador de canais de sódio classe Ia',
      dosesText: {
        dog: { bolus: '6-8 mg/kg', cri: '20-50 µg/kg/min' },
        cat: { bolus: '6-8 mg/kg', cri: '20-50 µg/kg/min' }
      },
      adjustments: {
        cardiac: 'ECG/QRS/QT; hipotensão',
        renal: 'Ajuste em DRC'
      }
    }
  },

  // AMICACINA
  {
    id: 'amikacin',
    name: 'Amicacina',
    category: 'Antimicrobianos',
    concentrations: [
      { label: '500 mg/100 mL (5 mg/mL)', value: 5, unit: 'mg/mL' }
    ],
    bolusDoses: [
      {
        species: 'dog',
        min: 15, max: 20, unit: BolusDoseUnit.mg_kg,
        infusionTimeMin: 30,
        useCase: 'Infecções Gram-negativas',
        notes: 'q24h. Linha dedicada longe de β-lactâmicos. NÃO CRI de rotina.'
      },
      {
        species: 'cat',
        min: 10, max: 15, unit: BolusDoseUnit.mg_kg,
        infusionTimeMin: 30,
        useCase: 'Infecções Gram-negativas',
        notes: 'q24-48h. Linha dedicada longe de β-lactâmicos. NÃO CRI de rotina.'
      }
    ],
    info: {
      indicationSummary: ['Infecções Gram-negativas', 'Pseudomonas'],
      mechanism: 'Aminoglicosídeo - inibe síntese proteica bacteriana',
      dosesText: {
        dog: { bolus: '15-20 mg/kg q24h' },
        cat: { bolus: '10-15 mg/kg q24-48h' }
      },
      adjustments: {
        renal: 'Monitor renal/ototox; ajustar em DRC'
      }
    }
  },

  // HIDROMORFONA
  {
    id: 'hydromorphone',
    name: 'Hidromorfona',
    category: 'Analgésicos e Anestésicos',
    concentrations: [
      { label: '2 mg/100 mL (0.02 mg/mL)', value: 0.02, unit: 'mg/mL' }
    ],
    criDoses: [
      {
        species: 'both',
        cri: { min: 0.01, default: 0.03, max: 0.06, unit: CriDoseUnit.mg_kg_h },
        useCase: 'Analgesia',
        notes: 'SF/D5W. Sedação/FR/ETCO2; náusea.'
      }
    ],
    info: {
      indicationSummary: ['Analgesia', 'Dor moderada a severa'],
      mechanism: 'Agonista opioide μ - analgesia e sedação',
      dosesText: {
        dog: { cri: '0.01-0.06 mg/kg/h' },
        cat: { cri: '0.01-0.06 mg/kg/h' }
      },
      adjustments: {
        hepatic: 'Metabolismo hepático - reduzir em hepatopatas',
        geriatric: 'Idosos mais sensíveis - reduzir dose'
      }
    }
  },

  // METADONA
  {
    id: 'methadone',
    name: 'Metadona',
    category: 'Analgésicos e Anestésicos',
    concentrations: [
      { label: '10 mg/100 mL (0.1 mg/mL)', value: 0.1, unit: 'mg/mL' }
    ],
    criDoses: [
      {
        species: 'dog',
        cri: { min: 0.1, default: 0.2, max: 0.3, unit: CriDoseUnit.mg_kg_h },
        useCase: 'Analgesia',
        notes: 'SF/D5W. Hepato/idosos: reduzir.'
      },
      {
        species: 'cat',
        cri: { min: 0.05, default: 0.1, max: 0.15, unit: CriDoseUnit.mg_kg_h },
        useCase: 'Analgesia',
        notes: 'SF/D5W. Usar limite baixo. Hepato/idosos: reduzir.'
      }
    ],
    info: {
      indicationSummary: ['Analgesia', 'Dor moderada a severa'],
      mechanism: 'Agonista opioide μ + antagonista NMDA',
      dosesText: {
        dog: { cri: '0.1-0.3 mg/kg/h' },
        cat: { cri: '0.05-0.15 mg/kg/h (limite baixo)' }
      },
      adjustments: {
        hepatic: 'Metabolismo hepático - reduzir em hepatopatas',
        geriatric: 'Idosos mais sensíveis - reduzir dose'
      }
    }
  },

  // BUPRENORFINA
  {
    id: 'buprenorphine',
    name: 'Buprenorfina',
    category: 'Analgésicos e Anestésicos',
    concentrations: [
      { label: '0.3 mg/100 mL (0.003 mg/mL)', value: 0.003, unit: 'mg/mL' }
    ],
    criDoses: [
      {
        species: 'both',
        cri: { min: 1, default: 3, max: 5, unit: CriDoseUnit.mcg_kg_h },
        useCase: 'Analgesia suave/moderada',
        notes: 'SF/D5W. Agonista parcial → teto analgésico.'
      }
    ],
    info: {
      indicationSummary: ['Analgesia suave/moderada'],
      mechanism: 'Agonista parcial opioide μ - teto analgésico',
      dosesText: {
        dog: { cri: '1-5 µg/kg/h' },
        cat: { cri: '1-5 µg/kg/h' }
      },
      adjustments: {
        hepatic: 'Metabolismo hepático - reduzir em hepatopatas',
        pediatric: 'Neonatos - reduzir dose'
      }
    }
  },

  // BUTORFANOL
  {
    id: 'butorphanol',
    name: 'Butorfanol',
    category: 'Analgésicos e Anestésicos',
    concentrations: [
      { label: '10 mg/100 mL (0.1 mg/mL)', value: 0.1, unit: 'mg/mL' }
    ],
    criDoses: [
      {
        species: 'both',
        cri: { min: 0.1, default: 0.25, max: 0.4, unit: CriDoseUnit.mg_kg_h },
        useCase: 'Sedoanalgesia leve',
        notes: 'SF/D5W. Analgesia limitada para dor intensa.'
      }
    ],
    info: {
      indicationSummary: ['Sedoanalgesia leve'],
      mechanism: 'Agonista-antagonista opioide - sedação e analgesia leve',
      dosesText: {
        dog: { cri: '0.1-0.4 mg/kg/h' },
        cat: { cri: '0.1-0.4 mg/kg/h' }
      },
      adjustments: {
        hepatic: 'Hepático/idosos/gatos: iniciar baixo',
        geriatric: 'Idosos: iniciar baixo',
        cat: 'Gatos: iniciar baixo'
      }
    }
  },


];

// EXPANDED COMPATIBILITY MATRIX
export const EXPANDED_COMPATIBILITY_MATRIX = {
  'lidocaine': {
    '🟢': ['morphine', 'fentanyl', 'ketamine', 'midazolam', 'metoclopramida', 'ondansetrona', 'KCl', 'verapamil'],
    '🟡': ['propofol'],
    '🔴': ['dopamine', 'epinephrine', 'norepinephrine', 'ampicillin', 'cefazolin', 'diazepam', 'pantoprazole', 'pentobarbital', 'SMX-TMP']
  },
  'ketamine': {
    '🟢': ['morphine', 'MgSO4', 'dobutamine', 'epinephrine', 'cefazolin', 'penicillin', 'KCl', 'propofol', 'ranitidine'],
    '🔴': ['ampicillin', 'dexamethasone', 'furosemide', 'heparin', 'insulin', 'bicarbonate', 'diazepam', 'barbiturates']
  },
  'morphine': {
    '🟢': ['SF 0.9%', 'G5%', 'Ringer/RL'],
    '🟡': ['ampicillin-sulbactam', 'diazepam', 'furosemida', 'insulin', 'pantoprazole', 'propofol', 'SMX-TMP'],
    '🔴': ['amphotericin B', 'barbiturates', 'heparin', 'bicarbonate', 'phenytoin', 'dantrolene', 'cloxacillin']
  },
  'dexmedetomidine': {
    '🟢': ['SF 0.9%', 'G5%', 'RL'],
    '🔴': ['diazepam', 'pantoprazole', 'amphotericin B', 'blood/plasma']
  },
  'fentanyl': {
    '🟢': ['SF 0.9%', 'G5%', 'ketamine'],
    '🟡': ['propofol', 'midazolam'],
    '🔴': ['barbiturates', 'heparin']
  },
  'vasopressin': {
    '🟢': ['SF 0.9%', 'G5%'],
    '🔴': ['bicarbonate', 'dopamine', 'epinephrine']
  },
  'amiodarone': {
    '🟢': ['SF 0.9%', 'G5%'],
    '🔴': ['heparin', 'bicarbonate', 'insulin']
  },
  'milrinone': {
    '🟢': ['SF 0.9%', 'G5%'],
    '🔴': ['furosemida', 'insulin']
  }
};

// EXPANDED FORMULAS
export const EXPANDED_FORMULAS = {
  universal: 'mL/h = (Dose × Peso × 60) / Concentração',
  conversion: '10 µg/kg/min = 0.6 mg/kg/h',
  volumeTime: 'mL/h = Volume ÷ Tempo; mg a adicionar = (mg/kg/h × kg × Tempo)',
  bolusToCRI: 'CRI = (Bolus × Frequência) / 24',
  criToBolus: 'Bolus = (CRI × 24) / Frequência'
};

// EXPANDED EXAMPLES
export const EXPANDED_EXAMPLES = [
  {
    title: 'Noradrenalina',
    description: '16 µg/mL, 20 kg, 0.5 µg/kg/min',
    calculation: '0.5×20=10 µg/min → 600 µg/h → 600/16 = 37.5 mL/h'
  },
  {
    title: 'Nitroprussiato',
    description: '50 µg/mL, 25 kg, 2 µg/kg/min',
    calculation: '2×25=50 µg/min → 3000 µg/h → 3000/50 = 60 mL/h'
  },
  {
    title: 'Metoclopramida CRI',
    description: '1 mg/kg/dia (0.042 mg/kg/h), 10 kg, sol. 1 mg/mL',
    calculation: '0.42 mg/h → 0.42 mL/h'
  },
  {
    title: 'Amiodarona',
    description: '1.8 mg/mL, 15 kg, 12.5 µg/kg/min',
    calculation: '12.5×15=187.5 µg/min → 11250 µg/h → 11250/1800 = 6.25 mL/h'
  },
  {
    title: 'Vasopressina',
    description: '0.08 U/mL, 10 kg, 2 mU/kg/min',
    calculation: '2×10=20 mU/min → 1200 mU/h → 1200/80 = 15 mL/h'
  }
];

// TOOLTIPS EXPLANATIONS
export const TOOLTIPS = {
  slider: 'Slider 25/50/75/100%: aplica fator sobre a taxa-alvo (100%). Use 25-50% para pacientes instáveis/geriátricos; 75-100% para dor mais intensa com monitorização próxima.',
  lidocaineCats: 'Por que evitar lidocaína IV em gatos?: maior sensibilidade do SNC/CV → risco de neuro/cardiotoxicidade. Prefira analgesia sem lido ou com monitorização intensiva.',
  catecholamines: 'Por que catecolaminas em linha dedicada?: pH/estabilidade e reatividade química aumentam incompatibilidades (ex.: com lidocaína); linhas exclusivas reduzem falhas/precipitados.',
  tmic: 'O que é T>MIC?: tempo da concentração do antibiótico acima da CMI do patógeno. Beta-lactâmicos dependem de T>MIC — infusão estendida aumenta o tempo eficaz quando estável.',
  ceftriaxone: 'Por que evitar Ceftriaxona + cálcio (RL)?: risco de precipitado insolúvel em Y-site/mesma linha; usar SF/D5W e evitar co-infusão com cálcio.',
  insulinPriming: 'Priming de insulina: insulina adere ao equipamento; descartar 20-50 mL da linha satura o sistema e garante dose real ao paciente.',
  dedicatedLine: 'Quando usar linha dedicada?: 1) emulsões lipídicas (propofol), 2) catecolaminas, 3) qualquer combinação com status 🔴 no semáforo, 4) quando preparo/estabilidade forem incertos.',
  diluents: 'Diluentes — por que SF é padrão?: pH/ionicidade estáveis e ampla compatibilidade; G5% útil para alguns vasodilatadores/nitroprussiato; RL contém cálcio (interage com ceftriaxona).'
};

// COMORBIDITY ADJUSTMENTS
export const COMORBIDITY_ADJUSTMENTS = {
  renal: {
    description: 'Preferir reduzir dose total/dilatar intervalos (aminoglicosídeos/β-lactâmicos; risco de acúmulo)',
    examples: ['Aminoglicosídeos: reduzir frequência', 'β-lactâmicos: ajustar intervalo', 'Opioides: reduzir 25-50%']
  },
  hepatic: {
    description: 'Iniciar em dose baixa (benzodiazepínicos/opioides/vecurônio); titular por efeito',
    examples: ['Benzodiazepínicos: reduzir 25-50%', 'Opioides: reduzir 25-50%', 'Vecurônio: reduzir dose']
  },
  cardiac: {
    description: 'Evitar quedas bruscas de PA; titular lido/ketamina/dex com cautela',
    examples: ['Vasodilatadores: titular cuidadosamente', 'Lidocaína: monitor ECG', 'Dexmedetomidina: reduzir dose']
  },
  sepsis: {
    description: 'Foco e hemodinâmica priorizados; NE primeira linha; cuidado com fluidos excessivos',
    examples: ['Noradrenalina: primeira linha', 'Fluidos: cautela com excesso', 'Antibióticos: dose total']
  },
  pediatric: {
    description: '↑ sensibilidade; começar baixo e subir devagar',
    examples: ['Opioides: reduzir 25-50%', 'Sedativos: reduzir 25-50%', 'Antibióticos: ajustar por peso']
  },
  geriatric: {
    description: '↑ sensibilidade; começar baixo e subir devagar',
    examples: ['Opioides: reduzir 25-50%', 'Sedativos: reduzir 25-50%', 'Cardiovasculares: titular cuidadosamente']
  },
  pregnancy: {
    description: 'Minimizar exposição; preferir drogas seguras, avaliar risco/benefício e consultar referências',
    examples: ['Evitar teratogênicos', 'Preferir drogas seguras', 'Consultar referências']
  },
  lactation: {
    description: 'Minimizar exposição; preferir drogas seguras, avaliar risco/benefício e consultar referências',
    examples: ['Evitar drogas que passam no leite', 'Preferir drogas seguras', 'Consultar referências']
  }
};

// CHECKLISTS
export const CHECKLISTS = {
  start: [
    'Bólus vs CRI definido',
    'Comorbidades marcadas',
    'Diluente correto',
    'Y-site (semáforo)',
    'Concentração/preset ok',
    'Rótulo/BUD',
    'Proteção de luz',
    'Priming especial (insulina)',
    'Bomba configurada',
    'Monitoração ativa'
  ],
  during: [
    'Reavaliar metas/fluxo',
    'Cor/precipitado',
    'Eletrólitos',
    'Efeitos adversos',
    'Diurese/PA/ECG'
  ],
  end: [
    'Estratégia de desmame',
    'Lavar linhas/portas',
    'Doses totais registradas',
    'Plano VO/IM/PO'
  ]
};
