import React from 'react';
import { COMPATIBILITY_MATRIX, FORMULAS, EXAMPLES } from '../data/consolidated_drugs';

interface CompatibilityGuideProps {
  onClose: () => void;
}

export const CompatibilityGuide: React.FC<CompatibilityGuideProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Guia de Compatibilidade e Fórmulas</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Compatibilidade Semáforo */}
          <div>
            <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">🟢🟡🔴 Compatibilidade Y-site</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(COMPATIBILITY_MATRIX).map(([drug, compatibility]) => (
                <div key={drug} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <h5 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 capitalize">{drug}</h5>
                  <div className="space-y-2">
                    <div>
                      <span className="text-green-600 font-medium">🟢 Compatível:</span>
                      <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                        {compatibility['🟢']?.join(', ') || 'Nenhum'}
                      </div>
                    </div>
                    {compatibility['🟡'] && (
                      <div>
                        <span className="text-yellow-600 font-medium">🟡 Cautela:</span>
                        <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                          {compatibility['🟡'].join(', ')}
                        </div>
                      </div>
                    )}
                    <div>
                      <span className="text-red-600 font-medium">🔴 Incompatível:</span>
                      <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                        {compatibility['🔴']?.join(', ') || 'Nenhum'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fórmulas */}
          <div>
            <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">🧮 Fórmulas Universais</h4>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3">
              <div>
                <span className="font-semibold text-blue-800 dark:text-blue-300">Fórmula Universal:</span>
                <div className="font-mono text-sm text-blue-700 dark:text-blue-200 mt-1">
                  {FORMULAS.universal}
                </div>
              </div>
              <div>
                <span className="font-semibold text-blue-800 dark:text-blue-300">Conversão Útil:</span>
                <div className="font-mono text-sm text-blue-700 dark:text-blue-200 mt-1">
                  {FORMULAS.conversion}
                </div>
              </div>
              <div>
                <span className="font-semibold text-blue-800 dark:text-blue-300">Volume/Tempo Fixos:</span>
                <div className="font-mono text-sm text-blue-700 dark:text-blue-200 mt-1">
                  {FORMULAS.volumeTime}
                </div>
              </div>
            </div>
          </div>

          {/* Exemplos */}
          <div>
            <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">📝 Exemplos Rápidos</h4>
            <div className="space-y-3">
              {EXAMPLES.map((example, index) => (
                <div key={index} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <h5 className="font-semibold text-slate-800 dark:text-slate-200">{example.title}</h5>
                  <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">{example.description}</div>
                  <div className="font-mono text-sm text-blue-600 dark:text-blue-300 mt-2">{example.calculation}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Boas Práticas */}
          <div>
            <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">✅ Boas Práticas</h4>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span className="text-sm text-slate-700 dark:text-slate-200">Padronizar lidocaína em 1 mg/mL</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span className="text-sm text-slate-700 dark:text-slate-200">Retirar volume da bolsa antes de adicionar fármacos</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span className="text-sm text-slate-700 dark:text-slate-200">Usar linha dedicada se houver incompatibilidades</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span className="text-sm text-slate-700 dark:text-slate-200">Proteger da luz quando necessário (noradrenalina, nitroprussiato)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span className="text-sm text-slate-700 dark:text-slate-200">Dupla checagem em drogas high-alert</span>
              </div>
            </div>
          </div>

          {/* Alertas Importantes */}
          <div>
            <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">⚠️ Alertas Importantes</h4>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span className="text-sm text-slate-700 dark:text-slate-200">Evitar bicarbonato com catecolaminas</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span className="text-sm text-slate-700 dark:text-slate-200">RL com remifentanil</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span className="text-sm text-slate-700 dark:text-slate-200">Nitroprussiato fora de SG5% sem proteção de luz</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span className="text-sm text-slate-700 dark:text-slate-200">Ceftriaxone com cálcio/RL (proibido)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span className="text-sm text-slate-700 dark:text-slate-200">Lidocaína com adrenalina em misturas</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
