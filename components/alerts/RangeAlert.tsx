import React from 'react'

type Props = { level: 'within' | 'below' | 'above' | 'unknown'; text: string }

export function RangeAlert({ level, text }: Props) {
  const base = 'flex items-center gap-2 rounded-md px-3 py-2 text-sm'
  
  if (level === 'within') {
    return (
      <div className={`${base} bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300`}>
        <span className="text-green-600">✓</span> {text}
      </div>
    )
  }
  if (level === 'below') {
    return (
      <div className={`${base} bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300`}>
        <span className="text-amber-600">↓</span> {text}
      </div>
    )
  }
  if (level === 'above') {
    return (
      <div className={`${base} bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300`}>
        <span className="text-red-600">↑</span> {text}
      </div>
    )
  }
  return (
    <div className={`${base} bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300`}>
      <span className="text-slate-500">?</span> {text}
    </div>
  )
}
