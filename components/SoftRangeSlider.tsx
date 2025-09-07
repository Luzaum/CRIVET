import React, { useState, useEffect } from 'react';
import { Slider, Box, Typography, Chip } from '@mui/material';
import { formatDisplayNumber } from '../utils/format';

interface SoftRangeSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label?: string;
  unit?: string;
  showValue?: boolean;
  showRange?: boolean;
  rangeMin?: number;
  rangeMax?: number;
  rangeLabel?: string;
  disabled?: boolean;
  marks?: Array<{ value: number; label: string }>;
  color?: 'primary' | 'secondary';
  size?: 'small' | 'medium';
  orientation?: 'horizontal' | 'vertical';
  showWarning?: boolean;
  warningMessage?: string;
}

export const SoftRangeSlider: React.FC<SoftRangeSliderProps> = ({
  value,
  onChange,
  min,
  max,
  step = 0.1,
  label,
  unit,
  showValue = true,
  showRange = false,
  rangeMin,
  rangeMax,
  rangeLabel,
  disabled = false,
  marks,
  color = 'primary',
  size = 'medium',
  orientation = 'horizontal',
  showWarning = false,
  warningMessage
}) => {
  const [sliderValue, setSliderValue] = useState<number>(value);
  const [isOutsideRange, setIsOutsideRange] = useState(false);

  // Sincroniza valor externo com slider
  useEffect(() => {
    setSliderValue(value);
  }, [value]);

  // Verifica se valor está fora da faixa recomendada
  useEffect(() => {
    if (showRange && rangeMin !== undefined && rangeMax !== undefined) {
      setIsOutsideRange(value < rangeMin || value > rangeMax);
    }
  }, [value, showRange, rangeMin, rangeMax]);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    const numValue = Array.isArray(newValue) ? newValue[0] : newValue;
    setSliderValue(numValue);
    onChange(numValue);
  };

  const getSliderMarks = () => {
    if (marks) return marks;
    
    if (showRange && rangeMin !== undefined && rangeMax !== undefined) {
      return [
        { value: min, label: min.toString() },
        { value: rangeMin, label: rangeMin.toString() },
        { value: rangeMax, label: rangeMax.toString() },
        { value: max, label: max.toString() }
      ];
    }
    
    return [
      { value: min, label: min.toString() },
      { value: max, label: max.toString() }
    ];
  };

  const getSliderColor = () => {
    if (isOutsideRange && showRange) {
      return 'warning';
    }
    return color;
  };

  const formatValue = (val: number) => {
    if (unit) {
      return `${formatDisplayNumber(val, 'doses')} ${unit}`;
    }
    return formatDisplayNumber(val, 'doses');
  };

  return (
    <Box sx={{ width: '100%', px: 1 }}>
      {/* Label e valor atual */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        {label && (
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        )}
        
        {showValue && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" fontWeight="bold">
              {formatValue(value)}
            </Typography>
            
            {isOutsideRange && showRange && (
              <Chip
                label="Fora da faixa"
                size="small"
                color="warning"
                variant="outlined"
              />
            )}
          </Box>
        )}
      </Box>

      {/* Slider */}
      <Slider
        value={sliderValue}
        onChange={handleSliderChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        marks={getSliderMarks()}
        color={getSliderColor()}
        size={size}
        orientation={orientation}
        valueLabelDisplay="auto"
        valueLabelFormat={formatValue}
        sx={{
          '& .MuiSlider-track': {
            backgroundColor: isOutsideRange && showRange ? 'warning.main' : undefined,
          },
          '& .MuiSlider-thumb': {
            backgroundColor: isOutsideRange && showRange ? 'warning.main' : undefined,
          },
          '& .MuiSlider-mark': {
            backgroundColor: isOutsideRange && showRange ? 'warning.main' : undefined,
          },
        }}
      />

      {/* Faixa recomendada */}
      {showRange && rangeMin !== undefined && rangeMax !== undefined && (
        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">
            Mín: {formatValue(rangeMin)}
          </Typography>
          <Typography variant="caption" color="primary" fontWeight="bold">
            {rangeLabel || 'Faixa recomendada'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Máx: {formatValue(rangeMax)}
          </Typography>
        </Box>
      )}

      {/* Aviso se fora da faixa */}
      {isOutsideRange && showRange && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="warning.main" sx={{ fontStyle: 'italic' }}>
            ⚠️ {warningMessage || 'Valor fora da faixa recomendada. Use com cautela.'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// Componente especializado para dose com faixa recomendada
export const DoseSlider: React.FC<{
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  unit: string;
  rangeMin?: number;
  rangeMax?: number;
  disabled?: boolean;
}> = ({ value, onChange, min, max, unit, rangeMin, rangeMax, disabled }) => {
  return (
    <SoftRangeSlider
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={0.001}
      label="Dose"
      unit={unit}
      showRange={true}
      rangeMin={rangeMin}
      rangeMax={rangeMax}
      rangeLabel="Faixa recomendada"
      disabled={disabled}
      warningMessage="Dose fora da faixa recomendada. Verifique com o protocolo."
    />
  );
};

// Componente especializado para peso (sem faixa recomendada)
export const WeightSlider: React.FC<{
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}> = ({ value, onChange, min = 0.5, max = 80, disabled }) => {
  return (
    <SoftRangeSlider
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={0.1}
      label="Peso"
      unit="kg"
      showRange={false}
      disabled={disabled}
    />
  );
};

// Componente especializado para taxa de infusão
export const InfusionRateSlider: React.FC<{
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}> = ({ value, onChange, min = 0.1, max = 200, disabled }) => {
  return (
    <SoftRangeSlider
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={0.1}
      label="Taxa de infusão"
      unit="mL/h"
      showRange={false}
      disabled={disabled}
    />
  );
};
