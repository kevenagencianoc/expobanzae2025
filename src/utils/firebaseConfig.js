// src/utils/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"; // Importando as funções necessárias
import { getFirestore, collection, addDoc, getDocs, Timestamp } from "firebase/firestore"; // Importando Firestore

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

// Exportando as funções necessárias
export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, db, adicionarInscricao, buscarInscricoes, realizarSorteio };