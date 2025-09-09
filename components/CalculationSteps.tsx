import React from 'react'
import type { Step } from '../utils/engine'

interface CalculationStepsProps {
  isBolus?: boolean
  steps?: string[]
}

export function CalculationSteps({ isBolus = false, steps = [] }: CalculationStepsProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
      <div className="flex items-center mb-3">
        <span className="mr-2 text-2xl">🧮</span>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Como chegamos a este resultado
        </h3>
      </div>
      <div className="pt-2">
        {steps.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Informe peso, apresentação, unidade e dose para ver o passo a passo.
          </p>
        ) : (
          <ol className="list-decimal ml-5 space-y-2">
            {steps.map((s, i) => (
              <li key={i} className="bg-slate-50 dark:bg-slate-800 p-2 rounded-md text-sm">{s}</li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}