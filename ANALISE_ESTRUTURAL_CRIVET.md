# 📋 ANÁLISE ESTRUTURAL COMPLETA - CRIVET
## Calculadora de Infusão Contínua Veterinária

---

## 📊 **RESUMO EXECUTIVO**

O **CRIVET** é uma aplicação web React/TypeScript desenvolvida para veterinários calcularem doses de infusão contínua (CRI) e bolus para medicamentos veterinários. A aplicação utiliza Material-UI para interface, possui um sistema robusto de validação de doses, compatibilidade de medicamentos e cálculos precisos para diferentes espécies animais.

**Tecnologias Principais:**
- **Frontend**: React 19.1.1 + TypeScript 5.8.2
- **UI Framework**: Material-UI 7.3.1 + Tailwind CSS
- **Build Tool**: Vite 6.3.5
- **Arquitetura**: Single Page Application (SPA)

---

## 1. 🗃️ **MODELOS DE DADOS (BASE DE DADOS)**

### **1.1 Estruturas Principais de Dados**

#### **Patient Interface** (`types.ts`)
```typescript
export interface Patient {
  species: Species;           // Cão ou Gato
  state: PatientState;        // Filhote, Adulto, Idoso
  weight: number;             // Peso em kg
  hepaticDisease: boolean;    // Doença hepática
  renalDisease: boolean;      // Doença renal
  cardiacDisease?: boolean;   // Doença cardíaca
  septicShock?: boolean;      // Choque séptico
  neuroDisease?: boolean;     // Doença neurológica
  pregnant?: boolean;         // Gestante
  lactating?: boolean;        // Lactante
}
```

#### **Drug Interface** (`types.ts`)
```typescript
export interface Drug {
  id: string;                           // Identificador único
  name: string;                         // Nome do medicamento
  category: string;                     // Categoria (ex: "Vasoativo", "Sedativo/Analgésico")
  concentrations: DrugConcentration[];  // Concentrações disponíveis
  criDoses?: CriDose[];                // Doses para infusão contínua
  bolusDoses?: BolusDose[];            // Doses para bolus
  isPowder?: boolean;                   // Se é pó para reconstituição
  preparationGuide?: string;            // Guia de preparo
  isCombo?: boolean;                    // Se é combinação de medicamentos
  comboDetails?: ComboDetails;          // Detalhes da combinação
  specialWarnings?: WarningType[];      // Avisos especiais
  info?: DrugInfo;                      // Informações detalhadas
}
```

#### **CriDose Interface** (`types.ts`)
```typescript
export interface CriDose {
  species: 'dog' | 'cat' | 'both';     // Espécie alvo
  useCase?: string;                     // Caso de uso específico
  cri: {
    min: number;                        // Dose mínima
    max: number;                        // Dose máxima
    default: number;                    // Dose padrão
    unit: CriDoseUnit;                  // Unidade (μg/kg/min, mg/kg/h, etc.)
  };
  notes?: string;                       // Observações
  extrapolated?: boolean;               // Se é extrapolado
  recommendedBagInfusionTime?: number;  // Tempo recomendado de infusão
}
```

#### **DrugInfo Interface** (`types.ts`)
```typescript
export interface DrugInfo {
  indicationSummary: string[];          // Resumo das indicações
  dosesText: {                          // Texto das doses por espécie
    dog: { cri: string; bolus?: string };
    cat: { cri: string; bolus?: string };
    notes?: string;
  };
  mechanism?: string;                   // Mecanismo de ação
  diluents: {                           // Diluentes recomendados
    recommended: FluidType[];
    notes?: string;
  };
  compatibility: {                      // Compatibilidade
    incompatibilities?: string[];
    ySite?: string[];
    notes?: string;
  };
  photoprotection: boolean;             // Se precisa proteção da luz
  adjustments: {                        // Ajustes por comorbidade
    renal?: string;
    hepatic?: string;
    cardiac?: string;
    neuro?: string;
    sepsis?: string;
    pediatric?: string;
    geriatric?: string;
    pregnancy?: string;
  };
  monitoring: string[];                 // Parâmetros de monitoramento
  goodPractice: string[];               // Boas práticas
  contraindications?: string[];         // Contraindicações
  citations: string[];                  // Referências bibliográficas
}
```

### **1.2 Enums e Tipos Auxiliares**

#### **Species Enum**
```typescript
export enum Species {
  Dog = 'Cão',
  Cat = 'Gato',
}
```

#### **CriDoseUnit Enum**
```typescript
export enum CriDoseUnit {
  mcg_kg_min = 'μg/kg/min',
  mcg_kg_h = 'μg/kg/h',
  mg_kg_min = 'mg/kg/min',
  mg_kg_h = 'mg/kg/h',
  mg_kg_day = 'mg/kg/dia',
  U_kg_h = 'U/kg/h',
  mU_kg_min = 'mU/kg/min',
}
```

