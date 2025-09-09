import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Alert,
  Chip,
  Paper,
  Divider
} from '@mui/material';
import { 
  Drug, 
  CriDoseUnit, 
  BolusDoseUnit, 
  DoseInfo, 
  AlertMessage,
  CalculationResult 
} from '../types';
import { 
  calculateCRI, 
  calculateBolus, 
  convertDoseToMgPerKgPerHour,
  convertFromMgPerKgPerHour,
  validateDose,
  validateWeight,
  validateInfusionRate
} from '../utils/calculations';
import { AlertList } from './AlertBanner';
import { CalculationExplanation } from './CalculationExplanation';

interface CalculatorFormProps {
  selectedDrug: Drug | null;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({ selectedDrug }) => {
  // Estados dos inputs
  const [weight, setWeight] = useState<number>(10);
  const [doseValue, setDoseValue] = useState<number>(0.2);
  const [doseUnit, setDoseUnit] = useState<CriDoseUnit | BolusDoseUnit>(CriDoseUnit.mcg_kg_min);
  const [administrationType, setAdministrationType] = useState<'cri' | 'bolus'>('cri');
  const [infusionRate, setInfusionRate] = useState<number>(10);
  const [drugConcentration, setDrugConcentration] = useState<number>(12.5);
  const [finalVolume, setFinalVolume] = useState<number>(50);

  // Estados dos resultados e alertas
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);

  // Valores padrão baseados no fármaco selecionado
  useEffect(() => {
    if (selectedDrug) {
      if (selectedDrug.defaultConcentration) {
        setDrugConcentration(selectedDrug.defaultConcentration);
      }
      if (selectedDrug.preferredDoseUnit) {
        setDoseUnit(selectedDrug.preferredDoseUnit);
      }
      
      // Verificar se bolus é contraindicado
      if (selectedDrug.info?.doses.bolus?.contraindicated && administrationType === 'bolus') {
        setAdministrationType('cri');
      }
    }
  }, [selectedDrug]);

  // Validações em tempo real
  useEffect(() => {
    const newAlerts: AlertMessage[] = [];
    
    // Validação do peso
    newAlerts.push(...validateWeight(weight));
    
    // Validação da taxa de infusão (apenas para CRI)
    if (administrationType === 'cri') {
      newAlerts.push(...validateInfusionRate(infusionRate));
    }
    
    // Validação da dose
    if (selectedDrug && doseValue > 0) {
      const dose: DoseInfo = { value: doseValue, unit: doseUnit, isRecommended: false };
      
      // Verificar faixas de dose
      const ranges = administrationType === 'cri' 
        ? selectedDrug.info?.doses.cri.ranges || []
        : selectedDrug.info?.doses.bolus?.ranges || [];
      
      if (ranges.length > 0) {
        newAlerts.push(...validateDose(dose, ranges));
      }
      
      // Verificar se bolus é contraindicado
      if (administrationType === 'bolus' && selectedDrug.info?.doses.bolus?.contraindicated) {
        newAlerts.push({
          type: 'error',
          message: 'Bolus contraindicado para este fármaco',
          icon: '🚫'
        });
      }
    }
    
    setAlerts(newAlerts);
  }, [weight, doseValue, doseUnit, administrationType, infusionRate, selectedDrug]);

  // Cálculo automático em tempo real
  useEffect(() => {
    if (selectedDrug && doseValue > 0 && weight > 0 && drugConcentration > 0 && finalVolume > 0) {
      const dose: DoseInfo = { value: doseValue, unit: doseUnit, isRecommended: false };
      
      try {
        let calculationResult: CalculationResult;
        
        if (administrationType === 'cri' && infusionRate > 0) {
          calculationResult = calculateCRI(dose, weight, infusionRate, drugConcentration, finalVolume);
        } else if (administrationType === 'bolus') {
          calculationResult = calculateBolus(dose, weight, drugConcentration);
        } else {
          return;
        }
        
        setResult(calculationResult);
      } catch (error) {
        console.error('Erro no cálculo:', error);
      }
    }
  }, [doseValue, doseUnit, weight, administrationType, infusionRate, drugConcentration, finalVolume, selectedDrug]);

  // Unidades disponíveis baseadas no tipo de administração
  const availableUnits = useMemo(() => {
    if (administrationType === 'cri') {
      return Object.values(CriDoseUnit);
    } else {
      return Object.values(BolusDoseUnit);
    }
  }, [administrationType]);

  // Conversão automática de unidade
  const handleUnitChange = (newUnit: CriDoseUnit | BolusDoseUnit) => {
    if (doseValue > 0) {
      // Converter valor atual para a nova unidade
      const currentDose: DoseInfo = { value: doseValue, unit: doseUnit, isRecommended: false };
      const valueInMgPerKgPerHour = convertDoseToMgPerKgPerHour(currentDose);
      const newValue = convertFromMgPerKgPerHour(valueInMgPerKgPerHour, newUnit);
      
      setDoseValue(Math.round(newValue * 1000) / 1000); // 3 casas decimais
    }
    setDoseUnit(newUnit);
  };

  const getDoseRangeText = () => {
    if (!selectedDrug) return '';
    
    const ranges = administrationType === 'cri' 
      ? selectedDrug.info?.doses.cri.ranges || []
      : selectedDrug.info?.doses.bolus?.ranges || [];
    
    const recommendedRange = ranges.find(r => r.isRecommended);
    if (recommendedRange) {
      return `Faixa recomendada: ${recommendedRange.min} - ${recommendedRange.max} ${recommendedRange.unit}`;
    }
    return '';
  };

