import React, { useState, useMemo } from 'react';
import {
  Box,
  TextField,
  Autocomplete,
  Typography,
  Chip,
  Card,
  CardContent,
  Paper
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { Drug } from '../types';

interface DrugSelectorProps {
  drugs: Drug[];
  selectedDrug: Drug | null;
  onDrugSelect: (drug: Drug | null) => void;
}

export const DrugSelector: React.FC<DrugSelectorProps> = ({
  drugs,
  selectedDrug,
  onDrugSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar fármacos baseado na busca
  const filteredDrugs = useMemo(() => {
    if (!searchTerm) return drugs;
    
    const term = searchTerm.toLowerCase();
    return drugs.filter(drug => 
      drug.name.toLowerCase().includes(term) ||
      drug.category.toLowerCase().includes(term) ||
      (drug.info?.indications.summary.some(ind => 
        ind.toLowerCase().includes(term)
      ))
    );
  }, [drugs, searchTerm]);

  const getDrugSummary = (drug: Drug) => {
    const categories = {
      'Vasoativo': '🫀',
      'Sedativo/Analgésico': '😴',
      'Anticonvulsivante': '🧠',
      'Antibiótico': '💊',
      'Antiarrítmico': '💓',
      'Diurético': '💧',
      'Broncodilatador': '🫁'
    };
    
    return {
      icon: categories[drug.category] || '💉',
      category: drug.category,
      concentration: drug.defaultConcentration 
        ? `${drug.defaultConcentration} ${drug.defaultConcentrationUnit || 'mg/mL'}`
        : 'Concentração variável',
      preferredUnit: drug.preferredDoseUnit || 'Não especificado'
    };
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        🔍 Selecionar Fármaco
      </Typography>
      
      <Autocomplete
        options={filteredDrugs}
        value={selectedDrug}
        onChange={(_, newValue) => onDrugSelect(newValue)}
        getOptionLabel={(drug) => drug.name}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Buscar fármaco..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              ...params.InputProps,
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
        )}
        renderOption={(props, drug) => {
          const summary = getDrugSummary(drug);
          
          return (
            <Box component="li" {...props}>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" sx={{ mr: 1 }}>
                    {summary.icon}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', flex: 1 }}>
                    {drug.name}
                  </Typography>
                  <Chip 
                    label={summary.category} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Chip 
                    label={`Conc: ${summary.concentration}`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip 
                    label={`Unidade: ${summary.preferredUnit}`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
                
                {drug.info?.indications.summary.length > 0 && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Indicações:</strong> {drug.info.indications.summary.slice(0, 2).join(', ')}
                    {drug.info.indications.summary.length > 2 && '...'}
                  </Typography>
                )}
              </Box>
            </Box>
          );
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        noOptionsText="Nenhum fármaco encontrado"
        sx={{ mb: 2 }}
      />

      {/* Informações do fármaco selecionado */}
      {selectedDrug && (
        <Card sx={{ border: '2px solid #1976d2', borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" sx={{ mr: 1 }}>
                {getDrugSummary(selectedDrug).icon}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', flex: 1 }}>
                {selectedDrug.name}
              </Typography>
              <Chip 
                label={getDrugSummary(selectedDrug).category}
                color="primary"
                variant="filled"
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip 
                label={`Concentração: ${getDrugSummary(selectedDrug).concentration}`}
                variant="outlined"
              />
              <Chip 
                label={`Unidade preferida: ${getDrugSummary(selectedDrug).preferredUnit}`}
                variant="outlined"
              />
            </Box>

            {selectedDrug.info?.indications.summary.length > 0 && (
              <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Principais indicações:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selectedDrug.info.indications.summary.slice(0, 4).map((indication, index) => (
                    <Chip 
                      key={index}
                      label={indication}
                      size="small"
                      variant="outlined"
                      color="secondary"
                    />
                  ))}
                  {selectedDrug.info.indications.summary.length > 4 && (
                    <Chip 
                      label={`+${selectedDrug.info.indications.summary.length - 4} mais`}
                      size="small"
                      variant="outlined"
                      color="secondary"
                    />
                  )}
                </Box>
              </Paper>
            )}

            {/* Avisos especiais */}
            {selectedDrug.info?.warnings.specialWarnings.length > 0 && (
              <Paper sx={{ p: 2, bgcolor: '#ffebee', mt: 2, border: '1px solid #f44336' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: '#d32f2f' }}>
                  ⚠️ Avisos Especiais:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selectedDrug.info.warnings.specialWarnings.map((warning, index) => (
                    <Chip 
                      key={index}
                      label={warning}
                      size="small"
                      color="error"
                      variant="filled"
                    />
                  ))}
                </Box>
              </Paper>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
