import React from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as CheckIcon,
  LocalHospital as HospitalIcon
} from '@mui/icons-material';
import { Drug, Patient, DoseInfo, AlertMessage } from '../types/drugs';
import { WarningLevel } from '../types/enums';

interface ClinicalSafetyProps {
  drug: Drug;
  patient: Patient;
  dose: DoseInfo;
  showHardStops?: boolean;
  showWarnings?: boolean;
  showMonitoring?: boolean;
}

export const ClinicalSafety: React.FC<ClinicalSafetyProps> = ({
  drug,
  patient,
  dose,
  showHardStops = true,
  showWarnings = true,
  showMonitoring = true
}) => {
  const getWarningIcon = (level: WarningLevel) => {
    switch (level) {
      case 'danger': return <ErrorIcon />;
      case 'caution': return <WarningIcon />;
      case 'info': return <InfoIcon />;
      default: return <InfoIcon />;
    }
  };

  const getWarningSeverity = (level: WarningLevel) => {
    switch (level) {
      case 'danger': return 'error';
      case 'caution': return 'warning';
      case 'info': return 'info';
      default: return 'info';
    }
  };

  // Hard stops - casos críticos que impedem o uso
  const getHardStops = (): AlertMessage[] => {
    const hardStops: AlertMessage[] = [];

    // Norepinefrina bolus
    if (drug.name.toLowerCase().includes('norepinefrina') && dose.unit.includes('bolus')) {
      hardStops.push({
        type: 'error',
        message: 'Norepinefrina NUNCA deve ser administrada em bolus - risco de necrose tecidual',
        icon: '🚫'
      });
    }

    // Insulina U-100 IV direta
    if (drug.name.toLowerCase().includes('insulina') && dose.unit.includes('U/kg')) {
      hardStops.push({
        type: 'error',
        message: 'Insulina U-100 NUNCA deve ser administrada IV direta - risco de hipoglicemia severa',
        icon: '🚫'
      });
    }

    // Fentanil em gatos com dose alta
    if (drug.name.toLowerCase().includes('fentanil') && 
        patient.species === 'feline' && 
        dose.value > 6) {
      hardStops.push({
        type: 'error',
        message: 'Dose de fentanil muito alta para gatos - risco de depressão respiratória',
        icon: '🚫'
      });
    }

    return hardStops;
  };

  // Avisos de segurança
  const getSafetyWarnings = (): AlertMessage[] => {
    const warnings: AlertMessage[] = [];

    // Proteção da luz
    if (drug.presentation.lightSensitive) {
      warnings.push({
        type: 'warning',
        message: `Proteger da luz (${drug.presentation.lightSensitive}) - usar embalagem opaca`,
        icon: '☀️'
      });
    }

    // Estabilidade limitada
    if (drug.presentation.stability === 'limited') {
      warnings.push({
        type: 'warning',
        message: 'Estabilidade limitada - preparar próximo ao uso',
        icon: '⏰'
      });
    }

    // Ajustes por comorbidade
    if (patient.hepaticDisease) {
      warnings.push({
        type: 'warning',
        message: 'Paciente com doença hepática - considerar redução de dose',
        icon: '🫀'
      });
    }

    if (patient.renalDisease) {
      warnings.push({
        type: 'warning',
        message: 'Paciente com doença renal - considerar redução de dose',
        icon: '🫘'
      });
    }

    if (patient.cardiacDisease) {
      warnings.push({
        type: 'warning',
        message: 'Paciente com doença cardíaca - monitorar pressão arterial',
        icon: '💓'
      });
    }

    // Gestação e lactação
    if (patient.pregnant) {
      warnings.push({
        type: 'warning',
        message: 'Paciente gestante - verificar categoria de risco do medicamento',
        icon: '🤱'
      });
    }

    if (patient.lactating) {
      warnings.push({
        type: 'warning',
        message: 'Paciente lactante - considerar passagem para leite',
        icon: '🍼'
      });
    }

    return warnings;
  };

  // Lista de monitoramento
  const getMonitoringList = (): string[] => {
    const monitoring: string[] = [];

    // Monitoramento específico do medicamento
    if (drug.cri.monitoring) {
      monitoring.push(...drug.cri.monitoring);
    }

    // Monitoramento por categoria
    if (drug.classes.includes('vasopressor')) {
      monitoring.push('Pressão arterial contínua');
      monitoring.push('Frequência cardíaca');
      monitoring.push('Perfusão periférica');
    }

    if (drug.classes.includes('sedative') || drug.classes.includes('analgesic')) {
      monitoring.push('Frequência respiratória');
      monitoring.push('Saturação de oxigênio');
      monitoring.push('Nível de sedação');
    }

    if (drug.classes.includes('anticonvulsant')) {
      monitoring.push('Nível de consciência');
      monitoring.push('Atividade convulsiva');
      monitoring.push('Função hepática');
    }

    // Monitoramento por comorbidade
    if (patient.hepaticDisease) {
      monitoring.push('Enzimas hepáticas');
      monitoring.push('Bilirrubina');
    }

    if (patient.renalDisease) {
      monitoring.push('Creatinina');
      monitoring.push('BUN');
      monitoring.push('Débito urinário');
    }

    return [...new Set(monitoring)]; // Remove duplicatas
  };

  const hardStops = getHardStops();
  const safetyWarnings = getSafetyWarnings();
  const monitoringList = getMonitoringList();

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <HospitalIcon sx={{ mr: 1 }} />
        🏥 Segurança Clínica
      </Typography>

      {/* Hard Stops */}
      {showHardStops && hardStops.length > 0 && (
        <Box sx={{ mb: 2 }}>
          {hardStops.map((stop, index) => (
            <Alert key={index} severity="error" sx={{ mb: 1 }}>
              <AlertTitle>🚫 PARADA OBRIGATÓRIA</AlertTitle>
              {stop.message}
            </Alert>
          ))}
        </Box>
      )}

      {/* Avisos de Segurança */}
      {showWarnings && safetyWarnings.length > 0 && (
        <Box sx={{ mb: 2 }}>
          {safetyWarnings.map((warning, index) => (
            <Alert key={index} severity="warning" sx={{ mb: 1 }}>
              <AlertTitle>⚠️ Aviso de Segurança</AlertTitle>
              {warning.message}
            </Alert>
          ))}
        </Box>
      )}

      {/* Cautelas do Medicamento */}
      {drug.cautions && drug.cautions.length > 0 && (
        <Box sx={{ mb: 2 }}>
          {drug.cautions.map((caution, index) => (
            <Alert 
              key={index} 
              severity={getWarningSeverity(caution.level)} 
              sx={{ mb: 1 }}
            >
              <AlertTitle>
                {getWarningIcon(caution.level)}
                {caution.level.toUpperCase()}
              </AlertTitle>
              {caution.text}
              {caution.context && (
                <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                  <strong>Contexto:</strong> {caution.context}
                </Typography>
              )}
            </Alert>
          ))}
        </Box>
      )}

      {/* Monitoramento */}
      {showMonitoring && monitoringList.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="info">
            <AlertTitle>📊 Monitoramento Necessário</AlertTitle>
            <List dense>
              {monitoringList.map((item, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Alert>
        </Box>
      )}

      {/* Disclaimer */}
      <Alert severity="info" sx={{ mt: 2 }}>
        <AlertTitle>📋 Disclaimer</AlertTitle>
        <Typography variant="body2">
          Esta calculadora é uma ferramenta de apoio à decisão clínica. 
          Sempre consulte a literatura atualizada e considere as condições 
          específicas do paciente. Em caso de dúvida, consulte um especialista.
        </Typography>
      </Alert>
    </Box>
  );
};

// Componente para log de auditoria
export const AuditLog: React.FC<{
  drug: Drug;
  patient: Patient;
  dose: DoseInfo;
  result: any;
}> = ({ drug, patient, dose, result }) => {
  const logEntry = {
    timestamp: new Date(),
    drugId: drug.id,
    drugName: drug.name,
    patientWeight: patient.weight,
    patientSpecies: patient.species,
    dose: dose,
    result: result,
    userAgent: navigator.userAgent,
    sessionId: Math.random().toString(36).substr(2, 9)
  };

  // Em produção, isso seria enviado para um serviço de logging
  console.log('Audit Log:', logEntry);

  return (
    <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
      <Typography variant="caption" color="text.secondary">
        📝 Log de auditoria gerado em {logEntry.timestamp.toLocaleString('pt-BR')}
      </Typography>
    </Box>
  );
};
