import React from 'react';
import { LayoutDashboard, Users, Settings, LogOut, UserCircle } from 'lucide-react';

export default function Sidebar({ view, setView, user, onLogout }) {
  const menuItems = [
    { id: 'kanban', label: 'Pipeline', icon: LayoutDashboard },
    { id: 'list', label: 'Candidatos', icon: Users },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-30 transition-all duration-300">
      <div className="h-16 flex items-center px-6 border-b border-slate-800/50">
        <div className="flex items-center gap-3 text-white">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-400 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-teal-900/50">Y</div>
          <span className="font-bold text-lg tracking-tight">YOUNG <span className="font-normal text-slate-500 text-xs">ATS</span></span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-2">
        <div className="px-2 text-[10px] uppercase tracking-wider font-bold text-slate-600 mb-2">Principal</div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-teal-600/10 text-teal-400 border border-teal-600/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-teal-400' : 'text-slate-500 group-hover:text-white transition-colors'} /> 
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 mb-4 p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-default">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border border-slate-600" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-400"><UserCircle size={20} /></div>
          )}
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-white truncate">{user?.displayName}</span>
            <span className="text-xs text-slate-500 truncate">{user?.email}</span>
          </div>
        </div>
        <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 px-3 py-2 rounded-lg text-xs font-semibold transition-colors uppercase tracking-wide border border-transparent hover:border-red-500/20">
          <LogOut size={14} /> Sair
        </button>
      </div>
    </aside>
  );
}