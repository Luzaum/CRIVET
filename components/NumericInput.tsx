import React, { useState, useEffect, useRef } from 'react';
import { TextField, Box, Typography } from '@mui/material';
import { parseNumberPTBR, formatInputNumber, isValidNumberInput } from '../utils/format';

interface NumericInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  showRange?: boolean;
  rangeMin?: number;
  rangeMax?: number;
  rangeUnit?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium';
  placeholder?: string;
}

export const NumericInput: React.FC<NumericInputProps> = ({
  label,
  value,
  onChange,
  unit,
  min,
  max,
  step = 0.1,
  showRange = false,
  rangeMin,
  rangeMax,
  rangeUnit,
  helperText,
  error = false,
  disabled = false,
  fullWidth = true,
  variant = 'outlined',
  size = 'medium',
  placeholder
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sincroniza valor externo com input interno
  useEffect(() => {
    if (!isFocused) {
      setInputValue(formatInputNumber(value));
    }
  }, [value, isFocused]);

  // Validação em tempo real
  useEffect(() => {
    if (inputValue && !isValidNumberInput(inputValue)) {
      setHasError(true);
    } else {
      setHasError(false);
    }
  }, [inputValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);

    // Permite construção gradual (ex: "0,")
    if (isValidNumberInput(newValue)) {
      const parsedValue = parseNumberPTBR(newValue);
      
      // Valida limites apenas se o valor está completo
      if (newValue && !newValue.endsWith(',')) {
        if (min !== undefined && parsedValue < min) {
          setHasError(true);
        } else if (max !== undefined && parsedValue > max) {
          setHasError(true);
        } else {
          setHasError(false);
          onChange(parsedValue);
        }
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Seleciona todo o texto ao focar
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.select();
      }
    }, 0);
  };

  const handleBlur = () => {
    setIsFocused(false);
    
    // Ao sair do foco, garante que o valor seja válido
    const parsedValue = parseNumberPTBR(inputValue);
    
    if (isNaN(parsedValue) || parsedValue < 0) {
      // Restaura valor anterior se inválido
      setInputValue(formatInputNumber(value));
      setHasError(false);
    } else {
      // Aplica limites se necessário
      let finalValue = parsedValue;
      if (min !== undefined && finalValue < min) {
        finalValue = min;
      }
      if (max !== undefined && finalValue > max) {
        finalValue = max;
      }
      
      setInputValue(formatInputNumber(finalValue));
      onChange(finalValue);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // ESC restaura valor anterior
    if (event.key === 'Escape') {
      setInputValue(formatInputNumber(value));
      setHasError(false);
      inputRef.current?.blur();
    }
    
    // Enter confirma valor
    if (event.key === 'Enter') {
      inputRef.current?.blur();
    }
  };

  const getHelperText = () => {
    if (error || hasError) {
      return helperText || 'Valor inválido';
    }
    
    if (showRange && rangeMin !== undefined && rangeMax !== undefined) {
      return `Faixa recomendada: ${rangeMin} - ${rangeMax} ${rangeUnit || ''}`;
    }
    
    return helperText || '';
  };

  return (
    <Box sx={{ position: 'relative', width: fullWidth ? '100%' : 'auto' }}>
      <TextField
        ref={inputRef}
        label={label}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        error={error || hasError}
        helperText={getHelperText()}
        disabled={disabled}
        fullWidth={fullWidth}
        variant={variant}
        size={size}
        placeholder={placeholder}
        inputProps={{
          inputMode: 'decimal',
          step: step,
          min: min,
          max: max,
          style: { 
            paddingRight: unit ? '60px' : '14px',
            textAlign: 'right'
          }
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
                borderWidth: 2,
              },
            },
          },
        }}
      />
      
      {/* Unidade fixa à direita */}
      {unit && (
        <Box
          sx={{
            position: 'absolute',
            right: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color: 'text.secondary',
            fontSize: '0.875rem',
            fontWeight: 500,
            zIndex: 1,
          }}
        >
          {unit}
        </Box>
      )}
    </Box>
  );
};

// Componente especializado para peso (sem faixa recomendada)
export const WeightInput: React.FC<Omit<NumericInputProps, 'showRange' | 'rangeMin' | 'rangeMax' | 'rangeUnit'>> = (props) => {
  return (
    <NumericInput
      {...props}
      showRange={false}
      unit="kg"
      min={0.1}
      max={100}
      step={0.1}
      helperText="Peso do paciente"
    />
  );
};

// Componente especializado para dose
export const DoseInput: React.FC<Omit<NumericInputProps, 'unit'>> = (props) => {
  return (
    <NumericInput
      {...props}
      min={0}
      step={0.001}
      helperText="Dose prescrita"
    />
  );
};

// Componente especializado para taxa de infusão
export const InfusionRateInput: React.FC<Omit<NumericInputProps, 'unit' | 'showRange'>> = (props) => {
  return (
    <NumericInput
      {...props}
      unit="mL/h"
      min={0.1}
      max={200}
      step={0.1}
      helperText="Taxa de infusão da bomba"
    />
  );
};

// Componente especializado para concentração
export const ConcentrationInput: React.FC<Omit<NumericInputProps, 'unit' | 'showRange'>> = (props) => {
  return (
    <NumericInput
      {...props}
      unit="mg/mL"
      min={0.1}
      step={0.1}
      helperText="Concentração do frasco"
    />
  );
};
