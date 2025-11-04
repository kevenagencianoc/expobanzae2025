import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  Timestamp,
  writeBatch,
  doc,
  query,
  where,
} from "firebase/firestore";

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

// Instâncias
const auth = getAuth(app);
const db = getFirestore(app);

/* ===========================
   🔒 UTILITÁRIOS DE TOKEN
   =========================== */

// Verifica no Firestore se este token já foi usado em alguma inscrição
const isTokenUsado = async (token) => {
  try {
    if (!token) return true; // se não tem token, considera inválido/indisponível
    const q = query(collection(db, "inscricoes"), where("token", "==", token));
    const snap = await getDocs(q);
    return !snap.empty; // true = já usado
  } catch (e) {
    console.error("Erro ao verificar token:", e.message);
    // Em caso de erro, por segurança, tratamos como usado
    return true;
  }
};

/* ===========================
   📥 INSCRIÇÕES / SORTEIO
   =========================== */

// Adiciona inscrição (agora aceita token opcional sem quebrar chamadas antigas)
const adicionarInscricao = async (dadosInscricao) => {
  try {
    const payload = {
      nomeCompleto: dadosInscricao.nomeCompleto,
      telefone: dadosInscricao.telefone,
      endereco: dadosInscricao.endereco,
      email: dadosInscricao.email,
      dataInscricao: Timestamp.fromDate(new Date()),
    };

    // Se vier token no objeto, salva junto (sem obrigatoriedade)
    if (dadosInscricao.token) {
      payload.token = dadosInscricao.token;
    }

    const docRef = await addDoc(collection(db, "inscricoes"), payload);
    console.log("Inscrição registrada com ID:", docRef.id);
  } catch (e) {
    console.error("Erro ao adicionar inscrição: ", e.message);
    throw e;
  }
};

const buscarInscricoes = async () => {
  try {
    const inscritos = [];
    const querySnapshot = await getDocs(collection(db, "inscricoes"));
    querySnapshot.forEach((doc) => {
      inscritos.push({ id: doc.id, ...doc.data() });
    });
    return inscritos;
  } catch (e) {
    console.error("Erro ao buscar inscrições: ", e.message);
    throw e;
  }
};

const realizarSorteio = async () => {
  try {
    const inscritos = await buscarInscricoes();
    if (inscritos.length === 0) {
      throw new Error('Nenhuma inscrição encontrada.');
    }
    const vencedor = inscritos[Math.floor(Math.random() * inscritos.length)];
    return vencedor;
  } catch (e) {
    console.error("Erro ao realizar sorteio: ", e.message);
    throw e;
  }
};

/* ===========================
   💸 VENDAS
   =========================== */

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
    console.error('Erro ao registrar venda:', e.message);
    throw e;
  }
};

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
    throw e;
  }
};

const obterVendasPorBarraca = async (nomeBarraca) => {
  try {
    const vendas = [];
    const q = query(collection(db, 'vendas'), where("nome", "==", nomeBarraca));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      vendas.push({ id: doc.id, ...doc.data() });
    });
    return vendas;
  } catch (e) {
    console.error("Erro ao buscar vendas por barraca: ", e.message);
    throw e;
  }
};

const limparVendasFirestore = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'vendas'));
    const batch = writeBatch(db);

    querySnapshot.forEach((docSnapshot) => {
      batch.delete(doc(db, 'vendas', docSnapshot.id));
    });

    await batch.commit();
    console.log('Todas as vendas foram limpas!');
  } catch (error) {
    console.error('Erro ao limpar vendas:', error.message);
  }
};

// Exportações
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
  limparVendasFirestore,
  // 🔒 novo utilitário
  isTokenUsado,
};
