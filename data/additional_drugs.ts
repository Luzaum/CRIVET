import { Drug, CriDose, BolusDose, DrugConcentration, CriDoseUnit, BolusDoseUnit, WarningType } from '../types';

export const ADDITIONAL_DRUGS: Drug[] = [
  // ANTIBIÓTICOS ADICIONAIS
  {
    id: 'ceftriaxone',
    name: 'Ceftriaxona',
    category: 'Antimicrobianos',
    concentrations: [
      { label: '1 g/100 mL (10 mg/mL)', value: 10, unit: 'mg/mL' }
    ],
    bolusDoses: [
      {
        species: 'both',
        min: 20, max: 30, unit: BolusDoseUnit.mg_kg,
        infusionTimeMin: 30,
        useCase: 'Infecções suscetíveis - intermitente',
        notes: 'PROIBIDO com cálcio/RL (mesma linha/Y-site). Diluentes: SF/D5W. Lacunas contra enterococos, MRSA/MRSP, ESBL/AmpC.'
      }
    ],
    info: {
      indicationSummary: ['Infecções suscetíveis', 'Profilaxia cirúrgica'],
      mechanism: 'Beta-lactâmico de terceira geração',
      dosesText: {
        dog: { bolus: '20-30 mg/kg IV a cada 12-24h' },
        cat: { bolus: '20-30 mg/kg IV a cada 12-24h' }
      },
      adjustments: {
        renal: 'Considerar reduzir frequência em DRC importante'
      }
    }
  },

  {
    id: 'clindamycin',
    name: 'Clindamicina',
    category: 'Antimicrobianos',
    concentrations: [
      { label: '150 mg/100 mL (1.5 mg/mL)', value: 1.5, unit: 'mg/mL' }
    ],
    bolusDoses: [
      {
        species: 'both',
        min: 10, max: 15, unit: BolusDoseUnit.mg_kg,
        infusionTimeMin: 30,
        useCase: 'Infecções anaeróbias e Gram+',
        notes: 'Não administrar em bólus não diluído. Compatível com SF/D5W/RL. Prolonga t1/2 em DRC/hepato.'
      }
    ],
    info: {
      indicationSummary: ['Infecções anaeróbias', 'Infecções Gram+'],
      mechanism: 'Lincosamida - inibe síntese proteica bacteriana',
      dosesText: {
        dog: { bolus: '10-15 mg/kg IV a cada 8-12h' },
        cat: { bolus: '10-15 mg/kg IV a cada 8-12h' }
      },
      adjustments: {
        renal: 'Reduzir frequência em DRC',
        hepatic: 'Reduzir frequência em hepatopatas'
      }
    }
  },

  {
    id: 'metronidazole',
    name: 'Metronidazol',
    category: 'Antimicrobianos',
    concentrations: [
      { label: '500 mg/100 mL (5 mg/mL)', value: 5, unit: 'mg/mL' }
    ],
    bolusDoses: [
      {
        species: 'both',
        min: 10, max: 15, unit: BolusDoseUnit.mg_kg,
        infusionTimeMin: 30,
        useCase: 'Infecções anaeróbias',
        notes: 'Estável pH 2-9; compatível com SF/D5W/Ringer/RL. Preferir isolado.'
      }
    ],
    info: {
      indicationSummary: ['Infecções anaeróbias', 'Giardíase'],
      mechanism: 'Nitroimidazol - inibe síntese de DNA bacteriano',
      dosesText: {
        dog: { bolus: '10-15 mg/kg IV a cada 8-12h' },
        cat: { bolus: '10-15 mg/kg IV a cada 8-12h' }
      },
      adjustments: {
        hepatic: 'Reduzir dose em hepatopatas'
      }
    }
  },

  {
    id: 'imipenem-cilastatin',
    name: 'Imipenem/Cilastatina',
    category: 'Antimicrobianos',
    concentrations: [
      { label: '500 mg/100 mL (5 mg/mL)', value: 5, unit: 'mg/mL' }
    ],
    bolusDoses: [
      {
        species: 'both',
        min: 10, max: 15, unit: BolusDoseUnit.mg_kg,
        infusionTimeMin: 30,
        useCase: 'Infecções MDR/ESBL',
        notes: 'Uso restrito após cultura. Não admixar com outras drogas. Ajustar em DRC (risco convulsões).'
      }
    ],
    info: {
      indicationSummary: ['Infecções MDR', 'Infecções ESBL'],
      mechanism: 'Carbapenem - inibe síntese da parede celular',
      dosesText: {
        dog: { bolus: '10-15 mg/kg IV a cada 6-8h' },
        cat: { bolus: '10-15 mg/kg IV a cada 6-8h' }
      },
      adjustments: {
        renal: 'Reduzir dose em DRC (risco convulsões)'
      }
    }
  },

  {
    id: 'piperacillin-tazobactam',
    name: 'Piperacilina/Tazobactam',
    category: 'Antimicrobianos',
    concentrations: [
      { label: '4.5 g/100 mL (45 mg/mL)', value: 45, unit: 'mg/mL' }
    ],
    bolusDoses: [
      {
        species: 'both',
        min: 40, max: 50, unit: BolusDoseUnit.mg_kg,
        infusionTimeMin: 30,
        useCase: 'Infecções suscetíveis - intermitente',
        notes: 'Não misturar com aminoglicosídeos (inativação). Ajuste renal.'
      }
    ],
    criDoses: [
      {
        species: 'both',
        cri: { min: 40, default: 45, max: 50, unit: CriDoseUnit.mg_kg_h },
        useCase: 'CRI excepcional para T>MIC',
        notes: 'Estendida 3-4h p/ T>MIC. SF. NÃO misturar com aminoglicosídeos.'
      }
    ],
    info: {
      indicationSummary: ['Infecções suscetíveis', 'Infecções hospitalares'],
      mechanism: 'Beta-lactâmico + inibidor de beta-lactamase',
      dosesText: {
        dog: { bolus: '40-50 mg/kg IV a cada 6-8h', cri: '40-50 mg/kg/h (excepcional)' },
        cat: { bolus: '40-50 mg/kg IV a cada 6-8h', cri: '40-50 mg/kg/h (excepcional)' }
      },
      adjustments: {
        renal: 'Ajustar dose em DRC'
      }
    }
  },

  {
    id: 'ceftazidime',
    name: 'Ceftazidima',
    category: 'Antimicrobianos',
    concentrations: [
      { label: '2 g/100 mL (20 mg/mL)', value: 20, unit: 'mg/mL' }
    ],
    bolusDoses: [
      {
        species: 'both',
        min: 20, max: 30, unit: BolusDoseUnit.mg_kg,
        infusionTimeMin: 30,
        useCase: 'Infecções por Pseudomonas',
        notes: 'Anti-Pseudomonas. Evitar bicarbonato e aminoglicosídeos na mesma linha. Ajuste renal.'
      }
    ],
    criDoses: [
      {
        species: 'both',
        cri: { min: 20, default: 25, max: 30, unit: CriDoseUnit.mg_kg_h },
        useCase: 'CRI excepcional para T>MIC',
        notes: 'Intermitente 30-60 min; Estendida 3-4h. SF/D5W.'
      }
    ],
    info: {
      indicationSummary: ['Infecções por Pseudomonas', 'Infecções Gram-'],
      mechanism: 'Beta-lactâmico de terceira geração',
      dosesText: {
        dog: { bolus: '20-30 mg/kg IV a cada 8h', cri: '20-30 mg/kg/h (excepcional)' },
        cat: { bolus: '20-30 mg/kg IV a cada 8h', cri: '20-30 mg/kg/h (excepcional)' }
      },
      adjustments: {
        renal: 'Ajustar dose em DRC'
      }
    }
  },

  {
    id: 'cefepime',
    name: 'Cefepime',
    category: 'Antimicrobianos',
    concentrations: [
      { label: '2 g/100 mL (20 mg/mL)', value: 20, unit: 'mg/mL' }
    ],
    bolusDoses: [
      {
        species: 'both',
        min: 20, max: 30, unit: BolusDoseUnit.mg_kg,
        infusionTimeMin: 30,
        useCase: 'Infecções de amplo espectro',
        notes: 'Amplo espectro; neurotoxicidade se acúmulo (DRC).'
      }
    ],
    criDoses: [
      {
        species: 'both',
        cri: { min: 20, default: 25, max: 30, unit: CriDoseUnit.mg_kg_h },
        useCase: 'CRI excepcional para T>MIC',
        notes: 'Intermitente 30 min; Estendida 3-4h. SF/D5W.'
      }
    ],
    info: {
      indicationSummary: ['Infecções de amplo espectro', 'Infecções hospitalares'],
      mechanism: 'Beta-lactâmico de quarta geração',
      dosesText: {
        dog: { bolus: '20-30 mg/kg IV a cada 8-12h', cri: '20-30 mg/kg/h (excepcional)' },
        cat: { bolus: '20-30 mg/kg IV a cada 8-12h', cri: '20-30 mg/kg/h (excepcional)' }
      },
      adjustments: {
        renal: 'Ajustar dose em DRC (neurotoxicidade)'
      }
    }
  },

  {
    id: 'meropenem',
    name: 'Meropenem',
    category: 'Antimicrobianos',
    concentrations: [
      { label: '1 g/100 mL (10 mg/mL)', value: 10, unit: 'mg/mL' }
    ],
    bolusDoses: [
      {
        species: 'both',
        min: 10, max: 15, unit: BolusDoseUnit.mg_kg,
        infusionTimeMin: 30,
        useCase: 'Infecções MDR',
        notes: 'Estabilidade limitada. Ajuste renal; uso restrito.'
      }
    ],
    criDoses: [
      {
        species: 'both',
        cri: { min: 10, default: 12, max: 15, unit: CriDoseUnit.mg_kg_h },
        useCase: 'CRI excepcional para T>MIC',
        notes: '20-30 min ou 3h estendida. SF/D5W; estabilidade limitada.'
      }
    ],
    info: {
      indicationSummary: ['Infecções MDR', 'Infecções ESBL'],
      mechanism: 'Carbapenem - inibe síntese da parede celular',
      dosesText: {
        dog: { bolus: '10-15 mg/kg IV a cada 8h', cri: '10-15 mg/kg/h (excepcional)' },
        cat: { bolus: '10-15 mg/kg IV a cada 8h', cri: '10-15 mg/kg/h (excepcional)' }
      },
      adjustments: {
        renal: 'Ajustar dose em DRC'
      }
    }
  },

  {
    id: 'vancomycin',
    name: 'Vancomicina',
    category: 'Antimicrobianos',
    concentrations: [
      { label: '1 g/100 mL (10 mg/mL)', value: 10, unit: 'mg/mL' }
    ],
    bolusDoses: [
      {
        species: 'both',
        min: 10, max: 15, unit: BolusDoseUnit.mg_kg,
        infusionTimeMin: 60,
        useCase: 'Infecções por MRSA/MRSP',
        notes: '60-120 min com bomba; níveis. Síndrome "red man" se rápido; nefro/ototox.'
      }
    ],
    info: {
      indicationSummary: ['Infecções por MRSA/MRSP', 'Infecções Gram+ resistentes'],
      mechanism: 'Glicopeptídeo - inibe síntese da parede celular',
      dosesText: {
        dog: { bolus: '10-15 mg/kg IV a cada 8-12h' },
        cat: { bolus: '10-15 mg/kg IV a cada 8-12h' }
      },
      adjustments: {
        renal: 'Ajustar por níveis (nefro/ototox)'
      }
    }
  },

  // VASOATIVOS ADICIONAIS
  {
    id: 'phenylephrine',
    name: 'Fenilefrina',
    category: 'Agentes Cardiovasculares',
    concentrations: [
      { label: '10 mg/250 mL (0.04 mg/mL)', value: 0.04, unit: 'mg/mL' }
    ],
    criDoses: [
      {
        species: 'both',
        cri: { min: 1, default: 2, max: 10, unit: CriDoseUnit.mcg_kg_min },
        useCase: 'Resgate vasoconstritor alfa-1',
        notes: '1-3 µg/kg/min (até 10). Pode ↓ DC/DO2 — usar quando NE+volume falham. Proteção de luz.'
      }
    ],
    specialWarnings: [WarningType.Photoprotection],
    info: {
      indicationSummary: ['Resgate vasoconstritor', 'Hipotensão refratária'],
      mechanism: 'Agonista α1-adrenérgico - vasoconstritor',
      dosesText: {
        dog: { cri: '1-10 µg/kg/min' },
        cat: { cri: '1-10 µg/kg/min' }
      },
      adjustments: {
        cardiac: 'Risco de ↓ DC - bloquear em choque cardiogênico sem inotrópico'
      }
    }
  },

  {
    id: 'dopamine',
    name: 'Dopamina',
    category: 'Agentes Cardiovasculares',
    concentrations: [
      { label: '200 mg/250 mL (0.8 mg/mL)', value: 0.8, unit: 'mg/mL' }
    ],
    criDoses: [
      {
        species: 'both',
        cri: { min: 5, default: 10, max: 20, unit: CriDoseUnit.mcg_kg_min },
        useCase: 'Suporte cardiovascular',
        notes: '5-20 µg/kg/min; evitar "dose renal". Proteger da luz; evitar em taquiarritmias.'
      }
    ],
    specialWarnings: [WarningType.Photoprotection],
    info: {
      indicationSummary: ['Suporte cardiovascular', 'Hipotensão'],
      mechanism: 'Agonista dopaminérgico e adrenérgico',
      dosesText: {
        dog: { cri: '5-20 µg/kg/min' },
        cat: { cri: '5-20 µg/kg/min' }
      },
      adjustments: {
        cardiac: 'Evitar "dose renal" - ausência de benefício renal'
      }
    }
  },

  {
    id: 'nitroprusside',
    name: 'Nitroprussiato de Sódio',
    category: 'Agentes Cardiovasculares',
    concentrations: [
      { label: '50 mg/250 mL (0.2 mg/mL)', value: 0.2, unit: 'mg/mL' }
    ],
    criDoses: [
      {
        species: 'both',
        cri: { min: 0.5, default: 2, max: 10, unit: CriDoseUnit.mcg_kg_min },
        useCase: 'Emergência hipertensiva',
        notes: 'D5W EXCLUSIVO + proteção de luz; linha dedicada. Risco de tiocianato em uso prolongado.'
      }
    ],
    specialWarnings: [WarningType.Photoprotection],
    info: {
      indicationSummary: ['Emergência hipertensiva', 'Hipertensão refratária'],
      mechanism: 'Doador de óxido nítrico - vasodilatador',
      dosesText: {
        dog: { cri: '0.5-10 µg/kg/min' },
        cat: { cri: '0.5-10 µg/kg/min' }
      },
      adjustments: {
        cardiac: 'Impedir seleção de SF/RL como diluente; exigir "checar PA invasiva"'
      }
    }
  },

  // NMBAs ADICIONAIS
  {
    id: 'vecuronium',
    name: 'Vecurônio',
    category: 'Bloqueadores Neuromusculares',
    concentrations: [
      { label: '10 mg/100 mL (0.1 mg/mL)', value: 0.1, unit: 'mg/mL' }
    ],
    bolusDoses: [
      {
        species: 'both',
        min: 0.1, max: 0.1, unit: BolusDoseUnit.mg_kg,
        infusionTimeMin: 30,
        useCase: 'Bloqueio neuromuscular',
        notes: 'Requisitos: VM + TOF. NÃO produzem sedação/analgesia.'
      }
    ],
    criDoses: [
      {
        species: 'both',
        cri: { min: 0.1, default: 0.15, max: 0.2, unit: CriDoseUnit.mg_kg_h },
        useCase: 'CRI para bloqueio prolongado',
        notes: 'Compatível com SF/RL/G5%. Metabolismo hepático - reduzir em hepatopatas.'
      }
    ],
    specialWarnings: [WarningType.VentilatorySupport],
    info: {
      indicationSummary: ['Bloqueio neuromuscular', 'Ventilação mecânica'],
      mechanism: 'Bloqueador neuromuscular não-despolarizante',
      dosesText: {
        dog: { bolus: '0.1 mg/kg IV', cri: '0.1-0.2 mg/kg/h' },
        cat: { bolus: '0.1 mg/kg IV', cri: '0.1-0.2 mg/kg/h' }
      },
      adjustments: {
        hepatic: 'Metabolismo hepático - reduzir dose em hepatopatas'
      }
    }
  },

  {
    id: 'succinylcholine',
    name: 'Suxametônio',
    category: 'Bloqueadores Neuromusculares',
    concentrations: [
      { label: '100 mg/100 mL (1 mg/mL)', value: 1, unit: 'mg/mL' }
    ],
    bolusDoses: [
      {
        species: 'both',
        min: 0.5, max: 1, unit: BolusDoseUnit.mg_kg,
        infusionTimeMin: 1,
        useCase: 'Bloqueio neuromuscular de curta ação',
        notes: 'NÃO CRI (risco hiperK+ em contextos específicos).'
      }
    ],
    specialWarnings: [WarningType.VentilatorySupport],
    info: {
      indicationSummary: ['Bloqueio neuromuscular de curta ação', 'Intubação'],
      mechanism: 'Bloqueador neuromuscular despolarizante',
      dosesText: {
        dog: { bolus: '0.5-1 mg/kg IV' },
        cat: { bolus: '0.5-1 mg/kg IV' }
      },
      adjustments: {
        renal: 'Risco hiperK+ em DRC'
      }
    }
  },

  {
    id: 'sugammadex',
    name: 'Sugamadex',
    category: 'Bloqueadores Neuromusculares',
    concentrations: [
      { label: '200 mg/2 mL (100 mg/mL)', value: 100, unit: 'mg/mL' }
    ],
    bolusDoses: [
      {
        species: 'both',
        min: 8, max: 8, unit: BolusDoseUnit.mg_kg,
        infusionTimeMin: 1,
        useCase: 'Reversão de rocurônio/vecurônio',
        notes: 'Reversão específica para rocurônio/vecurônio quando TOF ≥1-2.'
      }
    ],
    info: {
      indicationSummary: ['Reversão de NMBAs', 'Rocurônio/Vecurônio'],
      mechanism: 'Complexante específico para rocurônio/vecurônio',
      dosesText: {
        dog: { bolus: '8 mg/kg IV' },
        cat: { bolus: '8 mg/kg IV' }
      },
      adjustments: {
        renal: 'Excreção renal - ajustar em DRC'
      }
    }
  },

  {
    id: 'neostigmine',
    name: 'Neostigmina',
    category: 'Bloqueadores Neuromusculares',
    concentrations: [
      { label: '2.5 mg/5 mL (0.5 mg/mL)', value: 0.5, unit: 'mg/mL' }
    ],
    bolusDoses: [
      {
        species: 'both',
        min: 0.02, max: 0.07, unit: BolusDoseUnit.mg_kg,
        infusionTimeMin: 1,
        useCase: 'Reversão de NMBAs não-despolarizantes',
        notes: 'Reversão quando TOF ≥1-2. Usar com atropina ou glicopirrolato.'
      }
    ],
    info: {
      indicationSummary: ['Reversão de NMBAs', 'Bloqueio neuromuscular'],
      mechanism: 'Inibidor da colinesterase - reversão de NMBAs',
      dosesText: {
        dog: { bolus: '0.02-0.07 mg/kg IV' },
        cat: { bolus: '0.02-0.07 mg/kg IV' }
      },
      adjustments: {
        cardiac: 'Usar com atropina para evitar bradicardia'
      }
    }
  },

  // ENDÓCRINO/ELETRÓLITOS ADICIONAIS
  {
    id: 'magnesium-sulfate',
    name: 'Sulfato de Magnésio (MgSO4)',
    category: 'Endócrino',
    concentrations: [
      { label: '50% (4 mEq/mL)', value: 4, unit: 'mEq/mL' },
      { label: '8% (0.65 mEq/mL)', value: 0.65, unit: 'mEq/mL' }
    ],
    bolusDoses: [
      {
        species: 'both',
        min: 0.15, max: 0.3, unit: BolusDoseUnit.mEq_kg,
        infusionTimeMin: 15,
        useCase: 'Carga de magnésio',
        notes: 'Carga 0.15-0.3 mEq/kg em 10-20 min. Diluir ≤20% em SF/RL/G5%.'
      }
    ],
    criDoses: [
      {
        species: 'both',
        cri: { min: 0.75, default: 1, max: 1.25, unit: CriDoseUnit.mEq_kg_day },
        useCase: 'Manutenção de magnésio',
        notes: 'Manutenção 0.75-1 mEq/kg/dia (12-24h). Máx ≈0.016 mEq/kg/min.'
      }
    ],
    info: {
      indicationSummary: ['Hipomagnesemia', 'Eclampsia'],
      mechanism: 'Suplementação de magnésio',
      dosesText: {
        dog: { bolus: '0.15-0.3 mEq/kg (carga)', cri: '0.75-1 mEq/kg/dia' },
        cat: { bolus: '0.15-0.3 mEq/kg (carga)', cri: '0.75-1 mEq/kg/dia' }
      },
      adjustments: {
        renal: 'Monitorar em DRC'
      }
    }
  },

  // ANALGÉSICOS ADICIONAIS
  {
    id: 'remifentanil',
    name: 'Remifentanil',
    category: 'Analgésicos e Anestésicos',
    concentrations: [
      { label: '1 mg/100 mL (0.01 mg/mL)', value: 0.01, unit: 'mg/mL' }
    ],
    criDoses: [
      {
        species: 'both',
        cri: { min: 5, default: 10, max: 20, unit: CriDoseUnit.mcg_kg_h },
        useCase: 'Analgesia de curta duração',
        notes: '5-20 µg/kg/h (0.083-0.33 µg/kg/min). D5W/SF. Metabolismo por esterases.'
      }
    ],
    info: {
      indicationSummary: ['Analgesia de curta duração', 'Anestesia'],
      mechanism: 'Agonista opioide μ ultrarrápido',
      dosesText: {
        dog: { cri: '5-20 µg/kg/h' },
        cat: { cri: '5-20 µg/kg/h' }
      },
      adjustments: {
        renal: 'Ajustes renais/hepáticos geralmente desnecessários'
      }
    }
  },

  // INSULINAS ADICIONAIS
  {
    id: 'insulin-nph',
    name: 'Insulina NPH (Isofana)',
    category: 'Endócrino',
    concentrations: [
      { label: '100 U/mL', value: 100, unit: 'U/mL' }
    ],
    bolusDoses: [
      {
        species: 'both',
        min: 0.1, max: 0.5, unit: BolusDoseUnit.U_kg,
        infusionTimeMin: 1,
        useCase: 'Diabetes mellitus',
        notes: 'Insulina de ação intermediária. Homogeneizar a suspensão rolando o frasco suavemente.'
      }
    ],
    info: {
      indicationSummary: ['Diabetes mellitus', 'Controle glicêmico'],
      mechanism: 'Insulina de ação intermediária',
      dosesText: {
        dog: { bolus: '0.1-0.5 U/kg SC' },
        cat: { bolus: '0.1-0.5 U/kg SC' }
      },
      adjustments: {
        hepatic: 'Monitorar de perto. A necessidade de insulina pode mudar.'
      }
    }
  },

  {
    id: 'insulin-pzi',
    name: 'Insulina PZI (Protamina Zinco)',
    category: 'Endócrino',
    concentrations: [
      { label: '40 U/mL', value: 40, unit: 'U/mL' }
    ],
    bolusDoses: [
      {
        species: 'both',
        min: 0.1, max: 0.5, unit: BolusDoseUnit.U_kg,
        infusionTimeMin: 1,
        useCase: 'Diabetes mellitus felino',
        notes: 'Insulina de ação prolongada. Usar apenas seringas calibradas para U-40.'
      }
    ],
    info: {
      indicationSummary: ['Diabetes mellitus felino', 'Controle glicêmico'],
      mechanism: 'Insulina de ação prolongada',
      dosesText: {
        dog: { bolus: '0.1-0.5 U/kg SC' },
        cat: { bolus: '0.1-0.5 U/kg SC' }
      },
      adjustments: {
        hepatic: 'Monitorar de perto. A necessidade de insulina pode mudar.'
      }
    }
  },

  {
    id: 'insulin-dka',
    name: 'Insulina Regular (DKA)',
    category: 'Endócrino',
    concentrations: [
      { label: '100 U/mL', value: 100, unit: 'U/mL' }
    ],
    criDoses: [
      {
        species: 'both',
        cri: { min: 0.05, default: 0.08, max: 0.1, unit: CriDoseUnit.U_kg_h },
        useCase: 'Cetoacidose diabética',
        notes: 'Preparar bolsa (≈250 mL SF); PRIMAR e DESCARTAR 20-50 mL (adsorção).'
      }
    ],
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
  }
];

