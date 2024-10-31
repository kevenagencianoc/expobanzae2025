// src/components/TelaVendedores.js
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import logo from '../assets/logo.png';
import { adicionarVenda } from '../servicoVendas'; // Importa a função para registrar a venda
import './TelaVendedores.css'; // Importa o CSS da tela

const TelaVendedores = () => {
  const [nomeBarraca, setNomeBarraca] = useState('');
  const [valorVenda, setValorVenda] = useState('');
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [qrCodeAtivo, setQrCodeAtivo] = useState(false); // Controle de expiração do QR Code
  const [contador, setContador] = useState(60); // Contador de 1 minuto

  // Função para gerar QR Code
  const gerarQRCode = () => {
    const valorNumerico = parseFloat(valorVenda);

    // Validação: Nome e valor
    if (valorNumerico >= 15 && nomeBarraca.trim() !== '') {
      const token = Date.now(); // Gera um token único baseado no timestamp atual
      const urlFormulario = `https://expocaju2024.vercel.app/formulario-cliente?token=${token}`; // Atualizado para o URL correto

      // Gera o QR Code com a URL do formulário
      setQrCodeValue(urlFormulario);
      adicionarVenda(nomeBarraca, valorNumerico);
      setQrCodeAtivo(true); // Ativa o QR Code para expiração

      // Feedback de sucesso
      setMensagemSucesso(`Venda registrada com sucesso! Barraca: ${nomeBarraca}, Valor: R$ ${valorVenda}`);

      // Reseta os campos
      setNomeBarraca('');
      setValorVenda('');
      setContador(60); // Reinicia o contador para 60 segundos
    } else {
      alert('O valor da venda deve ser igual ou superior a R$ 15,00 e o nome da barraca não pode estar vazio.');
    }
  };

  // Efeito para controlar a expiração do QR Code
  useEffect(() => {
    if (qrCodeAtivo && contador > 0) {
      const timer = setTimeout(() => setContador(contador - 1), 1000);
      return () => clearTimeout(timer); // Limpa o timer ao desmontar
    } else if (contador === 0) {
      setQrCodeValue(''); // Limpa o QR Code ao expirar
      setQrCodeAtivo(false); // Desativa o QR Code
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