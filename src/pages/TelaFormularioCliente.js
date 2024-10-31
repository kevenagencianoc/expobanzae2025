// src/components/TelaFormularioCliente.js
import React, { useEffect, useState } from 'react';
import { adicionarInscricao } from '../utils/firebaseConfig';
import './TelaFormularioCliente.css';
import logo from '../assets/logo.png';
import ProtectedRoute from '../components/ProtectedRoute'; // Importa o ProtectedRoute

const TelaFormularioCliente = () => {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [email, setEmail] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  const enviarFormulario = async (e) => {
    e.preventDefault();

    const dadosInscricao = {
      nomeCompleto,
      telefone,
      endereco,
      email,
    };

    try {
      await adicionarInscricao(dadosInscricao);
      setMensagemSucesso('Inscrição realizada com sucesso!');
      setNomeCompleto('');
      setTelefone('');
      setEndereco('');
      setEmail('');
    } catch (error) {
      console.error('Erro ao enviar inscrição:', error);
      setMensagemSucesso('Erro ao realizar a inscrição. Tente novamente.');
    }
  };

  return (
    <ProtectedRoute type="formulario">
      <div className="form-container">
        <img src={logo} alt="Logo do Evento" className="logo" />
        <h1 className="title">Cadastro para o Sorteio</h1>
        <p className="descriptioncli">
          Preencha o formulário abaixo para participar do sorteio.<br />
          Certifique-se de que todas as informações estão corretas.
        </p>
        <form className="form" onSubmit={enviarFormulario}>
          <input 
            type="text" 
            placeholder="Nome Completo" 
            value={nomeCompleto} 
            onChange={(e) => setNomeCompleto(e.target.value)} 
            required 
          />
          <input 
            type="tel" 
            placeholder="Telefone" 
            value={telefone} 
            onChange={(e) => setTelefone(e.target.value)} 
            required 
          />
          <input 
            type="text" 
            placeholder="Endereço" 
            value={endereco} 
            onChange={(e) => setEndereco(e.target.value)} 
            required 
          />
          <input 
            type="email" 
            placeholder="E-mail" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <button type="submit">Cadastrar</button>
        </form>

        {mensagemSucesso && <p className="mensagemSucesso">{mensagemSucesso}</p>}
      </div>
    </ProtectedRoute>
  );
};

export default TelaFormularioCliente;