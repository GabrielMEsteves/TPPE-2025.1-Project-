import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CadastroUsuario: React.FC = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/api/v1/usuarios/', {
        name: nome,
        email,
        password: senha,
      });
      setSuccess('Cadastro realizado com sucesso!');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError('Erro ao cadastrar usuário.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-8 bg-slate-800 rounded-xl shadow-2xl flex flex-col fade-in">
        <h2 className="text-2xl font-bold text-center text-white mb-2">Criar Conta</h2>
        <p className="text-slate-400 text-center mb-6">Preencha os dados para se cadastrar.</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Nome Completo</label>
            <input type="text" value={nome} onChange={e => setNome(e.target.value)} className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-3" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-3" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Senha</label>
            <input type="password" value={senha} onChange={e => setSenha(e.target.value)} className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-3" required />
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg mt-6 transition duration-300">{loading ? 'Cadastrando...' : 'Cadastrar'}</button>
        {error && <div className="text-red-400 text-sm mt-4">{error}</div>}
        {success && <div className="text-green-400 text-sm mt-4">{success}</div>}
        <p className="text-center text-sm text-slate-400 mt-4">Já tem uma conta? <a href="/login" className="font-semibold text-cyan-400 hover:underline">Entrar</a></p>
      </form>
    </div>
  );
};

export default CadastroUsuario; 