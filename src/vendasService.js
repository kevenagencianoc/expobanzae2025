// src/vendasService.js

const LOCAL_STORAGE_KEY = 'vendasData';

// Função para adicionar uma venda ao localStorage
export const adicionarVenda = (nome, valor) => {
  const vendas = obterVendas();
  const novaVenda = { nome, valor };
  
  // Verifica se a barraca já tem vendas registradas
  const index = vendas.findIndex(venda => venda.nome === nome);
  if (index !== -1) {
    vendas[index].valor += valor; // Atualiza o valor da barraca existente
  } else {
    vendas.push(novaVenda); // Adiciona nova barraca
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(vendas));
};

// Função para obter todas as vendas do localStorage
export const obterVendas = () => {
  const vendas = localStorage.getItem(LOCAL_STORAGE_KEY);
  return vendas ? JSON.parse(vendas) : [];
};

// Função para obter o total de vendas
export const obterTotalVendas = () => {
  const vendas = obterVendas();
  return vendas.reduce((total, venda) => total + venda.valor, 0);
};


