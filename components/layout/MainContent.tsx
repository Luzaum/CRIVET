import React from 'react'
import { PatientCard } from '../patient/PatientCard'
import { DrugSelector } from '../drugs/DrugSelector'
import { DosingTabs } from '../dosing/DosingTabs'
import { DrugMonograph } from '../drugs/DrugMonograph'

export function MainContent() {
  return (
    <div className="container max-w-5xl space-y-6 py-6">
      <PatientCard />
      <DrugSelector />
      <DosingTabs />
      {/* Bulário do fármaco selecionado */}
      <DrugMonograph />
    </div>
  )
}

