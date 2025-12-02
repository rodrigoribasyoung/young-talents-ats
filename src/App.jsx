import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Loader2, AlertCircle, LayoutGrid, List as ListIcon, MoreHorizontal, Calendar, Phone } from 'lucide-react';

// Firebase Imports
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, query, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { auth, db, googleProvider } from './lib/firebase';

// Component Imports
import LoginScreen from './components/Auth/LoginScreen';
import Sidebar from './components/Layout/Sidebar';
import CandidateModal from './components/Modals/CandidateModal';
import { KanbanColumn } from './components/Kanban/Column';
import PipelineStats from './components/Dashboard/PipelineStats';
import FilterBar from './components/Dashboard/FilterBar';

const PIPELINE_STAGES = [
  { id: 'Inscrito', label: 'Inscrito', color: 'bg-slate-500' },
  { id: 'Considerado', label: 'Considerado', color: 'bg-blue-500' },
  { id: 'Entrevista I', label: 'Entrevista I', color: 'bg-yellow-500' },
  { id: 'Testes realizados', label: 'Testes', color: 'bg-purple-500' },
  { id: 'Entrevista II', label: 'Entrevista II', color: 'bg-orange-500' },
  { id: 'Selecionado', label: 'Selecionado', color: 'bg-emerald-500' }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [view, setView] = useState('kanban'); 
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  
  // Estado limpo e corrigido
  const [filters, setFilters] = useState({ name: '', role: '', location: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    setLoadingData(true);
    const q = query(collection(db, 'artifacts', 'young-ats', 'public', 'data', 'candidates'));
    const unsub = onSnapshot(q, (snap) => {
      setCandidates(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoadingData(false);
    }, (err) => {
      console.error(err);
      setErrorMsg("Erro ao carregar dados.");
      setLoadingData(false);
    });
    return () => unsub();
  }, [user]);

  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => 
      (c.nome?.toLowerCase() || '').includes(filters.name.toLowerCase()) &&
      (c.cargo?.toLowerCase() || '').includes(filters.role.toLowerCase()) &&
      (c.cidade?.toLowerCase() || '').includes(filters.location.toLowerCase())
    );
  }, [candidates, filters]);

  const handleUpdate = async (id, data) => {
    // Atualização otimista na UI
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    try {
      await updateDoc(doc(db, 'artifacts', 'young-ats', 'public', 'data', 'candidates', id), data);
    } catch (e) { 
      console.error(e);
      setErrorMsg("Falha ao salvar alteração.");
    }
  };

  const handleMoveCard = (id, direction) => {
    const c = candidates.find(x => x.id === id);
    if (!c) return;
    const idx = PIPELINE_STAGES.findIndex(s => s.id === c.etapa);
    const nextIdx = direction === 'next' ? idx + 1 : idx - 1;
    if (nextIdx >= 0 && nextIdx < PIPELINE_STAGES.length) {
      handleUpdate(id, { etapa: PIPELINE_STAGES[nextIdx].id });
    }
  };

  if (authLoading) return <div className="h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-brand-600" /></div>;
  if (!user) return <LoginScreen onLogin={() => signInWithPopup(auth, googleProvider)} />;

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 font-sans overflow-hidden">
      <Sidebar view={view} setView={setView} user={user} onLogout={() => signOut(auth)} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Background Decorativo Sutil */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-100/30 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>

        {/* Header Superior */}
        <header className="px-8 py-6 flex justify-between items-center z-20 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Gestão de Talentos
            </h1>
            <p className="text-slate-500 mt-1 font-medium">
              Visão geral do seu pipeline de contratação
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="bg-white border border-slate-200 rounded-lg p-1 flex shadow-sm">
                <button 
                  onClick={() => setView('kanban')}
                  className={`p-2 rounded-md transition-all ${view === 'kanban' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Visualização Kanban"
                >
                  <LayoutGrid size={18} />
                </button>
                <button 
                  onClick={() => setView('list')}
                  className={`p-2 rounded-md transition-all ${view === 'list' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Visualização em Lista"
                >
                  <ListIcon size={18} />
                </button>
             </div>

            <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20">
              <Plus size={18} /> <span className="hidden sm:inline">Adicionar Candidato</span>
            </button>
          </div>
        </header>

        {errorMsg && (
          <div className="mx-8 mb-4 bg-red-50 text-red-600 px-6 py-3 rounded-xl text-sm flex items-center gap-2 border border-red-100 animate-in slide-in-from-top-2">
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-8 pb-8 scrollbar-thin scrollbar-thumb-slate-200">
          
          <PipelineStats stages={PIPELINE_STAGES} candidates={candidates} />
          <FilterBar filters={filters} setFilters={setFilters} />

          {loadingData && candidates.length === 0 ? (
             <div className="flex h-64 flex-col items-center justify-center text-slate-400 gap-3">
               <Loader2 className="animate-spin w-8 h-8 text-brand-600" />
               <p className="text-sm font-medium">Carregando pipeline...</p>
             </div>
          ) : view === 'kanban' ? (
            <div className="flex gap-6 overflow-x-auto pb-4 items-start min-h-[500px]">
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
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 w-1/4">Candidato</th>
                    <th className="px-6 py-4">Status / Etapa</th>
                    <th className="px-6 py-4">Cargo</th>
                    <th className="px-6 py-4">Contato</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCandidates.map(c => {
                    const stage = PIPELINE_STAGES.find(s => s.id === c.etapa) || PIPELINE_STAGES[0];
                    const initials = c.nome ? c.nome.charAt(0) : '?';
                    // Avatar colorido baseado no nome
                    const avatarColor = ['bg-blue-100 text-blue-600', 'bg-purple-100 text-purple-600', 'bg-emerald-100 text-emerald-600', 'bg-orange-100 text-orange-600'][c.nome?.length % 4];

                    return (
                      <tr key={c.id} onClick={() => setSelectedCandidate(c)} className="hover:bg-slate-50/80 cursor-pointer transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm uppercase ${avatarColor}`}>
                              {initials}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{c.nome}</div>
                              <div className="text-xs text-slate-500">Adicionado recentemente</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${stage.color.replace('bg-', 'bg-opacity-10 bg-').replace('bg-', 'text-').replace('bg-', 'border-')}`}>
                            {c.etapa}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-700 font-medium">{c.cargo}</div>
                          <div className="text-xs text-slate-400">Tempo integral</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1 text-xs text-slate-500">
                             <span className="flex items-center gap-1"><Calendar size={12}/> {c.idade ? `${c.idade} anos` : 'N/A'}</span>
                             <span className="flex items-center gap-1"><Phone size={12}/> {c.telefone || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-slate-400 hover:text-brand-600 hover:bg-brand-50 p-2 rounded-full transition-colors">
                            <MoreHorizontal size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      
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