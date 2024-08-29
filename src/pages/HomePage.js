import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/homepage.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function HomePage() {
  const moreInfoRef = useRef(null);
  const navigate = useNavigate();

  const handleScrollClick = () => {
    if (moreInfoRef.current) {
      moreInfoRef.current.style.display = 'block';
      moreInfoRef.current.scrollIntoView({ behavior: 'smooth' });
    }
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
              Bem vindo(a) ao Explora Manaus!!
            </h1>
            <p className='site-description'>
              Explora Manaus é uma plataforma que permite usuários compartilharem eventos, locais e tudo o que acontece na cidade de Manaus.
            </p>
            <Button onClick={handleScrollClick} className="custom-button-transparent">
              Saber Mais
            </Button>
          </div>
        </div>
        
        <div className="right-container">
          <div className='overlay'>
            <Form className="login-form">
              <Form.Group controlId='formBasicEmail'>
                <Form.Label>Email</Form.Label>
                <Form.Control type='email' placeholder='Insira seu email...' />
              </Form.Group>

              <Form.Group controlId='formBasicPassword' className='mt-3'>
                <Form.Label>Senha</Form.Label>
                <Form.Control type='password' placeholder='Insira sua senha...' />
              </Form.Group>
              
              <Button variant='primary' type='submit' className="mt-4 custom-button">
                Login / Criar Conta
              </Button>

              <Button onClick={() => navigate('/main')} variant="secondary" className='nt-2 custom-button'>
                Entrar sem conta
              </Button>
            </Form>
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