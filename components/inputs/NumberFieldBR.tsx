import React, { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
  id?: string;
  value: number | null;           // fonte da verdade (estado externo)
  onChange: (v: number | null) => void;
  placeholder?: string;
  suffix?: string;                // ex: "kg", "mcg/kg/min"
  decimals?: number;              // ex: 2
  min?: number;                   // aviso (não bloqueia)
  max?: number;                   // aviso (não bloqueia)
  className?: string;
  clearOnFocus?: boolean;         // seleciona/limpa ao focar
};

const formatBR = (n: number, d = 2) =>
  n.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });

const parseBR = (s: string): number | null => {
  const clean = s.replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
  if (clean === '' || clean === '-' || clean === 'NaN') return null;
  const n = Number(clean);
  return Number.isFinite(n) ? n : null;
};

export function NumberFieldBR({
  id,
  value,
  onChange,
  placeholder = '0,00',
  suffix,
  decimals = 2,
  min,
  max,
  className,
  clearOnFocus = true,
}: Props) {
  const [editing, setEditing] = useState<string>(value == null ? '' : formatBR(value, decimals));
  const lastCommitted = useRef<number | null>(value);

  // Mantém o campo em sincronia com value externo (ex.: reset)
  useEffect(() => {
    if (value !== lastCommitted.current) {
      setEditing(value == null ? '' : formatBR(value, decimals));
      lastCommitted.current = value;
    }
  }, [value, decimals]);

  const commit = useCallback(
    (text: string) => {
      const parsed = parseBR(text);
      lastCommitted.current = parsed;
      onChange(parsed);
      setEditing(parsed == null ? '' : formatBR(parsed, decimals));
    },
    [onChange, decimals],
  );

  return (
    <div className="relative">
      <input
        id={id}
        inputMode="decimal"
        className={`
          flex h-10 w-full rounded-md border border-input bg-background px-3 pr-14 py-2 text-sm ring-offset-background
          placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
          ${className || ''}
        `}
        value={editing}
        onFocus={(e) => {
          if (clearOnFocus && editing.length > 0) e.currentTarget.select();
        }}
        onChange={(e) => {
          const text = e.target.value;
          setEditing(text);
          // Cálculo em tempo real: comita já no onChange (sem Enter)
          const parsed = parseBR(text);
          lastCommitted.current = parsed;
          onChange(parsed);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            // Cancela edição -> volta para último valor
            setEditing(lastCommitted.current == null ? '' : formatBR(lastCommitted.current, decimals));
            (e.target as HTMLInputElement).blur();
          }
        }}
        onBlur={(e) => {
          // Normaliza formatação ao sair
          commit(e.currentTarget.value);
        }}
        placeholder={placeholder}
      />
      {suffix && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-sm text-muted-foreground">{suffix}</span>
        </div>
      )}
      {(() => {
        const current = parseBR(editing);
        if (current == null || (min == null && max == null)) return null;
        const outMin = min != null && current < min;
        const outMax = max != null && current > max;
        if (!outMin && !outMax) return null;
        return (
          <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
            Valor fora da faixa recomendada ({min ?? '…'} – {max ?? '…'}). O cálculo será feito mesmo assim.
          </p>
        );
      })()}
    </div>
  );
}
