import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Loader2, AlertCircle, Filter } from 'lucide-react';

// Firebase
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, query, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { auth, db, googleProvider } from './lib/firebase';

// Componentes
import LoginScreen from './components/Auth/LoginScreen';
import Sidebar from './components/Layout/Sidebar';
import Badge from './components/UI/Badge';
import CandidateModal from './components/Modals/CandidateModal';
import { KanbanColumn } from './components/Kanban/Column';

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
  const [searchTerm, setSearchTerm] = useState('');

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
    const s = searchTerm.toLowerCase();
    return candidates.filter(c => 
      (c.nome?.toLowerCase() || '').includes(s) || 
      (c.email?.toLowerCase() || '').includes(s) || 
      (c.cargo?.toLowerCase() || '').includes(s)
    );
  }, [candidates, searchTerm]);

  const handleUpdate = async (id, data) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    try {
      await updateDoc(doc(db, 'artifacts', 'young-ats', 'public', 'data', 'candidates', id), data);
    } catch (e) { console.error(e); }
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

      <main className="flex-1 flex flex-col min-w-0">
        {/* Header Moderno */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-5 flex justify-between items-center z-20 sticky top-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {view === 'kanban' ? 'Pipeline de Vagas' : 'Banco de Talentos'}
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              {candidates.length} talentos ativos
            </p>
          </div>
          
          <div className="flex gap-3 items-center">
            <div className="relative group">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Buscar candidatos..." 
                className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none w-64 transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20">
              <Plus size={18} /> <span className="hidden sm:inline">Novo Candidato</span>
            </button>
          </div>
        </header>

        {errorMsg && <div className="bg-red-50 text-red-600 px-6 py-3 text-sm flex items-center gap-2"><AlertCircle size={16} /> {errorMsg}</div>}

        <div className="flex-1 overflow-hidden p-6 bg-[#f8fafc]">
          {loadingData && candidates.length === 0 ? (
             <div className="flex h-full flex-col items-center justify-center text-slate-400 gap-3">
               <Loader2 className="animate-spin w-8 h-8 text-brand-600" />
               <p className="text-sm font-medium">Sincronizando dados...</p>
             </div>
          ) : view === 'kanban' ? (
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
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
              <div className="overflow-auto flex-1">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-4 w-1/3">Candidato</th>
                      <th className="px-6 py-4">Etapa</th>
                      <th className="px-6 py-4">Cargo</th>
                      <th className="px-6 py-4">Localização</th>
                      <th className="px-6 py-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCandidates.map(c => (
                      <tr key={c.id} onClick={() => setSelectedCandidate(c)} className="hover:bg-brand-50/50 cursor-pointer transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">{c.nome}</div>
                          <div className="text-xs text-slate-500">{c.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge colorClass="bg-slate-100 text-slate-700 border border-slate-200">{c.etapa}</Badge>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{c.cargo}</td>
                        <td className="px-6 py-4 text-slate-500">{c.cidade}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-brand-600 font-medium text-xs hover:underline">Ver Perfil</button>
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