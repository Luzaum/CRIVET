
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
// Material UI (Google Material Design)
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';
import { Species, PatientState, Patient, Drug, CriDose, BolusDose, DrugConcentration, CriDoseUnit, BolusDoseUnit, Vehicle, WarningType, FluidType } from './types';
import { CONSOLIDATED_DRUGS, COMPATIBILITY_MATRIX, FORMULAS, EXAMPLES } from './data/consolidated_drugs';
import { SyringeIcon, BagIcon, AlertTriangleIcon, EyeOffIcon, BeakerIcon, QuestionMarkCircleIcon, InfoIcon, ActivityIcon } from './components/icons';
import { DrugInfoModal } from './components/DrugInfoModal';
import { CompatibilityGuide } from './components/CompatibilityGuide';

const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(prev => !prev);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative flex items-center" ref={tooltipRef}>
      <div onClick={handleToggle} className="cursor-pointer" aria-haspopup="true" aria-expanded={isOpen}>
        {children}
      </div>
      {isOpen && (
        <div 
          className="absolute bottom-full mb-2 w-64 p-3 bg-slate-800 text-white text-sm rounded-lg shadow-lg z-20"
          role="tooltip"
        >
          {text}
           <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
        </div>
      )}
    </div>
  );
};

const Section: React.FC<{ title: React.ReactNode; icon: React.ReactNode; children: React.ReactNode; InitiallyOpen?: boolean }> = ({ title, icon, children }) => {
    return (
        <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 2, borderBottom: theme => `1px solid ${theme.palette.divider}`, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ fontSize: 22 }}>{icon}</Box>
                <Typography variant="subtitle1" fontWeight={600}>{title}</Typography>
            </Box>
            <Box sx={{ p: 2 }}>{children}</Box>
        </Paper>
    );
};

