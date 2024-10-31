// src/servicoOrganizadores.js

let vendas = [
    { nome: 'Barraca 1', valor: 100 },
    { nome: 'Barraca 2', valor: 200 },
  ];
  
  export const obterVendasOrganizadores = () => vendas;
  
  export const obterTotalVendasOrganizadores = () =>
    vendas.reduce((total, barraca) => total + barraca.valor, 0);
  
  export const limparVendasOrganizadores = () => {
    vendas = [];
  };
  
  export const adicionarVenda = (nome, valor) => {
    vendas.push({ nome, valor });
  };