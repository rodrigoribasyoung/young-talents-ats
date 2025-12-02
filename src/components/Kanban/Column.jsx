import React from 'react';
import { ChevronRight } from 'lucide-react';

export function KanbanColumn({ stage, candidates, onCardClick, onMoveCard }) {
  return (
    <div className="flex-shrink-0 w-80 flex flex-col h-full bg-gray-50/50 rounded-lg border border-gray-200">
      <div className={`p-3 border-b border-gray-200 flex justify-between items-center bg-white rounded-t-lg border-t-4 ${stage.color ? stage.color.replace('bg-', 'border-').split(' ')[0] : 'border-gray-300'}`}>
        <h3 className="font-semibold text-gray-700 text-sm uppercase">{stage.label}</h3>
        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">{candidates.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-3 scrollbar-hide">
        {candidates.map(candidate => (
          <div 
            key={candidate.id}
            onClick={() => onCardClick(candidate)}
            className="bg-white p-4 rounded-md shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-gray-800 text-sm truncate">{candidate.nome}</h4>
            </div>
            <p className="text-xs text-gray-500 mb-2 truncate">{candidate.cargo}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {(candidate.skills || []).slice(0, 2).map((skill, i) => (
                <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{skill}</span>
              ))}
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-50">
              <span className="text-[10px] text-gray-400">{candidate.cidade}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); onMoveCard(candidate.id, 'next'); }}
                className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-green-600"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}