import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginAdmin: React.FC = () => {
  const [email, setEmail] = useState('admin@empresa.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password, true);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Credenciais inválidas.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-8 bg-slate-800 rounded-xl shadow-2xl flex flex-col fade-in">
        <i className="ph-bold ph-user-gear text-5xl text-cyan-400 mx-auto mb-4"></i>
        <h2 className="text-2xl font-bold text-center text-white mb-2">Painel Administrativo</h2>
        <p className="text-slate-400 text-center mb-6">Acesso restrito.</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email de Administrador</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Senha</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
          </div>
        </div>
        {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
        <button type="submit" disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg mt-6 transition duration-300">{loading ? 'Entrando...' : 'LOGIN'}</button>
      </form>
    </div>
  );
};

export default LoginAdmin; 