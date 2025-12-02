import React from 'react';

export default function LoginScreen({ onLogin }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md z-10 border border-gray-100 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-teal-400 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6 shadow-md transform -rotate-3">
          Y
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Young ATS</h1>
        <p className="text-gray-500 mb-8">Acesse o sistema de gestão de talentos</p>

        <button 
          onClick={onLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all hover:shadow-md"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
          <span>Entrar com Google</span>
        </button>
      </div>
    </div>
  );
}