#### **Vehicle Type**
```typescript
export type Vehicle = 
  | { type: 'syringe'; volume: number }
  | { type: 'bag'; volume: number; fluid: FluidType };
```

---

## 2. 🖥️ **ESTRUTURA DE VIEWS (DESIGN E TELAS)**

### **2.1 Hierarquia de Navegação**

```
App.tsx (Componente Principal)
├── AppBar (Barra de navegação superior)
│   ├── Título "Calculadora de CRI Vet"
│   ├── Botão "Compatibilidade"
│   └── Switch Tema (Claro/Escuro)
├── Container Principal
│   ├── DrugSelector (Seleção de medicamento)
│   ├── CalculatorForm (Formulário de cálculo)
│   ├── Resultado do Cálculo
│   └── Modais
│       ├── DrugInfoModal (Informações do medicamento)
│       ├── CompatibilityGuide (Guia de compatibilidade)
│       └── RateGuideModal (Guia de taxas)
```

### **2.2 Arquivos de View Principais**

#### **1. App.tsx** (1.582 linhas)
- **Função**: Componente principal da aplicação
- **Responsabilidades**: 
  - Gerenciamento de estado global
  - Tema claro/escuro
  - Renderização da interface principal
  - Integração de todos os componentes

#### **2. components/DrugSelector.tsx** (217 linhas)
- **Função**: Seleção e busca de medicamentos
- **Características**:
  - Autocomplete com busca em tempo real
  - Filtros por nome, categoria e indicações
  - Exibição de informações resumidas
  - Avisos especiais para medicamentos

#### **3. components/CalculatorForm.tsx** (402 linhas)
- **Função**: Formulário principal de cálculo
- **Características**:
  - Inputs para peso, dose, taxa de infusão
  - Validação em tempo real
  - Conversão automática de unidades
  - Cálculo automático de resultados

#### **4. components/DrugInfoModal.tsx** (151 linhas)
- **Função**: Modal com informações detalhadas do medicamento
- **Características**:
  - Informações completas do medicamento
  - Ajustes por comorbidade
  - Monitoramento e boas práticas
  - Referências bibliográficas

#### **5. components/CompatibilityGuide.tsx** (319 linhas)
- **Função**: Guia de compatibilidade entre medicamentos
- **Características**:
  - Matriz de compatibilidade Y-site
  - Fórmulas de cálculo
  - Exemplos práticos
  - Checklists de segurança

### **2.3 Exemplo de Design - DrugSelector Component**

```typescript
export const DrugSelector: React.FC<DrugSelectorProps> = ({
  drugs,
  selectedDrug,
  onDrugSelect
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        🔍 Selecionar Fármaco
      </Typography>
      
      <Autocomplete
        options={filteredDrugs}
        value={selectedDrug}
        onChange={(_, newValue) => onDrugSelect(newValue)}
        getOptionLabel={(drug) => drug.name}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Buscar fármaco..."
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
        )}
        renderOption={(props, drug) => {
          const summary = getDrugSummary(drug);
          return (
            <Box component="li" {...props}>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" sx={{ mr: 1 }}>
                    {summary.icon}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', flex: 1 }}>
                    {drug.name}
                  </Typography>
                  <Chip 
                    label={summary.category} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                </Box>
              </Box>
            </Box>
          );
        }}
      />
    </Box>
  );
};
```

---

## 3. ⚙️ **LÓGICA DE NEGÓCIO E FUNCIONALIDADES**

### **3.1 Arquivo Principal de Cálculos: `utils/calculations.ts`**

#### **Função Principal de Cálculo CRI**
```typescript
export function calculateCRI(
  dose: DoseInfo,
  weight: number,
  infusionRate: number, // mL/h
  drugConcentration: number, // mg/mL
  finalVolume: number // mL
): CalculationResult {
  // Etapa 1: Dose/hora (dose × peso)
  const dosePerHour = convertDoseToMgPerKgPerHour(dose) * weight;
  
  // Etapa 2: Concentração necessária (mg/h ÷ taxa de infusão)
  const requiredConcentration = dosePerHour / infusionRate;
  
  // Etapa 3: Volume do fármaco (concentração necessária × volume final ÷ concentração do frasco)
  const volumeDrug = (requiredConcentration * finalVolume) / drugConcentration;
  
  const steps: CalculationStep[] = [
    {
      step: 1,
      description: "Dose/hora (dose × peso)",
      formula: `${dose.value} ${dose.unit} × ${weight} kg`,
      result: dosePerHour,
      unit: "mg/h"
    },
    {
      step: 2,
      description: "Concentração necessária (mg/h ÷ taxa de infusão)",
      formula: `${dosePerHour.toFixed(3)} mg/h ÷ ${infusionRate} mL/h`,
      result: requiredConcentration,
      unit: "mg/mL"
    },
    {
      step: 3,
      description: "Volume do fármaco (concentração × volume final ÷ concentração do frasco)",
      formula: `${requiredConcentration.toFixed(4)} mg/mL × ${finalVolume} mL ÷ ${drugConcentration} mg/mL`,
      result: volumeDrug,
      unit: "mL"
    }
  ];
  
  return {
    volumeDrug: Math.round(volumeDrug * 1000) / 1000,
    finalConcentration: Math.round(requiredConcentration * 10000) / 10000,
    totalDosePerHour: Math.round(dosePerHour * 1000) / 1000,
    steps
  };
}
```

