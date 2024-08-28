import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/homepage.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/card';

function HomePage() {
  const navigate = useNavigate();

  const handleEnterClick = () => {
    navigate('/main');
  };

  return (
      <div className='home-page'>
        <div className='logo-container'>
          <img src={require('../img/logo.png')} alt='Logo Explora Manaus' className='logo'/>
        </div>
      <div className='content-container'>
        <div className='welcome-container'>
          <h1 className='display-3 mb-4 animated-text'>
            Bem vindo(a) ao Explora Manaus!!
          </h1>
          <Button onClick={handleEnterClick} className='custom-button' size='lg'>
            Entrar
          </Button>
        </div>
        <Card className='info-card'>
        <Card.Header className="card-header">
          <Card.Title>Explora Manaus</Card.Title>
          </Card.Header>
          <Card.Img variant="top" src={require('../img/card-manaus.png')} alt="Mapa de Manaus"/>
         <Card.Body>
            <Card.Text>
              Este site é uma ferramenta que ajuda os usuarios a compartilhar locais, eventos, shows e tudo que acontece na cidade de manaus
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default HomePage;
