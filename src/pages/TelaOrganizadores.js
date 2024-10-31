import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa o hook de navegação
import { obterVendas, obterTotalVendas, limparVendas } from '../servicoVendas';
import './TelaOrganizadores.css';
import logoEvento from '../assets/logo.png';

const TelaOrganizadores = () => {
  const [vendas, setVendas] = useState([]);
  const [totalVendas, setTotalVendas] = useState(0);
  const navigate = useNavigate(); // Inicializa o hook de navegação

  // Função que verifica se o organizador está autenticado
  useEffect(() => {
    const token = localStorage.getItem('tokenOrganizador');
    if (!token) {
      navigate('/login-organizadores'); // Redireciona para o login se não estiver autenticado
    }
  }, [navigate]);

  const atualizarVendas = () => {
    setVendas(obterVendas());
    setTotalVendas(obterTotalVendas());
  };

  const handleLimparVendas = () => {
    if (window.confirm('Tem certeza de que deseja limpar todas as vendas?')) {
      limparVendas();
      atualizarVendas(); // Atualiza a tela após limpar
    }
  };

  useEffect(() => {
    atualizarVendas();
  }, []);

  return (
    <div className="organizadores-container">
      <img src={logoEvento} alt="Logo do Evento" className="logo" />
      <h1 className="title">Organizadores</h1>

      <div className="actions">
        <button onClick={atualizarVendas} className="button">
          Atualizar
        </button>
        <button onClick={handleLimparVendas} className="button limpar">
          Limpar Vendas
        </button>
      </div>

      <h2 className="total-vendas">
        Total de Vendas Do Evento: R$ {totalVendas.toFixed(2)}
      </h2>
      <h3>Vendas por Barraca:</h3>

      <div className="vendas-container">
        <ul className="cards-list">
          {vendas.length > 0 ? (
            vendas.map((barraca, index) => (
              <li key={index} className="card">
                <strong className="card-title">{barraca.nome}</strong>
                <span className="card-value">R$ {barraca.valor.toFixed(2)}</span>
              </li>
            ))
          ) : (
            <li className="card">Nenhuma venda registrada até o momento.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TelaOrganizadores;