#### **Sistema de Conversão de Unidades**
```typescript
export function convertDoseToMgPerKgPerHour(dose: DoseInfo): number {
  const { value, unit } = dose;
  
  switch (unit) {
    case CriDoseUnit.mcg_kg_min:
      return value * 60 / 1000; // mcg/kg/min → mg/kg/h
    case CriDoseUnit.mcg_kg_h:
      return value / 1000; // mcg/kg/h → mg/kg/h
    case CriDoseUnit.mg_kg_min:
      return value * 60; // mg/kg/min → mg/kg/h
    case CriDoseUnit.mg_kg_h:
      return value; // mg/kg/h → mg/kg/h
    case CriDoseUnit.mg_kg_day:
      return value / 24; // mg/kg/dia → mg/kg/h
    default:
      return value;
  }
}
```

#### **Sistema de Validação**
```typescript
export function validateDose(
  dose: DoseInfo,
  ranges: { min: number; max: number; unit: CriDoseUnit | BolusDoseUnit }[]
): AlertMessage[] {
  const alerts: AlertMessage[] = [];
  const doseInStandardUnit = convertDoseToMgPerKgPerHour(dose);
  
  for (const range of ranges) {
    const rangeMin = convertDoseToMgPerKgPerHour({ value: range.min, unit: range.unit });
    const rangeMax = convertDoseToMgPerKgPerHour({ value: range.max, unit: range.unit });
    
    if (doseInStandardUnit < rangeMin) {
      alerts.push({
        type: 'warning',
        message: `Dose abaixo da faixa recomendada (${range.min}-${range.max} ${range.unit})`,
        icon: '⚠️'
      });
    } else if (doseInStandardUnit > rangeMax) {
      alerts.push({
        type: 'warning',
        message: `Dose acima da faixa recomendada (${range.min}-${range.max} ${range.unit})`,
        icon: '⚠️'
      });
    }
  }
  
  return alerts;
}
```

### **3.2 Funcionalidades Principais**

1. **Cálculo de CRI (Infusão Contínua)**
   - Sistema de 3 etapas para cálculo preciso
   - Conversão automática de unidades
   - Validação de faixas de dose

2. **Cálculo de Bolus**
   - Cálculo simplificado para administração em bolus
   - Validação de contraindicações

3. **Sistema de Validação**
   - Validação de peso do paciente
   - Validação de faixas de dose
   - Validação de taxa de infusão
   - Alertas em tempo real

4. **Compatibilidade de Medicamentos**
   - Matriz de compatibilidade Y-site
   - Avisos de incompatibilidade
   - Guia de diluentes recomendados

---

## 4. 📊 **GERENCIAMENTO DE ESTADO E DADOS**

### **4.1 Estrutura de Estado**

O aplicativo utiliza **React Hooks** para gerenciamento de estado local:

#### **Estados Principais no App.tsx**
```typescript
// Estado do tema
const [isDark, setIsDark] = useState<boolean>(() => {
  try { return localStorage.getItem('theme') === 'dark'; } catch { return false; }
});

// Estado do paciente
const [patient, setPatient] = useState<Patient>({ 
  species: Species.Dog, 
  state: PatientState.Adult, 
  weight: 0, 
  hepaticDisease: false, 
  renalDisease: false, 
  cardiacDisease: false, 
  septicShock: false, 
  neuroDisease: false, 
  pregnant: false, 
  lactating: false 
});

// Estado do medicamento selecionado
const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);

// Estado dos cálculos
const [criDose, setCriDose] = useState(0);
const [vehicle, setVehicle] = useState<Vehicle>({ type: 'syringe', volume: 60 });
const [infusionDuration, setInfusionDuration] = useState(12);
```

### **4.2 Persistência de Dados**

- **LocalStorage**: Apenas para preferência de tema (claro/escuro)
- **Sem Banco de Dados**: Todos os dados são estáticos e carregados de arquivos TypeScript
- **Dados Estáticos**: Medicamentos e informações são definidos em arquivos de dados

### **4.3 Arquivos de Dados**

