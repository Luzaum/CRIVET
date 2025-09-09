import React from 'react'

interface ResultsCardProps {
  isBolus?: boolean
  results?: any
}

export function ResultsCard({ isBolus = false, results }: ResultsCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {isBolus ? 'Resultados do Bólus' : 'Resultados da CRI'}
        </h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">
            📋 Copiar
          </button>
          <button className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">
            📄 PDF
          </button>
          <button className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">
            💾 Salvar
          </button>
        </div>
      </div>
      <div className="pt-2">
        {isBolus ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Dose total</p>
              <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                {results?.totalDose?.toFixed?.(3)} {/**/}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Volume do fármaco</p>
              <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                {results?.totalVolume?.toFixed?.(3)} mL
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Volume do fármaco</p>
              <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                {results?.drugVolume?.toFixed?.(3)} mL
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Volume do diluente</p>
              <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                {results?.diluentVolume?.toFixed?.(3)} mL
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Concentração final</p>
              <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                {results?.finalConcMgMl?.toFixed?.(3)} mg/mL
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Taxa de infusão</p>
              <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                {results?.rateMlH?.toFixed?.(2)} mL/h
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
