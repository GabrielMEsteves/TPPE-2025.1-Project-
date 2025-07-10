import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginUser: React.FC = () => {
  const [email, setEmail] = useState('usuario@email.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Credenciais inválidas.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-8 bg-slate-800 rounded-xl shadow-2xl flex flex-col fade-in">
        <i className="ph-bold ph-bus text-5xl text-cyan-400 mx-auto mb-4"></i>
        <h2 className="text-2xl font-bold text-center text-white mb-2">Bem-vindo de volta!</h2>
        <p className="text-slate-400 text-center mb-6">Acesse sua conta para continuar.</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email ou CPF</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Senha</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
            <a href="#" className="text-sm text-cyan-400 hover:underline mt-2 block text-right">Esqueci minha senha</a>
          </div>
        </div>
        {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
        <button type="submit" disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg mt-6 transition duration-300">{loading ? 'Entrando...' : 'ENTRAR'}</button>
        <p className="text-center text-sm text-slate-400 mt-4">Não tem uma conta? <span onClick={() => navigate('/cadastro')} className="font-semibold text-cyan-400 hover:underline cursor-pointer">Cadastre-se</span></p>
      </form>
    </div>
  );
};

export default LoginUser; 