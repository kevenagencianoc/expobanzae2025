import React, { useState, useEffect, useRef } from 'react';
import { realizarSorteio } from '../utils/sorteio';
import './TelaSorteio.css';
import logo from '../assets/logobranca.png';
import Confetti from 'react-confetti';

const TelaSorteio = () => {
  const [vencedor, setVencedor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [animando, setAnimando] = useState(false);
  const [mostrarFogos, setMostrarFogos] = useState(false);
  const [modoPalco, setModoPalco] = useState(false);
  const audioRef = useRef(null);

  const handleSorteio = async () => {
    if (loading || animando) return;

    setLoading(true);
    setError(null);
    setVencedor(null);
    setMostrarFogos(false);

    try {
      setAnimando(true);

      // Tela cheia automática no modo palco
      if (modoPalco && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }

      await new Promise((resolve) => setTimeout(resolve, 2000)); // suspense
      const vencedor = await realizarSorteio();
      setVencedor(vencedor);

      // Ativa confete + som
      setTimeout(() => {
        setMostrarFogos(true);
        if (audioRef.current) {
          audioRef.current.play().catch(() => {
            console.warn("Som bloqueado pelo navegador (precisa interação prévia).");
          });
        }
      }, 500);
    } catch (e) {
      setError(e.message || 'Erro ao realizar sorteio.');
    } finally {
      setTimeout(() => {
        setAnimando(false);
        setLoading(false);
      }, 3000);
    }
  };

  // Sair do modo palco
  const sairModoPalco = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
    setModoPalco(false);
  };

  return (
    <div className={`sorteio-container ${modoPalco ? 'palco' : ''}`}>
      {mostrarFogos && <Confetti numberOfPieces={300} recycle={false} />}

      {/* Áudio da fanfarra */}
      <audio
        ref={audioRef}
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        preload="auto"
      />

      {/* Botão de alternar modo palco */}
      <div className="topo-controles">
        <button
          onClick={() => setModoPalco(!modoPalco)}
          className="botao-palco"
        >
          {modoPalco ? 'Sair do modo palco' : 'Ativar modo palco'}
        </button>
      </div>

      <img src={logo} alt="Logo do Evento" className={`logo ${modoPalco ? 'logo-animada' : ''}`} />
      <h1 className="title">Sorteio Expo Banzaê</h1>

      <button
        onClick={handleSorteio}
        disabled={loading || animando}
        className={loading || animando ? 'botao-desativado' : ''}
      >
        {animando
          ? 'Sorteando...'
          : loading
          ? 'Realizando sorteio...'
          : 'Sortear Vencedor'}
      </button>

      {animando && !vencedor && (
        <div className="resultado animando">
          <h2>Sorteando...</h2>
          <p className="piscando">✨ Girando nomes...</p>
        </div>
      )}

      {vencedor && !animando && (
        <div className="resultado aparecer">
          <h2>🎉 Vencedor!</h2>
          <p><strong>Nome:</strong> {vencedor.nomeCompleto}</p>
          <p><strong>Telefone:</strong> {vencedor.telefone}</p>
          <p><strong>Email:</strong> {vencedor.email}</p>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      {modoPalco && (
        <button onClick={sairModoPalco} className="botao-sair-palco">
          Sair do modo palco
        </button>
      )}
    </div>
  );
};

export default TelaSorteio;
