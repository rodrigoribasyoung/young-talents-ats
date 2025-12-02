import React from 'react';

export default function LoginScreen({ onLogin }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] relative overflow-hidden font-sans">
      {/* Efeito de Fundo (Blob) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-200/30 blur-[100px]"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-200/30 blur-[100px]"></div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl shadow-slate-200/50 w-full max-w-sm z-10 border border-white">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-tr from-brand-600 to-brand-400 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 shadow-lg shadow-brand-500/30">
            Y
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Bem-vindo de volta</h1>
          <p className="text-slate-500 text-sm">Acesse o Young ATS para gerenciar suas vagas.</p>
        </div>

        <button 
          onClick={onLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-3.5 px-4 rounded-xl transition-all duration-200 group shadow-sm"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="Google" />
          <span>Entrar com Google</span>
        </button>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Young Talents System</p>
        </div>
      </div>
    </div>
  );
}