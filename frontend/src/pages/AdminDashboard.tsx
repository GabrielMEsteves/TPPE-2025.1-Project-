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
  duracao_viagem?: string;
  preco_viagem?: number;
  tipo_transporte?: 'aviao' | 'onibus';
  tipo_assento?: string;
}

interface EditarItinerarioModalProps {
  itinerario: Itinerario | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (itinerario: Itinerario) => void;
}

const EditarItinerarioModal: React.FC<EditarItinerarioModalProps> = ({ itinerario, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Itinerario>>({});

  useEffect(() => {
    if (itinerario) {
      setFormData({
        origem: itinerario.origem,
        destino: itinerario.destino,
        data: itinerario.data,
        empresa: itinerario.empresa,
        horario: itinerario.horario,
        duracao_viagem: itinerario.duracao_viagem,
        preco_viagem: itinerario.preco_viagem,
        tipo_transporte: itinerario.tipo_transporte,
        tipo_assento: itinerario.tipo_assento,
      });
    }
  }, [itinerario]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (itinerario) {
      onSave({ ...itinerario, ...formData });
    }
  };

  if (!isOpen || !itinerario) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-white mb-4">Editar Itinerário</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Origem
              </label>
              <input
                type="text"
                value={formData.origem || ''}
                onChange={(e) => setFormData({ ...formData, origem: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Destino
              </label>
              <input
                type="text"
                value={formData.destino || ''}
                onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Data
              </label>
              <input
                type="date"
                value={formData.data || ''}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Horário
              </label>
              <input
                type="time"
                value={formData.horario || ''}
                onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Empresa
              </label>
              <input
                type="text"
                value={formData.empresa || ''}
                onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Duração da Viagem
              </label>
              <input
                type="text"
                value={formData.duracao_viagem || ''}
                onChange={(e) => setFormData({ ...formData, duracao_viagem: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white"
                placeholder="Ex: 2h 30min"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Preço da Viagem
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.preco_viagem || ''}
                onChange={(e) => setFormData({ ...formData, preco_viagem: parseFloat(e.target.value) })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Tipo de Transporte
              </label>
              <select
                value={formData.tipo_transporte || ''}
                onChange={(e) => setFormData({ ...formData, tipo_transporte: e.target.value as 'aviao' | 'onibus' })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white"
                required
              >
                <option value="aviao">Avião</option>
                <option value="onibus">Ônibus</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Tipo de Assento
              </label>
              <select
                value={formData.tipo_assento || ''}
                onChange={(e) => setFormData({ ...formData, tipo_assento: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white"
                required
              >
                <option value="">Selecione...</option>
                <option value="economica">Econômica</option>
                <option value="executiva">Executiva</option>
                <option value="primeira_classe">Primeira Classe</option>
                <option value="cama_leito">Cama Leito</option>
                <option value="semi_leito">Semi Leito</option>
                <option value="convencional">Convencional</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:text-white transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [itinerarios, setItinerarios] = useState<Itinerario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingItinerario, setEditingItinerario] = useState<Itinerario | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Novo estado para busca

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

  const handleEdit = (itinerario: Itinerario) => {
    setEditingItinerario(itinerario);
    setShowEditModal(true);
  };

  const handleSave = async (itinerarioAtualizado: Itinerario) => {
    try {
      await api.put(`/api/v1/admin/itinerarios/${itinerarioAtualizado.id}`, {
        origem: itinerarioAtualizado.origem,
        destino: itinerarioAtualizado.destino,
        data: itinerarioAtualizado.data,
        empresa: itinerarioAtualizado.empresa,
        horario: itinerarioAtualizado.horario,
        duracao_viagem: itinerarioAtualizado.duracao_viagem,
        preco_viagem: itinerarioAtualizado.preco_viagem,
        tipo_transporte: itinerarioAtualizado.tipo_transporte,
        tipo_assento: itinerarioAtualizado.tipo_assento,
      });
      
      setItinerarios(itinerarios.map(i => 
        i.id === itinerarioAtualizado.id ? itinerarioAtualizado : i
      ));
      setShowEditModal(false);
      setEditingItinerario(null);
    } catch (err) {
      alert('Erro ao editar itinerário.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este itinerário? Esta ação não pode ser desfeita.')) return;
    try {
      await api.delete(`/api/v1/admin/itinerarios/${id}`);
      setItinerarios(itinerarios.filter(i => i.id !== id));
    } catch {
      alert('Erro ao excluir itinerário.');
    }
  };

  const formatarPreco = (preco?: number) => {
    if (!preco) return 'N/A';
    return `R$ ${preco.toFixed(2)}`;
  };

  const formatarTipoTransporte = (tipo?: string) => {
    if (!tipo) return 'N/A';
    return tipo === 'aviao' ? 'Avião' : 'Ônibus';
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-7xl mx-auto p-6 md:p-8 bg-slate-800 rounded-xl shadow-2xl flex-col fade-in">
        <div className="w-full flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Gerenciar Itinerários</h2>
          <div>
            <button onClick={() => navigate('/admin/login')} className="text-slate-300 hover:text-cyan-400 transition"><i className="ph-bold ph-sign-out text-2xl"></i></button>
          </div>
        </div>
        <div className="w-full flex justify-between items-center mb-4">
          <input 
            type="text" 
            placeholder="Buscar por origem, destino, empresa, data..." 
            className="bg-slate-700 border border-slate-600 rounded-lg p-2 w-1/3"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <div className="space-x-3">
            <button onClick={() => navigate('/admin/passengers')} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
              <i className="ph ph-users align-middle mr-1"></i> Gerenciar Passagens
            </button>
            <button onClick={() => navigate('/admin/create')} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
              <i className="ph ph-plus align-middle mr-1"></i> Cadastrar Novo
            </button>
          </div>
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
                <th className="p-3 text-sm font-semibold text-slate-300">Duração</th>
                <th className="p-3 text-sm font-semibold text-slate-300">Preço</th>
                <th className="p-3 text-sm font-semibold text-slate-300">Transporte</th>
                <th className="p-3 text-sm font-semibold text-slate-300">Assento</th>
                <th className="p-3 text-sm font-semibold text-slate-300">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {(itinerarios.filter((itin) => {
                const term = searchTerm.toLowerCase();
                return (
                  itin.origem.toLowerCase().includes(term) ||
                  itin.destino.toLowerCase().includes(term) ||
                  (itin.empresa && itin.empresa.toLowerCase().includes(term)) ||
                  (itin.data && itin.data.toLowerCase().includes(term))
                );
              })).map((itin) => (
                <tr key={itin.id} className="hover:bg-slate-700">
                  <td className="p-3">{itin.origem} → {itin.destino}</td>
                  <td className="p-3">{itin.data} {itin.horario}</td>
                  <td className="p-3">{itin.empresa}</td>
                  <td className="p-3">{itin.duracao_viagem || 'N/A'}</td>
                  <td className="p-3">{formatarPreco(itin.preco_viagem)}</td>
                  <td className="p-3">{formatarTipoTransporte(itin.tipo_transporte)}</td>
                  <td className="p-3">{formatarTipoAssento(itin.tipo_assento)}</td>
                  <td className="p-3 space-x-2">
                    <button onClick={() => navigate(`/admin/passengers?itinerario_id=${itin.id}`)} className="text-blue-400 hover:underline">Passageiros</button>
                    <button 
                      onClick={() => handleEdit(itin)} 
                      className="text-yellow-400 hover:text-yellow-300 hover:underline"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(itin.id)} 
                      className="text-red-400 hover:text-red-300 hover:underline"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <EditarItinerarioModal
          itinerario={editingItinerario}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingItinerario(null);
          }}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default AdminDashboard; 