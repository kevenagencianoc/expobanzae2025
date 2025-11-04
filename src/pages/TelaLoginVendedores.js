// src/pages/TelaLoginVendedores.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword } from '../utils/firebaseConfig';
import './TelaLoginVendedores.css';
import logo from '../assets/logobranca.png';

const TelaLoginVendedores = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, senha);
      const user = cred.user;

      // nome “amigável”: displayName se houver, senão prefixo do e-mail
      const vendorNome =
        (user.displayName && user.displayName.trim()) ||
        (user.email ? user.email.split('@')[0] : email);

      // mantêm o seu token caso esteja sendo usado em outro lugar
      localStorage.setItem('tokenVendedor', 'token-vendedor');

      // novos dados para pré-preencher a tela de vendas
      localStorage.setItem('vendorEmail', user.email || email);
      localStorage.setItem('vendorNome', vendorNome);

      navigate('/vendedores'); // rota atual da sua área de vendas
    } catch (error) {
      console.error(error);
      alert('Email ou senha incorretos.');
    } finally {
      setLoading(false);
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
