import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Plus, Loader2 } from 'lucide-react';

// Firebase
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from './lib/firebase';

// Components
import LoginScreen from './components/Auth/LoginScreen';
import Sidebar from './components/Layout/Sidebar';
import Badge from './components/UI/Badge';
import CandidateModal from './components/Modals/CandidateModal'; // *Certifique-se de mover o código do Modal para este arquivo
import { KanbanColumn } from './components/Kanban/Column'; // *Se optar por separar o Kanban também

// Nota: Para simplificar esta resposta, vou reinserir o KanbanColumn e Modal simplificados aqui 
// caso você não tenha criado os arquivos deles ainda, mas o ideal é movê-los também.

// --- MOCK CONSTANTS ---
const PIPELINE_STAGES = [
  { id: 'Inscrito', label: 'Inscrito', color: 'bg-gray-100 text-gray-600 border-gray-200' },
  { id: 'Considerado', label: 'Considerado', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'Entrevista I', label: 'Entrevista I', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { id: 'Testes realizados', label: 'Testes', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'Selecionado', label: 'Selecionado', color: 'bg-green-50 text-green-700 border-green-200' }
];

// Fallback Data
const MOCK_CANDIDATES = [
  { id: '1', nome: 'Ana Silva', email: 'ana@email.com', cargo: 'Marketing', etapa: 'Inscrito', cidade: 'São Paulo' },
  { id: '2', nome: 'Carlos Dev', email: 'carlos@email.com', cargo: 'Dev Full Stack', etapa: 'Entrevista I', cidade: 'Rio de Janeiro' },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [view, setView] = useState('kanban'); 
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Auth Effect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Data Effect
  useEffect(() => {
    if (!user) {
      setCandidates([]);
      return;
    }
    setLoadingData(true);
    // Simulação de fetch
    setTimeout(() => {
      setCandidates(MOCK_CANDIDATES);
      setLoadingData(false);
    }, 800);
  }, [user]);

  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => 
      c.nome?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [candidates, searchTerm]);

  const handleUpdate = (id, data) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  };

  if (authLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-teal-600" /></div>;
  
  if (!user) return <LoginScreen onLogin={() => signInWithPopup(auth, googleProvider)} />;

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800 overflow-hidden">
      <Sidebar view={view} setView={setView} user={user} onLogout={() => signOut(auth)} />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {view === 'kanban' ? 'Pipeline' : 'Candidatos'}
            </h1>
            <p className="text-sm text-gray-500">Gerencie seus processos seletivos</p>
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar candidato..." 
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none w-64 transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center gap-2 shadow-sm">
              <Plus size={16} /> Novo
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden p-8">
          {loadingData ? (
             <div className="flex h-full items-center justify-center text-gray-400 gap-2"><Loader2 className="animate-spin" /> Carregando...</div>
          ) : view === 'kanban' ? (
            <div className="flex h-full gap-6 overflow-x-auto pb-2">
              {PIPELINE_STAGES.map(stage => (
                <div key={stage.id} className="flex-shrink-0 w-80 flex flex-col h-full bg-gray-100/50 rounded-xl border border-gray-200">
                  <div className={`p-4 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-xl border-t-4 ${stage.color.split(' ')[2]}`}>
                    <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">{stage.label}</h3>
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs font-bold">{filteredCandidates.filter(c => c.etapa === stage.id).length}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {filteredCandidates.filter(c => c.etapa === stage.id).map(c => (
                      <div key={c.id} onClick={() => setSelectedCandidate(c)} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md cursor-pointer transition-all hover:border-teal-200 group">
                        <h4 className="font-bold text-gray-800 text-sm mb-1 group-hover:text-teal-700">{c.nome}</h4>
                        <p className="text-xs text-gray-500">{c.cargo}</p>
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded">{c.cidade}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
              <div className="overflow-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4">Nome</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Cargo</th>
                      <th className="px-6 py-4">Local</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCandidates.map(c => (
                      <tr key={c.id} onClick={() => setSelectedCandidate(c)} className="hover:bg-gray-50 cursor-pointer transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{c.nome}</td>
                        <td className="px-6 py-4"><Badge colorClass={PIPELINE_STAGES.find(s => s.id === c.etapa)?.color}>{c.etapa}</Badge></td>
                        <td className="px-6 py-4 text-gray-600">{c.cargo}</td>
                        <td className="px-6 py-4 text-gray-500">{c.cidade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Aqui você reinseriria o componente CandidateModal que moveu para pasta Modals */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedCandidate.nome}</h2>
                <p className="text-gray-500">{selectedCandidate.cargo}</p>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="p-2 hover:bg-gray-100 rounded-full"><span className="text-xl">×</span></button>
            </div>
            {/* Conteúdo do Modal aqui... */}
            <div className="mt-6 flex justify-end gap-3">
               <button onClick={() => setSelectedCandidate(null)} className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">Fechar</button>
               <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Salvar Alterações</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}