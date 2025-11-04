import React, { useEffect } from 'react';
import './TelaObrigado.css';
import logo from '../assets/logobranca.png';

const TelaObrigado = () => {
  useEffect(() => {
    // Bloqueio leve do botão "voltar" (UX)
    const push = () => window.history.pushState(null, '', window.location.href);
    push();
    window.addEventListener('popstate', push);
    return () => window.removeEventListener('popstate', push);
  }, []);

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
