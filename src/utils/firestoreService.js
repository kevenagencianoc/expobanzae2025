import { collection, addDoc } from 'firebase/firestore';
import { db } from '..utils/firebaseConfig'; // Importando o Firestore inicializado

// Função para adicionar uma inscrição ao Firestore
export const adicionarInscricao = async (inscricao) => {
  try {
    const docRef = await addDoc(collection(db, 'inscricoes'), inscricao);
    console.log('Inscrição registrada com ID:', docRef.id);
  } catch (error) {
    console.error('Erro ao adicionar inscrição:', error);
  }
};

import { collection, getDocs } from 'firebase/firestore';
import { db } from '..utils/firebaseConfig';

// Função para buscar todas as inscrições
export const buscarInscricoes = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'inscricoes'));
    const inscricoes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return inscricoes;
  } catch (error) {
    console.error('Erro ao buscar inscrições:', error);
    return [];
  }
};