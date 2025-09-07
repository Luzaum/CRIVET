import React from 'react'
import type { Drug } from '../../types'

export function SourcesFootnote({ drug }: { drug: Drug | null }) {
  if (!drug?.references?.length) return null
  
  return (
    <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
      <div className="font-medium mb-1">Fontes:</div>
      <ul className="list-disc pl-4 space-y-0.5">
        {drug.references.map((r, i) => (
          <li key={i}>
            <span className="font-medium">{r.source}</span>
            {r.pages ? <> — <span>Páginas: {r.pages}</span></> : null}
          </li>
        ))}
      </ul>
    </div>
  )
}
