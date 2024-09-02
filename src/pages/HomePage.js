import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/homepage.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

function HomePage() {
  const moreInfoRef = useRef(null);
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); // Estado para alternar entre login e criação de conta

  const handleScrollClick = () => {
    if (moreInfoRef.current) {
      moreInfoRef.current.style.display = 'block';
      moreInfoRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateToAboutPage = () => {
    navigate('/about');
  };

  // Função genérica para renderizar o Tooltip com texto personalizado
  const renderTooltip = (text) => (props) => (
    <Tooltip id={`tooltip-${text}`} {...props}>
      {text}
    </Tooltip>
  );

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="home-page">
      <div className="top-section">
        <div className="left-container">
          <div className="logo-container">
            <img src={require('../img/logo.png')} alt="Logo Explora Manaus" className="logo" />
          </div>
          <div className="welcome-container">
            <h1 className="display-3 mb-4 animated-text">
              Bem vindo(a) ao Explora Manaus!
            </h1>
            <p className='site-description'>
              Explora Manaus é uma plataforma que permite usuários compartilharem eventos, locais e tudo o que acontece na cidade de Manaus.
            </p>
            <div className='button-group'>
              <Button onClick={handleScrollClick} className="custom-button-transparent">
                Saber Mais
              </Button>
              <Button onClick={navigateToAboutPage} className='custom-button-transparent'>
                Sobre o Projeto
              </Button>
            </div>
          </div>
        </div>
        
        <div className="right-container">
          <div className='overlay'>
            <div className={`form-container ${isLogin ? 'login-form' : 'signup-form'}`}>
              {/* Exibe o formulário de Login */}
              {isLogin ? (
                <Form className="form-content">
                  <Form.Group controlId='formBasicEmail'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type='email' placeholder='Insira seu email...' />
                  </Form.Group>

                  <Form.Group controlId='formBasicPassword' className='mt-3'>
                    <Form.Label>Senha</Form.Label>
                    <Form.Control type='password' placeholder='Insira sua senha...' />
                  </Form.Group>

                  <OverlayTrigger placement="bottom" overlay={renderTooltip('Faça login em sua conta.')}>
                    <Button variant='primary' type='submit' className="mt-4 custom-button">
                      Login
                    </Button>
                  </OverlayTrigger>
                </Form>
              ) : (
                // Exibe o formulário de Criação de Conta
                <Form className="form-content">
                  <Form.Group controlId='formBasicName'>
                    <Form.Label>Nome</Form.Label>
                    <Form.Control type='text' placeholder='Insira seu nome...' />
                  </Form.Group>

                  <Form.Group controlId='formBasicEmail' className='mt-3'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type='email' placeholder='Insira seu email...' />
                  </Form.Group>

                  <Form.Group controlId='formBasicPassword' className='mt-3'>
                    <Form.Label>Senha</Form.Label>
                    <Form.Control type='password' placeholder='Insira sua senha...' />
                  </Form.Group>

                  <Form.Group controlId='formBasicConfirmPassword' className='mt-3'>
                    <Form.Label>Confirmar Senha</Form.Label>
                    <Form.Control type='password' placeholder='Confirme sua senha...' />
                  </Form.Group>

                  <Form.Group controlId='formBasicPhone' className='mt-3'>
                    <Form.Label>Número de Celular</Form.Label>
                    <Form.Control type='tel' placeholder='Insira seu número de celular...' />
                  </Form.Group>

                  <OverlayTrigger placement="bottom" overlay={renderTooltip('Crie sua conta.')}>
                    <Button variant='primary' type='submit' className="mt-4 custom-button">
                      Criar Conta
                    </Button>
                  </OverlayTrigger>
                </Form>
              )}

              <div className="button-switch">
                <Button
                  onClick={() => setIsLogin(true)}
                  className={`switch-button ${isLogin ? 'active' : ''}`}>
                  Login
                </Button>
                <Button
                  onClick={toggleForm}
                  className={`switch-button ${!isLogin ? 'active' : ''}`}>
                  Criar Conta
                </Button>
              </div>

              {/* Botão para entrar sem conta */}
              {isLogin && (
                <OverlayTrigger placement="bottom" overlay={renderTooltip('Entre sem criar uma conta.')}>
                  <Button onClick={() => navigate('/main')} variant="secondary" className='mt-2 custom-button'>
                    Entrar sem conta
                  </Button>
                </OverlayTrigger>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='more-info-section' ref={moreInfoRef}>
        <h2 className='info-title'>Sobre o Site</h2>
        <p className='info-content'>
          Manaus é a capital do estado do Amazonas, localizada no coração da floresta amazônica.
          Conhecida por sua rica cultura, biodiversidade e eventos históricos, é um ponto turístico 
          e econômico crucial na região Norte do Brasil. Explore os melhores pontos da cidade e conheça 
          mais sobre seus eventos, cultura e locais icônicos através de nossa plataforma.
        </p>
      </div>
    </div>
  );
}

export default HomePage;
