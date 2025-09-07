import type { Drug, CriDoseUnit, BolusDoseUnit, FluidType } from '../../types'

// Util: normaliza texto
const norm = (s: string) => s.replace(/\r/g, '').trim()

// Mapas de seções com sinônimos (sem hardcode de fármaco)
const SECTION_ALIASES = {
  name: [/^🧠?\s*([^\:]+)\:/i, /^nome[:\s]/i],
  indications: [/indica[cç][aã]o/i, /indication/i],
  mechanism: [/mecanismo/i, /mechanism/i, /a[cç][aã]o/i],
  criDoses: [/(doses?.*cri)/i, /(infus[aã]o.*cont[ií]nua)/i],
  bolusDoses: [/(doses?.*b[oó]lus)/i, /bolus/i],
  dilution: [/dilu[ií][cç][aã]o/i, /prepara[cç][aã]o/i],
  compatibility: [/compatibilid/i, /fluido/i],
  references: [/fonte/i, /refer[eê]n/i],
  warnings: [/cautela/i, /alerta/i, /contraindica/i],
} as const

// Helpers: extrai bloco por regex
function extractSection(raw: string, regexList: RegExp[]): string | null {
  const text = norm(raw)
  // Heurística: captura do título até o próximo título (linha com ALL CAPS/emoji/2+ palavras com :)
  for (const rx of regexList) {
    const match = text.match(rx)
    if (match) {
      const start = match.index ?? 0
      // acha próximo cabeçalho (linha com emoji, maiúsculas, ou : no fim)
      const rest = text.slice(start)
      const lines = rest.split('\n')
      let collected = []
      collected.push(lines[0])
      for (let i = 1; i < lines.length; i++) {
        const l = lines[i]
        const isHeader =
          /^([A-ZÁ-Ú]{3,}|\p{Emoji_Presentation}).*$/u.test(l) ||
          /:$/u.test(l) && l.length < 80
        if (isHeader) break
        collected.push(l)
      }
      return norm(collected.join('\n'))
    }
  }
  return null
}

// Extrai doses numéricas do texto com captura de unidade (robusto, mas genérico)
const RX_DOSE_RANGE = /(\d+(?:[.,]\d+)?)\s*(?:a|-|–|—|to)\s*(\d+(?:[.,]\d+)?)\s*(mcg\/kg\/min|mcg\/kg\/h|mg\/kg\/h|mg\/kg|mcg\/kg)/gi
const RX_SINGLE_DOSE = /(\d+(?:[.,]\d+)?)\s*(mcg\/kg\/min|mcg\/kg\/h|mg\/kg\/h|mg\/kg|mcg\/kg)/gi
const RX_CONCENTRATION = /(\d+(?:[.,]\d+)?)\s*(mg\/mL|mcg\/mL|μg\/mL)/i

function parseRanges(text: string) {
  const ranges: Array<{unit: string; min:number; max:number}> = []
  const singles: Array<{unit: string; value:number}> = []

  text.replaceAll(RX_DOSE_RANGE, (_, a, b, u) => {
    const min = parseFloat(String(a).replace(',', '.'))
    const max = parseFloat(String(b).replace(',', '.'))
    ranges.push({ unit: u, min, max })
    return ''
  })
  text.replaceAll(RX_SINGLE_DOSE, (_, v, u) => {
    const value = parseFloat(String(v).replace(',', '.'))
    singles.push({ unit: u, value })
    return ''
  })
  return { ranges, singles }
}

