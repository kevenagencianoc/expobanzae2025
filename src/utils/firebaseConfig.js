import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"; // Importando as funções necessárias
import { getFirestore, collection, addDoc, getDocs, Timestamp, writeBatch, doc, query, where } from "firebase/firestore"; // Adicionando query e where para filtragem

// Configuração do Firebase do seu aplicativo da web
const firebaseConfig = { 
  apiKey: "AIzaSyBmXiOO3LWClGL8IKXOGA8KRASEuTZAxIo", 
  authDomain: "expo-caju.firebaseapp.com", 
  projectId: "expo-caju", 
  storageBucket: "expo-caju.appspot.com", 
  messagingSenderId: "786710734433", 
  appId: "1:786710734433:web:d93768cf79154b5f9bac20" 
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);

// Obtendo a instância de autenticação e Firestore
const auth = getAuth(app);
const db = getFirestore(app); // Inicializando o Firestore

// Função para adicionar inscrição no Firestore
const adicionarInscricao = async (dadosInscricao) => {
  try {
    const docRef = await addDoc(collection(db, "inscricoes"), {
      nomeCompleto: dadosInscricao.nomeCompleto,
      telefone: dadosInscricao.telefone,
      endereco: dadosInscricao.endereco,
      email: dadosInscricao.email,
      dataInscricao: Timestamp.fromDate(new Date()), // Data e hora atual
    });
    console.log("Inscrição registrada com ID:", docRef.id);
  } catch (e) {
    console.error("Erro ao adicionar inscrição: ", e.message); // Exibe o erro com mais detalhes
  }
};

// Função para buscar inscrições
const buscarInscricoes = async () => {
  try {
    const inscritos = [];
    const querySnapshot = await getDocs(collection(db, "inscricoes"));
    querySnapshot.forEach((doc) => {
      inscritos.push({ id: doc.id, ...doc.data() }); // Adiciona os dados e o ID do documento
    });
    return inscritos;
  } catch (e) {
    console.error("Erro ao buscar inscrições: ", e.message); // Exibe o erro com mais detalhes
    throw e; // Re-throw para propagação do erro
  }
};

// Função para realizar o sorteio
const realizarSorteio = async () => {
  try {
    const inscritos = await buscarInscricoes();
    if (inscritos.length === 0) {
      throw new Error('Nenhuma inscrição encontrada.');
    }

    const vencedor = inscritos[Math.floor(Math.random() * inscritos.length)]; // Escolhendo um vencedor aleatório
    return vencedor;
  } catch (e) {
    console.error("Erro ao realizar sorteio: ", e.message);
    throw e; // Re-throw do erro
  }
};

// Registrar uma nova venda no Firestore
const registrarVenda = async (nome, valor) => {
  try {
    if (valor < 15) {
      throw new Error("O valor da venda deve ser maior ou igual a R$ 15,00.");
    }
    await addDoc(collection(db, 'vendas'), {
      nome,
      valor,
      dataVenda: Timestamp.fromDate(new Date()),
    });
    console.log('Venda registrada com sucesso!');
  } catch (e) {
    console.error('Erro ao registrar venda:', e.message); // Exibe o erro com mais detalhes
    throw e; // Re-throw para o código chamador tratar
  }
};

// Buscar vendas do Firestore
const buscarVendas = async () => {
  try {
    const vendas = [];
    const querySnapshot = await getDocs(collection(db, 'vendas'));
    querySnapshot.forEach((doc) => {
      vendas.push({ id: doc.id, ...doc.data() });
    });
    return vendas;
  } catch (e) {
    console.error("Erro ao buscar vendas: ", e.message);
    throw e; // Re-throw para o código chamador tratar
  }
};

// Obter vendas por barraca
const obterVendasPorBarraca = async (nomeBarraca) => {
  try {
    const vendas = [];
    const q = query(collection(db, 'vendas'), where("nome", "==", nomeBarraca)); // Filtrando por nome da barraca
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      vendas.push({ id: doc.id, ...doc.data() });
    });
    return vendas;
  } catch (e) {
    console.error("Erro ao buscar vendas por barraca: ", e.message);
    throw e; // Re-throw do erro
  }
};

// Limpar todas as vendas do Firestore
const limparVendasFirestore = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'vendas'));
    const batch = writeBatch(db); // Usando o writeBatch (correto para Firestore v9+)

    querySnapshot.forEach((docSnapshot) => {
      batch.delete(doc(db, 'vendas', docSnapshot.id)); // Criando a referência e deletando
    });

    await batch.commit(); // Commitando todas as operações de uma vez
    console.log('Todas as vendas foram limpas!');
  } catch (error) {
    console.error('Erro ao limpar vendas:', error.message); // Exibe o erro com mais detalhes
  }
};

// Exportando as funções necessárias
export { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  db, 
  adicionarInscricao, 
  buscarInscricoes, 
  realizarSorteio, 
  registrarVenda, 
  buscarVendas, 
  obterVendasPorBarraca, 
  limparVendasFirestore 
};