import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import LoginUser from './pages/LoginUser';
import LoginAdmin from './pages/LoginAdmin';
import BuscaItinerario from './pages/BuscaItinerario';
import CompraPassagem from './pages/CompraPassagem';
import ConfirmacaoCompra from './pages/ConfirmacaoCompra';
import MinhasPassagens from './pages/MinhasPassagens';
import AdminDashboard from './pages/AdminDashboard';
import AdminCreate from './pages/AdminCreate';
import AdminPassengers from './pages/AdminPassengers';
import CadastroUsuario from './pages/CadastroUsuario';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import UserDashboard from './pages/UserDashboard';
import SelecionarAssento from './pages/SelecionarAssento';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginUser />} />
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route path="/busca-itinerario" element={<ProtectedRoute><BuscaItinerario /></ProtectedRoute>} />
          <Route path="/compra-passagem" element={<ProtectedRoute><CompraPassagem /></ProtectedRoute>} />
          <Route path="/confirmacao-compra" element={<ProtectedRoute><ConfirmacaoCompra /></ProtectedRoute>} />
          <Route path="/minhas-passagens" element={<ProtectedRoute><MinhasPassagens /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/create" element={<ProtectedRoute adminOnly><AdminCreate /></ProtectedRoute>} />
          <Route path="/admin/passengers" element={<ProtectedRoute adminOnly><AdminPassengers /></ProtectedRoute>} />
          <Route path="/cadastro" element={<CadastroUsuario />} />
          <Route path="/selecionar-assento" element={<ProtectedRoute><SelecionarAssento /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
