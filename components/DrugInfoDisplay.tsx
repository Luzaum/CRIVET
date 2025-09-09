import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  LocalHospital as IndicationIcon,
  Medication as DoseIcon,
  WaterDrop as DilutionIcon,
  Schedule as UsageIcon,
  Warning as WarningIcon,
  Inventory as PresentationIcon,
  MenuBook as ReferenceIcon
} from '@mui/icons-material';
import { Drug, DrugInfo } from '../types';

interface DrugInfoDisplayProps {
  drug: Drug;
  info?: DrugInfo;
}

export const DrugInfoDisplay: React.FC<DrugInfoDisplayProps> = ({ drug, info }) => {
  const [expanded, setExpanded] = useState<string | false>('indications');

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  if (!info) {
    return (
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Informações detalhadas não disponíveis para {drug.name}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      {/* Indicações 🐾 */}
      <Accordion expanded={expanded === 'indications'} onChange={handleChange('indications')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <IndicationIcon sx={{ mr: 1, color: '#1976d2' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Indicações 🐾
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            {info.indications.summary.map((indication, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <Typography variant="body2" color="primary">•</Typography>
                </ListItemIcon>
                <ListItemText primary={indication} />
              </ListItem>
            ))}
          </List>
          {info.indications.detailed.length > 0 && (
            <>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Detalhes:
              </Typography>
              <List dense>
                {info.indications.detailed.map((detail, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={detail}
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Doses 💉 */}
      <Accordion expanded={expanded === 'doses'} onChange={handleChange('doses')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <DoseIcon sx={{ mr: 1, color: '#1976d2' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Doses 💉
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Paper sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
              CRI (Infusão Contínua):
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              💡 Unidade de rotina mais usada: {info.doses.cri.preferredUnit} ({info.doses.cri.preferredReason})
            </Typography>
            {info.doses.cri.contraindicated && (
              <Chip 
                label="CRI Contraindicado" 
                color="error" 
                size="small" 
                sx={{ mb: 1 }}
              />
            )}
            <List dense>
              {info.doses.cri.ranges.map((range, index) => (
                <ListItem key={index}>
                  <ListItemText 
                    primary={`${range.min} - ${range.max} ${range.unit}`}
                    secondary={range.isRecommended ? "Faixa recomendada" : "Faixa alternativa"}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          {info.doses.bolus && (
            <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Bolus:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                💡 Unidade de rotina mais usada: {info.doses.bolus.preferredUnit} ({info.doses.bolus.preferredReason})
              </Typography>
              {info.doses.bolus.contraindicated && (
                <Chip 
                  label="Bolus Contraindicado" 
                  color="error" 
                  size="small" 
                  sx={{ mb: 1 }}
                />
              )}
              <List dense>
                {info.doses.bolus.ranges.map((range, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={`${range.min} - ${range.max} ${range.unit}`}
                      secondary={range.isRecommended ? "Faixa recomendada" : "Faixa alternativa"}
                    />
                  </ListItem>
                ))}
              </List>
              {info.doses.bolus.infusionTimeMin && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  ⏳ Tempo de infusão: {info.doses.bolus.infusionTimeMin} minutos
                </Typography>
              )}
            </Paper>
          )}

          {info.doses.notes && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Notas:</strong> {info.doses.notes}
              </Typography>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Diluição/Compatibilidade 💧 */}
      <Accordion expanded={expanded === 'dilution'} onChange={handleChange('dilution')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <DilutionIcon sx={{ mr: 1, color: '#1976d2' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Diluição/Compatibilidade 💧
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            Fluidos recomendados:
          </Typography>
          <Box sx={{ mb: 2 }}>
            {info.dilution.recommendedFluids.map((fluid, index) => (
              <Chip 
                key={index} 
                label={fluid} 
                color="primary" 
                size="small" 
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>

          {info.dilution.examples.length > 0 && (
            <>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Exemplos práticos de preparo:
              </Typography>
              <List dense>
                {info.dilution.examples.map((example, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={example.description}
                      secondary={`${example.concentration} em ${example.volume} mL de ${example.fluid}`}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}

          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, mt: 2 }}>
            Compatibilidade:
          </Typography>
          <List dense>
            {info.dilution.compatibility.compatible.map((drug, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <Typography variant="body2" color="success.main">✓</Typography>
                </ListItemIcon>
                <ListItemText primary={drug} />
              </ListItem>
            ))}
            {info.dilution.compatibility.incompatible.map((drug, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <Typography variant="body2" color="error.main">✗</Typography>
                </ListItemIcon>
                <ListItemText primary={drug} />
              </ListItem>
            ))}
          </List>

          {info.dilution.notes && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Notas:</strong> {info.dilution.notes}
              </Typography>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Modo de uso/tempo de infusão ⏳ */}
      <Accordion expanded={expanded === 'usage'} onChange={handleChange('usage')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <UsageIcon sx={{ mr: 1, color: '#1976d2' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Modo de uso/Tempo de infusão ⏳
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Tempo de infusão:</strong> {info.usage.infusionTime}
          </Typography>

          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            Administração:
          </Typography>
          <List dense>
            {info.usage.administration.map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <Typography variant="body2" color="primary">•</Typography>
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>

          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, mt: 2 }}>
            Monitoramento:
          </Typography>
          <List dense>
            {info.usage.monitoring.map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <Typography variant="body2" color="primary">•</Typography>
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>

          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, mt: 2 }}>
            Boas práticas:
          </Typography>
          <List dense>
            {info.usage.goodPractice.map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <Typography variant="body2" color="primary">•</Typography>
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Cautelas/efeitos adversos 🚨 */}
      <Accordion expanded={expanded === 'warnings'} onChange={handleChange('warnings')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <WarningIcon sx={{ mr: 1, color: '#d32f2f' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Cautelas/Efeitos adversos 🚨
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {info.warnings.contraindications.length > 0 && (
            <>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'error.main' }}>
                Contraindicações:
              </Typography>
              <List dense>
                {info.warnings.contraindications.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Typography variant="body2" color="error.main">🚫</Typography>
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </>
          )}

          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, mt: 2 }}>
            Efeitos adversos:
          </Typography>
          <List dense>
            {info.warnings.adverseEffects.map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <Typography variant="body2" color="warning.main">⚠️</Typography>
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>

          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, mt: 2 }}>
            Cautelas:
          </Typography>
          <List dense>
            {info.warnings.cautions.map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <Typography variant="body2" color="info.main">💡</Typography>
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>

          {info.warnings.specialWarnings.length > 0 && (
            <>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, mt: 2 }}>
                Avisos especiais:
              </Typography>
              <List dense>
                {info.warnings.specialWarnings.map((warning, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Typography variant="body2" color="error.main">🚨</Typography>
                    </ListItemIcon>
                    <ListItemText primary={warning} />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Apresentações 📦 */}
      <Accordion expanded={expanded === 'presentation'} onChange={handleChange('presentation')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <PresentationIcon sx={{ mr: 1, color: '#1976d2' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Apresentações 📦
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            {info.presentation.available.map((presentation, index) => (
              <ListItem key={index}>
                <ListItemText 
                  primary={`${presentation.concentration} ${presentation.unit}`}
                  secondary={`${presentation.volume} mL - ${presentation.description}`}
                />
              </ListItem>
            ))}
          </List>
          {info.presentation.notes && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Notas:</strong> {info.presentation.notes}
              </Typography>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Referências 📚 */}
      <Accordion expanded={expanded === 'references'} onChange={handleChange('references')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <ReferenceIcon sx={{ mr: 1, color: '#1976d2' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Referências 📚
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            Fontes:
          </Typography>
          <List dense>
            {info.references.sources.map((source, index) => (
              <ListItem key={index}>
                <ListItemText primary={source} />
              </ListItem>
            ))}
          </List>

          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, mt: 2 }}>
            Citações:
          </Typography>
          <List dense>
            {info.references.citations.map((citation, index) => (
              <ListItem key={index}>
                <ListItemText 
                  primary={citation}
                  primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

