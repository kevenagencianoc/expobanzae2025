import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { adicionarInscricao, isTokenUsado } from '../utils/firebaseConfig';
import './TelaFormularioCliente.css';
import logo from '../assets/logobranca.png';
import ProtectedRoute from '../components/ProtectedRoute';

const TelaFormularioCliente = () => {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [email, setEmail] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  // estados de verificação do token
  const [carregandoToken, setCarregandoToken] = useState(true);
  const [tokenValido, setTokenValido] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Lê o token da URL (ex: .../formulario-cliente?token=123456)
  const token = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('token');
  }, [location.search]);

  // Verifica token ao entrar na página
  useEffect(() => {
    const checar = async () => {
      setCarregandoToken(true);
      const usado = await isTokenUsado(token);
      setTokenValido(!usado); // válido = não usado
      setCarregandoToken(false);
    };
    checar();
  }, [token]);

  const enviarFormulario = async (e) => {
    e.preventDefault();

    // Dupla verificação no envio (evita race conditions)
    const usadoAgora = await isTokenUsado(token);
    if (usadoAgora) {
      // Token já foi utilizado — redireciona para obrigado com status
      return navigate('/obrigado?status=ja-usado', { replace: true });
    }

    const dadosInscricao = {
      nomeCompleto,
      telefone,
      endereco,
      email,
      token, // 🔒 salva o token junto
    };

    try {
      await adicionarInscricao(dadosInscricao);
      setMensagemSucesso('Inscrição realizada com sucesso!');
      setNomeCompleto('');
      setTelefone('');
      setEndereco('');
      setEmail('');

      // Redireciona e substitui o histórico (dificulta "voltar")
      navigate('/obrigado?status=ok', { replace: true });
    } catch (error) {
      console.error('Erro ao enviar inscrição:', error);
      setMensagemSucesso('Erro ao realizar a inscrição. Tente novamente.');
    }
  };

  // Estados de interface para o token
  const renderBloqueioToken = () => (
    <div className="form-container">
      <img src={logo} alt="Logo do Evento" className="logo" />
      <h1 className="title">Cadastro para o Sorteio</h1>
      <p className="description">
        ⚠️ Este QR Code já foi utilizado para participar do sorteio.<br/>
        Para participar novamente, realize novas compras no evento e solicite um novo QR Code.
      </p>
    </div>
  );

  const renderCarregando = () => (
    <div className="form-container">
      <img src={logo} alt="Logo do Evento" className="logo" />
      <h1 className="title">Validando acesso…</h1>
      <p className="description">Aguarde um instante.</p>
    </div>
  );

  return (
    <ProtectedRoute type="formulario">
      {carregandoToken
        ? renderCarregando()
        : (!tokenValido
            ? renderBloqueioToken()
            : (
              <div className="form-container">
                <img src={logo} alt="Logo do Evento" className="logo" />
                <h1 className="title">Cadastro para o Sorteio</h1>
                <p className="descriptioncli">
                  Preencha o formulário abaixo para participar do sorteio.<br />
                  Certifique-se de que todas as informações estão corretas.
                </p>
                <form className="form" onSubmit={enviarFormulario}>
                  <input 
                    type="text" 
                    placeholder="Nome Completo" 
                    value={nomeCompleto} 
                    onChange={(e) => setNomeCompleto(e.target.value)} 
                    required 
                  />
                  <input 
                    type="tel" 
                    placeholder="Telefone" 
                    value={telefone} 
                    onChange={(e) => setTelefone(e.target.value)} 
                    required 
                  />
                  <input 
                    type="text" 
                    placeholder="Endereço" 
                    value={endereco} 
                    onChange={(e) => setEndereco(e.target.value)} 
                    required 
                  />
                  <input 
                    type="email" 
                    placeholder="E-mail" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                  <button type="submit">Cadastrar</button>
                </form>

                {mensagemSucesso && <p className="mensagemSucesso">{mensagemSucesso}</p>}
              </div>
            )
          )
      }
    </ProtectedRoute>
  );
};

export default TelaFormularioCliente;