// COMPATIBILIDADE ADICIONAL
export const ADDITIONAL_COMPATIBILITY_MATRIX = {
  'ceftriaxone': {
    '🟢': ['SF 0.9%', 'D5W'],
    '🔴': ['cálcio', 'RL', 'Ringer Lactato']
  },
  'metronidazole': {
    '🟢': ['SF 0.9%', 'D5W', 'Ringer', 'RL'],
    '🔴': ['amphotericin B', 'diazepam', 'dopamine', 'pantoprazole', 'propofol']
  },
  'vancomycin': {
    '🟢': ['SF 0.9%', 'D5W'],
    '🔴': ['heparin', 'β-lactâmicos']
  },
  'nitroprusside': {
    '🟢': ['D5W'],
    '🔴': ['SF 0.9%', 'RL', 'Ringer']
  },
  'magnesium-sulfate': {
    '🟢': ['SF 0.9%', 'RL', 'D5W'],
    '🔴': ['bicarbonate', 'dobutamine']
  }
};

// FÓRMULAS ADICIONAIS
export const ADDITIONAL_FORMULAS = {
  tmic: 'T>MIC = tempo da concentração do antibiótico acima da CMI do patógeno',
  priming: 'Priming de insulina: descartar 20-50 mL da linha para saturar adsorção',
  stewardship: 'Stewardship: intermitente padrão, estendida apenas para beta-lactâmicos tempo-dependentes'
};

