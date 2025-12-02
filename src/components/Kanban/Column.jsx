import React from 'react';
import { ChevronRight, ChevronLeft, MapPin, Briefcase } from 'lucide-react';

export function KanbanColumn({ stage, candidates, onCardClick, onMoveCard }) {
  // Cores dinâmicas baseadas na borda definida no pai
  const accentColor = stage.color ? stage.color.split(' ')[2].replace('border-l-', '') : 'gray-400';

  return (
    <div className="flex-shrink-0 w-80 flex flex-col h-full bg-gray-100/80 rounded-xl border border-gray-200/60 shadow-sm backdrop-blur-sm">
      {/* Header da Coluna */}
      <div className={`p-4 flex justify-between items-center bg-white rounded-t-xl border-b border-gray-100 sticky top-0 z-10 ${stage.color}`}>
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">{stage.label}</h3>
        </div>
        <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-xs font-bold border border-gray-200 shadow-sm">
          {candidates.length}
        </span>
      </div>

      {/* Lista de Cards */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {candidates.map(candidate => (
          <div 
            key={candidate.id}
            onClick={() => onCardClick(candidate)}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 cursor-pointer transition-all hover:shadow-md hover:border-teal-200 hover:-translate-y-0.5 group relative"
          >
            <div className="mb-2">
              <h4 className="font-bold text-gray-800 text-sm leading-tight group-hover:text-teal-700 transition-colors line-clamp-1">
                {candidate.nome}
              </h4>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                <Briefcase size={12} className="text-gray-400" />
                <span className="truncate max-w-[180px]">{candidate.cargo || 'Sem cargo'}</span>
              </div>
            </div>

            {/* Skills Tags (se houver) */}
            {candidate.skills && candidate.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {candidate.skills.slice(0, 2).map((skill, i) => (
                  <span key={i} className="text-[10px] bg-gray-50 text-gray-600 px-1.5 py-0.5 rounded border border-gray-100">
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Footer do Card */}
            <div className="pt-3 border-t border-gray-50 flex justify-between items-center mt-2">
              <div className="flex items-center gap-1 text-[10px] text-gray-400">
                <MapPin size={10} />
                <span className="truncate max-w-[100px]">{candidate.cidade || 'Remoto'}</span>
              </div>
              
              {/* Botões de Ação Rápida (Aparecem no Hover) */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-3 right-3 bg-white pl-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); onMoveCard(candidate.id, 'prev'); }}
                  className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Voltar etapa"
                >
                  <ChevronLeft size={14} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onMoveCard(candidate.id, 'next'); }}
                  className="p-1 rounded-md hover:bg-teal-50 text-gray-400 hover:text-teal-600 transition-colors"
                  title="Avançar etapa"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {candidates.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-xs italic border-2 border-dashed border-gray-200 rounded-lg">
            Nenhum candidato nesta etapa
          </div>
        )}
      </div>
    </div>
  );
}