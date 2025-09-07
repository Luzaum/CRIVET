export type CalcStep = { label: string; formula: string; example: string };
export type CalcResult<T> = T & { steps: CalcStep[] };