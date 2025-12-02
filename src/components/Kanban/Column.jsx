import React from 'react';
import { ChevronRight, ChevronLeft, MapPin, Briefcase } from 'lucide-react';

export function KanbanColumn({ stage, candidates, onCardClick, onMoveCard }) {
  return (
    <div className="flex-shrink-0 w-[340px] flex flex-col h-full max-h-full">
      {/* Header da Coluna com Indicador de Cor */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${stage.color || 'bg-slate-400'}`}></div>
          <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">{stage.label}</h3>
        </div>
        <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md text-xs font-bold">
          {candidates.length}
        </span>
      </div>

      {/* Área de Cards (Scroll) */}
      <div className="flex-1 overflow-y-auto px-1 pb-2 space-y-3 scrollbar-thin scrollbar-thumb-slate-200">
        {candidates.map(candidate => (
          <div 
            key={candidate.id}
            onClick={() => onCardClick(candidate)}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-300 transition-all duration-200 cursor-pointer group relative"
          >
            {/* Conteúdo do Card */}
            <div className="mb-3">
              <h4 className="font-bold text-slate-800 text-sm leading-tight mb-1 group-hover:text-brand-700 transition-colors">
                {candidate.nome || 'Nome não informado'}
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Briefcase size={12} />
                <span className="truncate max-w-[200px]">{candidate.cargo || 'Sem cargo'}</span>
              </div>
            </div>

            {/* Tags / Skills */}
            {candidate.skills && candidate.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {candidate.skills.slice(0, 2).map((skill, i) => (
                  <span key={i} className="text-[10px] font-medium bg-slate-50 text-slate-600 px-2 py-1 rounded-md border border-slate-100">
                    {skill}
                  </span>
                ))}
                {candidate.skills.length > 2 && (
                  <span className="text-[10px] text-slate-400 py-1">+ {candidate.skills.length - 2}</span>
                )}
              </div>
            )}

            {/* Footer com Local e Ações */}
            <div className="pt-3 border-t border-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                <MapPin size={10} />
                <span>{candidate.cidade || 'Remoto'}</span>
              </div>
              
              {/* Botões Flutuantes (Hover) */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); onMoveCard(candidate.id, 'prev'); }}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <ChevronLeft size={14} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onMoveCard(candidate.id, 'next'); }}
                  className="p-1.5 rounded-lg hover:bg-brand-50 text-slate-400 hover:text-brand-600"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}