  const getPreferredUnitInfo = () => {
    if (!selectedDrug) return '';
    
    const preferredUnit = administrationType === 'cri' 
      ? selectedDrug.info?.doses.cri.preferredUnit
      : selectedDrug.info?.doses.bolus?.preferredUnit;
    
    const preferredReason = administrationType === 'cri' 
      ? selectedDrug.info?.doses.cri.preferredReason
      : selectedDrug.info?.doses.bolus?.preferredReason;
    
    if (preferredUnit && preferredReason) {
      return `💡 Unidade de rotina mais usada: ${preferredUnit} (${preferredReason})`;
    }
    return '';
  };

  if (!selectedDrug) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" color="text.secondary">
            Selecione um fármaco para começar os cálculos
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <AlertList alerts={alerts} />
      
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            📋 Dados do Paciente e Prescrição
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Peso do paciente */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Peso do paciente"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  inputProps={{ min: 0.1, max: 100, step: 0.1 }}
                  helperText="kg"
                  variant="outlined"
                />
              </Box>

              {/* Dose prescrita */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                  <TextField
                    label="Dose prescrita"
                    type="number"
                    value={doseValue}
                    onChange={(e) => setDoseValue(Number(e.target.value))}
                    inputProps={{ min: 0, step: 0.001 }}
                    variant="outlined"
                    sx={{ flex: 1 }}
                  />
                  <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Unidade</InputLabel>
                    <Select
                      value={doseUnit}
                      label="Unidade"
                      onChange={(e) => handleUnitChange(e.target.value as CriDoseUnit | BolusDoseUnit)}
                    >
                      {availableUnits.map((unit) => (
                        <MenuItem key={unit} value={unit}>
                          {unit}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                {getDoseRangeText() && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {getDoseRangeText()}
                  </Typography>
                )}
                {getPreferredUnitInfo() && (
                  <Typography variant="caption" color="primary" sx={{ mt: 0.5, display: 'block', fontWeight: 'bold' }}>
                    {getPreferredUnitInfo()}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Tipo de administração */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Tipo de administração:
              </Typography>
              <ToggleButtonGroup
                value={administrationType}
                exclusive
                onChange={(_, value) => value && setAdministrationType(value)}
                aria-label="tipo de administração"
              >
                <ToggleButton value="cri" aria-label="cri">
                  CRI (Infusão Contínua)
                </ToggleButton>
                <ToggleButton 
                  value="bolus" 
                  aria-label="bolus"
                  disabled={selectedDrug.info?.doses.bolus?.contraindicated}
                >
                  Bolus
                </ToggleButton>
              </ToggleButtonGroup>
              {selectedDrug.info?.doses.bolus?.contraindicated && (
                <Chip 
                  label="Bolus contraindicado" 
                  color="error" 
                  size="small"
                />
              )}
            </Box>

            {/* Taxa de infusão e Concentração */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              {/* Taxa de infusão (apenas para CRI) */}
              {administrationType === 'cri' && (
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Taxa de infusão da bomba"
                    type="number"
                    value={infusionRate}
                    onChange={(e) => setInfusionRate(Number(e.target.value))}
                    inputProps={{ min: 0.1, max: 200, step: 0.1 }}
                    helperText="mL/h"
                    variant="outlined"
                  />
                </Box>
              )}

              {/* Concentração do frasco */}
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Concentração do frasco"
                  type="number"
                  value={drugConcentration}
                  onChange={(e) => setDrugConcentration(Number(e.target.value))}
                  inputProps={{ min: 0.1, step: 0.1 }}
                  helperText={selectedDrug.defaultConcentrationUnit || 'mg/mL'}
                  variant="outlined"
                />
              </Box>
            </Box>

            {/* Volume final */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Volume final de preparo"
                  type="number"
                  value={finalVolume}
                  onChange={(e) => setFinalVolume(Number(e.target.value))}
                  inputProps={{ min: 1, max: 1000, step: 1 }}
                  helperText="mL"
                  variant="outlined"
                  select
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value={10}>10 mL</option>
                  <option value={20}>20 mL</option>
                  <option value={50}>50 mL</option>
                  <option value={60}>60 mL</option>
                  <option value={250}>250 mL</option>
                  <option value={500}>500 mL</option>
                  <option value="custom">Outro (digite abaixo)</option>
                </TextField>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Resultado */}
      {result && (
        <Card sx={{ mb: 2, border: '2px solid #4caf50' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#2e7d32' }}>
              ✅ RESULTADO DO CÁLCULO
            </Typography>
            
            <Paper sx={{ p: 2, bgcolor: '#e8f5e8', mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                Aspirar {result.volumeDrug} mL do fármaco
              </Typography>
              
              {administrationType === 'cri' && (
                <>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Concentração final da solução:</strong> {result.finalConcentration.toFixed(4)} mg/mL
                  </Typography>
                  <Typography variant="body1">
                    <strong>Dose total por hora:</strong> {result.totalDosePerHour.toFixed(3)} mg/h
                  </Typography>
                </>
              )}
            </Paper>

            <CalculationExplanation
              result={result}
              dose={{ value: doseValue, unit: doseUnit, isRecommended: false }}
              weight={weight}
              infusionRate={infusionRate}
              drugConcentration={drugConcentration}
              finalVolume={finalVolume}
              isBolus={administrationType === 'bolus'}
            />
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
