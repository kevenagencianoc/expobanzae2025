// src/pages/TelaLoginVendedores.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword } from '../utils/firebaseConfig'; // Certifique-se do caminho correto
import '../pages/TelaLoginVendedores.css';
import logo from '../assets/logobranca.png';

const TelaLoginVendedores = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false); // Adiciona um estado para o carregamento
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Inicia o carregamento

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      localStorage.setItem('tokenVendedor', 'token-vendedor'); // Armazena o token localmente
      navigate('/vendedores'); // Redireciona para a área de vendedores
    } catch (error) {
      alert('Email ou senha incorretos.');
    } finally {
      setLoading(false); // Encerra o carregamento
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Logo do Evento" className="logo" />
      <h1 className="title">Acesso de Vendedores</h1>
      <p className="descriptionv">Por favor, faça o login para acessar sua área.</p>
      <form className="login-form" onSubmit={handleSubmit}>
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
        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default TelaLoginVendedores;