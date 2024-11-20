import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import logo from '../assets/logo.png';
import { registrarVenda } from '../utils/firebaseConfig'; // Importa função do Firebase
import './TelaVendedores.css';

const TelaVendedores = () => {
  const [nomeBarraca, setNomeBarraca] = useState('');
  const [valorVenda, setValorVenda] = useState('');
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [qrCodeAtivo, setQrCodeAtivo] = useState(false);
  const [contador, setContador] = useState(60);

  const gerarQRCode = async () => {
    const valorNumerico = parseFloat(valorVenda);

    if (valorNumerico >= 15 && nomeBarraca.trim() !== '') {
      const token = Date.now();
      const urlFormulario = `https://expocaju2024.vercel.app/formulario-cliente?token=${token}`;

      try {
        await registrarVenda(nomeBarraca, valorNumerico);
        setQrCodeValue(urlFormulario);
        setQrCodeAtivo(true);
        setMensagemSucesso(`Venda registrada com sucesso! Barraca: ${nomeBarraca}, Valor: R$ ${valorVenda}`);
        setNomeBarraca('');
        setValorVenda('');
        setContador(60);
      } catch (e) {
        alert('Erro ao registrar venda. Tente novamente.');
        console.error(e);
      }
    } else {
      alert('O valor da venda deve ser igual ou superior a R$ 15,00 e o nome da barraca não pode estar vazio.');
    }
  };

  useEffect(() => {
    if (qrCodeAtivo && contador > 0) {
      const timer = setTimeout(() => setContador(contador - 1), 1000);
      return () => clearTimeout(timer);
    } else if (contador === 0) {
      setQrCodeValue('');
      setQrCodeAtivo(false);
    }
  }, [contador, qrCodeAtivo]);

  return (
    <div className="container">
      <img src={logo} alt="Logo do Evento" className="logo" />
      <h1 className="title">Vendas</h1>
      <p className="descriptionvv">
        Preencha o nome da sua barraca e o valor da venda.<br />
        Em seguida, clique em "Gerar QR Code" para registrar a venda.
      </p>

      <input
        className="input"
        type="text"
        placeholder="Nome da Barraca"
        value={nomeBarraca}
        onChange={(e) => setNomeBarraca(e.target.value)}
      />
      <input
        className="input"
        type="number"
        placeholder="Valor da Venda"
        value={valorVenda}
        onChange={(e) => setValorVenda(e.target.value)}
      />

      <button className="button" onClick={gerarQRCode}>
        Gerar QR Code
      </button>

      {mensagemSucesso && <p className="mensagemSucesso">{mensagemSucesso}</p>}

      {qrCodeValue && (
        <div className="qrCodeContainer">
          <span className="qrCodeLabel">QR Code para a venda:</span>
          <QRCodeSVG value={qrCodeValue} size={128} />
          <p className="contador">Expira em: {contador}s</p>
        </div>
      )}
    </div>
  );
};

export default TelaVendedores;
