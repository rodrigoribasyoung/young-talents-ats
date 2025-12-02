import React from 'react';
import { Search, MapPin, Briefcase } from 'lucide-react';

export default function FilterBar({ filters, setFilters }) {
  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
      {/* Busca por Nome */}
      <div className="flex-1 min-w-[200px] relative group">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600" />
        <input 
          type="text" 
          placeholder="Nome do candidato..."
          value={filters.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border-slate-200 border rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm transition-all"
        />
      </div>

      {/* Busca por Cargo */}
      <div className="flex-1 min-w-[200px] relative group">
        <Briefcase size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600" />
        <input 
          type="text" 
          placeholder="Filtrar por cargo..."
          value={filters.role}
          onChange={(e) => handleChange('role', e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50SH border-slate-200 border rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm transition-all"
        />
      </div>

      {/* Busca por Local */}
      <div className="flex-1 min-w-[200px] relative group">
        <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600" />
        <input 
          type="text" 
          placeholder="Cidade..."
          value={filters.location}
          onChange={(e) => handleChange('location', e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border-slate-200 border rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm transition-all"
        />
      </div>
    </div>
  );
}