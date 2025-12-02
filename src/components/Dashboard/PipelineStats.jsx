import React from 'react';
import { Users, FileText, CheckCircle, Clock, Briefcase, Award } from 'lucide-react';

// Mapeamento de ícones para cada etapa (baseado nos IDs do seu App.jsx)
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
        const count = candidates.filter(c => c.etapa === stage.id).jh;
        const Icon = STAGE_ICONS[stage.id] || Users;
        
        // Remove o 'bg-' para usar na borda e texto
        const colorBase = stage.color.replace('bg-', ''); 

        return (
          <div key={stage.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-full h-1 bg-${colorBase}`}></div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-3xl font-bold text-slate-800 block">{candidates.filter(c => c.etapa === stage.id).length}</span>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">{stage.label}</span>
              </div>
              <div className={`p-2 rounded-lg bg-${colorBase}/10 text-${colorBase}`}>
                <Icon size={18} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}