// EXEMPLOS ADICIONAIS
export const ADDITIONAL_EXAMPLES = [
  {
    title: 'Ceftriaxona',
    description: '10 mg/mL, 15 kg, 25 mg/kg',
    calculation: '25×15=375 mg → 375/10 = 37.5 mL (infusão em 30 min)'
  },
  {
    title: 'Vancomicina',
    description: '10 mg/mL, 20 kg, 15 mg/kg',
    calculation: '15×20=300 mg → 300/10 = 30 mL (infusão em 60-120 min)'
  },
  {
    title: 'Magnésio (carga)',
    description: '4 mEq/mL, 10 kg, 0.2 mEq/kg',
    calculation: '0.2×10=2 mEq → 2/4 = 0.5 mL (infusão em 10-20 min)'
  }
];

// TOOLTIPS ADICIONAIS
export const ADDITIONAL_TOOLTIPS = {
  stewardship: 'Stewardship: intermitente padrão, estendida apenas para beta-lactâmicos tempo-dependentes quando houver justificativa T>MIC e estabilidade.',
  ceftriaxone: 'PROIBIDO com cálcio/RL: risco de precipitado insolúvel. Usar SF/D5W.',
  tmic: 'T>MIC: tempo da concentração do antibiótico acima da CMI. Beta-lactâmicos dependem de T>MIC.',
  priming: 'Priming de insulina: insulina adere ao equipamento; descartar 20-50 mL satura o sistema.',
  dedicatedLine: 'Linha dedicada: 1) emulsões lipídicas, 2) catecolaminas, 3) combinações 🔴, 4) preparo incerto.'
};

// CHECKLISTS ADICIONAIS
export const ADDITIONAL_CHECKLISTS = {
  stewardship: [
    'Justificativa T>MIC documentada',
    'Estabilidade confirmada',
    'Cultura e antibiograma',
    'Reavaliação em 48-72h',
    'Descalonamento quando possível'
  ],
  nmba: [
    'Ventilação mecânica ativa',
    'Monitor TOF disponível',
    'Sedação/anestesia adequada',
    'Reversão preparada',
    'Lavagem de linhas'
  ],
  insulin: [
    'Priming realizado (20-50 mL)',
    'Glicemia inicial',
    'Potássio > 3.5 mEq/L',
    'Bomba de infusão',
    'Monitorização a cada 1-2h'
  ]
};
