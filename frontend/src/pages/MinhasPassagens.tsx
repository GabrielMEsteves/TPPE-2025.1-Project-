import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Passagem {
  id: number;
  itinerario_id: number;
  nome_passageiro: string;
  origem: string;
  destino: string;
  data: string;
  horario: string;
  empresa: string;
  status: string;
}

const MinhasPassagens: React.FC = () => {
  const navigate = useNavigate();
  const [passagens, setPassagens] = useState<Passagem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPassagens = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/passagens/minhas');
        setPassagens(response.data);
      } catch (err) {
        setError('Erro ao buscar passagens.');
      } finally {
        setLoading(false);
      }
    };
    fetchPassagens();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-3xl mx-auto p-6 md:p-8 bg-slate-800 rounded-xl shadow-2xl flex-col fade-in">
        <div className="w-full flex items-center mb-6">
          <button onClick={() => navigate('/busca-itinerario')} className="text-cyan-400 hover:text-cyan-300 mr-4 p-2 rounded-full hover:bg-slate-700"><i className="ph ph-arrow-left text-2xl"></i></button>
          <h2 className="text-2xl font-bold text-white">Minhas Passagens</h2>
        </div>
        <div className="flex space-x-2 mb-6 border-b border-slate-700">
          <button className="text-cyan-400 border-b-2 border-cyan-400 px-4 py-2 font-semibold">Próximas Viagens</button>
          <button className="text-slate-400 hover:text-white px-4 py-2 font-semibold">Viagens Anteriores</button>
        </div>
        {loading && <div className="text-slate-300">Carregando...</div>}
        {error && <div className="text-red-400 text-sm mb-4">{error}</div>}
        {/* Card de Passagem */}
        <div className="space-y-4 w-full">
          {passagens.map((p) => (
            <div key={p.id} className="bg-slate-700/50 p-4 rounded-lg border-l-4 border-cyan-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg text-white">{p.origem} <i className="ph ph-arrow-right align-middle"></i> {p.destino}</p>
                  <p className="text-sm text-slate-400">{p.data} - {p.horario}</p>
                  <span className="text-xs font-bold text-green-400 bg-green-900/50 px-2 py-0.5 rounded-full mt-2 inline-block">{p.status || 'CONFIRMADA'}</span>
                </div>
                <div className="text-right flex items-center flex-wrap">
                  <button className="text-sm text-cyan-400 hover:underline">Ver Bilhete</button>
                  <button className="text-sm text-red-400 hover:underline ml-4">Cancelar</button>
                  <button className="text-sm text-purple-400 hover:underline ml-4"><i className="ph ph-sparkle align-middle"></i> Roteiro IA</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {!loading && passagens.length === 0 && <div className="text-slate-400 text-center mt-8">Nenhuma passagem encontrada.</div>}
      </div>
    </div>
  );
};

export default MinhasPassagens; 