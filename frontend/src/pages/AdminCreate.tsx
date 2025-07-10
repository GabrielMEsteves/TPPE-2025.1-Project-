import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminCreate: React.FC = () => {
  const navigate = useNavigate();
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/api/v1/admin/itinerarios', {
        origem,
        destino,
        data,
        horario,
        empresa,
        admin_id: user?.id,
      });
      setSuccess('Itinerário cadastrado com sucesso!');
      setTimeout(() => navigate('/admin/dashboard'), 1200);
    } catch (err) {
      setError('Erro ao cadastrar itinerário.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto p-8 bg-slate-800 rounded-xl shadow-2xl flex flex-col fade-in">
        <h2 className="text-2xl font-bold text-white mb-6">Cadastrar Novo Itinerário</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Origem</label>
            <input type="text" value={origem} onChange={e => setOrigem(e.target.value)} className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Destino</label>
            <input type="text" value={destino} onChange={e => setDestino(e.target.value)} className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Data</label>
            <input type="date" value={data} onChange={e => setData(e.target.value)} className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Horário</label>
            <input type="time" value={horario} onChange={e => setHorario(e.target.value)} className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Empresa</label>
            <input type="text" value={empresa} onChange={e => setEmpresa(e.target.value)} className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-3" />
          </div>
        </div>
        <div className="flex justify-end mt-6 space-x-4">
          <button type="button" onClick={() => navigate('/admin/dashboard')} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-lg transition duration-300">Cancelar</button>
          <button type="submit" disabled={loading} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg transition duration-300">{loading ? 'Cadastrando...' : 'Cadastrar'}</button>
        </div>
        {error && <div className="text-red-400 text-sm mt-4">{error}</div>}
        {success && <div className="text-green-400 text-sm mt-4">{success}</div>}
      </form>
    </div>
  );
};

export default AdminCreate; 