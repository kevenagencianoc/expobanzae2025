// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

// Lógica de autenticação para vendedores e organizadores
const isAuthenticatedVendedor = () => {
  return localStorage.getItem('tokenVendedor') !== null; // Exemplo de verificação
};

const isAuthenticatedOrganizador = () => {
  return localStorage.getItem('tokenOrganizador') !== null; // Exemplo de verificação
};

const ProtectedRoute = ({ children, type }) => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token'); // Obtém o token da URL

  // Verifica se o tipo é 'vendedor' e se o vendedor está autenticado
  if (type === 'vendedor' && !isAuthenticatedVendedor()) {
    return <Navigate to="/login-vendedores" />;
  }

  // Verifica se o tipo é 'organizador' e se o organizador está autenticado
  if (type === 'organizador' && !isAuthenticatedOrganizador()) {
    return <Navigate to="/login-organizadores" />;
  }

  // Se o tipo for 'formulario', verifica se há um token
  if (type === 'formulario' && !token) {
    return <Navigate to="/" />; // Redireciona para a página inicial se não houver token
  }

  return children; // Renderiza os filhos se estiver autenticado ou se tiver um token
};

export default ProtectedRoute; 