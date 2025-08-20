
import React from 'react';
import { Drug } from '../types';
import { BookOpenIcon, BeakerIcon, ActivityIcon, PlusCircleIcon, AlertTriangleIcon, FileTextIcon, EyeOffIcon } from './icons';

const Modal: React.FC<{ title: string; children: React.ReactNode; onClose: () => void; maxWidth?: string; }> = ({ title, children, onClose, maxWidth = 'max-w-md' }) => {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div className={`bg-white dark:bg-slate-900 rounded-md shadow-xl w-full ${maxWidth} max-h-[90vh] flex flex-col`} onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
                    <button onClick={onClose} className="text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 text-2xl leading-none font-light">&times;</button>
                </div>
                <div className="p-5 overflow-y-auto drug-modal text-slate-700 dark:text-slate-200">{children}</div>
            </div>
        </div>
    );
};

const InfoSection: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, children, icon }) => (
    <div className="border-b border-slate-200 dark:border-slate-700 pb-4 last:border-b-0 last:pb-0">
        <div className="flex items-center gap-3 mb-3">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200">{icon}</div>
            <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h4>
        </div>
        <div className="pl-11 space-y-3 text-sm">{children}</div>
    </div>
);

const AdjustmentPill: React.FC<{ label: string; text: string | undefined; className?: string }> = ({ label, text, className = 'bg-slate-50 border-slate-200 dark:bg-slate-800/60 dark:border-slate-600' }) => {
    if (!text) return null;
    return (
        <div className={`p-3 rounded-lg border ${className}`}>
            <h6 className="font-semibold text-slate-800 dark:text-slate-100">{label}</h6>
            <p className="mt-1 text-slate-700 dark:text-slate-200" dangerouslySetInnerHTML={{ __html: text }}></p>
        </div>
    );
};

