// src/pages/CadastroUsuario.js
import React, { useState } from 'react';
import { auth, db } from '../utils/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const CadastroUsuario = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [role, setRole] = useState('vendedor'); // Papel padrão: vendedor
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // Salvar o perfil no Firestore
      await setDoc(doc(db, 'usuarios', user.uid), { role });

      alert('Usuário cadastrado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      alert('Erro ao registrar usuário. Verifique os dados.');
    }
  };

  return (
    <div className="cadastro-container">
      <h1>Cadastro de Usuário</h1>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="vendedor">Vendedor</option>
          <option value="organizador">Organizador</option>
        </select>
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default CadastroUsuario;