import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword } from '../utils/firebaseConfig';
import './TelaLoginOrganizadores.css';
import logo from '../assets/logobranca.png';

const TelaLoginOrganizadores = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      localStorage.setItem('tokenOrganizador', 'token-organizador'); // Armazena o token
      navigate('/organizadores'); // Redireciona para a tela de organizadores
    } catch (error) {
      alert('Email ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Logo do Evento" className="logo" />
      <h1 className="title">Acesso de Organizadores</h1>
      <p className="descriptiono">Por favor, faça o login para acessar sua área.</p>
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

export default TelaLoginOrganizadores;