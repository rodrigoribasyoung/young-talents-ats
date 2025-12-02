import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Loader2, AlertCircle } from 'lucide-react';

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
  { id: 'Inscrito', label: 'Inscrito', color: 'border-l-4 border-l-slate-400' },
  { id: 'Considerado', label: 'Considerado', color: 'border-l-4 border-l-blue-500' },
  { id: 'Entrevista I', label: 'Entrevista I', color: 'border-l-4 border-l-yellow-500' },
  { id: 'Testes realizados', label: 'Testes', color: 'border-l-4 border-l-purple-500' },
  { id: 'Entrevista II', label: 'Entrevista II', color: 'border-l-4 border-l-orange-500' },
  { id: 'Selecionado', label: 'Selecionado', color: 'border-l-4 border-l-green-500' }
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

  // 1. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Data Listener
  useEffect(() => {
    if (!user) {
      setCandidates([]);
      return;
    }

    setLoadingData(true);
    setErrorMsg(null);
    
    // Caminho da coleção (deve ser idêntico ao do Apps Script)
    const collectionRef = collection(db, 'artifacts', 'young-ats', 'public', 'data', 'candidates');
    const q = query(collectionRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setCandidates(data);
      setLoadingData(false);
    }, (error) => {
      console.error("Erro Firestore:", error);
      setErrorMsg("Erro ao carregar dados. Verifique as Permissões ou a Conexão.");
      setLoadingData(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Filtros
  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (c.nome?.toLowerCase() || '').includes(searchLower) ||
        (c.email?.toLowerCase() || '').includes(searchLower) ||
        (c.cargo?.toLowerCase() || '').includes(searchLower)
      );
    });
  }, [candidates, searchTerm]);

  // Atualização Real e Otimista
  const handleUpdate = async (id, newData) => {
    // 1. Atualiza UI imediatamente
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, ...newData } : c));
    
    // 2. Atualiza Firebase
    try {
      const docRef = doc(db, 'artifacts', 'young-ats', 'public', 'data', 'candidates', id);
      await updateDoc(docRef, newData);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      // Reverte se falhar (opcional)
    }
  };

  const handleMoveCard = (id, direction) => {
    const candidate = candidates.find(c => c.id === id);
    if (!candidate) return;
    
    const currentIdx = PIPELINE_STAGES.findIndex(s => s.id === candidate.etapa);
    if (currentIdx === -1) return; // Etapa desconhecida

    let nextIdx = currentIdx;
    if (direction === 'next') nextIdx++;
    if (direction === 'prev') nextIdx--;

    if (nextIdx >= 0 && nextIdx < PIPELINE_STAGES.length) {
      handleUpdate(id, { etapa: PIPELINE_STAGES[nextIdx].id });
    }
  };

  if (authLoading) return <div className="h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-teal-600" /></div>;
  if (!user) return <LoginScreen onLogin={() => signInWithPopup(auth, googleProvider)} />;

  return (
    <div className="flex h-screen bg-[#f1f5f9] font-sans text-slate-800 overflow-hidden">
      <Sidebar view={view} setView={setView} user={user} onLogout={() => signOut(auth)} />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm z-20">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {view === 'kanban' ? 'Pipeline de Vagas' : 'Banco de Talentos'}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{candidates.length} perfis cadastrados</p>
          </div>
          
          <div className="flex gap-4 items-center">
            <div className="relative group">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Pesquisar candidato..." 
                className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none w-72 transition-all shadow-sm"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-teal-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-teal-700 active:transform active:scale-95 transition-all flex items-center gap-2 shadow-md shadow-teal-600/20">
              <Plus size={18} /> Novo
            </button>
          </div>
        </header>

        {/* Mensagem de Erro */}
        {errorMsg && (
          <div className="bg-red-50 text-red-600 px-6 py-3 text-sm font-medium border-b border-red-100 flex items-center gap-2">
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        {/* Área Principal */}
        <div className="flex-1 overflow-hidden p-6 relative">
          {loadingData && candidates.length === 0 ? (
             <div className="flex h-full flex-col items-center justify-center text-gray-400 gap-3">
               <Loader2 className="animate-spin w-8 h-8 text-teal-600" />
               <p>Sincronizando base de dados...</p>
             </div>
          ) : view === 'kanban' ? (
            <div className="flex h-full gap-5 overflow-x-auto pb-4 items-start px-1">
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
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col animate-in fade-in zoom-in-95 duration-300">
              <div className="overflow-auto flex-1">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-4">Nome</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Cargo</th>
                      <th className="px-6 py-4">Origem</th>
                      <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCandidates.map(c => (
                      <tr key={c.id} onClick={() => setSelectedCandidate(c)} className="hover:bg-teal-50/40 cursor-pointer transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{c.nome}</div>
                          <div className="text-xs text-gray-400">{c.email}</div>
                        </td>
                        <td className="px-6 py-4"><Badge colorClass={`${PIPELINE_STAGES.find(s => s.id === c.etapa)?.color?.replace('border-l-4', 'bg-opacity-10')} bg-gray-100 text-gray-600`}>{c.etapa}</Badge></td>
                        <td className="px-6 py-4 text-gray-600 font-medium">{c.cargo}</td>
                        <td className="px-6 py-4 text-gray-500">{c.cidade}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-teal-600 hover:text-teal-800 font-medium text-xs opacity-0 group-hover:opacity-100 transition-all">Editar</button>
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