import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import logo from '../assets/logo.png';
import { registrarVenda, obterVendasPorBarraca } from '../utils/firebaseConfig'; // Importa funções do Firebase
import './TelaVendedores.css';

const TelaVendedores = () => {
  const [nomeBarraca, setNomeBarraca] = useState('');
  const [valorVenda, setValorVenda] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [qrCodeAtivo, setQrCodeAtivo] = useState(false);
  const [contador, setContador] = useState(60); // Inicializa o contador com 60 segundos
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [totalVendasBarraca, setTotalVendasBarraca] = useState(0);

  // Função para gerar QR Code e registrar venda
  const gerarQRCode = async () => {
    const valorNumerico = parseFloat(valorVenda);

    if (valorNumerico >= 15 && nomeBarraca.trim() !== '') {
      const token = Date.now(); // Cria um token único com base no timestamp
      const urlFormulario = `https://expocaju2024.vercel.app/formulario-cliente?token=${token}`;

      try {
        // Registra a venda no banco
        await registrarVenda(nomeBarraca, valorNumerico);

        // Atualiza o estado com o QR Code gerado
        setQrCode(urlFormulario);
        setQrCodeAtivo(true);
        setMensagemSucesso(`Venda registrada com sucesso! Barraca: ${nomeBarraca}, Valor: R$ ${valorVenda}`);

        // Atualiza o total de vendas da barraca
        atualizarTotalVendas(nomeBarraca);

        // Reseta os campos e o contador
        setNomeBarraca('');
        setValorVenda('');
        setContador(60); // Reinicia o contador para 60 segundos
      } catch (e) {
        alert('Erro ao registrar venda. Tente novamente.');
        console.error(e);
      }
    } else {
      alert('O valor da venda deve ser igual ou superior a R$ 15,00 e o nome da barraca não pode estar vazio.');
    }
  };

  // Função para atualizar o total de vendas da barraca
  const atualizarTotalVendas = async (barraca) => {
    try {
      const vendas = await obterVendasPorBarraca(barraca);
      const total = vendas.reduce((soma, venda) => soma + venda.valor, 0);
      setTotalVendasBarraca(total);
    } catch (e) {
      console.error('Erro ao atualizar o total de vendas:', e);
    }
  };

  // Efeito para gerenciar o tempo do contador
  useEffect(() => {
    if (qrCodeAtivo && contador > 0) {
      const timer = setTimeout(() => setContador(contador - 1), 1000);
      return () => clearTimeout(timer);
    } else if (contador === 0) {
      setQrCodeAtivo(false); // Desativa o QR Code quando o tempo expira
    }
  }, [contador, qrCodeAtivo]);

  // Efeito para atualizar as vendas ao alterar o nome da barraca
  useEffect(() => {
    if (nomeBarraca.trim() !== '') {
      atualizarTotalVendas(nomeBarraca);
    }
  }, [nomeBarraca]);

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

      <div className="totalVendas">
        <p><strong>Total de Vendas desta Barraca:</strong> R$ {totalVendasBarraca.toFixed(2)}</p>
      </div>

      {qrCodeAtivo && qrCode && (
        <div className="qrCodeContainer">
          <span className="qrCodeLabel">QR Code para a venda:</span>
          <QRCodeSVG value={qrCode} size={128} />
          <p className="contador">Expira em: {contador}s</p>
        </div>
      )}
    </div>
  );
};

export default TelaVendedores;