import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Loader2, Filter } from 'lucide-react';

// Firebase Imports Reais
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { auth, db, googleProvider } from './lib/firebase';

// Componentes
import LoginScreen from './components/Auth/LoginScreen';
import Sidebar from './components/Layout/Sidebar';
import Badge from './components/UI/Badge';
import CandidateModal from './components/Modals/CandidateModal';
import { KanbanColumn } from './components/Kanban/Column';

// Configuração das Etapas (Deve bater com o que seu Script envia ou normaliza)
const PIPELINE_STAGES = [
  { id: 'Inscrito', label: 'Inscrito', color: 'border-l-4 border-l-gray-400' },
  { id: 'Considerado', label: 'Considerado', color: 'border-l-4 border-l-blue-500' },
  { id: 'Entrevista I', label: 'Entrevista I', color: 'border-l-4 border-l-yellow-500' },
  { id: 'Testes realizados', label: 'Testes', color: 'border-l-4 border-l-purple-500' },
  { id: 'Entrevista II', label: 'Entrevista II', color: 'border-l-4 border-l-orange-500' },
  { id: 'Selecionado', label: 'Selecionado', color: 'border-l-4 border-l-green-500' }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Dados Reais
  const [candidates, setCandidates] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  
  // Estado da UI
  const [view, setView] = useState('kanban'); 
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Monitorar Login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Buscar Dados Reais do Firestore
  useEffect(() => {
    if (!user) {
      setCandidates([]);
      return;
    }

    setLoadingData(true);
    
    // Caminho exato onde seu Apps Script salvou os dados
    const q = query(collection(db, 'artifacts', 'young-ats', 'public', 'data', 'candidates'));

    // Listener em tempo real (aparece na hora que o script envia)
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCandidates(data);
      setLoadingData(false);
    }, (error) => {
      console.error("Erro ao buscar candidatos:", error);
      setLoadingData(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Filtros
  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => 
      (c.nome?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (c.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (c.cargo?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  }, [candidates, searchTerm]);

  // Atualização local otimista (para mover cards rápido)
  const handleUpdate = (id, newData) => {
    // Aqui você deve adicionar a lógica de updateDoc do Firestore também
    // Por enquanto atualiza o estado local para UX fluida
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, ...newData } : c));
  };

  const handleMoveCard = (id, direction) => {
    const candidate = candidates.find(c => c.id === id);
    if (!candidate) return;
    
    const currentStageIdx = PIPELINE_STAGES.findIndex(s => s.id === candidate.etapa);
    if (currentStageIdx === -1) return;

    let nextStageIdx = currentStageIdx;
    if (direction === 'next') nextStageIdx++;
    if (direction === 'prev') nextStageIdx--;

    if (nextStageIdx >= 0 && nextStageIdx < PIPELINE_STAGES.length) {
        // IMPORTANTE: Aqui você conectaria com o updateDoc do Firestore
        handleUpdate(id, { etapa: PIPELINE_STAGES[nextStageIdx].id });
    }
  };

  if (authLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <Loader2 className="animate-spin text-teal-600 w-10 h-10" />
        <p className="text-gray-500 font-medium animate-pulse">Carregando sistema...</p>
      </div>
    );
  }
  
  if (!user) return <LoginScreen onLogin={() => signInWithPopup(auth, googleProvider)} />;

  return (
    <div className="flex h-screen bg-[#f3f4f6] font-sans text-slate-800 overflow-hidden">
      <Sidebar view={view} setView={setView} user={user} onLogout={() => signOut(auth)} />

      <main className="flex-1 flex flex-col min-w-0 bg-white/50 backdrop-blur-sm">
        {/* Header Moderno */}
        <header className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center shadow-sm z-10">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {view === 'kanban' ? 'Pipeline de Talentos' : 'Todos os Candidatos'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {candidates.length} candidatos encontrados no banco de dados
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="relative group">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Buscar por nome, email ou cargo..." 
                className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none w-80 transition-all shadow-sm"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-teal-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-teal-700 active:transform active:scale-95 transition-all flex items-center gap-2 shadow-teal-200 shadow-md">
              <Plus size={18} /> Novo Candidato
            </button>
          </div>
        </header>

        {/* Área de Conteúdo */}
        <div className="flex-1 overflow-hidden p-6 bg-[#f8fafc]">
          {loadingData ? (
             <div className="flex h-full flex-col items-center justify-center text-gray-400 gap-3">
               <Loader2 className="animate-spin w-8 h-8 text-teal-600" />
               <p className="text-sm font-medium text-gray-500">Sincronizando dados...</p>
             </div>
          ) : view === 'kanban' ? (
            // Layout Kanban
            <div className="flex h-full gap-6 overflow-x-auto pb-4 px-2 items-start">
              {PIPELINE_STAGES.map(stage => (
                <KanbanColumn 
                  key={stage.id}
                  stage={stage}
                  candidates={filteredCandidates.filter(c => c.etapa === stage.id)}
                  onCardClick={setSelectedCandidate}
                  onMoveCard={handleMoveCard}
                />
              ))}
            </div>
          ) : (
            // Layout Lista (Tabela)
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col animate-in fade-in duration-300">
              <div className="overflow-auto flex-1">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50/80 text-gray-500 font-semibold border-b border-gray-200 sticky top-0 backdrop-blur-sm z-10">
                    <tr>
                      <th className="px-6 py-4 w-1/3">Nome</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Cargo</th>
                      <th className="px-6 py-4">Cidade</th>
                      <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCandidates.map(c => (
                      <tr key={c.id} onClick={() => setSelectedCandidate(c)} className="hover:bg-teal-50/30 cursor-pointer transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{c.nome}</div>
                          <div className="text-xs text-gray-400">{c.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge colorClass={`${PIPELINE_STAGES.find(s => s.id === c.etapa)?.color.replace('border-l-4', 'bg-opacity-10')} bg-gray-100 text-gray-700`}>
                            {c.etapa}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-gray-600 font-medium">{c.cargo || '-'}</td>
                        <td className="px-6 py-4 text-gray-500">{c.cidade || '-'}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-teal-600 hover:text-teal-800 font-medium text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                            Ver detalhes
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Modal */}
      <CandidateModal 
        candidate={selectedCandidate}
        isOpen={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onUpdate={handleUpdate}
        stages={PIPELINE_STAGES}
      />
    </div>
  );
}