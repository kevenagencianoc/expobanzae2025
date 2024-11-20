import { getFirestore, collection, addDoc, getDocs, query, updateDoc, where, doc, deleteDoc } from 'firebase/firestore';
import { firebaseApp } from './firebaseConfig'; // Certifique-se de que este arquivo exporta sua configuração do Firebase.

const db = getFirestore(firebaseApp);

// Salvar uma nova venda no Firestore
export const adicionarVenda = async (nome, valor) => {
  try {
    // Referência para a coleção "vendas"
    const vendasCollection = collection(db, 'vendas');

    // Verificar se a barraca já existe no Firestore
    const q = query(vendasCollection, where('nomeBarraca', '==', nome));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Atualizar a venda existente
      const vendaDoc = querySnapshot.docs[0];
      const vendaRef = doc(db, 'vendas', vendaDoc.id);

      await updateDoc(vendaRef, {
        valorVenda: vendaDoc.data().valorVenda + valor,
      });
    } else {
      // Adicionar uma nova venda
      await addDoc(vendasCollection, {
        nomeBarraca: nome,
        valorVenda: valor,
        dataVenda: new Date(), // Timestamp da venda
      });
    }
  } catch (error) {
    console.error('Erro ao adicionar venda:', error);
  }
};

// Obter todas as vendas do Firestore
export const obterVendas = async () => {
  try {
    const vendasCollection = collection(db, 'vendas');
    const querySnapshot = await getDocs(vendasCollection);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Erro ao obter vendas:', error);
    return [];
  }
};

// Obter o total de vendas
export const obterTotalVendas = async () => {
  try {
    const vendas = await obterVendas();

    return vendas.reduce((total, venda) => total + venda.valorVenda, 0);
  } catch (error) {
    console.error('Erro ao calcular total de vendas:', error);
    return 0;
  }
};

// Limpar todas as vendas (remover todos os documentos)
export const limparVendas = async () => {
  try {
    const vendasCollection = collection(db, 'vendas');
    const querySnapshot = await getDocs(vendasCollection);

    const deletePromises = querySnapshot.docs.map((doc) =>
      deleteDoc(doc.ref)
    );

    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Erro ao limpar vendas:', error);
  }
};
