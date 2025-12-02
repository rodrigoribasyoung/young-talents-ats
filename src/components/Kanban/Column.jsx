import React from 'react';
import { ChevronRight, ChevronLeft, MapPin, Briefcase, User } from 'lucide-react';

export function KanbanColumn({ stage, candidates, onCardClick, onMoveCard }) {
  return (
    <div className="flex-shrink-0 w-80 flex flex-col h-full bg-gray-100/50 rounded-xl border border-gray-200/60 shadow-sm backdrop-blur-sm">
      {/* Header da Coluna */}
      <div className={`p-4 flex justify-between items-center bg-white rounded-t-xl border-b border-gray-100 sticky top-0 z-10 ${stage.color || 'border-l-4 border-l-gray-400'}`}>
        <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">{stage.label}</h3>
        <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-xs font-bold border border-gray-200">
          {candidates.length}
        </span>
      </div>

      {/* Lista de Cards */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-hide">
        {candidates.map(candidate => (
          <div 
            key={candidate.id}
            onClick={() => onCardClick(candidate)}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 cursor-pointer transition-all hover:shadow-md hover:border-teal-300 hover:-translate-y-1 group relative"
          >
            <div className="mb-3">
              <h4 className="font-bold text-gray-800 text-sm leading-tight group-hover:text-teal-700 transition-colors line-clamp-1">
                {candidate.nome || 'Candidato sem nome'}
              </h4>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500">
                <Briefcase size={12} className="text-gray-400 shrink-0" />
                <span className="truncate">{candidate.cargo || 'Cargo não informado'}</span>
              </div>
            </div>

            {/* Skills Tags */}
            {candidate.skills && Array.isArray(candidate.skills) && candidate.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {candidate.skills.slice(0, 3).map((skill, i) => (
                  <span key={i} className="text-[10px] bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded border border-slate-100">
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Footer do Card */}
            <div className="pt-3 border-t border-gray-50 flex justify-between items-center mt-auto">
              <div className="flex items-center gap-1 text-[10px] text-gray-400">
                <MapPin size={10} />
                <span className="truncate max-w-[120px]">{candidate.cidade || 'Remoto'}</span>
              </div>
              
              {/* Botões de Ação Rápida */}
              <div className="flex gap-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); onMoveCard(candidate.id, 'prev'); }}
                  className="p-1.5 rounded-md hover:bg-gray-100 text-gray-300 hover:text-gray-600 transition-colors"
                  title="Voltar etapa"
                >
                  <ChevronLeft size={14} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onMoveCard(candidate.id, 'next'); }}
                  className="p-1.5 rounded-md hover:bg-teal-50 text-gray-300 hover:text-teal-600 transition-colors"
                  title="Avançar etapa"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {candidates.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-gray-300 opacity-50">
            <User size={32} strokeWidth={1} className="mb-2" />
            <span className="text-xs italic">Vazio</span>
          </div>
        )}
      </div>
    </div>
  );
}