import React, { createContext, useContext, ReactNode } from 'react';
import { Drug, Fluid } from '../types/drugs';

export type DrugUnit = 'mcg/kg/min' | 'mcg/kg/h' | 'mg/kg/h';

export interface DrugContextType {
  drugs: Drug[];
  selectedDrug: Drug | null;
  setSelectedDrug: (drug: Drug | null) => void;
}

const DrugContext = createContext<DrugContextType | undefined>(undefined);

export function DrugProvider({ children }: { children: ReactNode }) {
  const [selectedDrug, setSelectedDrug] = React.useState<Drug | null>(null);
  
  // Aqui você pode carregar os dados dos medicamentos
  const drugs: Drug[] = [];

  return (
    <DrugContext.Provider value={{ drugs, selectedDrug, setSelectedDrug }}>
      {children}
    </DrugContext.Provider>
  );
}

export function useDrug() {
  const context = useContext(DrugContext);
  if (context === undefined) {
    throw new Error('useDrug must be used within a DrugProvider');
  }
  return context;
}

// Alias para compatibilidade
export const useDrugContext = useDrug;
