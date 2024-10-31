// src/store/index.js
import { createStore } from 'redux';
import vendasReducer from './vendasReducer';

const store = createStore(vendasReducer);

export default store;