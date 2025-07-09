import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ConfirmacaoCompra: React.FC = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState('José da Silva');
  const [cpf, setCpf] = useState('123.456.789-00');

  const handlePagar = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode chamar a API para finalizar a compra
    navigate('/minhas-passagens');
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
          <p className="text-slate-300">São Paulo <i className="ph ph-arrow-right align-middle"></i> Rio de Janeiro</p>
          <p className="text-slate-400 text-sm">25/08/2025 - 22:00 | Viação Cometa | Poltrona Executivo</p>
        </div>
        {/* Identificação */}
        <div className="mb-6">
          <h3 className="font-bold text-lg text-white mb-3">Identificação do Passageiro</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Nome Completo</label>
              <input type="text" value={nome} onChange={e => setNome(e.target.value)} className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-3" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Documento (CPF)</label>
              <input type="text" value={cpf} onChange={e => setCpf(e.target.value)} className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-3" />
            </div>
          </div>
        </div>
        {/* Pagamento */}
        <div>
          <h3 className="font-bold text-lg text-white mb-3">Pagamento</h3>
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <p className="text-slate-300">Escolha o método:</p>
            <div className="flex items-center justify-between mt-4">
              <p className="text-2xl font-bold text-white">Total: <span className="text-cyan-400">R$ 99,90</span></p>
              <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition duration-300">PAGAR COM PIX</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ConfirmacaoCompra; 