// src/store/vendasReducer.js
const initialState = {
  vendasTotais: 0,
  vendasPorBarraca: [],
};

const vendasReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADICIONAR_VENDA':
      const novaVenda = action.payload;
      const vendasAtualizadas = [...state.vendasPorBarraca];
      const index = vendasAtualizadas.findIndex(b => b.nome === novaVenda.nome);

      if (index !== -1) {
        vendasAtualizadas[index].vendas += novaVenda.valor;
      } else {
        vendasAtualizadas.push({ nome: novaVenda.nome, vendas: novaVenda.valor });
      }

      return {
        ...state,
        vendasTotais: state.vendasTotais + novaVenda.valor,
        vendasPorBarraca: vendasAtualizadas,
      };

    default:
      return state;
  }
};

export default vendasReducer;