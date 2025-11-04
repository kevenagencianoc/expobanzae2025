import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirecionamento
import '../pages/TelaRegistroOrganizadores.css'; // Importação do CSS
import logo from '../assets/logobranca.png'; // Importando a logo
import { auth } from '../utils/firebaseConfig'; // Importando Firebase Auth
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Importando método de registro

const TelaRegistroOrganizadores = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate(); // Hook para navegação

  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede o comportamento padrão do formulário

    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      alert('Usuário registrado com sucesso!');
      navigate('/login-organizadores'); // Redireciona para a tela de login
    } catch (error) {
      alert('Erro ao registrar: ' + error.message); // Mensagem de erro
    }
  };

  return (
    <div className="register-container">
      <img src={logo} alt="Logo do Evento" className="logo" />
      <h1 className="title">Registro de Organizadores</h1>
      <p className="description">Por favor, preencha os dados abaixo para se registrar.</p>
      <form className="register-form" onSubmit={handleSubmit}>
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

export default TelaRegistroOrganizadores;