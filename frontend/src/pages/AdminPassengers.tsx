import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

interface Passagem {
  id: number;
  nome_passageiro: string;
  telefone: string;
  tipo: 'aviao' | 'onibus';
  classe_aviao?: string;
  tipo_poltrona_onibus?: string;
  itinerario_id: number;
  user_id: number;
  origem?: string;
  destino?: string;
  data?: string;
  empresa?: string;
  horario?: string;
  duracao_viagem?: string;
  preco_viagem?: number;
  tipo_transporte?: string;
  tipo_assento?: string;
  status?: string;
}

interface EditarPassagemModalProps {
  passagem: Passagem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (passagem: Passagem) => void;
}

const EditarPassagemModal: React.FC<EditarPassagemModalProps> = ({ passagem, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Passagem>>({});

  useEffect(() => {
    if (passagem) {
      setFormData({
        nome_passageiro: passagem.nome_passageiro,
        telefone: passagem.telefone,
        tipo: passagem.tipo,
        classe_aviao: passagem.classe_aviao,
        tipo_poltrona_onibus: passagem.tipo_poltrona_onibus,
      });
    }
  }, [passagem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passagem) {
      onSave({ ...passagem, ...formData });
    }
  };

  if (!isOpen || !passagem) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold text-white mb-4">Editar Passagem</h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Nome do Passageiro
              </label>
              <input
                type="text"
                value={formData.nome_passageiro || ''}
                onChange={(e) => setFormData({ ...formData, nome_passageiro: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Telefone
              </label>
              <input
                type="text"
                value={formData.telefone || ''}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Tipo de Transporte
              </label>
              <select
                value={formData.tipo || ''}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'aviao' | 'onibus' })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white"
                required
              >
                <option value="aviao">Avião</option>
                <option value="onibus">Ônibus</option>
              </select>
            </div>
            {formData.tipo === 'aviao' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Classe do Avião
                </label>
                <select
                  value={formData.classe_aviao || ''}
                  onChange={(e) => setFormData({ ...formData, classe_aviao: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white"
                >
                  <option value="">Selecione...</option>
                  <option value="ECONOMICA">Econômica</option>
                  <option value="EXECUTIVA">Executiva</option>
                  <option value="PRIMEIRA_CLASSE">Primeira Classe</option>
                </select>
              </div>
            )}
            {formData.tipo === 'onibus' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Tipo de Poltrona
                </label>
                <select
                  value={formData.tipo_poltrona_onibus || ''}
                  onChange={(e) => setFormData({ ...formData, tipo_poltrona_onibus: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white"
                >
                  <option value="">Selecione...</option>
                  <option value="CAMA_LEITO">Cama Leito</option>
                  <option value="SEMI_LEITO">Semi Leito</option>
                  <option value="EXECUTIVA">Executiva</option>
                  <option value="CONVENCIONAL">Convencional</option>
                </select>
              </div>
            )}
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
  const [editingPassagem, setEditingPassagem] = useState<Passagem | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPassageiros = async () => {
      setLoading(true);
      setError('');
      try {
        if (itinerario_id) {
          // Se tem itinerario_id, busca passageiros do itinerário específico
          const response = await api.get(`/api/v1/admin/itinerarios/${itinerario_id}/passageiros`);
          setPassageiros(response.data);
        } else {
          // Se não tem, busca todas as passagens
          const response = await api.get('/api/v1/admin/passagens');
          setPassageiros(response.data);
        }
      } catch (err) {
        setError('Erro ao buscar passageiros.');
      } finally {
        setLoading(false);
      }
    };
    fetchPassageiros();
  }, [itinerario_id]);

  const handleEdit = (passagem: Passagem) => {
    setEditingPassagem(passagem);
    setShowEditModal(true);
  };

  const handleSave = async (passagemAtualizada: Passagem) => {
    try {
      await api.put(`/api/v1/admin/passagens/${passagemAtualizada.id}`, {
        nome_passageiro: passagemAtualizada.nome_passageiro,
        telefone: passagemAtualizada.telefone,
        tipo: passagemAtualizada.tipo,
        classe_aviao: passagemAtualizada.classe_aviao,
        tipo_poltrona_onibus: passagemAtualizada.tipo_poltrona_onibus,
      });
      
      setPassageiros(passageiros.map(p => 
        p.id === passagemAtualizada.id ? passagemAtualizada : p
      ));
      setShowEditModal(false);
      setEditingPassagem(null);
    } catch (err) {
      alert('Erro ao editar passagem.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta passagem?')) return;
    
    try {
      await api.delete(`/api/v1/admin/passagens/${id}`);
      setPassageiros(passageiros.filter(p => p.id !== id));
    } catch (err) {
      alert('Erro ao excluir passagem.');
    }
  };

  const formatarTipoTransporte = (tipo?: string) => {
    if (!tipo) return 'N/A';
    return tipo === 'aviao' ? 'Avião' : 'Ônibus';
  };

  const formatarClasseAssento = (passagem: Passagem) => {
    if (passagem.tipo === 'aviao') {
      const classes = {
        'ECONOMICA': 'Econômica',
        'EXECUTIVA': 'Executiva',
        'PRIMEIRA_CLASSE': 'Primeira Classe'
      };
      return classes[passagem.classe_aviao as keyof typeof classes] || 'N/A';
    } else {
      const poltronas = {
        'CAMA_LEITO': 'Cama Leito',
        'SEMI_LEITO': 'Semi Leito',
        'EXECUTIVA': 'Executiva',
        'CONVENCIONAL': 'Convencional'
      };
      return poltronas[passagem.tipo_poltrona_onibus as keyof typeof poltronas] || 'N/A';
    }
  };

  const filteredPassageiros = passageiros.filter(passagem =>
    passagem.nome_passageiro.toLowerCase().includes(searchTerm.toLowerCase()) ||
    passagem.telefone.includes(searchTerm) ||
    (passagem.origem && passagem.origem.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (passagem.destino && passagem.destino.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-7xl mx-auto p-6 md:p-8 bg-slate-800 rounded-xl shadow-2xl flex-col fade-in">
        <div className="w-full flex items-center mb-6">
          <button onClick={() => navigate('/admin/dashboard')} className="text-cyan-400 hover:text-cyan-300 mr-4 p-2 rounded-full hover:bg-slate-700"><i className="ph ph-arrow-left text-2xl"></i></button>
          <h2 className="text-2xl font-bold text-white">
            {itinerario_id ? 'Passageiros do Itinerário' : 'Todas as Passagens'}
          </h2>
        </div>
        
        <div className="w-full flex justify-between items-center mb-4">
          <input 
            type="text" 
            placeholder="Buscar por nome, telefone, origem, destino..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded-lg p-2 w-1/3 text-white" 
          />
        </div>
        
        {loading && <div className="text-slate-300">Carregando...</div>}
        {error && <div className="text-red-400 text-sm mb-4">{error}</div>}
        
        <div className="w-full bg-slate-700/50 rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-700">
              <tr>
                <th className="p-3 text-sm font-semibold text-slate-300">Nome</th>
                <th className="p-3 text-sm font-semibold text-slate-300">Telefone</th>
                <th className="p-3 text-sm font-semibold text-slate-300">Tipo</th>
                <th className="p-3 text-sm font-semibold text-slate-300">Classe/Poltrona</th>
                <th className="p-3 text-sm font-semibold text-slate-300">Rota</th>
                <th className="p-3 text-sm font-semibold text-slate-300">Data/Hora</th>
                <th className="p-3 text-sm font-semibold text-slate-300">Empresa</th>
                <th className="p-3 text-sm font-semibold text-slate-300">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredPassageiros.map((p) => (
                <tr key={p.id} className="hover:bg-slate-700">
                  <td className="p-3">{p.nome_passageiro}</td>
                  <td className="p-3">{p.telefone}</td>
                  <td className="p-3">{formatarTipoTransporte(p.tipo)}</td>
                  <td className="p-3">{formatarClasseAssento(p)}</td>
                  <td className="p-3">{p.origem} → {p.destino}</td>
                  <td className="p-3">{p.data} {p.horario}</td>
                  <td className="p-3">{p.empresa || 'N/A'}</td>
                  <td className="p-3 space-x-2">
                    <button 
                      onClick={() => handleEdit(p)} 
                      className="text-yellow-400 hover:text-yellow-300 hover:underline"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id)} 
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
        
        {filteredPassageiros.length === 0 && !loading && (
          <div className="text-center text-slate-400 mt-8">
            {searchTerm ? 'Nenhuma passagem encontrada para a busca.' : 'Nenhuma passagem cadastrada.'}
          </div>
        )}
        
        <EditarPassagemModal
          passagem={editingPassagem}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingPassagem(null);
          }}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default AdminPassengers; 