#### **data/consolidated_drugs.ts** (Arquivo Principal)
```typescript
// Combinando todos os fármacos e removendo duplicatas
export const CONSOLIDATED_DRUGS: Drug[] = removeDuplicates([
  ...ORIGINAL_DRUGS,
  ...COMPREHENSIVE_DRUGS,
  ...EXPANDED_DRUGS,
  ...ADDITIONAL_DRUGS
]);
```

#### **Estrutura de Arquivos de Dados**
- `data/drugs.ts` - Medicamentos originais (1.906 linhas)
- `data/comprehensive_drugs.ts` - Medicamentos abrangentes
- `data/expanded_drugs.ts` - Medicamentos expandidos
- `data/additional_drugs.ts` - Medicamentos adicionais
- `data/improved_drugs.ts` - Medicamentos melhorados
- `data/consolidated_drugs.ts` - Consolidação de todos os dados

### **4.4 Fluxo de Dados**

```
Dados Estáticos (TypeScript) → CONSOLIDATED_DRUGS → App.tsx → Componentes
                                                      ↓
LocalStorage (Tema) ← App.tsx ← Estados Locais (React Hooks)
```

---

## 5. 🎨 **ASSETS E RECURSOS**

### **5.1 Estrutura de Recursos**

#### **Public Directory**
```
public/
├── favicon.ico          # Favicon padrão
└── favicon.svg          # Favicon SVG
```

#### **CSS e Estilos**
- `index.css` - Estilos globais e tema (260 linhas)
- `tailwind.config.js` - Configuração do Tailwind CSS
- Material-UI themes integrados

#### **Ícones**
- `components/icons.tsx` - Ícones SVG customizados
- Material-UI Icons para interface

### **5.2 Sistema de Temas**

#### **CSS Variables (index.css)**
```css
:root {
  --ui-bg: 255 255 255;
  --ui-foreground: 15 23 42;
  --ui-card: 255 255 255;
  --ui-muted: 100 116 139;
  --ui-primary: 30 58 138;
  --ui-primary-contrast: 255 255 255;
}

.dark {
  --ui-bg: 2 6 23;
  --ui-foreground: 226 232 240;
  --ui-card: 15 23 42;
  --ui-muted: 148 163 184;
  --ui-primary: 30 64 175;
  --ui-primary-contrast: 255 255 255;
}
```

### **5.3 Configurações**

#### **package.json**
```json
{
  "name": "calculadora-de-infusão-contínua-veterinária",
  "version": "0.0.0",
  "dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@mui/icons-material": "^7.3.1",
    "@mui/material": "^7.3.1",
    "react": "^19.1.1",
    "react-dom": "^19.1.1"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "typescript": "~5.8.2",
    "vite": "^6.3.5"
  }
}
```

#### **vite.config.ts**
```typescript
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
```

---

## 📈 **CARACTERÍSTICAS TÉCNICAS AVANÇADAS**

### **Performance e Otimização**
- **React 19.1.1** com hooks modernos
- **useMemo** e **useCallback** para otimização de re-renders
- **Lazy loading** de componentes modais
- **Debounced search** no seletor de medicamentos

### **Acessibilidade**
- **Material-UI** com suporte nativo a acessibilidade
- **ARIA labels** em todos os componentes interativos
- **Keyboard navigation** completa
- **Screen reader** friendly

### **Responsividade**
- **Mobile-first** design
- **Breakpoints** do Material-UI
- **Flexbox** e **Grid** layouts
- **Touch-friendly** interface

### **Validação e Segurança**
- **TypeScript** para type safety
- **Validação em tempo real** de inputs
- **Sanitização** de dados de entrada
- **Error boundaries** para tratamento de erros

---

## 🎯 **CASOS DE USO PRINCIPAIS**

1. **Cálculo de CRI para Analgésicos** (Fentanil, Morfina, Remifentanil)
2. **Cálculo de Vasoativos** (Dopamina, Dobutamina, Norepinefrina)
3. **Cálculo de Sedativos** (Propofol, Midazolam, Cetamina)
4. **Verificação de Compatibilidade** entre medicamentos
5. **Ajustes de Dose** por comorbidades (renal, hepática, cardíaca)

---

## 📋 **RESUMO DA ARQUITETURA**

O **CRIVET** é uma aplicação web moderna e robusta que combina:

- **Frontend React/TypeScript** com Material-UI
- **Sistema de cálculo veterinário** preciso e validado
- **Base de dados estática** com 100+ medicamentos
- **Interface responsiva** e acessível
- **Sistema de temas** claro/escuro
- **Validação em tempo real** de doses e parâmetros
- **Compatibilidade de medicamentos** com guias práticos

A aplicação está pronta para uso em ambiente de produção e pode ser facilmente expandida com novos medicamentos e funcionalidades.

---

**Documento gerado em**: 06/09/2025  
**Versão do projeto**: V1 (Backup estável)  
**Status**: ✅ Análise completa e documentada
