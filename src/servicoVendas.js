// src/servicoVendas.js

const salvarVendas = (vendas) => {
  localStorage.setItem('vendas', JSON.stringify(vendas));
};

const carregarVendas = () => {
  const vendas = localStorage.getItem('vendas');
  return vendas ? JSON.parse(vendas) : [];
};

export const adicionarVenda = (nome, valor) => {
  let vendas = carregarVendas();
  const barracaExistente = vendas.find((venda) => venda.nome === nome);

  if (barracaExistente) {
    barracaExistente.valor += valor;
  } else {
    vendas.push({ nome, valor });
  }

  salvarVendas(vendas);
};

export const obterVendas = () => carregarVendas();

export const obterTotalVendas = () => {
  const vendas = carregarVendas();
  return vendas.reduce((total, venda) => total + venda.valor, 0);
};

export const limparVendas = () => {
  localStorage.removeItem('vendas');
};