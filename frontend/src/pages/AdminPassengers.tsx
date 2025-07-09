import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

interface Passagem {
  id: number;
  nome_passageiro: string;
  cpf: string;
  assento: string;
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const AdminPassengers: React.FC = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const itinerario_id = query.get('itinerario_id');
  const [passageiros, setPassageiros] = useState<Passagem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!itinerario_id) return;
    const fetchPassageiros = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/api/v1/admin/itinerarios/${itinerario_id}/passageiros`);
        setPassageiros(response.data);
      } catch (err) {
        setError('Erro ao buscar passageiros.');
      } finally {
        setLoading(false);
      }
    };
    fetchPassageiros();
  }, [itinerario_id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-3xl mx-auto p-6 md:p-8 bg-slate-800 rounded-xl shadow-2xl flex-col fade-in">
        <div className="w-full flex items-center mb-6">
          <button onClick={() => navigate('/admin/dashboard')} className="text-cyan-400 hover:text-cyan-300 mr-4 p-2 rounded-full hover:bg-slate-700"><i className="ph ph-arrow-left text-2xl"></i></button>
          <h2 className="text-2xl font-bold text-white">Passageiros do Itinerário</h2>
        </div>
        {loading && <div className="text-slate-300">Carregando...</div>}
        {error && <div className="text-red-400 text-sm mb-4">{error}</div>}
        <div className="w-full bg-slate-700/50 rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-700">
              <tr>
                <th className="p-3 text-sm font-semibold text-slate-300">Nome</th>
                <th className="p-3 text-sm font-semibold text-slate-300">CPF</th>
                <th className="p-3 text-sm font-semibold text-slate-300">Assento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {passageiros.map((p) => (
                <tr key={p.id}>
                  <td className="p-3">{p.nome_passageiro}</td>
                  <td className="p-3">{p.cpf}</td>
                  <td className="p-3">{p.assento}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPassengers; 