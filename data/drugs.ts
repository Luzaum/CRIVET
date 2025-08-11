
import { Drug, CriDoseUnit, BolusDoseUnit, WarningType, FluidType } from '../types';

export const DRUGS: Drug[] = [
  // --- Analgésicos e Anestésicos ---
  {
    id: 'fentanil',
    name: 'Fentanil',
    category: 'Analgésicos e Anestésicos',
    concentrations: [{ value: 50, unit: 'μg/mL', label: '0.05 mg/mL (50 μg/mL)' }],
    criDoses: [
      { species: 'dog', cri: { min: 2, max: 12, default: 5, unit: CriDoseUnit.mcg_kg_h } },
      { species: 'cat', cri: { min: 2, max: 6, default: 3, unit: CriDoseUnit.mcg_kg_h } },
    ],
    bolusDoses: [
      { species: 'dog', min: 2, max: 5, unit: BolusDoseUnit.mcg_kg },
      { species: 'cat', min: 1, max: 3, unit: BolusDoseUnit.mcg_kg },
    ],
    info: {
      indicationSummary: ["Analgésico opioide μ-agonista potente para analgesia e sedação em UTI/anestesia."],
      mechanism: "Agonista puro do receptor opioide μ, que causa hiperpolarização neuronal e reduz a liberação de neurotransmissores da dor.",
      dosesText: {
        dog: { cri: "2–12 μg/kg/h", bolus: "2–5 μg/kg IV" },
        cat: { cri: "2–6 μg/kg/h", bolus: "1–3 μg/kg IV" },
        notes: "Causa bradicardia e depressão respiratória dose-dependente; titule pela dor/sedação."
      },
      diluents: { recommended: ['NaCl 0.9%', 'SG 5%'] },
      photoprotection: false,
      compatibility: { ySite: ["Propofol", "Midazolam", "Cetamina", "Lidocaína", "Metadona"] },
      adjustments: {
        hepatic: "Metabolismo hepático. Reduzir a dose em 25-50% ou titular com mais cautela em hepatopatas.",
        pediatric: "Filhotes podem ter depuração reduzida; iniciar com doses mais baixas.",
        geriatric: "Idosos podem ser mais sensíveis; titular a dose com cuidado.",
        cardiac: "Bradicardia é comum. Considere pré-medicação com anticolinérgico ou tenha-o à disposição."
      },
      monitoring: ["Frequência respiratória e ETCO₂", "Frequência cardíaca", "Pressão arterial", "Profundidade da sedação"],
      goodPractice: ["Sempre usar bomba de infusão para garantir precisão.", "Evite interrupção brusca (risco de hiperalgesia/rebote).", "Planejar analgesia de resgate ao descontinuar a infusão."],
      contraindications: ["Usar com cautela em pacientes com aumento da pressão intracraniana."],
      citations: ["Plumb’s Veterinary Drug Handbook, 10th Ed.", "BSAVA Small Animal Formulary, 10th Ed."]
    }
  },
  {
    id: 'remifentanil',
    name: 'Remifentanil',
    category: 'Analgésicos e Anestésicos',
    isPowder: true,
    preparationGuide: `Este fármaco é um pó que precisa de <strong>reconstituição</strong> antes do uso.<br>A concentração para cálculo após este passo é de <strong>1 mg/mL</strong>.<br><br><strong>Passo a passo:</strong><ul class="list-disc list-inside mt-2 space-y-1"><li>Frasco de <strong>1mg</strong>: adicione <strong>1mL</strong> de diluente.</li><li>Frasco de <strong>2mg</strong>: adicione <strong>2mL</strong>.</li><li>Frasco de <strong>5mg</strong>: adicione <strong>5mL</strong>.</li></ul><br>A calculadora usará esta concentração de <strong>1 mg/mL</strong> para determinar o volume a ser adicionado na sua seringa ou bolsa final.`,
    concentrations: [{ value: 1000, unit: 'μg/mL', label: '1 mg/mL (pós-reconstituição)'}],
    criDoses: [{ species: 'both', cri: { min: 0.005, max: 0.12, default: 0.03, unit: CriDoseUnit.mcg_kg_min } }],
    bolusDoses: [
      { species: 'both', min: 0.5, max: 1, unit: BolusDoseUnit.mcg_kg },
    ],
    info: {
      indicationSummary: ["Opioide μ-agonista de início/término ultrarrápidos, ideal para titulação fina em procedimentos cirúrgicos e pacientes críticos."],
      mechanism: "Metabolismo por esterases plasmáticas não específicas, resultando em uma meia-vida de eliminação muito curta e independente da duração da infusão.",
      dosesText: {
        dog: { cri: "0.005–0.12 µg/kg/min (0.3–7.2 µg/kg/h)", bolus: "0.5-1 µg/kg IV" },
        cat: { cri: "0.005–0.12 µg/kg/min (0.3–7.2 µg/kg/h)", bolus: "0.5-1 µg/kg IV" },
        notes: "A analgesia cessa quase imediatamente após o fim da infusão. Inicie a analgesia pós-operatória antes de desligar a bomba."
      },
      diluents: { recommended: ['NaCl 0.9%', 'SG 5%'], notes: "Estabilidade reduzida em Ringer Lactato. Prefira NaCl 0.9% ou SG 5% para diluição." },
      photoprotection: false,
      compatibility: {},
      adjustments: {
        renal: "Metabolismo extra-renal o torna ideal para pacientes com disfunção renal.",
        hepatic: "Metabolismo extra-hepático o torna uma excelente escolha para pacientes com disfunção hepática."
      },
      monitoring: ["Frequência respiratória", "Pressão arterial", "Frequência cardíaca", "Saturação de oxigênio"],
      goodPractice: ["Sempre administrar via bomba de infusão.", "Assegure analgesia multimodal (ex: AINE, dipirona, morfina) antes do término da infusão."],
      citations: ["Plumb’s Veterinary Drug Handbook, 10th Ed."]
    }
  },
  {
    id: 'morfina',
    name: 'Morfina',
    category: 'Analgésicos e Anestésicos',
    concentrations: [{ value: 10, unit: 'mg/mL', label: '10 mg/mL' }],
    criDoses: [
      { species: 'dog', cri: { min: 0.1, max: 0.5, default: 0.2, unit: CriDoseUnit.mg_kg_h } },
      { species: 'cat', cri: { min: 0.05, max: 0.1, default: 0.07, unit: CriDoseUnit.mg_kg_h } },
    ],
    bolusDoses: [
      { species: 'dog', min: 0.2, max: 0.5, unit: BolusDoseUnit.mg_kg, notes: "Administrar IV lento para reduzir risco de vômito e liberação de histamina." },
      { species: 'cat', min: 0.1, max: 0.2, unit: BolusDoseUnit.mg_kg, notes: "Administrar IV lento." },
    ],
    info: {
        indicationSummary: ["Analgésico opioide μ-agonista padrão para dor moderada a severa. Pode causar vômito (estimulação da ZQG) e liberação de histamina."],
        dosesText: {
            dog: { cri: "0.1-0.5 mg/kg/h", bolus: "0.2-0.5 mg/kg IV lento" },
            cat: { cri: "0.05-0.1 mg/kg/h", bolus: "0.1-0.2 mg/kg IV lento" },
            notes: "Altas taxas em gatos podem causar excitação ('delírio de morfina') e hipertermia."
        },
        diluents: { recommended: ['NaCl 0.9%', 'SG 5%', 'Ringer Lactato'] },
        photoprotection: false,
        compatibility: { incompatibilities: ["Barbitúricos, Furosemida"], ySite: ["Cetamina", "Lidocaína", "Metoclopramida"] },
        adjustments: {
            renal: "Metabólito ativo (M6G) acumula em disfunção renal. Reduzir dose em 25-50% ou considerar fentanil/remifentanil.",
            hepatic: "Metabolismo hepático. Reduzir a dose em pacientes com disfunção hepática.",
            geriatric: "Idosos podem ser mais sensíveis; iniciar com doses mais baixas."
        },
        monitoring: ["Frequência respiratória", "Nível de sedação", "Sinais de náusea/vômito", "Temperatura corporal (especialmente em gatos)"],
        goodPractice: ["Considerar pré-medicação com antiemético (ex: maropitant).", "Administrar bolus lentamente para reduzir risco de vômito e hipotensão."],
        citations: ["Plumb’s Veterinary Drug Handbook, 10th Ed.", "BSAVA Small Animal Formulary, 10th Ed."]
    }
  },
   {
    id: 'metadona',
    name: 'Metadona',
    category: 'Analgésicos e Anestésicos',
    concentrations: [{ value: 10, unit: 'mg/mL', label: '10 mg/mL' }],
    criDoses: [
      { species: 'dog', cri: { min: 0.1, max: 0.3, default: 0.12, unit: CriDoseUnit.mg_kg_h } },
      { species: 'cat', cri: { min: 0.05, max: 0.2, default: 0.1, unit: CriDoseUnit.mg_kg_h } },
    ],
    bolusDoses: [
      { species: 'dog', min: 0.1, max: 0.2, unit: BolusDoseUnit.mg_kg },
      { species: 'cat', min: 0.1, max: 0.2, unit: BolusDoseUnit.mg_kg },
    ],
    info: {
        indicationSummary: ["Opioide μ-agonista com antagonismo NMDA, útil para dor moderada a severa e dor crônica/neuropática."],
        dosesText: {
            dog: { cri: "0.1-0.3 mg/kg/h após carga de 0.1-0.2 mg/kg.", bolus: "0.1-0.2 mg/kg IV/IM/SC" },
            cat: { cri: "0.05-0.2 mg/kg/h", bolus: "0.1-0.2 mg/kg IV/IM/SC" },
        },
        diluents: { recommended: ['NaCl 0.9%', 'SG 5%', 'Ringer Lactato'] },
        photoprotection: false,
        compatibility: { incompatibilities: ["Bicarbonato"], ySite: ["Fentanil", "Cetamina"] },
        adjustments: {
            hepatic: "Metabolismo hepático. Reduzir a dose em 25-50% em disfunção hepática.",
            geriatric: "Idosos podem ser mais sensíveis. Iniciar com dose mais baixa e titular lentamente.",
        },
        monitoring: ["Frequência cardíaca", "Frequência respiratória", "Nível de sedação"],
        goodPractice: ["Menor propensão a causar vômito em comparação com a morfina."],
        citations: ["Plumb’s Veterinary Drug Handbook, 10th Ed."]
    }
  },
  {
    id: 'hidromorfona',
    name: 'Hidromorfona',
    category: 'Analgésicos e Anestésicos',
    concentrations: [{ value: 2, unit: 'mg/mL', label: '2 mg/mL' }],
    criDoses: [
      { species: 'dog', cri: { min: 0.02, max: 0.1, default: 0.03, unit: CriDoseUnit.mg_kg_h } },
      { species: 'cat', cri: { min: 0.01, max: 0.05, default: 0.02, unit: CriDoseUnit.mg_kg_h } },
    ],
    bolusDoses: [
      { species: 'dog', min: 0.05, max: 0.1, unit: BolusDoseUnit.mg_kg },
      { species: 'cat', min: 0.025, max: 0.05, unit: BolusDoseUnit.mg_kg },
    ],
    info: {
        indicationSummary: ["Opioide μ-agonista potente, alternativa à morfina com menor liberação de histamina."],
        dosesText: {
            dog: { cri: "0.03-0.1 mg/kg/h", bolus: "0.05-0.1 mg/kg IV/IM/SC" },
            cat: { cri: "0.01-0.05 mg/kg/h", bolus: "0.025-0.05 mg/kg IV/IM/SC" },
            notes: "Gatos: hipertermia paradoxal já descrita – monitorize a temperatura."
        },
        diluents: { recommended: ['NaCl 0.9%', 'SG 5%'] },
        photoprotection: false,
        compatibility: { incompatibilities: ["Soluções alcalinas", "Bicarbonato"] },
        adjustments: {
            hepatic: "Metabolismo hepático. Reduzir a dose em 25-50% em disfunção hepática.",
        },
        monitoring: ["Temperatura (especialmente em gatos)", "Frequência respiratória", "Nível de sedação"],
        goodPractice: [],
        citations: ["Plumb’s Veterinary Drug Handbook, 10th Ed."]
    }
  },
  {
    id: 'buprenorfina',
    name: 'Buprenorfina',
    category: 'Analgésicos e Anestésicos',
    concentrations: [{ value: 300, unit: 'μg/mL', label: '0.3 mg/mL' }],
    criDoses: [
      { species: 'both', cri: { min: 2, max: 4, default: 3, unit: CriDoseUnit.mcg_kg_h } },
    ],
    bolusDoses: [
      { species: 'dog', min: 10, max: 20, unit: BolusDoseUnit.mcg_kg },
      { species: 'cat', min: 20, max: 30, unit: BolusDoseUnit.mcg_kg },
    ],
    info: {
        indicationSummary: ["Agonista parcial μ com alta afinidade e longa duração. Excelente para dor leve a moderada, especialmente em gatos."],
        dosesText: {
            dog: { cri: "2-4 µg/kg/h (após carga)", bolus: "10-20 µg/kg IV/IM" },
            cat: { cri: "Não é prática comum, preferir bolus.", bolus: "20-30 µg/kg IV/IM/SC/OTM" },
            notes: "CRI em gatos é menos comum, preferir regimes intermitentes. Efeito teto para analgesia."
        },
        diluents: { recommended: ['NaCl 0.9%', 'SG 5%'] },
        photoprotection: false,
        compatibility: { incompatibilities: ["Soluções alcalinas"] },
        adjustments: {
            hepatic: "Metabolismo hepático. Usar com cautela e em doses menores em hepatopatas.",
        },
        monitoring: ["Nível de analgesia", "Temperatura (hipertermia rara em gatos)"],
        goodPractice: ["Pode antagonizar o efeito de opioides puros (fentanil) se administrados depois. Naloxona tem dificuldade em reverter seus efeitos."],
        citations: ["Plumb’s Veterinary Drug Handbook, 10th Ed."]
    }
  },
  {
    id: 'butorfanol',
    name: 'Butorfanol',
    category: 'Analgésicos e Anestésicos',
    concentrations: [{ value: 10, unit: 'mg/mL', label: '10 mg/mL' }],
    criDoses: [
      { species: 'both', cri: { min: 0.1, max: 0.4, default: 0.2, unit: CriDoseUnit.mg_kg_h } },
    ],
    bolusDoses: [
      { species: 'both', min: 0.2, max: 0.4, unit: BolusDoseUnit.mg_kg, useCase: "Sedação/Analgesia Leve" }
    ],
    info: {
        indicationSummary: ["Agonista κ e antagonista μ. Útil para analgesia visceral leve a moderada e sedação. Excelente antitussígeno."],
        dosesText: {
            dog: { cri: "0.1-0.4 mg/kg/h", bolus: "0.2-0.4 mg/kg IV/IM/SC" },
            cat: { cri: "0.1-0.4 mg/kg/h", bolus: "0.2-0.4 mg/kg IV/IM/SC" }
        },
        diluents: { recommended: ['NaCl 0.9%', 'SG 5%'] },
        photoprotection: false,
        compatibility: {},
        adjustments: {
            hepatic: "Metabolismo hepático. Reduzir dose em hepatopatas.",
        },
        monitoring: ["Nível de sedação", "Frequência cardíaca"],
        goodPractice: ["Pode reverter parcialmente a analgesia e a depressão respiratória de opioides puros.", "Sua analgesia para dor somática intensa é limitada."],
        citations: ["Plumb’s Veterinary Drug Handbook, 10th Ed."]
    }
  },
  {
    id: 'cetamina',
    name: 'Cetamina',
    category: 'Analgésicos e Anestésicos',
    concentrations: [{ value: 100, unit: 'mg/mL', label: '100 mg/mL' }],
    criDoses: [{ species: 'both', cri: { min: 2, max: 20, default: 10, unit: CriDoseUnit.mcg_kg_min }, recommendedBagInfusionTime: 24 }],
    bolusDoses: [
      { species: 'both', min: 0.25, max: 0.5, unit: BolusDoseUnit.mg_kg },
    ],
    info: {
        indicationSummary: ["Analgésico dissociativo (antagonista NMDA) para analgesia somática, prevenção do 'wind-up' e da tolerância a opioides. Componente chave da analgesia multimodal (MLK/FLK)."],
        dosesText: {
            dog: { cri: "10-20 µg/kg/min (0.6-1.2 mg/kg/h)", bolus: "0.25-0.5 mg/kg IV" },
            cat: { cri: "2-5 µg/kg/min (0.12-0.3 mg/kg/h)", bolus: "0.25-0.5 mg/kg IV" }
        },
        diluents: { recommended: ['NaCl 0.9%', 'SG 5%', 'Ringer Lactato'] },
        photoprotection: false,
        compatibility: { incompatibilities: ["Barbitúricos", "Diazepam (pode precipitar)"], ySite: ["Morfina", "Fentanil", "Lidocaína"] },
        adjustments: {
            renal: "Metabólitos são excretados pelos rins. Reduzir dose em 25-50% em insuficiência renal.",
            cardiac: "Aumenta FC e PA. Usar com cautela em cardiomiopatia hipertrófica ou doença cardíaca severa.",
            neuro: "Usar com cautela em pacientes com aumento da pressão intracraniana.",
        },
        monitoring: ["Frequência cardíaca", "Pressão arterial", "Qualidade da recuperação (pode causar disforia)"],
        goodPractice: ["Sempre usada em combinação com opioides e/ou lidocaína (MLK/FLK) para analgesia multimodal e para mitigar efeitos disfóricos."],
        contraindications: ["Cardiomiopatia hipertrófica obstrutiva (CMHo)", "Hipertensão sistêmica grave não controlada."],
        citations: ["Plumb’s Veterinary Drug Handbook, 10th Ed.", "BSAVA Small Animal Formulary, 10th Ed."]
    }
  },
  {
    id: 'lidocaina',
    name: 'Lidocaína',
    category: 'Analgésicos e Anestésicos',
    concentrations: [{ value: 20, unit: 'mg/mL', label: '2% (20 mg/mL)' }],
    criDoses: [
      { species: 'dog', cri: { min: 25, max: 50, default: 30, unit: CriDoseUnit.mcg_kg_min }, useCase: "Analgesia"},
      { species: 'dog', cri: { min: 25, max: 100, default: 50, unit: CriDoseUnit.mcg_kg_min }, useCase: "Antiarrítmico" },
      { species: 'cat', cri: { min: 10, max: 40, default: 20, unit: CriDoseUnit.mcg_kg_min }, useCase: "Antiarrítmico" },
    ],
    bolusDoses: [
      { species: 'dog', min: 1, max: 2, unit: BolusDoseUnit.mg_kg, notes: "Dose de ataque antiarrítmica. Administrar em alíquotas de 0.5 mg/kg até o efeito (máx 8 mg/kg total)." },
      { species: 'cat', min: 0.25, max: 0.75, unit: BolusDoseUnit.mg_kg, infusionTimeMin: 5, notes: "Risco de toxicidade neurológica e cardiovascular. Administrar muito lentamente." },
    ],
    info: {
        indicationSummary: ["Antiarrítmico (Classe IB) para taquicardias ventriculares, e analgesia sistêmica em cães."],
        dosesText: {
            dog: { cri: "25-50 µg/kg/min (analgesia); 25-100 µg/kg/min (antiarrítmico)", bolus: "1-2 mg/kg IV em alíquotas (antiarrítmico)"},
            cat: { cri: "10-40 µg/kg/min (antiarrítmico)", bolus: "0.25-0.75 mg/kg IV muito lento (5-10 min)" },
            notes: "ALERTA: Gatos são extremamente sensíveis à toxicidade. O uso como analgésico sistêmico em gatos é contraindicado pelo alto risco."
        },
        diluents: { recommended: ['NaCl 0.9%', 'SG 5%', 'Ringer Lactato'] },
        photoprotection: false,
        compatibility: { incompatibilities: ["Anfotericina B", "Pantoprazol"], ySite: ["Fentanil", "Cetamina", "Dobutamina"] },
        adjustments: {
            hepatic: "Metabolismo hepático. Reduzir a dose em 50% em disfunção hepática severa.",
            cardiac: "Reduzir dose em pacientes com baixo débito cardíaco (ex: choque, ICC).",
        },
        monitoring: ["ECG contínuo", "Pressão arterial", "Sinais de toxicidade do SNC (tremores, convulsões, nistagmo, depressão)"],
        goodPractice: ["Sempre usar bomba de infusão.", "Verificar se a apresentação é SEM EPINEFRINA para uso IV."],
        contraindications: ["Hipersensibilidade a anestésicos locais do tipo amida", "Bloqueio atrioventricular de alto grau (sem marcapasso)."],
        citations: ["Plumb’s Veterinary Drug Handbook, 10th Ed.", "BSAVA Small Animal Formulary, 10th Ed."]
    }
  },
  {
    id: 'dexmedetomidina',
    name: 'Dexmedetomidina',
    category: 'Analgésicos e Anestésicos',
    concentrations: [{ value: 500, unit: 'μg/mL', label: '0.5 mg/mL (500 μg/mL)' }],
    criDoses: [{ species: 'both', cri: { min: 0.5, max: 2, default: 1, unit: CriDoseUnit.mcg_kg_h } }],
    bolusDoses: [
        { species: 'both', min: 0.5, max: 2, unit: BolusDoseUnit.mcg_kg, notes: "Administrar lentamente para mitigar efeitos hemodinâmicos." }
    ],
    info: {
      indicationSummary: ["Agonista α2-adrenérgico para sedoanalgesia contínua e redução da dose de outros anestésicos (efeito poupador)."],
      mechanism: "Inibe a liberação de norepinefrina no SNC, induzindo sedação, ansiólise e analgesia.",
      dosesText: {
        dog: { cri: "0.5-2 µg/kg/h", bolus: "0.5-2 µg/kg IV lento" },
        cat: { cri: "0.5-2 µg/kg/h", bolus: "0.5-2 µg/kg IV lento" }
      },
      diluents: { recommended: ['NaCl 0.9%', 'SG 5%', 'Ringer Lactato'] },
      photoprotection: false,
      compatibility: { ySite: ["Morfina", "Fentanil", "Midazolam"] },
      adjustments: {
        cardiac: "Causa bradicardia e vasoconstrição periférica inicial. Evitar em pacientes com doença cardíaca descompensada ou bloqueios AV.",
        hepatic: "Metabolismo hepático. Usar com cautela e em doses menores em hepatopatas.",
        geriatric: "Idosos são mais sensíveis aos efeitos cardiovasculares e sedativos. Iniciar com dose 25-50% menor."
      },
      monitoring: ["Frequência cardíaca (bradicardia é esperada)", "Pressão arterial", "Temperatura (risco de hipotermia)"],
      goodPractice: ["A CRI em microdose fornece analgesia com menor impacto hemodinâmico que bolus.", "Reversível com atipamezol se necessário."],
      contraindications: ["Doença cardiovascular grave", "Disfunção hepática ou renal severa", "Gestação."],
      citations: ["Plumb’s Veterinary Drug Handbook, 10th Ed."]
    }
  },
  {
    id: 'midazolam',
    name: 'Midazolam',
    category: 'Analgésicos e Anestésicos',
    concentrations: [{ value: 5, unit: 'mg/mL', label: '5 mg/mL' }],
    criDoses: [{ species: 'both', cri: { min: 0.04, max: 1, default: 0.25, unit: CriDoseUnit.mg_kg_h }, useCase:"Anticonvulsivante/Sedação" }],
    bolusDoses: [
        { species: 'both', min: 0.2, max: 0.5, unit: BolusDoseUnit.mg_kg, useCase:"Anticonvulsivante/Sedação" }
    ],
     info: {
        indicationSummary: ["Tratamento de primeira linha para status epilepticus e convulsões em cluster. Coadjuvante na sedação e anestesia para relaxamento muscular e amnésia."],
        mechanism: "Potencializa o efeito inibitório do GABA no SNC.",
        dosesText: {
            dog: { cri: "0.04–0.25 mg/kg/h (até 1 mg/kg/h em SE)", bolus: "0.2-0.5 mg/kg IV" },
            cat: { cri: "1–2 mg/kg/h", bolus: "0.2-0.5 mg/kg IV" },
            notes: "Em gatos, pode causar excitação paradoxal se usado isoladamente. Evitar bicarbonato e soluções muito ricas em cálcio."
        },
        diluents: { recommended: ['NaCl 0.9%', 'SG 5%'], notes: "Pode precipitar em Ringer Lactato. Padronize a diluição em NaCl 0.9% ou SG 5%." },
        photoprotection: false,
        compatibility: { ySite: ["Fentanil", "Morfina", "Hidromorfona"], incompatibilities: ["Anfotericina B", "Furosemida", "Pantoprazol", "Bicarbonato"] },
        adjustments: {
            renal: "Metabólitos ativos podem se acumular. Considere reduzir a dose em disfunção renal severa.",
            hepatic: "Reduzir a dose em 25-50%. O metabolismo hepático é a principal via de eliminação.",
        },
        monitoring: ["Nível de sedação", "Frequência e esforço respiratório"],
        goodPractice: ["Frequentemente usado em combinação com opioides para sedação balanceada.", "Antagonista (flumazenil) está disponível para reversão."],
        contraindications: ["Hipersensibilidade a benzodiazepínicos", "Glaucoma de ângulo fechado."],
        citations: ["Plumb’s Veterinary Drug Handbook, 10th Ed."]
    }
  },
  {
    id: 'propofol',
    name: 'Propofol',
    category: 'Analgésicos e Anestésicos',
    concentrations: [{ value: 10, unit: 'mg/mL', label: '10 mg/mL (1%)' }],
    criDoses: [{ species: 'both', cri: { min: 0.1, max: 0.4, default: 0.2, unit: CriDoseUnit.mg_kg_min } }],
    bolusDoses: [
      { species: 'dog', min: 2, max: 6, unit: BolusDoseUnit.mg_kg, useCase: "Indução anestésica" },
      { species: 'cat', min: 4, max: 8, unit: BolusDoseUnit.mg_kg, useCase: "Indução anestésica" },
    ],
    info: {
      indicationSummary: ["Agente hipnótico de curta duração para indução e manutenção de anestesia, e tratamento de status epilepticus refratário."],
      mechanism: "Potencializa o efeito inibitório do neurotransmissor GABA.",
      dosesText: {
        dog: { cri: "0.1-0.4 mg/kg/min (manutenção anestésica)", bolus: "2-6 mg/kg IV (indução)" },
        cat: { cri: "0.1-0.4 mg/kg/min (manutenção anestésica)", bolus: "4-8 mg/kg IV (indução)" },
        notes: "Gatos: uso prolongado (>30 min) ou doses repetidas podem causar estresse oxidativo, formação de corpos de Heinz e recuperação prolongada. Use com cautela e pela menor duração possível."
      },
      diluents: { recommended: [], notes: "Administrar puro (emulsão lipídica). Não diluir." },
      photoprotection: false,
      compatibility: { ySite: ["Midazolam", "Fentanil"], notes: "Por ser uma emulsão lipídica, prefira linha exclusiva para evitar instabilidade de outras soluções." },
      adjustments: {
        hepatic: "Usar com cautela em hepatopatas; o clearance pode ser reduzido.",
        cardiac: "Causa vasodilatação e depressão miocárdica. Reduzir dose em pacientes com instabilidade cardiovascular.",
        pediatric: "Usar com cautela, titular a dose para o efeito."
      },
      monitoring: ["Pressão arterial", "Frequência e padrão respiratório, SpO2, ETCO2", "Temperatura"],
      goodPractice: ["Técnica asséptica rigorosa no manuseio. Frascos sem conservantes devem ser descartados após 6-12h.", "Administrar com analgesia adequada, pois não possui efeito analgésico."],
      citations: ["Plumb’s Veterinary Drug Handbook, 10th Ed."]
    }
  },
   {
    id: 'alfaxalona',
    name: 'Alfaxalona',
    category: 'Analgésicos e Anestésicos',
    concentrations: [{ value: 10, unit: 'mg/mL', label: '10 mg/mL' }],
    criDoses: [
        { species: 'dog', cri: { min: 6, max: 9, default: 7, unit: CriDoseUnit.mg_kg_h } },
        { species: 'cat', cri: { min: 7, max: 11, default: 8, unit: CriDoseUnit.mg_kg_h } },
    ],
    bolusDoses: [
      { species: 'dog', min: 2, max: 3, unit: BolusDoseUnit.mg_kg, useCase: "Indução" },
      { species: 'cat', min: 2, max: 5, unit: BolusDoseUnit.mg_kg, useCase: "Indução" },
    ],
    info: {
      indicationSummary: ["Anestésico neuroesteroide para indução e manutenção da anestesia."],
      mechanism: "Modulador do receptor GABA-A, similar ao propofol.",
      dosesText: {
        dog: { cri: "6-9 mg/kg/h", bolus: "2-3 mg/kg IV" },
        cat: { cri: "7-11 mg/kg/h", bolus: "2-5 mg/kg IV" },
        notes: "A dose de indução pode ser reduzida com pré-medicação adequada."
      },
      diluents: { recommended: ['NaCl 0.9%', 'SG 5%'], notes: "Pode ser administrado puro ou diluído para CRI." },
      photoprotection: false,
      compatibility: { notes: "Não misturar com outros fármacos na mesma seringa." },
      adjustments: {
        cardiac: "Depressão cardiorrespiratória dose-dependente, mas geralmente menos pronunciada que o propofol.",
        hepatic: "Metabolismo hepático. Usar com cautela e titular a dose.",
        pregnancy: "Comum em cesáreas, mas usar a menor dose eficaz."
      },
      monitoring: ["Pressão arterial", "Frequência respiratória", "Saturação de oxigênio"],
      goodPractice: ["Recuperação pode ser agitada se não houver pré-medicação ou analgesia adequada."],
      citations: ["Plumb’s Veterinary Drug Handbook, 10th Ed.", "BSAVA Small Animal Formulary, 10th Ed."]
    }
  },
  // --- Infusões Combinadas ---
  {
    id: 'mlk_dog',
    name: 'MLK (Morfina, Lido, Cetamina) para Cães',
    category: 'Infusões Combinadas',
    concentrations: [],
    criDoses: [],
    isCombo: true,
    comboDetails: {
        description: 'Protocolo analgésico multimodal clássico para dor severa em cães. Calcule a receita para qualquer volume de seringa ou bolsa.',
        targetSpecies: 'dog',
        ingredients: [
            { drugId: 'morfina', name: 'Morfina', dose: 0.2, unit: CriDoseUnit.mg_kg_h },
            { drugId: 'lidocaina', name: 'Lidocaína', dose: 2.1, unit: CriDoseUnit.mg_kg_h }, // 35 mcg/kg/min
            { drugId: 'cetamina', name: 'Cetamina', dose: 0.6, unit: CriDoseUnit.mg_kg_h }, // 10 mcg/kg/min
        ],
    }
  },
  {
    id: 'flk_dog',
    name: 'FLK (Fentanil, Lido, Cetamina) para Cães',
    category: 'Infusões Combinadas',
    concentrations: [],
    criDoses: [],
    isCombo: true,
    comboDetails: {
        description: 'Alternativa à MLK, útil para analgesia potente em cães, especialmente no período transoperatório. O fentanil permite titulação mais rápida.',
        targetSpecies: 'dog',
        ingredients: [
            { drugId: 'fentanil', name: 'Fentanil', dose: 4, unit: CriDoseUnit.mcg_kg_h },
            { drugId: 'lidocaina', name: 'Lidocaína', dose: 2.1, unit: CriDoseUnit.mg_kg_h }, // 35 mcg/kg/min
            { drugId: 'cetamina', name: 'Cetamina', dose: 0.6, unit: CriDoseUnit.mg_kg_h }, // 10 mcg/kg/min
        ],
        notes: 'A dose de Lidocaína neste protocolo (2.1 mg/kg/h ou 35 mcg/kg/min) é uma dose analgésica padrão. Monitore o paciente de perto para sinais de toxicidade.'
    }
  },
  // --- Agentes Cardiovasculares ---
  {
    id: 'dobutamina',
    name: 'Dobutamina',
    category: 'Agentes Cardiovasculares',
    concentrations: [{ value: 12500, unit: 'μg/mL', label: '250mg em 20mL (padrão)' }],
    preparationGuide: `A dobutamina deve ser diluída. Uma preparação comum é adicionar <strong>250mg (20mL)</strong> em uma bolsa de <strong>250mL</strong> de SG 5% ou NaCl 0.9%, resultando em uma concentração de <strong>1000 µg/mL (1mg/mL)</strong>. A calculadora pode usar a concentração do frasco ou a da sua solução final.`,
    criDoses: [
        { species: 'dog', cri: { min: 2, max: 20, default: 7.5, unit: CriDoseUnit.mcg_kg_min } },
        { species: 'cat', cri: { min: 1, max: 10, default: 5, unit: CriDoseUnit.mcg_kg_min } },
    ],
    info: {
        indicationSummary: ["Suporte inotrópico para disfunção miocárdica e choque cardiogênico (ex: CMD, ICC severa)."],
        mechanism: "Agonista β1-adrenérgico que aumenta a contratilidade com menor efeito na frequência cardíaca.",
        dosesText: {
            dog: { cri: "2-20 µg/kg/min", bolus: "Não recomendado" },
            cat: { cri: "1-10 µg/kg/min", bolus: "Não recomendado"},
            notes: "Gatos são mais sensíveis a taquiarritmias; iniciar com doses mais baixas (1-5 μg/kg/min). Taquifilaxia (perda de efeito) pode ocorrer após 48-72h."
        },
        diluents: { recommended: ['NaCl 0.9%', 'SG 5%'], notes: "A solução pode ficar rosada, o que não indica perda de potência." },
        photoprotection: false,
        compatibility: { incompatibilities: ["Bicarbonato", "Furosemida", "Diazepam"], ySite: ["Norepinefrina", "Dopamina", "Fentanil"] },
        adjustments: {
            cardiac: "Titular para o efeito desejado. Doses altas podem causar taquicardia e arritmias.",
        },
        monitoring: ["ECG contínuo", "Pressão arterial", "Ecocardiograma para avaliar contratilidade", "Lactato"],
        goodPractice: ["Titular a dose lentamente para atingir o efeito clínico desejado.", "Corrigir hipovolemia antes de iniciar."],
        citations: ["Plumb’s Veterinary Drug Handbook, 10th Ed."]
    }
  },
  {
    id: 'dopamina',
    name: 'Dopamina',
    category: 'Agentes Cardiovasculares',
    specialWarnings: [WarningType.Vesicant],
    concentrations: [{ value: 5, unit: 'mg/mL', label: '5 mg/mL' }],
    criDoses: [
        { species: 'dog', cri: { min: 2, max: 10, default: 5, unit: CriDoseUnit.mcg_kg_min } },
        { species: 'cat', cri: { min: 1, max: 5, default: 3, unit: CriDoseUnit.mcg_kg_min } }
    ],
    info: {
        indicationSummary: ["Suporte hemodinâmico para hipotensão refratária. Efeitos dose-dependentes."],
        mechanism: "Doses de 5-10 µg/kg/min têm efeito β1 (inotropismo). Doses >10 µg/kg/min têm efeito α1 (vasoconstrição). O conceito de 'dose renal' (1-3 µg/kg/min) é obsoleto e não recomendado.",
        dosesText: {
            dog: { cri: "5-15 µg/kg/min" },
            cat: { cri: "2-10 µg/kg/min" },
            notes: "Norepinefrina é a primeira escolha em choque séptico. Dopamina pode ser arritmogênica."
        },
        diluents: { recommended: ['NaCl 0.9%', 'SG 5%', 'Ringer Lactato'] },
        photoprotection: true,
        compatibility: { incompatibilities: ["Bicarbonato", "Ampicilina", "Anfotericina B"], ySite: ["Dobutamina", "Norepinefrina", "Fentanil"] },
        adjustments: {},
        monitoring: ["ECG contínuo", "Pressão arterial (idealmente invasiva)", "Débito urinário"],
        goodPractice: ["ALERTA VESICANTE: Extravasamento pode causar necrose tecidual. Administrar em veia central se possível.", "Corrigir hipovolemia antes de iniciar a infusão."],
        contraindications: ["Feocromocitoma", "Taquiarritmias ventriculares não tratadas."],
        citations: ["Plumb’s Veterinary Drug Handbook, 10th Ed.", "BSAVA Small Animal Formulary, 10th Ed."]
    }
  },
  {
    id: 'norepinefrina',
    name: 'Norepinefrina',
    category: 'Agentes Cardiovasculares',
    concentrations: [{ value: 1, unit: 'mg/mL', label: '1 mg/mL' }],
    criDoses: [ { species: 'both', cri: { min: 0.05, max: 2, default: 0.2, unit: CriDoseUnit.mcg_kg_min } } ],
    specialWarnings: [WarningType.Photoprotection, WarningType.Vesicant],
    info: {
        indicationSummary: ["Vasopressor de primeira escolha para o tratamento da hipotensão em choque séptico e outros choques distributivos."],
        mechanism: "Potente agonista α1-adrenérgico (vasoconstrição) com efeito β1 moderado (inotropismo).",
        dosesText: {
            dog: { cri: "0.05-2 µg/kg/min (titulável)" },
            cat: { cri: "0.05-2 µg/kg/min (titulável)" },
            notes: "Titular para atingir a meta de pressão arterial média (ex: PAM > 65-70 mmHg)."
        },
        diluents: { recommended: ['SG 5%'], notes: "Diluir em soluções com dextrose (SG 5%) para reduzir oxidação e perda de potência. Evitar NaCl 0.9% isolado." },
        photoprotection: true,
        compatibility: { incompatibilities: ["Bicarbonato", "Aminofilina", "Pantoprazol", "Insulina"], ySite: ["Dobutamina", "Dopamina", "Fentanil", "Vasopressina"] },
        adjustments: {
            sepsis: "Titular para atingir a meta de pressão arterial média. Reavaliar a perfusão (lactato, débito urinário) frequentemente."
        },
        monitoring: ["Pressão arterial invasiva (obrigatório)", "ECG contínuo", "Lactato sérico", "Perfusão periférica"],
        goodPractice: ["ALERTA VESICANTE. Administrar via cateter venoso central.", "Titular a dose lentamente para evitar hipertensão rebote.", "Não retirar abruptamente."],
        citations: ["Plumb’s Veterinary Drug Handbook, 10th Ed."]
    }
  },
   {
    id: 'nitroprussiato',
    name: 'Nitroprussiato de Sódio',
    category: 'Agentes Cardiovasculares',
    isPowder: true,
    preparationGuide: `Este fármaco é um pó que requer preparo e diluição cuidadosos e é <strong>fotossensível</strong>.<br><br><strong>Instruções para preparo (solução de 200 µg/mL):</strong><ol class="list-decimal list-inside mt-2 space-y-1"><li>Reconstitua o frasco de <strong>50 mg</strong> com 2-3 mL de SG 5%.</li><li>Adicione a solução reconstituída em uma bolsa de <strong>250 mL de SG 5%</strong>.</li><li><strong>Proteja a bolsa e a linha de infusão da luz imediatamente.</strong></li></ol>`,
    concentrations: [{ value: 200, unit: 'μg/mL', label: '200 μg/mL (ex: 50mg/250mL)'}],
    criDoses: [{ species: 'both', cri: { min: 0.5, max: 5, default: 1, unit: CriDoseUnit.mcg_kg_min } }],
    specialWarnings: [WarningType.Photoprotection],
    info: {
        indicationSummary: ["Vasodilatador arterial e venoso potente para crise hipertensiva e insuficiência cardíaca aguda. Apenas em ambiente de UTI com monitorização contínua da PA."],
        mechanism: "Doa óxido nítrico (NO), causando relaxamento do músculo liso vascular.",
        dosesText: {
            dog: { cri: "0.5-5 µg/kg/min (titulável)" },
            cat: { cri: "0.5-3 µg/kg/min (titulável)" },
            notes: "Alvo: reduzir PA ≈25% em 4h. Doses >3 µg/kg/min aumentam risco de toxicidade por cianeto."
        },
        diluents: { recommended: ['SG 5%'], notes: "Uso exclusivo com SG 5%. Proteger o frasco/bolsa da luz." },
        photoprotection: true,
        compatibility: { incompatibilities: ["Não misturar outras drogas no mesmo frasco."], ySite: ["Dobutamina", "Fentanil", "Norepinefrina", "Lidocaína", "Midazolam"] },
        adjustments: {
            renal: "Risco de acúmulo do metabólito tóxico tiocianato em uso prolongado (>24h).",
            hepatic: "Metabolismo do cianeto é hepático. Usar mínima dose eficaz.",
            geriatric: "Idosos podem ter maior sensibilidade à hipotensão.",
            pediatric: "Usar com cautela, iniciar na borda inferior da dose.",
            pregnancy: "Risco fetal de toxicidade por cianeto. Usar somente se benefício superar o risco."
        },
        monitoring: ["Pressão arterial invasiva (obrigatório)", "Estado ácido-base (acidose metabólica é sinal precoce de toxicidade por cianeto)", "Lactato", "Sinais de toxicidade por tiocianato se uso > 48h"],
        goodPractice: ["Não dar flush na linha (risco de bolus e hipotensão severa).", "Considerar co-infusão de hidroxocobalamina em uso prolongado.", "Descartar a solução se ficar azul, verde ou muito escura."],
        contraindications: ["Hipertensão compensatória (ex: shunt portossistêmico, estenose aórtica)."],
        citations: ["Plumb’s 10th ed. – preparo em D5W e proteção da luz", "Plumb’s 10th ed. – doses e monitorização"]
    }
  },
   {
    id: 'diltiazem',
    name: 'Diltiazem',
    category: 'Agentes Cardiovasculares',
    concentrations: [{ value: 5, unit: 'mg/mL', label: '5 mg/mL' }],
    criDoses: [
      { species: 'dog', cri: { min: 2, max: 6, default: 4, unit: CriDoseUnit.mcg_kg_min } }
    ],
    bolusDoses: [
      { species: 'dog', min: 0.1, max: 0.35, unit: BolusDoseUnit.mg_kg, infusionTimeMin: 2 },
      { species: 'cat', min: 0.1, max: 0.25, unit: BolusDoseUnit.mg_kg, infusionTimeMin: 2 },
    ],
    info: {
        indicationSummary: ["Bloqueador de canal de cálcio (Classe IV) para controle da resposta ventricular em fibrilação atrial e taquicardias supraventriculares."],
        dosesText: {
            dog: { cri: "2-6 µg/kg/min", bolus: "0.1-0.35 mg/kg IV lento (2 min)" },
            cat: { cri: "Não é prática comum.", bolus: "0.1-0.25 mg/kg IV lento (2 min)" },
        },
        diluents: { recommended: ['NaCl 0.9%', 'SG 5%'] },
        photoprotection: true,
        compatibility: { incompatibilities: ["Bicarbonato", "Furosemida"] },
        adjustments: {
            cardiac: "Efeito inotrópico negativo. Usar com extrema cautela em insuficiência cardíaca congestiva descompensada.",
            hepatic: "Metabolismo hepático. Reduzir a dose em hepatopatas.",
            renal: "Excreção renal. Reduzir a dose em nefropatas.",
        },
        monitoring: ["ECG contínuo", "Pressão arterial"],
        goodPractice: ["Não administrar com beta-bloqueadores IV pelo risco de depressão miocárdica severa."],
        contraindications: ["Bloqueio AV de 2º ou 3º grau (sem marcapasso)", "Hipotensão severa", "Síndrome do nó sinusal doente."],
        citations: ["Plumb’s Veterinary Drug Handbook, 10th Ed."]
    }
  },
  {
    id: 'esmolol',
    name: 'Esmolol',
    category: 'Agentes Cardiovasculares',
    concentrations: [{ value: 10, unit: 'mg/mL', label: '10 mg/mL' }],
    criDoses: [
      { species: 'both', cri: { min: 25, max: 200, default: 50, unit: CriDoseUnit.mcg_kg_min } }
    ],
    bolusDoses: [
      { species: 'dog', min: 250, max: 500, unit: BolusDoseUnit.mcg_kg, infusionTimeMin: 1 },
      { species: 'cat', min: 50, max: 250, unit: BolusDoseUnit.mcg_kg, infusionTimeMin: 1 },
    ],
    info: {
        indicationSummary: ["β-bloqueador cardiosseletivo (β1) de ação ultracurta para controle rápido de taquiarritmias supraventriculares."],
        dosesText: {
            dog: { cri: "25-200 µg/kg/min", bolus: "0.25-0.5 mg/kg IV em 1 min" },
            cat: { cri: "25-200 µg/kg/min", bolus: "0.05-0.25 mg/kg IV em 1 min" },
        },
        diluents: { recommended: ['NaCl 0.9%', 'SG 5%', 'Ringer Lactato'] },
        photoprotection: false,
        compatibility: { },
        adjustments: {
            cardiac: "Usar com cautela extrema em pacientes com função sistólica comprometida.",
        },
        monitoring: ["ECG contínuo", "Pressão arterial"],
        goodPractice: ["Seu efeito cessa rapidamente após a interrupção da infusão."],
        contraindications: ["Insuficiência cardíaca descompensada", "Choque cardiogênico", "Bradicardia sinusal severa", "Bloqueio AV de alto grau."],
        citations: ["Plumb’s Veterinary Drug Handbook, 10th Ed."]
    }
  },
  {
    id: 'vasopressina',
    name: 'Vasopressina',
    category: 'Agentes Cardiovasculares',
    concentrations: [{ value: 20, unit: 'U/mL', label: '20 U/mL' }],
    criDoses: [
      { species: 'both', cri: { min: 0.1, max: 1, default: 0.3, unit: CriDoseUnit.mU_kg_min } }
    ],
    bolusDoses: [
      { species: 'both', min: 0.2, max: 0.8, unit: BolusDoseUnit.U_kg, useCase: "PCR (RECOVER)" }
    ],
    info: {
        indicationSummary: ["Hormônio antidiurético com efeito vasopressor (não catecolaminérgico). Usado em choque refratário a catecolaminas e em PCR."],
        mechanism: "Agonista do receptor V1, causando vasoconstrição. Não depende de receptores adrenérgicos.",
        dosesText: {
            dog: { cri: "0.1-1 mU/kg/min", bolus: "0.2-0.8 U/kg (PCR)" },
            cat: { cri: "0.1-1 mU/kg/min", bolus: "0.2-0.8 U/kg (PCR)" },
        },
        diluents: { recommended: ['NaCl 0.9%', 'SG 5%'] },
        photoprotection: false,
        compatibility: { ySite: ["Norepinefrina", "Dobutamina", "Dopamina"] },
        adjustments: {},
        monitoring: ["Pressão arterial", "Débito urinário", "Perfusão periférica (risco de isquemia)"],
        goodPractice: ["Não titular como a norepinefrina. A dose é geralmente fixa ou ajustada minimamente.", "Adjuvante à norepinefrina, não um substituto."],
        citations: ["Plumb’s Veterinary Drug Handbook, 10th Ed."]
    }
  },
  // --- Bloqueadores Neuromusculares ---
  {
    id: 'rocuronio',
    name: 'Rocurônio',
    category: 'Bloqueadores Neuromusculares',
    concentrations: [{ value: 10, unit: 'mg/mL', label: '10 mg/mL' }],
    criDoses: [{ species: 'both', cri: { min: 0.2, max: 0.6, default: 0.3, unit: CriDoseUnit.mg_kg_h } }],
    bolusDoses: [{ species: 'both', min: 0.4, max: 0.6, unit: BolusDoseUnit.mg_kg }],
    specialWarnings: [WarningType.VentilatorySupport],
    info: {
        indicationSummary: ["Bloqueador neuromuscular não-despolarizante de início rápido. Usado para facilitar intubação e prover relaxamento muscular durante cirurgia."],
        dosesText: {
            dog: { cri: "0.2-0.6 mg/kg/h", bolus: "0.4-0.6 mg/kg IV" },
            cat: { cri: "0.2-0.6 mg/kg/h", bolus: "0.4-0.6 mg/kg IV" },
        },
        diluents: { recommended: ['NaCl 0.9%', 'SG 5%', 'Ringer Lactato'] },
        photoprotection: false,
        compatibility: {},
        adjustments: {
            hepatic: "Duração pode ser prolongada em doença hepática.",
            renal: "Excreção renal parcial. Usar com cautela.",
        },
        monitoring: ["Monitor de transmissão neuromuscular (TOF)", "Ventilação (capnografia, volume corrente)"],
        goodPractice: ["Sempre administrar com sedação/anestesia profunda. Não possui efeito analgésico.", "Reversível com neostigmina/glicopirrolato ou sugamadex."],
        citations: ["Plumb’s Veterinary Drug Handbook, 10th Ed."]
    }
  },
  {
    id: 'atracurio',
    name: 'Atracúrio',
    category: 'Bloqueadores Neuromusculares',
    concentrations: [{ value: 10, unit: 'mg/mL', label: '10 mg/mL' }],
    criDoses: [{ species: 'both', cri: { min: 3, max: 9, default: 5, unit: CriDoseUnit.mcg_kg_min } }],
    bolusDoses: [{ species: 'both', min: 0.2, max: 0.5, unit: BolusDoseUnit.mg_kg }],
    specialWarnings: [WarningType.VentilatorySupport],
    info: {
        indicationSummary: ["Bloqueador neuromuscular não-despolarizante ideal para pacientes com disfunção hepática ou renal."],
        mechanism: "Metabolismo por eliminação de Hofmann (degradação espontânea em pH e temperatura fisiológicos).",
        dosesText: {
            dog: { cri: "3-9 µg/kg/min", bolus: "0.2-0.5 mg/kg IV" },
            cat: { cri: "3-9 µg/kg/min", bolus: "0.2-0.5 mg/kg IV" },
        },
        diluents: { recommended: ['NaCl 0.9%', 'SG 5%'] },
        photoprotection: false,
        compatibility: {},
        adjustments: {
            renal: "Não necessita de ajuste de dose.",
            hepatic: "Não necessita de ajuste de dose."
        },
        monitoring: ["Monitor de transmissão neuromuscular (TOF)", "Ventilação"],
        goodPractice: ["Pode causar liberação de histamina se administrado em bolus rápido. Administrar lentamente (1-2 min).", "Sempre administrar com sedação/anestesia profunda."],
        citations: ["Plumb’s Veterinary Drug Handbook, 10th Ed."]
    }
  },
  // --- Antimicrobianos ---
  {
    id: 'ampicilina-sulbactam',
    name: 'Ampicilina/Sulbactam',
    category: 'Antimicrobianos',
    concentrations: [],
    isPowder: true,
    preparationGuide: "Reconstitua o frasco de 1.5g com 3.2mL de água estéril para obter uma concentração final de 375 mg/mL. Dilua a dose necessária em SF 0.9% para infusão em 15-30 min.",
    bolusDoses: [
        { species: 'both', min: 20, max: 30, unit: BolusDoseUnit.mg_kg, infusionTimeMin: 20, notes: "Infusão intermitente q6-8h" }
    ],
    info: {
        indicationSummary: ["Beta-lactâmico com inibidor de β-lactamase para infecções por cocos Gram+ e anaeróbios."],
        dosesText: {
            dog: { cri: "Não aplicável", bolus: "20-30 mg/kg IV q6-8h, infusão em 15-30 min." },
            cat: { cri: "Não aplicável", bolus: "20-30 mg/kg IV q6-8h, infusão em 15-30 min." },
            notes: "Profilaxia cirúrgica: 22 mg/kg IV ~1 h antes da incisão; redosar a cada 2 h."
        },
        diluents: {
            recommended: ['NaCl 0.9%'],
            notes: "Estabilidade reduzida em Ringer Lactato. Prefira NaCl 0.9%."
        },
        compatibility: {
            incompatibilities: ["Amiodarona", "Anfotericina B", "Hidrocortisona"],
        },
        photoprotection: false,
        adjustments: {
            renal: "Ajustar intervalo em disfunção renal severa."
        },
        monitoring: ["Sinais de reação alérgica", "Função renal em uso prolongado"],
        goodPractice: ["Administrar em infusão lenta (15-30 min) para reduzir flebite."],
        citations: ["Plumb’s Veterinary Drug Handbook, 10th Ed."]
    }
  },
  // --- Endócrino ---
  {
    id: 'insulina-regular',
    name: 'Insulina Regular (Humulin R, Novolin R)',
    category: 'Endócrino',
    concentrations: [{ value: 100, unit: 'U/mL', label: '100 U/mL' }],
    criDoses: [{ species: 'both', cri: { min: 0.05, max: 0.1, default: 0.08, unit: CriDoseUnit.U_kg_h } }],
    bolusDoses: [
      { species: 'both', min: 0.1, max: 0.25, unit: BolusDoseUnit.U_kg, notes: "Administrar apenas se Potássio > 3.5 mEq/L" }
    ],
    info: {
        indicationSummary: ["Insulina de ação rápida para tratamento de cetoacidose diabética (CAD) e hiperglicemia severa em pacientes críticos."],
        mechanism: "Liga-se a receptores celulares para facilitar a captação de glicose pelos tecidos muscular e adiposo, reduzindo a glicemia. Promove o armazenamento de glicogênio e inibe a gliconeogênese hepática.",
        dosesText: {
            dog: { cri: "0.05-0.1 U/kg/h", bolus: "0.1-0.25 U/kg IV (apenas se K+ > 3.5 mEq/L)" },
            cat: { cri: "0.05-0.1 U/kg/h", bolus: "0.1-0.25 U/kg IV (apenas se K+ > 3.5 mEq/L)" },
            notes: "Objetivo na CAD: reduzir a glicemia em 50-75 mg/dL por hora. Queda muito rápida pode causar edema cerebral. As doses de manutenção SC são diferentes."
        },
        diluents: { recommended: ['NaCl 0.9%'] },
        photoprotection: false,
        compatibility: {
            incompatibilities: ["Norepinefrina", "Dobutamina"],
            notes: "É comum administrar em linha separada para evitar adsorção e garantir precisão. Interações: Efeito hipoglicêmico aumentado por beta-bloqueadores, salicilatos. Efeito diminuído por corticosteroides, diuréticos tiazídicos."
        },
        adjustments: {
            renal: "Reduzir dose em 25-50% em disfunção renal, pelo risco de hipoglicemia.",
            pregnancy: "A necessidade de insulina pode variar. Monitoramento intensivo é necessário."
        },
        monitoring: ["Glicemia (a cada 1-2h em CAD)", "Potássio e Fósforo sérico (a cada 4-6h)", "Estado ácido-base", "Sinais clínicos de hipoglicemia (fraqueza, ataxia, tremores, convulsões)"],
        goodPractice: ["Sempre usar seringas U-100 para a insulina de 100 U/mL para evitar erros de dosagem.", "Para CRI, lavar o equipo com ~50mL da solução de insulina para saturar os sítios de ligação do plástico antes de conectar ao paciente.", "Ajustar a taxa de infusão baseado em medições seriadas de glicose."],
        contraindications: ["Hipoglicemia"],
        citations: ["Plumb’s Veterinary Drug Handbook, 10th Ed.", "DiBartola – Fluid, Electrolyte, and Acid-Base Disorders"]
    }
  },
  {
    id: 'insulina-nph',
    name: 'Insulina NPH (Isofana)',
    category: 'Endócrino',
    concentrations: [{ value: 100, unit: 'U/mL', label: 'U-100 (100 U/mL)' }],
    bolusDoses: [
      { species: 'dog', min: 0.25, max: 0.5, unit: BolusDoseUnit.U_kg, notes: "Dose inicial para MANEJO CRÔNICO via SUBCUTÂNEA (SC) a cada 12-24h. NÃO é um bólus IV. Ajustar conforme curva glicêmica." },
      { species: 'cat', min: 0.25, max: 0.5, unit: BolusDoseUnit.U_kg, notes: "Dose inicial para MANEJO CRÔNICO via SUBCUTÂNEA (SC) a cada 12h. Em gatos, a dosagem por peso é um ponto de partida, muitos iniciam com 1-2 U/gato. NÃO é um bólus IV. Ajustar conforme curva glicêmica." }
    ],
    info: {
      indicationSummary: ["Insulina de ação intermediária para o tratamento de manutenção de Diabetes Mellitus em cães e gatos."],
      mechanism: "Facilita a captação de glicose pelas células, promove o armazenamento de glicogênio e inibe a produção hepática de glicose. A adição de protamina retarda sua absorção e prolonga a ação.",
      dosesText: {
        dog: { cri: "Não aplicável", bolus: "0.25-0.5 U/kg SC q12-24h (dose inicial)" },
        cat: { cri: "Não aplicável", bolus: "0.25-0.5 U/kg SC q12h (dose inicial, ou 1-2 U/gato)" },
        notes: "Farmacocinética (início/pico/duração): Cães (0.5-3h / 2-10h / 6-24h), Gatos (0.5-3h / 2-8h / 4-12h). Ajuste fino é essencial e baseado em curvas glicêmicas."
      },
      diluents: { recommended: [], notes: "Não diluir. Administrar conforme a concentração do frasco." },
      photoprotection: false,
      compatibility: {
          notes: "Interações: Efeito hipoglicêmico aumentado por beta-bloqueadores, salicilatos. Efeito diminuído por corticosteroides, diuréticos tiazídicos."
      },
      adjustments: {
          renal: "Monitorar de perto. A necessidade de insulina pode diminuir.",
          hepatic: "Monitorar de perto. A necessidade de insulina pode mudar.",
          pregnancy: "A necessidade de insulina pode variar durante a gestação. Monitoramento intensivo é necessário."
      },
      monitoring: ["Curva glicêmica seriada", "Sinais clínicos de hipoglicemia (fraqueza, ataxia, convulsões)", "Glicosúria", "Consumo de água e apetite", "Peso corporal"],
      goodPractice: ["Homogeneizar a suspensão rolando o frasco suavemente entre as mãos. Não agitar vigorosamente.", "Variar os locais de injeção subcutânea para evitar lipodistrofia.", "Educar o tutor sobre os sinais de hipoglicemia e como agir."],
      contraindications: ["Hipoglicemia"],
      citations: ["Plumb’s Veterinary Drug Handbook", "Feldman and Nelson's Canine and Feline Endocrinology and Reproduction"]
    }
  },
  {
    id: 'insulina-pzi',
    name: 'Insulina PZI (Protamina Zinco)',
    category: 'Endócrino',
    concentrations: [{ value: 40, unit: 'U/mL', label: 'U-40 (40 U/mL)' }],
    bolusDoses: [
      { species: 'dog', min: 0.25, max: 0.5, unit: BolusDoseUnit.U_kg, notes: "Dose inicial para MANEJO CRÔNICO via SUBCUTÂNEA (SC) a cada 12-24h. NÃO é um bólus IV. Ajustar conforme curva glicêmica." },
      { species: 'cat', min: 0.25, max: 0.5, unit: BolusDoseUnit.U_kg, notes: "Dose inicial para MANEJO CRÔNICO via SUBCUTÂNEA (SC) a cada 12h. Em gatos, a dose inicial comum é de 1-2 U/gato. NÃO é um bólus IV. Ajustar conforme curva glicêmica." }
    ],
    info: {
      indicationSummary: ["Insulina de ação prolongada para o tratamento de manutenção de Diabetes Mellitus, especialmente popular em gatos."],
      mechanism: "Facilita a captação de glicose pelas células, promove o armazenamento de glicogênio e inibe a produção hepática de glicose. A adição de protamina e zinco em excesso prolonga significativamente sua absorção e duração.",
      dosesText: {
        dog: { cri: "Não aplicável", bolus: "0.25-0.5 U/kg SC q12-24h (dose inicial)" },
        cat: { cri: "Não aplicável", bolus: "1-2 U/gato SC q12h (dose inicial comum)" },
        notes: "Estas são doses de manutenção para administração subcutânea. O ajuste fino é essencial e baseado em curvas glicêmicas. A dose de pico é tipicamente alcançada após vários dias de tratamento."
      },
      diluents: { recommended: [], notes: "Não diluir. Usar seringas U-40 específicas para esta concentração para evitar erros de dosagem." },
      photoprotection: false,
      compatibility: {
        notes: "Interações: Efeito hipoglicêmico aumentado por beta-bloqueadores, salicilatos. Efeito diminuído por corticosteroides, diuréticos tiazídicos."
      },
      adjustments: {
          renal: "Monitorar de perto. A necessidade de insulina pode diminuir.",
          hepatic: "Monitorar de perto. A necessidade de insulina pode mudar.",
          pregnancy: "A necessidade de insulina pode variar. Monitoramento intensivo é necessário."
      },
      monitoring: ["Curva glicêmica seriada", "Sinais de hipoglicemia", "Glicosúria", "Frutosamina (para avaliação a longo prazo)", "Peso corporal"],
      goodPractice: ["Homogeneizar a suspensão rolando o frasco suavemente. Não agitar.", "Usar apenas seringas calibradas para U-40.", "A remissão diabética é uma possibilidade em gatos; monitorar de perto para evitar hipoglicemia."],
      contraindications: ["Hipoglicemia"],
      citations: ["Plumb’s Veterinary Drug Handbook", "AAHA Diabetes Management Guidelines for Dogs and Cats"]
    }
  },
  // --- Diversos ---
  {
    id: 'metoclopramida',
    name: 'Metoclopramida',
    category: 'Diversos',
    concentrations: [{ value: 5, unit: 'mg/mL', label: '5 mg/mL' }],
    criDoses: [{ species: 'both', cri: { min: 1, max: 2, default: 1.5, unit: CriDoseUnit.mg_kg_day }, recommendedBagInfusionTime: 24 }],
    bolusDoses: [
        { species: 'both', min: 0.25, max: 0.5, unit: BolusDoseUnit.mg_kg, notes: "Administrar lentamente" }
    ],
     info: {
        indicationSummary: ["Antiemético (antagonista D2) e procinético (agonista 5-HT4) para controle de náuseas, vômitos e distúrbios de motilidade gástrica."],
        mechanism: "Antagonista do receptor de dopamina (D2) na zona quimiorreceptora de gatilho (CTZ).",
        dosesText: {
            dog: { cri: "1-2 mg/kg/dia (0.04-0.09 mg/kg/h)", bolus: "0.25-0.5 mg/kg IV lento"},
            cat: { cri: "1-2 mg/kg/dia (0.04-0.09 mg/kg/h)", bolus: "0.25-0.5 mg/kg IV lento"},
        },
        diluents: { recommended: ['NaCl 0.9%', 'SG 5%', 'Ringer Lactato'] },
        photoprotection: true,
        compatibility: { incompatibilities: ["Pantoprazol", "Furosemida", "Morfina", "Bicarbonato"], ySite: ["Lidocaína", "Fentanil", "Midazolam"] },
        adjustments: {
            renal: "Reduzir a dose em 50% em pacientes com disfunção renal.",
            neuro: "Pode causar efeitos extrapiramidais (excitação, tremores). Não administrar em bolus rápido.",
        },
        monitoring: ["Sinais de efeitos extrapiramidais (tratar com difenidramina se ocorrer)"],
        goodPractice: ["Proteger a bolsa/seringa da luz durante a infusão."],
        contraindications: ["Obstrução ou perfuração gastrointestinal", "Epilepsia (pode diminuir o limiar convulsivo)."],
        citations: ["Plumb’s Veterinary Drug Handbook, 10th Ed."]
    }
  },
  {
    id: 'maropitant',
    name: 'Maropitant',
    category: 'Diversos',
    concentrations: [{ value: 10, unit: 'mg/mL', label: '10 mg/mL' }],
    criDoses: [
        { species: 'dog', cri: {min: 0.03, max: 0.15, default: 0.05, unit: CriDoseUnit.mg_kg_h}, useCase: "Analgesia Visceral Intra-op" },
        { species: 'cat', cri: {min: 0.1, max: 0.1, default: 0.1, unit: CriDoseUnit.mg_kg_h}, useCase: "Analgesia Visceral Intra-op", extrapolated: true },
    ],
    bolusDoses: [
      { species: 'both', min: 1, max: 1, unit: BolusDoseUnit.mg_kg, useCase: "Antiemético" }
    ],
    info: {
        indicationSummary: ["Antagonista do receptor NK-1. Antiemético potente para vômito agudo e cinetose. Possui efeito poupador de MAC e potencial analgésico visceral."],
        dosesText: {
            dog: { cri: "0.03-0.15 mg/kg/h (intra-op)", bolus: "1 mg/kg IV/SC/VO" },
            cat: { cri: "0.1 mg/kg/h (intra-op)", bolus: "1 mg/kg IV/SC/VO" }
        },
        diluents: { recommended: [], notes: "Não há dados de estabilidade para diluição em CRI. Administrar em linha exclusiva se optar pelo uso." },
        photoprotection: false,
        compatibility: { incompatibilities: ["Pantoprazol (precipita)"], notes: "Não misturar com outros fármacos na mesma seringa ou linha." },
        adjustments: {
            hepatic: "Metabolismo hepático. Reduzir dose em 50% em disfunção hepática crônica."
        },
        monitoring: ["Sinais de vômito", "Pressão arterial (pode causar hipotensão sob anestesia)"],
        goodPractice: ["A injeção SC pode ser dolorosa; refrigerar o frasco pode diminuir o desconforto."],
        citations: ["Plumb’s Veterinary Drug Handbook, 10th Ed."]
    }
  },
  {
    id: 'ondansetron',
    name: 'Ondansetron',
    category: 'Diversos',
    concentrations: [{ value: 2, unit: 'mg/mL', label: '2 mg/mL' }],
    criDoses: [
      { species: 'both', cri: { min: 0.5, max: 0.5, default: 0.5, unit: CriDoseUnit.mg_kg_h }, recommendedBagInfusionTime: 6, useCase: "Vômito refratário" }
    ],
    bolusDoses: [
      { species: 'dog', min: 0.5, max: 1, unit: BolusDoseUnit.mg_kg, infusionTimeMin: 5 },
      { species: 'cat', min: 0.1, max: 0.5, unit: BolusDoseUnit.mg_kg, infusionTimeMin: 5 },
    ],
    info: {
        indicationSummary: ["Antagonista do receptor 5-HT3. Útil para vômito refratário (quimioterapia, parvovirose)."],
        dosesText: {
            dog: { cri: "0.5 mg/kg/h por 6h", bolus: "0.5-1 mg/kg IV lento" },
            cat: { cri: "Não é prática comum.", bolus: "0.1-0.5 mg/kg IV lento" }
        },
        diluents: { recommended: ['NaCl 0.9%', 'SG 5%', 'Ringer Lactato'] },
        photoprotection: true,
        compatibility: { ySite: ["Fentanil", "Midazolam", "Metoclopramida"] },
        adjustments: {
            renal: "Reduzir dose em disfunção renal severa (IRIS 3-4).",
            hepatic: "Reduzir dose em disfunção hepática.",
            cardiac: "Risco de prolongamento do intervalo QT. Usar com cautela com outros fármacos que afetam o QT (ex: sotalol, macrolídeos)."
        },
        monitoring: ["ECG se houver risco de arritmia"],
        goodPractice: ["Administrar bolus IV lentamente (2-5 minutos) para evitar hipotensão e tontura."],
        citations: ["Plumb’s Veterinary Drug Handbook, 10th Ed."]
    }
  },
];