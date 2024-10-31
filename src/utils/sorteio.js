// src/utils/sorteio.js
import { getFirestore, collection, getDocs } from "firebase/firestore"; 

const db = getFirestore();

export const realizarSorteio = async () => {
  try {
    const inscritosRef = collection(db, "inscricoes");
    const snapshot = await getDocs(inscritosRef);
    const inscritos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (inscritos.length === 0) {
      throw new Error("Não há inscritos para o sorteio.");
    }

    // Seleciona um vencedor aleatório
    const vencedor = inscritos[Math.floor(Math.random() * inscritos.length)];
    return vencedor;
  } catch (error) {
    throw new Error(`Erro ao realizar o sorteio: ${error.message}`);
  }
};