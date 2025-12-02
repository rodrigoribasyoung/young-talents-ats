import React from 'react';
import { LayoutDashboard, Users, Settings, LogOut, UserCircle } from 'lucide-react';

export default function Sidebar({ view, setView, user, onLogout }) {
  const menuItems = [
    { id: 'kanban', label: 'Pipeline', icon: LayoutDashboard },
    { id: 'list', label: 'Candidatos', icon: Users },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full shadow-xl z-30">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-3 text-white">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center font-bold">Y</div>
          <span className="font-bold text-lg">Young ATS</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/50' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} /> {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4 px-2">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border border-slate-600" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center"><UserCircle size={20} /></div>
          )}
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-white truncate">{user?.displayName}</span>
            <span className="text-xs text-slate-500 truncate">{user?.email}</span>
          </div>
        </div>
        <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 text-red-400 hover:bg-red-900/20 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors">
          <LogOut size={16} /> Sair
        </button>
      </div>
    </aside>
  );
}