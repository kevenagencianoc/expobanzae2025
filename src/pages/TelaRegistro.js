// src/pages/TelaRegistro.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/firebaseConfig'; // Importando do caminho correto
import { createUserWithEmailAndPassword } from 'firebase/auth';
import '../pages/TelaRegistro.css';
import logo from '../assets/logobranca.png';

const TelaRegistro = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      alert('Usuário registrado com sucesso!');
      navigate('/login-vendedores');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="registro-container">
      <img src={logo} alt="Logo do Evento" className="logo" />
      <h1 className="title">Registro de Vendedores</h1>
      <form className="registro-form" onSubmit={handleSubmit}>
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
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default TelaRegistro;