import React from 'react'
import { CalcStep } from '../utils/calculations/types'

// Novo tipo simples (compatível com engine do PR2)
export interface UICalcStep {
  label: string
  formula: string
  values: string
  result: string
}

interface CalculationStepsProps {
  steps?: UICalcStep[] | CalcStep[]
  isBolus?: boolean
}

export function CalculationSteps({ steps, isBolus = false }: CalculationStepsProps) {
  const hasSteps = steps && steps.length > 0

  return (
    <div className="mt-4 p-4 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
      <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center">
        <span className="mr-2">🧮</span>
        Como chegamos a este resultado
      </h3>
      
      {hasSteps ? (
        <div className="space-y-4">
          {steps!.map((s, idx) => {
            // Verifica se é o novo formato (CalcStep) ou o antigo (UICalcStep)
            const isNewFormat = 'example' in s;
            return (
              <div className="space-y-1" key={idx}>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{s.label}</p>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-md text-sm border border-slate-200 dark:border-slate-700">
                  <p className="font-mono text-slate-600 dark:text-slate-400">{s.formula}</p>
                  {isNewFormat ? (
                    <p className="mt-1 text-slate-700 dark:text-slate-300">{s.example}</p>
                  ) : (
                    <>
                      <p className="mt-1 text-slate-700 dark:text-slate-300">{s.values}</p>
                      <p className="mt-1 font-medium text-blue-600 dark:text-blue-400">{s.result}</p>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Fallback antigo (caso steps não sejam passados)
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Resultado exibido acima (nenhum passo detalhado foi recebido do motor).
        </div>
      )}
    </div>
  )
}
