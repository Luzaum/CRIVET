import { Drug, CriDoseUnit, BolusDoseUnit, WarningType, FluidType } from '../types';

export const DRUGS: Drug[] = [
  // --- Analgésicos e Anestésicos ---
  {
    id: 'lidocaina',
    name: 'Lidocaína',
    category: 'Analgésicos e Anestésicos',
    concentrations: [{ value: 20, unit: 'mg/mL', label: '2% (20 mg/mL)' }],
    cri: {
      preferredUnit: 'mcg/kg/min',
      ranges: [
        { unit: 'mcg/kg/min', min: 25, max: 80 },
        { unit: 'mcg/kg/h',   min: 1500, max: 4800 },
        { unit: 'mg/kg/h',    min: 1.5,  max: 4.8 },
      ],
      compatibility: {
        preferred: 'rl',
        compatible: ['sf','d5'],
        avoid: ['d25'],
        notes: '⚠️ Não usar formulações com epinefrina IV.'
      }
    },
    bolus: {
      allowed: true,
      ranges: [
        { unit: 'mg/kg',  min: 1, max: 2 },
        { unit: 'mcg/kg', min: 1000, max: 2000 }
      ],
      notes: 'Administrar lentamente; dose cumulativa até 8 mg/kg.'
    },
    cautions: [{ level: 'caution', text: 'Monitorar ECG durante administração.' }],
    references: [
      { source: "Plumb's Veterinary Drug Handbook", pages: "10ª ed., 756–760" },
      { source: "BSAVA Small Animal Formulary A (10ª)", pages: "Lidocaína" }
    ],
    monograph: {
      mechanism:
        "Anestésico local tipo amida e antiarrítmico Classe IB. Bloqueia canais de sódio dependentes de voltagem (anestesia local). Sistêmica: liga-se a canais de Na+ inativados em tecido ventricular isquêmico/taquiárdico, encurtando potencial de ação e período refratário. Em doses subanestésicas possui efeitos anti-inflamatórios e antinociceptivos.",
      indications:
        "CÃES E GATOS — Anestesia local/regional (bloqueios, infiltrativa, epidural, dessensibilização de laringe em gatos). Arritmias ventriculares em cães (CVPs, TV). Analgesia sistêmica em CRI no trans/pós-operatório (reduz MAC de inalatórios e uso de opioides).",
      contraindications:
        "Evitar em gatos sensíveis ou com doença cardíaca/convulsões sem monitorização rigorosa. NÃO utilizar formulações com epinefrina por via IV. Cautela em doença hepática (metabolização) e insuficiência cardíaca; ajustar dose em insuficiência renal quando houver comorbidades associadas.",
      criNotes:
        "Doses (cães – analgesia): 25–80 mcg/kg/min OU 1500–4800 mcg/kg/h OU 1,5–4,8 mg/kg/h. Unidade mais usada: mcg/kg/min (titulável finamente). Manter 24–72 h conforme resposta e monitorização.",
      bolusNotes:
        "Antiarrítmico/analgesia: 1–2 mg/kg IV lento; pode repetir até dose cumulativa de 8 mg/kg. Equivalente: 1000–2000 mcg/kg.",
      dilution:
        "CRI: compatível com RL, SF 0,9% e Glicose 5%. Ex.: calcular dose (mg/kg/h) × peso × 24 h → volume (mL) = dose total (mg) / concentração (mg/mL); adicionar à bolsa do paciente. Bólus: costuma-se usar Lidocaína 2% sem conservantes, IV lento.",
      compatibility:
        "Compatível: RL (preferido), SF 0,9%, G5%. Incompatível com formulações que contenham epinefrina para uso IV (risco de arritmias ventriculares).",
      presentations:
        "Xylestesin® 2% (20 mg/mL, sem vasoconstritor); genéricos 2% (20 mg/mL); Xylestesin® 2% com epinefrina — uso exclusivamente local (NÃO USAR IV).",
      alerts:
        "🚨 NUNCA usar apresentações com epinefrina IV. Monitorar ECG, pressão e estado neurológico. Suspender se sinais de toxicidade (convulsões, depressão miocárdica).",
      references:
        "Plumb's Veterinary Drug Handbook (10ª), BSAVA Small Animal Formulary (Parte A, 10ª), Textbook of Small Animal Emergency Medicine (Drobatz et al.), Small Animal Clinical Pharmacology and Therapeutics (2ª)."
    },
    criDoses: [
      { species: 'dog', cri: { min: 25, max: 80, default: 40, unit: CriDoseUnit.mcg_kg_min } },
      { species: 'cat', cri: { min: 15, max: 50, default: 25, unit: CriDoseUnit.mcg_kg_min } },
    ],
    bolusDoses: [
      { species: 'dog', min: 1, max: 2, unit: BolusDoseUnit.mg_kg },
      { species: 'cat', min: 0.5, max: 1, unit: BolusDoseUnit.mg_kg },
    ],
    info: {
      indicationSummary: ["Analgesia sistêmica multimodal (CRI)", "Tratamento de taquiarritmias ventriculares (em cães)", "Anestesia local/epidural/bloqueios regionais"],
      mechanism: "Bloqueio de canais de sódio dependentes de voltagem (anestésico local, analgesia). Antiarrítmico classe IB — encurta potencial de ação em tecido ventricular isquêmico. Efeito anti-inflamatório e modulação de dor neuropática em doses subanestésicas.",
      preferredUnit: "mcg/kg/min",
      dosesText: {
        dog: { cri: "25–80 μg/kg/min", bolus: "1–2 mg/kg IV" },
        cat: { cri: "15–50 μg/kg/min", bolus: "0.5–1 mg/kg IV" },
        notes: "CRI pode ser mantida por 24–72 h conforme resposta. Compatível com RL (preferido), SF 0,9% e G5%. Gatos são mais sensíveis aos efeitos sistêmicos."
      },
      diluents: { recommended: ['Ringer Lactato', 'NaCl 0.9%', 'SG 5%'] },
      photoprotection: false,
      compatibility: { ySite: ["Fentanil", "Midazolam", "Cetamina", "Propofol", "Metadona"] },
      adjustments: {
        hepatic: "Lidocaína é metabolizada no fígado → risco de acumulação/toxicidade. Reduzir dose em 25-50% em hepatopatas.",
        pediatric: "Filhotes podem ter metabolismo hepático imaturo; usar com cautela.",
        geriatric: "Idosos podem ter clearance reduzido; titular com cuidado.",
        cardiac: "Evitar em bloqueios de condução não monitorados; titular lentamente. Monitorar ECG."
      },
      monitoring: ["ECG (especialmente em doses antiarrítmicas)", "Sinais de toxicidade (convulsões, depressão)", "Pressão arterial", "Frequência cardíaca"],
      goodPractice: ["Administrar lentamente IV para bólus", "Dose cumulativa máxima ~8 mg/kg", "Não usar formulações com epinefrina por via IV (risco de arritmias)", "CRI pode ser mantida por 24–72 h"],
      contraindications: ["❌ Não usar apresentações com epinefrina por via IV", "Evitar em bloqueios AV significativos sem monitoração"],
      citations: ["Plumb's Veterinary Drug Handbook, 10th ed.", "BSAVA Small Animal Formulary, Part A (10th ed.)", "Textbook of Small Animal Emergency Medicine (Drobatz et al.)", "Small Animal Clinical Pharmacology and Therapeutics (2nd ed.)"]
    }
  },
  {
    id: 'fentanyl',
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
      citations: ["Plumb's Veterinary Drug Handbook, 10th Ed.", "BSAVA Small Animal Formulary, 10th Ed."]
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
      citations: ["Plumb's Veterinary Drug Handbook, 10th Ed."]
    }
  },
  {
    id: 'morphine',
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
        citations: ["Plumb's Veterinary Drug Handbook, 10th Ed.", "BSAVA Small Animal Formulary, 10th Ed."]
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
        citations: ["Plumb's Veterinary Drug Handbook, 10th Ed."]
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
        citations: ["Plumb's Veterinary Drug Handbook, 10th Ed."]
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
        citations: ["Plumb's Veterinary Drug Handbook, 10th Ed."]
    }
  },
  {
    id: 'butorphanol',
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
        citations: ["Plumb's Veterinary Drug Handbook, 10th Ed."]
    }
  },
  {
    id: 'ketamine',
    name: 'Cetamina',
    category: 'Analgésicos e Anestésicos',
    concentrations: [
      { value: 50, unit: 'mg/mL', label: 'Cetamin® 50 mg/mL' },
      { value: 100, unit: 'mg/mL', label: 'Cetamin® 100 mg/mL' },
      { value: 100, unit: 'mg/mL', label: 'Dopalen® 100 mg/mL' },
      { value: 100, unit: 'mg/mL', label: 'Vetanarcol® 100 mg/mL' }
    ],
    criDoses: [
      { 
        species: 'both', 
        cri: { min: 2, max: 10, default: 5, unit: CriDoseUnit.mcg_kg_min },
        useCase: 'Analgesia trans e pós-operatória',
        notes: 'Dose mais comum: 2-10 mcg/kg/min. Unidade mcg/kg/min é mais prática para titulação em bombas de infusão.'
      },
      { 
        species: 'both', 
        cri: { min: 120, max: 600, default: 300, unit: CriDoseUnit.mcg_kg_h },
        useCase: 'Analgesia contínua',
        notes: 'Equivalente: 120-600 mcg/kg/h'
      },
      { 
        species: 'both', 
        cri: { min: 0.12, max: 0.6, default: 0.3, unit: CriDoseUnit.mg_kg_h },
        useCase: 'Analgesia contínua',
        notes: 'Equivalente: 0.12-0.6 mg/kg/h'
      }
    ],
    bolusDoses: [
      { 
        species: 'both', 
        min: 0.25, max: 1, unit: BolusDoseUnit.mg_kg,
        useCase: 'Indução anestésica, sedação química',
        notes: 'Administrar lentamente. Dose cumulativa pode chegar a 1 mg/kg.'
      },
      { 
        species: 'both', 
        min: 250, max: 1000, unit: BolusDoseUnit.mcg_kg,
        useCase: 'Indução anestésica, sedação química',
        notes: 'Equivalente: 250-1000 mcg/kg'
      }
    ],
    preparationGuide: `Preparo para CRI (Taxa de 1 mL/kg/hora):<br/>
<table class="w-full border-collapse border border-slate-300 mt-2">
  <thead>
    <tr class="bg-slate-100 dark:bg-slate-800">
      <th class="border border-slate-300 p-2 text-left">Volume da Bolsa</th>
      <th class="border border-slate-300 p-2 text-left">Cetamina (100mg/mL)</th>
      <th class="border border-slate-300 p-2 text-left">Concentração Final</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-slate-300 p-2">250 mL</td>
      <td class="border border-slate-300 p-2">1,2 mL</td>
      <td class="border border-slate-300 p-2">0,48 mg/mL</td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2">500 mL</td>
      <td class="border border-slate-300 p-2">2,4 mL</td>
      <td class="border border-slate-300 p-2">0,48 mg/mL</td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2">1000 mL</td>
      <td class="border border-slate-300 p-2">4,8 mL</td>
      <td class="border border-slate-300 p-2">0,48 mg/mL</td>
    </tr>
  </tbody>
</table>
<strong>Diluição para Bolus:</strong> 1:1 ou 1:2 com solução salina estéril para facilitar administração lenta.`,
    info: {
        indicationSummary: [
          "Anestésico dissociativo - antagonista não competitivo dos receptores NMDA",
          "Analgesia somática e prevenção da hiperalgesia e sensibilização central",
          "Componente essencial da analgesia multimodal (MLK/FLK)",
          "Sedação química para procedimentos diagnósticos"
        ],
        mechanism: "Antagonismo não competitivo dos receptores N-metil-D-aspartato (NMDA) no SNC. Causa desconexão funcional entre sistema límbico e reticular, resultando em catalepsia, amnésia e analgesia. Bloqueio dos receptores NMDA é crucial para modulação da dor crônica e hiperalgesia.",
        dosesText: {
            dog: { 
              cri: "2-10 mcg/kg/min (mais comum) OU 120-600 mcg/kg/h OU 0.12-0.6 mg/kg/h", 
              bolus: "0.25-1 mg/kg IV lento (250-1000 mcg/kg)" 
            },
            cat: { 
              cri: "2-10 mcg/kg/min (mais comum) OU 120-600 mcg/kg/h OU 0.12-0.6 mg/kg/h", 
              bolus: "0.25-1 mg/kg IV lento (250-1000 mcg/kg)" 
            },
            notes: "Unidade mcg/kg/min é mais prática para titulação em bombas de infusão. CRI pode ser mantida por 12-24h no pós-operatório."
        },
        diluents: { 
          recommended: ['NaCl 0.9%', 'SG 5%', 'Ringer Lactato'],
          notes: "Compatível com RL, SF 0,9% e Glicose 5%. Para bolus: diluir 1:1 ou 1:2 com solução salina."
        },
        photoprotection: false,
        compatibility: { 
          incompatibilities: ["Barbitúricos", "Diazepam (pode precipitar na mesma seringa)"], 
          ySite: ["Morfina", "Fentanil", "Lidocaína", "Midazolam"] 
        },
        adjustments: {
            renal: "Metabólitos são excretados pelos rins. Reduzir dose em 25-50% em insuficiência renal.",
            cardiac: "Aumenta FC e PA. Usar com cautela em cardiomiopatia hipertrófica ou doença cardíaca severa.",
            neuro: "Usar com cautela em pacientes com aumento da pressão intracraniana.",
            pediatric: "Maior sensibilidade em filhotes. Iniciar com doses menores.",
            geriatric: "Idosos podem ter maior sensibilidade. Titular cuidadosamente."
        },
        monitoring: [
          "Frequência cardíaca e pressão arterial",
          "Qualidade da recuperação (pode causar disforia)",
          "Nível de consciência e reflexos",
          "Função respiratória"
        ],
        goodPractice: [
          "Sempre usar em combinação com opioides e/ou lidocaína (MLK/FLK) para analgesia multimodal",
          "Mitigar efeitos disfóricos com benzodiazepínicos",
          "Combinação com relaxante muscular essencial para evitar rigidez muscular",
          "Titular conforme necessidade analgésica do paciente"
        ],
        contraindications: [
          "Cardiomiopatia hipertrófica obstrutiva (CMHo)",
          "Hipertensão sistêmica grave não controlada",
          "Aumento da pressão intracraniana"
        ],
        citations: [
          "Plumb's Veterinary Drug Handbook, 10th Ed. (páginas 717-721)",
          "BSAVA Small Animal Formulary, Part A, Canine and Feline, 10th Ed.",
          "Small Animal Clinical Pharmacology and Therapeutics, 2nd Ed."
        ]
    }
  },

  // --- ANTIBIÓTICOS ---
  {
    id: 'ampicillin-sulbactam',
    name: 'Ampicilina + Sulbactam',
    category: 'Antimicrobianos',
    isPowder: true,
    preparationGuide: `<strong>Reconstituição do Frasco:</strong><br/>
<ul class="list-disc list-inside mt-1 space-y-1">
  <li><strong>Frasco 1.5g:</strong> reconstituir com 3.2 mL de diluente → 4 mL finais (375 mg/mL)</li>
  <li><strong>Frasco 3g:</strong> reconstituir com 6.4 mL de diluente → 8 mL finais (375 mg/mL)</li>
</ul>
<strong>Diluente para reconstituição:</strong> Água para Injeção Estéril ou NaCl 0.9%<br/>
<strong>Diluente para infusão:</strong> NaCl 0.9% (preferencial) - evitar Ringer Lactato<br/>
<strong>Estabilidade:</strong> 8 horas após reconstituição em temperatura ambiente`,
    concentrations: [
      { value: 375, unit: 'mg/mL', label: '375 mg/mL (pós-reconstituição)' }
    ],
    criDoses: [
      { 
        species: 'both', 
        cri: { min: 100, max: 150, default: 125, unit: CriDoseUnit.mg_kg_day },
        useCase: 'CRI para infecções graves',
        notes: 'Dose de ataque: 30-50 mg/kg IV em 30 min. Manutenção: 100-150 mg/kg/dia em CRI. Fármaco tempo-dependente - maximiza T>MIC.'
      }
    ],
    bolusDoses: [
      { 
        species: 'both', 
        min: 30, max: 50, unit: BolusDoseUnit.mg_kg, 
        infusionTimeMin: 30,
        useCase: 'Administração intermitente',
        notes: 'Diluir em 50-100 mL NaCl 0.9%. Infundir em 15-30 min. Evitar Ringer Lactato.'
      }
    ],
    info: {
      indicationSummary: [
        "Sepse e choque séptico (comunitário sem uso recente de antimicrobianos)",
        "Peritonite",
        "Neutropenia febril com sepse",
        "Infecções por Clostridium perfringens",
        "Profilaxia cirúrgica"
      ],
      mechanism: "Beta-lactâmico + inibidor de beta-lactamase. Tempo-dependente - eficácia máxima mantendo concentração acima da CIM por 50-70% do intervalo.",
      dosesText: {
        dog: { cri: "100-150 mg/kg/dia (CRI)", bolus: "30 mg/kg IV q8h (Textbook)" },
        cat: { cri: "100-150 mg/kg/dia (CRI)", bolus: "30 mg/kg IV q8h (Textbook)" },
        notes: "Para sepse: combinar com Enrofloxacina (22 mg/kg IV q8h + Enrofloxacina). CRI superior para infecções graves (maximiza T>MIC)."
      },
      diluents: { 
        recommended: ['NaCl 0.9%'], 
        notes: "NaCl 0.9% é diluente de eleição. EVITAR Ringer Lactato (reduz concentração efetiva). Estabilidade reduzida em soluções com dextrose."
      },
      photoprotection: false,
      compatibility: { 
        incompatibilities: ["Ringer Lactato", "Dextrose", "Aminoglicosídeos"], 
        ySite: ["Dobutamina", "Fentanil", "Norepinefrina"] 
      },
      adjustments: {
        renal: "Considerar reduzir frequência em DRC importante",
        hepatic: "Ajustar dose em hepatopatas graves"
      },
      monitoring: ["Função renal", "Sinais de infecção", "Cultura e antibiograma", "Resposta à terapia"],
      goodPractice: [
        "CRI é modalidade farmacodinamicamente superior para infecções graves",
        "Bolus intermitente deve ser infundido lentamente (15-30 min)",
        "Para sepse: considerar combinação com aminoglicosídeo ou fluoroquinolona",
        "Monitorar resposta clínica e ajustar conforme cultura"
      ],
      contraindications: ["Hipersensibilidade a penicilinas"],
      citations: [
        "Plumb's Veterinary Drug Handbook, 10th Ed.", 
        "Bulário ANVISA - Unasyn®",
        "Textbook of Small Animal Emergency Medicine"
      ]
    }
  },

  {
    id: 'amoxicillin-clavulanate',
    name: 'Amoxicilina + Clavulanato (IV)',
    category: 'Antimicrobianos',
    isPowder: true,
    preparationGuide: `<strong>Reconstituição do Frasco:</strong><br/>
<ul class="list-disc list-inside mt-1 space-y-1">
  <li><strong>Frasco 600mg:</strong> reconstituir com 10 mL de Água para Injeção → 50 mg/mL amoxicilina + 10 mg/mL clavulanato</li>
  <li><strong>Frasco 1.2g:</strong> reconstituir com 20 mL de Água para Injeção → 50 mg/mL amoxicilina + 10 mg/mL clavulanato</li>
</ul>
<strong>Diluente para reconstituição:</strong> Água para Injeção Estéril<br/>
<strong>Diluente para infusão:</strong> NaCl 0.9% (exclusivo)<br/>
<strong>ALERTA:</strong> Clavulanato é instável em soluções com glicose, dextrano ou bicarbonato<br/>
<strong>Estabilidade:</strong> Usar imediatamente após reconstituição. Máximo 4h após diluição`,
    concentrations: [
      { value: 50, unit: 'mg/mL', label: '50 mg/mL amoxicilina (pós-reconstituição)' }
    ],
    bolusDoses: [
      { 
        species: 'both', 
        min: 20, max: 30, unit: BolusDoseUnit.mg_kg, 
        infusionTimeMin: 40,
        useCase: 'Administração intermitente',
        notes: 'Diluir em 50-100 mL NaCl 0.9%. Infundir em 30-40 min. NÃO administrar em bolus rápido.'
      }
    ],
    info: {
      indicationSummary: [
        "Cistite simples",
        "Piodermites superficiais não complicadas",
        "Pneumonia adquirida na comunidade (pacientes estáveis)",
        "Sepse neutropênica (tratamento ambulatorial)",
        "Infecções do trato respiratório superior em gatos",
        "Enterite por Clostridium perfringens"
      ],
      mechanism: "Beta-lactâmico + inibidor de beta-lactamase. Tempo-dependente. Clavulanato inibe beta-lactamases.",
      dosesText: {
        dog: { bolus: "20-30 mg/kg IV q8h (baseado na amoxicilina)" },
        cat: { bolus: "20-30 mg/kg IV q8h (baseado na amoxicilina)" },
        notes: "CRI NÃO recomendada - instabilidade crítica do clavulanato em solução. Para piodermite: 14-22 mg/kg PO q12h."
      },
      diluents: { 
        recommended: ['NaCl 0.9%'], 
        notes: "NaCl 0.9% é diluente EXCLUSIVO. INCOMPATÍVEL com glicose, dextrano, bicarbonato, produtos sanguíneos, emulsões lipídicas."
      },
      photoprotection: false,
      compatibility: { 
        incompatibilities: ["Glicose", "Dextrano", "Bicarbonato", "Produtos sanguíneos", "Emulsões lipídicas", "Ringer Lactato"], 
        ySite: [] 
      },
      adjustments: {
        renal: "Ajustar dose em DRC",
        hepatic: "Monitorar em hepatopatas"
      },
      monitoring: ["Função renal", "Sinais de infecção", "Cultura e antibiograma", "Resposta à terapia"],
      goodPractice: [
        "CRI é IMPRATICÁVEL devido à instabilidade do clavulanato",
        "Sempre infundir lentamente (30-40 min)",
        "Usar imediatamente após reconstituição",
        "Indicado para pacientes estáveis (tratamento ambulatorial)"
      ],
      contraindications: ["Hipersensibilidade a penicilinas", "Uso concomitante com soluções incompatíveis"],
      citations: [
        "Plumb's Veterinary Drug Handbook, 10th Ed.", 
        "Bulário ANVISA - Clavulin® IV",
        "Textbook of Small Animal Emergency Medicine"
      ]
    }
  },

  {
    id: 'cefalotin',
    name: 'Cefalotina',
    category: 'Antimicrobianos',
    isPowder: true,
    preparationGuide: `<strong>Reconstituição do Frasco:</strong><br/>
<ul class="list-disc list-inside mt-1 space-y-1">
  <li><strong>Frasco 1g:</strong> reconstituir com mínimo 10 mL de diluente → 100 mg/mL</li>
</ul>
<strong>Diluentes compatíveis:</strong> Água para Injeção, NaCl 0.9%, Glicose 5%<br/>
<strong>Diluentes para infusão:</strong> NaCl 0.9%, Ringer Lactato, Glicose 5%`,
    concentrations: [
      { value: 100, unit: 'mg/mL', label: '100 mg/mL (pós-reconstituição)' }
    ],
    criDoses: [
      { 
        species: 'both', 
        cri: { min: 60, max: 120, default: 90, unit: CriDoseUnit.mg_kg_day },
        useCase: 'CRI para infecções estabelecidas',
        notes: 'Dose de ataque: 22 mg/kg IV em 15-30 min. Manutenção: 60-120 mg/kg/dia em CRI. Superior para infecções profundas.'
      }
    ],
    bolusDoses: [
      { 
        species: 'both', 
        min: 20, max: 40, unit: BolusDoseUnit.mg_kg, 
        infusionTimeMin: 30,
        useCase: 'Profilaxia cirúrgica e infecções leves',
        notes: 'Pode ser administrado diretamente IV (3-5 min) ou diluído e infundido em 15-30 min.'
      }
    ],
    info: {
      indicationSummary: ["Profilaxia cirúrgica", "Infecções suscetíveis", "Piodermites profundas"],
      mechanism: "Cefalosporina de primeira geração, bactericida, tempo-dependente. Maximiza T>MIC.",
      dosesText: {
        dog: { cri: "60-120 mg/kg/dia (CRI)", bolus: "20-40 mg/kg IV q6-8h" },
        cat: { cri: "60-120 mg/kg/dia (CRI)", bolus: "20-40 mg/kg IV q6-8h" },
        notes: "CRI superior para infecções estabelecidas. Bolus adequado para profilaxia cirúrgica."
      },
      diluents: { 
        recommended: ['NaCl 0.9%', 'Ringer Lactato', 'Glicose 5%'], 
        notes: "Compatível com múltiplos diluentes. Estável em soluções com dextrose."
      },
      photoprotection: false,
      compatibility: { 
        incompatibilities: ["Aminoglicosídeos"], 
        ySite: ["Dobutamina", "Fentanil", "Norepinefrina"] 
      },
      adjustments: {
        renal: "Ajustar dose em DRC importante"
      },
      monitoring: ["Função renal", "Sinais de infecção", "Cultura e antibiograma"],
      goodPractice: [
        "CRI maximiza T>MIC para infecções estabelecidas",
        "Bolus adequado para profilaxia cirúrgica",
        "Monitorar função renal"
      ],
      contraindications: ["Hipersensibilidade a cefalosporinas"],
      citations: ["Plumb's Veterinary Drug Handbook, 10th Ed.", "Bulário ANVISA - Keflin®"]
    }
  },

  {
    id: 'ceftriaxone',
    name: 'Ceftriaxona',
    category: 'Antimicrobianos',
    isPowder: true,
    preparationGuide: `<strong>ALERTA CRÍTICO:</strong> NUNCA usar com soluções contendo CÁLCIO<br/>
<strong>Reconstituição do Frasco:</strong><br/>
<ul class="list-disc list-inside mt-1 space-y-1">
  <li><strong>Frasco 500mg:</strong> reconstituir com 5 mL de Água para Injeção → 100 mg/mL</li>
  <li><strong>Frasco 1g:</strong> reconstituir com 10 mL de Água para Injeção → 100 mg/mL</li>
</ul>
<strong>Diluentes compatíveis:</strong> NaCl 0.9%, Glicose 5%, Glicose 10%, Água para Injeção<br/>
<strong>INCOMPATÍVEL:</strong> Ringer Lactato, soluções com cálcio (precipitado fatal)<br/>
<strong>Concentração para infusão:</strong> 10-40 mg/mL`,
    concentrations: [
      { value: 100, unit: 'mg/mL', label: '100 mg/mL (pós-reconstituição)' }
    ],
    criDoses: [
      { 
        species: 'both', 
        cri: { min: 11, max: 11, default: 11, unit: CriDoseUnit.mg_kg_day },
        useCase: 'CRI para infecções graves',
        notes: 'Dose de ataque: 5.5 mg/kg IV em 30 min. Manutenção: 11 mg/kg/dia em CRI. Meia-vida longa permite bolus q24h.'
      }
    ],
    bolusDoses: [
      { 
        species: 'both', 
        min: 25, max: 50, unit: BolusDoseUnit.mg_kg, 
        infusionTimeMin: 60,
        useCase: 'Administração intermitente',
        notes: 'Infundir em 30-60 min. Meia-vida longa permite q12-24h. EVITAR soluções com cálcio.'
      }
    ],
    info: {
      indicationSummary: [
        "Infecções adquiridas em ambiente hospitalar",
        "Sepse com uso recente de antimicrobianos",
        "Neutropenia febril com sepse",
        "Pneumonia bacteriana grave (associada a Cefoxitina)",
        "Meningite",
        "Sepse grave"
      ],
      mechanism: "Cefalosporina de terceira geração, tempo-dependente, meia-vida longa. Maximiza T>MIC.",
      dosesText: {
        dog: { cri: "11 mg/kg/dia (CRI)", bolus: "25-50 mg/kg IV q12-24h" },
        cat: { cri: "11 mg/kg/dia (CRI)", bolus: "25-50 mg/kg IV q12-24h" },
        notes: "CRI para infecções graves. Bolus q24h eficaz para muitas infecções devido à meia-vida longa. Para pneumonia em filhotes: 22 mg/kg IV q6-8h."
      },
      diluents: { 
        recommended: ['NaCl 0.9%', 'Glicose 5%', 'Glicose 10%'], 
        notes: "INCOMPATÍVEL com Ringer Lactato e soluções contendo cálcio (precipitado fatal). Concentração para infusão: 10-40 mg/mL."
      },
      photoprotection: false,
      compatibility: { 
        incompatibilities: ["Ringer Lactato", "Soluções com cálcio", "Aminoglicosídeos"], 
        ySite: ["Dobutamina", "Fentanil"] 
      },
      adjustments: {
        renal: "Ajustar dose em DRC grave"
      },
      monitoring: ["Função renal", "Sinais de infecção", "Cultura e antibiograma"],
      goodPractice: [
        "CRI para infecções graves (meningite, sepse)",
        "Bolus q24h eficaz para infecções leves/moderadas",
        "SEMPRE verificar compatibilidade com cálcio"
      ],
      contraindications: ["Hipersensibilidade a cefalosporinas", "Uso concomitante com soluções contendo cálcio"],
      citations: ["Plumb's Veterinary Drug Handbook, 10th Ed.", "Bulário ANVISA - Rocefin®"]
    }
  },

  {
    id: 'vancomycin',
    name: 'Vancomicina',
    category: 'Antimicrobianos',
    isPowder: true,
    preparationGuide: `<strong>Reconstituição do Frasco:</strong><br/>
<ul class="list-disc list-inside mt-1 space-y-1">
  <li><strong>Frasco 500mg:</strong> reconstituir com 10 mL de Água para Injeção → 50 mg/mL</li>
</ul>
<strong>Diluição OBRIGATÓRIA:</strong> Após reconstituição, diluir para ≤5 mg/mL<br/>
<strong>Diluentes compatíveis:</strong> NaCl 0.9%, Glicose 5%<br/>
<strong>ALERTA:</strong> Infusão LENTA obrigatória (60-120 min) para evitar "Síndrome do Pescoço Vermelho"`,
    concentrations: [
      { value: 50, unit: 'mg/mL', label: '50 mg/mL (pós-reconstituição)' }
    ],
    criDoses: [
      { 
        species: 'both', 
        cri: { min: 30, max: 40, default: 35, unit: CriDoseUnit.mg_kg_day },
        useCase: 'CRI para infecções graves',
        notes: 'Dose de ataque: 15 mg/kg IV em 60-90 min. Manutenção: 30-40 mg/kg/dia em CRI. Elimina risco de reações infusionais.'
      }
    ],
    bolusDoses: [
      { 
        species: 'both', 
        min: 15, max: 15, unit: BolusDoseUnit.mg_kg, 
        infusionTimeMin: 120,
        useCase: 'Administração intermitente',
        notes: 'CRÍTICO: Infundir em 60-120 min. Infusão rápida causa "Síndrome do Pescoço Vermelho" (prurido, eritema, hipotensão).'
      }
    ],
    info: {
      indicationSummary: ["Infecções por MRSA/MRSP", "Infecções Gram+ resistentes", "Endocardite"],
      mechanism: "Glicopeptídeo que inibe síntese da parede celular. Tempo e concentração-dependente. Alvo: AUC24:CIM >400.",
      dosesText: {
        dog: { cri: "30-40 mg/kg/dia (CRI)", bolus: "15 mg/kg IV q8-12h" },
        cat: { cri: "30-40 mg/kg/dia (CRI)", bolus: "15 mg/kg IV q8-12h" },
        notes: "CRI é modalidade mais segura e farmacodinamicamente superior."
      },
      diluents: { 
        recommended: ['NaCl 0.9%', 'Glicose 5%'], 
        notes: "Diluição obrigatória para ≤5 mg/mL. Infusão LENTA (60-120 min) para evitar reações infusionais."
      },
      photoprotection: false,
      compatibility: { 
        incompatibilities: ["Heparina", "Beta-lactâmicos"], 
        ySite: ["Dobutamina", "Fentanil"] 
      },
      adjustments: {
        renal: "Ajustar por níveis (nefro/ototóxica)",
        hepatic: "Monitorar em hepatopatas"
      },
      monitoring: ["Níveis séricos", "Função renal", "Audição", "Sinais de infecção"],
      goodPractice: [
        "CRI elimina risco de reações infusionais",
        "SEMPRE infundir lentamente (60-120 min)",
        "Monitorar níveis séricos e função renal"
      ],
      contraindications: ["Hipersensibilidade", "Insuficiência renal grave sem ajuste de dose"],
      citations: ["Plumb's Veterinary Drug Handbook, 10th Ed.", "Bulário ANVISA - Vancomicina"]
    }
  },

  {
    id: 'meropenem',
    name: 'Meropenem',
    category: 'Antimicrobianos',
    isPowder: true,
    preparationGuide: `<strong>Reconstituição do Frasco:</strong><br/>
<ul class="list-disc list-inside mt-1 space-y-1">
  <li><strong>Frasco 500mg:</strong> reconstituir com 10 mL de Água para Injeção → 50 mg/mL</li>
  <li><strong>Frasco 1g:</strong> reconstituir com 20 mL de Água para Injeção → 50 mg/mL</li>
</ul>
<strong>Diluentes compatíveis:</strong> NaCl 0.9%, Glicose 5%<br/>
<strong>Concentração para infusão:</strong> 1-20 mg/mL<br/>
<strong>Uso restrito:</strong> Reservado para infecções multirresistentes`,
    concentrations: [
      { value: 50, unit: 'mg/mL', label: '50 mg/mL (pós-reconstituição)' }
    ],
    criDoses: [
      { 
        species: 'dog', 
        cri: { min: 25, max: 50, default: 37.5, unit: CriDoseUnit.mg_kg_day },
        useCase: 'CRI para infecções multirresistentes',
        notes: 'Dose de ataque: 12-25 mg/kg IV em 30-60 min. Manutenção: 25-50 mg/kg/dia em CRI. Carbapenêmico tempo-dependente.'
      },
      { 
        species: 'cat', 
        cri: { min: 16, max: 24, default: 20, unit: CriDoseUnit.mg_kg_day },
        useCase: 'CRI para infecções multirresistentes',
        notes: 'Dose de ataque: 8-12 mg/kg IV em 30-60 min. Manutenção: 16-24 mg/kg/dia em CRI. Carbapenêmico tempo-dependente.'
      }
    ],
    bolusDoses: [
      { 
        species: 'dog', 
        min: 12, max: 25, unit: BolusDoseUnit.mg_kg, 
        infusionTimeMin: 60,
        useCase: 'Administração intermitente',
        notes: 'Infundir em 30-60 min. Uso restrito para infecções multirresistentes.'
      },
      { 
        species: 'cat', 
        min: 8, max: 12, unit: BolusDoseUnit.mg_kg, 
        infusionTimeMin: 60,
        useCase: 'Administração intermitente',
        notes: 'Infundir em 30-60 min. Uso restrito para infecções multirresistentes.'
      }
    ],
    info: {
      indicationSummary: ["Infecções multirresistentes", "Infecções ESBL", "Sepse grave"],
      mechanism: "Carbapenêmico tempo-dependente, espectro ultralargo. Maximiza T>MIC. Reservado para infecções multirresistentes.",
      dosesText: {
        dog: { cri: "25-50 mg/kg/dia (CRI)", bolus: "12-25 mg/kg IV q8-12h" },
        cat: { cri: "16-24 mg/kg/dia (CRI)", bolus: "8-12 mg/kg IV q12h" },
        notes: "CRI é modalidade farmacodinamicamente superior. Uso restrito para infecções multirresistentes."
      },
      diluents: { 
        recommended: ['NaCl 0.9%', 'Glicose 5%'], 
        notes: "Concentração para infusão: 1-20 mg/mL. Estabilidade superior a outros carbapenêmicos."
      },
      photoprotection: false,
      compatibility: { 
        incompatibilities: ["Aminoglicosídeos"], 
        ySite: ["Dobutamina", "Fentanil"] 
      },
      adjustments: {
        renal: "Ajustar dose em DRC",
        hepatic: "Monitorar em hepatopatas"
      },
      monitoring: ["Função renal", "Sinais de infecção", "Cultura e antibiograma", "Desenvolvimento de resistência"],
      goodPractice: [
        "CRI é modalidade superior para infecções graves",
        "Uso restrito para infecções multirresistentes",
        "Monitorar desenvolvimento de resistência"
      ],
      contraindications: ["Hipersensibilidade a carbapenêmicos", "Uso empírico sem justificativa"],
      citations: ["Plumb's Veterinary Drug Handbook, 10th Ed.", "Bulário ANVISA - Meronem®"]
    }
  },

  {
    id: 'enrofloxacin',
    name: 'Enrofloxacina',
    category: 'Antimicrobianos',
    concentrations: [
      { value: 50, unit: 'mg/mL', label: '5% (50 mg/mL)' },
      { value: 100, unit: 'mg/mL', label: '10% (100 mg/mL)' }
    ],
    bolusDoses: [
      { 
        species: 'dog', 
        min: 5, max: 20, unit: BolusDoseUnit.mg_kg, 
        infusionTimeMin: 60,
        useCase: 'Administração intermitente',
        notes: 'Diluir e infundir lentamente (30-60 min). Dose única diária. CRI é CONTRAINDICADA.'
      },
      { 
        species: 'cat', 
        min: 5, max: 5, unit: BolusDoseUnit.mg_kg, 
        infusionTimeMin: 60,
        useCase: 'Administração intermitente',
        notes: '5 mg/kg IV q24h. Infusão lenta obrigatória. Risco de degeneração retiniana em gatos.'
      }
    ],
    info: {
      indicationSummary: ["Infecções suscetíveis", "Infecções por Gram-negativos"],
      mechanism: "Fluoroquinolona que inibe DNA girase bacteriana. Concentração-dependente. Alvo: Cmax 8-10x CIM ou AUC24:CIM >125.",
      dosesText: {
        dog: { bolus: "5-20 mg/kg IV q24h" },
        cat: { bolus: "5 mg/kg IV q24h" },
        notes: "CRI é ABSOLUTAMENTE CONTRAINDICADA. Fármaco concentração-dependente exige pico alto seguido de vale."
      },
      diluents: { 
        recommended: ['NaCl 0.9%', 'Ringer Lactato'], 
        notes: "Infusão lenta obrigatória (30-60 min). CRI é contraindicada (induz resistência bacteriana)."
      },
      photoprotection: false,
      compatibility: { 
        incompatibilities: ["Soluções alcalinas"], 
        ySite: ["Dobutamina", "Fentanil"] 
      },
      adjustments: {
        renal: "Ajustar dose em DRC grave",
        hepatic: "Monitorar em hepatopatas"
      },
      monitoring: ["Função renal", "Sinais de infecção", "Visão (especialmente em gatos)"],
      goodPractice: [
        "CRI é CONTRAINDICADA (induz resistência bacteriana)",
        "Sempre infundir lentamente (30-60 min)",
        "Dose única diária para maximizar pico"
      ],
      contraindications: ["CRI", "Uso em gatos com risco de degeneração retiniana", "Infusão rápida"],
      citations: ["Plumb's Veterinary Drug Handbook, 10th Ed.", "Bulários veterinários - Enrofloxacina", "Textbook of Small Animal Emergency Medicine"]
    }
  },

  {
    id: 'cefalexin',
    name: 'Cefalexina',
    category: 'Antimicrobianos',
    concentrations: [
      { value: 50, unit: 'mg/mL', label: '50 mg/mL (solução oral)' }
    ],
    bolusDoses: [
      { 
        species: 'both', 
        min: 22, max: 22, unit: BolusDoseUnit.mg_kg, 
        infusionTimeMin: 0,
        useCase: 'Administração oral',
        notes: '22 mg/kg PO q12h para piodermite não complicada ou sepse neutropênica ambulatorial.'
      }
    ],
    info: {
      indicationSummary: [
        "Cistite simples (primeira linha)",
        "Piodermites superficiais",
        "Sepse neutropênica (pacientes estáveis - ambulatorial)"
      ],
      mechanism: "Cefalosporina de primeira geração, bactericida, tempo-dependente. Maximiza T>MIC.",
      dosesText: {
        dog: { bolus: "22 mg/kg PO q12h" },
        cat: { bolus: "22 mg/kg PO q12h" },
        notes: "Terapia de primeira linha para infecções não complicadas em pacientes estáveis."
      },
      diluents: { 
        recommended: ['Oral'], 
        notes: "Administração oral. Não requer diluição para infusão."
      },
      photoprotection: false,
      compatibility: { 
        incompatibilities: [], 
        ySite: [] 
      },
      adjustments: {
        renal: "Ajustar dose em DRC"
      },
      monitoring: ["Função renal", "Sinais de infecção", "Resposta à terapia"],
      goodPractice: [
        "Indicada para infecções não complicadas",
        "Pacientes estáveis (tratamento ambulatorial)",
        "Monitorar resposta clínica"
      ],
      contraindications: ["Hipersensibilidade a cefalosporinas"],
      citations: ["Textbook of Small Animal Emergency Medicine"]
    }
  },

  {
    id: 'azithromycin',
    name: 'Azitromicina',
    category: 'Antimicrobianos',
    concentrations: [
      { value: 50, unit: 'mg/mL', label: '50 mg/mL (solução oral)' }
    ],
    bolusDoses: [
      { 
        species: 'both', 
        min: 5, max: 10, unit: BolusDoseUnit.mg_kg, 
        infusionTimeMin: 0,
        useCase: 'Administração oral',
        notes: '5-10 mg/kg PO q24h para infecções respiratórias. Para pneumonia: 5-10 mg/kg PO q24h por 5 dias, depois q72h.'
      }
    ],
    info: {
      indicationSummary: [
        "Infecções do trato respiratório superior felino",
        "Pneumonia bacteriana"
      ],
      mechanism: "Macrolídeo que inibe síntese proteica bacteriana. Concentração-dependente.",
      dosesText: {
        dog: { bolus: "5-10 mg/kg PO q24h" },
        cat: { bolus: "5-10 mg/kg PO q24h" },
        notes: "Para pneumonia: 5-10 mg/kg PO q24h por 5 dias, depois q72h."
      },
      diluents: { 
        recommended: ['Oral'], 
        notes: "Administração oral. Não requer diluição para infusão."
      },
      photoprotection: false,
      compatibility: { 
        incompatibilities: [], 
        ySite: [] 
      },
      adjustments: {
        hepatic: "Monitorar em hepatopatas"
      },
      monitoring: ["Função hepática", "Sinais de infecção", "Resposta à terapia"],
      goodPractice: [
        "Indicada para infecções respiratórias",
        "Monitorar função hepática",
        "Respeitar esquema de 5 dias para pneumonia"
      ],
      contraindications: ["Hipersensibilidade a macrolídeos"],
      citations: ["Textbook of Small Animal Emergency Medicine"]
    }
  },

  {
    id: 'erythromycin',
    name: 'Eritromicina',
    category: 'Antimicrobianos',
    concentrations: [
      { value: 50, unit: 'mg/mL', label: '50 mg/mL (solução oral)' }
    ],
    bolusDoses: [
      { 
        species: 'both', 
        min: 10, max: 15, unit: BolusDoseUnit.mg_kg, 
        infusionTimeMin: 0,
        useCase: 'Administração oral',
        notes: '10-15 mg/kg PO q8h para piodermite não complicada ou diarreia por Campylobacter.'
      }
    ],
    info: {
      indicationSummary: [
        "Procinético (vômito e regurgitação)",
        "Diarreia por Campylobacter",
        "Piodermite não complicada"
      ],
      mechanism: "Macrolídeo que inibe síntese proteica bacteriana. Também tem efeito procinético.",
      dosesText: {
        dog: { bolus: "10-15 mg/kg PO q8h" },
        cat: { bolus: "10-15 mg/kg PO q8h" },
        notes: "Indicada para piodermite não complicada e diarreia por Campylobacter."
      },
      diluents: { 
        recommended: ['Oral'], 
        notes: "Administração oral. Não requer diluição para infusão."
      },
      photoprotection: false,
      compatibility: { 
        incompatibilities: [], 
        ySite: [] 
      },
      adjustments: {
        hepatic: "Monitorar em hepatopatas"
      },
      monitoring: ["Função hepática", "Sinais de infecção", "Resposta à terapia"],
      goodPractice: [
        "Indicada para infecções não complicadas",
        "Efeito procinético adicional",
        "Monitorar função hepática"
      ],
      contraindications: ["Hipersensibilidade a macrolídeos"],
      citations: ["Textbook of Small Animal Emergency Medicine"]
    }
  },

  {
    id: 'doxycycline',
    name: 'Doxiciclina',
    category: 'Antimicrobianos',
    concentrations: [
      { value: 50, unit: 'mg/mL', label: '50 mg/mL (solução oral/IV)' }
    ],
    bolusDoses: [
      { 
        species: 'both', 
        min: 5, max: 10, unit: BolusDoseUnit.mg_kg, 
        infusionTimeMin: 0,
        useCase: 'Administração oral/IV',
        notes: '5-10 mg/kg PO/IV q12-24h. Para infecções respiratórias felinas: 5 mg/kg PO q12h ou 10 mg/kg PO q24h.'
      }
    ],
    info: {
      indicationSummary: [
        "Infecções por Rickettsia (febre maculosa)",
        "Bordetella bronchiseptica",
        "Chlamydophila felis em gatos",
        "Piodermite não complicada",
        "Pneumonia em filhotes (infecção comunitária)"
      ],
      mechanism: "Tetraciclina que inibe síntese proteica bacteriana. Bacteriostática.",
      dosesText: {
        dog: { bolus: "5-10 mg/kg PO/IV q12-24h" },
        cat: { bolus: "5-10 mg/kg PO/IV q12-24h" },
        notes: "Para infecções respiratórias felinas: 5 mg/kg PO q12h ou 10 mg/kg PO q24h."
      },
      diluents: { 
        recommended: ['Oral', 'NaCl 0.9%'], 
        notes: "Administração oral ou IV. Para IV: diluir em NaCl 0.9%."
      },
      photoprotection: false,
      compatibility: { 
        incompatibilities: ["Cálcio", "Ferro"], 
        ySite: [] 
      },
      adjustments: {
        hepatic: "Monitorar em hepatopatas",
        pediatric: "Evitar em filhotes <8 semanas"
      },
      monitoring: ["Função hepática", "Sinais de infecção", "Resposta à terapia"],
      goodPractice: [
        "Evitar administração com cálcio ou ferro",
        "Monitorar função hepática",
        "Indicada para infecções por Rickettsia"
      ],
      contraindications: ["Hipersensibilidade a tetraciclinas", "Filhotes <8 semanas"],
      citations: ["Textbook of Small Animal Emergency Medicine"]
    }
  },

  {
    id: 'amicacin',
    name: 'Amicacina',
    category: 'Antimicrobianos',
    concentrations: [
      { value: 50, unit: 'mg/mL', label: '50 mg/mL' }
    ],
    bolusDoses: [
      { 
        species: 'both', 
        min: 15, max: 15, unit: BolusDoseUnit.mg_kg, 
        infusionTimeMin: 30,
        useCase: 'Administração intermitente',
        notes: '15 mg/kg IV q24h. Usar em combinação com penicilinas ou cefalosporinas para sepse grave.'
      }
    ],
    info: {
      indicationSummary: [
        "Sepse grave e choque séptico (terapia combinada)",
        "Neutropenia febril com sepse",
        "Pneumonia em filhotes",
        "Ampliar espectro contra Gram-negativos"
      ],
      mechanism: "Aminoglicosídeo que inibe síntese proteica bacteriana. Concentração-dependente.",
      dosesText: {
        dog: { bolus: "15 mg/kg IV q24h" },
        cat: { bolus: "15 mg/kg IV q24h" },
        notes: "Usar em combinação com penicilinas ou cefalosporinas. Monitorar função renal."
      },
      diluents: { 
        recommended: ['NaCl 0.9%'], 
        notes: "Diluir em NaCl 0.9%. Infundir lentamente (30 min)."
      },
      photoprotection: false,
      compatibility: { 
        incompatibilities: ["Beta-lactâmicos"], 
        ySite: ["Dobutamina", "Fentanil"] 
      },
      adjustments: {
        renal: "Ajustar dose em DRC (nefrotóxico)",
        geriatric: "Monitorar função renal rigorosamente"
      },
      monitoring: ["Função renal", "Audição", "Sinais de infecção", "Níveis séricos"],
      goodPractice: [
        "Sempre usar em combinação para sepse grave",
        "Monitorar função renal rigorosamente",
        "Infundir lentamente (30 min)",
        "Considerar níveis séricos"
      ],
      contraindications: ["Insuficiência renal grave", "Hipersensibilidade a aminoglicosídeos"],
      citations: ["Textbook of Small Animal Emergency Medicine"]
    }
  },

  {
    id: 'gentamicin',
    name: 'Gentamicina',
    category: 'Antimicrobianos',
    concentrations: [
      { value: 40, unit: 'mg/mL', label: '40 mg/mL' }
    ],
    bolusDoses: [
      { 
        species: 'both', 
        min: 6, max: 8, unit: BolusDoseUnit.mg_kg, 
        infusionTimeMin: 30,
        useCase: 'Administração intermitente',
        notes: '8 mg/kg IV q24h para sepse neutropênica. 6 mg/kg IV q24h para pneumonia bacteriana grave.'
      }
    ],
    info: {
      indicationSummary: [
        "Sepse neutropênica",
        "Pneumonia bacteriana grave (inalatória)",
        "Terapia combinada para sepse grave"
      ],
      mechanism: "Aminoglicosídeo que inibe síntese proteica bacteriana. Concentração-dependente.",
      dosesText: {
        dog: { bolus: "6-8 mg/kg IV q24h" },
        cat: { bolus: "6-8 mg/kg IV q24h" },
        notes: "8 mg/kg IV q24h para sepse neutropênica. 6 mg/kg IV q24h para pneumonia bacteriana grave."
      },
      diluents: { 
        recommended: ['NaCl 0.9%'], 
        notes: "Diluir em NaCl 0.9%. Infundir lentamente (30 min)."
      },
      photoprotection: false,
      compatibility: { 
        incompatibilities: ["Beta-lactâmicos"], 
        ySite: ["Dobutamina", "Fentanil"] 
      },
      adjustments: {
        renal: "Ajustar dose em DRC (nefrotóxico)",
        geriatric: "Monitorar função renal rigorosamente"
      },
      monitoring: ["Função renal", "Audição", "Sinais de infecção", "Níveis séricos"],
      goodPractice: [
        "Monitorar função renal rigorosamente",
        "Infundir lentamente (30 min)",
        "Considerar níveis séricos",
        "Usar com cautela devido à nefrotoxicidade"
      ],
      contraindications: ["Insuficiência renal grave", "Hipersensibilidade a aminoglicosídeos"],
      citations: ["Textbook of Small Animal Emergency Medicine"]
    }
  },

  {
    id: 'clindamycin',
    name: 'Clindamicina',
    category: 'Antimicrobianos',
    concentrations: [
      { value: 150, unit: 'mg/mL', label: '150 mg/mL' }
    ],
    bolusDoses: [
      { 
        species: 'both', 
        min: 11, max: 20, unit: BolusDoseUnit.mg_kg, 
        infusionTimeMin: 30,
        useCase: 'Administração intermitente',
        notes: '12 mg/kg IV q8h para pneumonia bacteriana grave ou sepse. 11 mg/kg PO q24h para piodermite.'
      }
    ],
    info: {
      indicationSummary: [
        "Infecções por Toxoplasma",
        "Pneumonia bacteriana grave (associada a cefalosporina de 3ª geração)",
        "Infecções de tecidos moles",
        "Piodermites",
        "Sepse (como alternativa)"
      ],
      mechanism: "Lincosamida que inibe síntese proteica bacteriana. Bacteriostática.",
      dosesText: {
        dog: { bolus: "11-20 mg/kg PO/IV q8-24h" },
        cat: { bolus: "11-20 mg/kg PO/IV q8-24h" },
        notes: "12 mg/kg IV q8h para pneumonia grave. 11 mg/kg PO q24h para piodermite. 12.5-20 mg/kg PO q12h para Toxoplasma."
      },
      diluents: { 
        recommended: ['NaCl 0.9%'], 
        notes: "Para IV: diluir em NaCl 0.9%. Infundir lentamente (30 min)."
      },
      photoprotection: false,
      compatibility: { 
        incompatibilities: ["Aminoglicosídeos"], 
        ySite: ["Dobutamina", "Fentanil"] 
      },
      adjustments: {
        hepatic: "Monitorar em hepatopatas"
      },
      monitoring: ["Função hepática", "Sinais de infecção", "Resposta à terapia"],
      goodPractice: [
        "Indicada para infecções por Toxoplasma",
        "Monitorar função hepática",
        "Usar em combinação para pneumonia grave"
      ],
      contraindications: ["Hipersensibilidade a lincosamidas"],
      citations: ["Textbook of Small Animal Emergency Medicine"]
    }
  },

  {
    id: 'metronidazole',
    name: 'Metronidazol',
    category: 'Antimicrobianos',
    concentrations: [
      { value: 5, unit: 'mg/mL', label: '5 mg/mL' }
    ],
    bolusDoses: [
      { 
        species: 'both', 
        min: 7.5, max: 15, unit: BolusDoseUnit.mg_kg, 
        infusionTimeMin: 30,
        useCase: 'Administração intermitente',
        notes: '10 mg/kg PO/IV q12h por 5 dias para C. difficile. 7.5 mg/kg PO q12h para encefalopatia hepática.'
      }
    ],
    info: {
      indicationSummary: [
        "Encefalopatia hepática",
        "Diarreia por Clostridium difficile",
        "Meningite bacteriana",
        "Enterite por Clostridium perfringens",
        "Sepse neutropênica"
      ],
      mechanism: "Nitroimidazol que inibe síntese de DNA bacteriano. Ativo contra anaeróbios.",
      dosesText: {
        dog: { bolus: "7.5-15 mg/kg PO/IV q12h" },
        cat: { bolus: "7.5-15 mg/kg PO/IV q12h" },
        notes: "10 mg/kg PO/IV q12h por 5 dias para C. difficile. 7.5 mg/kg PO q12h para encefalopatia hepática."
      },
      diluents: { 
        recommended: ['NaCl 0.9%'], 
        notes: "Para IV: diluir em NaCl 0.9%. Infundir lentamente (30 min)."
      },
      photoprotection: false,
      compatibility: { 
        incompatibilities: ["Aminoglicosídeos"], 
        ySite: ["Dobutamina", "Fentanil"] 
      },
      adjustments: {
        hepatic: "Monitorar em hepatopatas",
        renal: "Ajustar dose em DRC grave"
      },
      monitoring: ["Função hepática", "Função renal", "Sinais neurológicos", "Resposta à terapia"],
      goodPractice: [
        "Indicado para encefalopatia hepática",
        "Monitorar função hepática e renal",
        "Respeitar duração de 5 dias para C. difficile"
      ],
      contraindications: ["Hipersensibilidade a nitroimidazóis", "Primeiro trimestre de gestação"],
      citations: ["Textbook of Small Animal Emergency Medicine"]
    }
  },

  {
    id: 'sulfamethoxazole-trimethoprim',
    name: 'Sulfametoxazol + Trimetoprim (SMZ-TMP)',
    category: 'Antimicrobianos',
    concentrations: [
      { value: 80, unit: 'mg/mL', label: '80 mg/mL SMZ + 16 mg/mL TMP' }
    ],
    bolusDoses: [
      { 
        species: 'both', 
        min: 15, max: 30, unit: BolusDoseUnit.mg_kg, 
        infusionTimeMin: 0,
        useCase: 'Administração oral',
        notes: '15 mg/kg PO q12h para cistite simples. 20-30 mg/kg PO q12-24h para piodermite.'
      }
    ],
    info: {
      indicationSummary: [
        "Infecções por Toxoplasma e Neospora",
        "Piodermites",
        "Infecções do trato urinário",
        "Infecções do trato respiratório superior felino"
      ],
      mechanism: "Sulfonamida + inibidor da diidrofolato redutase. Bacteriostática.",
      dosesText: {
        dog: { bolus: "15-30 mg/kg PO q12-24h" },
        cat: { bolus: "15-30 mg/kg PO q12-24h" },
        notes: "15 mg/kg PO q12h para cistite simples. 20-30 mg/kg PO q12-24h para piodermite. 15 mg/kg PO q12h para Toxoplasma."
      },
      diluents: { 
        recommended: ['Oral'], 
        notes: "Administração oral. Não requer diluição para infusão."
      },
      photoprotection: false,
      compatibility: { 
        incompatibilities: [], 
        ySite: [] 
      },
      adjustments: {
        renal: "Ajustar dose em DRC",
        hepatic: "Monitorar em hepatopatas"
      },
      monitoring: ["Função renal", "Função hepática", "Sinais de infecção", "Resposta à terapia"],
      goodPractice: [
        "Indicada para infecções por Toxoplasma",
        "Monitorar função renal e hepática",
        "Hidratação adequada para evitar cristalúria"
      ],
      contraindications: ["Hipersensibilidade a sulfonamidas", "Insuficiência renal grave"],
      citations: ["Textbook of Small Animal Emergency Medicine"]
    }
  },

  {
    id: 'lidocaine',
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
    cri: {
      preferredUnit: 'mcg/kg/min',
      ranges: [
        { unit: 'mcg/kg/min', min: 25, max: 80, typical: 50 },
        { unit: 'mg/kg/h', min: 1.5, max: 4.8, typical: 3.0 },
        { unit: 'mcg/kg/h', min: 1500, max: 4800, typical: 3000 },
      ],
      titrationNotes: 'Analgesia sistêmica e arritmias; titular ao efeito.',
      compatibility: {
        preferred: 'rl',
        compatible: ['sf', 'd5'],
        avoid: ['d25'],
        notes: 'Não usar formulações com epinefrina IV.',
      },
    },
    bolus: {
      allowed: true,
      ranges: [
        { unit: 'mg/kg', min: 1, max: 2, typical: 1.5 },
        { unit: 'mcg/kg', min: 1000, max: 2000, typical: 1500 },
      ],
      notes: 'Administrar lentamente; dose cumulativa máx. 8 mg/kg.',
    },
    cautions: [
      { level: 'caution', text: 'Monitorar ECG; NÃO usar com epinefrina IV.' },
    ],
    mechanism: 'Bloqueio de canais de sódio (Classe IB).',
    indications: 'Analgesia sistêmica, arritmias ventriculares, anestesia local.',
    contraindications: 'Bradicardia grave, bloqueios AV de alto grau, insuf. hepática grave.',
    references: [
      { source: "Plumb's Veterinary Drug Handbook", pages: '756–760' },
      { source: 'BSAVA Small Animal Formulary (10ª ed.)' },
    ],
    info: {
        indicationSummary: [
          "Anestesia Local e Regional: Bloqueios de nervos, anestesia infiltrativa, epidural, dessensibilização da laringe antes da intubação",
          "Tratamento de Arritmias Ventriculares: Fármaco de eleição para taquicardias ventriculares e complexos ventriculares prematuros (CVPs) em cães",
          "Analgesia Sistêmica (CRI): Parte de protocolos de analgesia multimodal no trans e pós-operatório, especialmente em cirurgias abdominais, torácicas e ortopédicas",
          "Procinético (Cavalos): Efeito procinético para restaurar motilidade intestinal no pós-operatório de cólica"
        ],
        mechanism: "Anestésico local do tipo amida e antiarrítmico da Classe IB. Anestesia local: bloqueio dos canais de sódio dependentes de voltagem. Antiarrítmico: liga-se aos canais de sódio inativados, encurtando a duração do potencial de ação. Analgesia sistêmica: propriedades anti-inflamatórias e modulação da dor neuropática.",
        dosesText: {
            dog: { cri: "25-80 µg/kg/min (analgesia)", bolus: "1-2 mg/kg IV lento (antiarrítmico/analgesia)"},
            cat: { cri: "Uso controverso - mais sensível aos efeitos cardiodepressores e no SNC", bolus: "0.25-0.75 mg/kg IV muito lento (5-10 min)" },
            notes: "Gatos são mais sensíveis aos efeitos cardiodepressores e no SNC. Uso em gatos deve ser feito com cautela."
        },
        diluents: { 
          recommended: ['Ringer Lactato', 'NaCl 0.9%', 'SG 5%'], 
          notes: "Compatível com múltiplos diluentes. Para CRI: adicionar dose total para 24h na bolsa de fluido do paciente." 
        },
        photoprotection: false,
        compatibility: { 
          incompatibilities: ["Anfotericina B", "Pantoprazol", "Formulações com epinefrina"], 
          ySite: ["Fentanil", "Cetamina", "Dobutamina", "Midazolam"] 
        },
        adjustments: {
            hepatic: "Metabolismo hepático. Reduzir a dose em 25-50% em disfunção hepática severa.",
            cardiac: "Reduzir dose em pacientes com baixo débito cardíaco (ex: choque, ICC).",
            renal: "Ajustar dose em insuficiência renal quando houver comorbidades associadas."
        },
        monitoring: [
          "ECG contínuo", 
          "Pressão arterial", 
          "Sinais de toxicidade do SNC (tremores, convulsões, nistagmo, depressão)",
          "Função hepática",
          "Estado neurológico"
        ],
        goodPractice: [
          "🚫 NUNCA usar formulações com epinefrina para administração IV (risco de arritmias ventriculares fatais)",
          "Sempre usar bomba de infusão para CRI",
          "Administrar bolus lentamente para evitar toxicidade",
          "Dose cumulativa máxima: 8 mg/kg",
          "CRI pode ser mantida por 24-72 horas",
          "Verificar se a apresentação é SEM EPINEFRINA para uso IV"
        ],
        contraindications: [
          "Hipersensibilidade a anestésicos locais do tipo amida", 
          "Bloqueio atrioventricular de alto grau (sem marcapasso)",
          "Formulações com epinefrina para uso IV",
          "Bradicardia grave não tratada"
        ],
        citations: [
          "Plumb's Veterinary Drug Handbook, 10th Edition",
          "BSAVA Small Animal Formulary, 10th Edition", 
          "Textbook of Small Animal Emergency Medicine (Drobatz et al.)",
          "Small Animal Clinical Pharmacology and Therapeutics, 2nd Edition"
        ]
    }
  },
  {
    id: 'dexmedetomidine',
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
      citations: ["Plumb's Veterinary Drug Handbook, 10th Ed."]
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
        citations: ["Plumb's Veterinary Drug Handbook, 10th Ed."]
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
      citations: ["Plumb's Veterinary Drug Handbook, 10th Ed."]
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
      citations: ["Plumb's Veterinary Drug Handbook, 10th Ed.", "BSAVA Small Animal Formulary, 10th Ed."]
    }
  },

  // --- Agentes Cardiovasculares ---
  {
    id: 'dobutamine',
    name: 'Dobutamina',
    category: 'Agentes Cardiovasculares',
    concentrations: [{ value: 12500, unit: 'μg/mL', label: '250mg em 20mL (padrão)' }],
    preparationGuide: `🧠 Dobutamina: O Inotrópico de Escolha para Suporte Cardíaco<br/><br/>
<strong>Mecanismo de Ação:</strong><br/>
• <strong>Ação Beta-1 (β₁):</strong> Principal mecanismo - aumenta a força de contração do miocárdio (inotropismo positivo), resultando em aumento do volume sistólico e débito cardíaco<br/>
• <strong>Ação Beta-2 (β₂) e Alfa-1 (α₁):</strong> Efeitos leves e variáveis que se equilibram, resultando em efeito mínimo sobre a pressão arterial sistêmica<br/><br/>

<strong>Preparo:</strong><br/>
<ul class="list-disc list-inside space-y-1">
  <li><strong>Fluido recomendado:</strong> Solução Glicosada 5% (D5W) - protege da oxidação</li>
  <li><strong>Diluições comuns:</strong>
    <ul class="list-disc list-inside ml-4 mt-1">
      <li>250 mg em 250 mL = 1000 mcg/mL (1 mg/mL)</li>
      <li>250 mg em 500 mL = 500 mcg/mL (0,5 mg/mL)</li>
      <li>250 mg em 1000 mL = 250 mcg/mL (0,25 mg/mL)</li>
    </ul>
  </li>
  <li>A solução pode adquirir coloração rosa (não indica perda de potência)</li>
  <li><strong>NUNCA administrar em bolus!</strong> Risco de taquicardia severa e arritmias</li>
</ul>
<div class="mt-2 text-xs bg-yellow-50 p-2 rounded">⚠️ Incompatível com soluções alcalinas (bicarbonato) e heparina</div>`,
    criDoses: [
        { species: 'dog', cri: { min: 2, max: 15, default: 7.5, unit: CriDoseUnit.mcg_kg_min } },
        { species: 'cat', cri: { min: 1, max: 5, default: 3, unit: CriDoseUnit.mcg_kg_min } },
    ],
    info: {
        indicationSummary: [
          "Insuficiência Cardíaca Congestiva (ICC) Descompensada: Especialmente em cardiomiopatia dilatada ou doença valvar crônica grave",
          "Choque Cardiogênico: Restaurar contratilidade e perfusão quando o coração é a causa primária",
          "Suporte Hemodinâmico Pós-Parada Cardíaca: Superar o 'miocárdio stunned' com contratilidade reduzida",
          "Hipotensão Anestésica: Tratar hipotensão durante anestesia por depressão miocárdica"
        ],
        mechanism: "Catecolamina sintética que atua predominantemente como agonista dos receptores β₁-adrenérgicos no músculo cardíaco, aumentando a força de contração (inotropismo positivo) com menor efeito cronotrópico e arrítmico.",
        dosesText: {
            dog: { cri: "2-15 µg/kg/min" },
            cat: { cri: "1-5 µg/kg/min (gatos mais sensíveis)" },
            notes: "Gatos são mais sensíveis e doses mais altas podem causar convulsões. Taquifilaxia pode ocorrer após 24-72h de uso prolongado."
        },
        diluents: { 
          recommended: ['SG 5%', 'NaCl 0.9%', 'Ringer Lactato'], 
          notes: "SG 5% é preferida para proteger da oxidação. A solução pode ficar rosada, o que não indica perda de potência." 
        },
        photoprotection: false,
        compatibility: { 
          incompatibilities: ["Bicarbonato", "Heparina", "Furosemida", "Diazepam"], 
          ySite: ["Norepinefrina", "Dopamina", "Fentanil"] 
        },
        adjustments: {
            cardiac: "Titular para o efeito desejado. Doses altas podem causar taquicardia e arritmias."
        },
        monitoring: [
          "ECG contínuo", 
          "Pressão arterial", 
          "Ecocardiograma para avaliar contratilidade", 
          "Lactato sérico",
          "Débito urinário",
          "Sinais de taquifilaxia"
        ],
        goodPractice: [
          "🚫 NUNCA administrar em bolus! Risco de taquicardia severa e arritmias",
          "Titular a dose lentamente para atingir o efeito clínico desejado",
          "Corrigir hipovolemia antes de iniciar",
          "Uso prolongado pode levar à taquifilaxia (24-72h)",
          "Monitorar resposta hemodinâmica constantemente"
        ],
        contraindications: [
          "Taquiarritmias ventriculares não tratadas", 
          "Obstrução do trato de saída ventricular esquerda",
          "Hipersensibilidade conhecida"
        ],
        citations: [
          "Plumb's Veterinary Drug Handbook, 10th Edition",
          "Small Animal Critical Care Medicine, 3rd Edition",
          "BSAVA Small Animal Formulary, 10th Edition"
        ]
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
        citations: ["Plumb's Veterinary Drug Handbook, 10th Ed.", "BSAVA Small Animal Formulary, 10th Ed."]
    }
  },
  {
    id: 'efedrina',
    name: 'Efedrina',
    category: 'Agentes Cardiovasculares',
    concentrations: [{ value: 50, unit: 'mg/mL', label: '50 mg/mL' }],
    preparationGuide: `🧠 Efedrina: O Simpaticomimético de Ação Mista<br/><br/>
<strong>Mecanismo de Ação:</strong><br/>
• <strong>Ação Indireta (Principal):</strong> Estimula a liberação de norepinefrina das terminações nervosas simpáticas<br/>
• <strong>Ação Direta:</strong> Agonista direto dos receptores alfa (α) e beta (β) adrenérgicos<br/>
• <strong>Resultado:</strong> Aumento da frequência cardíaca, contratilidade miocárdica e pressão arterial por vasoconstrição periférica<br/><br/>

<strong>Preparo:</strong><br/>
<ul class="list-disc list-inside space-y-1">
  <li><strong>Diluição obrigatória:</strong> 1 mL (50 mg/mL) + 9 mL SF 0,9% = 5 mg/mL</li>
  <li><strong>Administração:</strong> Bolus IV lento (1-2 minutos)</li>
  <li><strong>NÃO usar em CRI:</strong> Taquifilaxia e meia-vida longa inadequada para titulação</li>
  <li><strong>Duração:</strong> 15-60 minutos</li>
</ul>
<div class="mt-2 text-xs bg-yellow-50 p-2 rounded">⚠️ Taquifilaxia: resposta diminui com administrações repetidas</div>`,
    bolusDoses: [
        { species: 'dog', min: 0.05, max: 0.2, unit: BolusDoseUnit.mg_kg, notes: "Administrar lentamente IV (1-2 min). Pode repetir a cada 5-10 min se necessário." },
        { species: 'cat', min: 0.05, max: 0.1, unit: BolusDoseUnit.mg_kg, notes: "Administrar lentamente IV (1-2 min). Gatos mais sensíveis." },
    ],
    info: {
        indicationSummary: [
          "Hipotensão Aguda (Principalmente Anestésica): Fármaco de primeira escolha para hipotensão durante anestesia, especialmente induzida por vasodilatadores como isoflurano ou propofol",
          "Incontinência Urinária por Incompetência do Esfíncter Uretral (USMI): Uso crônico por via oral no manejo da incontinência urinária em cadelas castradas"
        ],
        mechanism: "Alcaloide simpaticomimético de ação mista. Ação indireta: estimula liberação de norepinefrina das terminações nervosas simpáticas. Ação direta: agonista dos receptores α e β adrenérgicos. Resultado: aumento da FC, contratilidade e PA por vasoconstrição.",
        dosesText: {
            dog: { bolus: "0.05-0.2 mg/kg IV lento (1-2 min)" },
            cat: { bolus: "0.05-0.1 mg/kg IV lento (1-2 min)" },
            notes: "Início de ação: 1-2 minutos. Duração: 15-60 minutos. Pode repetir a cada 5-10 min se necessário."
        },
        diluents: { 
          recommended: ['NaCl 0.9%'], 
          notes: "Diluir 1:9 (1 mL de 50 mg/mL + 9 mL SF 0,9% = 5 mg/mL) para administração segura." 
        },
        photoprotection: false,
        compatibility: { 
          incompatibilities: [], 
          ySite: [] 
        },
        adjustments: {
            cardiac: "Monitorar ECG. Pode causar taquicardia e arritmias.",
            geriatric: "Idosos podem ser mais sensíveis aos efeitos cardiovasculares.",
            pediatric: "Filhotes podem ter maior sensibilidade."
        },
        monitoring: [
          "Pressão arterial", 
          "Frequência cardíaca", 
          "ECG (taquicardia, arritmias)",
          "Sinais de taquifilaxia"
        ],
        goodPractice: [
          "Diluir obrigatoriamente antes da administração IV",
          "Administrar bolus lentamente (1-2 minutos)",
          "Monitorar resposta hemodinâmica",
          "Considerar taquifilaxia com administrações repetidas",
          "NÃO usar em CRI (inadequada para titulação)"
        ],
        contraindications: [
          "Taquiarritmias ventriculares não tratadas", 
          "Feocromocitoma",
          "Hipersensibilidade conhecida",
          "Hipertensão severa não controlada"
        ],
        citations: [
          "Plumb's Veterinary Drug Handbook, 10th Edition",
          "BSAVA Small Animal Formulary, 10th Edition",
          "Small Animal Critical Care Medicine, 3rd Edition"
        ]
    }
  },
  {
    id: 'norepinephrine',
    name: 'Norepinefrina',
    category: 'Agentes Cardiovasculares',
    concentrations: [{ value: 1, unit: 'mg/mL', label: '1 mg/mL' }],
    criDoses: [ { species: 'both', cri: { min: 0.1, max: 3, default: 0.5, unit: CriDoseUnit.mcg_kg_min } } ],
    specialWarnings: [WarningType.Photoprotection, WarningType.Vesicant],
    preparationGuide: `🧠 Norepinefrina: A Ferramenta Essencial do Intensivista<br/><br/>
<strong>Mecanismo de Ação:</strong><br/>
• <strong>Ação Alfa-1 (α₁):</strong> Vasoconstrição potente na musculatura lisa dos vasos periféricos, aumentando a resistência vascular sistêmica (RVS) e pressão arterial<br/>
• <strong>Ação Beta-1 (β₁):</strong> Aumento da frequência cardíaca e força de contração (inotropismo positivo), parcialmente contraposto pelo reflexo vagal<br/><br/>

<strong>Preparo (proteger da luz):</strong><br/>
<ul class="list-disc list-inside space-y-1">
  <li><strong>Fluido de eleição:</strong> Solução Glicosada 5% (D5W) - pH levemente ácido protege da degradação</li>
  <li><strong>Diluições comuns:</strong>
    <ul class="list-disc list-inside ml-4 mt-1">
      <li>4 mg em 250 mL = 16 mcg/mL</li>
      <li>4 mg em 500 mL = 8 mcg/mL</li>
      <li>4 mg em 1000 mL = 4 mcg/mL</li>
    </ul>
  </li>
  <li>Cobrir <strong>bolsa e equipo</strong> com material opaco</li>
  <li>Usar <strong>linha dedicada</strong> e preferir <strong>cateter venoso central</strong></li>
  <li><strong>NUNCA administrar em bolus!</strong> Risco de pico hipertensivo severo</li>
</ul>
<div class="mt-2 text-xs bg-red-50 p-2 rounded">🚨 Extravasamento: infiltrar <strong>fentolamina 5–10 mg</strong> em 10–15 mL de SF 0,9% ao redor da área.</div>`,
    info: {
        indicationSummary: [
          "Choque Séptico e Distributivo: Indicação primária para vasodilatação generalizada",
          "Hipotensão Refratária a Fluidos: Quando fluidoterapia isolada não restaura PAM > 65 mmHg",
          "Suporte Hemodinâmico na Anestesia: Hipotensão severa não responsiva a medidas iniciais"
        ],
        mechanism: "Catecolamina endógena, principal neurotransmissor do sistema nervoso simpático. Potente agonista α1-adrenérgico (vasoconstrição) com efeito β1 moderado (inotropismo).",
        dosesText: {
            dog: { cri: "0.1-0.5 µg/kg/min (inicial), até 2-3 µg/kg/min (máximo)" },
            cat: { cri: "0.1-0.5 µg/kg/min (inicial), até 2-3 µg/kg/min (máximo)" },
            notes: "Dose inicial: 0.1-0.5 µg/kg/min. Titular para PAM > 65-70 mmHg. Dose máxima: 2-3 µg/kg/min."
        },
        diluents: { 
          recommended: ['SG 5%'], 
          notes: "SG 5% é o fluido de eleição (pH ácido protege da oxidação). Compatível com Ringer Lactato. Evitar SF 0,9% isoladamente." 
        },
        photoprotection: true,
        compatibility: { 
          incompatibilities: ["Bicarbonato", "Aminofilina", "Pantoprazol", "Insulina"], 
          ySite: ["Dobutamina", "Dopamina", "Fentanil", "Vasopressina"] 
        },
        adjustments: {
            sepsis: "Titular para atingir PAM > 65-70 mmHg. Reavaliar perfusão (lactato, débito urinário) frequentemente.",
            cardiac: "Monitorar ECG contínuo. Efeito β1 pode causar taquicardia, mas é contrabalançado pelo reflexo vagal."
        },
        monitoring: [
          "Pressão arterial invasiva (obrigatório)", 
          "ECG contínuo", 
          "Lactato sérico", 
          "Perfusão periférica", 
          "Débito urinário",
          "Função renal"
        ],
        goodPractice: [
          "🚫 NUNCA administrar em bolus! Risco de arritmias ventriculares e isquemia miocárdica",
          "ALERTA VESICANTE: preferir acesso venoso central; monitorar local se periférico",
          "Proteger bolsa e equipo da luz durante toda a infusão",
          "Titular em incrementos a cada 5–10 min até atingir PAM alvo",
          "Extravasamento: infiltrar fentolamina 5–10 mg em 10–15 mL de SF 0,9%",
          "Desmame progressivo para evitar hipotensão rebote"
        ],
        contraindications: [
          "Feocromocitoma", 
          "Taquiarritmias ventriculares não tratadas",
          "Hipersensibilidade conhecida"
        ],
        citations: [
          "Plumb's Veterinary Drug Handbook, 10th Edition: Monografia da Norepinefrina, páginas 983-985",
          "Small Animal Critical Care Medicine, 3rd Edition: Capítulo sobre Choque",
          "Textbook of Small Animal Emergency Medicine (Drobatz et al.): Manejo Hemodinâmico e Choque"
        ]
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
        citations: ["Plumb's 10th ed. – preparo em D5W e proteção da luz", "Plumb's 10th ed. – doses e monitorização"]
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
        citations: ["Plumb's Veterinary Drug Handbook, 10th Ed."]
    }
  },
  {
    id: 'esmolol',
    name: 'Esmolol',
    category: 'Agentes Cardiovasculares',
    concentrations: [{ value: 10, unit: 'mg/mL', label: '10 mg/mL (solução estoque)' }],
    preparationGuide: `🧠 Esmolol: O β-Bloqueador Ultracurto e Titulável<br/><br/>
<strong>Mecanismo de Ação:</strong><br/>
• <strong>Bloqueador β₁-adrenérgico:</strong> Cardiosseletivo, atuando preferencialmente nos receptores β₁ do coração<br/>
• <strong>Cronotropismo negativo:</strong> Redução acentuada da frequência cardíaca<br/>
• <strong>Dromotropismo negativo:</strong> Diminuição da velocidade de condução através do nodo AV<br/>
• <strong>Inotropismo negativo:</strong> Redução da força de contração do miocárdio<br/><br/>

<strong>Farmacocinética Única:</strong><br/>
• <strong>Meia-vida:</strong> ~9 minutos (metabolizado por esterases plasmáticas)<br/>
• <strong>Duração:</strong> Efeitos cessam 15-30 min após interrupção<br/>
• <strong>Titulabilidade:</strong> Controle preciso e imediato da frequência cardíaca<br/><br/>

<strong>Preparo:</strong><br/>
<ul class="list-disc list-inside space-y-1">
  <li><strong>Passo 1:</strong> Criar solução estoque 10 mg/mL (10 mL de 250 mg/mL + 240 mL fluido)</li>
  <li><strong>Passo 2:</strong> Adicionar à bolsa de CRI:
    <ul class="list-disc list-inside ml-4 mt-1">
      <li>25 mL em 250 mL = 1 mg/mL (1000 mcg/mL)</li>
      <li>50 mL em 500 mL = 1 mg/mL (1000 mcg/mL)</li>
    </ul>
  </li>
  <li><strong>Fluido:</strong> Glicose 5% ou SF 0,9%</li>
</ul>
<div class="mt-2 text-xs bg-red-50 p-2 rounded">🚨 Incompatível com bicarbonato de sódio. Monitorar PA (hipotensão comum)</div>`,
    criDoses: [
      { species: 'both', cri: { min: 25, max: 200, default: 50, unit: CriDoseUnit.mcg_kg_min } }
    ],
    bolusDoses: [
      { species: 'dog', min: 250, max: 500, unit: BolusDoseUnit.mcg_kg, infusionTimeMin: 1 },
      { species: 'cat', min: 50, max: 250, unit: BolusDoseUnit.mcg_kg, infusionTimeMin: 1 },
    ],
    info: {
        indicationSummary: [
          "Taquiarritmias Supraventriculares (TSV): Controle rápido da frequência ventricular em fibrilação atrial, flutter atrial ou taquicardia atrial",
          "Taquicardia Sinusal Inapropriada: Hiperatividade simpática severa (feocromocitoma, tireotoxicose)",
          "Taquiarritmias Induzidas por Estímulo Simpático: Durante anestesia quando taquicardia severa compromete estabilidade hemodinâmica",
          "Diagnóstico Diferencial: Teste para diferenciar taquicardias supraventriculares de ventriculares"
        ],
        mechanism: "Antiarrítmico da Classe II - bloqueador dos receptores β₁-adrenérgicos. Cardiosseletivo, atuando preferencialmente nos receptores β₁ do coração. Metabolizado rapidamente por esterases plasmáticas (meia-vida ~9 min), permitindo titulação precisa.",
        dosesText: {
            dog: { cri: "25-200 µg/kg/min", bolus: "0.25-0.5 mg/kg IV lento (1-2 min)" },
            cat: { cri: "25-200 µg/kg/min", bolus: "0.05-0.25 mg/kg IV lento (1-2 min)" },
            notes: "Dose de ataque: 0.25-0.5 mg/kg IV lento. CRI: 25-200 µg/kg/min titulada para FC desejada."
        },
        diluents: { 
          recommended: ['SG 5%', 'NaCl 0.9%'], 
          notes: "Preparar solução estoque 10 mg/mL primeiro, depois adicionar à bolsa de CRI." 
        },
        photoprotection: false,
        compatibility: { 
          incompatibilities: ["Bicarbonato de sódio"], 
          ySite: [] 
        },
        adjustments: {
            cardiac: "Usar com cautela extrema em pacientes com função sistólica comprometida. Pode causar depressão miocárdica.",
            geriatric: "Idosos podem ter maior sensibilidade aos efeitos cardiovasculares.",
            pediatric: "Filhotes podem ter maior sensibilidade."
        },
        monitoring: [
          "ECG contínuo", 
          "Pressão arterial (hipotensão é efeito adverso comum)",
          "Frequência cardíaca",
          "Função miocárdica"
        ],
        goodPractice: [
          "Efeito cessa rapidamente após interrupção (15-30 min)",
          "Titular para atingir frequência cardíaca desejada",
          "Monitorar pressão arterial de perto (hipotensão comum)",
          "Usar para controle agudo de curta duração",
          "Considerar terapia antiarrítmica de longo prazo"
        ],
        contraindications: [
          "Insuficiência cardíaca descompensada", 
          "Choque cardiogênico", 
          "Bradicardia sinusal severa", 
          "Bloqueio AV de alto grau",
          "Hipotensão severa",
          "Asma brônquica (cautela com β₂)"
        ],
        citations: [
          "Plumb's Veterinary Drug Handbook, 10th Edition",
          "BSAVA Small Animal Formulary, 10th Edition",
          "Small Animal Critical Care Medicine, 3rd Edition"
        ]
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
        citations: ["Plumb's Veterinary Drug Handbook, 10th Ed."]
    }
  },
  // --- Bloqueadores Neuromusculares ---
  {
    id: 'rocuronium',
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
        citations: ["Plumb's Veterinary Drug Handbook, 10th Ed."]
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
        citations: ["Plumb's Veterinary Drug Handbook, 10th Ed."]
    }
  },
  // --- Antimicrobianos ---
  {
    id: 'ampicillin-sulbactam',
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
        citations: ["Plumb's Veterinary Drug Handbook, 10th Ed."]
    }
  },
  // --- Endócrino ---
  {
    id: 'insulin-regular',
    name: 'Insulina Regular (Humulin R, Novolin R)',
    category: 'Endócrino',
    preparationGuide: `Insulinoterapia em CAD/SHH:<br/>
<strong>1) CRI (preferencial)</strong>
<ul class="list-disc list-inside mt-1 space-y-1">
  <li><em>CAD (Cetoacidose Diabética - complicação aguda do diabetes com cetonas elevadas):</em> diluir <strong>1,1–2,2 U/kg</strong> em <strong>250 mL</strong> de SF 0,9%.</li>
  <li><em>SHH (Síndrome Hiperglicêmica Hiperosmolar - diabetes descompensado sem cetonas):</em> usar <strong>50% da dose</strong> (0,5–1,0 U/kg em 250 mL) para queda mais lenta.</li>
  <li><em>Priming (saturação da linha):</em> passar e <strong>descartar 20–50 mL</strong> da linha (a insulina adere ao plástico do equipo).</li>
  <li><em>Início:</em> 5–10 mL/h; meta: queda de <strong>50–75 mg/dL/h</strong>.</li>
  <li><em>Monitorização:</em> glicemia a cada 1–2 h; K+, P, Na+ regulares.</li>
  <li><em>Dextrose na manutenção:</em> a <strong>taxa total</strong> do fluido permanece igual; <strong>alterar apenas a composição</strong> da bolsa de manutenção (ex.: RL) para 2,5–5% conforme a glicemia.</li>
</ul>
<div class="mt-2">
<table class="table-fixed text-xs border">
  <thead><tr><th class="px-2 py-1 border">Glicemia (mg/dL)</th><th class="px-2 py-1 border">Taxa da solução de insulina</th><th class="px-2 py-1 border">Manutenção</th></tr></thead>
  <tbody>
    <tr><td class="px-2 py-1 border">&gt;250</td><td class="px-2 py-1 border">10 mL/h</td><td class="px-2 py-1 border">Solução base (ex: RL)</td></tr>
    <tr><td class="px-2 py-1 border">200–250</td><td class="px-2 py-1 border">7 mL/h</td><td class="px-2 py-1 border">Adicionar <strong>Dextrose 2,5%</strong></td></tr>
    <tr><td class="px-2 py-1 border">150–199</td><td class="px-2 py-1 border">5 mL/h</td><td class="px-2 py-1 border">Adicionar <strong>Dextrose 2,5%</strong></td></tr>
    <tr><td class="px-2 py-1 border">100–149</td><td class="px-2 py-1 border">5 mL/h</td><td class="px-2 py-1 border">Adicionar <strong>Dextrose 5%</strong></td></tr>
    <tr><td class="px-2 py-1 border">&lt;100</td><td class="px-2 py-1 border"><strong>Parar</strong></td><td class="px-2 py-1 border">Adicionar <strong>Dextrose 5%</strong></td></tr>
  </tbody>
</table>
<div class="mt-1 italic text-xs">Cálculo rápido para enriquecer bolsa de 1000 mL com D50%: 2,5% → retirar 50 mL e adicionar 50 mL; 5% → retirar 100 mL e adicionar 100 mL. Fórmula: <em>C1×V1=C2×V2</em>.</div>
</div>
<br/>
<strong>2) IM intermitente (alternativa)</strong>
<ul class="list-disc list-inside mt-1 space-y-1">
  <li><em>CAD:</em> 0,2–0,25 U/kg IM inicial; depois 0,1 U/kg IM a cada 2–4 h.</li>
  <li><em>SHH:</em> 0,1 U/kg IM inicial; depois 0,05 U/kg IM a cada 2–4 h (estender para 4–6 h quando &lt; 300 mg/dL).</li>
  <li>Meta: queda de 50–70 mg/dL/h; ajustar ±25%.</li>
</ul>
<div class="mt-2 text-xs"><strong>Transição</strong>: manter insulina regular até comer, hidratação adequada e resolução da CAD. Aplicar a primeira dose de ação longa <strong>30 min antes</strong> de interromper a CRI (ou na próxima IM prevista).</div>
<div class="mt-2 text-xs">Pré-requisitos: volemia restaurada, K+ ≥ 3,5 mEq/L e monitorização intensiva.</div>`,
    concentrations: [{ value: 100, unit: 'U/mL', label: '100 U/mL' }],
    criDoses: [{ species: 'both', cri: { min: 0.05, max: 10, default: 0.08, unit: CriDoseUnit.U_kg_h } }],
    bolusDoses: [
      { species: 'both', min: 0.1, max: 0.25, unit: BolusDoseUnit.U_kg, notes: "Administrar apenas se Potássio > 3.5 mEq/L" }
    ],
    info: {
        indicationSummary: ["Insulina de ação rápida para controle de hiperglicemia aguda, cetoacidose diabética e controle perioperatório."],
        mechanism: "Insulina de ação rápida que reduz a glicemia ao facilitar a captação de glicose pelos tecidos e inibir a produção hepática de glicose.",
        dosesText: {
            dog: { cri: "0.05-10 U/kg/h (literatura indica até 2.2 U/kg/h para CAD/SHH)", bolus: "0.1-0.25 U/kg IV" },
            cat: { cri: "0.05-10 U/kg/h (literatura indica até 2.2 U/kg/h para CAD/SHH)", bolus: "0.1-0.25 U/kg IV" }
        },
        diluents: { recommended: ['NaCl 0.9%'], notes: "CRI da insulina em SF 0,9%. <strong>A dextrose é adicionada à bolsa de manutenção</strong> (ex.: RL) para atingir 2,5–5%, sem alterar a taxa total. Fórmula: C1×V1=C2×V2 (usar D50%)." },
        photoprotection: false,
        compatibility: { incompatibilities: ["Bicarbonato", "Dopamina", "Furosemida"], ySite: ["Dobutamina", "Norepinefrina", "Fentanil"] },
        adjustments: {
            renal: "Monitorar de perto. A necessidade de insulina pode mudar.",
            hepatic: "Monitorar de perto. A necessidade de insulina pode mudar.",
            pregnancy: "A necessidade de insulina pode variar. Monitoramento intensivo é necessário."
        },
        monitoring: ["Glicemia a cada 1–2 h (meta 50–75 mg/dL/h)", "Potássio (K+)", "Fósforo (P)", "Sódio (Na+)", "Hidratação e perfusão"],
        goodPractice: [
          "Realizar <strong>priming</strong> da linha e descartar 20–50 mL (adsorção).",
          "Não interromper bruscamente a insulina quando a glicemia cair; <strong>adicionar dextrose</strong> à manutenção para prevenir hipoglicemia e manter a reversão da cetogênese.",
          "Cálculo rápido para enriquecer bolsa de 1000 mL com D50%: 2,5% → 50 mL; 5% → 100 mL (retirar igual volume antes).",
          "Pré-requisito: volemia restaurada e K+ ≥ 3,5 mEq/L (corrigindo)."
        ],
        contraindications: ["Hipoglicemia"],
        citations: [
          "Koenig A. Complicated Diabetes Mellitus. In: Drobatz/Hopper/Rozanski/Silverstein. Textbook of Small Animal Emergency Medicine. 2019.",
          "Nelson & Couto. Small Animal Internal Medicine. 6th ed. 2020.",
          "Plumb's Veterinary Drug Handbook, 10th ed. 2023."
        ]
    }
  },
  {
    id: 'insulina-nph',
    name: 'Insulina NPH (Isofana)',
    category: 'Endócrino',
    concentrations: [{ value: 100, unit: 'U/mL', label: 'U-100 (100 U/mL)' }],
    criDoses: [{ species: 'both', cri: { min: 0.05, max: 10, default: 0.08, unit: CriDoseUnit.U_kg_h } }],
    bolusDoses: [
      { species: 'dog', min: 0.25, max: 0.5, unit: BolusDoseUnit.U_kg, notes: "Dose inicial para MANEJO CRÔNICO via SUBCUTÂNEA (SC) a cada 12-24h. NÃO é um bólus IV. Ajustar conforme curva glicêmica." },
      { species: 'cat', min: 0.25, max: 0.5, unit: BolusDoseUnit.U_kg, notes: "Dose inicial para MANEJO CRÔNICO via SUBCUTÂNEA (SC) a cada 12h. Em gatos, a dosagem por peso é um ponto de partida, muitos iniciam com 1-2 U/gato. NÃO é um bólus IV. Ajustar conforme curva glicêmica." }
    ],
    info: {
      indicationSummary: ["Insulina de ação intermediária para o tratamento de manutenção de Diabetes Mellitus em cães e gatos."],
      mechanism: "Facilita a captação de glicose pelas células, promove o armazenamento de glicogênio e inibe a produção hepática de glicose. A adição de protamina retarda sua absorção e prolonga a ação.",
      dosesText: {
        dog: { cri: "0.05-10 U/kg/h (literatura indica até 2.2 U/kg/h para CAD/SHH)", bolus: "0.25-0.5 U/kg SC q12-24h (dose inicial)" },
        cat: { cri: "0.05-10 U/kg/h (literatura indica até 2.2 U/kg/h para CAD/SHH)", bolus: "0.25-0.5 U/kg SC q12h (dose inicial, ou 1-2 U/gato)" },
        notes: "Farmacocinética (início/pico/duração): Cães (0.5-3h / 2-10h / 6-24h), Gatos (0.5-3h / 2-8h / 4-12h). <strong>Transição da CRI</strong>: aplicar a primeira dose <strong>30 min antes</strong> de encerrar a CRI de insulina regular."
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
      goodPractice: ["Homogeneizar a suspensão rolando o frasco suavemente entre as mãos. Não agitar vigorosamente.", "Variar os locais de injeção subcutânea para evitar lipodistrofia.", "Educar o tutor sobre os sinais de hipoglicemia e como agir.", "Reavaliar e ajustar com base em curvas glicêmicas após a transição da CRI."],
      contraindications: ["Hipoglicemia"],
      citations: ["Plumb's Veterinary Drug Handbook", "Feldman and Nelson's Canine and Feline Endocrinology and Reproduction"]
    }
  },
  {
    id: 'insulina-pzi',
    name: 'Insulina PZI (Protamina Zinco)',
    category: 'Endócrino',
    concentrations: [{ value: 40, unit: 'U/mL', label: 'U-40 (40 U/mL)' }],
    criDoses: [{ species: 'both', cri: { min: 0.05, max: 10, default: 0.08, unit: CriDoseUnit.U_kg_h } }],
    bolusDoses: [
      { species: 'dog', min: 0.25, max: 0.5, unit: BolusDoseUnit.U_kg, notes: "Dose inicial para MANEJO CRÔNICO via SUBCUTÂNEA (SC) a cada 12-24h. NÃO é um bólus IV. Ajustar conforme curva glicêmica." },
      { species: 'cat', min: 0.25, max: 0.5, unit: BolusDoseUnit.U_kg, notes: "Dose inicial para MANEJO CRÔNICO via SUBCUTÂNEA (SC) a cada 12h. Em gatos, a dose inicial comum é de 1-2 U/gato. NÃO é um bólus IV. Ajustar conforme curva glicêmica." }
    ],
    info: {
      indicationSummary: ["Insulina de ação prolongada para o tratamento de manutenção de Diabetes Mellitus, especialmente popular em gatos."],
      mechanism: "Facilita a captação de glicose pelas células, promove o armazenamento de glicogênio e inibe a produção hepática de glicose. A adição de protamina e zinco em excesso prolonga significativamente sua absorção e duração.",
      dosesText: {
        dog: { cri: "0.05-10 U/kg/h (literatura indica até 2.2 U/kg/h para CAD/SHH)", bolus: "0.25-0.5 U/kg SC q12-24h (dose inicial)" },
        cat: { cri: "0.05-10 U/kg/h (literatura indica até 2.2 U/kg/h para CAD/SHH)", bolus: "1-2 U/gato SC q12h (dose inicial comum)" },
        notes: "Estas são doses de manutenção para administração subcutânea. <strong>Administrar a primeira dose 30 min antes</strong> de encerrar a CRI de insulina regular. Ajuste fino baseado em curvas glicêmicas; pico após vários dias."
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
      goodPractice: ["Homogeneizar a suspensão rolando o frasco suavemente. Não agitar.", "Usar apenas seringas calibradas para U-40.", "A remissão diabética é uma possibilidade em gatos; monitorar de perto para evitar hipoglicemia.", "Transição organizada a partir da CRI de insulina regular."],
      contraindications: ["Hipoglicemia"],
      citations: ["Plumb's Veterinary Drug Handbook", "AAHA Diabetes Management Guidelines for Dogs and Cats"]
    }
  },
  // --- Diversos ---
  {
    id: 'metoclopramide',
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
        citations: ["Plumb's Veterinary Drug Handbook, 10th Ed."]
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
        citations: ["Plumb's Veterinary Drug Handbook, 10th Ed."]
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
        citations: ["Plumb's Veterinary Drug Handbook, 10th Ed."]
    }
  },
  {
    id: 'lidocaina',
    name: 'Lidocaína',
    category: 'Analgésicos e Anestésicos',
    concentrations: [{ value: 20, unit: 'mg/mL', label: '2% (20 mg/mL)' }],
    criDoses: [
      { species: 'dog', cri: { min: 25, max: 80, default: 40, unit: CriDoseUnit.mcg_kg_min } },
      { species: 'cat', cri: { min: 20, max: 50, default: 30, unit: CriDoseUnit.mcg_kg_min } },
    ],
    bolusDoses: [
      { species: 'dog', min: 1, max: 2, unit: BolusDoseUnit.mg_kg },
      { species: 'cat', min: 0.5, max: 1, unit: BolusDoseUnit.mg_kg },
    ],
    info: {
      indicationSummary: ["Analgesia sistêmica multimodal (CRI)", "Tratamento de taquiarritmias ventriculares (em cães)", "Anestesia local/epidural/bloqueios regionais"],
      mechanism: "Bloqueio de canais de sódio dependentes de voltagem (anestésico local, analgesia). Antiarrítmico classe IB — encurta potencial de ação em tecido ventricular isquêmico. Efeito anti-inflamatório e modulação de dor neuropática em doses subanestésicas.",
      dosesText: {
        dog: { cri: "25–80 μg/kg/min", bolus: "1–2 mg/kg IV" },
        cat: { cri: "20–50 μg/kg/min", bolus: "0.5–1 mg/kg IV" },
        notes: "CRI pode ser mantida por 24–72 h conforme resposta. Compatível com RL (preferido), SF 0,9% e G5%."
      },
      diluents: { recommended: ['Ringer Lactato', 'NaCl 0.9%', 'SG 5%'] },
      photoprotection: false,
      compatibility: { 
        ySite: ["Fentanil", "Midazolam", "Cetamina", "Propofol"],
        preferred: 'rl',
        compatible: ['sf', 'd5'],
        avoid: [],
        notes: 'Não utilizar formulações com epinefrina por via IV (risco de arritmias).'
      },
      adjustments: {
        hepatic: "Lidocaína é metabolizada no fígado → risco de acumulação/toxicidade. Reduzir dose em 25-50%.",
        pediatric: "Filhotes podem ter metabolização hepática reduzida; iniciar com doses mais baixas.",
        geriatric: "Idosos podem ter clearance hepático reduzido; titular com cautela.",
        cardiac: "Evitar em bloqueios de condução não monitorados; titular lentamente. Monitorar ECG."
      },
      monitoring: ["ECG", "Frequência cardíaca", "Pressão arterial", "Sinais de toxicidade (convulsões, depressão)"],
      goodPractice: ["Administrar bolus IV lentamente (2-5 minutos)", "CRI pode ser mantida por 24–72 h conforme resposta", "Não usar apresentações com epinefrina por via IV"],
      contraindications: ["Bloqueios AV significativos sem monitoração", "Hipersensibilidade conhecida", "❌ Não usar apresentações com epinefrina por via IV"],
      citations: ["Plumb's Veterinary Drug Handbook, 10th ed.", "BSAVA Small Animal Formulary, Part A (10th ed.)", "Textbook of Small Animal Emergency Medicine (Drobatz et al.)", "Small Animal Clinical Pharmacology and Therapeutics (2nd ed.)"]
    }
  },
];