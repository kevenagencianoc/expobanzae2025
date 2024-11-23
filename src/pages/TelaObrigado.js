import React from 'react';
import './TelaObrigado.css';
import logo from '../assets/logo.png';

const TelaObrigado = () => {
  return (
    <div className="thank-you-container">
      <img src={logo} alt="Logo do Evento" className="logo" />
      <h1 className="thank-you-title">Obrigado por Participar da Expo Caju!</h1>
      <p className="thank-you-message">
        Sua inscrição foi realizada com sucesso. <br />
        Para participar novamente, realize mais compras no evento e preencha o formulário mais uma vez!
      </p>
    </div>
  );
};

export default TelaObrigado;