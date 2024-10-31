// src/store/vendasActions.js
export const adicionarVenda = (nome, valor) => ({
  type: 'ADICIONAR_VENDA',
  payload: { nome, valor },
});