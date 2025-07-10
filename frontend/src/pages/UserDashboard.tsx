import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-md mx-auto p-8 bg-slate-800 rounded-xl shadow-2xl flex flex-col items-center fade-in">
        <i className="ph-bold ph-user text-5xl text-cyan-400 mb-4"></i>
        <h2 className="text-2xl font-bold text-center text-white mb-6">Olá, o que deseja fazer?</h2>
        <button
          onClick={() => navigate('/busca-itinerario')}
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg mb-4 transition duration-300 text-lg"
        >
          Buscar Passagem
        </button>
        <button
          onClick={() => navigate('/minhas-passagens')}
          className="w-full bg-slate-700 hover:bg-slate-600 text-cyan-400 font-bold py-3 px-4 rounded-lg transition duration-300 text-lg border border-cyan-400"
        >
          Minhas Passagens
        </button>
      </div>
    </div>
  );
};

export default UserDashboard; 