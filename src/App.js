import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import TelaPrincipal from './pages/TelaPrincipal';
import TelaLoginVendedores from './pages/TelaLoginVendedores';
import TelaVendedores from './pages/TelaVendedores';
import TelaLoginOrganizadores from './pages/TelaLoginOrganizadores';
import TelaFormularioCliente from './pages/TelaFormularioCliente';
import TelaOrganizadores from './pages/TelaOrganizadores';
import TelaRegistroOrganizadores from './pages/TelaRegistroOrganizadores'; // Import da tela de registro para organizadores
import TelaSorteio from './pages/TelaSorteio'; // Import da nova tela de sorteio
import TelaObrigado from './pages/TelaObrigado'; // Import da Tela de Agradecimento
import TelaRegistro from './pages/TelaRegistro'; // Import da Tela de Agradecimento
import ProtectedRoute from './components/ProtectedRoute'; // Import do ProtectedRoute

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<TelaPrincipal />} />
          <Route path="/login-vendedores" element={<TelaLoginVendedores />} />
          <Route 
            path="/vendedores" 
            element={
              <ProtectedRoute type="vendedor">
                <TelaVendedores />
              </ProtectedRoute>
            } 
          />
          <Route path="/login-organizadores" element={<TelaLoginOrganizadores />} />
          <Route 
            path="/organizadores" 
            element={
              <ProtectedRoute type="organizador">
                <TelaOrganizadores />
              </ProtectedRoute>
            } 
          />
          <Route path="/formulario-cliente" element={<TelaFormularioCliente />} />
          <Route path="/registro-organizadores" element={<TelaRegistroOrganizadores />} /> {/* Nova Rota para Registro de Organizadores */}
          <Route path="/sorteio" element={<TelaSorteio />} /> {/* Nova Rota para Sorteio */}
          <Route path="/obrigado" element={<TelaObrigado />} /> {/* Nova Rota para Agradecimento */}
          <Route path="/registro" element={<TelaRegistro />} /> {/* Nova Rota para Agradecimento */}
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;