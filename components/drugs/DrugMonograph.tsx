import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { useDrug } from "../../context/DrugContext";

/**
 * Renderizador simples e resiliente:
 * - Usa texto rico básico (parágrafos e quebras de linha)
 * - Se vier Markdown, ainda fica legível (sem dependência extra)
 */
function Section({ title, body }: { title: string; body?: string }) {
  if (!body) return null;
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold">{title}</h4>
      <div className="text-sm whitespace-pre-wrap leading-relaxed">{body}</div>
    </div>
  );
}

export function DrugMonograph() {
  const { selectedDrug } = useDrug();
  if (!selectedDrug) return null;

  const m = selectedDrug.monograph;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>4. Informações Adicionais sobre o Medicamento</CardTitle>
          <Badge variant="secondary" className="font-normal">
            Bulário
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-2 space-y-6">
        <Section title="Mecanismo de Ação" body={m?.mechanism} />
        <Section title="Indicações (Cães e Gatos)" body={m?.indications} />
        <Section title="Contraindicações / Precauções" body={m?.contraindications} />
        <Section title="CRI – Doses & Notas" body={m?.criNotes} />
        <Section title="Bólus – Doses & Notas" body={m?.bolusNotes} />
        <Section title="Diluição / Preparos" body={m?.dilution} />
        <Section title="Compatibilidade com Fluidos / Fármacos" body={m?.compatibility} />
        <Section title="Apresentações Comerciais" body={m?.presentations} />
        <Section title="Alertas Importantes" body={m?.alerts} />
        {m?.references && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Fontes / Referências</h4>
            <div className="text-sm whitespace-pre-wrap leading-relaxed">
              {m.references}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

