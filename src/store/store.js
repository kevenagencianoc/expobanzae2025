// src/store/store.js
import { createStore, combineReducers } from 'redux';
import vendasReducer from './vendasReducer';

const rootReducer = combineReducers({
  vendas: vendasReducer,
  // Adicione outros reducers se houver
});

const store = createStore(rootReducer);

export default store;