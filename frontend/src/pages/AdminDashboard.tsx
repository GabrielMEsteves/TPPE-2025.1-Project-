import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Itinerario {
  id: number;
  origem: string;
  destino: string;
  data: string;
  empresa: string;
  horario: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [itinerarios, setItinerarios] = useState<Itinerario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItinerarios = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/api/v1/admin/itinerarios');
        setItinerarios(response.data);
      } catch (err) {
        setError('Erro ao buscar itinerários.');
      } finally {
        setLoading(false);
      }
    };
    fetchItinerarios();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este itinerário?')) return;
    try {
      await api.delete(`/itinerarios/${id}`);
      setItinerarios(itinerarios.filter(i => i.id !== id));
    } catch {
      alert('Erro ao excluir itinerário.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-5xl mx-auto p-6 md:p-8 bg-slate-800 rounded-xl shadow-2xl flex-col fade-in">
        <div className="w-full flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Gerenciar Itinerários</h2>
          <div>
            <button onClick={() => navigate('/admin/login')} className="text-slate-300 hover:text-cyan-400 transition"><i className="ph-bold ph-sign-out text-2xl"></i></button>
          </div>
        </div>
        <div className="w-full flex justify-between items-center mb-4">
          <input type="text" placeholder="Buscar por origem, destino..." className="bg-slate-700 border border-slate-600 rounded-lg p-2 w-1/3" />
          <button onClick={() => navigate('/admin/create')} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300"><i className="ph ph-plus align-middle mr-1"></i> Cadastrar Novo</button>
        </div>
        {loading && <div className="text-slate-300">Carregando...</div>}
        {error && <div className="text-red-400 text-sm mb-4">{error}</div>}
        <div className="w-full bg-slate-700/50 rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-700">
              <tr>
                <th className="p-3 text-sm font-semibold text-slate-300">Rota</th>
                <th className="p-3 text-sm font-semibold text-slate-300">Data/Hora</th>
                <th className="p-3 text-sm font-semibold text-slate-300">Empresa</th>
                <th className="p-3 text-sm font-semibold text-slate-300">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {itinerarios.map((itin) => (
                <tr key={itin.id} className="hover:bg-slate-700">
                  <td className="p-3">{itin.origem} → {itin.destino}</td>
                  <td className="p-3">{itin.data} {itin.horario}</td>
                  <td className="p-3">{itin.empresa}</td>
                  <td className="p-3 space-x-2">
                    <button onClick={() => navigate(`/admin/passengers?itinerario_id=${itin.id}`)} className="text-blue-400 hover:underline">Passageiros</button>
                    <button className="text-yellow-400 hover:underline">Editar</button>
                    <button onClick={() => handleDelete(itin.id)} className="text-red-400 hover:underline">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 