import { Drug, DrugInfo, CriDoseUnit, BolusDoseUnit, DoseRange, FluidType, WarningType } from '../types';

// Exemplo de dados farmacológicos reestruturados para alguns fármacos importantes
export const IMPROVED_DRUGS: Drug[] = [
  {
    id: 'dobutamina',
    name: 'Dobutamina',
    category: 'Vasoativo',
    concentrations: [
      { value: 12.5, unit: 'mg/mL', label: 'Frasco 20 mL' },
      { value: 250, unit: 'mg/mL', label: 'Pó para reconstituição' }
    ],
    defaultConcentration: 12.5,
    defaultConcentrationUnit: 'mg/mL',
    preferredDoseUnit: CriDoseUnit.mcg_kg_min,
    preferredDoseReason: 'titulação minuto a minuto',
    info: {
      indications: {
        summary: [
          'Insuficiência cardíaca aguda',
          'Choque cardiogênico',
          'Suporte hemodinâmico pós-operatório',
          'Depressão miocárdica por anestesia'
        ],
        detailed: [
          'Principalmente indicado em pacientes com baixo débito cardíaco',
          'Aumenta contratilidade e débito cardíaco',
          'Reduz pressão de enchimento ventricular',
          'Pouco efeito sobre frequência cardíaca'
        ]
      },
      doses: {
        cri: {
          ranges: [
            { min: 2, max: 10, unit: CriDoseUnit.mcg_kg_min, isRecommended: true },
            { min: 120, max: 600, unit: CriDoseUnit.mcg_kg_h, isRecommended: false },
            { min: 0.12, max: 0.6, unit: CriDoseUnit.mg_kg_h, isRecommended: false }
          ],
          preferredUnit: CriDoseUnit.mcg_kg_min,
          preferredReason: 'titulação minuto a minuto'
        },
        bolus: {
          ranges: [],
          preferredUnit: BolusDoseUnit.mg_kg,
          preferredReason: 'não recomendado',
          contraindicated: true,
          infusionTimeMin: undefined
        },
        notes: 'Dose inicial baixa em pacientes com arritmias ventriculares'
      },
      dilution: {
        recommendedFluids: ['SG 5%', 'NaCl 0.9%'],
        examples: [
          {
            description: 'Preparo padrão para CRI',
            concentration: '2 mg/mL',
            volume: 50,
            fluid: 'SG 5%'
          },
          {
            description: 'Preparo para bolsa maior',
            concentration: '1 mg/mL',
            volume: 250,
            fluid: 'SG 5%'
          }
        ],
        compatibility: {
          compatible: ['Fentanil', 'Midazolam', 'Morfina'],
          incompatible: ['Bicarbonato de sódio', 'Furosemida'],
          ySite: ['Compatível com Y-site com a maioria dos fármacos']
        },
        notes: 'Proteger da luz. Usar soluções dextrosadas preferencialmente.'
      },
      usage: {
        infusionTime: 'Contínua, titulada conforme resposta',
        administration: [
          'Iniciar com dose baixa e titular',
          'Monitorar pressão arterial continuamente',
          'Administrar via cateter central preferencialmente',
          'Usar bomba de infusão'
        ],
        monitoring: [
          'Pressão arterial',
          'Frequência cardíaca',
          'Débito cardíaco (se disponível)',
          'Pressão de enchimento',
          'Saturação venosa mista'
        ],
        goodPractice: [
          'Titular baseado na resposta hemodinâmica',
          'Não interromper abruptamente',
          'Verificar compatibilidade com outros fármacos',
          'Usar linha dedicada quando possível'
        ]
      },
      warnings: {
        adverseEffects: [
          'Taquicardia',
          'Arritmias ventriculares',
          'Hipertensão arterial',
          'Náusea e vômito'
        ],
        contraindications: [
          'Hipovolemia não corrigida',
          'Obstrução ventricular de saída',
          'Arritmias ventriculares graves'
        ],
        cautions: [
          'Usar com cautela em pacientes com arritmias',
          'Monitorar eletrólitos',
          'Evitar extravasamento'
        ],
        specialWarnings: []
      },
      presentation: {
        available: [
          {
            concentration: 12.5,
            unit: 'mg/mL',
            volume: 20,
            description: 'Solução injetável'
          },
          {
            concentration: 250,
            unit: 'mg/mL',
            volume: 1,
            description: 'Pó para reconstituição'
          }
        ],
        notes: 'Armazenar entre 2-8°C, proteger da luz'
      },
      references: {
        sources: [
          'Plumb\'s Veterinary Drug Handbook',
          'Nelson & Couto - Small Animal Internal Medicine',
          'Silverstein & Hopper - Small Animal Critical Care Medicine'
        ],
        citations: [
          'Dobutamina: revisão farmacológica e aplicação clínica em medicina veterinária',
          'Protocolos de suporte hemodinâmico em pacientes críticos'
        ]
      }
    }
  },
  {
    id: 'dopamina',
    name: 'Dopamina',
    category: 'Vasoativo',
    concentrations: [
      { value: 40, unit: 'mg/mL', label: 'Frasco 5 mL' }
    ],
    defaultConcentration: 40,
    defaultConcentrationUnit: 'mg/mL',
    preferredDoseUnit: CriDoseUnit.mcg_kg_min,
    preferredDoseReason: 'efeito dose-dependente',
    info: {
      indications: {
        summary: [
          'Hipotensão arterial',
          'Choque hipovolêmico',
          'Insuficiência renal aguda',
          'Bradicardia'
        ],
        detailed: [
          'Efeito dose-dependente: renal → cardíaco → vasopressor',
          'Aumenta fluxo sanguíneo renal em doses baixas',
          'Aumenta contratilidade em doses médias',
          'Vasoconstrição em doses altas'
        ]
      },
      doses: {
        cri: {
          ranges: [
            { min: 1, max: 5, unit: CriDoseUnit.mcg_kg_min, isRecommended: true },
            { min: 5, max: 15, unit: CriDoseUnit.mcg_kg_min, isRecommended: false },
            { min: 15, max: 20, unit: CriDoseUnit.mcg_kg_min, isRecommended: false }
          ],
          preferredUnit: CriDoseUnit.mcg_kg_min,
          preferredReason: 'efeito dose-dependente'
        },
        bolus: {
          ranges: [],
          preferredUnit: BolusDoseUnit.mg_kg,
          preferredReason: 'não recomendado',
          contraindicated: true
        },
        notes: 'Dose baixa (1-5): efeito renal; Média (5-15): cardíaco; Alta (>15): vasopressor'
      },
      dilution: {
        recommendedFluids: ['SG 5%', 'NaCl 0.9%'],
        examples: [
          {
            description: 'Preparo para efeito renal',
            concentration: '1 mg/mL',
            volume: 50,
            fluid: 'SG 5%'
          }
        ],
        compatibility: {
          compatible: ['Fentanil', 'Midazolam'],
          incompatible: ['Bicarbonato de sódio', 'Furosemida'],
          ySite: ['Incompatível com muitos fármacos']
        },
        notes: 'Proteger da luz. Usar linha dedicada.'
      },
      usage: {
        infusionTime: 'Contínua, titulada',
        administration: [
          'Iniciar com dose baixa',
          'Titular conforme objetivo',
          'Usar cateter central',
          'Bomba de infusão obrigatória'
        ],
        monitoring: [
          'Pressão arterial',
          'Frequência cardíaca',
          'Débito urinário',
          'Função renal'
        ],
        goodPractice: [
          'Titular lentamente',
          'Monitorar função renal',
          'Não misturar com outros fármacos',
          'Usar linha dedicada'
        ]
      },
      warnings: {
        adverseEffects: [
          'Taquicardia',
          'Arritmias',
          'Vasoconstrição periférica',
          'Necrose tecidual por extravasamento'
        ],
        contraindications: [
          'Feocromocitoma',
          'Taquiarritmias não controladas'
        ],
        cautions: [
          'Extravasamento causa necrose',
          'Monitorar extremidades',
          'Usar com cautela em cardiopatas'
        ],
        specialWarnings: [WarningType.Vesicant]
      },
      presentation: {
        available: [
          {
            concentration: 40,
            unit: 'mg/mL',
            volume: 5,
            description: 'Solução injetável'
          }
        ]
      },
      references: {
        sources: [
          'Plumb\'s Veterinary Drug Handbook',
          'Nelson & Couto - Small Animal Internal Medicine'
        ],
        citations: [
          'Dopamina: efeitos dose-dependentes em medicina veterinária'
        ]
      }
    }
  },
  {
    id: 'midazolam',
    name: 'Midazolam',
    category: 'Sedativo/Analgésico',
    concentrations: [
      { value: 5, unit: 'mg/mL', label: 'Frasco 10 mL' },
      { value: 1, unit: 'mg/mL', label: 'Frasco 5 mL' }
    ],
    defaultConcentration: 5,
    defaultConcentrationUnit: 'mg/mL',
    preferredDoseUnit: CriDoseUnit.mg_kg_h,
    preferredDoseReason: 'sedação contínua',
    info: {
      indications: {
        summary: [
          'Sedação e ansiolise',
          'Pré-medicação anestésica',
          'Sedação para procedimentos',
          'Convulsões refratárias'
        ],
        detailed: [
          'Benzodiazepínico de ação rápida',
          'Amnésia anterógrada',
          'Relaxamento muscular',
          'Anticonvulsivante'
        ]
      },
      doses: {
        cri: {
          ranges: [
            { min: 0.1, max: 0.3, unit: CriDoseUnit.mg_kg_h, isRecommended: true },
            { min: 0.05, max: 0.1, unit: CriDoseUnit.mg_kg_h, isRecommended: false }
          ],
          preferredUnit: CriDoseUnit.mg_kg_h,
          preferredReason: 'sedação contínua'
        },
        bolus: {
          ranges: [
            { min: 0.1, max: 0.3, unit: BolusDoseUnit.mg_kg, isRecommended: true }
          ],
          preferredUnit: BolusDoseUnit.mg_kg,
          preferredReason: 'sedação rápida',
          infusionTimeMin: 2
        },
        notes: 'Reduzir dose em pacientes hepatopatas'
      },
      dilution: {
        recommendedFluids: ['SG 5%', 'NaCl 0.9%'],
        examples: [
          {
            description: 'Preparo para sedação contínua',
            concentration: '1 mg/mL',
            volume: 50,
            fluid: 'SG 5%'
          }
        ],
        compatibility: {
          compatible: ['Fentanil', 'Morfina', 'Dobutamina'],
          incompatible: ['Bicarbonato de sódio'],
          ySite: ['Compatível com Y-site']
        }
      },
      usage: {
        infusionTime: 'Contínua para sedação prolongada',
        administration: [
          'Administrar lentamente',
          'Monitorar nível de sedação',
          'Titular conforme necessário'
        ],
        monitoring: [
          'Nível de consciência',
          'Frequência respiratória',
          'Pressão arterial',
          'Função hepática'
        ],
        goodPractice: [
          'Titular baseado na resposta',
          'Monitorar depressão respiratória',
          'Ter flumazenil disponível'
        ]
      },
      warnings: {
        adverseEffects: [
          'Depressão respiratória',
          'Sedação excessiva',
          'Paradoxal agitation (raramente)'
        ],
        contraindications: [
          'Hipersensibilidade a benzodiazepínicos',
          'Miastenia gravis'
        ],
        cautions: [
          'Usar com cautela em hepatopatas',
          'Monitorar depressão respiratória',
          'Evitar em gestantes'
        ],
        specialWarnings: []
      },
      presentation: {
        available: [
          {
            concentration: 5,
            unit: 'mg/mL',
            volume: 10,
            description: 'Solução injetável'
          },
          {
            concentration: 1,
            unit: 'mg/mL',
            volume: 5,
            description: 'Solução injetável'
          }
        ]
      },
      references: {
        sources: [
          'Plumb\'s Veterinary Drug Handbook',
          'BSAVA Formulary'
        ],
        citations: [
          'Midazolam em medicina veterinária: aplicações clínicas'
        ]
      }
    }
  }
];

