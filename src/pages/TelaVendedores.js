import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import logo from '../assets/logo.png';
import { registrarVenda, obterVendasPorBarraca } from '../utils/firebaseConfig'; // Importa funções do Firebase
import './TelaVendedores.css';

const TelaVendedores = () => {
  const [nomeBarraca, setNomeBarraca] = useState('');
  const [valorVenda, setValorVenda] = useState('');
  const [qrCodes, setQrCodes] = useState([]); // Agora armazenamos todos os QR Codes
  const [qrCodeAtivo, setQrCodeAtivo] = useState(false);
  const [contador, setContador] = useState(120); // Inicializa o contador com 2 minutos
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [totalVendasBarraca, setTotalVendasBarraca] = useState(0); // Armazena o total de vendas por barraca
  const [currentQRCodeIndex, setCurrentQRCodeIndex] = useState(0); // Controla qual QR Code está sendo exibido

  // Função para gerar QR Codes e registrar vendas
  const gerarQRCode = async () => {
    const valorNumerico = parseFloat(valorVenda);

    if (valorNumerico >= 15 && nomeBarraca.trim() !== '') {
      const tokenBase = Date.now(); // Cria uma base de token única

      try {
        // Calcula quantos cupons de R$ 15 são gerados
        const numCupons = Math.floor(valorNumerico / 15);
        const vendasRegistradas = [];
        const qrCodesGerados = [];

        // Registra múltiplas vendas e cria QR Codes
        for (let i = 0; i < numCupons; i++) {
          const token = tokenBase + i; // Gera um token único para cada QR Code
          const urlFormulario = `https://expocaju2024.vercel.app/formulario-cliente?token=${token}`;

          // Registra a venda no banco
          await registrarVenda(nomeBarraca, 15); // Cada venda é registrada por R$ 15
          vendasRegistradas.push(urlFormulario);
          qrCodesGerados.push(urlFormulario); // Adiciona o QR Code à lista
        }

        // Atualiza o estado com os QR Codes gerados
        setQrCodes(qrCodesGerados); // Salva todos os QR Codes gerados
        setQrCodeAtivo(true);
        setMensagemSucesso(`Venda registrada com sucesso! Barraca: ${nomeBarraca}, Valor: R$ ${valorVenda}`);

        // Atualiza o total de vendas da barraca
        atualizarTotalVendas(nomeBarraca);

        setNomeBarraca('');
        setValorVenda('');
        setContador(120); // Inicializa o contador para 2 minutos

        let currentIndex = 0;

        // Função para atualizar o QR Code a cada 2 minutos
        const changeQRCode = () => {
          if (currentIndex < qrCodes.length) {
            setCurrentQRCodeIndex(currentIndex); // Atualiza o índice do QR Code ativo
            setContador(120); // Reset o contador para 2 minutos para o próximo QR Code
            currentIndex += 1;
          } else {
            setQrCodeAtivo(false); // Nenhum QR Code mais
          }
        };

        // Intervalo de troca de QR Code a cada 2 minutos
        const timerInterval = setInterval(() => {
          if (contador === 0) {
            changeQRCode();
          } else {
            setContador((prev) => prev - 1); // Atualiza o contador a cada segundo
          }
        }, 1000);

        return () => clearInterval(timerInterval); // Limpa o intervalo quando o componente for desmontado

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
      const vendas = await obterVendasPorBarraca(barraca); // Obtém as vendas da barraca
      const total = vendas.reduce((soma, venda) => soma + venda.valor, 0); // Soma os valores das vendas
      setTotalVendasBarraca(total);
    } catch (e) {
      console.error('Erro ao atualizar o total de vendas:', e);
    }
  };

  // Efeito para gerenciar o tempo do contador e troca dos QR Codes
  useEffect(() => {
    if (qrCodeAtivo && contador > 0) {
      const timer = setTimeout(() => setContador(contador - 1), 1000);
      return () => clearTimeout(timer);
    } else if (contador === 0 && qrCodes.length > 0) {
      // Quando o contador chegar a 0, troca para o próximo QR Code
      if (currentQRCodeIndex < qrCodes.length - 1) {
        setCurrentQRCodeIndex((prevIndex) => prevIndex + 1);
        setContador(120); // Reset o contador para 2 minutos
      } else {
        setQrCodeAtivo(false); // Se não houver mais QR Codes, encerra
      }
    }
  }, [contador, qrCodeAtivo, currentQRCodeIndex, qrCodes.length]);

  // Efeito para atualizar as vendas ao alterar o nome da barraca
  useEffect(() => {
    if (nomeBarraca.trim() !== '') {
      // Quando o nome da barraca for alterado, atualiza o total de vendas
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

      {qrCodeAtivo && qrCodes.length > 0 && (
        <div className="qrCodeContainer">
          <span className="qrCodeLabel">QR Code para a venda:</span>
          <QRCodeSVG value={qrCodes[currentQRCodeIndex]} size={128} />
          <p className="contador">Expira em: {contador}s</p>
        </div>
      )}
    </div>
  );
};

export default TelaVendedores;