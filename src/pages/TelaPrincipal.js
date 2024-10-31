import React from 'react';
import { Link } from 'react-router-dom';
import './TelaPrincipal.css'; // Importando os estilos
import logo from '../assets/logo.png'; // Importando a logo

const TelaPrincipal = () => {
  return (
    <div className="container">
      <header className="header">
        <img src={logo} alt="Logo do Evento" className="logo" />
      </header>
      <main className="main-content">
        <h1 className="titulo">Bem-vindo ao Evento!</h1>
        <div className="button-container">
          <Link to="/login-vendedores">
            <button>Acesso de Vendedores</button>
          </Link>
          <Link to="/login-organizadores">
            <button>Acesso de Organizadores</button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default TelaPrincipal;