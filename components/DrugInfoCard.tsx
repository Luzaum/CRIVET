import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  LocalHospital as IndicationsIcon,
  Medication as DosesIcon,
  Water as DilutionIcon,
  Schedule as UsageIcon,
  Warning as CautionIcon,
  Inventory as PresentationIcon,
  MenuBook as ReferencesIcon
} from '@mui/icons-material';
import { Drug } from '../types/drugs';
import { formatDisplayNumber } from '../utils/format';

interface DrugInfoCardProps {
  drug: Drug;
  compact?: boolean;
}

export const DrugInfoCard: React.FC<DrugInfoCardProps> = ({ drug, compact = false }) => {
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'vasopressor': '🫀',
      'sedative': '😴',
      'analgesic': '💊',
      'anticonvulsant': '🧠',
      'antibiotic': '🦠',
      'antiarrhythmic': '💓',
      'diuretic': '💧',
      'bronchodilator': '🫁',
      'anesthetic': '🩺'
    };
    return icons[category.toLowerCase()] || '💉';
  };

  const getSpeciesIcon = (species: string) => {
    return species === 'canine' ? '🐕' : '🐱';
  };

  const getWarningColor = (level: string) => {
    switch (level) {
      case 'danger': return 'error';
      case 'caution': return 'warning';
      case 'info': return 'info';
      default: return 'info';
    }
  };

  if (compact) {
    return (
      <Card sx={{ border: '2px solid #1976d2', borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" sx={{ mr: 1 }}>
              {getCategoryIcon(drug.classes[0] || '')}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', flex: 1 }}>
              {drug.name}
            </Typography>
            <Chip 
              label={drug.classes[0] || 'Medicamento'}
              color="primary"
              variant="filled"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip 
              label={`Concentração: ${drug.presentation.concMgMl} mg/mL`}
              variant="outlined"
            />
            <Chip 
              label={`Unidade preferida: ${drug.cri.preferredUnit}`}
              variant="outlined"
            />
            {drug.presentation.lightSensitive && (
              <Chip 
                label="Proteger da luz"
                color="warning"
                variant="filled"
              />
            )}
          </Box>

          {drug.cautions && drug.cautions.length > 0 && (
            <Alert severity={getWarningColor(drug.cautions[0].level)} sx={{ mt: 2 }}>
              <AlertTitle>Aviso</AlertTitle>
              {drug.cautions[0].text}
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ maxWidth: 800, mx: 'auto' }}>
      <CardContent>
        {/* Cabeçalho */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ mr: 2 }}>
            {getCategoryIcon(drug.classes[0] || '')}
          </Typography>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {drug.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {drug.classes.map((category, index) => (
                <Chip 
                  key={index}
                  label={category}
                  color="primary"
                  variant="outlined"
                />
              ))}
              {drug.species.map((species, index) => (
                <Chip 
                  key={index}
                  label={`${getSpeciesIcon(species)} ${species}`}
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Informações básicas */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <PresentationIcon sx={{ mr: 1 }} />
            📦 Apresentação
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              label={`${drug.presentation.concMgMl} mg/mL`}
              color="primary"
              variant="filled"
            />
            {drug.presentation.lightSensitive && (
              <Chip 
                label={`Proteger da luz (${drug.presentation.lightSensitive})`}
                color="warning"
                variant="filled"
              />
            )}
            {drug.presentation.stability && (
              <Chip 
                label={`Estabilidade: ${drug.presentation.stability}`}
                variant="outlined"
              />
            )}
          </Box>
        </Box>

        {/* Doses */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <DosesIcon sx={{ mr: 1 }} />
              💉 Doses
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Unidade mais usada: {drug.cri.preferredUnit}
              </Typography>
            </Box>
            
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Faixas de dose CRI:
            </Typography>
            <List dense>
              {drug.cri.ranges.map((range, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${range.min} - ${range.max} ${range.unit}`}
                    secondary={range.typical ? `(${range.typical})` : undefined}
                  />
                  {range.extrapolated && (
                    <Chip label="Extrapolado" size="small" color="warning" />
                  )}
                </ListItem>
              ))}
            </List>

            {drug.bolus && (
              <>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, mt: 2 }}>
                  Bolus: {drug.bolus.allowed ? 'Permitido' : 'Contraindicado'}
                </Typography>
                {drug.bolus.ranges && drug.bolus.ranges.length > 0 && (
                  <List dense>
                    {drug.bolus.ranges.map((range, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={`${range.min} - ${range.max} ${range.unit}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </>
            )}

            {drug.cri.titrationNotes && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <AlertTitle>Titulação</AlertTitle>
                {drug.cri.titrationNotes}
              </Alert>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Diluição e Compatibilidade */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <DilutionIcon sx={{ mr: 1 }} />
              💧 Diluição e Compatibilidade
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Veículo preferido: {drug.cri.compatibility.preferred}
              </Typography>
              {drug.cri.compatibility.compatible && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Alternativos: {drug.cri.compatibility.compatible.join(', ')}
                </Typography>
              )}
              {drug.cri.compatibility.avoid && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Evitar: {drug.cri.compatibility.avoid.join(', ')}
                </Alert>
              )}
            </Box>

            {drug.cri.commonDilutions && drug.cri.commonDilutions.length > 0 && (
              <>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Diluições comuns:
                </Typography>
                <List dense>
                  {drug.cri.commonDilutions.map((dilution, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`${dilution.addMg} mg em ${dilution.volumeMl} mL ${dilution.vehicle} → ${formatDisplayNumber(dilution.finalMcgMl, 'concentrations')} mcg/mL`}
                        secondary={dilution.notes}
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Cautelas */}
        {drug.cautions && drug.cautions.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <CautionIcon sx={{ mr: 1 }} />
                🚨 Cautelas
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {drug.cautions.map((caution, index) => (
                <Alert 
                  key={index}
                  severity={getWarningColor(caution.level)} 
                  sx={{ mb: 1 }}
                >
                  <AlertTitle>{caution.level.toUpperCase()}</AlertTitle>
                  {caution.text}
                  {caution.context && (
                    <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                      Contexto: {caution.context}
                    </Typography>
                  )}
                </Alert>
              ))}
            </AccordionDetails>
          </Accordion>
        )}

        {/* Monitoramento */}
        {drug.cri.monitoring && drug.cri.monitoring.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <UsageIcon sx={{ mr: 1 }} />
                ⏳ Monitoramento
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                {drug.cri.monitoring.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Typography>📊</Typography>
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Referências */}
        {drug.references && drug.references.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <ReferencesIcon sx={{ mr: 1 }} />
                📚 Referências
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                {drug.references.map((ref, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={ref.source}
                      secondary={ref.pages ? `Páginas: ${ref.pages}` : undefined}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};
