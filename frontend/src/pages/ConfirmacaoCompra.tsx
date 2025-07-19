import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ConfirmacaoCompra: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [success, setSuccess] = useState('');

  // Recupera dados do passageiro, assento e itinerário
  const dadosPassageiro = localStorage.getItem('dadosPassageiro');
  const assentoSelecionado = localStorage.getItem('assentoSelecionado');
  const itinerarioSelecionado = localStorage.getItem('itinerarioSelecionado');
  const [nome, setNome] = useState(() => dadosPassageiro ? JSON.parse(dadosPassageiro).nome : '');

  let resumoViagem = '';
  let preco = '';
  if (itinerarioSelecionado) {
    const itin = JSON.parse(itinerarioSelecionado);
    resumoViagem = `${itin.origem} → ${itin.destino}`;
    preco = itin.preco_viagem ? `R$ ${itin.preco_viagem.toFixed(2)}` : '';
  }

  const handlePagar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    setSuccess('');
    try {
      if (!dadosPassageiro || !assentoSelecionado || !user) throw new Error('Dados incompletos');
      const dados = JSON.parse(dadosPassageiro);
      const payload = {
        nome_passageiro: nome,
        telefone: dados.telefone,
        tipo: dados.tipo,
        itinerario_id: dados.itinerario_id,
        user_id: user.id,
        numero_assento: assentoSelecionado,
        // Adicione outros campos opcionais se necessário
      };
      await api.post('/api/v1/passagens/', payload);
      setSuccess('Compra realizada com sucesso!');
      localStorage.removeItem('dadosPassageiro');
      localStorage.removeItem('assentoSelecionado');
      setTimeout(() => navigate('/minhas-passagens'), 1500);
    } catch (err) {
      setErro('Erro ao finalizar compra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form onSubmit={handlePagar} className="w-full max-w-2xl mx-auto p-6 md:p-8 bg-slate-800 rounded-xl shadow-2xl flex-col fade-in">
        <div className="w-full flex items-center mb-6">
          <button type="button" onClick={() => navigate('/compra-passagem')} className="text-cyan-400 hover:text-cyan-300 mr-4 p-2 rounded-full hover:bg-slate-700"><i className="ph ph-arrow-left text-2xl"></i></button>
          <h2 className="text-2xl font-bold text-white">Finalizar Compra</h2>
        </div>
        {/* Resumo */}
        <div className="bg-slate-700/50 p-4 rounded-lg mb-6">
          <h3 className="font-bold text-lg text-white mb-2">Resumo da Viagem</h3>
          <p className="text-slate-300">{resumoViagem}</p>
        </div>
        {/* Identificação */}
        <div className="mb-6">
          <h3 className="font-bold text-lg text-white mb-3">Identificação do Passageiro</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Nome Completo</label>
              <input type="text" value={nome} onChange={e => setNome(e.target.value)} className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-3" />
            </div>
          </div>
        </div>
        {/* Pagamento */}
        <div>
          <h3 className="font-bold text-lg text-white mb-3">Pagamento</h3>
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <p className="text-slate-300">Escolha o método:</p>
            <div className="flex items-center justify-between mt-4">
              <p className="text-2xl font-bold text-white">Total: <span className="text-cyan-400">{preco}</span></p>
              <button type="submit" disabled={loading} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition duration-300">{loading ? 'Processando...' : 'PAGAR'}</button>
            </div>
          </div>
        </div>
        {erro && <div className="text-red-400 text-sm mt-4">{erro}</div>}
        {success && <div className="text-green-400 text-sm mt-4">{success}</div>}
      </form>
    </div>
  );
};

export default ConfirmacaoCompra; 