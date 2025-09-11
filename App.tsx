
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useTheme } from './components/theme/ThemeProvider';

// Fix temporário para Material-UI v7 + React 19
if (typeof window !== 'undefined') {
    // Polyfill para resolver erro de palette
    const originalConsoleError = console.error;
    console.error = (...args) => {
        if (args[0]?.includes?.('gx_no_16 is not present in staticLoadtimePalette')) {
            return; // Suprime este erro específico
        }
        originalConsoleError.apply(console, args);
    };
}
// Material UI (Google Material Design)
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';
import { Species, PatientState, Patient, Drug, CriDose, BolusDose, DrugConcentration, CriDoseUnit, BolusDoseUnit, Vehicle, WarningType, FluidType } from './types';
import { NumberFieldBR } from './components/inputs/NumberFieldBR';
import { classifyCriDose, classifyBolusDose } from './utils/rangeClassifier';
import { DoseCRICard, RecRange, formatDoseLocale, parseDoseLocale, clamp } from './components/DoseSelector';
import { convertDose, convertRange, buildAbs, type DoseUnit } from './utils/doseUnits';
// import { getCompatibilityLevel } from './utils/compatibility'; // Removido - não existe mais
import { RangeAlert } from './components/alerts/RangeAlert';
import { SourcesFootnote } from './components/alerts/SourcesFootnote';
import { 
  CONSOLIDATED_DRUGS, 
  COMPATIBILITY_MATRIX, 
  FORMULAS, 
  EXAMPLES,
  EXPANDED_COMPATIBILITY_MATRIX,
  EXPANDED_FORMULAS,
  EXPANDED_EXAMPLES,
  TOOLTIPS,
  COMORBIDITY_ADJUSTMENTS,
  CHECKLISTS,
  ADDITIONAL_COMPATIBILITY_MATRIX,
  ADDITIONAL_FORMULAS,
  ADDITIONAL_EXAMPLES,
  ADDITIONAL_TOOLTIPS,
  ADDITIONAL_CHECKLISTS
} from './data/consolidated_drugs';
import { SyringeIcon, BagIcon, AlertTriangleIcon, EyeOffIcon, BeakerIcon, QuestionMarkCircleIcon, InfoIcon, ActivityIcon } from './components/icons';
import { DrugInfoModal } from './components/DrugInfoModal';
import { CompatibilityGuide } from './components/CompatibilityGuide';
import { CompatibilityAlertBar } from './components/CompatibilityAlertBar';
import { checkCompatibility } from './utils/compatibility';
import { warningsFor } from './utils/warnings';
import { ConcentrationSelect } from './components/ConcentrationSelect';
import { calculateCRI, calculateBolus, checkCompatibility as checkFluidCompatibility, CriUnit, BolusUnit } from './utils/engine';
import { CalculationSteps } from './components/CalculationSteps';
import { ResultsCard } from './components/ResultsCard';
import { DoseUnitSelector, getRangeForUnit } from './components/dosing/DoseUnitSelector';
import type { DrugUnit } from './context/DrugContext';

function comorbidityWarnings(patient: Patient, drug: Drug | null): string[] {
  const w: string[] = [];
  if (!drug) return w;
  if (patient.renalDisease) w.push("Risco Renal: ajuste 25–50% (metabólitos renais).");
  if (patient.hepaticDisease) w.push("Risco Hepático: reduzir dose; monitorar sedação/ECG.");
  if (patient.cardiacDisease) w.push("Risco Cardíaco: administrar lentamente; monitorar PA/ECG.");
  if (patient.septicShock) w.push("Choque Séptico: titule com cautela; priorize hemodinâmica.");
  if (patient.neuroDisease) w.push("Neurológico: risco de tremores/convulsão em altas doses.");
  return w;
}

