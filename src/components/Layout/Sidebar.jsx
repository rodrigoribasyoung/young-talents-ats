import React from 'react';
import { LayoutDashboard, Users, Settings, LogOut, UserCircle } from 'lucide-react';

export default function Sidebar({ view, setView, user, onLogout }) {
  const menuItems = [
    { id: 'kanban', label: 'Pipeline de Vagas', icon: LayoutDashboard },
    { id: 'list', label: 'Banco de Talentos', icon: Users },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-20 transition-all duration-300">
      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-3 text-white">
          <div className="w-10 h-10 bg-gradient-to-tr from-teal-500 to-emerald-400 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-teal-900/50">
            Y
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none tracking-tight">YOUNG</span>
            <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase mt-1">Recruitment</span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2 mt-4">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">Menu Principal</div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-white transition-colors'} /> 
              {item.label}
              {isActive && <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white"></div>}
            </button>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 mb-4 p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-default">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="User" className="w-9 h-9 rounded-full border-2 border-slate-700" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-slate-400"><UserCircle size={20} /></div>
          )}
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-white truncate">{user?.displayName || 'Usuário'}</span>
            <span className="text-xs text-slate-500 truncate">{user?.email}</span>
          </div>
        </div>
        <button 
          onClick={onLogout} 
          className="w-full flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors uppercase tracking-wide border border-transparent hover:border-red-500/20"
        >
          <LogOut size={16} /> Encerrar Sessão
        </button>
      </div>
    </aside>
  );
}