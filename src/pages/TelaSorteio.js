import React, { useState } from 'react';
import { realizarSorteio } from '../utils/sorteio'; // Importando a função de sorteio
import './TelaSorteio.css'; // Importando o arquivo de estilo
import logo from '../assets/logo.png'; // Importando a logo

const TelaSorteio = () => {
  const [vencedor, setVencedor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSorteio = async () => {
    setLoading(true);
    setError(null);
    try {
      const vencedor = await realizarSorteio();
      setVencedor(vencedor);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sorteio-container">
      <img src={logo} alt="Logo do Evento" className="logo" /> {/* Usando a logo importada */}
      <h1 className="title">Realizar Sorteio</h1>
      <button onClick={handleSorteio} disabled={loading}>
        {loading ? 'Realizando sorteio...' : 'Sortear Vencedor'}
      </button>

      {vencedor && (
        <div className="resultado">
          <h2>Vencedor:</h2>
          <p><strong>Nome:</strong> {vencedor.nomeCompleto}</p>
          <p><strong>Telefone:</strong> {vencedor.telefone}</p>
          <p><strong>Email:</strong> {vencedor.email}</p>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default TelaSorteio;