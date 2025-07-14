import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Itinerario {
  id: number;
  origem: string;
  destino: string;
  data: string;
  empresa: string;
  horario: string;
  duracao_viagem?: string;
  preco_viagem?: number;
  tipo_transporte?: 'aviao' | 'onibus';
  tipo_assento?: string;
}

const CompraPassagem: React.FC = () => {
  const navigate = useNavigate();
  const [itinerario, setItinerario] = useState<Itinerario | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [tipo, setTipo] = useState('onibus');

  useEffect(() => {
    const stored = localStorage.getItem('itinerarioSelecionado');
    if (stored) {
      setItinerario(JSON.parse(stored));
    }
  }, []);

  const handleComprar = async () => {
    if (!itinerario || !user) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        nome_passageiro: nome,
        telefone,
        tipo,
        itinerario_id: itinerario.id,
        user_id: user.id,
      };
      await api.post('/api/v1/passagens/', payload);
      setSuccess('Passagem comprada com sucesso!');
      localStorage.removeItem('itinerarioSelecionado');
      setTimeout(() => navigate('/minhas-passagens'), 1500);
    } catch (err) {
      setError('Erro ao comprar passagem.');
    } finally {
      setLoading(false);
    }
  };

  const formatarPreco = (preco?: number) => {
    if (!preco) return 'N/A';
    return `R$ ${preco.toFixed(2)}`;
  };

  const formatarTipoAssento = (assento?: string) => {
    if (!assento) return 'N/A';
    const assentos: { [key: string]: string } = {
      'economica': 'Econômica',
      'executiva': 'Executiva',
      'primeira_classe': 'Primeira Classe',
      'cama_leito': 'Cama Leito',
      'semi_leito': 'Semi Leito',
      'convencional': 'Convencional'
    };
    return assentos[assento] || assento;
  };

  if (!itinerario) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center">Nenhum itinerário selecionado. <button className="text-cyan-400 underline" onClick={() => navigate('/busca-itinerario')}>Buscar itinerários</button></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-3xl mx-auto p-6 md:p-8 bg-slate-800 rounded-xl shadow-2xl flex-col fade-in">
        <div className="w-full flex items-center mb-6">
          <button onClick={() => navigate('/busca-itinerario')} className="text-cyan-400 hover:text-cyan-300 mr-4 p-2 rounded-full hover:bg-slate-700"><i className="ph ph-arrow-left text-2xl"></i></button>
          <div>
            <h2 className="text-2xl font-bold text-white">{itinerario.origem} <i className="ph ph-arrow-right align-middle"></i> {itinerario.destino}</h2>
            <p className="text-slate-400">{itinerario.data} - {itinerario.horario}</p>
          </div>
        </div>
        <div className="flex space-x-2 mb-6">
          <button className="bg-cyan-600 text-white px-4 py-2 rounded-full text-sm font-semibold">Mais Rápido</button>
          <button className="bg-slate-700 text-slate-300 hover:bg-slate-600 px-4 py-2 rounded-full text-sm font-semibold">Menor Preço</button>
        </div>
        <div className="space-y-4 w-full">
          {/* Inputs para nome, telefone e tipo */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input type="text" placeholder="Nome do passageiro" value={nome} onChange={e => setNome(e.target.value)} className="bg-slate-700 border border-slate-600 text-white rounded-lg p-3 w-full" />
            <input type="text" placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} className="bg-slate-700 border border-slate-600 text-white rounded-lg p-3 w-full" />
            <select value={tipo} onChange={e => setTipo(e.target.value)} className="bg-slate-700 border border-slate-600 text-white rounded-lg p-3 w-full">
              <option value="onibus">Ônibus</option>
              <option value="aviao">Avião</option>
            </select>
          </div>
          <div className="bg-slate-700/50 p-4 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4 transition hover:bg-slate-700">
            <div className="flex items-center gap-4">
              <i className={`ph-bold ${itinerario.tipo_transporte === 'aviao' ? 'ph-airplane' : 'ph-bus'} text-3xl text-cyan-400`}></i>
              <div>
                <p className="font-bold text-white">{itinerario.empresa}</p>
                <span className="text-sm bg-green-900 text-green-300 px-2 py-1 rounded-md">{formatarTipoAssento(itinerario.tipo_assento)}</span>
              </div>
            </div>
            <div className="text-center">
              <p className="font-mono text-lg text-white">{itinerario.horario}</p>
              <p className="text-sm text-slate-400">Duração: {itinerario.duracao_viagem || 'N/A'}</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-xl font-bold text-cyan-400">{formatarPreco(itinerario.preco_viagem)}</p>
              <button onClick={handleComprar} disabled={loading} className="bg-cyan-600 text-white text-sm font-bold py-2 px-4 rounded-lg mt-2 hover:bg-cyan-500">{loading ? 'Comprando...' : 'COMPRAR'}</button>
            </div>
          </div>
        </div>
        {error && <div className="text-red-400 text-sm mt-4">{error}</div>}
        {success && <div className="text-green-400 text-sm mt-4">{success}</div>}
      </div>
    </div>
  );
};

export default CompraPassagem; 