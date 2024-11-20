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
    console.error("Erro ao adicionar inscrição: ", e);
  }
};

// Função para buscar inscrições
const buscarInscricoes = async () => {
  const inscritos = [];
  const querySnapshot = await getDocs(collection(db, "inscricoes"));
  querySnapshot.forEach((doc) => {
    inscritos.push({ id: doc.id, ...doc.data() }); // Adiciona os dados e o ID do documento
  });
  return inscritos;
};

// Função para realizar o sorteio
const realizarSorteio = async () => {
  const inscritos = await buscarInscricoes();
  if (inscritos.length === 0) {
    throw new Error('Nenhuma inscrição encontrada.');
  }

  const vencedor = inscritos[Math.floor(Math.random() * inscritos.length)]; // Escolhendo um vencedor aleatório
  return vencedor;
};

// Registrar uma nova venda no Firestore
const registrarVenda = async (nome, valor) => {
  try {
    await addDoc(collection(db, 'vendas'), {
      nome,
      valor,
      dataVenda: Timestamp.fromDate(new Date()),
    });
  } catch (e) {
    console.error('Erro ao registrar venda:', e);
    throw e;
  }
};

// Buscar vendas do Firestore
const buscarVendas = async () => {
  const vendas = [];
  const querySnapshot = await getDocs(collection(db, 'vendas'));
  querySnapshot.forEach((doc) => {
    vendas.push({ id: doc.id, ...doc.data() });
  });
  return vendas;
};

// Obter vendas por barraca
const obterVendasPorBarraca = async (nomeBarraca) => {
  const vendas = [];
  const q = query(collection(db, 'vendas'), where("nome", "==", nomeBarraca)); // Filtrando por nome da barraca
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    vendas.push({ id: doc.id, ...doc.data() });
  });
  return vendas;
};

// Limpar todas as vendas do Firestore
const limparVendasFirestore = async () => {
  const querySnapshot = await getDocs(collection(db, 'vendas'));
  const batch = writeBatch(db); // Usando o writeBatch (correto para Firestore v9+)

  querySnapshot.forEach((docSnapshot) => {
    batch.delete(doc(db, 'vendas', docSnapshot.id)); // Criando a referência e deletando
  });

  try {
    await batch.commit(); // Commitando todas as operações de uma vez
    console.log('Todas as vendas foram limpas!');
  } catch (error) {
    console.error('Erro ao limpar vendas:', error);
  }
};

// Exportando as funções necessárias
export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, db, adicionarInscricao, buscarInscricoes, realizarSorteio, registrarVenda, buscarVendas, obterVendasPorBarraca, limparVendasFirestore };