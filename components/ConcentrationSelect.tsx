import React from 'react'

type ConcentrationUnit = 'mg/mL' | 'mcg/mL'

export interface DrugConcentration {
  label: string      // ex: "20 mg/mL"
  value: number      // ex: 20
  unit: ConcentrationUnit
}

export interface DrugLike {
  concentrations?: DrugConcentration[]
}

interface Props {
  drug: DrugLike | null | undefined
  selected: DrugConcentration | null
  onChange: (c: DrugConcentration | null) => void
}

export function ConcentrationSelect({ drug, selected, onChange }: Props) {
  const value = selected ? selected.label : ''

  const options = Array.isArray(drug?.concentrations)
    ? drug!.concentrations!
    : []

  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
        Apresentação
      </label>

      <select
        value={value}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          const next =
            options.find((opt) => opt.label === e.target.value) || null
          onChange(next)
        }}
        className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200"
      >
        <option value="">Selecione a concentração</option>
        {options.map((opt) => (
          <option key={opt.label} value={opt.label}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
