import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMapaAssentos, reservarAssento } from '../services/api';

interface Assento {
  numero: string;
  ocupado: boolean;
}

const SelecionarAssento: React.FC = () => {
  const navigate = useNavigate();
  const [mapa, setMapa] = useState<Assento[][]>([]);
  const [itinerarioId, setItinerarioId] = useState<number | null>(null);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('itinerarioSelecionado');
    if (stored) {
      const itin = JSON.parse(stored);
      setItinerarioId(itin.id);
      carregarMapa(itin.id);
    }
  }, []);

  const carregarMapa = async (id: number) => {
    setLoading(true);
    setErro('');
    try {
      const data = await getMapaAssentos(id);
      setMapa(data.mapa);
    } catch (e) {
      setErro('Erro ao carregar mapa de assentos.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelecionar = (assento: string, ocupado: boolean) => {
    if (ocupado) return;
    setSelecionado(assento);
  };

  const handleConfirmar = async () => {
    if (!itinerarioId || !selecionado) return;
    setLoading(true);
    setErro('');
    try {
      const res = await reservarAssento(itinerarioId, selecionado);
      if (res.success) {
        localStorage.setItem('assentoSelecionado', selecionado);
        navigate('/confirmacao-compra');
      } else {
        setErro(res.message || 'Erro ao reservar assento.');
        carregarMapa(itinerarioId);
      }
    } catch (e) {
      setErro('Erro ao reservar assento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-2xl mx-auto p-6 md:p-8 bg-slate-800 rounded-xl shadow-2xl flex-col fade-in">
        <h2 className="text-2xl font-bold text-white mb-6">Selecione seu assento</h2>
        {erro && <div className="text-red-400 text-sm mb-4">{erro}</div>}
        {loading ? (
          <div className="text-white">Carregando...</div>
        ) : (
          <div className="overflow-x-auto">
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${mapa[0]?.length || 0}, 2.5rem)` }}>
              {mapa.flat().map((assento, idx) => (
                <button
                  key={assento.numero}
                  className={`w-10 h-10 rounded-md font-bold border-2 text-sm
                    ${assento.ocupado ? 'bg-slate-600 border-slate-700 text-slate-400 cursor-not-allowed' :
                      selecionado === assento.numero ? 'bg-cyan-500 border-cyan-300 text-white' :
                        'bg-slate-700 border-slate-500 text-white hover:bg-cyan-700'}
                  `}
                  disabled={assento.ocupado}
                  onClick={() => handleSelecionar(assento.numero, assento.ocupado)}
                >
                  {assento.numero}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <button
            className="bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50"
            disabled={!selecionado || loading}
            onClick={handleConfirmar}
          >
            Confirmar Assento
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelecionarAssento; 