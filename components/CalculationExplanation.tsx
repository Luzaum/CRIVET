import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Stepper, 
  Step, 
  StepLabel, 
  StepContent,
  Paper,
  Divider
} from '@mui/material';
import { CalculationResult, DoseInfo } from '../types';

interface CalculationExplanationProps {
  result: CalculationResult;
  dose: DoseInfo;
  weight: number;
  infusionRate?: number;
  drugConcentration: number;
  finalVolume: number;
  isBolus: boolean;
}

export const CalculationExplanation: React.FC<CalculationExplanationProps> = ({
  result,
  dose,
  weight,
  infusionRate,
  drugConcentration,
  finalVolume,
  isBolus
}) => {
  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return '🧮';
      case 2: return '💧';
      case 3: return '💉';
      default: return '📊';
    }
  };

  return (
    <Card sx={{ mt: 3, border: '2px solid #1976d2', borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            🧮 COMO CHEGAMOS A ESTE RESULTADO
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            📋 Dados do Paciente e Prescrição:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Peso: {weight} kg
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Dose prescrita: {dose.value} {dose.unit}
          </Typography>
          {!isBolus && (
            <Typography variant="body2" color="text.secondary">
              • Taxa de infusão: {infusionRate} mL/h
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            • Concentração do frasco: {drugConcentration} mg/mL
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Volume final: {finalVolume} mL
          </Typography>
        </Box>

        <Stepper orientation="vertical" activeStep={result.steps.length - 1}>
          {result.steps.map((step, index) => (
            <Step key={step.step} completed={true}>
              <StepLabel>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ mr: 1 }}>
                    {getStepIcon(step.step)}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Passo {step.step}: {step.description}
                  </Typography>
                </Box>
              </StepLabel>
              <StepContent>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    bgcolor: index % 2 === 0 ? '#e3f2fd' : '#f3e5f5',
                    borderRadius: 1,
                    border: '1px solid #e0e0e0'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                      {step.formula}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: '#1976d2',
                        bgcolor: 'white',
                        px: 2,
                        py: 1,
                        borderRadius: 1,
                        border: '2px solid #1976d2'
                      }}
                    >
                      = {step.result.toFixed(4)} {step.unit}
                    </Typography>
                  </Box>
                  
                  {step.step === 1 && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      💡 Multiplicamos a dose pelo peso para obter a dose total por hora
                    </Typography>
                  )}
                  
                  {step.step === 2 && !isBolus && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      💡 Dividimos a dose/hora pela taxa de infusão para saber a concentração necessária
                    </Typography>
                  )}
                  
                  {step.step === 3 && !isBolus && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      💡 Multiplicamos a concentração pelo volume final e dividimos pela concentração do frasco
                    </Typography>
                  )}
                  
                  {step.step === 2 && isBolus && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      💡 Dividimos a dose total pela concentração do frasco para saber quanto aspirar
                    </Typography>
                  )}
                </Paper>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 3, p: 2, bgcolor: '#e8f5e8', borderRadius: 1, border: '2px solid #4caf50' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32', mb: 1 }}>
            ✅ RESULTADO FINAL:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Aspirar <span style={{ color: '#1976d2', fontSize: '1.2em' }}>
              {result.volumeDrug} mL
            </span> do fármaco
          </Typography>
          {!isBolus && (
            <>
              <Typography variant="body2" color="text.secondary">
                Concentração final da solução: {result.finalConcentration.toFixed(4)} mg/mL
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dose total por hora: {result.totalDosePerHour.toFixed(3)} mg/h
              </Typography>
            </>
          )}
        </Box>

        <Box sx={{ mt: 2, p: 2, bgcolor: '#fff3e0', borderRadius: 1, border: '1px solid #ff9800' }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            💡 <strong>Dica:</strong> Sempre verifique os cálculos e confirme a dose prescrita antes da administração.
            {isBolus ? ' Para bolus, administre lentamente conforme orientado.' : ' Para CRI, configure a bomba na taxa prescrita.'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

