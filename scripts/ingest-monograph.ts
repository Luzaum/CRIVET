#!/usr/bin/env ts-node
import * as fs from 'fs'
import * as path from 'path'
import { parseMonograph } from '../src/importers/monographParser'

const inputPath = process.argv[2]
if (!inputPath) {
  console.error('Uso: ts-node scripts/ingest-monograph.ts <arquivo.txt|md>')
  process.exit(1)
}
const raw = fs.readFileSync(inputPath, 'utf-8')
const obj = parseMonograph(raw)

const outDir = path.join(process.cwd(), 'data', 'drugs')
fs.mkdirSync(outDir, { recursive: true })
const outPath = path.join(outDir, `${obj.id}.json`)
fs.writeFileSync(outPath, JSON.stringify(obj, null, 2), 'utf-8')

console.log(`Gerado: ${outPath}`)
