import { Drug, CriDose, BolusDose, DrugConcentration, CriDoseUnit, BolusDoseUnit, WarningType } from '../types';

export const COMPREHENSIVE_DRUGS: Drug[] = [
  // INFUSÕES COMBINADAS (PRESETS)
  {
    id: 'mlk-combo',
    name: 'MLK (Morfina + Lidocaína + Cetamina)',
    category: 'Infusões Combinadas',
    isCombo: true,
    comboDetails: {
      targetSpecies: 'dog',
      description: 'Infusão combinada para analgesia multimodal em cães. ⚠️ GATOS: maior sensibilidade à lidocaína IV - evitar ou usar com monitorização intensiva.',
      ingredients: [
        { drugId: 'morphine', dose: 0.21, unit: CriDoseUnit.mg_kg_h },
        { drugId: 'lidocaine', dose: 3.0, unit: CriDoseUnit.mg_kg_h },
        { drugId: 'ketamine', dose: 0.6, unit: CriDoseUnit.mg_kg_h }
      ],
      presets: {
        '25%': { morphine: 0.0525, lidocaine: 0.75, ketamine: 0.15 },
        '50%': { morphine: 0.105, lidocaine: 1.5, ketamine: 0.30 },
        '75%': { morphine: 0.1575, lidocaine: 2.25, ketamine: 0.45 },
        '100%': { morphine: 0.21, lidocaine: 3.0, ketamine: 0.60 }
      },
      notes: 'Diluente: SF 0.9% (padrão) ou G5%. Evitar lidocaína com adrenalina. Boas práticas: padronizar lido 1 mg/mL; retirar volume da bolsa antes de adicionar; linha dedicada se houver incompatíveis no Y-site.'
    },
    preparationGuide: 'Para preparar infusão combinada MLK:<br/>1. Retirar volume equivalente da bolsa antes de adicionar fármacos<br/>2. Adicionar cada fármaco separadamente<br/>3. Usar linha dedicada se houver incompatibilidades<br/>4. Padronizar lidocaína em 1 mg/mL'
  },
  {
    id: 'flk-combo',
    name: 'FLK (Fentanil + Lidocaína + Cetamina)',
    category: 'Infusões Combinadas',
    isCombo: true,
    comboDetails: {
      targetSpecies: 'dog',
      description: 'Infusão combinada com fentanil para analgesia mais potente.',
      ingredients: [
        { drugId: 'fentanyl', dose: 0.0036, unit: CriDoseUnit.mg_kg_h },
        { drugId: 'lidocaine', dose: 3.0, unit: CriDoseUnit.mg_kg_h },
        { drugId: 'ketamine', dose: 0.6, unit: CriDoseUnit.mg_kg_h }
      ],
      presets: {
        '25%': { fentanyl: 0.0009, lidocaine: 0.75, ketamine: 0.15 },
        '50%': { fentanyl: 0.0018, lidocaine: 1.5, ketamine: 0.30 },
        '75%': { fentanyl: 0.0027, lidocaine: 2.25, ketamine: 0.45 },
        '100%': { fentanyl: 0.0036, lidocaine: 3.0, ketamine: 0.60 }
      },
      notes: 'Diluente: SF 0.9% ou G5%. Regras de compatibilidade da lido/ceta iguais às do MLK.'
    }
  },
  {
    id: 'dmlk-combo',
    name: 'DMLK (Dexmedetomidina + Morfina + Lidocaína + Cetamina)',
    category: 'Infusões Combinadas',
    isCombo: true,
    comboDetails: {
      targetSpecies: 'dog',
      description: 'Infusão combinada com dexmedetomidina para sedação + analgesia.',
      ingredients: [
        { drugId: 'dexmedetomidine', dose: 0.0005, unit: CriDoseUnit.mg_kg_h },
        { drugId: 'morphine', dose: 0.2, unit: CriDoseUnit.mg_kg_h },
        { drugId: 'lidocaine', dose: 3.0, unit: CriDoseUnit.mg_kg_h },
        { drugId: 'ketamine', dose: 0.6, unit: CriDoseUnit.mg_kg_h }
      ],
      presets: {
        '25%': { dexmedetomidine: 0.000125, morphine: 0.05, lidocaine: 0.75, ketamine: 0.15 },
        '50%': { dexmedetomidine: 0.00025, morphine: 0.10, lidocaine: 1.5, ketamine: 0.30 },
        '75%': { dexmedetomidine: 0.000375, morphine: 0.15, lidocaine: 2.25, ketamine: 0.45 },
        '100%': { dexmedetomidine: 0.0005, morphine: 0.20, lidocaine: 3.0, ketamine: 0.60 }
      },
      notes: 'Diluente: SF 0.9% ou G5%. Dex aceita RL, desde que os demais componentes não conflitem. GATOS: ⚠️ lido IV como acima.'
    }
  },

  // VASOATIVOS/INOTRÓPICOS
  {
    id: 'norepinephrine',
    name: 'Noradrenalina (Norepinefrina)',
    category: 'Agentes Cardiovasculares',
    concentrations: [
      { label: '4 mg/250 mL (16 µg/mL)', value: 16, unit: 'μg/mL' },
      { label: '8 mg/250 mL (32 µg/mL)', value: 32, unit: 'μg/mL' }
    ],
    criDoses: [
      {
        species: 'both',
        cri: { min: 0.05, default: 0.1, max: 2.0, unit: CriDoseUnit.mcg_kg_min },
        useCase: 'Choque distributivo - primeira linha',
        notes: 'Iniciar 0.05-0.1 µg/kg/min; titular à meta de perfusão. PROTEGER DA LUZ. Evitar Y-site com bicarbonato.'
      }
    ],
    specialWarnings: [WarningType.Photoprotection],
    preparationGuide: 'Preparo da Noradrenalina:<br/>1. Usar D5W preferencialmente (reduz oxidação)<br/>2. SF 0.9% aceitável conforme protocolo local<br/>3. PROTEGER DA LUZ (cobrir bolsa/equipo)<br/>4. Usar linha dedicada se houver incompatibilidades<br/>5. Não retirar abruptamente (desmame progressivo)',
    info: {
      indicationSummary: ['Choque distributivo', 'Hipotensão refratária'],
      mechanism: 'Vasoconstritor α1/β1 - aumenta PAM e contratilidade',
      dosesText: {
        dog: { cri: '0.05-2.0 µg/kg/min (iniciar baixo, titular)' },
        cat: { cri: '0.05-2.0 µg/kg/min (iniciar baixo, titular)' }
      },
      adjustments: {
        cardiac: 'Monitorar ECG, PAM, perfusão e diurese',
        sepsis: 'Pode necessitar doses mais altas'
      }
    }
  },
  {
    id: 'phenylephrine',
    name: 'Fenilefrina',
    category: 'Agentes Cardiovasculares',
    concentrations: [
      { label: '10 mg/250 mL (40 µg/mL)', value: 40, unit: 'μg/mL' }
    ],
    criDoses: [
      {
        species: 'both',
        cri: { min: 1.0, default: 2.0, max: 10.0, unit: CriDoseUnit.mcg_kg_min },
        useCase: 'Resgate vasoconstritor alfa-1 puro',
        notes: 'Pode reduzir DC/DO2 - usar quando outras medidas falham.'
      }
    ],
    specialWarnings: [WarningType.Photoprotection],
    info: {
      indicationSummary: ['Hipotensão refratária', 'Resgate vasoconstritor'],
      mechanism: 'Vasoconstritor α1 puro',
      dosesText: {
        dog: { cri: '1-10 µg/kg/min' },
        cat: { cri: '1-10 µg/kg/min' }
      },
      adjustments: {
        cardiac: 'Pode reduzir débito cardíaco'
      }
    }
  },
  {
    id: 'dobutamine',
    name: 'Dobutamina',
    category: 'Agentes Cardiovasculares',
    concentrations: [
      { label: '250 mg/250 mL (1000 µg/mL)', value: 1000, unit: 'μg/mL' }
    ],
    criDoses: [
      {
        species: 'dog',
        cri: { min: 2.0, default: 5.0, max: 15.0, unit: CriDoseUnit.mcg_kg_min },
        useCase: 'Inotrópico β1 - insuficiência cardíaca',
        notes: 'Corrigir volemia antes de iniciar. Descartar se solução ficar ROSA (degradação).'
      },
      {
        species: 'cat',
        cri: { min: 1.0, default: 2.5, max: 5.0, unit: CriDoseUnit.mcg_kg_min },
        useCase: 'Inotrópico β1 - insuficiência cardíaca',
        notes: '≥2.5 µg/kg/min: ↑ risco de AEs. Corrigir volemia antes de iniciar.'
      }
    ],
    info: {
      indicationSummary: ['Insuficiência cardíaca', 'Choque cardiogênico'],
      mechanism: 'Inotrópico β1 - aumenta contratilidade',
      dosesText: {
        dog: { cri: '2-15 µg/kg/min (iniciar baixo)' },
        cat: { cri: '1-5 µg/kg/min (≥2.5: ↑ risco AEs)' }
      },
      adjustments: {
        cardiac: 'Corrigir volemia antes de iniciar'
      }
    }
  },

  // ANTIBIÓTICOS
  {
    id: 'ampicillin-sulbactam',
    name: 'Ampicilina/Sulbactam',
    category: 'Antimicrobianos',
    concentrations: [
      { label: '1.5 g/100 mL (15 mg/mL)', value: 15, unit: 'mg/mL' },
      { label: '3 g/100 mL (30 mg/mL)', value: 30, unit: 'mg/mL' }
    ],
    bolusDoses: [
      {
        species: 'both',
        min: 20, max: 30, unit: BolusDoseUnit.mg_kg,
        infusionTimeMin: 30,
        useCase: 'Infecções suscetíveis - intermitente',
        notes: 'Tempo de infusão: 15-30 min (minibag) ou 5-20 min IV lento. Preferir SF 0.9% como diluente. LRS pode reduzir concentração efetiva → evitar na mesma linha.'
      }
    ],
    info: {
      indicationSummary: ['Infecções suscetíveis', 'Profilaxia cirúrgica'],
      mechanism: 'Beta-lactâmico + inibidor de beta-lactamase',
      dosesText: {
        dog: { bolus: '20-30 mg/kg IV a cada 6-8h' },
        cat: { bolus: '20-30 mg/kg IV a cada 6-8h' }
      },
      adjustments: {
        renal: 'Considerar reduzir frequência em DRC importante'
      }
    }
  },
  {
    id: 'cefazolin',
    name: 'Cefazolina',
    category: 'Antimicrobianos',
    concentrations: [
      { label: '1 g/100 mL (10 mg/mL)', value: 10, unit: 'mg/mL' }
    ],
    bolusDoses: [
      {
        species: 'both',
        min: 20, max: 25, unit: BolusDoseUnit.mg_kg,
        infusionTimeMin: 5,
        useCase: 'Profilaxia e infecções suscetíveis',
        notes: 'Beta-lactâmico tempo-dependente: permitir "Infusão estendida/CRI (Excepcional)" com justificativa T>MIC e estabilidade confirmada.'
      }
    ],
    info: {
      indicationSummary: ['Profilaxia cirúrgica', 'Infecções suscetíveis'],
      mechanism: 'Beta-lactâmico de primeira geração',
      dosesText: {
        dog: { bolus: '20-25 mg/kg IV a cada 6-8h' },
        cat: { bolus: '20-25 mg/kg IV a cada 6-8h' }
      },
      adjustments: {
        renal: 'Considerar reduzir frequência em DRC importante'
      }
    }
  },

  // GI/ANTIEMÉTICOS
  {
    id: 'metoclopramide',
    name: 'Metoclopramida',
    category: 'Diversos',
    concentrations: [
      { label: '5 mg/mL', value: 5, unit: 'mg/mL' }
    ],
    bolusDoses: [
      {
        species: 'both',
        min: 0.25, max: 0.5, unit: BolusDoseUnit.mg_kg,
        infusionTimeMin: 2,
        useCase: 'Antiemético e procinético',
        notes: 'Fotossensível (opacar). Contraindicado em obstrução/perfuração; reduzir 25-50% em DRC/hepatopatas.'
      }
    ],
    criDoses: [
      {
        species: 'both',
        cri: { min: 0.04, default: 0.06, max: 0.09, unit: CriDoseUnit.mg_kg_h },
        useCase: 'CRI antiemético/procinético',
        notes: '1-2 mg/kg/dia. Fotossensível (opacar).'
      }
    ],
    specialWarnings: [WarningType.Photoprotection],
    info: {
      indicationSummary: ['Vômito', 'Gastroparesia'],
      mechanism: 'Antagonista dopaminérgico + procinético',
      dosesText: {
        dog: { bolus: '0.25-0.5 mg/kg IV/IM/SC q8-12h', cri: '1-2 mg/kg/dia (0.04-0.09 mg/kg/h)' },
        cat: { bolus: '0.25-0.5 mg/kg IV/IM/SC q8-12h', cri: '1-2 mg/kg/dia (0.04-0.09 mg/kg/h)' }
      },
      adjustments: {
        hepatic: 'Reduzir 25-50% em hepatopatas',
        renal: 'Reduzir 25-50% em DRC'
      }
    }
  },

  // DIURÉTICO
  {
    id: 'furosemide',
    name: 'Furosemida',
    category: 'Diversos',
    concentrations: [
      { label: '10 mg/mL', value: 10, unit: 'mg/mL' }
    ],
    bolusDoses: [
      {
        species: 'both',
        min: 1.0, max: 4.0, unit: BolusDoseUnit.mg_kg,
        infusionTimeMin: 2,
        useCase: 'Diurético de alça',
        notes: 'Repetir conforme resposta. Monitorar eletrólitos (K+/Na+), função renal e balanço hídrico.'
      }
    ],
    criDoses: [
      {
        species: 'both',
        cri: { min: 0.66, default: 0.8, max: 1.0, unit: CriDoseUnit.mg_kg_h },
        useCase: 'CRI pós-bólus',
        notes: 'CRI pós-bólus: 0.66-1 mg/kg/h. Monitorar eletrólitos.'
      }
    ],
    info: {
      indicationSummary: ['Edema pulmonar', 'Insuficiência cardíaca'],
      mechanism: 'Diurético de alça - inibe Na+/K+/2Cl-',
      dosesText: {
        dog: { bolus: '1-4 mg/kg IV/IM', cri: '0.66-1 mg/kg/h pós-bólus' },
        cat: { bolus: '1-4 mg/kg IV/IM', cri: '0.66-1 mg/kg/h pós-bólus' }
      },
      adjustments: {
        renal: 'Monitorar função renal e eletrólitos'
      }
    }
  },

  // ENDÓCRINO/ELETRÓLITOS
  {
    id: 'insulin-regular',
    name: 'Insulina Regular (DKA)',
    category: 'Endócrino',
    concentrations: [
      { label: '2.2 U/250 mL (0.0088 U/mL)', value: 0.0088, unit: 'U/mL' }
    ],
    criDoses: [
      {
        species: 'both',
        cri: { min: 0.05, default: 0.1, max: 0.1, unit: CriDoseUnit.U_kg_h },
        useCase: 'Cetoacidose diabética',
        notes: 'Alvo comum: 0.1 U/kg/h. PRIMAR e DESCARTAR 20-50 mL da linha (adsorção). Monitorar K+, P, Na+ e hidratação.'
      }
    ],
    preparationGuide: 'Preparo da Insulina Regular para DKA:<br/>1. Adicionar 2.2 U/kg à bolsa de 240-250 mL SF 0.9%<br/>2. PRIMAR e DESCARTAR 20-50 mL da linha (adsorção)<br/>3. Início: 10 mL/h como ponto de partida<br/>4. Meta de queda glicêmica 50-100 mg/dL/h<br/>5. Usar linha exclusiva<br/>6. Monitorar K+, P, Na+ e hidratação',
    info: {
      indicationSummary: ['Cetoacidose diabética', 'Hiperglicemia severa'],
      mechanism: 'Insulina de ação rápida',
      dosesText: {
        dog: { cri: '0.05-0.1 U/kg/h (ajustar conforme glicemia)' },
        cat: { cri: '0.05-0.1 U/kg/h (ajustar conforme glicemia)' }
      },
      adjustments: {
        renal: 'Monitorar K+ rigorosamente'
      }
    }
  },

  // NMBAs
  {
    id: 'rocuronium',
    name: 'Rocurônio',
    category: 'Bloqueadores Neuromusculares',
    concentrations: [
      { label: '10 mg/mL', value: 10, unit: 'mg/mL' }
    ],
    bolusDoses: [
      {
        species: 'both',
        min: 0.5, max: 0.6, unit: BolusDoseUnit.mg_kg,
        infusionTimeMin: 30,
        useCase: 'Bloqueio neuromuscular',
        notes: 'Requisitos: VM + TOF. NÃO produzem sedação/analgesia.'
      }
    ],
    criDoses: [
      {
        species: 'both',
        cri: { min: 0.15, default: 0.2, max: 0.25, unit: CriDoseUnit.mg_kg_h },
        useCase: 'CRI para bloqueio prolongado',
        notes: 'Compatível com SF/RL/G5% (estável em até 5 mg/mL por 24h).'
      }
    ],
    specialWarnings: [WarningType.VentilatorySupport],
    info: {
      indicationSummary: ['Bloqueio neuromuscular', 'Ventilação mecânica'],
      mechanism: 'Bloqueador neuromuscular não-despolarizante',
      dosesText: {
        dog: { bolus: '0.5-0.6 mg/kg IV', cri: '~0.2 mg/kg/h' },
        cat: { bolus: '0.5-0.6 mg/kg IV', cri: '~0.2 mg/kg/h' }
      },
      adjustments: {
        hepatic: 'Metabolismo hepático - pode prolongar duração'
      }
    }
  }
];

// COMPATIBILIDADE SEMÁFORO
export const COMPATIBILITY_MATRIX = {
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
  }
};

// FÓRMULAS E EXEMPLOS
export const FORMULAS = {
  universal: 'mL/h = (Dose × Peso × 60) / Concentração',
  conversion: '10 µg/kg/min = 0.6 mg/kg/h',
  volumeTime: 'mL/h = Volume ÷ Tempo; mg a adicionar = (mg/kg/h × kg × Tempo)'
};

export const EXAMPLES = [
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
  }
];
