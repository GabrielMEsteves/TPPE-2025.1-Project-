import React, { useState } from 'react';
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

const BuscaItinerario: React.FC = () => {
  const [origem, setOrigem] = useState('São Paulo, SP');
  const [destino, setDestino] = useState('Rio de Janeiro, RJ');
  const [data, setData] = useState('2025-08-25');
  const [itinerarios, setItinerarios] = useState<Itinerario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/v1/itinerarios/buscar', {
        params: { origem, destino, data },
      });
      setItinerarios(response.data);
    } catch (err) {
      setError('Erro ao buscar itinerários.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelecionar = (itinerario: Itinerario) => {
    // Salvar o itinerário selecionado no localStorage ou contexto
    localStorage.setItem('itinerarioSelecionado', JSON.stringify(itinerario));
    navigate('/compra-passagem');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form onSubmit={handleBuscar} className="w-full max-w-2xl mx-auto p-8 bg-slate-800 rounded-xl shadow-2xl flex-col fade-in">
        <div className="w-full flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Para onde vamos hoje?</h2>
          <div className="flex space-x-4">
            <button type="button" onClick={() => navigate('/minhas-passagens')} className="text-slate-300 hover:text-cyan-400 transition"><i className="ph-bold ph-ticket text-2xl"></i></button>
            <button type="button" onClick={() => navigate('/login')} className="text-slate-300 hover:text-cyan-400 transition"><i className="ph-bold ph-sign-out text-2xl"></i></button>
          </div>
        </div>
        <div className="bg-slate-700/50 p-6 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Origem</label>
              <input type="text" value={origem} onChange={e => setOrigem(e.target.value)} className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
            </div>
            <div className="flex justify-center">
              <button type="button" className="p-2 bg-slate-600 rounded-full text-cyan-400 hover:bg-slate-500 transition mt-4"><i className="ph-bold ph-arrows-left-right text-xl"></i></button>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Destino</label>
              <input type="text" value={destino} onChange={e => setDestino(e.target.value)} className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Data da Ida</label>
            <input type="date" value={data} onChange={e => setData(e.target.value)} className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
          </div>
        </div>
        <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg mt-6 transition duration-300">{loading ? 'Buscando...' : 'BUSCAR PASSAGENS'}</button>
        {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
      </form>
      {/* Resultados */}
      {itinerarios.length > 0 && (
        <div className="w-full max-w-2xl mx-auto mt-8 space-y-4">
          {itinerarios.map((itin) => (
            <div key={itin.id} className="bg-slate-700/50 p-4 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4 transition hover:bg-slate-700">
              <div className="flex items-center gap-4">
                <i className="ph-bold ph-bus text-3xl text-cyan-400"></i>
                <div>
                  <p className="font-bold text-white">{itin.empresa}</p>
                  <span className="text-sm bg-green-900 text-green-300 px-2 py-1 rounded-md">{itin.origem} → {itin.destino}</span>
                </div>
              </div>
              <div className="text-center">
                <p className="font-mono text-lg text-white">{itin.horario}</p>
                <p className="text-sm text-slate-400">Data: {itin.data}</p>
              </div>
              <div className="text-center md:text-right">
                <button onClick={() => handleSelecionar(itin)} className="bg-cyan-600 text-white text-sm font-bold py-2 px-4 rounded-lg mt-2 hover:bg-cyan-500">SELECIONAR</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuscaItinerario; 