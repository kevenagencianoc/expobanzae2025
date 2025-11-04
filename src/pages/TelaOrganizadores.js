import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buscarVendas, limparVendasFirestore } from '../utils/firebaseConfig'; // Importa funções do Firebase
import './TelaOrganizadores.css';
import logoEvento from '../assets/logobranca.png';

const TelaOrganizadores = () => {
  const [vendas, setVendas] = useState([]);
  const [totalVendas, setTotalVendas] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('tokenOrganizador');
    if (!token) {
      navigate('/login-organizadores');
    }
  }, [navigate]);

  const atualizarVendas = async () => {
    try {
      const vendasRegistradas = await buscarVendas();
      
      // Agrupar as vendas por barraca (nome) e somar os valores
      const vendasAgrupadas = vendasRegistradas.reduce((acc, venda) => {
        const nomeBarraca = venda.nome;
        const valorVenda = typeof venda.valor === 'number' && !isNaN(venda.valor) ? venda.valor : 0;

        // Se a barraca já existe no acumulador, soma o valor da venda
        if (acc[nomeBarraca]) {
          acc[nomeBarraca] += valorVenda;
        } else {
          // Caso contrário, cria uma nova entrada no acumulador
          acc[nomeBarraca] = valorVenda;
        }

        return acc;
      }, {});

      // Transformar o objeto agrupado em um array de barracas
      const vendasFinal = Object.keys(vendasAgrupadas).map(nomeBarraca => ({
        nome: nomeBarraca,
        valor: vendasAgrupadas[nomeBarraca]
      }));

      setVendas(vendasFinal);

      // Calcula o total de vendas
      const total = vendasFinal.reduce((soma, venda) => soma + venda.valor, 0);
      setTotalVendas(total);
    } catch (e) {
      console.error('Erro ao buscar vendas:', e);
    }
  };

  const handleLimparVendas = async () => {
    if (window.confirm('Tem certeza de que deseja limpar todas as vendas?')) {
      await limparVendasFirestore();
      atualizarVendas();
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

      {/* Exibe o total de vendas */}
      <h2 className="total-vendas">
        Total de Vendas Do Evento: R$ {totalVendas > 0 ? totalVendas.toFixed(2) : '0.00'}
      </h2>
      
      <h3>Vendas por Barraca:</h3>

      <div className="vendas-container">
        <ul className="cards-list">
          {vendas.length > 0 ? (
            vendas.map((barraca, index) => {
              const valorFormatado = barraca.valor.toFixed(2); // Valor formatado para exibição
              return (
                <li key={index} className="card">
                  <strong className="card-title">{barraca.nome}</strong>
                  <span className="card-value">R$ {valorFormatado}</span>
                </li>
              );
            })
          ) : (
            <li className="card">Nenhuma venda registrada até o momento.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TelaOrganizadores;