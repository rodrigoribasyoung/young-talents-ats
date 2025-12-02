import React from 'react';
import { LayoutDashboard, Users, Settings, LogOut, UserCircle } from 'lucide-react';

export default function Sidebar({ view, setView, user, onLogout }) {
  const menuItems = [
    { id: 'kanban', label: 'Pipeline', icon: LayoutDashboard },
    { id: 'list', label: 'Candidatos', icon: Users },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-20">
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="flex items-center gap-2 text-teal-700">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-teal-400 rounded-lg flex items-center justify-center text-white font-bold">Y</div>
          <span className="font-bold text-lg tracking-tight">YOUNG <span className="font-normal text-gray-400 text-xs">ATS</span></span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={18} /> {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"><UserCircle size={20} /></div>
          )}
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-gray-700 truncate">{user?.displayName}</span>
            <span className="text-xs text-gray-400 truncate">{user?.email}</span>
          </div>
        </div>
        <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg text-xs font-medium transition-colors">
          <LogOut size={14} /> Sair
        </button>
      </div>
    </aside>
  );
}