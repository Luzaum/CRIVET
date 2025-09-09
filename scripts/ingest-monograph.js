const fs = require('fs');
const path = require('path');

// Função simplificada para parsear monografias
function parseMonograph(raw) {
  const text = raw.replace(/\r/g, '').trim();
  
  // Nome
  const nameMatch = text.match(/^🧠?\s*([^\:]+)\:/i);
  const name = nameMatch ? nameMatch[1].trim() : 'Fármaco sem nome';
  
  // Extrair doses CRI
  const criDoses = [];
  const criMatch = text.match(/DOSES CRI:([\s\S]*?)(?=DOSES BÓLUS|DILUIÇÃO|COMPATIBILIDADE|$)/i);
  if (criMatch) {
    const criText = criMatch[1];
    const doseMatches = criText.matchAll(/(\d+(?:[.,]\d+)?)\s*(?:a|-|–|—|to)\s*(\d+(?:[.,]\d+)?)\s*(mcg\/kg\/min|mcg\/kg\/h|mg\/kg\/h)/gi);
    for (const match of doseMatches) {
      const min = parseFloat(match[1].replace(',', '.'));
      const max = parseFloat(match[2].replace(',', '.'));
      const unit = match[3];
      criDoses.push({
        species: 'both',
        cri: {
          unit: unit,
          min: min,
          max: max
        }
      });
    }
  }
  
  // Extrair doses de bólus
  const bolusDoses = [];
  const bolusMatch = text.match(/DOSES BÓLUS:([\s\S]*?)(?=DILUIÇÃO|COMPATIBILIDADE|$)/i);
  if (bolusMatch) {
    const bolusText = bolusMatch[1];
    const doseMatches = bolusText.matchAll(/(\d+(?:[.,]\d+)?)\s*(?:a|-|–|—|to)\s*(\d+(?:[.,]\d+)?)\s*(mg\/kg|mcg\/kg)/gi);
    for (const match of doseMatches) {
      const min = parseFloat(match[1].replace(',', '.'));
      const max = parseFloat(match[2].replace(',', '.'));
      const unit = match[3];
      bolusDoses.push({
        species: 'both',
        unit: unit,
        min: min,
        max: max
      });
    }
  }
  
  // Extrair concentração
  const concMatch = text.match(/(\d+(?:[.,]\d+)?)\s*(mg\/mL|mcg\/mL|μg\/mL)/i);
  const concValue = concMatch ? parseFloat(concMatch[1].replace(',', '.')) : 20;
  const concUnit = concMatch ? concMatch[2] : 'mg/mL';
  const concMgMl = concUnit.includes('mg') ? concValue : concValue / 1000;
  
  // Compatibilidade
  const compText = text.match(/COMPATIBILIDADE:([\s\S]*?)(?=CUIDADOS|REFERÊNCIAS|$)/i)?.[1] || '';
  const preferred = /ringer.*lact/i.test(compText) ? 'Ringer Lactato' :
                   /sf\s*0[,.]9/i.test(compText) ? 'NaCl 0.9%' :
                   'Ringer Lactato';
  
  const compatible = [];
  if (/sf\s*0[,.]9/i.test(compText)) compatible.push('NaCl 0.9%');
  if (/ringer.*lact/i.test(compText)) compatible.push('Ringer Lactato');
  if (/d5|glicose 5/i.test(compText)) compatible.push('SG 5%');
  
  const avoid = /epinefrina|adrenalina/i.test(text) ? ['SG 5%'] : [];
  
  // Referências
  const refMatch = text.match(/REFERÊNCIAS:([\s\S]*?)$/i);
  const references = refMatch ? refMatch[1].split('\n').map(s => s.trim()).filter(Boolean).map(s => ({ source: s })) : [];
  
  const drug = {
    id: name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\W+/g, '-'),
    name,
    classes: ['anesthetics'],
    concentrations: [{
      label: `${concValue} ${concUnit}`,
      value: concMgMl,
      unit: concUnit
    }],
    criDoses: criDoses,
    bolusDoses: bolusDoses.length > 0 ? bolusDoses : undefined,
    compatibility: {
      preferred: preferred,
      compatible: compatible,
      avoid: avoid,
      notes: compText.trim() || undefined,
    },
    specialWarnings: /nunca.*epinefrina|evitar.*epinefrina/i.test(text)
      ? ['NÃO usar formulações com epinefrina IV.']
      : undefined,
    references: references.length > 0 ? references : undefined,
  };
  
  return drug;
}

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Uso: node scripts/ingest-monograph.js <arquivo.txt|md>');
  process.exit(1);
}

const raw = fs.readFileSync(inputPath, 'utf-8');
const obj = parseMonograph(raw);

const outDir = path.join(process.cwd(), 'data', 'drugs');
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, `${obj.id}.json`);
fs.writeFileSync(outPath, JSON.stringify(obj, null, 2), 'utf-8');

console.log(`Gerado: ${outPath}`);
