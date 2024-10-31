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
  if (type === 'vendedor' && !isAuthenticatedVendedor()) {
    return <Navigate to="/login-vendedores" />;
  }

  if (type === 'organizador' && !isAuthenticatedOrganizador()) {
    return <Navigate to="/login-organizadores" />;
  }

  return children; // Renderiza os filhos se estiver autenticado
};

export default ProtectedRoute;