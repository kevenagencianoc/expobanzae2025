import React from 'react';
import { Link } from 'react-router-dom';
import './TelaPrincipal.css'; // Importando os estilos
import logo from '../assets/logobranca.png'; // Logo Expo Banzaê
import logoPrefeitura from '../assets/logo-prefeitura.png'; // ✅ Adicione sua logo aqui

const TelaPrincipal = () => {
  return (
    <div className="container">
      <header className="header">
        <img src={logo} alt="Logo do Evento" className="logo" />
      </header>

      <main className="main-content">
        <h1 className="titulo">Bem-vindo ao Expo Banzaê 2025!</h1>
        <div className="button-container">
          <Link to="/login-vendedores">
            <button>Acesso de Vendedores</button>
          </Link>
          <Link to="/login-organizadores">
            <button>Acesso de Organizadores</button>
          </Link>
        </div>
      </main>

      {/* ✅ Rodapé com logo da Prefeitura */}
      <footer className="footer">
        <img
          src={logoPrefeitura}
          alt="Prefeitura de Banzaê"
          className="logo-prefeitura"
        />
      </footer>
    </div>
  );
};

export default TelaPrincipal;
