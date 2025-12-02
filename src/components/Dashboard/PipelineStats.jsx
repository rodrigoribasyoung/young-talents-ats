import React from 'react';
import { Users, FileText, CheckCircle, Clock, Briefcase, Award } from 'lucide-react';

const STAGE_ICONS = {
  'Inscrito': FileText,
  'Considerado': Users,
  'Entrevista I': Clock,
  'Testes realizados': Briefcase,
  'Entrevista II': CheckCircle,
  'Selecionado': Award
};

export default function PipelineStats({ stages, candidates }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {stages.map((stage) => {
        // Contagem direta sem variável intermediária para evitar erros de lint
        const stageCount = candidates.filter(c => c.etapa === stage.id).length;
        const Icon = STAGE_ICONS[stage.id] || Users;
        
        // Remove o 'bg-' para usar na borda e texto de forma dinâmica
        const colorBase = stage.color.replace('bg-', ''); 

        return (
          <div key={stage.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            {/* Barra superior colorida */}
            <div className={`absolute top-0 left-0 w-full h-1 ${stage.color}`}></div>
            
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-3xl font-bold text-slate-800 block">{stageCount}</span>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">{stage.label}</span>
              </div>
              <div className={`p-2 rounded-lg bg-slate-50 text-slate-500 group-hover:bg-slate-100 transition-colors`}>
                <Icon size={18} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}