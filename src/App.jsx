/**
 * ARQUIVO PRINCIPAL DO PROJETO (Vite + React + Firebase)
 * * ESTRUTURA PARA GITHUB:
 * Ao levar para o VSCode/GitHub, você pode manter tudo neste arquivo App.jsx 
 * ou separar os componentes (Login, Kanban, etc) em arquivos na pasta /components.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Search, 
  Filter, 
  Plus, 
  ChevronRight, 
  MoreHorizontal,
  X,
  Save,
  Upload,
  UserCircle,
  CheckCircle2,
  LogOut,
  Loader2
} from 'lucide-react';

// FIREBASE IMPORTS
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  onSnapshot, 
  updateDoc 
} from 'firebase/firestore';

// --- CONFIGURAÇÃO DO FIREBASE ---
// IMPORTANTE: No Vercel, estas variáveis virão do process.env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Fallback visual caso esqueça a configuração
if (!firebaseConfig.apiKey) {
  console.warn("Firebase Config não encontrada. Verifique seu arquivo .env");
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
// Remova a dependência de __app_id e use o ID do projeto ou uma string fixa
const appId = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'young-ats'; 

// --- MOCK DATA (Fallback) ---
const MOCK_CANDIDATES = [
  {
    id: '1',
    nome: 'Ana Silva',
    email: 'ana.silva@email.com',
    telefone: '(11) 99999-9999',
    cidade: 'São Paulo',
    cargo: 'Analista de Marketing',
    etapa: 'Inscrito',
    dataNascimento: '1995-05-20',
    areaInteresse: 'Marketing',
    skills: ['SEO', 'Content', 'Social Media'],
    dataIncricao: new Date().toISOString()
  },
  {
    id: '2',
    nome: 'Carlos Oliveira',
    email: 'carlos.dev@email.com',
    telefone: '(21) 98888-8888',
    cidade: 'Rio de Janeiro',
    cargo: 'Desenvolvedor Full Stack',
    etapa: 'Entrevista I',
    dataNascimento: '1990-10-15',
    areaInteresse: 'Tecnologia',
    skills: ['React', 'Node.js', 'Firebase'],
    dataIncricao: new Date().toISOString()
  },
  {
    id: '3',
    nome: 'Mariana Costa',
    email: 'mari.rh@email.com',
    telefone: '(31) 97777-7777',
    cidade: 'Belo Horizonte',
    cargo: 'Recrutadora',
    etapa: 'Selecionado',
    dataNascimento: '1988-03-30',
    areaInteresse: 'Recursos Humanos',
    skills: ['Gestão de Pessoas', 'Psicologia'],
    dataIncricao: new Date().toISOString()
  }
];

const PIPELINE_STAGES = [
  { id: 'Inscrito', label: 'Inscrito', color: 'bg-gray-100 border-gray-300' },
  { id: 'Considerado', label: 'Considerado', color: 'bg-blue-50 border-blue-200' },
  { id: 'Entrevista I', label: 'Entrevista I', color: 'bg-yellow-50 border-yellow-200' },
  { id: 'Testes realizados', label: 'Testes', color: 'bg-purple-50 border-purple-200' },
  { id: 'Entrevista II', label: 'Entrevista II', color: 'bg-orange-50 border-orange-200' },
  { id: 'Selecionado', label: 'Selecionado', color: 'bg-green-50 border-green-200' }
];

// --- COMPONENTES UI ---

const Badge = ({ children, colorClass }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
    {children}
  </span>
);

const CandidateModal = ({ candidate, isOpen, onClose, onUpdate, stages }) => {
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
        className="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-young-blue focus:border-transparent outline-none"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200 p-6 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-young-blue text-white flex items-center justify-center text-2xl font-bold uppercase">
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
              className={`py-3 px-4 text-sm font-medium border-b-2 capitalize ${activeTab === tab ? 'border-young-blue text-young-blue' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
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
          <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-young-blue rounded-md hover:opacity-90 flex items-center gap-2">
            <Save size={16} /> Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

const KanbanColumn = ({ stage, candidates, onCardClick, onMoveCard }) => {
  return (
    <div className="flex-shrink-0 w-80 flex flex-col h-full bg-gray-50/50 rounded-lg border border-gray-200">
      <div className={`p-3 border-b border-gray-200 flex justify-between items-center bg-white rounded-t-lg border-t-4 ${stage.color.replace('bg-', 'border-').split(' ')[0]}`}>
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
};

const SettingsPage = ({ appId }) => (
  <div className="p-6 max-w-4xl mx-auto">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
      <Settings size={24} /> Configurações
    </h2>
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
      <h3 className="text-lg font-semibold mb-4 text-young-blue">Status do Sistema</h3>
      <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
        <CheckCircle2 size={16} /> Banco de Talentos: Conectado
      </div>
      <p className="text-sm text-gray-500 mt-2">ID do Projeto: {appId}</p>
    </div>
  </div>
);

// --- COMPONENTE DE LOGIN ---
const LoginScreen = ({ onLogin }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute inset-0 z-0 opacity-10">
      <div className="absolute top-0 left-0 w-96 h-96 bg-young-blue rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
    </div>

    <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md z-10 border border-gray-200 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-young-blue to-teal-500 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6 shadow-lg transform -rotate-3">
        Y
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Young ATS</h1>
      <p className="text-gray-500 mb-8">Gestão de Talentos Inteligente</p>

      <button 
        onClick={onLogin}
        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all hover:shadow-md group"
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
        <span className="group-hover:text-gray-900">Entrar com Google Institucional</span>
      </button>

      <p className="mt-8 text-xs text-gray-400">
        Área restrita para colaboradores autorizados.<br/>
        Young Empreendimentos © 2024
      </p>
    </div>
  </div>
);

// --- COMPONENTE PRINCIPAL (APP) ---
export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [view, setView] = useState('kanban'); 
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');

  // 1. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Data Listener (Only runs if user is logged in)
  useEffect(() => {
    if (!user) {
      setCandidates([]); // Clear data on logout
      return;
    }

    setLoadingData(true);
    // Em produção: Usar snapshot real
    /* const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'candidates'));
    const unsub = onSnapshot(q, (snap) => {
       const data = snap.docs.map(d => ({id: d.id, ...d.data()}));
       setCandidates(data);
       setLoadingData(false);
    });
    return () => unsub();
    */

    // Demo Mode: Mock Data
    const timer = setTimeout(() => {
      setCandidates(MOCK_CANDIDATES);
      setLoadingData(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [user]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro ao fazer login. Verifique se o domínio está autorizado no Firebase.");
    }
  };

  const handleLogout = () => signOut(auth);

  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      const matchesSearch = c.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            c.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = filterCity ? c.cidade === filterCity : true;
      return matchesSearch && matchesCity;
    });
  }, [candidates, searchTerm, filterCity]);

  const handleUpdateCandidate = (id, newData) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, ...newData } : c));
  };

  const handleMoveCard = (id, direction) => {
    const candidate = candidates.find(c => c.id === id);
    if (!candidate) return;
    const currentIdx = PIPELINE_STAGES.findIndex(s => s.id === candidate.etapa);
    let nextIdx = currentIdx;
    if (direction === 'next' && currentIdx < PIPELINE_STAGES.length - 1) nextIdx++;
    if (direction === 'prev' && currentIdx > 0) nextIdx--;

    if (nextIdx !== currentIdx) {
      handleUpdateCandidate(id, { etapa: PIPELINE_STAGES[nextIdx].id });
    }
  };

  // --- RENDERING CONDITIONS ---

  if (authLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="animate-spin text-young-blue w-10 h-10" />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={handleGoogleLogin} />;
  }

  // --- DASHBOARD LAYOUT (AUTHENTICATED) ---
  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-800 overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col z-20 shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-2 text-young-blue">
            <div className="w-8 h-8 bg-gradient-to-br from-young-blue to-teal-400 rounded-lg flex items-center justify-center text-white font-bold">Y</div>
            <span className="font-bold text-lg tracking-tight">YOUNG <span className="font-normal text-gray-400 text-xs">ATS</span></span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button onClick={() => setView('kanban')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${view === 'kanban' ? 'bg-blue-50 text-young-blue' : 'text-gray-600 hover:bg-gray-50'}`}>
            <LayoutDashboard size={18} /> Pipeline
          </button>
          <button onClick={() => setView('list')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${view === 'list' ? 'bg-blue-50 text-young-blue' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Users size={18} /> Candidatos
          </button>
          <button onClick={() => setView('settings')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${view === 'settings' ? 'bg-blue-50 text-young-blue' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Settings size={18} /> Configurações
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            {user.photoURL ? (
              <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"><UserCircle size={20} /></div>
            )}
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-gray-700 truncate">{user.displayName}</span>
              <span className="text-xs text-gray-400 truncate">{user.email}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg text-xs font-medium transition-colors">
            <LogOut size={14} /> Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col gap-4 shadow-sm z-10">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">
              {view === 'kanban' ? 'Pipeline de Talentos' : view === 'list' ? 'Lista de Candidatos' : 'Configurações'}
            </h1>
            <div className="flex gap-2">
              <button className="bg-young-blue text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 flex items-center gap-2 shadow-sm shadow-blue-200">
                <Plus size={16} /> Novo
              </button>
            </div>
          </div>

          {view !== 'settings' && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-young-blue/20 focus:border-young-blue transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
                <Filter size={16} className="text-gray-400" />
                <select 
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none"
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                >
                  <option value="">Cidades</option>
                  <option value="São Paulo">São Paulo</option>
                  <option value="Rio de Janeiro">Rio de Janeiro</option>
                </select>
              </div>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-hidden relative bg-gray-100 p-6">
          {loadingData ? (
             <div className="flex items-center justify-center h-full text-gray-400 gap-2">
               <Loader2 className="animate-spin" /> Carregando candidatos...
             </div>
          ) : (
            <>
              {view === 'kanban' && (
                <div className="flex h-full gap-4 overflow-x-auto pb-4">
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
              )}

              {view === 'list' && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
                  <div className="overflow-y-auto flex-1">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200 sticky top-0">
                        <tr>
                          <th className="px-6 py-3">Nome</th>
                          <th className="px-6 py-3">Etapa</th>
                          <th className="px-6 py-3">Cargo</th>
                          <th className="px-6 py-3">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredCandidates.map(candidate => (
                          <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900">{candidate.nome}</td>
                            <td className="px-6 py-4"><Badge colorClass={PIPELINE_STAGES.find(s => s.id === candidate.etapa)?.color}>{candidate.etapa}</Badge></td>
                            <td className="px-6 py-4 text-gray-600">{candidate.cargo}</td>
                            <td className="px-6 py-4">
                              <button onClick={() => setSelectedCandidate(candidate)} className="text-young-blue hover:text-teal-800 font-medium text-xs">Ver</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {view === 'settings' && <SettingsPage appId={appId} />}
            </>
          )}
        </div>
      </main>

      <CandidateModal 
        candidate={selectedCandidate} 
        isOpen={!!selectedCandidate} 
        onClose={() => setSelectedCandidate(null)}
        onUpdate={handleUpdateCandidate}
        stages={PIPELINE_STAGES}
      />

      <style>{`
        .text-young-blue { color: #0f766e; }
        .bg-young-blue { background-color: #0f766e; }
        .border-young-blue { border-color: #0f766e; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
}