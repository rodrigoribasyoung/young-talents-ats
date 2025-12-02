import React, { useState, useEffect } from 'react';
import { X, Save, Settings } from 'lucide-react';

export default function CandidateModal({ candidate, isOpen, onClose, onUpdate, stages }) {
  if (!isOpen || !candidate) return null;

  const [formData, setFormData] = useState(candidate);
  const [activeTab, setActiveTab] = useState('dados'); 

  useEffect(() => {
    setFormData(candidate);
  }, [candidate]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdate(candidate.id, formData);
    onClose();
  };

  const renderField = (label, field, type = 'text', fullWidth = false) => (
    <div className={`flex flex-col ${fullWidth ? 'col-span-2' : ''}`}>
      <label className="text-xs font-semibold text-gray-500 uppercase mb-1">{label}</label>
      <input 
        type={type}
        value={formData[field] || ''}
        onChange={(e) => handleChange(field, e.target.value)}
        className="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200 p-6 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-teal-600 text-white flex items-center justify-center text-2xl font-bold uppercase">
              {formData.nome ? formData.nome.charAt(0) : 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{formData.nome}</h2>
              <p className="text-gray-500 text-sm">{formData.cargo || 'Candidato'}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">{formData.etapa}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          {['dados', 'profissional', 'processo'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 text-sm font-medium border-b-2 capitalize ${activeTab === tab ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {tab === 'dados' ? 'Dados Pessoais' : tab === 'profissional' ? 'Profissional' : 'Processo Seletivo'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          {activeTab === 'dados' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderField('Nome Completo', 'nome', 'text', true)}
              {renderField('Email', 'email')}
              {renderField('Telefone', 'telefone')}
              {renderField('Cidade', 'cidade')}
              {renderField('Idade', 'idade', 'number')}
            </div>
          )}

          {activeTab === 'profissional' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderField('Área Interesse', 'areaInteresse', 'text', true)}
              {renderField('Formação', 'formacao')}
              {renderField('Cursos', 'cursos', 'text', true)}
              <div className="col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1">Experiências</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-md p-2 text-sm h-24"
                  value={formData.experiencias || ''}
                  onChange={(e) => handleChange('experiencias', e.target.value)}
                />
              </div>
            </div>
          )}

          {activeTab === 'processo' && (
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Settings size={18} /> Movimentação de Etapa
                </h3>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1">Etapa Atual</label>
                  <select 
                    value={formData.etapa}
                    onChange={(e) => handleChange('etapa', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  >
                    {stages.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white p-4 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancelar</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:opacity-90 flex items-center gap-2">
            <Save size={16} /> Salvar
          </button>
        </div>
      </div>
    </div>
  );
}