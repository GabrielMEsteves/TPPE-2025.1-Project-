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
  telefone?: string;
  tipo?: string;
  duracao_viagem?: string;
  preco_viagem?: number;
  tipo_transporte?: string;
  tipo_assento?: string;
}

const MinhasPassagens: React.FC = () => {
  const navigate = useNavigate();
  const [passagens, setPassagens] = useState<Passagem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPassagem, setSelectedPassagem] = useState<Passagem | null>(null);
  const [canceling, setCanceling] = useState<number | null>(null);

  const fetchPassagens = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/v1/passagens/minhas');
      setPassagens(response.data);
    } catch (err) {
      setError('Erro ao buscar passagens.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassagens();
  }, []);

  const handleCancelar = async (id: number) => {
    setCanceling(id);
    try {
      await api.delete(`/api/v1/passagens/${id}`);
      setPassagens(passagens.filter(p => p.id !== id));
    } catch (err) {
      setError('Erro ao cancelar passagem.');
    } finally {
      setCanceling(null);
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

  const formatarTipoTransporte = (tipo?: string) => {
    if (!tipo) return 'N/A';
    return tipo === 'aviao' ? 'Avião' : 'Ônibus';
  };

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
            <div key={p.id} className="bg-slate-700/50 p-4 rounded-lg border border-slate-500 flex flex-col md:flex-row md:items-center md:justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <i className={`ph ${p.tipo_transporte === 'aviao' ? 'ph-airplane' : 'ph-bus'} text-xl text-cyan-400`}></i>
                  <span className="font-bold text-lg text-white">{p.origem || '-'}</span>
                  <i className="ph ph-arrow-right text-lg text-cyan-400 mx-2"></i>
                  <span className="font-bold text-lg text-white">{p.destino || '-'}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-300 text-sm mb-1">
                  <span><i className="ph ph-calendar"></i> {p.data || '-'}</span>
                  <span><i className="ph ph-clock"></i> {p.horario || '-'}</span>
                  <span><i className="ph ph-buildings"></i> {p.empresa || '-'}</span>
                  <span><i className="ph ph-ticket"></i> {formatarTipoAssento(p.tipo_assento)}</span>
                  <span><i className="ph ph-timer"></i> {p.duracao_viagem || '-'}</span>
                  <span><i className="ph ph-currency-circle-dollar"></i> {formatarPreco(p.preco_viagem)}</span>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.status === 'CONFIRMADA' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>{p.status}</span>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0 md:ml-4">
                <button className="flex items-center gap-1 text-sm text-white bg-slate-800 border border-slate-500 rounded px-4 py-2 hover:bg-slate-700" onClick={() => setSelectedPassagem(p)}><i className="ph ph-ticket"></i> Ver Bilhete</button>
                <button className="text-sm text-white bg-red-500 rounded px-4 py-2 hover:bg-red-600" disabled={canceling === p.id} onClick={() => handleCancelar(p.id)}>{canceling === p.id ? 'Cancelando...' : 'Cancelar'}</button>
              </div>
            </div>
          ))}
        </div>
        {!loading && passagens.length === 0 && <div className="text-slate-400 text-center mt-8">Nenhuma passagem encontrada.</div>}
      </div>
      {/* Modal de detalhes da passagem */}
      {selectedPassagem && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
            <button className="absolute top-2 right-2 text-slate-500 hover:text-slate-800" onClick={() => setSelectedPassagem(null)}>&times;</button>
            {/* Preview Destino/Data */}
            <div className="mb-6 p-4 rounded-lg bg-cyan-100 flex flex-col items-center">
              <span className="text-lg font-bold text-cyan-700">{selectedPassagem.destino || '-'}</span>
              <span className="text-md text-slate-700">{selectedPassagem.data || '-'}</span>
            </div>
            <h3 className="text-xl font-bold mb-4 text-cyan-700">Detalhes da Passagem</h3>
            <div className="space-y-2 text-slate-800">
              <div><b>Nome:</b> {selectedPassagem.nome_passageiro}</div>
              <div><b>Telefone:</b> {selectedPassagem.telefone || '-'}</div>
              <div><b>Origem:</b> {selectedPassagem.origem}</div>
              <div><b>Destino:</b> {selectedPassagem.destino || '-'}</div>
              <div><b>Data:</b> {selectedPassagem.data || '-'}</div>
              <div><b>Horário:</b> {selectedPassagem.horario}</div>
              <div><b>Empresa:</b> {selectedPassagem.empresa}</div>
              <div><b>Tipo de Transporte:</b> {formatarTipoTransporte(selectedPassagem.tipo_transporte)}</div>
              <div><b>Tipo de Assento:</b> {formatarTipoAssento(selectedPassagem.tipo_assento)}</div>
              <div><b>Duração:</b> {selectedPassagem.duracao_viagem || '-'}</div>
              <div><b>Preço:</b> {formatarPreco(selectedPassagem.preco_viagem)}</div>
              <div><b>Status:</b> {selectedPassagem.status}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MinhasPassagens; 