export const DrugInfoModal: React.FC<{ drug: Drug; onClose: () => void }> = ({ drug, onClose }) => {
    const info = drug.info;

    if (!info) {
        return <Modal title={drug.name} onClose={onClose}><p>Informações detalhadas não disponíveis para este fármaco.</p></Modal>;
    }

    return (
        <Modal title={drug.name} onClose={onClose} maxWidth="max-w-3xl">
            <div className="space-y-6">
                <InfoSection title="Indicação e Mecanismo" icon={<FileTextIcon className="w-5 h-5"/>}>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                        {info.indicationSummary.map((s, i) => (
                            <span key={i}>
                                {i === 0 ? <mark className="bg-blue-100 dark:bg-blue-800/50 text-inherit">{s}</mark> : s}
                                {i < info.indicationSummary.length - 1 ? ' ' : ''}
                            </span>
                        ))}
                    </p>
                    {info.mechanism && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{info.mechanism}</p>}
                </InfoSection>
                
                {drug.preparationGuide && (
                    <InfoSection title="Instruções de Preparo" icon={<BeakerIcon className="w-5 h-5" />}>
                        <div className="prose prose-sm max-w-none bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 p-3 rounded-md">
                            <div 
                                className="text-slate-800 dark:text-amber-100 [&_table]:border-slate-300 dark:[&_table]:border-slate-600 [&_th]:bg-slate-100 dark:[&_th]:bg-slate-700 [&_th]:text-slate-800 dark:[&_th]:text-slate-200 [&_td]:border-slate-200 dark:[&_td]:border-slate-600 [&_strong]:text-slate-900 dark:[&_strong]:text-amber-200 [&_em]:text-slate-700 dark:[&_em]:text-amber-300 [&_ol]:text-slate-800 dark:[&_ol]:text-amber-100 [&_ul]:text-slate-800 dark:[&_ul]:text-amber-100 [&_li]:text-slate-800 dark:[&_li]:text-amber-100" 
                                dangerouslySetInnerHTML={{ __html: drug.preparationGuide }} 
                            />
                        </div>
                    </InfoSection>
                )}

                <InfoSection title="Doses Usuais" icon={<PlusCircleIcon className="w-5 h-5"/>}>
                    <div className="space-y-3 p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900">
                        {info.dosesText.dog.cri && (
                            <div>
                                <span className="font-semibold text-blue-900 dark:text-blue-200">🐶 Cães:</span>
                                <p className="ml-2 text-slate-700 dark:text-slate-200">
                                    {info.dosesText.dog.cri && <><strong>CRI:</strong> {info.dosesText.dog.cri}</>}
                                    {info.dosesText.dog.bolus && <><br/><strong>Bólus:</strong> {info.dosesText.dog.bolus}</>}
                                </p>
                            </div>
                        )}
                         {info.dosesText.cat.cri && (
                            <div>
                                <span className="font-semibold text-blue-900 dark:text-blue-200">🐱 Gatos:</span>
                                 <p className="ml-2 text-slate-700 dark:text-slate-200">
                                    {info.dosesText.cat.cri && <><strong>CRI:</strong> {info.dosesText.cat.cri}</>}
                                    {info.dosesText.cat.bolus && <><br/><strong>Bólus:</strong> {info.dosesText.cat.bolus}</>}
                                </p>
                            </div>
                         )}
                        {info.dosesText.notes && <p className="p-2 mt-2 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 text-yellow-800 dark:text-yellow-200 rounded-r-md text-xs"><mark className="bg-yellow-200/70 dark:bg-yellow-700/60 text-inherit">{info.dosesText.notes}</mark></p>}
                    </div>
                </InfoSection>

                <InfoSection title="Diluição e Compatibilidade" icon={<BeakerIcon className="w-5 h-5"/>}>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-semibold">Diluentes Recomendados:</span>
                            <div className="flex flex-wrap gap-2">
                                {info.diluents.recommended?.map(d => <span key={d} className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-xs font-semibold rounded-full">{d}</span>)}
                            </div>
                            {info.photoprotection && <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-600 text-white text-xs font-medium rounded-full"><EyeOffIcon className="w-4 h-4"/> Proteger da Luz</span>}
                        </div>
                        {info.diluents.notes && <p className="text-xs text-slate-600 dark:text-slate-300 italic"><mark className="bg-slate-200/70 dark:bg-slate-700/60 text-inherit">{info.diluents.notes}</mark></p>}

                        {info.compatibility.incompatibilities?.length > 0 && 
                            <p><strong className="font-semibold text-red-600">Incompatível com:</strong> <span className="text-red-700 dark:text-red-300">{info.compatibility.incompatibilities.join(', ')}</span></p>}

                        {info.compatibility.ySite?.length > 0 && 
                            <p><strong className="font-semibold text-green-600">Compatível em Y-site com:</strong> <span className="text-green-700 dark:text-green-300">{info.compatibility.ySite.join(', ')}</span></p>}
                        
                        {info.compatibility.notes && <p className="text-xs text-slate-500 dark:text-slate-400 italic">{info.compatibility.notes}</p>}
                    </div>
                </InfoSection>

                <InfoSection title="Ajustes e Alertas" icon={<AlertTriangleIcon className="w-5 h-5"/>}>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <AdjustmentPill label="Doença Renal" text={info.adjustments.renal} className="bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-700"/>
                        <AdjustmentPill label="Doença Hepática" text={info.adjustments.hepatic} className="bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-700"/>
                        <AdjustmentPill label="Cardiopatias" text={info.adjustments.cardiac} />
                        <AdjustmentPill label="Paciente Neurológico" text={info.adjustments.neuro} />
                        <AdjustmentPill label="Paciente Pediátrico" text={info.adjustments.pediatric} />
                        <AdjustmentPill label="Paciente Geriátrico" text={info.adjustments.geriatric} />
                        <AdjustmentPill label="Gestante/Lactante" text={info.adjustments.pregnancy} />
                        <AdjustmentPill label="Sepse" text={info.adjustments.sepsis} />
                     </div>
                     {info.contraindications?.length > 0 && <p className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg"><strong className="font-semibold text-red-700 dark:text-red-200">Contraindicações principais:</strong> {info.contraindications.join(', ')}</p>}
                </InfoSection>

                 <InfoSection title="Monitorização e Boas Práticas" icon={<ActivityIcon className="w-5 h-5"/>}>
                    <p><strong className="font-semibold">Monitorar:</strong> {info.monitoring.join(', ')}.</p>
                    <ul className="list-disc list-inside space-y-1.5 mt-2">
                        {info.goodPractice.map((tip, i) => <li key={i} dangerouslySetInnerHTML={{ __html: tip }}></li>)}
                    </ul>
                </InfoSection>
                
                {info.citations?.length > 0 && (
                  <div className="text-xs text-slate-400 dark:text-slate-500 mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2"><BookOpenIcon className="w-4 h-4"/> Fontes Principais</h4>
                      <ul className="list-disc list-inside ml-5 space-y-1">
                          {info.citations.map((citation, i) => <li key={i}>{citation}</li>)}
                      </ul>
                  </div>
                )}
            </div>
        </Modal>
    );
};