const DrugAdditionalInfo: React.FC<{ drug: Drug }> = ({ drug }) => {
  // Encontrar informações de compatibilidade para o medicamento
  const drugName = drug.name.toLowerCase();
  const compatibilityInfo = {
    ...COMPATIBILITY_MATRIX,
    ...EXPANDED_COMPATIBILITY_MATRIX,
    ...ADDITIONAL_COMPATIBILITY_MATRIX
  };
  
  const drugCompatibility = Object.entries(compatibilityInfo).find(([key, _]) => 
    key.toLowerCase().includes(drugName) || drugName.includes(key.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Informações Básicas do Medicamento */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">📋 Informações Básicas</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Nome:</span>
            <span className="ml-2 text-slate-600 dark:text-slate-300">{drug.name}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Categoria:</span>
            <span className="ml-2 text-slate-600 dark:text-slate-300">{drug.category}</span>
          </div>
          {drug.info?.indicationSummary && (
            <div className="md:col-span-2">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Indicações:</span>
              <span className="ml-2 text-slate-600 dark:text-slate-300">{drug.info.indicationSummary.join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Compatibilidade Y-site */}
      {drugCompatibility && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-3">🟢🟡🔴 Compatibilidade Y-site</h4>
          <div className="space-y-3">
            <div>
              <span className="text-green-600 font-medium">🟢 Compatível:</span>
              <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                {drugCompatibility[1]['🟢']?.join(', ') || 'Nenhum'}
              </div>
            </div>
            {drugCompatibility[1]['🟡'] && (
              <div>
                <span className="text-yellow-600 font-medium">🟡 Cautela:</span>
                <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  {drugCompatibility[1]['🟡'].join(', ')}
                </div>
              </div>
            )}
            <div>
              <span className="text-red-600 font-medium">🔴 Incompatível:</span>
              <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                {drugCompatibility[1]['🔴']?.join(', ') || 'Nenhum'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REMOVIDO: bloco de fórmulas universais/quick examples no final da página */}

      {/* Boas Práticas */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-3">✅ Boas Práticas</h4>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-green-600 mt-1">•</span>
            <span className="text-sm text-slate-700 dark:text-slate-200">Padronizar lidocaína em 1 mg/mL</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600 mt-1">•</span>
            <span className="text-sm text-slate-700 dark:text-slate-200">Retirar volume da bolsa antes de adicionar fármacos</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600 mt-1">•</span>
            <span className="text-sm text-slate-700 dark:text-slate-200">Usar linha dedicada se houver incompatibilidades</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600 mt-1">•</span>
            <span className="text-sm text-slate-700 dark:text-slate-200">Proteger da luz quando necessário (noradrenalina, nitroprussiato)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600 mt-1">•</span>
            <span className="text-sm text-slate-700 dark:text-slate-200">Dupla checagem em drogas high-alert</span>
          </div>
        </div>
      </div>

      {/* Alertas Importantes */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-3">⚠️ Alertas Importantes</h4>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-red-600 mt-1">•</span>
            <span className="text-sm text-slate-700 dark:text-slate-200">Evitar bicarbonato com catecolaminas</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-600 mt-1">•</span>
            <span className="text-sm text-slate-700 dark:text-slate-200">RL com remifentanil</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-600 mt-1">•</span>
            <span className="text-sm text-slate-700 dark:text-slate-200">Nitroprussiato fora de SG5% sem proteção de luz</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-600 mt-1">•</span>
            <span className="text-sm text-slate-700 dark:text-slate-200">Ceftriaxone com cálcio/RL (proibido)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-600 mt-1">•</span>
            <span className="text-sm text-slate-700 dark:text-slate-200">Lidocaína com adrenalina em misturas</span>
          </div>
        </div>
      </div>

      {/* Stewardship Antibióticos */}
      {drug.category === 'Antimicrobianos' && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">🦠 Stewardship (Antibióticos)</h4>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span className="text-sm text-slate-700 dark:text-slate-200">Padrão = Intermitente (10-60 min)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span className="text-sm text-slate-700 dark:text-slate-200">"Infusão estendida" apenas para beta-lactâmicos tempo-dependentes</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span className="text-sm text-slate-700 dark:text-slate-200">"CRI (Excepcional)" atrás de toggle com justificativa</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span className="text-sm text-slate-700 dark:text-slate-200">Diluente preferido: SF 0.9%</span>
            </div>
          </div>
        </div>
      )}

      {/* NMBAs & Reversão */}
      {drug.category === 'Bloqueadores Neuromusculares' && (
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-3">💪 NMBAs & Reversão</h4>
          <div className="space-y-2">
            <div className="text-sm text-slate-700 dark:text-slate-200 mb-2">
              <strong>Regras:</strong> VM + TOF obrigatórios. Não produzem sedação/analgesia.
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-600 mt-1">•</span>
              <span className="text-sm text-slate-700 dark:text-slate-200">Rocurônio: bólus 0.5 mg/kg; CRI ~0.2 mg/kg/h</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-600 mt-1">•</span>
              <span className="text-sm text-slate-700 dark:text-slate-200">Vecurônio: bólus 0.1 mg/kg; CRI 0.1-0.2 mg/kg/h</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-600 mt-1">•</span>
              <span className="text-sm text-slate-700 dark:text-slate-200">Atracúrio: bólus 0.2-0.5 mg/kg; CRI 3-9 µg/kg/min</span>
            </div>
            <div className="text-sm text-slate-700 dark:text-slate-200 mt-2">
              <strong>Reversão:</strong> Sugamadex 8 mg/kg (roc/vec) OU Neostigmina 0.02-0.07 mg/kg + atropina
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

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
                    <button onClick={() => setPatient(p => ({ ...p, species: Species.Canine }))}
                        className={`flex flex-col items-center gap-2 p-3 border-2 rounded-lg transition-all duration-200 ${patient.species === Species.Canine ? 'border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300' : 'border-slate-200 dark:border-slate-700 hover:border-blue-400 text-slate-700 dark:text-slate-300'}`}>
                        <span className="text-3xl">🐶</span>
                        <span className="font-medium">Cão</span>
                    </button>
                    <button onClick={() => setPatient(p => ({ ...p, species: Species.Feline }))}
                        className={`flex flex-col items-center gap-2 p-3 border-2 rounded-lg transition-all duration-200 ${patient.species === Species.Feline ? 'border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300' : 'border-slate-200 dark:border-slate-700 hover:border-blue-400 text-slate-700 dark:text-slate-300'}`}>
                        <span className="text-3xl">🐱</span>
                        <span className="font-medium">Gato</span>
                    </button>
                </div>
            </div>

            <div>
                <label htmlFor="weight" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                    Peso do Paciente
                </label>
                <NumberFieldBR
                    id="weight"
                    value={Number.isFinite(patient.weight) ? patient.weight : null}
                    onChange={(v) => setPatient(p => ({ ...p, weight: v ?? 0 }))}
                    suffix="kg"
                    decimals={2}
                />
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
                return drug.comboDetails?.targetSpecies === (patient.species === Species.Canine ? 'dog' : 'cat');
            }
            const speciesFilter = (patient.species === Species.Canine ? 'dog' : 'cat');
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
    const { theme: currentTheme } = useTheme();
    const isDark = currentTheme === 'dark' || (currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const [patient, setPatient] = useState<Patient>({ species: Species.Canine, state: PatientState.Adult, weight: 0, hepaticDisease: false, renalDisease: false, cardiacDisease: false, septicShock: false, neuroDisease: false });
    const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
    const [selectedCriDose, setSelectedCriDose] = useState<CriDose | null>(null);
    const [selectedConcentration, setSelectedConcentration] = useState<DrugConcentration | null>(null);
    const [calculationMode, setCalculationMode] = useState<'cri' | 'bolus'>('cri');

    const [criDose, setCriDose] = useState(0);
    const [criDoseText, setCriDoseText] = useState(formatDoseLocale(0));
    const [vehicle, setVehicle] = useState<Vehicle>({ type: 'syringe', volume: 60 });
    const [infusionDuration, setInfusionDuration] = useState(12);
    
    const [overrideComorbidityDoseReduction, setOverrideComorbidityDoseReduction] = useState(false);
    const [showRateGuideModal, setShowRateGuideModal] = useState(false);
    const [showCompatibilityGuide, setShowCompatibilityGuide] = useState(false);
    const [infoModalDrug, setInfoModalDrug] = useState<Drug | null>(null);
    const [customCriUnit, setCustomCriUnit] = useState<DrugUnit>('mcg/kg/min');
    
    // Referência para a unidade anterior (para conversão)
    const unitRef = useRef<DoseUnit>(customCriUnit as DoseUnit);

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

        if (patient.state === PatientState.Young || patient.state === PatientState.Senior || patient.state === PatientState.Pregnant || patient.state === PatientState.Lactating) {
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

        const speciesKey = patient.species === Species.Canine ? 'dog' : 'cat';
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

    // Sincroniza o texto formatado com a dose
    useEffect(() => {
        setCriDoseText(formatDoseLocale(criDose));
    }, [criDose]);

    // Conversão de unidade mantendo equivalência farmacológica
    useEffect(() => {
        if (unitRef.current !== customCriUnit) {
            setCriDose((prev) => convertDose(prev, unitRef.current, customCriUnit as DoseUnit));
            unitRef.current = customCriUnit as DoseUnit;
        }
    }, [customCriUnit]);

    // Função para lidar com mudanças no input de dose
    const handleDoseInputChange = (text: string) => {
        setCriDoseText(text);
        const parsed = parseDoseLocale(text);
        
        // Obter faixa recomendada e calcular range absoluto
        const r = getRangeForUnit(selectedDrug as any, customCriUnit);
        const rec = r.min === 0 && r.max === 0 ? { min: 0, max: 0 } : r;
        const abs = buildAbs(rec);
        
        setCriDose(clamp(parsed, abs.min, abs.max));
    };
    
    const adjustedCriRange = useMemo(() => {
        if (!selectedCriDose) return null;
        return {
            min: selectedCriDose.cri.min * doseAdjustment.factor,
            max: selectedCriDose.cri.max * doseAdjustment.factor,
        };
    }, [selectedCriDose, doseAdjustment]);
    
    // New CRI calc (puro + memo)
    const criResult = React.useMemo(() => {
        try {
            if (!selectedDrug || !selectedConcentration || !patient?.weight) return null;

            // Mapeie o enum para a chave usada pelo engine (se seu enum já for string "mcg_kg_min", perfeito)
            const unitKey = selectedCriDose?.cri?.unit ?? customCriUnit; // caia para custom se necessário

            return calculateCRI({
                doseValue: criDose,
                doseUnit: unitKey as any,
                weightKg: patient.weight,
                rateMlH: 10,
                vialConcMgMl: selectedConcentration.value,
                vehicleVolumeMl: vehicle.volume,
                durationH: infusionDuration,
            });
        } catch (e) {
            console.error(e);
            return null;
        }
    }, [
        selectedDrug,
        selectedConcentration,
        patient?.weight,
        criDose,
        customCriUnit,
        selectedCriDose,
        vehicle.type,
        vehicle.volume,
        infusionDuration,
    ]);

    // Classificação de faixa para CRI
    const criRange = React.useMemo(() => {
        if (!selectedDrug || !criDose) return null
        return classifyCriDose(selectedDrug as any, criDose, customCriUnit as any)
    }, [selectedDrug, criDose, customCriUnit])

    const criCalculation = useMemo(() => {
        const steps: string[] = [];
        if (!selectedDrug || !patient?.weight || !selectedConcentration) {
            return { ready: false, steps, results: null };
        }
        
        // 1) Dose → mg/kg/h
        const toMgKgH = (unit: string, v: number) => {
            if (unit === "mcg/kg/min") return (v * 60) / 1000;
            if (unit === "mcg/kg/h") return v / 1000;
            return v; // mg/kg/h
        };
        const doseMgKgH = toMgKgH(customCriUnit, criDose);
        steps.push(`Convertendo dose: ${criDose} ${customCriUnit} → ${doseMgKgH.toFixed(3)} mg/kg/h`);

        // 2) mg/h
        const mgPerH = doseMgKgH * patient.weight;
        steps.push(`mg/h = ${doseMgKgH.toFixed(3)} × ${patient.weight} kg = ${mgPerH.toFixed(3)} mg/h`);

        // 3) mL/h pela concentração
        const concMgMl = selectedConcentration.value ?? 0;
        const mlPerH = concMgMl > 0 ? mgPerH / concMgMl : 0;
        steps.push(`mL/h = ${mgPerH.toFixed(3)} ÷ ${concMgMl} mg/mL = ${mlPerH.toFixed(3)} mL/h`);

        // 4) Para veículo/tempo
        const totalMl = mlPerH * infusionDuration;
        steps.push(`Volume total = ${mlPerH.toFixed(3)} × ${infusionDuration} h = ${totalMl.toFixed(2)} mL`);

                 return {
            ready: true,
            steps,
            results: { mlPerH, totalMl }
        };
    }, [selectedDrug, patient.weight, selectedConcentration, customCriUnit, criDose, infusionDuration]);

    const syringeVolumes = [10, 20, 60];
    const bagVolumes = [250, 500, 1000];
    const fluidTypes: FluidType[] = ['NaCl 0.9%', 'Ringer Lactato', 'SG 5%'];
    
    const speciesKey = patient.species === Species.Canine ? 'dog' : 'cat';
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
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {currentTheme === 'light' ? 'Claro' : currentTheme === 'dark' ? 'Escuro' : 'Sistema'}
                  </span>
                </div>
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
                                {/* COMENTADO PARA BISECT - BLOCO 1
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
                                
                                {/* Avisos de comorbidades */}
                                {selectedDrug && warningsFor(patient, selectedDrug.id).map((warning, i) => (
                                    <WarningComponent 
                                        key={`comorbidity-${i}`} 
                                        text={warning} 
                                        type="warning" 
                                        icon={<AlertTriangleIcon className="w-5 h-5"/>} 
                                    />
                                ))}
                            </div>


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
                                {/* Apresentação única */}
                                {selectedDrug && !selectedDrug.isCombo && (
                                    <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-2">Apresentação</label>
                                    <select
                                      value={selectedConcentration?.label || ""}
                                      onChange={(e) =>
                                        setSelectedConcentration(
                                          selectedDrug?.concentrations?.find((c) => c.label === e.target.value) || null
                                        )
                                      }
                                      className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200"
                                    >
                                      {(selectedDrug?.concentrations || []).map((c) => (
                                        <option key={c.label} value={c.label}>
                                          {c.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                )}

                                {/* Unidade + Dose (CRI) */}
                                {selectedDrug && !selectedDrug.isCombo && selectedConcentration && (
                                  <div className="space-y-3">
                                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                                      Unidade da dose (CRI)
                                    </label>
                                    <DoseUnitSelector
                                      drug={selectedDrug as any}
                                      unit={customCriUnit}
                                      onChange={(u) => setCustomCriUnit(u)}
                                    />
                                    
                                    {/* Campo Dose (CRI) com two-way binding */}
                                    <div className="mt-3">
                                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                                        Dose (CRI)
                                      </label>
                                      <input
                                        value={criDoseText}
                                        onChange={(e) => handleDoseInputChange(e.target.value)}
                                        inputMode="decimal"
                                        className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200"
                                        placeholder="0"
                                      />
                                    </div>

                                    {/* DoseCRICard integrado */}
                                    {(() => {
                                      // 1) Obter faixa recomendada do medicamento selecionado
                                      const unit: DoseUnit = customCriUnit as DoseUnit;
                                      
                                      // Buscar a dose recomendada do medicamento na unidade atual
                                      const selectedDose = selectedDrug?.criDoses?.find(d => d.cri.unit === unit);
                                      
                                      let rec: RecRange;
                                      let presets: number[] | undefined;
                                      
                                      if (selectedDose) {
                                        // Usar dados reais do medicamento
                                        rec = {
                                          min: selectedDose.cri.min,
                                          max: selectedDose.cri.max
                                        };
                                        
                                        // Presets baseados na faixa real do medicamento
                                        const range = rec.max - rec.min;
                                        const step = range / 4; // 5 presets
                                        presets = [
                                          rec.min,
                                          rec.min + step,
                                          rec.min + step * 2,
                                          rec.min + step * 3,
                                          rec.max
                                        ].map(v => Math.round(v * 100) / 100); // Arredondar para 2 casas decimais
                                      } else {
                                        // Fallback se não encontrar a unidade
                                        rec = { min: 0, max: 0 };
                                        presets = undefined;
                                      }
                                      
                                      // 2) Range absoluto coerente (2x o máximo recomendado)
                                      const abs = buildAbs(rec);

                                      return (
                                        <DoseCRICard
                                          title="Seletor de Dose"
                                          unit={unit}
                                          dose={criDose}
                                          onDoseChange={setCriDose}
                                          rec={rec}        // ← JÁ CONVERTIDA P/ A UNIDADE ATUAL
                                          abs={abs}        // ← COERENTE (ex.: 2× o topo recomendado)
                                          presets={presets} // presets NA MESMA UNIDADE
                                          onStatusChange={(status) => {
                                            // opcional: enviar telemetria/validar formulário
                                            // status = "low" | "in" | "high"
                                            console.log(`Dose status: ${status}`);
                                          }}
                                        />
                                      );
                                    })()}
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
                                    
                                    {/* Instruções de Preparo */}
                                    {selectedDrug.preparationGuide && (
                                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400">
                                            <div className="flex justify-center items-center">
                                                <div className="flex-shrink-0">
                                                    <BeakerIcon className="h-6 w-6 text-amber-500" aria-hidden="true" />
                                                </div>
                                                <div className="ml-3 text-center">
                                                    <h3 className="text-base font-medium text-amber-800 dark:text-amber-400">Instruções de Preparo</h3>
                                                    <div className="mt-2 text-sm text-amber-700 dark:text-amber-300"
                                                         dangerouslySetInnerHTML={{ __html: selectedDrug.preparationGuide }}/>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {vehicle.type === 'bag' && (
                                        <div>
                                            <label className="block text-sm font-medium text-slate-600 mb-2">Tipo de Fluido</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {fluidTypes.map(f => <button key={f} onClick={() => setVehicle(prev => ({...prev, type:'bag', fluid: f, volume: prev.type==='bag' ? prev.volume : 500 }))} className={`p-2 border rounded-md text-sm transition-colors ${vehicle.type === 'bag' && vehicle.fluid === f ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-200 hover:bg-blue-100 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700'}`}>{f}</button>)}
                                            </div>
                                            
                                            {/* Alerta de compatibilidade */}
                                            {(() => {
                                              const comp = checkCompatibility(selectedDrug as any, (vehicle as any).fluid);
                                              const titles = {
                                                success: "Compatível ✅",
                                                warning: "Parcialmente compatível ⚠️",
                                                danger: "🚨 Incompatível"
                                              } as const;
                                                return (
                                                    <div className="mt-3">
                                                        <CompatibilityAlertBar
                                                    level={comp.level}
                                                    message={titles[comp.level]}
                                                    reason={comp.reason}
                                                        />
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    )}
                                </div>

                                {/* Cálculo e resultados usando o motor */}
                                {selectedDrug && !selectedDrug.isCombo && selectedConcentration && criDose && patient?.weight && (() => {
                                  const range = (selectedDrug as any).cri?.ranges?.find((r: any) => r.unit === customCriUnit);
                                  if (!range) return null;

                                  const calc = calculateCRI({
                                    doseValue: criDose,
                                    doseUnit: customCriUnit as CriUnit,
                                    weightKg: patient.weight,
                                    rateMlH: 10, // taxa padrão
                                    vialConcMgMl: selectedConcentration.value,
                                    vehicleVolumeMl: vehicle.volume,
                                    durationH: infusionDuration || 12,
                                  });

                                  const selectedFluid = (vehicle as any).fluid === 'NaCl 0.9%' ? 'sf' : 
                                                       (vehicle as any).fluid === 'Ringer Lactato' ? 'rl' : 
                                                       (vehicle as any).fluid === 'SG 5%' ? 'd5' : 'sf';
                                  const compat = checkFluidCompatibility(selectedFluid, (selectedDrug as any).cri?.compatibility || { preferred: 'rl' });

                                  return (
                                    <div className="space-y-4">
                                      {compat && (
                                        <CompatibilityAlertBar
                                          level={compat.level as any}
                                          message={compat.level === 'danger' ? `🚨 Incompatível com ${selectedFluid.toUpperCase()}` : `${compat.label} com ${selectedFluid.toUpperCase()}`}
                                          reason={compat.reason}
                                        />
                                      )}
                                      <ResultsCard
                                        results={{
                                          drugVolume: calc.results.drugVolumeMl,
                                          diluentVolume: calc.results.diluentVolumeMl,
                                          finalConcMgMl: calc.results.finalConcMgMl,
                                          rateMlH: calc.results.rateMlH
                                        }}
                                      />
                                      <CalculationSteps steps={criCalculation.steps} />
                                    </div>
                                  );
                                })()}
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
                               
                            {calculationMode === 'cri' && criCalculation && criCalculation.ready && (
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-200 dark:border-blue-900 rounded-lg mt-4 space-y-3">
                                    <h4 className="text-lg font-bold text-blue-800 dark:text-blue-300">Resultado da CRI</h4>
                                    <div className="text-xs text-slate-700 dark:text-slate-300">
                                        Boas práticas: bomba de seringa/volumétrica; linha dedicada para aminas/nitroprussiato; dupla checagem em drogas high-alert. Evite bicarbonato com catecolaminas, RL com remifentanil, nitroprussiato fora de SG5% sem proteção de luz.
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <p className="text-base text-slate-700 dark:text-slate-200 text-center">
                                            Resultado do cálculo CRI
                                        </p>
                                        <div className="grid grid-cols-2 gap-2 text-sm text-center">
                                            <div className="bg-white dark:bg-slate-900 p-2 rounded-md border border-slate-200 dark:border-slate-700">
                                                <p className="font-bold text-blue-600 dark:text-blue-300 text-lg">{criCalculation.results.mlPerH.toFixed(2)}</p>
                                                <p className="text-slate-600 dark:text-slate-300">mL/h</p>
                                            </div>
                                            <div className="bg-white dark:bg-slate-900 p-2 rounded-md border border-slate-200 dark:border-slate-700">
                                                <p className="font-bold text-blue-600 dark:text-blue-300 text-lg">{criCalculation.results.totalMl.toFixed(2)}</p>
                                                <p className="text-slate-600 dark:text-slate-300">mL total</p>
                                            </div>
                                        </div>
                                    </div>


                                    {/* Avisos por comorbidade */}
                                    {comorbidityWarnings(patient, selectedDrug).length > 0 && (
                                      <div className="mt-3 rounded-md border border-yellow-300 bg-yellow-50 text-yellow-800 p-3 dark:bg-yellow-900/20 dark:text-yellow-300">
                                        <p className="font-medium mb-1">⚠️ Ajustes por comorbidade:</p>
                                        <ul className="list-disc ml-5">
                                          {comorbidityWarnings(patient, selectedDrug).map((x, i) => <li key={i}>{x}</li>)}
                                        </ul>
                                      </div>
                                    )}

                                    {/* Passos de cálculo e fontes */}
                                    <CalculationSteps steps={criCalculation.steps} />
                                    <SourcesFootnote drug={selectedDrug} />

                                </div>
                            )}

                           </div>
                        </Section>
                    )}

                    {selectedDrug && (
                        <Section 
                            title="4. Informações Adicionais sobre o Medicamento" 
                            icon={<span className="text-2xl">📋</span>} 
                            InitiallyOpen={true}
                        >
                            <DrugAdditionalInfo drug={selectedDrug} />
                        </Section>
                    )}
                </div>
            </main>
            <footer className="text-center p-6 text-xs text-[rgb(var(--ui-muted))]">
                <p>Esta ferramenta é um auxílio para profissionais veterinários. Não substitui o julgamento clínico, o exame físico completo ou a monitorização do paciente.</p>
                <p>Todos os cálculos devem ser confirmados antes da administração. Use com responsabilidade.</p>

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

    const isContraindicated = drug.bolusDoses === undefined || drug.bolusDoses.length === 0;
    const [doseUnit, setDoseUnit] = useState<BolusUnit>('mg/kg');
    const [doseValue, setDoseValue] = useState<number>(1);
    const [vialConc, setVialConc] = useState<{value:number, unit:'mg/mL'|'μg/mL'}>({value:20, unit:'mg/mL'});

    useEffect(() => {
        if (!drug || !concentration) return;
        
        // Usar a primeira concentração disponível do medicamento para bolus
        const firstConcentration = drug.concentrations?.[0];
        if (firstConcentration) {
            setVialConc({ 
                value: firstConcentration.value, 
                unit: firstConcentration.unit as 'mg/mL'|'μg/mL' 
            });
        } else {
            setVialConc({ value: concentration.value, unit: concentration.unit as 'mg/mL'|'μg/mL' });
        }
        
        // unidade default: se o range do fármaco preferir mcg/kg, comece nela
        const first = drug.bolusDoses?.[0]?.unit as BolusUnit | undefined;
        if (first) setDoseUnit(first);
    }, [drug, concentration]);

    const calc = useMemo(() => {
        if (!drug || !patient?.weight || patient.weight <= 0) return null;
        return calculateBolus({ doseValue, doseUnit, weightKg: patient.weight, vialConc });
    }, [drug, doseValue, doseUnit, patient.weight, vialConc]);

    if (isContraindicated) {
        return (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-2">
                    <AlertTriangleIcon className="w-5 h-5 text-red-600" />
                    <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">🚫 Bólus contraindicado</h3>
                </div>
                <p className="text-red-700 dark:text-red-300 mt-2">Este fármaco não deve ser administrado em bólus.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                            Dose de Bólus
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        value="mg/kg"
                                        checked={doseUnit === 'mg/kg'}
                                        onChange={(e) => setDoseUnit(e.target.value as BolusUnit)}
                                        className="h-4 w-4"
                                    />
                                    <span className="text-sm">mg/kg</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        value="mcg/kg"
                                        checked={doseUnit === 'mcg/kg'}
                                        onChange={(e) => setDoseUnit(e.target.value as BolusUnit)}
                                        className="h-4 w-4"
                                    />
                                    <span className="text-sm">mcg/kg</span>
                                </label>
                            </div>
                            <input
                                type="number"
                                value={doseValue}
                                onChange={e => setDoseValue(Number(e.target.value || 0))}
                                className="w-36 p-2 border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 border-slate-300 dark:border-slate-700 rounded-md text-center no-spinner"
                                step="0.1"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                            Apresentação (concentração da ampola)
                        </label>
                        <select
                            value={`${vialConc.value}-${vialConc.unit}`}
                            onChange={(e) => {
                                const [value, unit] = e.target.value.split('-');
                                setVialConc({ value: Number(value), unit: unit as 'mg/mL'|'μg/mL' });
                            }}
                            className="w-full p-2 border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 border-slate-300 dark:border-slate-700 rounded-md"
                        >
                            {drug.concentrations?.map((conc, index) => (
                                <option key={index} value={`${conc.value}-${conc.unit}`}>
                                    {conc.label || `${conc.value} ${conc.unit}`}
                                </option>
                            )) || (
                                <>
                                    <option value="1-mg/mL">1 mg/mL</option>
                                    <option value="2-mg/mL">2 mg/mL</option>
                                    <option value="10-mg/mL">10 mg/mL</option>
                                    <option value="20-mg/mL">20 mg/mL</option>
                                    <option value="100-μg/mL">100 μg/mL</option>
                                    <option value="1000-μg/mL">1000 μg/mL</option>
                                </>
                            )}
                        </select>
                    </div>
                </div>
            </div>

            {calc && (
                <div className="space-y-4">
                    <ResultsCard
                        isBolus
                        results={{
                            totalDose: calc.results.totalDose,
                            totalVolume: calc.results.totalVolume
                        }}
                    />
                    <CalculationSteps steps={calc.steps.map(s => s.label)} isBolus />
                </div>
            )}
        </div>
    );
};