const PatientSelector: React.FC<{ patient: Patient; setPatient: React.Dispatch<React.SetStateAction<Patient>> }> = ({ patient, setPatient }) => {
    const handleComorbidityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setPatient(p => ({ ...p, [name]: checked }));
    };
    
    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Espécie</label>
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setPatient(p => ({ ...p, species: Species.Dog }))}
                        className={`flex flex-col items-center gap-2 p-3 border-2 rounded-lg transition-all duration-200 ${patient.species === Species.Dog ? 'border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300' : 'border-slate-200 dark:border-slate-700 hover:border-blue-400 text-slate-700 dark:text-slate-300'}`}>
                        <span className="text-3xl">🐶</span>
                        <span className="font-medium">{Species.Dog}</span>
                    </button>
                    <button onClick={() => setPatient(p => ({ ...p, species: Species.Cat }))}
                        className={`flex flex-col items-center gap-2 p-3 border-2 rounded-lg transition-all duration-200 ${patient.species === Species.Cat ? 'border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300' : 'border-slate-200 dark:border-slate-700 hover:border-blue-400 text-slate-700 dark:text-slate-300'}`}>
                        <span className="text-3xl">🐱</span>
                        <span className="font-medium">{Species.Cat}</span>
                    </button>
                </div>
            </div>

            <div>
                <label htmlFor="weight" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Peso do Paciente (kg)</label>
                <div className="relative">
                    <input type="number" id="weight" value={patient.weight || ''} onChange={e => setPatient(p => ({ ...p, weight: parseFloat(e.target.value) }))}
                        className="w-full p-3 border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-700 focus:border-blue-700 no-spinner"
                        placeholder="Ex: 15.5"
                    />
                     <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">kg</span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                        Estado Fisiológico
                        <Tooltip text="A idade afeta o metabolismo dos fármacos. Pacientes filhotes e idosos podem necessitar de ajuste de dose (geralmente redução de 25-50%).">
                            <QuestionMarkCircleIcon className="w-4 h-4 text-slate-500" />
                        </Tooltip>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {(Object.values(PatientState)).map(state => (
                            <button key={state} onClick={() => setPatient(p => ({ ...p, state }))}
                                className={`px-4 py-2 border rounded-full text-sm font-medium transition-colors ${patient.state === state ? 'bg-blue-800 text-white border-blue-800' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                                {state}
                            </button>
                        ))}
                    </div>
                </div>
                 <div>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                        Comorbidades
                         <Tooltip text="Doenças preexistentes alteram a forma como o corpo processa os fármacos. Para fármacos com metabolização/excreção relevante, a dose pode necessitar de ajuste.">
                            <QuestionMarkCircleIcon className="w-4 h-4 text-slate-500" />
                        </Tooltip>
                    </div>
                                              <div className="flex flex-wrap gap-x-4 gap-y-2">
                        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                           <input type="checkbox" name="hepaticDisease" checked={patient.hepaticDisease} onChange={handleComorbidityChange} className="h-4 w-4 rounded border-gray-300 dark:border-slate-600 text-blue-700 focus:ring-blue-700" />
                            Doença Hepática
                        </label>
                         <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                           <input type="checkbox" name="renalDisease" checked={patient.renalDisease} onChange={handleComorbidityChange} className="h-4 w-4 rounded border-gray-300 dark:border-slate-600 text-blue-700 focus:ring-blue-700" />
                           Doença Renal
                        </label>
                         <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                           <input type="checkbox" name="cardiacDisease" checked={!!patient.cardiacDisease} onChange={handleComorbidityChange} className="h-4 w-4 rounded border-gray-300 dark:border-slate-600 text-blue-700 focus:ring-blue-700" />
                           Doença Cardíaca
                         </label>
                         <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                           <input type="checkbox" name="septicShock" checked={!!patient.septicShock} onChange={handleComorbidityChange} className="h-4 w-4 rounded border-gray-300 dark:border-slate-600 text-blue-700 focus:ring-blue-700" />
                           Séptico/Choque
                         </label>
                         <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                           <input type="checkbox" name="neuroDisease" checked={!!patient.neuroDisease} onChange={handleComorbidityChange} className="h-4 w-4 rounded border-gray-300 dark:border-slate-600 text-blue-700 focus:ring-blue-700" />
                           Neurológico
                         </label>
                         <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                           <input type="checkbox" name="pregnant" checked={!!patient.pregnant} onChange={handleComorbidityChange} className="h-4 w-4 rounded border-gray-300 dark:border-slate-600 text-blue-700 focus:ring-blue-700" />
                           Gestante
                         </label>
                         <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                           <input type="checkbox" name="lactating" checked={!!patient.lactating} onChange={handleComorbidityChange} className="h-4 w-4 rounded border-gray-300 dark:border-slate-600 text-blue-700 focus:ring-blue-700" />
                           Lactante
                         </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DrugSelector: React.FC<{ patient: Patient; onSelect: (drug: Drug) => void }> = ({ patient, onSelect }) => {
    const filteredDrugs = useMemo(() => {
        return CONSOLIDATED_DRUGS.filter(drug => {
            if (drug.isCombo) {
                return drug.comboDetails?.targetSpecies === (patient.species === Species.Dog ? 'dog' : 'cat');
            }
            const speciesFilter = (patient.species === Species.Dog ? 'dog' : 'cat');
            const hasCriDose = drug.criDoses?.some(d => d.species === 'both' || d.species === speciesFilter);
            const hasBolusDose = drug.bolusDoses?.some(d => d.species === 'both' || d.species === speciesFilter);
            return hasCriDose || hasBolusDose;
        });
    }, [patient.species]);

    const categories = useMemo(() => {
        const cats = Array.from(new Set<string>(filteredDrugs.map(d => d.category)));
        const order = ['Analgésicos e Anestésicos', 'Infusões Combinadas', 'Agentes Cardiovasculares', 'Bloqueadores Neuromusculares', 'Antimicrobianos', 'Endócrino', 'Diversos'];
        return cats.sort((a, b) => order.indexOf(a) - order.indexOf(b));
    }, [filteredDrugs]);

    const getCategoryIcon = (category: string) => {
        switch(category) {
            case 'Analgésicos e Anestésicos': return <span className="text-xl">💊</span>;
            case 'Agentes Cardiovasculares': return <span className="text-xl">❤️</span>;
            case 'Infusões Combinadas': return <span className="text-xl">🧪</span>;
            case 'Bloqueadores Neuromusculares': return <span className="text-xl">⚡️</span>;
            case 'Antimicrobianos': return <span className="text-xl">🔬</span>;
            case 'Endócrino': return <span className="text-xl">🧬</span>;
            default: return <span className="text-xl">📦</span>;
        }
    };

    return (
        <div className="space-y-4">
            {categories.map(category => (
                <div key={category}>
                    <div className="flex items-center gap-2 mb-3">
                        <div>{getCategoryIcon(category)}</div>
                        <h3 className="text-md font-semibold text-slate-500 dark:text-slate-400">{category}</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                        {filteredDrugs.filter(d => d.category === category).map(drug => (
                            <button key={drug.id} onClick={() => onSelect(drug)} className="p-3 text-left border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 hover:border-blue-400 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-900">
                                <p className="font-semibold text-slate-800 dark:text-slate-200">{drug.name}</p>
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

const Modal: React.FC<{ title: string; children: React.ReactNode; onClose: () => void; maxWidth?: string; }> = ({ title, children, onClose, maxWidth = 'max-w-md' }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className={`bg-white rounded-lg shadow-xl w-full ${maxWidth} max-h-[90vh] flex flex-col`}>
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-2xl leading-none">&times;</button>
                </div>
                <div className="p-6 overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};

const RateGuideModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <Modal title="Guia de Cálculo de Infusão" onClose={onClose} maxWidth="max-w-3xl">
            <div className="space-y-6 text-slate-700">
                <div>
                    <h4 className="font-semibold text-slate-800 mb-2">O Princípio Fundamental</h4>
                    <p className="text-sm">O objetivo é preparar uma solução (em uma seringa ou bolsa) e definir uma taxa de infusão (mL/h) que entregue a dose correta para o peso do paciente de forma contínua.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border">
                    <h4 className="font-semibold text-slate-800 mb-2">Método 1: Preparação de Seringa/Bolsa (usado por esta calculadora)</h4>
                    <p className="text-sm mb-3">Você define o <strong>volume total</strong> do veículo e o <strong>tempo total</strong> da infusão. A calculadora determina quanto fármaco adicionar.</p>
                    <p className="text-sm font-mono bg-slate-200 p-2 rounded-md">1. Taxa (mL/h) = Volume Total do Veículo (mL) / Tempo de Infusão (h)</p>
                    <p className="text-sm font-mono bg-slate-200 p-2 mt-2 rounded-md">2. Dose Total (mg) = Dose (mg/kg/h) × Peso (kg) × Tempo (h)</p>
                    <p className="text-sm font-mono bg-slate-200 p-2 mt-2 rounded-md">3. Volume do Fármaco (mL) = Dose Total (mg) / Concentração do Frasco (mg/mL)</p>
                    <p className="text-xs mt-3">Este método é ideal para criar infusões com volumes e durações exatas, muito comum na prática de UTI.</p>
                </div>
                
                <div className="p-4 bg-slate-50 rounded-lg border">
                    <h4 className="font-semibold text-slate-800 mb-2">Método 2: Cálculo Direto da Taxa</h4>
                    <p className="text-sm mb-3">Este método é usado para calcular a taxa de infusão (mL/h) de uma solução já preparada (ou do próprio frasco) para atingir uma dose específica.</p>
                    <p className="text-sm mb-2"><strong>Fórmula geral (unidades consistentes):</strong></p>
                    <p className="text-sm font-mono bg-slate-200 p-2 rounded-md">Taxa (mL/h) = [Dose (unidade/kg/min) × Peso (kg) × 60 min/h] / Concentração da Solução (unidade/mL)</p>
                    <p className="text-xs mt-3"><strong>Exemplo:</strong> Dose de 10 µg/kg/min para um cão de 10 kg, usando uma solução com 200 µg/mL.<br/>
                    Taxa = (10 µg/kg/min × 10 kg × 60 min/h) / 200 µg/mL = 6000 / 200 = 30 mL/h.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">Conversão para Gotas por Minuto (gtt/min)</h4>
                   <p className="text-sm mb-3">A taxa em gotas depende do tipo de equipo de infusão (macrogotas ou microgotas).</p>
                   <ul className="list-disc list-inside space-y-2 text-sm">
                        <li><strong>Microgotas (60 gtt/mL):</strong> A taxa em gtt/min é numericamente igual à taxa em mL/h. Ex: 10 mL/h ≈ 10 gtt/min.</li>
                        <li><strong>Macrogotas (20 gtt/mL - comum):</strong> gtt/min = (mL/h) / 3. Ex: 30 mL/h ≈ 10 gtt/min.</li>
                        <li><strong>Macrogotas (15 gtt/mL):</strong> gtt/min = (mL/h) / 4. Ex: 20 mL/h ≈ 5 gtt/min.</li>
                    </ul>
                    <p className="text-xs mt-2">Esta calculadora assume um equipo de microgotas (60 gtt/mL) para a conversão de conveniência.</p>
                </div>
            </div>
        </Modal>
    );
};

const WarningComponent: React.FC<{ text: string, type: 'critical' | 'warning' | 'info', icon?: React.ReactNode }> = ({text, type, icon}) => {
    const map = { critical: 'error', warning: 'warning', info: 'info' } as const;
    return (
        <Alert icon={icon as any} severity={map[type]} variant="outlined" sx={{ '& .MuiAlert-message': { fontSize: 14 } }}>
            <span dangerouslySetInnerHTML={{ __html: text }} />
        </Alert>
    );
}

export default function App() {
    const [isDark, setIsDark] = useState<boolean>(() => {
        try { return localStorage.getItem('theme') === 'dark'; } catch { return false; }
    });
    useEffect(() => {
        const root = document.documentElement;
        if (isDark) root.classList.add('dark'); else root.classList.remove('dark');
        try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch {}
    }, [isDark]);

    const [patient, setPatient] = useState<Patient>({ species: Species.Dog, state: PatientState.Adult, weight: 0, hepaticDisease: false, renalDisease: false, cardiacDisease: false, septicShock: false, neuroDisease: false, pregnant: false, lactating: false });
    const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
    const [selectedCriDose, setSelectedCriDose] = useState<CriDose | null>(null);
    const [selectedConcentration, setSelectedConcentration] = useState<DrugConcentration | null>(null);
    const [calculationMode, setCalculationMode] = useState<'cri' | 'bolus'>('cri');

    const [criDose, setCriDose] = useState(0);
    const [vehicle, setVehicle] = useState<Vehicle>({ type: 'syringe', volume: 60 });
    const [infusionDuration, setInfusionDuration] = useState(12);
    
    const [overrideComorbidityDoseReduction, setOverrideComorbidityDoseReduction] = useState(false);
    const [showRateGuideModal, setShowRateGuideModal] = useState(false);
    const [showCompatibilityGuide, setShowCompatibilityGuide] = useState(false);
    const [infoModalDrug, setInfoModalDrug] = useState<Drug | null>(null);
    const [customCriUnit, setCustomCriUnit] = useState<CriDoseUnit>(CriDoseUnit.mcg_kg_min);

    const doseAdjustment = useMemo(() => {
        if (!selectedDrug || selectedDrug.isCombo) {
            return { factor: 1, hasAgeAdjustment: false, hasComorbidityAdjustment: false };
        }

        let factor = 1.0;
        let hasAgeAdjustment = false;
        
        const hasHepaticRisk = patient.hepaticDisease && !!selectedDrug.info?.adjustments.hepatic;
        const hasRenalRisk = patient.renalDisease && !!selectedDrug.info?.adjustments.renal;
        const hasCardiacRisk = patient.cardiacDisease && !!selectedDrug.info?.adjustments.cardiac;
        const hasSepsis = patient.septicShock && !!selectedDrug.info?.adjustments.sepsis;
        const hasComorbidityRisk = hasHepaticRisk || hasRenalRisk;

        if (patient.state === PatientState.Young || patient.state === PatientState.Senior) {
            factor -= 0.25;
            hasAgeAdjustment = true;
        }

        if ((hasComorbidityRisk || hasCardiacRisk || hasSepsis) && !overrideComorbidityDoseReduction) {
             if (hasHepaticRisk) factor -= 0.25;
             if (hasRenalRisk) factor -= 0.25;
             if (hasCardiacRisk) factor -= 0.1;
             if (hasSepsis) factor -= 0.1;
        }

        return { 
            factor: Math.max(0.1, factor), 
            hasAgeAdjustment, 
            hasComorbidityAdjustment: hasComorbidityRisk
        };
    }, [patient, selectedDrug, overrideComorbidityDoseReduction]);
    
    const handleSelectDrug = useCallback((drug: Drug) => {
        setSelectedDrug(drug);
        setOverrideComorbidityDoseReduction(false);
        setVehicle({ type: 'syringe', volume: 60 });
        setInfusionDuration(12);
        
        if(drug.isCombo) {
            setSelectedCriDose(null);
            setSelectedConcentration(null);
            setCriDose(0);
            setCalculationMode('cri'); // Combos are always CRI
            return;
        }

        const speciesKey = patient.species === Species.Dog ? 'dog' : 'cat';
        const appropriateCriDose = drug.criDoses?.find(d => d.species === speciesKey) 
                             || drug.criDoses?.find(d => d.species === 'both');
        
        const appropriateBolusDose = drug.bolusDoses?.find(d => d.species === speciesKey) 
                                  || drug.bolusDoses?.find(d => d.species === 'both');

        const hasCri = !!appropriateCriDose;
        const hasBolus = !!appropriateBolusDose;

        if (hasCri) {
            setCalculationMode('cri');
            const doseToSet = appropriateCriDose;
            setSelectedCriDose(doseToSet);
            if (vehicle.type === 'bag') {
                setInfusionDuration(doseToSet.recommendedBagInfusionTime || 24);
            } else {
                setInfusionDuration(12);
            }
        } else if (hasBolus) {
            setCalculationMode('bolus');
            setSelectedCriDose(null);
        } else {
            setCalculationMode('cri'); // Default to CRI tab even if no dose
            setSelectedCriDose(null);
        }
        
        setSelectedConcentration(drug.concentrations[0] || null);

    }, [patient.species, vehicle.type]);


    useEffect(() => {
        if (selectedCriDose) {
            const adjustedDefaultDose = selectedCriDose.cri.default * doseAdjustment.factor;
            setCriDose(adjustedDefaultDose);
        } else {
            setCriDose(0);
        }
    }, [selectedCriDose, doseAdjustment]);
    
    const adjustedCriRange = useMemo(() => {
        if (!selectedCriDose) return null;
        return {
            min: selectedCriDose.cri.min * doseAdjustment.factor,
            max: selectedCriDose.cri.max * doseAdjustment.factor,
        };
    }, [selectedCriDose, doseAdjustment]);
    
    const criCalculation = useMemo(() => {
        if (!selectedDrug || !patient.weight || patient.weight <= 0) return null;

        const generalWarnings: {text: string, type: 'critical'|'warning'|'info', icon: React.ReactNode}[] = [];
        
        if (selectedDrug.specialWarnings?.includes(WarningType.VentilatorySupport)) generalWarnings.push({text: `<b>${WarningType.VentilatorySupport}</b>: A ventilação mecânica com pressão positiva é <b>obrigatória</b>.`, type: 'critical', icon: <AlertTriangleIcon className="w-5 h-5"/>});
        if (selectedDrug.specialWarnings?.includes(WarningType.Vesicant)) generalWarnings.push({text: `<b>${WarningType.Vesicant}</b>: Risco de dano tecidual grave em caso de extravasamento. Use acesso venoso central seguro.`, type: 'warning', icon: <AlertTriangleIcon className="w-5 h-5"/>});
        if (selectedDrug.specialWarnings?.includes(WarningType.Photoprotection)) generalWarnings.push({text: `<b>${WarningType.Photoprotection}</b>: Proteja a linha de infusão e a bolsa/seringa da luz.`, type: 'info', icon: <EyeOffIcon className="w-5 h-5"/>});
        if (selectedCriDose?.extrapolated) generalWarnings.push({text: `<b>Dose Extrapolada</b>: Este protocolo é extrapolado da medicina humana. Use com cautela e monitorização intensiva.`, type: 'info', icon: <BeakerIcon className="w-5 h-5"/>});
        if (selectedCriDose?.notes) generalWarnings.push({text: selectedCriDose.notes, type: 'warning', icon: <AlertTriangleIcon className="w-5 h-5"/>});
        
        if (selectedDrug.isCombo && selectedDrug.comboDetails) {
            if (selectedDrug.comboDetails.notes) generalWarnings.push({text: selectedDrug.comboDetails.notes, type: 'info', icon: <InfoIcon className="w-5 h-5"/>});

             if (!infusionDuration || infusionDuration <= 0) {
                return { generalWarnings, isCombo: true, notesAndWarnings: { messages: [], showComorbidityOverride: false } };
            }
    
            const ingredientCalculations = [];
            let totalDrugVolumeMl = 0;
            const comboNotes: {text: string, type: 'critical'|'warning'|'info', icon: React.ReactNode}[] = [];
            let hasAnyComorbidityRisk = false;

            for (const ingredient of selectedDrug.comboDetails.ingredients) {
                const drugDef = CONSOLIDATED_DRUGS.find(d => d.id === ingredient.drugId);
                if (!drugDef) continue;
        
                let ingredientFactor = 1.0;
                if (patient.state === PatientState.Young || patient.state === PatientState.Senior) {
                    ingredientFactor -= 0.25;
                }

                const hasHepaticRisk = patient.hepaticDisease && !!drugDef.info?.adjustments.hepatic;
                const hasRenalRisk = patient.renalDisease && !!drugDef.info?.adjustments.renal;
                
                if (hasHepaticRisk || hasRenalRisk) {
                    hasAnyComorbidityRisk = true;
                    if (!overrideComorbidityDoseReduction) {
                         if (hasHepaticRisk) ingredientFactor -= 0.25;
                         if (hasRenalRisk) ingredientFactor -= 0.25;
                        comboNotes.push({
                            text: `A dose de <strong>${drugDef.name}</strong> foi reduzida devido ao risco ${hasHepaticRisk && hasRenalRisk ? 'hepático e renal' : hasHepaticRisk ? 'hepático' : 'renal'}.`,
                            type: 'warning',
                            icon: <AlertTriangleIcon className="w-5 h-5"/>
                        });
                    }
                }
                ingredientFactor = Math.max(0.1, ingredientFactor);
        
                const adjustedDose = ingredient.dose * ingredientFactor;
        
                let doseInMcgKgH = 0;
                switch (ingredient.unit) {
                    case CriDoseUnit.mcg_kg_min: doseInMcgKgH = adjustedDose * 60; break;
                    case CriDoseUnit.mcg_kg_h: doseInMcgKgH = adjustedDose; break;
                    case CriDoseUnit.mg_kg_min: doseInMcgKgH = adjustedDose * 1000 * 60; break;
                    case CriDoseUnit.mg_kg_h: doseInMcgKgH = adjustedDose * 1000; break;
                    case CriDoseUnit.mg_kg_day: doseInMcgKgH = (adjustedDose * 1000) / 24; break;
                }
        
                const totalMcgPerHour = doseInMcgKgH * patient.weight;
                const drugConcentration = drugDef.concentrations[0]; 
                const drugConcentrationMcgPerMl = drugConcentration.unit === 'mg/mL' ? drugConcentration.value * 1000 : drugConcentration.unit === 'μg/mL' ? drugConcentration.value : drugConcentration.value * 1000; // handle U/mL later
                const totalMcgForDuration = totalMcgPerHour * infusionDuration;
                const drugVolumeMl = totalMcgForDuration / drugConcentrationMcgPerMl;
        
                totalDrugVolumeMl += drugVolumeMl;
                ingredientCalculations.push({
                    name: drugDef.name,
                    volume: drugVolumeMl,
                    concentrationLabel: drugConcentration.label
                });
            }
            
            const diluentVolume = vehicle.volume - totalDrugVolumeMl;
            const finalRate = vehicle.volume / infusionDuration;
            
            if (overrideComorbidityDoseReduction && hasAnyComorbidityRisk) {
                comboNotes.push({
                    text: `O ajuste automático de dose para comorbidade foi <strong>ignorado por sua solicitação</strong>. As doses padrão estão em uso. Monitore com atenção.`,
                    type: 'critical',
                    icon: <AlertTriangleIcon className="w-5 h-5"/>
                });
            }

            if (diluentVolume < 0) {
                 return {
                    isCombo: true,
                    error: `O volume total dos fármacos (${totalDrugVolumeMl.toFixed(2)} mL) excede o volume do veículo (${vehicle.volume} mL). Considere usar um veículo maior ou aumentar o tempo de infusão.`,
                    generalWarnings,
                    notesAndWarnings: { messages: comboNotes, showComorbidityOverride: hasAnyComorbidityRisk }
                }
            }

            const instructions = ingredientCalculations.map(ic => `<li>Adicione <strong>${ic.volume.toFixed(2)} mL</strong> de ${ic.name} (${ic.concentrationLabel})</li>`);
            instructions.push(`<li>Adicione <strong>${diluentVolume.toFixed(2)} mL</strong> de diluente para completar o volume.</li>`);

             return {
                isCombo: true,
                comboResult: {
                    instructions,
                    finalRate: finalRate.toFixed(2),
                },
                generalWarnings,
                notesAndWarnings: { messages: comboNotes, showComorbidityOverride: hasAnyComorbidityRisk },
             }
        }
        
        const notes: {text: string, type: 'critical'|'warning'|'info', icon: React.ReactNode}[] = [];

        if (doseAdjustment.hasAgeAdjustment) {
            notes.push({ text: `A dose sugerida foi <strong>reduzida em 25%</strong> devido à idade do paciente (${patient.state}). Consulte as diretrizes específicas do fármaco para mais detalhes.`, type: 'info', icon: <InfoIcon className="w-5 h-5"/>});
        }
        
        const hasHepaticRisk = patient.hepaticDisease && !!selectedDrug.info?.adjustments.hepatic;
        const hasRenalRisk = patient.renalDisease && !!selectedDrug.info?.adjustments.renal;
        const hasCardiacRisk = patient.cardiacDisease && !!selectedDrug.info?.adjustments.cardiac;
        const hasSepsis = patient.septicShock && !!selectedDrug.info?.adjustments.sepsis;

        if (doseAdjustment.hasComorbidityAdjustment) {
            if (overrideComorbidityDoseReduction) {
                const comorbidityTypes = [
                    hasHepaticRisk ? 'hepática' : null,
                    hasRenalRisk ? 'renal' : null,
                    hasCardiacRisk ? 'cardíaca' : null,
                    hasSepsis ? 'séptico' : null,
                ].filter(Boolean).join(' e ');
                
                notes.push({ 
                    text: `O ajuste automático de dose para a comorbidade ${comorbidityTypes} foi <strong>ignorado por sua solicitação</strong>. A dose padrão está em uso. Monitore o paciente com atenção redobrada.`, 
                    type: 'critical', 
                    icon: <AlertTriangleIcon className="w-5 h-5"/> 
                });
            } else {
                let reductionPercent = 0;
                const reasons = [];

                if (hasHepaticRisk) {
                    reductionPercent += 25;
                    reasons.push(`<li><strong>Risco Hepático:</strong> ${selectedDrug.info?.adjustments.hepatic || ''}</li>`);
                }
                if (hasRenalRisk) {
                    reductionPercent += 25;
                    reasons.push(`<li><strong>Risco Renal:</strong> ${selectedDrug.info?.adjustments.renal || ''}</li>`);
                }
                if (hasCardiacRisk) {
                    reductionPercent += 10;
                    reasons.push(`<li><strong>Risco Cardíaco:</strong> ${selectedDrug.info?.adjustments.cardiac || ''}</li>`);
                }
                if (hasSepsis) {
                    reductionPercent += 10;
                    reasons.push(`<li><strong>Paciente Séptico:</strong> ${selectedDrug.info?.adjustments.sepsis || ''}</li>`);
                }
                
                const warningText = `A dose sugerida foi <strong>reduzida em ${reductionPercent}%</strong> devido ao(s) seguinte(s) risco(s):<ul class="list-disc list-inside mt-2 space-y-1">${reasons.join('')}</ul>`;
                
                notes.push({
                    text: warningText,
                    type: 'warning',
                    icon: <AlertTriangleIcon className="w-5 h-5"/>
                });
            }
        }
        
        const notesAndWarnings = {
            messages: notes,
            showComorbidityOverride: doseAdjustment.hasComorbidityAdjustment
        }

        if (!selectedCriDose || !selectedConcentration || criDose <= 0 || !infusionDuration || infusionDuration <= 0) return { generalWarnings, notesAndWarnings };
        
        let drugVolumeMl: number;
        const doseValue = criDose;

        if (selectedConcentration.unit === 'U/mL') {
            let doseInUKgH = 0;
            switch (selectedCriDose.cri.unit) {
                case CriDoseUnit.U_kg_h: 
                    doseInUKgH = doseValue; 
                    break;
                case CriDoseUnit.mU_kg_min: 
                    doseInUKgH = (doseValue / 1000) * 60; 
                    break;
                default:
                    return { error: 'Unidade de dose (U) não suportada para este cálculo.', generalWarnings, notesAndWarnings };
            }
            const totalUnitsPerHour = doseInUKgH * patient.weight;
            const totalUnitsForDuration = totalUnitsPerHour * infusionDuration;
            drugVolumeMl = totalUnitsForDuration / selectedConcentration.value;
        } else {
            let doseInMcgKgH = 0;
            switch (selectedCriDose.cri.unit) {
                case CriDoseUnit.mcg_kg_min: doseInMcgKgH = doseValue * 60; break;
                case CriDoseUnit.mcg_kg_h: doseInMcgKgH = doseValue; break;
                case CriDoseUnit.mg_kg_min: doseInMcgKgH = doseValue * 1000 * 60; break;
                case CriDoseUnit.mg_kg_h: doseInMcgKgH = doseValue * 1000; break;
                case CriDoseUnit.mg_kg_day: doseInMcgKgH = (doseValue * 1000) / 24; break;
                default:
                    return { error: 'Unidade de dose (massa) não suportada para este cálculo.', generalWarnings, notesAndWarnings };
            }

            const totalMcgPerHour = doseInMcgKgH * patient.weight;
            
            let drugConcentrationMcgPerMl = 0;
            if (selectedConcentration.unit === 'mg/mL') {
                drugConcentrationMcgPerMl = selectedConcentration.value * 1000;
            } else if (selectedConcentration.unit === 'μg/mL') {
                drugConcentrationMcgPerMl = selectedConcentration.value;
            } else {
                return { error: `Unidade de concentração (${selectedConcentration.unit}) não suportada.`, generalWarnings, notesAndWarnings };
            }

            if(drugConcentrationMcgPerMl === 0) {
                 return { error: 'Concentração do fármaco não pode ser zero.', generalWarnings, notesAndWarnings };
            }

            const totalMcgForDuration = totalMcgPerHour * infusionDuration;
            drugVolumeMl = totalMcgForDuration / drugConcentrationMcgPerMl;
        }

        const finalRate = vehicle.volume / infusionDuration;
        
        let result: any = {};
        let message = "";

        if (vehicle.type === 'bag') {
            if (finalRate > 10 * patient.weight && finalRate > 150) { 
                 generalWarnings.push({text: `<b>Taxa de Infusão Elevada</b>: A taxa calculada de ${finalRate.toFixed(1)} mL/h é alta para manutenção. Verifique o peso do paciente e o tempo de infusão.`, type: 'warning', icon: <AlertTriangleIcon className="w-5 h-5"/>});
            }
            message = `Remova <strong>${drugVolumeMl.toFixed(2)} mL</strong> do fluido da bolsa e adicione <strong>${drugVolumeMl.toFixed(2)} mL</strong> de ${selectedDrug.name}. Infundir a <strong>${finalRate.toFixed(2)} mL/h</strong>.`
        }

        if (vehicle.type === 'syringe') {
            const diluentVolume = vehicle.volume - drugVolumeMl;
            if (diluentVolume < 0) {
                 result = { error: `O volume do fármaco (${drugVolumeMl.toFixed(2)} mL) excede o volume da seringa (${vehicle.volume} mL). Considere usar uma seringa maior, aumentar o tempo de infusão ou usar uma concentração de fármaco maior se disponível.` };
            } else {
                message = `Adicione <strong>${drugVolumeMl.toFixed(2)} mL</strong> de ${selectedDrug.name} e <strong>${(vehicle.volume - drugVolumeMl).toFixed(2)} mL</strong> de diluente a uma seringa de ${vehicle.volume} mL. Infundir a <strong>${finalRate.toFixed(2)} mL/h</strong>.`
            }
        }
        
        if (drugVolumeMl > vehicle.volume && vehicle.type === 'bag') {
             result = { error: `O volume do fármaco (${drugVolumeMl.toFixed(2)} mL) excede o volume do veículo (${vehicle.volume} mL). Considere aumentar o tempo de infusão, usar um veículo maior, ou uma concentração de fármaco maior se disponível.` };
        } else if (!result.error) {
            result = {
                drugVolume: drugVolumeMl.toFixed(2),
                diluentVolume: (vehicle.volume - drugVolumeMl).toFixed(2),
                finalRate: finalRate.toFixed(2),
                message: message
            };
        }
        
        return { ...result, generalWarnings, notesAndWarnings };

    }, [selectedDrug, patient, selectedCriDose, selectedConcentration, criDose, vehicle, infusionDuration, doseAdjustment, overrideComorbidityDoseReduction]);

    const syringeVolumes = [10, 20, 60];
    const bagVolumes = [250, 500, 1000];
    const fluidTypes: FluidType[] = ['NaCl 0.9%', 'Ringer Lactato', 'SG 5%'];
    
    const speciesKey = patient.species === Species.Dog ? 'dog' : 'cat';
    const hasCri = selectedDrug?.criDoses?.some(d => d.species === 'both' || d.species === speciesKey);
    const hasBolus = selectedDrug?.bolusDoses?.some(d => d.species === 'both' || d.species === speciesKey);

    const theme = useMemo(() => createTheme({
        palette: {
            mode: isDark ? 'dark' : 'light',
            primary: { 
                main: '#1e40af',
                contrastText: '#ffffff'
            },
            background: {
                default: isDark ? '#020617' : '#ffffff',
                paper: isDark ? '#0f172a' : '#ffffff'
            },
            text: {
                primary: isDark ? '#e2e8f0' : '#0f172a',
                secondary: isDark ? '#94a3b8' : '#64748b'
            },
            divider: isDark ? '#334155' : '#e2e8f0'
        },
        typography: { 
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            button: {
                textTransform: 'none',
                fontWeight: 500
            }
        },
        components: {
            MuiToggleButton: {
                styleOverrides: {
                    root: {
                        fontFamily: 'Inter, sans-serif',
                        textTransform: 'none',
                        fontWeight: 500,
                        borderColor: isDark ? '#475569' : '#e2e8f0',
                        '&.Mui-selected': {
                            backgroundColor: '#1e40af',
                            color: '#ffffff',
                            borderColor: '#1e40af',
                            '&:hover': {
                                backgroundColor: '#1d4ed8'
                            }
                        }
                    }
                }
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            fontFamily: 'Inter, sans-serif'
                        }
                    }
                }
            },
            MuiFormControlLabel: {
                styleOverrides: {
                    root: {
                        fontFamily: 'Inter, sans-serif'
                    }
                }
            },
            MuiSwitch: {
                styleOverrides: {
                    root: {
                        fontFamily: 'Inter, sans-serif'
                    }
                }
            }
        }
    }), [isDark]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
             {showRateGuideModal && <RateGuideModal onClose={() => setShowRateGuideModal(false)} />}
             {showCompatibilityGuide && <CompatibilityGuide onClose={() => setShowCompatibilityGuide(false)} />}
             {infoModalDrug && <DrugInfoModal drug={infoModalDrug} onClose={() => setInfoModalDrug(null)} />}
            <AppBar position="static" color="default" elevation={1}>
              <Toolbar sx={{ gap: 2 }}>
                <Typography variant="h6" color="text.primary" sx={{ flexGrow: 1 }}>
                  Calculadora de CRI Vet
                </Typography>
                <button 
                  onClick={() => setShowCompatibilityGuide(true)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mr-4"
                >
                  🧪 Compatibilidade
                </button>
                <FormControlLabel
                  control={<Switch checked={isDark} onChange={(e) => setIsDark(e.target.checked)} />}
                  label={isDark ? 'Escuro' : 'Claro'}
                />
              </Toolbar>
            </AppBar>

            <main className="container mx-auto p-4 lg:p-6 space-y-6">
                <div className="space-y-6">
                    <Section title="1. Informações do Paciente" icon={<span className="text-2xl">📝</span>} InitiallyOpen={true}>
                        <PatientSelector patient={patient} setPatient={setPatient} />
                    </Section>

                    {patient.weight > 0 && (
                        <Section title="2. Seleção do Fármaco" icon={<span className="text-2xl">💉</span>} InitiallyOpen={true}>
                            <DrugSelector patient={patient} onSelect={handleSelectDrug} />
                        </Section>
                    )}
                </div>

                <div className="space-y-6">
                    {selectedDrug && (
                         <Section 
                            title={
                                <div className="flex items-center gap-2">
                                    3. Cálculo para {selectedDrug.name}
                                    {selectedDrug.info && (
                                        <button onClick={() => setInfoModalDrug(selectedDrug)} className="text-blue-500 hover:text-blue-700">
                                            <QuestionMarkCircleIcon className="w-6 h-6" />
                                        </button>
                                    )}
                                </div>
                            } 
                            icon={<span className="text-2xl">🧮</span>} 
                            InitiallyOpen={true}
                        >
                           <div className="space-y-6">
                            
                            <div className="space-y-3">
                                {selectedDrug.isCombo && selectedDrug.comboDetails && (
                                  <div className="space-y-3">
                                    <p className="text-sm text-slate-700 dark:text-slate-200">{selectedDrug.comboDetails.description}</p>
                                    {selectedDrug.comboDetails.presets && (
                                      <div>
                                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Preset de Dose</label>
                                        <div className="grid grid-cols-4 gap-2">
                                          {Object.entries(selectedDrug.comboDetails.presets).map(([preset, doses]) => (
                                            <button
                                              key={preset}
                                              onClick={() => {
                                                // Apply preset doses to the combo
                                                const presetDoses = doses as any;
                                                // This would need to be implemented based on the combo structure
                                              }}
                                              className="p-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm transition-colors hover:bg-blue-50 dark:hover:bg-slate-800"
                                            >
                                              {preset}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                                {criCalculation?.generalWarnings?.map((w, i) => <WarningComponent key={i} {...w} />)}
                            </div>

                             {selectedDrug.preparationGuide && (
                                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <BeakerIcon className="h-6 w-6 text-amber-500" aria-hidden="true" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-base font-medium text-amber-800 dark:text-amber-400">Instruções de Preparo</h3>
                                            <div className="mt-2 text-sm text-amber-700 dark:text-amber-300"
                                                 dangerouslySetInnerHTML={{ __html: selectedDrug.preparationGuide }}/>
                                        </div>
                                    </div>
                                </div>
                             )}

                            {(hasCri || hasBolus) && !selectedDrug.isCombo && (
                                <ToggleButtonGroup
                                  exclusive
                                  value={calculationMode}
                                  onChange={(_, val) => val && setCalculationMode(val)}
                                  fullWidth
                                  color="primary"
                                  sx={{ my: 1 }}
                                >
                                  <ToggleButton value="cri" sx={{ textTransform: 'none' }}> <ActivityIcon className="w-4 h-4"/> &nbsp; Cálculo de CRI</ToggleButton>
                                  <ToggleButton value="bolus" disabled={!hasBolus} sx={{ textTransform: 'none' }}> <SyringeIcon className="w-4 h-4"/> &nbsp; Cálculo de Bólus</ToggleButton>
                                </ToggleButtonGroup>
                            )}
                            
                            {calculationMode === 'cri' && (hasCri || selectedDrug.isCombo) && (
                                <div className="space-y-6">
                                {(!selectedDrug.isCombo && selectedCriDose && selectedConcentration && adjustedCriRange) && (
                                    <>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Dose de CRI ({selectedCriDose.cri.unit})</label>
                                        <div className="flex items-center gap-2">
                                            <input type="range" min={adjustedCriRange.min} max={adjustedCriRange.max} step={(adjustedCriRange.max - adjustedCriRange.min) / 100 || 0.01} value={criDose}
                                                onChange={e => setCriDose(parseFloat(e.target.value))}
                                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                                disabled={adjustedCriRange.min === adjustedCriRange.max}
                                            />
                                            <input type="number" value={criDose.toFixed(selectedCriDose.cri.unit === CriDoseUnit.mU_kg_min ? 3 : 2)}
                                                onChange={e => setCriDose(parseFloat(e.target.value))}
                                                className="w-24 p-2 border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 border-slate-300 dark:border-slate-700 rounded-md text-center no-spinner"
                                                disabled={adjustedCriRange.min === adjustedCriRange.max}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">Faixa ajustada recomendada: {adjustedCriRange.min.toFixed(2)} - {adjustedCriRange.max.toFixed(2)} {selectedCriDose.cri.unit}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-600 mb-2">Apresentação</label>
                                             <select value={selectedConcentration.label} onChange={(e) => setSelectedConcentration(selectedDrug.concentrations.find(c => c.label === e.target.value) || null)} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">
                                                {selectedDrug.concentrations.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Indicação Principal</label>
                                             <p className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-md min-h-[42px] flex items-center text-sm">{selectedCriDose.useCase || selectedDrug.info?.indicationSummary[0] || 'Geral'}</p>
                                        </div>
                                    </div>
                                    </>
                                )}
                                {(!selectedDrug.isCombo && !selectedCriDose && selectedConcentration) && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-600 mb-2">Dose de CRI (customizada)</label>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                                                <select value={customCriUnit} onChange={(e) => setCustomCriUnit(e.target.value as CriDoseUnit)} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">
                                                    {Object.values(CriDoseUnit).map(u => <option key={u} value={u}>{u}</option>)}
                                                </select>
                                                <input type="number" value={criDose || ''} onChange={e => setCriDose(parseFloat(e.target.value) || 0)} className="w-full p-2 border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 border-slate-300 dark:border-slate-700 rounded-md no-spinner" placeholder="Ex: 10" />
                                                <div className="text-xs text-slate-500 dark:text-slate-400">Sem protocolo oficial neste app. Use com cautela e monitoração.</div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-600 mb-2">Apresentação</label>
                                            <select value={selectedConcentration.label} onChange={(e) => setSelectedConcentration(selectedDrug.concentrations.find(c => c.label === e.target.value) || null)} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">
                                                {selectedDrug.concentrations.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                )}
                                
                                <div>
                                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 mb-2">
                                        Veículo de Infusão
                                        <Tooltip text="Bombas de seringa oferecem alta precisão para volumes pequenos (ideal para fármacos potentes). Bolsas de fluido são usadas para administrar fármacos junto com a fluidoterapia, sendo o fármaco diluído no volume total.">
                                            <QuestionMarkCircleIcon className="w-4 h-4 text-slate-500" />
                                        </Tooltip>
                                    </div>
                                    <ToggleButtonGroup
                                      exclusive
                                      value={vehicle.type}
                                      onChange={(_, val) => {
                                        if (!val) return;
                                        if (val === 'syringe') { setVehicle({ type: 'syringe', volume: 60 }); setInfusionDuration(12); }
                                        else { setVehicle({ type: 'bag', volume: 500, fluid: 'NaCl 0.9%' }); setInfusionDuration(selectedCriDose?.recommendedBagInfusionTime || 24); }
                                      }}
                                      fullWidth
                                      color="primary"
                                      sx={{ my: 1 }}
                                    >
                                      <ToggleButton value="syringe" sx={{ textTransform: 'none' }}><SyringeIcon className="w-4 h-4"/> &nbsp; Seringa</ToggleButton>
                                      <ToggleButton value="bag" sx={{ textTransform: 'none' }}><BagIcon className="w-4 h-4"/> &nbsp; Bolsa de Fluido</ToggleButton>
                                    </ToggleButtonGroup>
                                </div>
                                
                                <div className="space-y-4">
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                        {vehicle.type === 'syringe' ? (
                                            <div>
                                                <label className="block text-sm font-medium text-slate-600 mb-2">Tamanho Seringa (mL)</label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {syringeVolumes.map(v => <button key={v} onClick={() => setVehicle({type: 'syringe', volume: v})} className={`p-2 border rounded-md transition-colors ${vehicle.volume === v ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-200 hover:bg-blue-100 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700'}`}>{v}</button>)}
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <label className="block text-sm font-medium text-slate-600 mb-2">Volume Bolsa (mL)</label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {bagVolumes.map(v => <button key={v} onClick={() => setVehicle(prev => ({...prev, type:'bag', volume: v, fluid: prev.type === 'bag' ? prev.fluid : 'NaCl 0.9%'}))} className={`p-2 border rounded-md transition-colors ${vehicle.type === 'bag' && vehicle.volume === v ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-200 hover:bg-blue-100 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700'}`}>{v}</button>)}
                                                </div>
                                            </div>
                                        )}
                                        <div>
                                            <label htmlFor="infusionDuration" className="flex items-center gap-1.5 text-sm font-medium text-slate-600 mb-2">
                                                Tempo Infusão (h)
                                                <div onClick={() => setShowRateGuideModal(true)} className="cursor-pointer">
                                                    <QuestionMarkCircleIcon className="w-4 h-4 text-slate-500 hover:text-blue-600" />
                                                </div>
                                            </label>
                                             <TextField id="infusionDuration" type="number" value={infusionDuration || ''} onChange={e => setInfusionDuration(parseFloat(e.target.value) || 0)} fullWidth size="small" label="Tempo (h)" />
                                        </div>
                                    </div>
                                    {vehicle.type === 'bag' && (
                                        <div>
                                            <label className="block text-sm font-medium text-slate-600 mb-2">Tipo de Fluido</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {fluidTypes.map(f => <button key={f} onClick={() => setVehicle(prev => ({...prev, type:'bag', fluid: f, volume: prev.type==='bag' ? prev.volume : 500 }))} className={`p-2 border rounded-md text-sm transition-colors ${vehicle.type === 'bag' && vehicle.fluid === f ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-200 hover:bg-blue-100 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700'}`}>{f}</button>)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                </div>
                            )}

                             {calculationMode === 'bolus' && hasBolus && selectedDrug && (
                                <BolusCalculator
                                    patient={patient}
                                    drug={selectedDrug}
                                    concentration={selectedConcentration}
                                    doseAdjustment={doseAdjustment}
                                    overrideComorbidityDoseReduction={overrideComorbidityDoseReduction}
                                    onOverrideChange={setOverrideComorbidityDoseReduction}
                                />
                            )}
                               
                            {calculationMode === 'cri' && criCalculation && (criCalculation.drugVolume || criCalculation.isCombo || criCalculation.error || criCalculation.notesAndWarnings) && (
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-200 dark:border-blue-900 rounded-lg mt-4 space-y-3">
                                    <h4 className="text-lg font-bold text-blue-800 dark:text-blue-300">Resultado da CRI</h4>
                                    <div className="text-xs text-slate-700 dark:text-slate-300">
                                        Boas práticas: bomba de seringa/volumétrica; linha dedicada para aminas/nitroprussiato; dupla checagem em drogas high-alert. Evite bicarbonato com catecolaminas, RL com remifentanil, nitroprussiato fora de SG5% sem proteção de luz.
                                    </div>
                                    
                                     {criCalculation.isCombo && criCalculation.comboResult ? (
                                        <div className="space-y-4">
                                            <p className="text-base text-slate-700 text-center">Para preparar {vehicle.volume}mL para infusão em {infusionDuration}h:</p>
                                            <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                                                {criCalculation.comboResult.instructions.map((inst, i) => <li key={i} dangerouslySetInnerHTML={{ __html: inst }} />)}
                                            </ul>
                                            <p className="font-bold text-lg text-blue-700 dark:text-blue-300 text-center py-2">Taxa de Infusão Final: {criCalculation.comboResult.finalRate} mL/h <span className="text-sm font-normal text-slate-500 dark:text-slate-400">(≈{criCalculation.comboResult.finalRate} gtt/min)</span></p>
                                        </div>
                                    ) : criCalculation.error ? (
                                        <WarningComponent text={criCalculation.error} type="critical" icon={<AlertTriangleIcon className="w-5 h-5"/>} />
                                    ) : criCalculation.message ? (
                                        <div className="space-y-3">
                                            <p className="text-base text-slate-700 dark:text-slate-200 text-center" dangerouslySetInnerHTML={{ __html: criCalculation.message }}></p>
                                                <div className="grid grid-cols-3 gap-2 text-sm text-center">
                                                <div className="bg-white dark:bg-slate-900 p-2 rounded-md border border-slate-200 dark:border-slate-700">
                                                    <p className="font-bold text-blue-600 dark:text-blue-300 text-lg">{criCalculation.drugVolume}</p>
                                                    <p className="text-slate-600 dark:text-slate-300">mL de Fármaco</p>
                                                </div>
                                                <div className="bg-white dark:bg-slate-900 p-2 rounded-md border border-slate-200 dark:border-slate-700">
                                                    <p className="font-bold text-blue-600 dark:text-blue-300 text-lg">{criCalculation.diluentVolume}</p>
                                                    <p className="text-slate-600 dark:text-slate-300">mL de Diluente</p>
                                                </div>
                                                 <div className="bg-white dark:bg-slate-900 p-2 rounded-md border border-slate-200 dark:border-slate-700">
                                                    <p className="font-bold text-blue-600 dark:text-blue-300 text-lg">{criCalculation.finalRate}</p>
                                                     <p className="text-slate-600 dark:text-slate-300">mL/h <span className="text-xs">(≈{criCalculation.finalRate} gtt/min)</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}

                                    {criCalculation.notesAndWarnings && criCalculation.notesAndWarnings.messages.length > 0 ? (
                                        <div className="mt-4 pt-4 border-t border-dashed border-blue-300 dark:border-blue-700 space-y-3">
                                            {criCalculation.notesAndWarnings.messages.map((w, i) => (
                                                <WarningComponent key={`warning-${i}`} {...w} />
                                            ))}
                                            
                                            {criCalculation.notesAndWarnings.showComorbidityOverride && (
                                                <label className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg cursor-pointer hover:bg-yellow-100/70 dark:hover:bg-yellow-900/30">
                                                    <input 
                                                        type="checkbox"
                                                        checked={overrideComorbidityDoseReduction}
                                                        onChange={(e) => setOverrideComorbidityDoseReduction(e.target.checked)}
                                                        className="h-5 w-5 rounded border-gray-400 text-red-600 focus:ring-red-500"
                                                    />
                                                    <span className="text-sm text-yellow-900 dark:text-yellow-200 font-medium">
                                                        Estou ciente dos riscos, mas quero continuar com a dose padrão.
                                                    </span>
                                                </label>
                                            )}
                                        </div>
                                    ) : null}

                                </div>
                            )}

                           </div>
                        </Section>
                    )}
                </div>
            </main>
            <footer className="text-center p-6 text-xs text-[rgb(var(--ui-muted))]">
                <p>Esta ferramenta é um auxílio para profissionais veterinários. Não substitui o julgamento clínico, o exame físico completo ou a monitorização do paciente.</p>
                <p>Todos os cálculos devem ser confirmados antes da administração. Use com responsabilidade.</p>
                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">📋 Resumo Geral CRIs Vet</h4>
                    <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                        <p><strong>Infusões Combinadas:</strong> MLK, FLK, DMLK com presets 25/50/75/100%</p>
                        <p><strong>Vasoativos:</strong> Noradrenalina, Fenilefrina, Dobutamina, Dopamina, Nitroprussiato</p>
                        <p><strong>Antibióticos:</strong> Intermitente padrão, CRI excepcional com justificativa</p>
                        <p><strong>GI/Diurético:</strong> Metoclopramida, Furosemida, Ondansetrona</p>
                        <p><strong>Endócrino:</strong> Insulina Regular (DKA), Sulfato de Magnésio</p>
                        <p><strong>NMBAs:</strong> Rocurônio, Vecurônio, Atracúrio com reversão</p>
                    </div>
                </div>
            </footer>
        </ThemeProvider>
    );
}

const BolusCalculator: React.FC<{
    patient: Patient;
    drug: Drug;
    concentration: DrugConcentration | null;
    doseAdjustment: { factor: number; hasAgeAdjustment: boolean; hasComorbidityAdjustment: boolean; };
    overrideComorbidityDoseReduction: boolean;
    onOverrideChange: (override: boolean) => void;
}> = ({ patient, drug, concentration, doseAdjustment, overrideComorbidityDoseReduction, onOverrideChange }) => {

    const appropriateBolusDose = useMemo(() => {
        if (!drug.bolusDoses) return null;
        const speciesKey = patient.species === Species.Dog ? 'dog' : 'cat';
        return drug.bolusDoses.find(d => d.species === speciesKey) 
            || drug.bolusDoses.find(d => d.species === 'both');
    }, [drug, patient.species]);

    const [bolusDoseValue, setBolusDoseValue] = useState(0);
    const [bolusInfusionTime, setBolusInfusionTime] = useState<number | undefined>(appropriateBolusDose?.infusionTimeMin);

    const adjustedBolusRange = useMemo(() => {
        if (!appropriateBolusDose) return null;
        return {
            min: appropriateBolusDose.min * doseAdjustment.factor,
            max: appropriateBolusDose.max * doseAdjustment.factor,
        };
    }, [appropriateBolusDose, doseAdjustment]);
    
    useEffect(() => {
        if(appropriateBolusDose && adjustedBolusRange) {
            const defaultDose = (adjustedBolusRange.min + adjustedBolusRange.max) / 2;
            setBolusDoseValue(defaultDose);
            setBolusInfusionTime(appropriateBolusDose.infusionTimeMin);
        }
    }, [appropriateBolusDose]); // Removed adjustedBolusRange from deps to avoid re-triggering on every adjustment change

    const bolusCalculation = useMemo(() => {
        if (!appropriateBolusDose || !concentration || !patient.weight || patient.weight <= 0 || bolusDoseValue <= 0) {
            return null;
        }

        const notes: {text: string, type: 'critical'|'warning'|'info', icon: React.ReactNode}[] = [];
        if (appropriateBolusDose.notes) {
            notes.push({text: appropriateBolusDose.notes, type: 'info', icon: <InfoIcon className="w-5 h-5"/>});
        }
        if (doseAdjustment.hasAgeAdjustment) {
            notes.push({ text: `A dose sugerida foi <strong>reduzida em 25%</strong> devido à idade do paciente (${patient.state}).`, type: 'info', icon: <InfoIcon className="w-5 h-5"/>});
        }

        const hasHepaticRisk = patient.hepaticDisease && !!drug.info?.adjustments.hepatic;
        const hasRenalRisk = patient.renalDisease && !!drug.info?.adjustments.renal;

        if (doseAdjustment.hasComorbidityAdjustment) {
            if (overrideComorbidityDoseReduction) {
                 notes.push({ 
                    text: `O ajuste automático de dose para comorbidade foi <strong>ignorado por sua solicitação</strong>. A dose padrão está em uso. Monitore o paciente com atenção redobrada.`, 
                    type: 'critical', 
                    icon: <AlertTriangleIcon className="w-5 h-5"/> 
                });
            } else {
                 let reductionPercent = 0;
                if (hasHepaticRisk) reductionPercent += 25;
                if (hasRenalRisk) reductionPercent += 25;
                 notes.push({
                    text: `A dose sugerida foi <strong>reduzida em ${reductionPercent}%</strong> devido ao(s) risco(s) de comorbidade.`,
                    type: 'warning',
                    icon: <AlertTriangleIcon className="w-5 h-5"/>
                });
            }
        }
        
        const totalDose = bolusDoseValue * patient.weight;
        let concentrationValueInDoseUnit = concentration.value;

        if (appropriateBolusDose.unit === BolusDoseUnit.mg_kg && concentration.unit === 'μg/mL') {
            concentrationValueInDoseUnit = concentration.value / 1000;
        } else if (appropriateBolusDose.unit === BolusDoseUnit.mcg_kg && concentration.unit === 'mg/mL') {
            concentrationValueInDoseUnit = concentration.value * 1000;
        } else if (appropriateBolusDose.unit === BolusDoseUnit.U_kg && concentration.unit !== 'U/mL') {
            return { error: 'Incompatibilidade de unidade entre dose (U/kg) e concentração.' };
        }

        if(concentrationValueInDoseUnit === 0) {
            return { error: 'Concentração do fármaco não pode ser zero.' };
        }

        const totalVolume = totalDose / concentrationValueInDoseUnit;
        const finalRateMlh = (bolusInfusionTime && bolusInfusionTime > 0) ? (totalVolume / (bolusInfusionTime / 60)) : undefined;

        return {
            totalDose: totalDose.toFixed(2),
            totalVolume: totalVolume.toFixed(3),
            doseUnit: appropriateBolusDose.unit,
            finalRate: finalRateMlh?.toFixed(2),
            notesAndWarnings: {
                messages: notes,
                showComorbidityOverride: doseAdjustment.hasComorbidityAdjustment
            }
        };

    }, [bolusDoseValue, patient, drug, concentration, appropriateBolusDose, doseAdjustment, overrideComorbidityDoseReduction, bolusInfusionTime]);

    if (!appropriateBolusDose || !adjustedBolusRange || !concentration) {
        return <p className="text-center text-slate-500">Não foi possível carregar os dados para o cálculo de bólus.</p>;
    }

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Dose de Bólus ({appropriateBolusDose.unit})</label>
                <div className="flex items-center gap-2">
                    <input type="range" min={adjustedBolusRange.min} max={adjustedBolusRange.max} step={(adjustedBolusRange.max - adjustedBolusRange.min) / 100 || 0.01} value={bolusDoseValue}
                        onChange={e => setBolusDoseValue(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        disabled={adjustedBolusRange.min === adjustedBolusRange.max}
                    />
                    <input type="number" value={bolusDoseValue.toFixed(3)}
                        onChange={e => setBolusDoseValue(parseFloat(e.target.value))}
                        className="w-24 p-2 border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 rounded-md text-center no-spinner text-slate-900 dark:text-slate-200"
                        disabled={adjustedBolusRange.min === adjustedBolusRange.max}
                    />
                </div>
                <p className="text-xs text-slate-500 mt-1">Faixa ajustada recomendada: {adjustedBolusRange.min.toFixed(2)} - {adjustedBolusRange.max.toFixed(2)} {appropriateBolusDose.unit}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Apresentação</label>
                     <p className="p-2 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-200 min-h-[42px] flex items-center text-sm">{concentration.label}</p>
                </div>
                <div>
                    <label htmlFor="bolusInfusionTime" className="block text-sm font-medium text-slate-600 mb-2">Tempo de Infusão (min)</label>
                    <input id="bolusInfusionTime" type="number" value={bolusInfusionTime || ''} onChange={e => setBolusInfusionTime(parseFloat(e.target.value) || undefined)}
                        className="w-full p-2 border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-200 no-spinner"
                        placeholder="Opcional"
                    />
                </div>
            </div>

            {bolusCalculation && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-200 dark:border-blue-900 rounded-lg mt-4 space-y-3">
                    <h4 className="text-lg font-bold text-blue-800 dark:text-blue-300">Resultado do Bólus</h4>
                    {bolusCalculation.error ? (
                        <WarningComponent text={bolusCalculation.error} type="critical" icon={<AlertTriangleIcon className="w-5 h-5"/>} />
                    ) : (
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-sm text-center">
                                <div className="bg-white dark:bg-slate-900 p-2 rounded-md border border-slate-200 dark:border-slate-700">
                                    <p className="font-bold text-blue-600 dark:text-blue-300 text-lg">{bolusCalculation.totalDose}</p>
                                    <p className="text-slate-500 dark:text-slate-400">Dose Total ({bolusCalculation.doseUnit.replace('/kg', '')})</p>
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-2 rounded-md border border-slate-200 dark:border-slate-700">
                                    <p className="font-bold text-blue-600 dark:text-blue-300 text-lg">{bolusCalculation.totalVolume}</p>
                                    <p className="text-slate-500 dark:text-slate-400">Volume Total (mL)</p>
                                </div>
                            </div>
                            {bolusCalculation.finalRate && (
                                <div className="bg-white dark:bg-slate-900 p-3 rounded-md border border-slate-200 dark:border-slate-700 text-center">
                                    <p className="font-bold text-blue-600 dark:text-blue-300 text-lg">{bolusCalculation.finalRate} mL/h</p>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">Taxa para Bomba de Infusão</p>
                                </div>
                            )}
                        </div>
                    )}

                    {bolusCalculation.notesAndWarnings && bolusCalculation.notesAndWarnings.messages.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-dashed border-blue-300 dark:border-blue-700 space-y-3">
                            {bolusCalculation.notesAndWarnings.messages.map((w, i) => (
                                <WarningComponent key={`bolus-warning-${i}`} {...w} />
                            ))}
                            
                            {bolusCalculation.notesAndWarnings.showComorbidityOverride && (
                                <label className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg cursor-pointer hover:bg-yellow-100/70 dark:hover:bg-yellow-900/30">
                                    <input 
                                        type="checkbox"
                                        checked={overrideComorbidityDoseReduction}
                                        onChange={(e) => onOverrideChange(e.target.checked)}
                                        className="h-5 w-5 rounded border-gray-400 text-red-600 focus:ring-red-500"
                                    />
                                    <span className="text-sm text-yellow-900 dark:text-yellow-200 font-medium">
                                        Ignorar ajuste de comorbidade.
                                    </span>
                                </label>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