export function parseMonograph(raw: string): Drug {
  const text = norm(raw)

  // Nome
  const nameMatch = text.match(/^🧠?\s*([^\:]+)\:/i)
  const name = nameMatch ? norm(nameMatch[1]) : 'Fármaco sem nome'

  // Compatibilidade
  const compTxt = extractSection(text, SECTION_ALIASES.compatibility) ?? ''
  const preferred: FluidType | undefined =
    /ringer.*lact/i.test(compTxt) ? FluidType.RingerLactato
    : /d5|glicose 5/i.test(compTxt) ? FluidType.Dextrose5
    : /sf\s*0[,.]9/i.test(compTxt) ? FluidType.NaCl09
    : undefined

  const compatible: FluidType[] = []
  if (/sf\s*0[,.]9/i.test(compTxt)) compatible.push(FluidType.NaCl09)
  if (/ringer.*lact/i.test(compTxt)) compatible.push(FluidType.RingerLactato)
  if (/d5|glicose 5/i.test(compTxt)) compatible.push(FluidType.Dextrose5)
  if (/d2[,.]?5|glicose 2[,.]?5/i.test(compTxt)) compatible.push(FluidType.Dextrose25)

  const avoid: FluidType[] = /epinefrina|adrenalina/i.test(text) ? [FluidType.Dextrose5] : []

  // Apresentação
  const presTxt = extractSection(text, SECTION_ALIASES.dilution) ?? text
  const concMatch = presTxt.match(RX_CONCENTRATION)
  const presentationConc = concMatch ? parseFloat(concMatch[1].replace(',', '.')) : 20
  const presentationUnit = concMatch ? concMatch[2] as 'mg/mL' | 'mcg/mL' | 'μg/mL' : 'mg/mL'
  const concMgMl = presentationUnit.includes('mg') ? presentationConc : presentationConc / 1000

  // Doses CRI
  const criTxt = extractSection(text, SECTION_ALIASES.criDoses) ?? text
  const criParsed = parseRanges(criTxt)
  const criRanges = criParsed.ranges
    .filter(r => /\/h|\/min/.test(r.unit))
    .map(r => ({
      unit: r.unit as CriDoseUnit,
      min: r.min,
      max: r.max,
    }))
  const preferredUnit: CriDoseUnit =
    /mcg\/kg\/min/i.test(criTxt) ? CriDoseUnit.MCG_KG_MIN
    : /mcg\/kg\/h/i.test(criTxt) ? CriDoseUnit.MCG_KG_H
    : CriDoseUnit.MG_KG_H

  // Bólus
  const bolusTxt = extractSection(text, SECTION_ALIASES.bolusDoses) ?? ''
  const bolusParsed = parseRanges(bolusTxt)
  const bolusRanges = bolusParsed.ranges
    .filter(r => !/\/h|\/min/.test(r.unit))
    .map(r => ({ unit: r.unit as BolusDoseUnit, min: r.min, max: r.max }))

  const allowedBolus = /contraindicado|n[ãa]o.*b[oó]lus/i.test(bolusTxt) ? false : bolusRanges.length > 0

  // Referências
  const refTxt = extractSection(text, SECTION_ALIASES.references) ?? ''
  const refList = refTxt
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => ({ source: s }))

  const drug: Drug = {
    id: name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\W+/g, '-'),
    name,
    classes: ['anesthetics'], // heurística básica (ajuste por categoria via prompt no futuro)
    concentrations: [{
      label: `${presentationConc} ${presentationUnit}`,
      value: concMgMl,
      unit: presentationUnit
    }],
    criDoses: criRanges.map(range => ({
      species: 'both',
      cri: {
        unit: range.unit,
        min: range.min,
        max: range.max
      }
    })),
    bolusDoses: allowedBolus ? bolusRanges.map(range => ({
      species: 'both',
      unit: range.unit,
      min: range.min,
      max: range.max
    })) : undefined,
    compatibility: {
      preferred: preferred ?? FluidType.RingerLactato,
      compatible,
      avoid,
      notes: compTxt || undefined,
    },
    specialWarnings: /nunca.*epinefrina|evitar.*epinefrina/i.test(text)
      ? ['NÃO usar formulações com epinefrina IV.']
      : undefined,
    references: refList.length ? refList : undefined,
  }

  return drug
}
